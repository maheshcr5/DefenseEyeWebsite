import { beforeEach, describe, expect, it, vi } from "vitest";

const openAiAds = vi.hoisted(() => ({
  reportOpenAiAdsLeadCreated: vi.fn(),
}));

const tracking = vi.hoisted(() => ({
  getStoredAttribution: vi.fn(() => ({ utm_source: "chatgpt" })),
  trackConversion: vi.fn(),
}));

vi.mock("@/lib/openaiAds", () => openAiAds);
vi.mock("@/lib/tracking", () => tracking);
vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => null }));
vi.mock("@/components/DefenseEyeLogo", () => ({ default: () => null }));
vi.mock("@/components/ui/button", () => ({ Button: () => null }));
vi.mock("@/data/companyFacts", () => ({
  CAPABILITY_STATEMENT_URL: "/capability-statement",
  COMPANY: {
    enterpriseEmail: "enterprise@defenseeye.ai",
    supportEmail: "support@defenseeye.ai",
    partnersEmail: "partners@defenseeye.ai",
  },
}));

import {
  beginContactSubmission,
  completeContactSubmission,
  releaseContactSubmission,
  submitContactInquiry,
  type ContactFormValues,
  type ContactSubmissionGuard,
} from "./ContactUs";

const completeForm: ContactFormValues = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  company: "Example Co",
  title: "CTO",
  inquiryType: "CMMC readiness",
  timeline: "Immediate",
  message: "Please contact me.",
  phone: "555-0100",
};

function mockFetch(response: { ok: boolean; status?: number }) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("contact form OpenAI lead conversion", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("successful /api/contact response produces exactly one lead_created", async () => {
    mockFetch({ ok: true });

    await submitContactInquiry(completeForm);

    expect(openAiAds.reportOpenAiAdsLeadCreated).toHaveBeenCalledTimes(1);
    expect(tracking.trackConversion).toHaveBeenCalledWith("contact_form_submit", {
      form: "contact_page",
      inquiryType: "CMMC readiness",
    });
  });

  it("failed response produces no OpenAI event", async () => {
    mockFetch({ ok: false });

    await expect(submitContactInquiry(completeForm)).rejects.toThrow("Contact form failed");

    expect(openAiAds.reportOpenAiAdsLeadCreated).not.toHaveBeenCalled();
    expect(tracking.trackConversion).not.toHaveBeenCalled();
  });

  it.each([502, 503])("backend %i response produces no OpenAI event", async (status) => {
    mockFetch({ ok: false, status });

    await expect(submitContactInquiry(completeForm)).rejects.toThrow("Contact form failed");

    expect(openAiAds.reportOpenAiAdsLeadCreated).not.toHaveBeenCalled();
    expect(tracking.trackConversion).not.toHaveBeenCalled();
  });

  it("thrown request produces no OpenAI event", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network failed")));

    await expect(submitContactInquiry(completeForm)).rejects.toThrow("Network failed");

    expect(openAiAds.reportOpenAiAdsLeadCreated).not.toHaveBeenCalled();
    expect(tracking.trackConversion).not.toHaveBeenCalled();
  });

  it("timed-out request produces no OpenAI event", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("Timed out", "TimeoutError")));

    await expect(submitContactInquiry(completeForm)).rejects.toThrow("Timed out");

    expect(openAiAds.reportOpenAiAdsLeadCreated).not.toHaveBeenCalled();
    expect(tracking.trackConversion).not.toHaveBeenCalled();
  });

  it("validation failure produces no OpenAI event and no request", async () => {
    const fetchMock = mockFetch({ ok: true });

    await expect(submitContactInquiry({ ...completeForm, email: "" })).rejects.toThrow("Contact form validation failed");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(openAiAds.reportOpenAiAdsLeadCreated).not.toHaveBeenCalled();
  });

  it("missing Pixel produces no application error after successful submission", async () => {
    mockFetch({ ok: true });
    openAiAds.reportOpenAiAdsLeadCreated.mockReturnValue(false);

    await expect(submitContactInquiry(completeForm)).resolves.toBeUndefined();

    expect(openAiAds.reportOpenAiAdsLeadCreated).toHaveBeenCalledTimes(1);
    expect(tracking.trackConversion).toHaveBeenCalledTimes(1);
  });

  it("declined or unset consent produces no OpenAI event", async () => {
    mockFetch({ ok: true });
    openAiAds.reportOpenAiAdsLeadCreated.mockReturnValue(false);

    await submitContactInquiry(completeForm);

    expect(openAiAds.reportOpenAiAdsLeadCreated).toHaveBeenCalledTimes(1);
    expect(tracking.trackConversion).toHaveBeenCalledTimes(1);
  });

  it("rapid duplicate submission does not produce duplicate conversions", async () => {
    const fetchMock = mockFetch({ ok: true });
    const guard: ContactSubmissionGuard = { inFlight: false, completed: false };

    const firstClaim = beginContactSubmission(guard);
    const secondClaim = beginContactSubmission(guard);
    if (firstClaim) {
      await submitContactInquiry(completeForm);
      completeContactSubmission(guard);
      releaseContactSubmission(guard);
    }
    if (secondClaim) {
      await submitContactInquiry(completeForm);
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(openAiAds.reportOpenAiAdsLeadCreated).toHaveBeenCalledTimes(1);
  });

  it("failed attempt followed by valid retry can still report one conversion", async () => {
    const guard: ContactSubmissionGuard = { inFlight: false, completed: false };
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    if (beginContactSubmission(guard)) {
      await expect(submitContactInquiry(completeForm)).rejects.toThrow("Contact form failed");
      releaseContactSubmission(guard);
    }
    if (beginContactSubmission(guard)) {
      await submitContactInquiry(completeForm);
      completeContactSubmission(guard);
      releaseContactSubmission(guard);
    }

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(openAiAds.reportOpenAiAdsLeadCreated).toHaveBeenCalledTimes(1);
  });

  it("React rerender-style repeated completion does not repeat the conversion", async () => {
    const guard: ContactSubmissionGuard = { inFlight: false, completed: false };
    const fetchMock = mockFetch({ ok: true });

    if (beginContactSubmission(guard)) {
      await submitContactInquiry(completeForm);
      completeContactSubmission(guard);
      releaseContactSubmission(guard);
    }
    if (beginContactSubmission(guard)) {
      await submitContactInquiry(completeForm);
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(openAiAds.reportOpenAiAdsLeadCreated).toHaveBeenCalledTimes(1);
  });

  it("does not include customer or form information in the OpenAI event payload", async () => {
    mockFetch({ ok: true });

    await submitContactInquiry(completeForm);

    expect(openAiAds.reportOpenAiAdsLeadCreated).toHaveBeenCalledWith();
    expect(JSON.stringify(openAiAds.reportOpenAiAdsLeadCreated.mock.calls)).not.toContain("Ada");
    expect(JSON.stringify(openAiAds.reportOpenAiAdsLeadCreated.mock.calls)).not.toContain("ada@example.com");
    expect(JSON.stringify(openAiAds.reportOpenAiAdsLeadCreated.mock.calls)).not.toContain("Example Co");
    expect(JSON.stringify(openAiAds.reportOpenAiAdsLeadCreated.mock.calls)).not.toContain("Please contact me.");
  });
});
