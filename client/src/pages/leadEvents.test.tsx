// Page-level GA4 lead events using the real analytics and tracking modules.
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const openAiAds = vi.hoisted(() => ({ reportOpenAiAdsLeadCreated: vi.fn() }));

vi.mock("@/lib/openaiAds", () => openAiAds);
vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav /> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer /> }));
vi.mock("@/components/RelatedResources", () => ({ default: () => null }));
vi.mock("@/components/DefenseEyeLogo", () => ({ default: () => null }));

import { CONTACT_INQUIRY_TYPES, contactFormIntent, submitContactInquiry, type ContactFormValues } from "./ContactUs";
import { submitSecureAiInquiry, trackSecureAiCta, type SecureAiFormValues } from "./SecureAiAdoption";
import { trackSolutionCta } from "./SolutionPage";
import { trackCtaClick } from "@/lib/analytics";

const GA_ID = "G-H22Q6LRNWC";

const contactForm: ContactFormValues = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  company: "Example Co",
  title: "CTO",
  inquiryType: "CMMC readiness",
  timeline: "Immediate",
  message: "Please call me about our SSP.",
  phone: "555-010-0199",
};

const secureAiForm: SecureAiFormValues = {
  firstName: "Grace Hopper",
  email: "grace@example.org",
  company: "Example Credit Union",
  title: "CISO",
  aiAdoptionStage: "Exploring AI use cases",
  need: "AI governance",
  timeline: "This quarter",
  message: "We are piloting agents.",
};

function storage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => void values.set(key, value)),
  };
}

function installBrowser(pathname: string, consented = true) {
  const gtag = vi.fn();
  const local = storage(
    consented ? { de_cookie_consent: JSON.stringify({ status: "accepted", version: 2, purposes: { analytics: true, openaiAdsMeasurement: true } }) } : {}
  );
  const session = storage({ defenseeye_utm: JSON.stringify({ utm_source: "linkedin", utm_medium: "social", utm_campaign: "q4", landing_pathname: "/blog", referrer_domain: "linkedin.com" }) });
  vi.stubGlobal("window", { __gaId: GA_ID, gtag, location: { pathname, search: "" }, localStorage: local, sessionStorage: session, dispatchEvent: vi.fn() });
  vi.stubGlobal("localStorage", local);
  vi.stubGlobal("sessionStorage", session);
  vi.stubGlobal("CustomEvent", class { constructor(public type: string) {} });
  return gtag;
}

const sent = (gtag: ReturnType<typeof vi.fn>, name: string) => gtag.mock.calls.filter((call) => call[1] === name).map((call) => call[2] as Record<string, unknown>);

function expectNoPersonalData(gtag: ReturnType<typeof vi.fn>, values: string[]) {
  const payload = JSON.stringify(gtag.mock.calls);
  for (const value of values) expect(payload).not.toContain(value);
  expect(payload).not.toMatch(/@/);
}

describe("contact page form_submit", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  it("fires one form_submit only after /api/contact succeeds, with no personal data", async () => {
    const gtag = installBrowser("/contact");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    await submitContactInquiry(contactForm);

    expect(sent(gtag, "form_submit")).toEqual([
      { form_name: "contact_page", form_intent: "cmmc_readiness", page_path: "/contact", lead_source: "linkedin", lead_medium: "social", lead_campaign: "q4", send_to: GA_ID },
    ]);
    expectNoPersonalData(gtag, Object.values(contactForm));
  });

  it("sends no form_submit when the server rejects the inquiry or the request fails", async () => {
    for (const fetchMock of [vi.fn().mockResolvedValue({ ok: false, status: 500 }), vi.fn().mockResolvedValue({ ok: false, status: 400 }), vi.fn().mockRejectedValue(new Error("offline"))]) {
      const gtag = installBrowser("/contact");
      vi.stubGlobal("fetch", fetchMock);
      await expect(submitContactInquiry(contactForm)).rejects.toThrow();
      expect(gtag).not.toHaveBeenCalled();
    }
  });

  it("sends no form_submit and no request for an incomplete form", async () => {
    const gtag = installBrowser("/contact");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(submitContactInquiry({ ...contactForm, message: "" })).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("sends nothing to GA4 without analytics consent, even for a successful lead", async () => {
    const gtag = installBrowser("/contact", false);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    await submitContactInquiry(contactForm);
    expect(gtag).not.toHaveBeenCalled();
  });

  it("maps every Inquiry Type option to a stable form_intent", () => {
    expect(CONTACT_INQUIRY_TYPES.map(contactFormIntent)).toEqual([
      "general_inquiry",
      "supplier_procurement_inquiry",
      "partnership_subcontracting",
      "ai_governance_consulting",
      "microsoft_copilot_readiness",
      "cmmc_readiness",
      "compliance_automation",
      "cloud_security",
      "staff_augmentation",
      "cmmclens_demo",
      "product_support",
      "other",
    ]);
  });
});

describe("Secure AI page lead events", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  it("primary and pilot CTAs send cta_click with secure_ai intent alongside the funnel events", () => {
    const gtag = installBrowser("/secure-ai-adoption");
    trackSecureAiCta("secure_ai_primary_cta_click", "hero", "primary_cta");
    trackSecureAiCta("secure_ai_pilot_cta_click", "readiness_sprint", "pilot_cta");
    expect(sent(gtag, "cta_click")).toEqual([
      { cta_name: "secure_ai_primary_cta", cta_location: "hero", page_path: "/secure-ai-adoption", intent: "secure_ai", send_to: GA_ID },
      { cta_name: "secure_ai_pilot_cta", cta_location: "readiness_sprint", page_path: "/secure-ai-adoption", intent: "secure_ai", send_to: GA_ID },
    ]);
    expect(sent(gtag, "secure_ai_primary_cta_click")).toHaveLength(1);
  });

  it("successful submission sends one form_submit; failure sends none", async () => {
    const ok = installBrowser("/secure-ai-adoption");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    await submitSecureAiInquiry(secureAiForm);
    expect(sent(ok, "form_submit")).toEqual([
      { form_name: "secure_ai_adoption", form_intent: "secure_ai", page_path: "/secure-ai-adoption", lead_source: "linkedin", lead_medium: "social", lead_campaign: "q4", send_to: GA_ID },
    ]);
    expectNoPersonalData(ok, Object.values(secureAiForm));

    const failed = installBrowser("/secure-ai-adoption");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 502 }));
    await expect(submitSecureAiInquiry(secureAiForm)).rejects.toThrow();
    expect(failed).not.toHaveBeenCalled();
  });
});

describe("header CTA", () => {
  afterEach(() => vi.unstubAllGlobals());
  // NavBar is mocked above for page rendering; these tests need the real helper.
  const realNavBar = () => vi.importActual<typeof import("@/components/NavBar")>("@/components/NavBar");

  it("records the route's header CTA variant with its own intent", async () => {
    const { headerCtaClick } = await realNavBar();
    expect(headerCtaClick("/")).toEqual({ name: "header_secure_ai_consultation", location: "header", intent: "secure_ai" });
    expect(headerCtaClick("/cmmclens")).toEqual({ name: "header_cmmclens_briefing", location: "header", intent: "cmmc", product: "cmmclens" });
    expect(headerCtaClick("/supplier-readiness")).toMatchObject({ name: "header_supplier_opportunities", intent: "supplier" });
  });

  it("sends one cta_click per header click", async () => {
    const { headerCtaClick } = await realNavBar();
    const gtag = installBrowser("/");
    trackCtaClick(headerCtaClick("/"));
    expect(sent(gtag, "cta_click")).toEqual([{ cta_name: "header_secure_ai_consultation", cta_location: "header", page_path: "/", intent: "secure_ai", send_to: GA_ID }]);
  });
});

describe("AI governance and other solution-page CTAs", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("the AI governance primary CTA sends cta_click with ai_governance intent", () => {
    const gtag = installBrowser("/solutions/ai-governance");
    trackSolutionCta("/solutions/ai-governance", "/contact?inquiry=ai-governance", "solution_primary", "solution_hero");
    expect(sent(gtag, "cta_click")).toEqual([
      { cta_name: "solution_primary", cta_location: "solution_hero", page_path: "/solutions/ai-governance", intent: "ai_governance", send_to: GA_ID },
    ]);
  });

  it("supplier and capability-statement CTAs are supplier intent; generic solution CTAs get no topic intent", () => {
    const gtag = installBrowser("/solutions/cloud-security");
    trackSolutionCta("/solutions/cloud-security", "/capability-statement", "capability_statement", "solution_hero");
    trackSolutionCta("/solutions/cloud-security", "https://cal.com/defenseeye", "supplier_opportunities", "solution_supplier");
    trackSolutionCta("/solutions/cloud-security", "/contact?inquiry=cloud-security", "solution_primary", "solution_hero");
    expect(sent(gtag, "cta_click").map((params) => params.intent)).toEqual(["supplier", "supplier", undefined]);
  });
});
