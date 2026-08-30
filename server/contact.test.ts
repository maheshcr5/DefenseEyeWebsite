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
    nodemailerMock.sendMail.mockResolvedValueOnce({ accepted: ["enterprise@defenseeye.ai"] }).mockResolvedValueOnce({ accepted: ["ada@example.com"] });

    const result = await processContactInquiry(contactBody, smtpEnv, logger);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true });
    expect(nodemailerMock.sendMail).toHaveBeenCalledTimes(2);
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
    nodemailerMock.sendMail.mockResolvedValueOnce({ accepted: ["enterprise@defenseeye.ai"] }).mockRejectedValueOnce(new Error("Mailbox unavailable"));

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
    nodemailerMock.sendMail.mockRejectedValueOnce(new Error("smtp.example.test smtp-password enterprise@defenseeye.ai"));

    const result = await processContactInquiry(contactBody, smtpEnv, logger);
    const serialized = JSON.stringify(result.body);

    expect(serialized).not.toContain("smtp.example.test");
    expect(serialized).not.toContain("smtp-password");
    expect(serialized).not.toContain("enterprise@defenseeye.ai");
    expect(serialized).not.toContain("ada@example.com");
    expect(serialized).not.toContain("Example Co");
  });

  it("logs contain no form PII", async () => {
    const { logger, logs } = createLogger();
    nodemailerMock.sendMail.mockResolvedValueOnce({ accepted: ["enterprise@defenseeye.ai"] }).mockRejectedValueOnce(new Error("Mailbox unavailable"));

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
