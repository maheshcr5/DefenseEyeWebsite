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

import { processContactInquiry } from "./index";

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
    expect(notification.html).toContain("Contact Information");
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
    expect(notification.html).toContain("Submitted At");
    expect(notification.html).toContain("Inquiry Type");
    expect(notification.html).toContain("Secure AI Adoption");
    expect(notification.html).not.toContain("Target CMMC Level");
    expect(notification.html).not.toContain("Biggest Challenge");
    expect(confirmation.to).toBe("ada@example.com");
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
