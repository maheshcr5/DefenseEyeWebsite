import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  canUseOpenAiAdsMeasurement,
  getMeasurementConsent,
  isOpenAiAdsDebugEnabled,
  loadOpenAiAdsPixelIfConsented,
  reportOpenAiAdsLeadCreated,
  setMeasurementConsent,
  shouldShowConsentBanner,
} from "./openaiAds";

const CONSENT_KEY = "de_cookie_consent";
const SDK_URL = "https://bzrcdn.openai.com/sdk/oaiq.min.js";

type FakeElement = {
  id?: string;
  async?: boolean;
  src?: string;
};

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    removeItem: vi.fn((key: string) => values.delete(key)),
    clear: vi.fn(() => values.clear()),
  };
}

function installBrowser() {
  const scripts: FakeElement[] = [];
  const storage = createStorage();
  const document = {
    createElement: vi.fn(() => ({} as FakeElement)),
    getElementById: vi.fn((id: string) => scripts.find((script) => script.id === id) ?? null),
    head: {
      appendChild: vi.fn((element: FakeElement) => {
        scripts.push(element);
        return element;
      }),
    },
  };
  const window = {
    localStorage: storage,
    location: { hostname: "defenseeye.ai" },
    dispatchEvent: vi.fn(),
  };

  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  return { document, scripts, storage, window };
}

function setStoredConsent(status: "accepted" | "declined") {
  window.localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({
      status,
      version: 2,
      purposes: {
        analytics: status === "accepted",
        openaiAdsMeasurement: status === "accepted",
      },
      updatedAt: "2026-08-29T00:00:00.000Z",
    })
  );
}

describe("OpenAI Ads Pixel consent gating", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    installBrowser();
  });

  it("does not load the Pixel when consent is unset", () => {
    expect(getMeasurementConsent()).toBeNull();
    expect(shouldShowConsentBanner()).toBe(true);
    expect(loadOpenAiAdsPixelIfConsented()).toBe(false);
    expect(document.head.appendChild).not.toHaveBeenCalled();
    expect(window.oaiq).toBeUndefined();
  });

  it("treats legacy accepted consent as unset for OpenAI Ads measurement", () => {
    window.localStorage.setItem(CONSENT_KEY, "accepted");

    expect(getMeasurementConsent()).toBeNull();
    expect(shouldShowConsentBanner()).toBe(true);
    expect(loadOpenAiAdsPixelIfConsented()).toBe(false);
    expect(document.head.appendChild).not.toHaveBeenCalled();
  });

  it("does not load the Pixel when consent is rejected", () => {
    setStoredConsent("declined");

    expect(getMeasurementConsent()).toBe("declined");
    expect(loadOpenAiAdsPixelIfConsented()).toBe(false);
    expect(document.head.appendChild).not.toHaveBeenCalled();
    expect(window.oaiq).toBeUndefined();
  });

  it("loads and initializes the Pixel once when current consent is accepted", () => {
    const { scripts } = installBrowser();
    setMeasurementConsent("accepted");

    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toMatchObject({
      id: "openai-ads-measurement-sdk",
      async: true,
      src: SDK_URL,
    });
    expect(window.oaiq?.q).toEqual([
      ["consent", true],
      ["init", { pixelId: "RfmMBNhDLXgfHCoWA9pQSA" }],
    ]);
    expect(canUseOpenAiAdsMeasurement()).toBe(true);
  });

  it("does not duplicate SDK injection or initialization during rerenders or SPA navigation", () => {
    const { scripts } = installBrowser();
    setStoredConsent("accepted");

    loadOpenAiAdsPixelIfConsented();
    loadOpenAiAdsPixelIfConsented();
    loadOpenAiAdsPixelIfConsented();

    expect(scripts).toHaveLength(1);
    expect(window.oaiq?.q?.filter((entry) => entry[0] === "init")).toHaveLength(1);
  });

  it("disables future measurement when consent is revoked after initialization", () => {
    setMeasurementConsent("accepted");
    setMeasurementConsent("declined");

    expect(getMeasurementConsent()).toBe("declined");
    expect(canUseOpenAiAdsMeasurement()).toBe(false);
    expect(window.oaiq?.q?.at(-1)).toEqual(["consent", false]);
    expect(loadOpenAiAdsPixelIfConsented()).toBe(false);
  });

  it("keeps debug disabled for production builds", () => {
    expect(isOpenAiAdsDebugEnabled("production", "defenseeye.ai")).toBe(false);
  });

  it("enables debug in development or staging only", () => {
    expect(isOpenAiAdsDebugEnabled("development", "localhost")).toBe(true);
    expect(isOpenAiAdsDebugEnabled("staging", "staging.defenseeye.ai")).toBe(true);
    expect(isOpenAiAdsDebugEnabled("test", "defenseeye.ai")).toBe(false);
  });

  it("queues lead_created with only the standard customer action payload", () => {
    setMeasurementConsent("accepted");

    expect(reportOpenAiAdsLeadCreated()).toBe(true);
    expect(window.oaiq?.q?.at(-1)).toEqual(["measure", "lead_created", { type: "customer_action" }]);
  });

  it("does not report lead_created when the Pixel is missing or disabled", () => {
    setStoredConsent("accepted");

    expect(reportOpenAiAdsLeadCreated()).toBe(false);
    expect(window.oaiq).toBeUndefined();
  });

  it("does not report lead_created when consent is unset", () => {
    expect(reportOpenAiAdsLeadCreated()).toBe(false);
    expect(window.oaiq).toBeUndefined();
  });

  it("does not report lead_created when consent is declined", () => {
    setMeasurementConsent("accepted");
    setMeasurementConsent("declined");

    expect(reportOpenAiAdsLeadCreated()).toBe(false);
    expect(window.oaiq?.q?.filter((entry) => entry[0] === "measure")).toHaveLength(0);
  });

  it("isolates SDK measurement errors", () => {
    setMeasurementConsent("accepted");
    window.oaiq = vi.fn(() => {
      throw new Error("SDK failed");
    });

    expect(reportOpenAiAdsLeadCreated()).toBe(false);
  });
});
