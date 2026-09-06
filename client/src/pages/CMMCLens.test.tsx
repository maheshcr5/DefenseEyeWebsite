import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>DefenseEye footer</footer> }));

const tracking = vi.hoisted(() => ({
  trackConversion: vi.fn(),
}));
vi.mock("@/lib/tracking", () => tracking);

import CMMCLens, {
  hasCmmcLensAnalyticsConsent,
  trackCmmcLensBriefingClick,
  trackCmmcLensMarketplaceClick,
} from "./CMMCLens";

const OLD_CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";
const BOOKING_URL = "https://cal.com/defenseeye/cmmclens";
const DIRECT_MARKETPLACE_URL =
  "https://marketplace.microsoft.com/en-us/product/cmmc.defenseeye-cmmc-l2-continuous-compliance?tab=Overview";
const GENERIC_SEARCH_URL = "https://marketplace.microsoft.com/en-us/search?search=CMMCLens";
const PRIMARY_CTA_LABEL = "Book a 30-Minute CMMCLens Briefing";
const SECONDARY_CTA_LABEL = "View CMMCLens on Microsoft Marketplace";

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
  };
}

function acceptedAnalyticsConsent() {
  return JSON.stringify({
    status: "accepted",
    version: 2,
    purposes: { analytics: true, openaiAdsMeasurement: true },
    updatedAt: "2026-09-05T00:00:00.000Z",
  });
}

function essentialOnlyConsent() {
  return JSON.stringify({
    status: "accepted",
    version: 2,
    purposes: { analytics: false, openaiAdsMeasurement: false },
    updatedAt: "2026-09-05T00:00:00.000Z",
  });
}

function declinedConsent() {
  return JSON.stringify({
    status: "declined",
    version: 2,
    purposes: { analytics: false, openaiAdsMeasurement: false },
    updatedAt: "2026-09-05T00:00:00.000Z",
  });
}

function revokedConsent() {
  return JSON.stringify({
    status: "revoked",
    version: 2,
    purposes: { analytics: false, openaiAdsMeasurement: false },
    updatedAt: "2026-09-05T00:00:00.000Z",
  });
}

function legacyUnversionedConsent() {
  return JSON.stringify({ analytics: true });
}

function installGa4Window(consent?: string) {
  const localStorage = createStorage();
  if (consent) localStorage.setItem("de_cookie_consent", consent);
  const gtag = vi.fn();
  vi.stubGlobal("window", {
    __gaId: "G-H22Q6LRNWC",
    gtag,
    localStorage,
    location: { pathname: "/cmmclens" },
  });
  return { gtag, localStorage };
}

function installGa4WindowWithoutGtag(consent?: string) {
  const localStorage = createStorage();
  if (consent) localStorage.setItem("de_cookie_consent", consent);
  vi.stubGlobal("window", {
    __gaId: "G-H22Q6LRNWC",
    localStorage,
    location: { pathname: "/cmmclens" },
  });
  return { localStorage };
}

describe("CMMCLens page booking and Marketplace CTAs", () => {
  const html = renderToStaticMarkup(<CMMCLens />);

  it("does not reference the outdated Calendly booking URL anywhere on the page", () => {
    expect(html).not.toContain(OLD_CALENDLY_URL);
    expect(html).not.toContain("calendly.com");
  });

  it("links both booking CTAs to the same Cal.com CMMCLens URL", () => {
    const bookingLinkCount = html.match(/href="https:\/\/cal\.com\/defenseeye\/cmmclens"/g)?.length ?? 0;
    expect(bookingLinkCount).toBe(2);
  });

  it("uses the exact required label on both the hero and closing booking CTAs", () => {
    const labelCount = html.match(new RegExp(PRIMARY_CTA_LABEL, "g"))?.length ?? 0;
    expect(labelCount).toBe(2);
    expect(html).not.toContain("Request CMMCLens Briefing");
    expect(html).not.toMatch(/Book a CMMCLens Briefing(?! <)/);
    expect(html).not.toContain(">Book a CMMCLens Briefing<");
  });

  it("does not reference the generic Marketplace search URL anywhere", () => {
    expect(html).not.toContain(GENERIC_SEARCH_URL);
    expect(html).not.toContain("search=CMMCLens");
  });

  it("keeps the direct Marketplace product URL and label unchanged", () => {
    expect(html).toContain(`href="${DIRECT_MARKETPLACE_URL}"`);
    expect(html).toContain(SECONDARY_CTA_LABEL);
    expect(html).not.toContain("Microsoft Marketplace Listing");
  });

  it("keeps the booking CTA before the Marketplace CTA, in the same hero button group", () => {
    const briefingIndex = html.indexOf(PRIMARY_CTA_LABEL);
    const marketplaceIndex = html.indexOf(SECONDARY_CTA_LABEL);
    expect(briefingIndex).toBeGreaterThan(-1);
    expect(marketplaceIndex).toBeGreaterThan(-1);
    expect(briefingIndex).toBeLessThan(marketplaceIndex);
  });

  it("keeps the booking CTA styled as the primary (filled accent) action and Marketplace as secondary (outline)", () => {
    const briefingAnchorMatch = html.match(
      /<a[^>]*href="[^"]*cal\.com[^"]*"[^>]*>\s*<button[^>]*class="([^"]*)"[^>]*>\s*Book a 30-Minute CMMCLens Briefing/
    );
    const marketplaceAnchorMatch = html.match(
      /<a[^>]*href="[^"]*marketplace\.microsoft\.com[^"]*"[^>]*>\s*<button[^>]*class="([^"]*)"[^>]*>\s*View CMMCLens on Microsoft Marketplace/
    );
    expect(briefingAnchorMatch?.[1]).toContain("bg-accent");
    expect(marketplaceAnchorMatch?.[1]).toContain("border-primary/40");
    expect(marketplaceAnchorMatch?.[1]).not.toContain("bg-accent");
  });

  it("opens both booking links safely in a new tab", () => {
    const matches = [...html.matchAll(/<a[^>]*href="(https:\/\/cal\.com[^"]*)"([^>]*)>/g)];
    expect(matches).toHaveLength(2);
    for (const match of matches) {
      expect(match[1]).toBe(BOOKING_URL);
      expect(match[2]).toContain('target="_blank"');
      expect(match[2]).toContain('rel="noopener noreferrer"');
    }
  });

  it("opens the Marketplace link safely in a new tab", () => {
    const marketplaceLinkMatch = html.match(
      /<a[^>]*href="(https:\/\/marketplace\.microsoft\.com[^"]*)"([^>]*)>/
    );
    expect(marketplaceLinkMatch).not.toBeNull();
    expect(marketplaceLinkMatch![1]).toBe(DIRECT_MARKETPLACE_URL);
    expect(marketplaceLinkMatch![2]).toContain('target="_blank"');
    expect(marketplaceLinkMatch![2]).toContain('rel="noopener noreferrer"');
  });

  it("does not add tracking parameters or customer info to the Cal.com URL", () => {
    expect(html).not.toMatch(/cal\.com\/defenseeye\/cmmclens[^"]*[?&]/);
  });

  it("does not add tracking parameters to the Marketplace URL", () => {
    expect(html).not.toMatch(/marketplace\.microsoft\.com[^"]*[?&](utm_|ref=|source=)/);
  });
});

describe("Obsolete Calendly constant fully retired", () => {
  it("no longer exports the obsolete CALENDLY_URL from shared company data", async () => {
    const companyFacts = await import("@/data/companyFacts");
    expect((companyFacts as Record<string, unknown>).CALENDLY_URL).toBeUndefined();
  });

  it("exports a CMMCLens-specific booking constant used only by the CMMCLens page", async () => {
    const { CMMCLENS_BOOKING_URL } = await import("@/data/companyFacts");
    expect(CMMCLENS_BOOKING_URL).toBe("https://cal.com/defenseeye/cmmclens");
  });
});

describe("CMMCLens GA4 buyer-intent click measurement", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("does not fire any event merely from rendering the page", () => {
    const { gtag } = installGa4Window(acceptedAnalyticsConsent());
    renderToStaticMarkup(<CMMCLens />);
    expect(gtag).not.toHaveBeenCalled();
  });

  it("fires cmmclens_briefing_click exactly once for the hero CTA with the correct location", () => {
    const { gtag } = installGa4Window(acceptedAnalyticsConsent());

    trackCmmcLensBriefingClick("hero");

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "cmmclens_briefing_click", {
      cta_location: "hero",
      page_path: "/cmmclens",
    });
  });

  it("fires cmmclens_briefing_click exactly once for the closing CTA with the correct location", () => {
    const { gtag } = installGa4Window(acceptedAnalyticsConsent());

    trackCmmcLensBriefingClick("closing");

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "cmmclens_briefing_click", {
      cta_location: "closing",
      page_path: "/cmmclens",
    });
  });

  it("fires cmmclens_marketplace_click exactly once with the correct location", () => {
    const { gtag } = installGa4Window(acceptedAnalyticsConsent());

    trackCmmcLensMarketplaceClick();

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "cmmclens_marketplace_click", {
      cta_location: "hero",
      page_path: "/cmmclens",
    });
  });

  it("does not suppress a later legitimate second click", () => {
    const { gtag } = installGa4Window(acceptedAnalyticsConsent());

    trackCmmcLensBriefingClick("hero");
    trackCmmcLensBriefingClick("hero");

    expect(gtag).toHaveBeenCalledTimes(2);
  });

  it("does not fire either event when consent is absent", () => {
    const { gtag } = installGa4Window(undefined);
    expect(hasCmmcLensAnalyticsConsent()).toBe(false);

    trackCmmcLensBriefingClick("hero");
    trackCmmcLensMarketplaceClick();

    expect(gtag).not.toHaveBeenCalled();
  });

  it("does not fire either event when consent is Essential Only", () => {
    const { gtag } = installGa4Window(essentialOnlyConsent());
    expect(hasCmmcLensAnalyticsConsent()).toBe(false);

    trackCmmcLensBriefingClick("hero");
    trackCmmcLensMarketplaceClick();

    expect(gtag).not.toHaveBeenCalled();
  });

  it("does not fire either event when consent is declined", () => {
    const { gtag } = installGa4Window(declinedConsent());
    expect(hasCmmcLensAnalyticsConsent()).toBe(false);

    trackCmmcLensBriefingClick("hero");
    trackCmmcLensMarketplaceClick();

    expect(gtag).not.toHaveBeenCalled();
  });

  it("does not fire either event when consent has been revoked", () => {
    const { gtag } = installGa4Window(revokedConsent());
    expect(hasCmmcLensAnalyticsConsent()).toBe(false);

    trackCmmcLensBriefingClick("closing");
    trackCmmcLensMarketplaceClick();

    expect(gtag).not.toHaveBeenCalled();
  });

  it("does not fire either event for legacy/unversioned consent records", () => {
    const { gtag } = installGa4Window(legacyUnversionedConsent());
    expect(hasCmmcLensAnalyticsConsent()).toBe(false);

    trackCmmcLensBriefingClick("hero");
    trackCmmcLensMarketplaceClick();

    expect(gtag).not.toHaveBeenCalled();
  });

  it("does not throw when window.gtag is unavailable", () => {
    installGa4WindowWithoutGtag(acceptedAnalyticsConsent());

    expect(() => trackCmmcLensBriefingClick("hero")).not.toThrow();
    expect(() => trackCmmcLensMarketplaceClick()).not.toThrow();
  });

  it("includes only cta_location and page_path, with no personal or customer-entered fields", () => {
    const { gtag } = installGa4Window(acceptedAnalyticsConsent());

    trackCmmcLensBriefingClick("hero");
    trackCmmcLensMarketplaceClick();

    for (const call of gtag.mock.calls) {
      const params = call[2] as Record<string, unknown>;
      expect(Object.keys(params).sort()).toEqual(["cta_location", "page_path"]);
    }

    const payload = JSON.stringify(gtag.mock.calls);
    expect(payload).not.toMatch(/name|email|company|phone|ip|booking|notes|calendar|referrer|utm_|campaign|oppref/i);
  });

  it("never fires lead_created, secure_ai_form_submit_success, or a booking-success event from either CTA", () => {
    const { gtag } = installGa4Window(acceptedAnalyticsConsent());

    trackCmmcLensBriefingClick("hero");
    trackCmmcLensBriefingClick("closing");
    trackCmmcLensMarketplaceClick();

    const eventNames = gtag.mock.calls.map((call) => call[1]);
    expect(eventNames).not.toContain("lead_created");
    expect(eventNames).not.toContain("secure_ai_form_submit_success");
    expect(eventNames).not.toContain("cmmclens_booking_success");
    expect(tracking.trackConversion).not.toHaveBeenCalledWith("lead_created", expect.anything());
  });
});
