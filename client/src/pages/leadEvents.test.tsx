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
import { trackCtaClick, trackFormStartOnce } from "@/lib/analytics";
import { renderToStaticMarkup } from "react-dom/server";
import BankingAiAgentRisk, { trackBankingCta } from "./BankingAiAgentRisk";
import { inquiryTypeFromParam } from "./ContactUs";
import { BANKING_AI_RISK_CONTENT, BANKING_DISCOVERY_HREF, DEFY_AI_RISK_URL } from "@shared/bankingAiRiskContent";

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
      "banking_ai_risk_discovery",
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

describe("banking AI-agent risk page", () => {
  afterEach(() => vi.unstubAllGlobals());
  const html = renderToStaticMarkup(<BankingAiAgentRisk />);
  const text = html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/\s+/g, " ");

  it("renders one H1 with the approved hero, eyebrow, and supporting copy", () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toContain(`>${BANKING_AI_RISK_CONTENT.h1}</h1>`);
    expect(text).toContain(BANKING_AI_RISK_CONTENT.eyebrow);
    expect(text).toContain(BANKING_AI_RISK_CONTENT.intro);
  });

  it("renders the pain points, capabilities, workflow, audience, DefyAIRisk section, first engagement, trust points, FAQ, and next step", () => {
    for (const pain of BANKING_AI_RISK_CONTENT.pains) expect(text).toContain(`${pain.title} ${pain.text}`);
    for (const capability of BANKING_AI_RISK_CONTENT.capabilities) expect(text).toContain(`${capability.title} ${capability.text}`);
    for (const audience of BANKING_AI_RISK_CONTENT.audiences) expect(text).toContain(audience);
    BANKING_AI_RISK_CONTENT.workflow.forEach((step, index) => expect(text).toContain(`${index + 1} ${step.title} ${step.text}`));
    expect(html.match(/<ol[\s>]/g)).toHaveLength(1);
    for (const topic of BANKING_AI_RISK_CONTENT.engagementTopics) expect(text).toContain(topic);
    expect(text).toContain(BANKING_AI_RISK_CONTENT.engagementIntro);
    expect(text).toContain(BANKING_AI_RISK_CONTENT.engagementClose);
    for (const point of BANKING_AI_RISK_CONTENT.trustPoints) expect(text).toContain(`${point.title} ${point.text}`);
    for (const faq of BANKING_AI_RISK_CONTENT.faqs) expect(text).toContain(`${faq.question} ${faq.answer}`);
    expect(text).toContain(BANKING_AI_RISK_CONTENT.productText);
    expect(text).toContain(BANKING_AI_RISK_CONTENT.offerHeading);
    expect(text).toContain(BANKING_AI_RISK_CONTENT.offerText);
    expect(text).toContain(BANKING_AI_RISK_CONTENT.trustText);
  });

  it("explains the problem before the solution, the audience, and the product", () => {
    const order = ["painHeading", "solutionHeading", "workflowHeading", "audienceHeading", "productHeading", "engagementHeading", "trustHeading", "faqHeading", "offerHeading"] as const;
    const positions = order.map((key) => html.indexOf(`>${BANKING_AI_RISK_CONTENT[key]}</h2>`));
    expect(positions.every((position) => position > 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it("links the discovery CTAs to the existing contact form and the platform CTAs to DefyAIRisk", () => {
    const discoveryLinks = html.split(`href="${BANKING_DISCOVERY_HREF}"`).length - 1;
    expect(discoveryLinks).toBe(3); // hero, product section, offer
    expect(text.match(new RegExp(BANKING_AI_RISK_CONTENT.primaryCta, "g"))).toHaveLength(3);
    const platform = html.match(/href="https:\/\/defy\.defenseeye\.ai" target="_blank" rel="noopener noreferrer"/g) ?? [];
    expect(platform).toHaveLength(2); // hero and product section
    expect(text).toContain(`${BANKING_AI_RISK_CONTENT.secondaryCta} (opens in a new tab)`);
    expect(text).toContain(`${BANKING_AI_RISK_CONTENT.productCta} (opens in a new tab)`);
    expect(DEFY_AI_RISK_URL).toBe("https://defy.defenseeye.ai");
    expect(text).toContain("(opens in a new tab)");
  });

  it("makes no unsupported claims", () => {
    // The disclaimers deny certification and regulator status; check they are present, then check everything else.
    const disclaimers = [BANKING_AI_RISK_CONTENT.trustPoints[2].title, BANKING_AI_RISK_CONTENT.trustPoints[2].text,BANKING_AI_RISK_CONTENT.faqs[4].question, BANKING_AI_RISK_CONTENT.faqs[4].answer];
    for (const disclaimer of disclaimers) expect(text).toContain(disclaimer);
    const claims = disclaimers.reduce((rest, disclaimer) => rest.split(disclaimer).join(" "), text);
    expect(claims).not.toMatch(/guarantee|certified|certification|zero[- ]risk|first abu dhabi|\bFAB\b|autonomous|fully automated|pricing|\$\d|case stud|our customers|trusted by|\bSOC ?2\b|\bISO\b|\bcompliant\b|prevents? all/i);
    expect(text).toContain("guided remediation with human review before any change");
    // Monitoring is not stated on the public DefyAIRisk page, so the page makes no monitoring claim.
    expect(text).not.toMatch(/monitor/i);
    // "DefyAIRisk" is the only approved product name.
    expect(text).not.toMatch(/\bDefy\b(?!AIRisk)/);
    expect(text).toContain(BANKING_AI_RISK_CONTENT.productCta);
    // Production readiness is not approved: no "platform", monitoring, detection, or readiness language in the page copy.
    expect(JSON.stringify(BANKING_AI_RISK_CONTENT)).not.toMatch(/platform|monitor|behavio|detect|anomal|real[- ]time|continuous|production[- ]ready|enterprise[- ]ready|operational|demonstration/i);
  });

  it("maps every pain point to a verified capability and keeps the first engagement to discussion topics", () => {
    expect(BANKING_AI_RISK_CONTENT.pains.map((pain) => pain.title)).toEqual([
      "Unknown exposure",
      "Excessive access",
      "Unclear ownership and approval gaps",
      "Unsafe remediation",
    ]);
    // Owners, permissions, tools, and data-path review is a DefenseEye service, never a DefyAIRisk product claim.
    expect(text).toContain(BANKING_AI_RISK_CONTENT.solutionIntro);
    expect(BANKING_AI_RISK_CONTENT.solutionIntro).toMatch(/^DefenseEye consulting and assessment services/);
    expect(BANKING_AI_RISK_CONTENT.faqs[1].answer).toContain("This review is a DefenseEye service, not a DefyAIRisk product capability.");
    for (const productCopy of [BANKING_AI_RISK_CONTENT.productText, BANKING_AI_RISK_CONTENT.faqs[5].answer, BANKING_AI_RISK_CONTENT.trustPoints[1].text]) {
      expect(productCopy).not.toMatch(/permission|data path|tools/i);
    }
    expect(BANKING_AI_RISK_CONTENT.engagementIntro).toMatch(/We will discuss/);
    expect(BANKING_AI_RISK_CONTENT.engagementClose).toBe("Together, we will determine the most useful next step for your organization.");
    expect(JSON.stringify(BANKING_AI_RISK_CONTENT.engagementTopics)).not.toMatch(/inventory|exposure map|risk register|report|backlog|pilot plan/i);
    expect(BANKING_AI_RISK_CONTENT.trustPoints.map((point) => point.text)).toEqual([
      "Consequential changes receive human review before they are made.",
      "DefyAIRisk access uses Microsoft or Google sign-in, and an administrator approves each new user.",
      "DefenseEye is not a certification body or regulator, and it does not grant regulatory approval.",
    ]);
  });

  it("sends exactly one cta_click per CTA interaction with banking intent and no personal data", () => {
    const gtag = installBrowser("/solutions/banking-ai-agent-risk");
    trackBankingCta("discovery", "banking_hero");
    expect(sent(gtag, "cta_click")).toEqual([
      { cta_name: "banking_ai_risk_discovery_call", cta_location: "banking_hero", page_path: "/solutions/banking-ai-agent-risk", intent: "banking", send_to: GA_ID },
    ]);
    trackBankingCta("platform", "banking_product");
    expect(sent(gtag, "cta_click")).toHaveLength(2);
    expect(sent(gtag, "cta_click")[1]).toEqual({ cta_name: "defyairisk_platform", cta_location: "banking_product", page_path: "/solutions/banking-ai-agent-risk", intent: "banking", product: "defyairisk", send_to: GA_ID });
  });

  it("sends nothing to GA4 without analytics consent", () => {
    const gtag = installBrowser("/solutions/banking-ai-agent-risk", false);
    trackBankingCta("discovery", "banking_offer");
    expect(gtag).not.toHaveBeenCalled();
  });
});

describe("banking AI risk discovery inquiry option", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("presets the new option from ?inquiry=banking-ai-risk-discovery and maps to banking_ai_risk_discovery", () => {
    expect(inquiryTypeFromParam("banking-ai-risk-discovery")).toBe("Banking AI risk discovery");
    expect(contactFormIntent("Banking AI risk discovery")).toBe("banking_ai_risk_discovery");
    expect(BANKING_DISCOVERY_HREF).toBe("/contact?inquiry=banking-ai-risk-discovery");
  });

  it("keeps every existing option and preset unchanged", () => {
    expect(CONTACT_INQUIRY_TYPES.filter((option) => option !== "Banking AI risk discovery")).toEqual([
      "General inquiry", "Supplier / procurement inquiry", "Partnership / subcontracting", "AI governance consulting", "Microsoft Copilot readiness",
      "CMMC readiness", "Compliance automation", "Cloud security", "Staff augmentation", "CMMCLens demo", "Product support", "Other",
    ]);
    expect(inquiryTypeFromParam("cmmc")).toBe("CMMC readiness");
    expect(inquiryTypeFromParam("newsletter")).toBe("General inquiry");
    expect(inquiryTypeFromParam("ai-governance")).toBe("AI governance consulting");
  });

  it("sends form_submit with form_intent=banking_ai_risk_discovery only after success, without personal data", async () => {
    const gtag = installBrowser("/contact");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    const bankingForm = { ...contactForm, inquiryType: "Banking AI risk discovery" };
    await submitContactInquiry(bankingForm);
    expect(sent(gtag, "form_submit")).toEqual([
      { form_name: "contact_page", form_intent: "banking_ai_risk_discovery", page_path: "/contact", lead_source: "linkedin", lead_medium: "social", lead_campaign: "q4", send_to: GA_ID },
    ]);
    expectNoPersonalData(gtag, Object.values(bankingForm).filter((value) => value !== "Banking AI risk discovery"));
  });

  it("sends no form_submit when the banking inquiry fails", async () => {
    const gtag = installBrowser("/contact");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(submitContactInquiry({ ...contactForm, inquiryType: "Banking AI risk discovery" })).rejects.toThrow();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("starts form_start with the banking intent once when the form is preset", () => {
    const gtag = installBrowser("/contact");
    const started = { current: false };
    trackFormStartOnce(started, "contact_page", contactFormIntent("Banking AI risk discovery"));
    trackFormStartOnce(started, "contact_page", contactFormIntent("Banking AI risk discovery"));
    expect(sent(gtag, "form_start")).toEqual([{ form_name: "contact_page", form_intent: "banking_ai_risk_discovery", page_path: "/contact", send_to: GA_ID }]);
  });
});
