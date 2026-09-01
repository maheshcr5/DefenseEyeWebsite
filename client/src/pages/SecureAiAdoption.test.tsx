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

import SecureAiAdoption, { SECURE_AI_INQUIRY_TYPE, submitSecureAiInquiry, type SecureAiFormValues } from "./SecureAiAdoption";
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
    expect(html).toContain("Secure AI for Financial Services");
    expect(html).toContain("Identity and least-privilege access for agents");
    expect(html).toContain("The initial conversation can clarify priority use cases");
    expect(html).toContain('href="/representative-engagements"');
    expect(html).toContain("View Representative Engagements");
    expect(html).toContain(SECURE_AI_INQUIRY_TYPE);
    expect(html).not.toContain("Target CMMC Level");
    expect(html).not.toContain("Compliance Timeline");
    expect(html).not.toContain("CMMCLens demo");
    expect(html).not.toContain("AttackSense");
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

  it("failed and rejected submissions do not report a conversion", async () => {
    mockFetch({ ok: false, status: 502 });

    await expect(submitSecureAiInquiry(completeSecureAiForm)).rejects.toThrow("Secure AI form failed");

    expect(openAiAds.reportOpenAiAdsLeadCreated).not.toHaveBeenCalled();
    expect(tracking.trackConversion).not.toHaveBeenCalled();
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
          "?utm_source=openai&utm_medium=paid&utm_campaign=secure-ai&utm_content=hero&campaign_id=cmp_123&ad_group_id=grp_456&oppref=opp_789",
        pathname: "/secure-ai-adoption",
      },
      sessionStorage,
      localStorage,
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal("document", { referrer: "" });
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
      oppref: "opp_789",
    });
  });
});
