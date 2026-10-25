import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const CONSENT_KEY = "de_cookie_consent";
const NEW_MEASUREMENT_ID = "G-H22Q6LRNWC";
const OLD_MEASUREMENT_ID = ["G", "KTK7M073CH"].join("-");

type FakeElement = {
  async?: boolean;
  src?: string;
  attributes: Record<string, string>;
  setAttribute: (name: string, value: string) => void;
};

const GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${NEW_MEASUREMENT_ID}`;
const AHREFS_SRC = "https://analytics.ahrefs.com/analytics.js";
const scriptsBySrc = (appended: FakeElement[], src: string) => appended.filter((element) => element.src === src);

function createStorage(initial?: string) {
  const values = new Map<string, string>();
  if (initial !== undefined) values.set(CONSENT_KEY, initial);
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
  };
}

function analyticsScriptFromIndex(measurementId = NEW_MEASUREMENT_ID) {
  const html = readFileSync(path.resolve(process.cwd(), "client/index.html"), "utf8");
  const match = html.match(/<!-- Google Analytics 4[\s\S]*?<script>([\s\S]*?)<\/script>/);
  if (!match) throw new Error("Optional-analytics inline script not found");
  return match[1].replace("%VITE_GA4_MEASUREMENT_ID%", measurementId);
}

function installBrowser(consent?: string, url = "https://defenseeye.ai/secure-ai-adoption?utm_source=openai&utm_medium=paid&utm_campaign=secure-ai") {
  const appended: FakeElement[] = [];
  const storage = createStorage(consent);
  const location = new URL(url);
  const document = {
    createElement: vi.fn(() => {
      const element: FakeElement = { attributes: {}, setAttribute: (name, value) => void (element.attributes[name] = value) };
      return element;
    }),
    head: {
      appendChild: vi.fn((element: FakeElement) => {
        appended.push(element);
        return element;
      }),
    },
  };
  const window = {
    location,
    dataLayer: undefined as unknown[] | undefined,
  };

  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  vi.stubGlobal("localStorage", storage);
  return { appended, document, storage, window };
}

function runGa4InlineScript(measurementId?: string) {
  new Function(analyticsScriptFromIndex(measurementId))();
}

function dataLayerCalls(window: { dataLayer?: unknown[] }) {
  return (window.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>));
}

function acceptedConsent() {
  return JSON.stringify({
    status: "accepted",
    version: 2,
    purposes: {
      analytics: true,
      openaiAdsMeasurement: true,
    },
    updatedAt: "2026-09-04T00:00:00.000Z",
  });
}

function declinedConsent() {
  return JSON.stringify({
    status: "declined",
    version: 2,
    purposes: {
      analytics: false,
      openaiAdsMeasurement: false,
    },
    updatedAt: "2026-09-04T00:00:00.000Z",
  });
}

describe("GA4 consent loader", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("initializes only the intended GA4 Measurement ID", () => {
    const { appended, window } = installBrowser(acceptedConsent());
    window.addEventListener = vi.fn((_event, callback) => callback());

    runGa4InlineScript();

    // A returning visitor with consent gets exactly one GA4 tag and one Ahrefs script.
    expect(appended).toHaveLength(2);
    expect(scriptsBySrc(appended, GTAG_SRC)).toHaveLength(1);
    expect(scriptsBySrc(appended, AHREFS_SRC)).toHaveLength(1);
    expect(JSON.stringify(window.dataLayer)).toContain(NEW_MEASUREMENT_ID);
    expect(JSON.stringify(window.dataLayer)).not.toContain(OLD_MEASUREMENT_ID);
  });

  it("does not contain the old GA4 Measurement ID in source or production bundles", () => {
    for (const file of ["client/index.html", "dist/public/index.html"]) {
      const contents = readFileSync(path.resolve(process.cwd(), file), "utf8");
      expect(contents).not.toContain(OLD_MEASUREMENT_ID);
    }
  });

  it("initializes once after analytics consent and records the landing URL with UTM parameters", () => {
    const { appended, window } = installBrowser(undefined);

    runGa4InlineScript();
    window.loadGA4();
    window.loadGA4();

    expect(appended).toHaveLength(1);
    const configs = dataLayerCalls(window).filter((entry) => entry[0] === "config");
    expect(configs).toHaveLength(1);
    expect(dataLayerCalls(window).at(-1)).toEqual([
      "config",
      NEW_MEASUREMENT_ID,
      {
        anonymize_ip: true,
        page_path: "/secure-ai-adoption?utm_source=openai&utm_medium=paid&utm_campaign=secure-ai",
        page_location: "https://defenseeye.ai/secure-ai-adoption?utm_source=openai&utm_medium=paid&utm_campaign=secure-ai",
      },
    ]);
  });

  it("does not load GA4 when consent is Essential Only, legacy accepted, declined, unset, or revoked", () => {
    for (const consent of [undefined, declinedConsent(), "accepted", "declined"]) {
      const { appended, window } = installBrowser(consent);
      window.addEventListener = vi.fn();

      runGa4InlineScript();

      expect(appended).toHaveLength(0);
      expect(window.gtag).toBeUndefined();
    }
  });

  it("does not load GA4 for consent saved under an older consent version", () => {
    const { appended, window } = installBrowser(JSON.stringify({ status: "accepted", version: 1, purposes: { analytics: true } }));
    window.addEventListener = vi.fn((_event, callback) => callback());

    runGa4InlineScript();

    expect(appended).toHaveLength(0);
    expect(window.gtag).toBeUndefined();
  });

  it("never loads gtag.js with an unresolved placeholder or malformed Measurement ID", () => {
    for (const id of ["%VITE_GA4_MEASUREMENT_ID%", "", "UA-12345-1", "G-XXXXX", "G-H22Q6LRNWC extra", "g-h22q6lrnwc"]) {
      const { appended, window } = installBrowser(undefined);
      runGa4InlineScript(id);
      window.loadGA4();
      expect(appended).toHaveLength(0);
      expect(window.gtag).toBeUndefined();
    }
  });

  it("deduplicates SPA route handling without sending duplicate manual page_view events", () => {
    const { window } = installBrowser(undefined, "https://defenseeye.ai/");

    runGa4InlineScript();
    window.loadGA4();
    window.trackGA4PageView("/");
    window.trackGA4PageView("/secure-ai-adoption");
    window.trackGA4PageView("/secure-ai-adoption");

    const configs = dataLayerCalls(window).filter((entry) => entry[0] === "config");

    expect(configs).toHaveLength(2);
    expect(configs.at(-1)).toEqual([
      "config",
      NEW_MEASUREMENT_ID,
      {
        update: true,
        anonymize_ip: true,
        page_path: "/secure-ai-adoption",
        page_location: "https://defenseeye.ai/secure-ai-adoption",
      },
    ]);
    expect(dataLayerCalls(window).filter((entry) => entry[0] === "event" && entry[1] === "page_view")).toHaveLength(0);
    expect(window.__gaLastPage).toBe("/secure-ai-adoption");
  });

  it("loads Ahrefs only after optional-analytics consent, once per page, with its site key", () => {
    const { appended, window } = installBrowser(undefined);
    runGa4InlineScript();
    expect(appended).toHaveLength(0);

    window.loadOptionalAnalytics();
    window.loadOptionalAnalytics();
    window.loadAhrefs();

    expect(scriptsBySrc(appended, GTAG_SRC)).toHaveLength(1);
    const ahrefs = scriptsBySrc(appended, AHREFS_SRC);
    expect(ahrefs).toHaveLength(1);
    expect(ahrefs[0].async).toBe(true);
    expect(ahrefs[0].attributes["data-key"]).toMatch(/^[A-Za-z0-9_-]{8,64}$/);
  });

  it("loads neither GA4 nor Ahrefs for Essential Only, dismissed, unset, legacy, or older consent", () => {
    const olderVersion = JSON.stringify({ status: "accepted", version: 1, purposes: { analytics: true } });
    for (const consent of [undefined, declinedConsent(), "accepted", "declined", olderVersion]) {
      const { appended, window } = installBrowser(consent);
      window.addEventListener = vi.fn((_event, callback) => callback());
      runGa4InlineScript();
      expect(appended).toHaveLength(0);
      expect(window.gtag).toBeUndefined();
    }
  });

  it("still loads Ahrefs after consent when the GA4 ID is unusable (independent loaders)", () => {
    const { appended, window } = installBrowser(undefined);
    runGa4InlineScript("%VITE_GA4_MEASUREMENT_ID%");
    window.loadOptionalAnalytics();
    expect(scriptsBySrc(appended, AHREFS_SRC)).toHaveLength(1);
    expect(appended.filter((element) => element.src?.includes("googletagmanager"))).toHaveLength(0);
  });
});

describe("third-party trackers in the page source", () => {
  const html = readFileSync(path.resolve(process.cwd(), "client/index.html"), "utf8");
  const VISITOR_ID_PATTERN = /leadsy|rb2b|reb2b|instantly|ddwl4m2hdecbv|cloudfront\.net/i;

  it("has no static third-party analytics script tags; optional analytics are injected only by the consent loader", () => {
    expect(html).not.toMatch(/<script[^>]+src=["']https:\/\/analytics\.ahrefs\.com/);
    expect(html).not.toMatch(/<script[^>]+src=["']https:\/\/www\.googletagmanager\.com/);
    expect(html.match(/analytics\.ahrefs\.com\/analytics\.js/g)).toHaveLength(1);
  });

  it("contains no Instantly/RB2B visitor-identification tracker in source or build output", () => {
    expect(html).not.toMatch(VISITOR_ID_PATTERN);
    const roots = ["client/src", "dist/public"].map((dir) => path.resolve(process.cwd(), dir)).filter((dir) => existsSync(dir));
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const file = path.join(dir, name);
        if (statSync(file).isDirectory()) walk(file);
        else if (/\.(html|js|mjs|ts|tsx|css|json)$/.test(name) && !name.endsWith(".test.ts") && VISITOR_ID_PATTERN.test(readFileSync(file, "utf8"))) offenders.push(path.relative(process.cwd(), file));
      }
    };
    roots.forEach(walk);
    expect(offenders).toEqual([]);
  });
});
