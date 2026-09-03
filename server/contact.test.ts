import { beforeEach, describe, expect, it, vi } from "vitest";

const nodemailerMock = vi.hoisted(() => ({
  sendMail: vi.fn(),
  createTransport: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: nodemailerMock.createTransport,
  },
}));

import { deriveDiscoveryFocus, deriveLeadUrgency, processContactInquiry, renderCustomerConfirmationEmail, renderInternalLeadEmail } from "./index";

const smtpEnv = {
  SMTP_HOST: "smtp.example.test",
  SMTP_PORT: "587",
  SMTP_SECURE: "false",
  SMTP_USER: "smtp-user@example.test",
  SMTP_PASS: "smtp-password",
  SMTP_FROM: "no-reply@example.test",
  CONTACT_NOTIFICATION_EMAIL: "mahesh@defenseeye.ai",
};

const contactBody = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  company: "Example Co",
  title: "CTO",
  phone: "555-0100",
  inquiryType: "CMMC readiness",
  timeline: "Immediate",
  message: "Please contact me.",
  attribution: { utm_source: "chatgpt" },
};

function createLogger() {
  const logs: string[] = [];
  return {
    logger: {
      log: vi.fn((message: string) => logs.push(message)),
      warn: vi.fn((message: string) => logs.push(message)),
      error: vi.fn((message: string) => logs.push(message)),
    },
    logs,
  };
}

describe("contact endpoint success contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    nodemailerMock.createTransport.mockReturnValue({ sendMail: nodemailerMock.sendMail });
  });

  it("missing SMTP configuration returns non-2xx", async () => {
    const { logger } = createLogger();

    const result = await processContactInquiry(contactBody, {}, logger);

    expect(result.status).toBe(503);
    expect(result.body).toEqual({
      error: "contact_delivery_unavailable",
      message: "We could not process your inquiry right now. Please try again later.",
    });
    expect(nodemailerMock.createTransport).not.toHaveBeenCalled();
  });

  it("required notification success returns 2xx", async () => {
    const { logger } = createLogger();
    nodemailerMock.sendMail.mockResolvedValueOnce({ accepted: ["mahesh@defenseeye.ai"] }).mockResolvedValueOnce({ accepted: ["ada@example.com"] });

    const result = await processContactInquiry(contactBody, smtpEnv, logger);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true });
    expect(nodemailerMock.sendMail).toHaveBeenCalledTimes(2);
    expect(nodemailerMock.sendMail.mock.calls[0][0]).toMatchObject({
      from: `"DefenseEye Contact Form" <${smtpEnv.SMTP_FROM}>`,
      to: "mahesh@defenseeye.ai",
      replyTo: "ada@example.com",
    });
    expect(nodemailerMock.sendMail.mock.calls[1][0]).toMatchObject({
      to: "ada@example.com",
      subject: "We received your DefenseEye inquiry",
    });
  });

  it("Secure AI Adoption lead notification includes every submitted AI-specific answer and attribution field", async () => {
    const { logger } = createLogger();
    nodemailerMock.sendMail.mockResolvedValueOnce({ accepted: ["mahesh@defenseeye.ai"] }).mockResolvedValueOnce({ accepted: ["ada@example.com"] });

    const result = await processContactInquiry(
      {
        ...contactBody,
        inquiryType: "Secure AI Adoption",
        aiAdoptionStage: "Running a pilot",
        need: "Agentic AI implementation",
        timeline: "This quarter",
        cmmcLevel: "Level 2",
        challenge: "Audit deadline",
        attribution: {
          utm_source: "openai",
          utm_medium: "paid",
          utm_campaign: "secure-ai",
          utm_content: "hero",
          openai_campaign_id: "cmp_123",
          openai_ad_group_id: "grp_456",
          ad_id: "ad_789",
          ad_account_id: "acct_321",
          oppref: "opp_789",
        },
      },
      smtpEnv,
      logger
    );

    const notification = nodemailerMock.sendMail.mock.calls[0][0];
    const confirmation = nodemailerMock.sendMail.mock.calls[1][0];
    expect(result.status).toBe(200);
    expect(notification.to).toBe("mahesh@defenseeye.ai");
    expect(notification.cc).toBeUndefined();
    expect(notification.subject).toBe("[DefenseEye Lead] Secure AI Adoption - Example Co - Ada Lovelace");
    expect(notification.html).toContain("New Secure AI Consultation Request");
    expect(notification.text).toContain("NEW SECURE AI CONSULTATION REQUEST");
    expect(notification.html).toContain("Lead Snapshot - Derived Summary");
    expect(notification.html).toContain("Discovery Focus - Derived Guidance");
    expect(notification.html).toContain("Qualification Gaps - Objective Signals");
    expect(notification.html).toContain("Submitted Details - Contact Information");
    expect(notification.html).toContain("Ada Lovelace");
    expect(notification.html).toContain("ada@example.com");
    expect(notification.html).toContain("CTO");
    expect(notification.html).toContain("555-0100");
    expect(notification.html).toContain("AI Adoption Stage");
    expect(notification.html).toContain("Running a pilot");
    expect(notification.html).toContain("Primary Need");
    expect(notification.html).toContain("Agentic AI implementation");
    expect(notification.html).toContain("Desired Timeline");
    expect(notification.html).toContain("This quarter");
    expect(notification.html).toContain("Additional Context");
    expect(notification.html).toContain("Please contact me.");
    expect(notification.html).toContain("Source");
    expect(notification.html).toContain("openai");
    expect(notification.html).toContain("Medium");
    expect(notification.html).toContain("paid");
    expect(notification.html).toContain("Campaign");
    expect(notification.html).toContain("secure-ai");
    expect(notification.html).toContain("Ad");
    expect(notification.html).toContain("hero");
    expect(notification.html).toContain("Campaign ID");
    expect(notification.html).toContain("cmp_123");
    expect(notification.html).toContain("Ad Group ID");
    expect(notification.html).toContain("grp_456");
    expect(notification.html).toContain("Ad ID");
    expect(notification.html).toContain("ad_789");
    expect(notification.html).toContain("Ad Account ID");
    expect(notification.html).toContain("acct_321");
    expect(notification.html).toContain("OpenAI Click Reference / oppref");
    expect(notification.html).toContain("opp_789");
    expect(notification.html).toContain("Urgency");
    expect(notification.html).toContain("Active");
    expect(notification.html).toContain("No qualification gaps identified from the submitted fields.");
    expect(notification.html).toContain("Submitted At");
    expect(notification.html).toContain("Inquiry Type");
    expect(notification.html).toContain("Secure AI Adoption");
    expect(notification.html).not.toContain("Target CMMC Level");
    expect(notification.html).not.toContain("Biggest Challenge");
    expect(confirmation.to).toBe("ada@example.com");
    expect(confirmation.subject).toBe("DefenseEye received your Secure AI consultation request");
    expect(confirmation.html).toContain("within one business day");
    expect(confirmation.text).toContain("AI use case, security and governance priorities");
    expect(confirmation.text).toContain("within one business day");
    expect(confirmation.html).not.toContain("24 business hours");
    expect(confirmation.text).not.toContain("24 business hours");
    expect(confirmation.html).not.toContain("CMMC Knowledge Hub");
    expect(confirmation.html).toContain("AI Adoption Stage");
    expect(confirmation.html).toContain("Running a pilot");
    expect(confirmation.html).toContain("Primary Need");
    expect(confirmation.html).toContain("Agentic AI implementation");
    expect(confirmation.html).toContain("Timeline");
    expect(confirmation.html).toContain("This quarter");
    expect(confirmation.html).not.toContain("cmp_123");
    expect(confirmation.html).not.toContain("grp_456");
    expect(confirmation.html).not.toContain("opp_789");
  });

  it.each([
    ["Use-case and readiness assessment", "Explore Secure AI Readiness and Transformation", "https://defenseeye.ai/solutions/ai-transformation"],
    ["Secure AI architecture", "Explore Secure AI Security and Architecture", "https://defenseeye.ai/solutions/ai-security"],
    ["AI governance and risk management", "Explore AI Governance and Risk Management", "https://defenseeye.ai/solutions/ai-governance"],
    ["Agentic AI implementation", "Explore Secure Agentic AI Implementation", "https://defenseeye.ai/secure-ai-adoption"],
    ["Microsoft Copilot or Azure OpenAI readiness", "Explore Microsoft Copilot Readiness", "https://defenseeye.ai/solutions/microsoft-copilot-readiness"],
    ["Other", "Explore DefenseEye Secure AI Services", "https://defenseeye.ai/secure-ai-adoption"],
    ["Unexpected value", "Explore DefenseEye Secure AI Services", "https://defenseeye.ai/secure-ai-adoption"],
    ["", "Explore DefenseEye Secure AI Services", "https://defenseeye.ai/secure-ai-adoption"],
  ])("maps Secure AI confirmation need %s to the right resource", (need, label, url) => {
    const confirmation = renderCustomerConfirmationEmail({
      firstName: "Ada",
      company: "Example Co",
      inquiryType: "Secure AI Adoption",
      need,
      aiAdoptionStage: "Evaluating use cases",
      timeline: "Immediate",
    });

    expect(confirmation.subject).toBe("DefenseEye received your Secure AI consultation request");
    expect(confirmation.html).toContain("within one business day");
    expect(confirmation.text).toContain("within one business day");
    expect(confirmation.html).not.toContain("24 business hours");
    expect(confirmation.text).not.toContain("24 business hours");
    expect(confirmation.html).toContain(label);
    expect(confirmation.html).toContain(url);
    expect(confirmation.text).toContain(label);
    expect(confirmation.text).toContain(url);
    expect(confirmation.html).not.toContain("CMMC");
    expect(confirmation.html).not.toContain("NIST 800-171");
    expect(confirmation.html).not.toContain("SPRS");
    expect(confirmation.html).not.toContain("C3PAO");
    expect(confirmation.html).not.toContain("compliance automation");
  });

  it("renders the Secure AI governance confirmation with the expected guidance and no internal data", () => {
    const confirmation = renderCustomerConfirmationEmail({
      firstName: "Ada <script>",
      company: "Example <Co>",
      inquiryType: "Secure AI Adoption",
      need: "AI governance and risk management",
      aiAdoptionStage: "Evaluating use cases",
      timeline: "30-60 days",
    });

    expect(confirmation.html).toContain("We received your request, Ada &lt;script&gt;!");
    expect(confirmation.html).toContain("Example &lt;Co&gt;");
    expect(confirmation.html).toContain(
      "Thank you for reaching out to DefenseEye. Our team will review your request and contact you within one business day to discuss your AI use case, security and governance priorities, architecture needs, and practical implementation next steps."
    );
    expect(confirmation.html).toContain("AI use case, security and governance priorities");
    expect(confirmation.html).toContain("practical AI governance, accountability, oversight, and risk controls");
    expect(confirmation.html).toContain("https://defenseeye.ai/solutions/ai-governance");
    expect(confirmation.text).toContain("AI use case, security and governance priorities");
    expect(confirmation.text).toContain("within one business day");
    expect(confirmation.html).not.toContain("24 business hours");
    expect(confirmation.text).not.toContain("24 business hours");
    expect(confirmation.text).toContain("Explore AI Governance and Risk Management: https://defenseeye.ai/solutions/ai-governance");
    expect(confirmation.html).not.toContain("Derived Summary");
    expect(confirmation.html).not.toContain("Objective Signals");
    expect(confirmation.html).not.toContain("Qualification Gaps");
    expect(confirmation.html).not.toContain("oppref");
    expect(confirmation.html).not.toContain("Campaign ID");
    expect(confirmation.html).not.toContain("Referrer");
    expect(confirmation.html).not.toContain("imageName");
    expect(confirmation.html).not.toContain("&#x20;");
    expect(confirmation.text).not.toContain("oppref");
  });

  it("keeps CMMC confirmations on the CMMC Knowledge Hub recommendation", () => {
    const confirmation = renderCustomerConfirmationEmail({
      firstName: "Ada",
      company: "Example Co",
      inquiryType: "CMMC readiness",
      timeline: "This quarter",
    });

    expect(confirmation.subject).toBe("We received your DefenseEye inquiry");
    expect(confirmation.html).toContain("CMMC Knowledge Hub");
    expect(confirmation.html).toContain("https://defenseeye.ai/knowledge-hub");
    expect(confirmation.html).toContain("NIST 800-171");
    expect(confirmation.html).toContain("SPRS");
    expect(confirmation.text).toContain("CMMC Knowledge Hub");
  });

  it("does not guess a Secure AI or CMMC recommendation for general inquiries", () => {
    const confirmation = renderCustomerConfirmationEmail({
      firstName: "Ada",
      company: "Example Co",
      inquiryType: "Other",
      timeline: "Exploring options",
    });

    expect(confirmation.subject).toBe("We received your DefenseEye inquiry");
    expect(confirmation.html).toContain("within one business day");
    expect(confirmation.text).toContain("within one business day");
    expect(confirmation.html).not.toContain("24 business hours");
    expect(confirmation.text).not.toContain("24 business hours");
    expect(confirmation.html).not.toContain("CMMC Knowledge Hub");
    expect(confirmation.html).not.toContain("Explore DefenseEye Secure AI Services");
    expect(confirmation.html).not.toContain("https://defenseeye.ai/knowledge-hub");
    expect(confirmation.text).not.toContain("CMMC Knowledge Hub");
    expect(confirmation.text).not.toContain("Explore DefenseEye Secure AI Services");
  });

  it("keeps Secure AI confirmation routing when additional context mentions compliance", async () => {
    const { logger } = createLogger();
    nodemailerMock.sendMail.mockResolvedValueOnce({ accepted: ["mahesh@defenseeye.ai"] }).mockResolvedValueOnce({ accepted: ["ada@example.com"] });

    const result = await processContactInquiry(
      {
        ...contactBody,
        inquiryType: "Secure AI Adoption",
        need: "AI governance and risk management",
        aiAdoptionStage: "Evaluating use cases",
        timeline: "Immediate",
        message: "We work in a regulated environment and need to think through compliance-sensitive AI governance.",
      },
      smtpEnv,
      logger
    );

    const confirmation = nodemailerMock.sendMail.mock.calls[1][0];
    expect(result.status).toBe(200);
    expect(confirmation.subject).toBe("DefenseEye received your Secure AI consultation request");
    expect(confirmation.html).toContain("Explore AI Governance and Risk Management");
    expect(confirmation.html).toContain("https://defenseeye.ai/solutions/ai-governance");
    expect(confirmation.html).not.toContain("CMMC Knowledge Hub");
    expect(confirmation.html).not.toContain("NIST 800-171");
    expect(confirmation.html).not.toContain("SPRS");
    expect(confirmation.html).not.toContain("C3PAO");
    expect(confirmation.html).not.toContain("compliance automation");
  });

  it("renders clean internal HTML and plain text without artifacts or double encoding", () => {
    const rendered = renderInternalLeadEmail({
      fullName: "Ada & Grace",
      email: "ada@example.com",
      company: "Example <Co>",
      title: "CTO",
      phone: "",
      inquiryType: "Secure AI Adoption",
      need: "AI governance and risk management",
      aiAdoptionStage: "Evaluating use cases",
      timeline: "Immediate",
      message: "Line one\n<script>alert('x')</script>\nLine three & more",
      attribution: {
        utm_source: "openai",
        utm_medium: "paid",
        referrer: "https://chatgpt.com/c/example?secret=value",
        imageName: "tracking-pixel.png",
      },
      submittedAt: "2026-09-02T00:00:00.000Z",
    });

    expect(rendered.html).toContain("Example &lt;Co&gt;");
    expect(rendered.html).toContain("&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;");
    expect(rendered.html).toContain("Line one<br>");
    expect(rendered.html).toContain("chatgpt.com");
    expect(rendered.html).not.toContain("https://chatgpt.com/c/example");
    expect(rendered.html).not.toContain("imageName");
    expect(rendered.html).not.toContain("tracking-pixel.png");
    expect(rendered.html).not.toContain("&#x20;");
    expect(rendered.html).not.toContain("&amp;lt;Co&amp;gt;");
    expect(rendered.html).toContain("role=\"presentation\"");
    expect(rendered.text).toContain("Line one\n<script>alert('x')</script>");
    expect(rendered.text).toContain("Source: openai");
  });

  it("protects Reply-To and rejects header injection input", async () => {
    const { logger } = createLogger();

    const result = await processContactInquiry(
      { ...contactBody, email: "ada@example.com\r\nBcc: attacker@example.com" },
      smtpEnv,
      logger
    );

    expect(result.status).toBe(400);
    expect(nodemailerMock.createTransport).not.toHaveBeenCalled();
    expect(renderInternalLeadEmail({
      fullName: "Ada",
      email: "ada@example.com\r\nBcc: attacker@example.com",
      company: "Example Co",
      submittedAt: "2026-09-02T00:00:00.000Z",
    }).replyTo).toBeUndefined();
  });

  it("maps timeline to deterministic urgency values", () => {
    expect(deriveLeadUrgency("Immediate")).toBe("High");
    expect(deriveLeadUrgency("immediate")).toBe("High");
    expect(deriveLeadUrgency("30-60 days")).toBe("Near-term");
    expect(deriveLeadUrgency("30–60 days")).toBe("Near-term");
    expect(deriveLeadUrgency("This quarter")).toBe("Active");
    expect(deriveLeadUrgency("Next quarter")).toBe("Planned");
    expect(deriveLeadUrgency("Exploring options")).toBe("Exploratory");
    expect(deriveLeadUrgency("")).toBe("Unknown");
    expect(deriveLeadUrgency("Someday")).toBe("Unknown");
  });

  it("maps stage and need to deterministic discovery focus", () => {
    const focus = deriveDiscoveryFocus("Evaluating use cases", "AI governance and risk management", "Immediate");

    expect(focus).toContain("priority use case");
    expect(focus).toContain("governance accountability");
    expect(focus).toContain("near-term decision");
    expect(focus).not.toContain("budget");
    expect(focus).not.toContain("guarantee");
  });

  it("falls back safely for missing and unexpected discovery values", () => {
    const focus = deriveDiscoveryFocus(undefined, "Unexpected need", undefined);

    expect(deriveLeadUrgency(undefined)).toBe("Unknown");
    expect(focus).toContain("Clarify the AI initiative");
    expect(focus).toContain("without assuming unsubmitted facts");
    expect(focus).not.toContain("budget");
    expect(focus).not.toContain("regulatory obligation");
  });

  it("adds objective qualification gaps for personal email, missing phone, and missing attribution", () => {
    const rendered = renderInternalLeadEmail({
      fullName: "Ada Lovelace",
      email: "ada@gmail.com",
      company: "Example Co",
      inquiryType: "Secure AI Adoption",
      aiAdoptionStage: "Exploring opportunities",
      need: "Other",
      submittedAt: "2026-09-02T00:00:00.000Z",
      attribution: {},
    });

    expect(rendered.html).toContain("Phone not provided");
    expect(rendered.html).toContain("Job title not provided");
    expect(rendered.html).toContain("Personal email domain used");
    expect(rendered.html).toContain("Campaign attribution unavailable");
    expect(rendered.html).toContain("Direct / unattributed");
    expect(rendered.html).toContain("Medium");
    expect(rendered.html).toContain("Not available");
  });

  it("does not flag corporate email domains as personal email", () => {
    const rendered = renderInternalLeadEmail({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      company: "Example Co",
      title: "CTO",
      phone: "555-0100",
      inquiryType: "Secure AI Adoption",
      attribution: { utm_source: "openai" },
      submittedAt: "2026-09-02T00:00:00.000Z",
    });

    expect(rendered.html).not.toContain("Personal email domain used");
  });

  it("includes provided role in internal notification and marks omitted role neutrally", () => {
    const withRole = renderInternalLeadEmail({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      company: "Example Co",
      title: "Chief AI Officer",
      inquiryType: "Secure AI Adoption",
      attribution: { utm_source: "internal" },
      submittedAt: "2026-09-02T00:00:00.000Z",
    });
    const withoutRole = renderInternalLeadEmail({
      fullName: "Grace Hopper",
      email: "grace@example.com",
      company: "Example Co",
      inquiryType: "Secure AI Adoption",
      attribution: { utm_source: "internal" },
      submittedAt: "2026-09-02T00:00:00.000Z",
    });

    expect(withRole.html).toContain("Chief AI Officer");
    expect(withRole.html).not.toContain("Job title not provided");
    expect(withoutRole.html).toContain("Job title not provided");
  });

  it("renders complete attributed lead details without arbitrary attribution keys", () => {
    const rendered = renderInternalLeadEmail({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      company: "Example Co",
      title: "CTO",
      phone: "555-0100",
      inquiryType: "Secure AI Adoption",
      need: "Microsoft Copilot or Azure OpenAI readiness",
      aiAdoptionStage: "Preparing to scale",
      timeline: "Next quarter",
      message: "",
      submittedAt: "2026-09-02T00:00:00.000Z",
      attribution: {
        landing_pathname: "/secure-ai-adoption",
        referrer_domain: "chatgpt.com",
        utm_source: "openai",
        utm_medium: "paid",
        utm_campaign: "secure_ai_adoption",
        utm_content: "ad_1",
        campaign_id: "cmp_123",
        ad_group_id: "grp_456",
        ad_id: "ad_789",
        ad_account_id: "acct_321",
        oppref: "opp_abc",
        arbitrary_query: "should-not-render",
      },
    });

    expect(rendered.html).toContain("Landing Pathname");
    expect(rendered.html).toContain("/secure-ai-adoption");
    expect(rendered.html).toContain("Referrer Domain");
    expect(rendered.html).toContain("chatgpt.com");
    expect(rendered.html).toContain("cmp_123");
    expect(rendered.html).toContain("grp_456");
    expect(rendered.html).toContain("opp_abc");
    expect(rendered.html).not.toContain("arbitrary_query");
    expect(rendered.html).not.toContain("should-not-render");
  });

  it("sanitizes landing pathname and referrer domain from client-supplied attribution", () => {
    const rendered = renderInternalLeadEmail({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      company: "Example Co",
      inquiryType: "Secure AI Adoption",
      submittedAt: "2026-09-02T00:00:00.000Z",
      attribution: {
        landing_pathname: "/secure-ai-adoption?secret=value",
        referrer_domain: "chatgpt.com/path?secret=value",
        referrer: "https://chatgpt.com/c/thread?private=value",
      },
    });

    expect(rendered.html).toContain("Landing Pathname");
    expect(rendered.html).toContain("Referrer Domain");
    expect(rendered.html).toContain("chatgpt.com");
    expect(rendered.html).not.toContain("secret=value");
    expect(rendered.html).not.toContain("/c/thread");
  });

  it("defaults internal notification recipient to mahesh when no recipient env var is set", async () => {
    const { logger } = createLogger();
    const { CONTACT_NOTIFICATION_EMAIL, ...envWithoutRecipient } = smtpEnv;
    nodemailerMock.sendMail.mockResolvedValueOnce({ accepted: ["mahesh@defenseeye.ai"] }).mockResolvedValueOnce({ accepted: ["ada@example.com"] });

    const result = await processContactInquiry(contactBody, envWithoutRecipient, logger);

    expect(result.status).toBe(200);
    expect(nodemailerMock.sendMail.mock.calls[0][0].to).toBe("mahesh@defenseeye.ai");
  });

  it("required notification failure returns non-2xx", async () => {
    const { logger } = createLogger();
    nodemailerMock.sendMail.mockRejectedValueOnce(new Error("SMTP rejected credentials"));

    const result = await processContactInquiry(contactBody, smtpEnv, logger);

    expect(result.status).toBe(502);
    expect(result.body).toMatchObject({ error: "contact_delivery_failed" });
    expect(nodemailerMock.sendMail).toHaveBeenCalledTimes(1);
  });

  it("empty SMTP accepted-recipient list returns non-2xx when available", async () => {
    const { logger } = createLogger();
    nodemailerMock.sendMail.mockResolvedValueOnce({ accepted: [] });

    const result = await processContactInquiry(contactBody, smtpEnv, logger);

    expect(result.status).toBe(502);
    expect(result.body).toMatchObject({ error: "contact_delivery_rejected" });
    expect(nodemailerMock.sendMail).toHaveBeenCalledTimes(1);
  });

  it("optional customer confirmation failure still returns 2xx", async () => {
    const { logger } = createLogger();
    nodemailerMock.sendMail.mockResolvedValueOnce({ accepted: ["mahesh@defenseeye.ai"] }).mockRejectedValueOnce(new Error("Mailbox unavailable"));

    const result = await processContactInquiry(contactBody, smtpEnv, logger);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true });
    expect(nodemailerMock.sendMail).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("confirmation_failed"));
  });

  it("validation failure returns non-2xx", async () => {
    const { logger } = createLogger();

    const result = await processContactInquiry({ ...contactBody, email: "" }, smtpEnv, logger);

    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({ error: "validation_failed" });
    expect(nodemailerMock.createTransport).not.toHaveBeenCalled();
  });

  it("error responses expose no SMTP or credential details", async () => {
    const { logger } = createLogger();
    nodemailerMock.sendMail.mockRejectedValueOnce(new Error("smtp.example.test smtp-password mahesh@defenseeye.ai"));

    const result = await processContactInquiry(contactBody, smtpEnv, logger);
    const serialized = JSON.stringify(result.body);

    expect(serialized).not.toContain("smtp.example.test");
    expect(serialized).not.toContain("smtp-password");
    expect(serialized).not.toContain("mahesh@defenseeye.ai");
    expect(serialized).not.toContain("ada@example.com");
    expect(serialized).not.toContain("Example Co");
  });

  it("logs contain no form PII", async () => {
    const { logger, logs } = createLogger();
    nodemailerMock.sendMail.mockResolvedValueOnce({ accepted: ["mahesh@defenseeye.ai"] }).mockRejectedValueOnce(new Error("Mailbox unavailable"));

    await processContactInquiry(contactBody, smtpEnv, logger);
    const serializedLogs = logs.join("\n");

    expect(serializedLogs).not.toContain("Ada");
    expect(serializedLogs).not.toContain("Lovelace");
    expect(serializedLogs).not.toContain("ada@example.com");
    expect(serializedLogs).not.toContain("Example Co");
    expect(serializedLogs).not.toContain("555-0100");
    expect(serializedLogs).not.toContain("Please contact me.");
    expect(serializedLogs).not.toContain("smtp.example.test");
    expect(serializedLogs).not.toContain("smtp-password");
  });
});
