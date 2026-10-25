import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formIntentFromInquiryType,
  hasAnalyticsConsent,
  leadSourceFromAttribution,
  sanitizeGa4Params,
  sendGa4Event,
  trackCtaClick,
  trackFormStartOnce,
  trackLeadFormSubmit,
  trackNewsletterFallback,
} from "./analytics";
import { captureUtmParameters, getStoredAttribution, intentFromCtaContext, trackConversion } from "./tracking";

const GA_ID = "G-H22Q6LRNWC";

function createStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => void values.set(key, value)),
    removeItem: vi.fn((key: string) => void values.delete(key)),
  };
}

const consent = (overrides: Record<string, unknown> = {}) =>
  JSON.stringify({ status: "accepted", version: 2, purposes: { analytics: true, openaiAdsMeasurement: true }, updatedAt: "2026-10-24T00:00:00.000Z", ...overrides });

type Install = { consent?: string | null; gaId?: string | null; gtag?: boolean; url?: string; referrer?: string; session?: ReturnType<typeof createStorage>; local?: ReturnType<typeof createStorage> };

function install({ consent: consentValue = consent(), gaId = GA_ID, gtag = true, url = "https://defenseeye.ai/", referrer = "", session = createStorage(), local }: Install = {}) {
  const localStorage = local ?? createStorage(consentValue === null ? {} : { de_cookie_consent: consentValue });
  const gtagMock = vi.fn();
  const dataLayer: unknown[] = [];
  const { pathname, search, hostname } = new URL(url);
  const dispatchEvent = vi.fn();
  vi.stubGlobal("window", {
    location: { pathname, search, hostname },
    localStorage,
    sessionStorage: session,
    dispatchEvent,
    dataLayer,
    ...(gaId === null ? {} : { __gaId: gaId }),
    ...(gtag ? { gtag: gtagMock } : {}),
  });
  vi.stubGlobal("document", { referrer });
  vi.stubGlobal("sessionStorage", session);
  vi.stubGlobal("localStorage", localStorage);
  vi.stubGlobal("CustomEvent", class { constructor(public type: string, public init?: unknown) {} });
  return { gtag: gtagMock, dataLayer, dispatchEvent, session, localStorage };
}

const events = (gtag: ReturnType<typeof vi.fn>) => gtag.mock.calls.map((call) => [call[1], call[2]] as [string, Record<string, unknown>]);

describe("GA4 consent and configuration gate", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("sends to the configured production Measurement ID once consent is granted", () => {
    const { gtag } = install();
    expect(sendGa4Event("cta_click", { cta_name: "x", cta_location: "y" })).toBe(true);
    expect(gtag).toHaveBeenCalledWith("event", "cta_click", { cta_name: "x", cta_location: "y", send_to: GA_ID });
  });

  it("sends nothing when consent is denied, Essential Only, unset, legacy, or an older version", () => {
    const denied = [
      consent({ status: "declined", purposes: { analytics: false, openaiAdsMeasurement: false } }),
      consent({ purposes: { analytics: false, openaiAdsMeasurement: false } }),
      consent({ version: 1 }),
      "accepted",
      "not json",
      null,
    ];
    for (const value of denied) {
      const { gtag } = install({ consent: value });
      expect(hasAnalyticsConsent()).toBe(false);
      trackCtaClick({ name: "consultation", location: "home_hero" });
      trackFormStartOnce({ current: false }, "contact_page");
      trackLeadFormSubmit("contact_page", "cmmc_readiness", {});
      trackNewsletterFallback("blog");
      expect(gtag).not.toHaveBeenCalled();
    }
  });

  it("sends nothing and does not throw before gtag.js has loaded or without a valid ID", () => {
    for (const setup of [{ gtag: false }, { gaId: null }, { gaId: "%VITE_GA4_MEASUREMENT_ID%" }, { gaId: "UA-12345-1" }, { gaId: "" }] as Install[]) {
      const { gtag } = install(setup);
      expect(() => trackCtaClick({ name: "consultation", location: "home_hero" })).not.toThrow();
      expect(gtag).not.toHaveBeenCalled();
    }
  });
});

describe("personal data never reaches GA4", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("drops non-allowlisted keys and values that look like emails or phone numbers", () => {
    expect(
      sanitizeGa4Params({
        cta_name: "consultation",
        email: "ada@example.com",
        firstName: "Ada",
        message: "Call me",
        company: "Example Co",
        lead_source: "ada@example.com",
        lead_campaign: "call 555-010-0199 now",
        audience: "Defense suppliers preparing for CMMC",
        page_path: "/contact",
      })
    ).toEqual({ cta_name: "consultation", audience: "Defense suppliers preparing for CMMC", page_path: "/contact" });
  });

  it("truncates long values and ignores objects", () => {
    const clean = sanitizeGa4Params({ cta_name: "x".repeat(300), intent: { nested: true } });
    expect(String(clean.cta_name)).toHaveLength(100);
    expect(clean).not.toHaveProperty("intent");
  });

  it("does not push legacy conversion payloads (with attribution) into the GA4 dataLayer", () => {
    const { dataLayer, dispatchEvent } = install();
    trackConversion("contact_form_submit", { form: "contact_page", inquiryType: "CMMC readiness" });
    expect(dataLayer).toHaveLength(0);
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
  });
});

describe("cta_click", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("homepage Secure AI consultation CTA sends cta_click with location, path, and secure_ai intent", () => {
    const { gtag } = install({ url: "https://defenseeye.ai/" });
    trackConversion("consultation_click", { location: "home_hero_secure_ai" });
    expect(events(gtag)).toEqual([["cta_click", { cta_name: "consultation", cta_location: "home_hero_secure_ai", page_path: "/", intent: "secure_ai", send_to: GA_ID }]]);
  });

  it("homepage path cards carry their audience and explicit intent", () => {
    const { gtag } = install();
    trackConversion("home_path_click", { path: "/industries/defense-industrial-base", location: "home_paths", audience: "Defense suppliers preparing for CMMC", intent: "cmmc" });
    expect(events(gtag)[0][1]).toMatchObject({ cta_name: "home_path", cta_location: "home_paths", audience: "Defense suppliers preparing for CMMC", intent: "cmmc" });
  });

  it("CMMC intent is recorded only for CMMC-specific CTAs", () => {
    const { gtag } = install({ url: "https://defenseeye.ai/cmmc-compliance-automation" });
    trackConversion("portfolio_cmmc_click", { location: "portfolio_hero", path: "/cmmc-compliance-automation" });
    trackConversion("cmmclens_click", { location: "cmmclens_hero_briefing" });
    trackConversion("consultation_click", { location: "cmmc_hero" });
    trackConversion("consultation_click", { location: "delivery_model" });
    trackConversion("consultation_click", { location: "insight_cta", insight: "what-is-cmmc-level-2" });
    const sent = events(gtag).map(([, params]) => params.intent);
    expect(sent).toEqual(["cmmc", "cmmc", "cmmc", undefined, undefined]);
  });

  it("visiting a CMMC page does not record CMMC intent or any GA4 event by itself", () => {
    const { gtag } = install({ url: "https://defenseeye.ai/cmmc-compliance-automation" });
    trackConversion("cmmc_readiness_view", { location: "/cmmc-compliance-automation" });
    trackConversion("datasheet_view", { location: "/datasheets/cmmclens" });
    expect(gtag).not.toHaveBeenCalled();
  });

  it("derives intent only from topic-specific CTA context", () => {
    expect(intentFromCtaContext("/lp/cmmc-readiness")).toBe("cmmc");
    expect(intentFromCtaContext("home_midpage_secure_ai")).toBe("secure_ai");
    expect(intentFromCtaContext("/solutions/ai-governance")).toBe("ai_governance");
    expect(intentFromCtaContext("microsoft_ecosystem_hero")).toBe("microsoft");
    expect(intentFromCtaContext("delivery_model", undefined)).toBeUndefined();
  });

  it("each click is one event; repeated clicks are not suppressed", () => {
    const { gtag } = install();
    trackConversion("consultation_click", { location: "home_hero_secure_ai" });
    trackConversion("consultation_click", { location: "home_hero_secure_ai" });
    expect(gtag).toHaveBeenCalledTimes(2);
  });
});

describe("form_start and form_submit", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("form_start fires once per form instance and is not a form_submit", () => {
    const { gtag } = install({ url: "https://defenseeye.ai/contact" });
    const started = { current: false };
    trackFormStartOnce(started, "contact_page", "cmmc_readiness");
    trackFormStartOnce(started, "contact_page", "cmmc_readiness");
    expect(events(gtag)).toEqual([["form_start", { form_name: "contact_page", form_intent: "cmmc_readiness", page_path: "/contact", send_to: GA_ID }]]);
  });

  it("a fresh form instance (for example after client-side navigation back) starts again", () => {
    const { gtag } = install({ url: "https://defenseeye.ai/contact" });
    trackFormStartOnce({ current: false }, "contact_page");
    trackFormStartOnce({ current: false }, "contact_page");
    expect(gtag).toHaveBeenCalledTimes(2);
  });

  it("form_submit carries the form, intent, and campaign source without identifiers", () => {
    const { gtag } = install({ url: "https://defenseeye.ai/contact" });
    trackLeadFormSubmit("contact_page", "cmmc_readiness", { utm_source: "linkedin", utm_medium: "paid_social", utm_campaign: "q4", gclid: "abc", landing_pathname: "/blog", referrer_domain: "linkedin.com" });
    expect(events(gtag)).toEqual([
      [
        "form_submit",
        { form_name: "contact_page", form_intent: "cmmc_readiness", page_path: "/contact", lead_source: "linkedin", lead_medium: "paid_social", lead_campaign: "q4", send_to: GA_ID },
      ],
    ]);
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("abc");
  });

  it("lead source falls back from UTM to click IDs, referrer, then direct", () => {
    expect(leadSourceFromAttribution({ utm_source: "newsletter" })).toMatchObject({ lead_source: "newsletter", lead_medium: "unspecified" });
    expect(leadSourceFromAttribution({ gclid: "x" })).toMatchObject({ lead_source: "google", lead_medium: "cpc" });
    expect(leadSourceFromAttribution({ msclkid: "x" })).toMatchObject({ lead_source: "bing", lead_medium: "cpc" });
    expect(leadSourceFromAttribution({ referrer_domain: "linkedin.com" })).toMatchObject({ lead_source: "linkedin.com", lead_medium: "referral" });
    expect(leadSourceFromAttribution({})).toMatchObject({ lead_source: "direct", lead_medium: "none" });
  });

  it("form_intent comes only from the form's fixed Inquiry Type options", () => {
    const options = ["CMMC readiness", "Supplier / procurement inquiry", "CMMCLens demo"];
    expect(formIntentFromInquiryType("CMMC readiness", options)).toBe("cmmc_readiness");
    expect(formIntentFromInquiryType("Supplier / procurement inquiry", options)).toBe("supplier_procurement_inquiry");
    expect(formIntentFromInquiryType("anything typed by a visitor", options)).toBe("unspecified");
  });
});

describe("newsletter fallback", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("sends newsletter_fallback_click (not a subscription and not a lead)", () => {
    const { gtag } = install({ url: "https://defenseeye.ai/blog" });
    trackConversion("newsletter_unavailable_cta_click", { location: "blog", intent: "newsletter" });
    expect(events(gtag)).toEqual([["newsletter_fallback_click", { cta_name: "newsletter_fallback_contact", cta_location: "blog", page_path: "/blog", send_to: GA_ID }]]);
    expect(JSON.stringify(gtag.mock.calls)).not.toMatch(/subscri|form_submit/);
  });
});

describe("attribution behind form_submit", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("keeps first-touch UTM and referral data through internal navigation to the contact form", () => {
    const session = createStorage();
    const local = createStorage({ de_cookie_consent: consent() });
    install({ url: "https://defenseeye.ai/blog?utm_source=linkedin&utm_medium=social&utm_campaign=q4&utm_content=post&gclid=g1", referrer: "https://www.linkedin.com/", session, local });
    captureUtmParameters();
    const { gtag } = install({ url: "https://defenseeye.ai/contact?inquiry=newsletter", referrer: "https://defenseeye.ai/blog", session, local });
    captureUtmParameters();

    expect(getStoredAttribution()).toEqual({
      utm_source: "linkedin",
      utm_medium: "social",
      utm_campaign: "q4",
      utm_content: "post",
      gclid: "g1",
      landing_pathname: "/blog",
      referrer_domain: "linkedin.com",
    });
    trackLeadFormSubmit("contact_page", "general_inquiry", getStoredAttribution());
    expect(events(gtag)[0][1]).toMatchObject({ lead_source: "linkedin", lead_medium: "social", lead_campaign: "q4" });
  });

  it("records the referring site as the lead source when there are no campaign tags", () => {
    const session = createStorage();
    const local = createStorage({ de_cookie_consent: consent() });
    const { gtag } = install({ url: "https://defenseeye.ai/solutions/ai-governance", referrer: "https://www.linkedin.com/feed/", session, local });
    captureUtmParameters();
    trackLeadFormSubmit("contact_page", "ai_governance_consulting", getStoredAttribution());
    expect(events(gtag)[0][1]).toMatchObject({ lead_source: "linkedin.com", lead_medium: "referral" });
  });
});
