import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const openAiAds = vi.hoisted(() => ({
  reportOpenAiAdsLeadCreated: vi.fn(),
}));

const tracking = vi.hoisted(() => ({
  getStoredAttribution: vi.fn(() => ({
    utm_source: "openai",
    utm_medium: "paid",
    utm_campaign: "secure-ai",
    utm_content: "agentic-ai",
    campaign_id: "cmp_123",
    ad_group_id: "grp_456",
    oppref: "opp_789",
  })),
  trackConversion: vi.fn(),
}));

vi.mock("@/lib/openaiAds", () => openAiAds);
vi.mock("@/lib/tracking", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/tracking")>()),
  getStoredAttribution: tracking.getStoredAttribution,
  trackConversion: tracking.trackConversion,
}));
vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye</nav> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Footer</footer> }));

import SecureAiAdoption, {
  AI_ADOPTION_STAGE_OPTIONS,
  DESIRED_TIMELINE_OPTIONS,
  PRIMARY_NEED_OPTIONS,
  SECURE_AI_INQUIRY_TYPE,
  hasSecureAiAnalyticsConsent,
  submitSecureAiInquiry,
  trackSecureAiFormStartOnce,
  trackSecureAiFunnelEvent,
  validateSecureAiForm,
  type SecureAiFormValues,
} from "./SecureAiAdoption";
import { beginContactSubmission, completeContactSubmission, releaseContactSubmission, type ContactSubmissionGuard } from "./ContactUs";
import { captureUtmParameters } from "@/lib/tracking";

const completeSecureAiForm: SecureAiFormValues = {
  firstName: "Ada Lovelace",
  email: "ada@example.com",
  company: "Example Co",
  title: "CTO",
  aiAdoptionStage: "Running a pilot",
  need: "Agentic AI implementation",
  timeline: "This quarter",
  message: "We need secure agents.",
};

function mockFetch(response: { ok: boolean; status?: number }) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

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
    purposes: {
      analytics: true,
      openaiAdsMeasurement: true,
    },
    updatedAt: "2026-09-04T00:00:00.000Z",
  });
}

function declinedAnalyticsConsent() {
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

function installGa4Window(consent?: string) {
  const localStorage = createStorage();
  if (consent) localStorage.setItem("de_cookie_consent", consent);
  const gtag = vi.fn();
  vi.stubGlobal("window", {
    __gaId: "G-H22Q6LRNWC",
    gtag,
    localStorage,
    location: {
      pathname: "/secure-ai-adoption",
    },
  });
  return { gtag, localStorage };
}

describe("Secure AI adoption landing page", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("renders Secure AI-specific content and omits CMMC-only form fields", () => {
    const html = renderToStaticMarkup(<SecureAiAdoption />);

    expect(html).toContain("Implement Agentic AI Securely");
    expect(html).toContain("Secure Agentic AI Readiness");
    expect(html).toContain("AI Adoption Stage");
    expect(html).toContain("Primary Need");
    expect(html).toContain("Tell us a little about your organization and AI initiative");
    expect(html).toContain("No obligation. Your information is used to prepare for the consultation.");
    expect(html).toContain("Where is your organization today?");
    expect(html).toContain("What would you like help with first?");
    expect(html).toContain("Role / Job Title");
    expect(html).toContain("e.g., CIO, CISO, Head of AI, IT Director");
    expect(html).toContain("Secure AI for Financial Services");
    expect(html).toContain("Identity and least-privilege access for agents");
    expect(html).toContain("The initial conversation can clarify priority use cases");
    expect(html).toContain("Start with a Secure AI Readiness Sprint");
    expect(html).toContain("For regulated organizations, including financial services teams and credit unions");
    expect(html).toContain("The priority AI or agentic AI use case");
    expect(html).toContain("Sensitive data, systems, and access risks");
    expect(html).toContain("Governance and human-oversight requirements");
    expect(html).toContain("Secure target architecture");
    expect(html).toContain("Pilot success criteria and an implementation roadmap");
    expect(html).toContain("Request a Pilot Scoping Call");
    expect(html).toContain('href="#secure-ai-consultation"');
    expect(html).toContain('href="/representative-engagements"');
    expect(html).toContain("View Representative Engagements");
    expect(html).toContain(SECURE_AI_INQUIRY_TYPE);
    expect(html).not.toContain("fixed price");
    expect(html).not.toContain("guaranteed compliance");
    expect(html).not.toContain("Target CMMC Level");
    expect(html).not.toContain("Compliance Timeline");
    expect(html).not.toContain("CMMCLens demo");
    expect(html).not.toContain("AttackSense");
  });

  it("keeps the approved Secure AI controlled vocabulary visible in the form", () => {
    const html = renderToStaticMarkup(<SecureAiAdoption />);

    for (const option of AI_ADOPTION_STAGE_OPTIONS) {
      expect(html).toContain(option.value);
      expect(html).toContain(option.label);
    }

    for (const option of PRIMARY_NEED_OPTIONS) {
      expect(html).toContain(option);
    }

    expect(DESIRED_TIMELINE_OPTIONS).toEqual([
      "Immediate",
      "30-60 days",
      "This quarter",
      "Next quarter",
      "Exploring options",
    ]);
  });

  it("validates required Secure AI consultation fields with readable messages", () => {
    expect(validateSecureAiForm({ ...completeSecureAiForm, firstName: "" })).toMatchObject({
      firstName: "Please enter your full name.",
    });
    expect(validateSecureAiForm({ ...completeSecureAiForm, email: "not-an-email" })).toMatchObject({
      email: "Please enter a valid work email.",
    });
    expect(validateSecureAiForm({ ...completeSecureAiForm, company: "" })).toMatchObject({
      company: "Please enter your organization.",
    });
    expect(validateSecureAiForm({ ...completeSecureAiForm, aiAdoptionStage: "", need: "" })).toMatchObject({
      aiAdoptionStage: "Please choose where your organization is today.",
      need: "Please choose what you would like help with.",
    });
    expect(validateSecureAiForm({ ...completeSecureAiForm, title: "" })).toEqual({});
    expect(validateSecureAiForm(completeSecureAiForm)).toEqual({});
  });

  it("submits Secure AI leads through /api/contact with the correct inquiry type and attribution", async () => {
    const fetchMock = mockFetch({ ok: true });

    await submitSecureAiInquiry(completeSecureAiForm);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/contact");
    expect(body).toMatchObject({
      firstName: "Ada Lovelace",
      email: "ada@example.com",
      company: "Example Co",
      title: "CTO",
      inquiryType: SECURE_AI_INQUIRY_TYPE,
      aiAdoptionStage: "Running a pilot",
      need: "Agentic AI implementation",
      timeline: "This quarter",
      attribution: {
        utm_source: "openai",
        campaign_id: "cmp_123",
        ad_group_id: "grp_456",
        oppref: "opp_789",
      },
    });
    expect(body).not.toHaveProperty("cmmcLevel");
    expect(openAiAds.reportOpenAiAdsLeadCreated).toHaveBeenCalledTimes(1);
    expect(openAiAds.reportOpenAiAdsLeadCreated).toHaveBeenCalledWith();
  });

  it("fires secure AI GA4 funnel events only after current analytics consent", () => {
    const declined = installGa4Window(declinedAnalyticsConsent());

    expect(hasSecureAiAnalyticsConsent()).toBe(false);
    trackSecureAiFunnelEvent("secure_ai_primary_cta_click", { cta_location: "hero", funnel_step: "primary_cta" });
    expect(declined.gtag).not.toHaveBeenCalled();

    const accepted = installGa4Window(acceptedAnalyticsConsent());

    expect(hasSecureAiAnalyticsConsent()).toBe(true);
    trackSecureAiFunnelEvent("secure_ai_pilot_cta_click", { cta_location: "readiness_sprint", funnel_step: "pilot_cta" });

    expect(accepted.gtag).toHaveBeenCalledWith("event", "secure_ai_pilot_cta_click", {
      send_to: "G-H22Q6LRNWC",
      event_category: "secure_ai_funnel",
      cta_location: "readiness_sprint",
      funnel_step: "pilot_cta",
    });
  });

  it("fires secure_ai_form_start once per page lifecycle", () => {
    const { gtag } = installGa4Window(acceptedAnalyticsConsent());
    const started = { current: false };

    trackSecureAiFormStartOnce(started);
    trackSecureAiFormStartOnce(started);

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "secure_ai_form_start", {
      send_to: "G-H22Q6LRNWC",
      event_category: "secure_ai_funnel",
      funnel_step: "form_start",
    });
  });

  it("fires secure_ai_form_submit_success only after /api/contact succeeds without customer data", async () => {
    const fetchMock = mockFetch({ ok: true });
    const { gtag } = installGa4Window(acceptedAnalyticsConsent());

    await submitSecureAiInquiry(completeSecureAiForm);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "secure_ai_form_submit_success", {
      send_to: "G-H22Q6LRNWC",
      event_category: "secure_ai_funnel",
      funnel_step: "submit_success",
    });

    const ga4Payload = JSON.stringify(gtag.mock.calls);
    expect(ga4Payload).not.toContain(completeSecureAiForm.firstName);
    expect(ga4Payload).not.toContain(completeSecureAiForm.email);
    expect(ga4Payload).not.toContain(completeSecureAiForm.company);
    expect(ga4Payload).not.toContain(completeSecureAiForm.title);
    expect(ga4Payload).not.toContain(completeSecureAiForm.message);
    expect(openAiAds.reportOpenAiAdsLeadCreated).toHaveBeenCalledTimes(1);
  });

  it("submits successfully when role/job title is omitted", async () => {
    const fetchMock = mockFetch({ ok: true });

    await submitSecureAiInquiry({ ...completeSecureAiForm, title: "" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(body.title).toBe("");
    expect(body.inquiryType).toBe(SECURE_AI_INQUIRY_TYPE);
    expect(openAiAds.reportOpenAiAdsLeadCreated).toHaveBeenCalledTimes(1);
  });

  it("failed and rejected submissions do not report a conversion", async () => {
    mockFetch({ ok: false, status: 502 });
    const { gtag } = installGa4Window(acceptedAnalyticsConsent());

    await expect(submitSecureAiInquiry(completeSecureAiForm)).rejects.toThrow("Secure AI form failed");

    expect(openAiAds.reportOpenAiAdsLeadCreated).not.toHaveBeenCalled();
    expect(tracking.trackConversion).not.toHaveBeenCalled();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("validation errors create no request and no conversion", async () => {
    const fetchMock = mockFetch({ ok: true });

    await expect(submitSecureAiInquiry({ ...completeSecureAiForm, need: "" })).rejects.toThrow("Secure AI form validation failed");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(openAiAds.reportOpenAiAdsLeadCreated).not.toHaveBeenCalled();
  });

  it("rapid duplicate submissions do not create duplicate requests or events", async () => {
    const fetchMock = mockFetch({ ok: true });
    const guard: ContactSubmissionGuard = { inFlight: false, completed: false };

    const firstClaim = beginContactSubmission(guard);
    const secondClaim = beginContactSubmission(guard);
    if (firstClaim) {
      await submitSecureAiInquiry(completeSecureAiForm);
      completeContactSubmission(guard);
      releaseContactSubmission(guard);
    }
    if (secondClaim) {
      await submitSecureAiInquiry(completeSecureAiForm);
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(openAiAds.reportOpenAiAdsLeadCreated).toHaveBeenCalledTimes(1);
  });

  it("preserves UTM and OpenAI attribution parameters without adding them to the Pixel payload", () => {
    const sessionStorage = createStorage();
    const localStorage = createStorage();
    vi.stubGlobal("window", {
      location: {
        search:
          "?utm_source=openai&utm_medium=paid&utm_campaign=secure-ai&utm_content=hero&campaign_id=cmp_123&ad_group_id=grp_456&ad_id=ad_789&ad_account_id=acct_321&openai_campaign_id=openai_cmp_123&openai_ad_group_id=openai_grp_456&oppref=opp_789",
        pathname: "/secure-ai-adoption",
      },
      sessionStorage,
      localStorage,
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal("document", { referrer: "https://chatgpt.com/c/thread?private=value" });
    vi.stubGlobal("sessionStorage", sessionStorage);
    vi.stubGlobal("localStorage", localStorage);

    captureUtmParameters();

    const attribution = JSON.parse(sessionStorage.setItem.mock.calls[0][1]);
    expect(attribution).toMatchObject({
      utm_source: "openai",
      utm_medium: "paid",
      utm_campaign: "secure-ai",
      utm_content: "hero",
      campaign_id: "cmp_123",
      ad_group_id: "grp_456",
      ad_id: "ad_789",
      ad_account_id: "acct_321",
      openai_campaign_id: "openai_cmp_123",
      openai_ad_group_id: "openai_grp_456",
      oppref: "opp_789",
      landing_pathname: "/secure-ai-adoption",
      referrer_domain: "chatgpt.com",
    });
    expect(attribution.referrer).toBeUndefined();
  });
});
