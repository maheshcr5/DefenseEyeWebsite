import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";
import { registerCopilotRoutes } from "./copilot";
import {
  canonicalUrl,
  getSeoRoute,
  renderRouteFallbackHtml,
  renderRouteSchemaScript,
  renderSitemapXml,
} from "../shared/seoRoutes";
import { getRouteMetadata, type RouteMetadata } from "../shared/routeMetadata";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Simple in-memory rate limiter ───────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;        // requests per window
const RATE_WINDOW = 60_000;   // 1 minute in ms

function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return next();
  }
  entry.count++;
  if (entry.count > RATE_LIMIT) {
    res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000).toString());
    return res.status(429).json({ error: "Rate limit exceeded. Max 60 requests/minute." });
  }
  next();
}

type ContactRequestBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  title?: string;
  phone?: string;
  inquiryType?: string;
  need?: string;
  aiAdoptionStage?: string;
  companySize?: string;
  cmmcLevel?: string;
  challenge?: string;
  timeline?: string;
  message?: string;
  attribution?: unknown;
};

type ContactLogger = Pick<Console, "log" | "warn" | "error">;

type ContactResult = {
  status: number;
  body: { success: true } | { error: string; message: string };
};

const CONTACT_FAILURE_MESSAGE = "We could not process your inquiry right now. Please try again later.";
const DEFAULT_CONTACT_NOTIFICATION_EMAIL = "mahesh@defenseeye.ai";

function hasRequiredSmtpConfig(env: NodeJS.ProcessEnv) {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

function hasAcceptedRecipient(sendMailResult: unknown) {
  if (!sendMailResult || typeof sendMailResult !== "object" || !("accepted" in sendMailResult)) {
    return true;
  }
  const accepted = (sendMailResult as { accepted?: unknown }).accepted;
  return Array.isArray(accepted) && accepted.length > 0;
}

function contactFailure(status: number, error: string): ContactResult {
  return {
    status,
    body: {
      error,
      message: CONTACT_FAILURE_MESSAGE,
    },
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeSubjectValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function displayValue(value: unknown, fallback = "Not provided") {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function isAttributionRecord(attribution: unknown): attribution is Record<string, unknown> {
  if (!attribution || typeof attribution !== "object" || Array.isArray(attribution)) {
    return false;
  }
  return true;
}

function getAttributionValue(attribution: unknown, key: string, fallback = "Not available") {
  if (!isAttributionRecord(attribution)) return fallback;
  return displayValue(attribution[key], fallback);
}

function getFirstAttributionValue(attribution: unknown, keys: string[]) {
  for (const key of keys) {
    const value = getAttributionValue(attribution, key);
    if (value !== "Not available") return value;
  }
  return "Not available";
}

const FREE_EMAIL_DOMAINS = new Set(["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]);

function sanitizeEmailAddress(value: unknown) {
  if (typeof value !== "string") return undefined;
  const email = value.trim();
  if (!email || /[\r\n]/.test(email)) return undefined;
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return undefined;
  return email;
}

function getEmailDomain(email: string) {
  return email.split("@").pop()?.toLowerCase() || "";
}

function sanitizeLandingPathname(value: string) {
  if (!value.startsWith("/") || value.startsWith("//") || /[?#\r\n]/.test(value)) return "Not available";
  return value;
}

function sanitizeHostname(value: string) {
  const hostname = value.trim().replace(/^www\./, "").toLowerCase();
  if (!hostname || /[/?#:@\s\r\n]/.test(hostname)) return "Not available";
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(hostname)) return "Not available";
  return hostname;
}

function getLandingPathname(attribution: unknown) {
  const pathname = getAttributionValue(attribution, "landing_pathname");
  return pathname === "Not available" ? pathname : sanitizeLandingPathname(pathname);
}

function getReferrerDomain(attribution: unknown) {
  const explicitDomain = getAttributionValue(attribution, "referrer_domain");
  if (explicitDomain !== "Not available") {
    const sanitizedDomain = sanitizeHostname(explicitDomain);
    if (sanitizedDomain !== "Not available") return sanitizedDomain;
  }

  const referrer = getAttributionValue(attribution, "referrer");
  if (referrer === "Not available") return "Not available";

  try {
    return sanitizeHostname(new URL(referrer).hostname);
  } catch {
    return "Not available";
  }
}

export function deriveLeadUrgency(timeline: unknown) {
  const value = displayValue(timeline, "").toLowerCase();
  if (!value) return "Unknown";
  if (value === "immediate") return "High";
  if (value === "30-60 days" || value === "30–60 days") return "Near-term";
  if (value === "this quarter") return "Active";
  if (value === "next quarter") return "Planned";
  if (value === "exploring options") return "Exploratory";
  return "Unknown";
}

export function deriveDiscoveryFocus(stage: unknown, need: unknown, timeline: unknown) {
  const stageValue = displayValue(stage, "").toLowerCase();
  const needValue = displayValue(need, "").toLowerCase();
  const urgency = deriveLeadUrgency(timeline);

  const stageFocus =
    stageValue.includes("exploring") ? "Clarify promising use cases, decision criteria, sensitive data boundaries, and what would make a first conversation useful." :
    stageValue.includes("evaluating") ? "Clarify the priority use case, sensitive data and systems involved, consequential actions, and current decision criteria." :
    stageValue.includes("pilot") ? "Review pilot scope, controls already in place, evaluation approach, integration needs, and the next implementation milestone." :
    stageValue.includes("scale") ? "Identify scale constraints, governance ownership, architecture patterns, operating controls, and rollout sequencing." :
    stageValue.includes("operating") ? "Review deployed AI workflows, oversight model, access controls, evaluation evidence, and improvement priorities." :
    "Clarify the AI initiative, risk context, stakeholders, and practical next steps.";

  const needFocus =
    needValue.includes("governance") || needValue.includes("risk") ? "Pay particular attention to governance accountability, risk controls, human oversight, and NIST AI RMF alignment." :
    needValue.includes("architecture") ? "Pay particular attention to identity, data access, integration architecture, logging, and secure deployment patterns." :
    needValue.includes("implementation") ? "Pay particular attention to agent workflow design, integration dependencies, evaluation, and operational controls." :
    needValue.includes("copilot") || needValue.includes("azure openai") ? "Pay particular attention to Microsoft platform readiness, tenant/data controls, identity, and adoption guardrails." :
    needValue.includes("readiness") || needValue.includes("use-case") ? "Pay particular attention to use-case prioritization, readiness gaps, data sensitivity, and governance prerequisites." :
    "Use the submitted primary need to focus the conversation without assuming unsubmitted facts.";

  const timelineFocus = urgency === "High" || urgency === "Near-term" ? "Confirm the near-term decision or implementation milestone." : "Confirm expected timing and decision path.";
  return `${stageFocus} ${needFocus} ${timelineFocus}`;
}

function normalizeSource(attribution: unknown) {
  const source = getAttributionValue(attribution, "utm_source");
  return source === "Not available" ? "Direct / unattributed" : source;
}

function getAttributionRows(attribution: unknown): Array<[string, string]> {
  return [
    ["Source", normalizeSource(attribution)],
    ["Medium", getAttributionValue(attribution, "utm_medium")],
    ["Landing Pathname", getLandingPathname(attribution)],
    ["Referrer Domain", getReferrerDomain(attribution)],
    ["Campaign", getAttributionValue(attribution, "utm_campaign")],
    ["Ad", getAttributionValue(attribution, "utm_content")],
    ["Campaign ID", getFirstAttributionValue(attribution, ["campaign_id", "openai_campaign_id"])],
    ["Ad Group ID", getFirstAttributionValue(attribution, ["ad_group_id", "openai_ad_group_id"])],
    ["Ad ID", getAttributionValue(attribution, "ad_id")],
    ["Ad Account ID", getAttributionValue(attribution, "ad_account_id")],
    ["OpenAI Click Reference / oppref", getAttributionValue(attribution, "oppref")],
  ];
}

function getQualificationGaps(email: string | undefined, title: unknown, phone: unknown, attribution: unknown) {
  const gaps: string[] = [];
  if (displayValue(title, "") === "") gaps.push("Job title not provided");
  if (displayValue(phone, "") === "") gaps.push("Phone not provided");
  if (email && FREE_EMAIL_DOMAINS.has(getEmailDomain(email))) gaps.push("Personal email domain used");
  if (normalizeSource(attribution) === "Direct / unattributed" && getAttributionValue(attribution, "utm_campaign") === "Not available") {
    gaps.push("Campaign attribution unavailable");
  }
  return gaps;
}

function htmlValue(value: string) {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, "<br>");
}

function renderEmailSection(title: string, rows: Array<[string, string]>) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:24px 0 8px;">
      <tr>
        <td style="padding:0 0 10px 0;color:#00D4FF;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;line-height:22px;">${escapeHtml(title)}</td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;margin-bottom:8px;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td width="38%" style="padding:10px 12px;background-color:#131f35;border-bottom:1px solid #1e2d4a;font-weight:700;color:#00D4FF;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;background-color:#0d1a2d;border-bottom:1px solid #1e2d4a;color:#e8eaf0;vertical-align:top;word-break:break-word;">${htmlValue(value)}</td>
        </tr>`
        )
        .join("")}
    </table>
  `;
}

function renderTextSection(title: string, rows: Array<[string, string]>) {
  return [
    title,
    "-".repeat(title.length),
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
  ].join("\n");
}

type CustomerResource = {
  label: string;
  url: string;
  description: string;
};

const SECURE_AI_RESOURCE_FALLBACK: CustomerResource = {
  label: "Explore DefenseEye Secure AI Services",
  url: "https://defenseeye.ai/secure-ai-adoption",
  description: "While you wait, learn more about how DefenseEye helps regulated organizations move from AI exploration to governed, secure implementation.",
};

const SECURE_AI_RESOURCE_BY_NEED = new Map<string, CustomerResource>([
  [
    "Use-case and readiness assessment",
    {
      label: "Explore Secure AI Readiness and Transformation",
      url: "https://defenseeye.ai/solutions/ai-transformation",
      description: "While you wait, learn more about how DefenseEye helps organizations prioritize AI use cases, readiness needs, and practical transformation paths.",
    },
  ],
  [
    "Secure AI architecture",
    {
      label: "Explore Secure AI Security and Architecture",
      url: "https://defenseeye.ai/solutions/ai-security",
      description: "While you wait, learn more about how DefenseEye helps organizations plan secure AI architecture, data controls, identity, and integration patterns.",
    },
  ],
  [
    "AI governance and risk management",
    {
      label: "Explore AI Governance and Risk Management",
      url: "https://defenseeye.ai/solutions/ai-governance",
      description: "While you wait, learn more about how DefenseEye helps organizations establish practical AI governance, accountability, oversight, and risk controls.",
    },
  ],
  [
    "Agentic AI implementation",
    {
      label: "Explore Secure Agentic AI Implementation",
      url: "https://defenseeye.ai/secure-ai-adoption",
      description: "While you wait, learn more about how DefenseEye helps organizations implement agentic AI with secure architecture, governance, and delivery support.",
    },
  ],
  [
    "Microsoft Copilot or Azure OpenAI readiness",
    {
      label: "Explore Microsoft Copilot Readiness",
      url: "https://defenseeye.ai/solutions/microsoft-copilot-readiness",
      description: "While you wait, learn more about how DefenseEye helps organizations prepare for Microsoft Copilot and Azure OpenAI with security and governance controls.",
    },
  ],
]);

function getCustomerResource(inquiryType: unknown, need: unknown): CustomerResource | undefined {
  const inquiry = displayValue(inquiryType, "");
  const selectedNeed = displayValue(need, "");
  if (inquiry === "Secure AI Adoption") {
    return SECURE_AI_RESOURCE_BY_NEED.get(selectedNeed) || SECURE_AI_RESOURCE_FALLBACK;
  }

  if (/\b(cmmc|cmmclens|compliance automation)\b/i.test(inquiry)) {
    return {
      label: "CMMC Knowledge Hub",
      url: "https://defenseeye.ai/knowledge-hub",
      description: "While you wait, explore the DefenseEye CMMC Knowledge Hub for plain-English guides on CMMC Level 2, NIST 800-171, SPRS scoring, and C3PAO assessment preparation.",
    };
  }

  return undefined;
}

export function renderCustomerConfirmationEmail(input: {
  firstName: string;
  company: string;
  inquiryType?: string;
  need?: string;
  aiAdoptionStage?: string;
  timeline?: string;
}) {
  const { firstName, company, inquiryType, need, aiAdoptionStage, timeline } = input;
  const isSecureAiLead = inquiryType === "Secure AI Adoption";
  const resource = getCustomerResource(inquiryType, need);
  const subject = isSecureAiLead ? "DefenseEye received your Secure AI consultation request" : "We received your DefenseEye inquiry";
  const opening = isSecureAiLead
    ? "Thank you for reaching out to DefenseEye. Our team will review your request and contact you within one business day to discuss your AI use case, security and governance priorities, architecture needs, and practical implementation next steps."
    : "Thank you for reaching out to DefenseEye. Our team will review your request and contact you within one business day to discuss your AI, cybersecurity, governance, risk, or compliance automation goals.";
  const footerText = isSecureAiLead
    ? "DefenseEye, Inc. · defenseeye.ai · Secure AI readiness, governance, architecture, and implementation support"
    : "DefenseEye, Inc. · defenseeye.ai · AI, cybersecurity, governance, risk, and compliance automation";
  const textFooter = isSecureAiLead
    ? "DefenseEye, Inc. - defenseeye.ai - Secure AI readiness, governance, architecture, and implementation support"
    : "DefenseEye, Inc. - defenseeye.ai - AI, cybersecurity, governance, risk, and compliance automation";
  const summaryRows: Array<[string, string]> = [
    ["Company", displayValue(company, "TBD")],
    ["Inquiry Type", displayValue(inquiryType || need, "TBD")],
  ];
  if (isSecureAiLead) {
    summaryRows.push(["AI Adoption Stage", displayValue(aiAdoptionStage, "TBD")]);
    summaryRows.push(["Primary Need", displayValue(need, "TBD")]);
  }
  summaryRows.push(["Timeline", displayValue(timeline, "TBD")]);

  const resourceHtml = resource
    ? `
      <tr>
        <td style="padding:0 28px 24px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;">
          ${escapeHtml(resource.description)}
          <a href="${escapeHtml(resource.url)}" style="color:#00D4FF;text-decoration:underline;">${escapeHtml(resource.label)}</a>.
        </td>
      </tr>`
    : "";
  const resourceText = resource ? `${resource.description} ${resource.label}: ${resource.url}` : "";
  const html = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background-color:#07111f;margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:collapse;background-color:#0A1628;color:#e8eaf0;font-family:Arial,Helvetica,sans-serif;">
            <tr>
              <td style="padding:28px 28px 16px;text-align:center;">
                <h1 style="color:#00D4FF;font-size:22px;line-height:28px;margin:0;">We received your request, ${escapeHtml(displayValue(firstName, "there"))}!</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 4px;color:#cbd5e1;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:25px;">${escapeHtml(opening)}</td>
            </tr>
            <tr>
              <td style="padding:20px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background-color:#131f35;border:1px solid #1e3a5f;">
                  <tr>
                    <td colspan="2" style="padding:16px 16px 8px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Your submission summary</td>
                  </tr>
                  ${summaryRows
                    .map(
                      ([label, value]) => `
                  <tr>
                    <td width="38%" style="padding:8px 16px;color:#00D4FF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;vertical-align:top;">${escapeHtml(label)}</td>
                    <td style="padding:8px 16px;color:#e8eaf0;font-family:Arial,Helvetica,sans-serif;font-size:14px;vertical-align:top;word-break:break-word;">${escapeHtml(value)}</td>
                  </tr>`
                    )
                    .join("")}
                </table>
              </td>
            </tr>
            ${resourceHtml}
            <tr>
              <td style="padding:0 28px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
                  <tr><td style="border-top:1px solid #1e2d4a;font-size:1px;line-height:1px;">&nbsp;</td></tr>
                  <tr><td style="padding-top:18px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#6b7280;text-align:center;">${escapeHtml(footerText)}</td></tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
  const text = [
    `We received your request, ${displayValue(firstName, "there")}!`,
    "",
    opening,
    "",
    renderTextSection("Your submission summary", summaryRows),
    resourceText,
    "",
    textFooter,
  ].filter(Boolean).join("\n");

  return { subject, html, text };
}

export function renderInternalLeadEmail(input: {
  fullName: string;
  email: string;
  company: string;
  title?: string;
  phone?: string;
  inquiryType?: string;
  need?: string;
  aiAdoptionStage?: string;
  companySize?: string;
  cmmcLevel?: string;
  challenge?: string;
  timeline?: string;
  message?: string;
  attribution?: unknown;
  submittedAt: string;
}) {
  const {
    fullName,
    email,
    company,
    title,
    phone,
    inquiryType,
    need,
    aiAdoptionStage,
    companySize,
    cmmcLevel,
    challenge,
    timeline,
    message,
    attribution,
    submittedAt,
  } = input;
  const safeReplyTo = sanitizeEmailAddress(email);
  const isSecureAiLead = inquiryType === "Secure AI Adoption";
  const attributionRows = getAttributionRows(attribution);
  const qualificationGaps = getQualificationGaps(safeReplyTo, title, phone, attribution);
  const snapshotRows: Array<[string, string]> = isSecureAiLead
    ? [
        ["Inquiry", displayValue(inquiryType)],
        ["Stage", displayValue(aiAdoptionStage)],
        ["Primary Need", displayValue(need)],
        ["Urgency", deriveLeadUrgency(timeline)],
        ["Source", normalizeSource(attribution)],
      ]
    : [
        ["Inquiry", displayValue(inquiryType)],
        ["Primary Need", displayValue(need)],
        ["Urgency", deriveLeadUrgency(timeline)],
        ["Source", normalizeSource(attribution)],
      ];
  const contactRows: Array<[string, string]> = [
    ["Name", displayValue(fullName)],
    ["Work Email", displayValue(email)],
    ["Job Title", displayValue(title)],
    ["Company", displayValue(company)],
    ["Phone", displayValue(phone)],
  ];
  const initiativeRows: Array<[string, string]> = isSecureAiLead
    ? [
        ["AI Adoption Stage", displayValue(aiAdoptionStage)],
        ["Primary Need", displayValue(need)],
        ["Desired Timeline", displayValue(timeline)],
      ]
    : [
        ["Primary Need", displayValue(need)],
        ["Company Size", displayValue(companySize)],
        ["Target CMMC Level", displayValue(cmmcLevel)],
        ["Compliance Timeline", displayValue(timeline)],
        ["Biggest Challenge", displayValue(challenge)],
      ];
  const discoveryRows: Array<[string, string]> = [["Suggested Discovery Focus", deriveDiscoveryFocus(aiAdoptionStage, need, timeline)]];
  const gapRows: Array<[string, string]> = [
    ["Objective Gaps", qualificationGaps.length > 0 ? qualificationGaps.join("\n") : "No qualification gaps identified from the submitted fields."],
  ];
  const conversationRows: Array<[string, string]> = [["Additional Context", displayValue(message)]];
  const submissionRows: Array<[string, string]> = [
    ["Submitted At", submittedAt],
    ["Inquiry Type", displayValue(inquiryType)],
  ];

  const replyLine = safeReplyTo
    ? `Reply directly to this email to respond to ${displayValue(fullName)} at ${safeReplyTo}.`
    : "Reply-To was omitted because the submitted email address was invalid.";
  const html = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background-color:#07111f;margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="720" cellpadding="0" cellspacing="0" style="width:100%;max-width:720px;border-collapse:collapse;background-color:#0A1628;color:#e8eaf0;font-family:Arial,Helvetica,sans-serif;">
            <tr>
              <td style="padding:28px 24px 12px;text-align:center;">
                <h1 style="color:#00D4FF;font-size:22px;line-height:28px;margin:0;">${isSecureAiLead ? "New Secure AI Consultation Request" : "New DefenseEye Inquiry"}</h1>
                <p style="color:#9ca3af;font-size:14px;line-height:20px;margin:8px 0 0;">Submitted via defenseeye.ai contact form</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 28px;">
                ${renderEmailSection("Lead Snapshot - Derived Summary", snapshotRows)}
                ${renderEmailSection("Discovery Focus - Derived Guidance", discoveryRows)}
                ${renderEmailSection("Qualification Gaps - Objective Signals", gapRows)}
                ${renderEmailSection("Submitted Details - Contact Information", contactRows)}
                ${renderEmailSection(isSecureAiLead ? "Submitted Details - AI Initiative" : "Submitted Details - Inquiry Details", initiativeRows)}
                ${renderEmailSection("Submitted Details - Conversation", conversationRows)}
                ${renderEmailSection("Submitted Details - Attribution", attributionRows)}
                ${renderEmailSection("Submitted Details - Submission", submissionRows)}
                <p style="margin:24px 0 0;font-size:12px;line-height:18px;color:#9ca3af;text-align:center;">${escapeHtml(replyLine)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
  const text = [
    isSecureAiLead ? "NEW SECURE AI CONSULTATION REQUEST" : "NEW DEFENSEEYE INQUIRY",
    "Submitted via defenseeye.ai contact form",
    "",
    renderTextSection("Lead Snapshot - Derived Summary", snapshotRows),
    renderTextSection("Discovery Focus - Derived Guidance", discoveryRows),
    renderTextSection("Qualification Gaps - Objective Signals", gapRows),
    renderTextSection("Submitted Details - Contact Information", contactRows),
    renderTextSection(isSecureAiLead ? "Submitted Details - AI Initiative" : "Submitted Details - Inquiry Details", initiativeRows),
    renderTextSection("Submitted Details - Conversation", conversationRows),
    renderTextSection("Submitted Details - Attribution", attributionRows),
    renderTextSection("Submitted Details - Submission", submissionRows),
    replyLine,
  ].join("\n");

  return { html, text, replyTo: safeReplyTo };
}

export async function processContactInquiry(
  body: ContactRequestBody,
  env: NodeJS.ProcessEnv = process.env,
  logger: ContactLogger = console
): Promise<ContactResult> {
  const requestId = randomUUID();
  const {
    firstName,
    lastName,
    email,
    company,
    title,
    phone,
    inquiryType,
    need,
    aiAdoptionStage,
    companySize,
    cmmcLevel,
    challenge,
    timeline,
    message,
    attribution,
  } = body;

  const replyTo = sanitizeEmailAddress(email);
  if (!email || !replyTo || !firstName || !company) {
    logger.warn(`[contact:${requestId}] validation_failed route=/api/contact`);
    return contactFailure(400, "validation_failed");
  }

  if (!hasRequiredSmtpConfig(env)) {
    logger.error(`[contact:${requestId}] smtp_missing route=/api/contact`);
    return contactFailure(503, "contact_delivery_unavailable");
  }

  const fullName = `${firstName} ${lastName || ""}`.trim();
  const safeCompanyForSubject = sanitizeSubjectValue(company);
  const safeNameForSubject = sanitizeSubjectValue(fullName);
  const isSecureAiLead = inquiryType === "Secure AI Adoption";
  const subject = isSecureAiLead
    ? `[DefenseEye Lead] Secure AI Adoption - ${safeCompanyForSubject} - ${safeNameForSubject}`
    : `[DefenseEye Lead] ${sanitizeSubjectValue(inquiryType || "Inquiry")} - ${safeCompanyForSubject} - ${safeNameForSubject}`;
  const submittedAt = new Date().toISOString();
  const notificationRecipient = env.CONTACT_NOTIFICATION_EMAIL || DEFAULT_CONTACT_NOTIFICATION_EMAIL;
  const notificationEmail = renderInternalLeadEmail({
    fullName,
    email,
    company,
    title,
    phone,
    inquiryType,
    need,
    aiAdoptionStage,
    companySize,
    cmmcLevel,
    challenge,
    timeline,
    message,
    attribution,
    submittedAt,
  });

  const confirmationEmail = renderCustomerConfirmationEmail({
    firstName,
    company,
    inquiryType,
    need,
    aiAdoptionStage,
    timeline,
  });

  try {
    logger.log(`[contact:${requestId}] notification_attempt route=/api/contact`);
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT || "587"),
      secure: env.SMTP_SECURE === "true",
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });

    const fromAddr = env.SMTP_FROM || env.SMTP_USER;
    const notificationResult = await transporter.sendMail({
      from: `"DefenseEye Contact Form" <${fromAddr}>`,
      to: notificationRecipient,
      replyTo: notificationEmail.replyTo,
      subject,
      text: notificationEmail.text,
      html: notificationEmail.html,
    });

    if (!hasAcceptedRecipient(notificationResult)) {
      logger.error(`[contact:${requestId}] notification_rejected route=/api/contact`);
      return contactFailure(502, "contact_delivery_rejected");
    }

    logger.log(`[contact:${requestId}] notification_accepted route=/api/contact`);

    try {
      await transporter.sendMail({
        from: `"DefenseEye Team" <${fromAddr}>`,
        to: email,
        subject: confirmationEmail.subject,
        text: confirmationEmail.text,
        html: confirmationEmail.html,
      });
      logger.log(`[contact:${requestId}] confirmation_accepted route=/api/contact`);
    } catch {
      logger.warn(`[contact:${requestId}] confirmation_failed route=/api/contact`);
    }

    return { status: 200, body: { success: true } };
  } catch {
    logger.error(`[contact:${requestId}] notification_failed route=/api/contact`);
    return contactFailure(502, "contact_delivery_failed");
  }
}

// ─── CMMC Content Chunks for AI Ingestion ─────────────────────────────────────
const CMMC_CHUNKS = [
  {
    id: "what-is-cmmc",
    topic: "CMMC Overview",
    question: "What is CMMC 2.0?",
    answer: "CMMC 2.0 (Cybersecurity Maturity Model Certification) is a DoD framework requiring defense contractors to demonstrate specific cybersecurity practices to protect Controlled Unclassified Information (CUI) and Federal Contract Information (FCI). It is being phased into all new DoD contracts starting in 2025.",
    detail: "CMMC 2.0 was introduced in November 2021 as a streamlined successor to the original CMMC framework. It has three levels: Level 1 (17 practices for FCI), Level 2 (110 NIST 800-171 controls for CUI), and Level 3 (NIST 800-172 controls for critical programs). Level 2 requires a Certified Third-Party Assessment Organization (C3PAO) for most contractors. Over 300,000 organizations in the Defense Industrial Base (DIB) are affected.",
    source: "https://defenseeye.ai/knowledge-hub/what-is-cmmc",
    last_updated: "2026-04-01",
    confidence: 1.0,
    tags: ["CMMC", "CMMC 2.0", "DoD", "cybersecurity", "defense contractors"],
  },
  {
    id: "cmmc-levels",
    topic: "CMMC Levels",
    question: "What is the difference between CMMC Level 1 and Level 2?",
    answer: "CMMC Level 1 requires 17 basic cybersecurity practices protecting Federal Contract Information (FCI) and allows annual self-assessment. Level 2 requires all 110 NIST SP 800-171 Rev 2 controls protecting Controlled Unclassified Information (CUI) and requires a C3PAO third-party assessment.",
    detail: "Level 1 covers 6 NIST 800-171 domains (access control, identification & authentication, media protection, physical protection, system & communications protection, system & information integrity). Level 2 spans all 14 domains with 110 controls. Most prime contractors and subcontractors handling CUI require Level 2. A Level 2 certification assessment by a C3PAO results in a Certificate of CMMC Status; a new certification assessment is required within three years of the CMMC Status Date.",
    source: "https://defenseeye.ai/knowledge-hub/cmmc-levels",
    last_updated: "2026-10-24",
    confidence: 1.0,
    tags: ["CMMC Level 1", "CMMC Level 2", "CUI", "FCI", "C3PAO", "NIST 800-171"],
  },
  {
    id: "sprs-score",
    topic: "SPRS Score",
    question: "What is an SPRS score and how is it calculated?",
    answer: "The Supplier Performance Risk System (SPRS) score is a numerical representation of a contractor's compliance with NIST 800-171 controls, ranging from -203 (fully non-compliant) to 110 (fully compliant). Each of the 110 controls has an assigned point value based on risk. Organizations must self-assess and submit their score to the SPRS system.",
    detail: "The DoD scoring methodology assigns negative weights to each unimplemented control. The starting score is 110, and points are deducted for each control not implemented. High-impact controls include multi-factor authentication (-5 points if missing), encryption of CUI at rest and in transit (-5 points each), and incident response plan (-3 points). The score is calculated using NIST SP 800-171A assessment procedures and submitted via the Procurement Integrated Enterprise Environment (PIEE). DFARS 252.204-7012 requires contractors to have a current SPRS score on file.",
    source: "https://defenseeye.ai/knowledge-hub/sprs-score",
    last_updated: "2026-04-01",
    confidence: 1.0,
    tags: ["SPRS score", "NIST 800-171", "DoD compliance", "cybersecurity scoring", "DFARS"],
  },
  {
    id: "evidence-mapping",
    topic: "Evidence Mapping",
    question: "What is NIST 800-171 evidence mapping for CMMC?",
    answer: "Evidence mapping is the process of collecting, organizing, and linking security artifacts (logs, policies, configurations, screenshots) to specific NIST 800-171 controls. It demonstrates to C3PAO assessors that controls are implemented and operating effectively.",
    detail: "The 14 NIST 800-171 control families are: Access Control (AC, 22 controls), Awareness & Training (AT, 3 controls), Audit & Accountability (AU, 9 controls), Configuration Management (CM, 9 controls), Identification & Authentication (IA, 11 controls), Incident Response (IR, 3 controls), Maintenance (MA, 6 controls), Media Protection (MP, 9 controls), Personnel Security (PS, 2 controls), Physical Protection (PE, 6 controls), Risk Assessment (RA, 3 controls), Security Assessment (CA, 4 controls), System & Communications Protection (SC, 16 controls), System & Information Integrity (SI, 7 controls). Evidence includes cloud configuration exports, policy documents, training records, audit logs, and vulnerability scan results.",
    source: "https://defenseeye.ai/knowledge-hub/evidence-mapping",
    last_updated: "2026-04-01",
    confidence: 1.0,
    tags: ["NIST 800-171", "evidence mapping", "C3PAO", "CMMC compliance", "control families"],
  },
  {
    id: "certification-process",
    topic: "Certification Process",
    question: "What are the steps to achieve CMMC Level 2 certification?",
    answer: "CMMC Level 2 certification involves 7 steps: (1) gap assessment, (2) SSP and POA&M creation, (3) remediation of identified gaps, (4) C3PAO selection from the CMMC Marketplace (cyberab.org/Catalog), (5) pre-assessment preparation, (6) C3PAO certification assessment, (7) receiving a Certificate of CMMC Status from the C3PAO, with a new certification assessment required within three years of the CMMC Status Date.",
    detail: "Timelines and costs vary widely with scope, current readiness, and C3PAO availability; the regulation does not set a fixed duration for readiness work or assessment. Organizations must maintain compliance after certification, with annual affirmations in SPRS. CMMCLens may reduce manual evidence collection effort depending on environment maturity, integrations, available source data, and implementation scope.",
    source: "https://defenseeye.ai/knowledge-hub/certification-process",
    last_updated: "2026-10-24",
    confidence: 1.0,
    tags: ["CMMC certification", "C3PAO", "CMMC Level 2", "SSP", "POA&M", "CMMC assessment process"],
  },
  {
    id: "cmmc-lens-product",
    topic: "DefenseEye CMMCLens",
    question: "What is CMMCLens by DefenseEye?",
    answer: "CMMCLens is DefenseEye's compliance automation platform for CMMC and NIST SP 800-171 readiness. It supports evidence automation, control mapping, gap tracking, SSP and POA&M workflows, AI-assisted policy generation, readiness dashboards, and executive reporting.",
    detail: "CMMCLens may reduce manual evidence collection effort depending on environment maturity, integrations, available source data, and implementation scope. Contact DefenseEye for current pricing and a demo (https://defenseeye.ai/lp/cmmclens-demo). DefenseEye is not a C3PAO, does not certify organizations, and does not guarantee assessment outcomes.",
    source: "https://defenseeye.ai",
    last_updated: "2026-10-24",
    confidence: 1.0,
    tags: ["CMMCLens", "DefenseEye", "CMMC automation", "AI compliance", "SPRS monitoring"],
  },
  {
    id: "dfars-cui",
    topic: "DFARS and CUI",
    question: "What is DFARS 252.204-7012 and how does it relate to CMMC?",
    answer: "DFARS clause 252.204-7012 requires DoD contractors to implement NIST SP 800-171 security controls to protect Controlled Unclassified Information (CUI), report cyber incidents within 72 hours, and preserve images of compromised systems. CMMC 2.0 Level 2 builds on these requirements by adding mandatory third-party assessment.",
    detail: "CUI (Controlled Unclassified Information) includes sensitive information created or possessed by the government or on its behalf that requires safeguarding. Examples include export-controlled technical data, procurement-sensitive information, and law enforcement data. Contractors subject to DFARS 252.204-7012 must also maintain a System Security Plan (SSP), submit an SPRS score, and flow down requirements to subcontractors. Non-compliance can result in False Claims Act liability and loss of contract eligibility.",
    source: "https://defenseeye.ai/knowledge-hub/what-is-cmmc",
    last_updated: "2026-04-01",
    confidence: 1.0,
    tags: ["DFARS", "CUI", "252.204-7012", "NIST 800-171", "DoD contracts", "cybersecurity"],
  },
  {
    id: "c3pao",
    topic: "C3PAO Assessments",
    question: "What is a C3PAO and how do you find one?",
    answer: "A C3PAO (CMMC Third-Party Assessment Organization) is an organization accredited or authorized by the CMMC Accreditation Body (The Cyber AB) to conduct CMMC Level 2 certification assessments for DoD contractors and issue Certificates of CMMC Status. Authorized C3PAOs are listed in the CMMC Marketplace at cyberab.org/Catalog.",
    detail: "C3PAO assessment duration and cost vary with organization size, scope, and complexity; request proposals from authorized C3PAOs. The assessment process includes document review (SSP, POA&M, policies), evidence review (logs, configurations, training records), interviews with personnel, and technical testing. If the assessment results in a POA&M that meets 32 CFR 170.21, the organization receives Conditional Level 2 (C3PAO) status and must close the POA&M through a closeout certification assessment within 180 days of the Conditional CMMC Status Date, or the status expires. A new Level 2 certification assessment is required within three years, and the status is affirmed in SPRS annually.",
    source: "https://defenseeye.ai/knowledge-hub/certification-process",
    last_updated: "2026-10-24",
    confidence: 1.0,
    tags: ["C3PAO", "CMMC assessment", "Cyber AB", "third-party assessment", "CMMC Level 2"],
  },
];

const PAGE_SIZE = 5;
export const HTML_CACHE_CONTROL = "no-store, no-cache, must-revalidate";
export const SITEMAP_CACHE_CONTROL = "public, max-age=3600";
export const OPERATIONAL_STATIC_CACHE_CONTROL = "public, max-age=3600";
export const HASHED_ASSET_CACHE_CONTROL = "public, max-age=31536000, immutable";

export const SECURE_AI_ROUTE_META = {
  title: getRouteMetadata("/secure-ai-adoption")!.title,
  description: getRouteMetadata("/secure-ai-adoption")!.description,
};

export function secureAiPrerenderHtml() {
  const route = getSeoRoute("/secure-ai-adoption");
  return route ? renderRouteFallbackHtml(route) : "";
}

export function injectRouteSpecificHtml(html: string, routePath: string) {
  const route = getSeoRoute(routePath);
  if (!route) return html;

  return html
    .replace(/<!-- Schema\.org:[\s\S]*?<\/script>\s*/m, "")
    .replace("</head>", `  <!-- Schema.org: Route-specific structured data -->\n${renderRouteSchemaScript(route)}\n\n  </head>`)
    .replace(
      // The root fallback ends right before the app entry script (source template)
      // or the GA4 block (built template, where Vite hoists the entry into <head>).
      /<div id="root">[\s\S]*?<\/div>\s*(?=<script type="module"|<!-- Google Analytics 4)/,
      `<div id="root">${renderRouteFallbackHtml(route)}\n    </div>\n\n    `
    );
}

export function getStaticCacheControl(filePath: string) {
  const normalizedPath = filePath.replace(/\\/g, "/");
  if (/\/assets\/[^/]+-[A-Za-z0-9_-]{6,}\.(?:js|css|woff2?|ttf|eot|otf|ico|png|jpg|jpeg|gif|svg|webp|avif)$/i.test(normalizedPath)) {
    return HASHED_ASSET_CACHE_CONTROL;
  }
  if (/\/(?:robots\.txt|sitemap_index\.xml|llms\.txt)$/i.test(normalizedPath)) {
    return OPERATIONAL_STATIC_CACHE_CONTROL;
  }
  return undefined;
}

function escapeMetaAttribute(value: string) {
  return value.replace(/"/g, "&quot;");
}

export function injectRouteMetadataHtml(
  html: string,
  routePath: string,
  routeMeta: { title: string; description: string }
) {
  const canonical = canonicalUrl(routePath === "/" ? "/" : routePath);
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${routeMeta.title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${escapeMetaAttribute(routeMeta.description)}"`
    )
    .replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${canonical}"`
    )
    .replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${escapeMetaAttribute(routeMeta.title)}"`
    )
    .replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${escapeMetaAttribute(routeMeta.description)}"`
    )
    .replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${canonical}"`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${escapeMetaAttribute(routeMeta.title)}"`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${escapeMetaAttribute(routeMeta.description)}"`
    );
}

// ─── Historical URL redirects, retired-WordPress 410s, and trailing-slash normalization ─
// Exact-match permanent redirects for historical URLs with a genuine current equivalent.
// Checked before the WordPress-retirement 410 patterns below, so an exact historical
// asset URL under a retired namespace (e.g. the capability-statement PDF under
// /wp-content/uploads/...) redirects correctly instead of falling into the 410 rule.
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/home-stage": "/",
  "/home-stage/": "/",
  "/case-studies": "/representative-engagements",
  "/case-studies/": "/representative-engagements",
  "/copilot": "/",
  "/copilot/": "/",
  "/capability-statements": "/capability-statement",
  "/capability-statements/": "/capability-statement",
  "/wp-content/uploads/2025/10/DefenseEye-Capability-Statement-Federal.pdf": "/capability-statement",
  // Consolidated duplicates (2026-10 SEO remediation). Neither URL had internal links
  // or a sitemap entry; each rendered the same intent as its target with a competing
  // title, so a permanent redirect preserves any external equity without a duplicate.
  "/services": "/services/cmmc-readiness-sprint",
  "/services/": "/services/cmmc-readiness-sprint",
  "/solutions/microsoft-copilot-enablement": "/solutions/microsoft-copilot-readiness",
  "/solutions/microsoft-copilot-enablement/": "/solutions/microsoft-copilot-readiness",
  // Thin template page competing with the full fixed-scope sprint offer for the same
  // intent; its one unique FAQ now lives on the target page.
  "/cmmc-readiness-sprint": "/services/cmmc-readiness-sprint",
  "/cmmc-readiness-sprint/": "/services/cmmc-readiness-sprint",
};

// Confirmed-retired URLs with no legitimate replacement: author archives from a
// removed blog-author taxonomy, a removed careers page, an unused analytics-proxy
// probe path (Umami itself is hosted on a separate analytics.* subdomain — see
// VITE_ANALYTICS_ENDPOINT — so "/umami" on the apex site is not a live integration),
// a literal "/$" template-artifact probe, an unverifiable historical SaaS landing
// page, a historical blog URL with no substantially equivalent current post, and a
// historical ISO 42001 readiness landing page: no ISO 42001 content exists anywhere
// in this repository, and /solutions/ai-governance (generic AI governance/NIST AI RMF
// consulting) is not a sufficiently equivalent replacement for an ISO 42001-specific
// readiness page — redirecting to it would be an irrelevant/soft-404-adjacent signal.
// A dedicated ISO 42001 readiness page is a deferred content opportunity, not a
// redirect target, until that page actually exists.
const RETIRED_EXACT_PATHS = new Set<string>([
  "/author/siva",
  "/author/siva/",
  "/author/mc",
  "/author/mc/",
  "/careers-2",
  "/careers-2/",
  "/umami",
  "/umami/",
  "/$",
  "/$/",
  "/saas-landing",
  "/saas-landing/",
  "/lp/iso-42001-readiness",
  "/lp/iso-42001-readiness/",
  "/2025/12/24/the-ultimate-cmmc-2-0-level-2-checklist-for-small-businesses-2025",
  "/2025/12/24/the-ultimate-cmmc-2-0-level-2-checklist-for-small-businesses-2025/",
]);

// Retired WordPress namespaces and PHP entry points. This site has never run
// WordPress (see git history), so these are exclusively bot/scanner probes.
const RETIRED_PATH_PATTERNS: RegExp[] = [
  /^\/wp-content(\/.*)?$/i,
  /^\/wp-admin(\/.*)?$/i,
  /^\/wp-includes(\/.*)?$/i,
  /^\/wp-[a-z0-9_-]*\.php$/i,
];

const TRAILING_SLASH_EXEMPT_PREFIXES = ["/api/"];
const TRAILING_SLASH_EXEMPT_EXACT = new Set(["/sitemap.xml", "/robots.txt"]);

function hasFileExtension(pathname: string) {
  const lastSegment = pathname.split("/").pop() || "";
  return /\.[a-z0-9]+$/i.test(lastSegment);
}

export type UrlDisposition =
  | { kind: "redirect"; status: 301 | 308; location: string }
  | { kind: "gone" }
  | { kind: "pass" };

/**
 * Resolves what an incoming request path should do before it reaches the SPA
 * fallback: a historical redirect, a 410 for a confirmed-retired URL, a
 * trailing-slash-to-canonical redirect for a real known route, or pass-through
 * to ordinary 404/200 handling. `isKnownRoute` should report whether a path
 * (without trailing slash) resolves to real route metadata.
 */
export function resolveUrlDisposition(
  pathname: string,
  isKnownRoute: (path: string) => boolean
): UrlDisposition {
  const historicalRedirect = LEGACY_REDIRECTS[pathname];
  if (historicalRedirect) {
    return { kind: "redirect", status: 301, location: historicalRedirect };
  }

  if (RETIRED_EXACT_PATHS.has(pathname) || RETIRED_PATH_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return { kind: "gone" };
  }

  if (
    pathname.length > 1 &&
    pathname.endsWith("/") &&
    !TRAILING_SLASH_EXEMPT_EXACT.has(pathname) &&
    !TRAILING_SLASH_EXEMPT_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    const stripped = pathname.slice(0, -1);
    if (!hasFileExtension(stripped) && isKnownRoute(stripped)) {
      return { kind: "redirect", status: 308, location: stripped };
    }
  }

  return { kind: "pass" };
}

// ─── Preferred hostname and protocol ─────────────────────────────────────────
// The canonical origin is https://defenseeye.ai. Requests that reach the app on
// www.defenseeye.ai, or over plain HTTP through the reverse proxy (which sets
// X-Forwarded-Proto), get exactly one redirect: straight to the canonical origin
// and the *final* path, folding in any legacy or trailing-slash redirect so no
// redirect chain is created. Other hosts (localhost, 127.0.0.1 health checks)
// are never redirected, and the Host header is never reflected into the target.
export const CANONICAL_HOST = "defenseeye.ai";
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
const ALTERNATE_HOSTS = new Set([`www.${CANONICAL_HOST}`]);

export function resolveCanonicalRedirect(
  request: { host?: string; forwardedProto?: string; path: string; search: string },
  isKnownRoute: (path: string) => boolean
): string | null {
  const host = (request.host ?? "").trim().toLowerCase().replace(/:\d+$/, "");
  const protocol = (request.forwardedProto ?? "").split(",")[0].trim().toLowerCase();
  const isAlternateHost = ALTERNATE_HOSTS.has(host);
  const isPlainHttpOnCanonicalHost = host === CANONICAL_HOST && protocol === "http";
  if (!isAlternateHost && !isPlainHttpOnCanonicalHost) return null;

  const disposition = resolveUrlDisposition(request.path, isKnownRoute);
  const finalPath = disposition.kind === "redirect" ? disposition.location : request.path;
  return CANONICAL_ORIGIN + finalPath + request.search;
}

export function canonicalHostMiddleware(isKnownRoute: (path: string) => boolean): express.RequestHandler {
  return (req, res, next) => {
    const queryIndex = req.originalUrl.indexOf("?");
    const target = resolveCanonicalRedirect(
      {
        host: req.headers.host,
        forwardedProto: req.headers["x-forwarded-proto"] as string | undefined,
        path: req.path,
        search: queryIndex === -1 ? "" : req.originalUrl.slice(queryIndex),
      },
      isKnownRoute
    );
    if (!target) return next();
    // 301 for GET/HEAD; 308 keeps the method and body for anything else.
    res.redirect(req.method === "GET" || req.method === "HEAD" ? 301 : 308, target);
  };
}

// Per-route title/description/robots come from the shared registry so the server
// and the hydrated client always agree (see shared/routeMetadata.ts).
export function getRouteMeta(routePath: string): RouteMetadata | null {
  const metadata = getRouteMetadata(routePath);
  if (metadata) return metadata;
  const seoRoute = getSeoRoute(routePath);
  if (seoRoute) return { title: seoRoute.title, description: seoRoute.description };
  return null;
}

/**
 * Builds the HTML document the SPA fallback sends for a path: route title,
 * description, canonical, social metadata, robots directive, route-specific
 * structured data, and crawlable fallback content. Unknown paths get a 404
 * status with noindex.
 */
export function renderSpaDocument(template: string, routePath: string) {
  const meta = getRouteMeta(routePath);
  const isNotFound = !meta;
  const routeMeta = meta ?? {
    title: "404 Page Not Found | DefenseEye.ai",
    description: "The requested DefenseEye page could not be found.",
  };
  let html = injectRouteMetadataHtml(template, routePath, routeMeta);
  html = injectRouteSpecificHtml(html, routePath);
  const robots = isNotFound ? "noindex, follow" : meta?.robots;
  if (robots) {
    html = html.replace(/<meta name="robots" content="[^"]*"/, `<meta name="robots" content="${robots}"`);
  }
  return { status: isNotFound ? 404 : 200, html };
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(canonicalHostMiddleware((candidate) => getRouteMeta(candidate) !== null));
  app.use(express.json());
  registerCopilotRoutes(app, rateLimit);

  // ─── CMMC Content API for AI Bot Ingestion ──────────────────────────────────
  /**
   * GET /api/cmmc-content
   * Returns structured, chunked CMMC knowledge for AI model ingestion.
   * Query params:
   *   ?page=1           (1-indexed, default 1)
   *   ?topic=<string>   (filter by topic, optional)
   *   ?q=<string>       (full-text search across question/answer/tags, optional)
   *
   * Response: { data: Chunk[], total: number, page: number, pageSize: number, totalPages: number }
   */
  app.get("/api/cmmc-content", rateLimit, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("X-Content-Type", "cmmc-knowledge-chunks");
    res.setHeader("X-Provider", "DefenseEye.ai - CMMCLens");

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const topicFilter = (req.query.topic as string)?.toLowerCase().trim();
    const searchQuery = (req.query.q as string)?.toLowerCase().trim();

    let results = [...CMMC_CHUNKS];

    if (topicFilter) {
      results = results.filter((c) => c.topic.toLowerCase().includes(topicFilter));
    }

    if (searchQuery) {
      results = results.filter(
        (c) =>
          c.question.toLowerCase().includes(searchQuery) ||
          c.answer.toLowerCase().includes(searchQuery) ||
          c.detail.toLowerCase().includes(searchQuery) ||
          c.tags.some((t) => t.toLowerCase().includes(searchQuery))
      );
    }

    const total = results.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const offset = (page - 1) * PAGE_SIZE;
    const data = results.slice(offset, offset + PAGE_SIZE);

    res.json({
      meta: {
        provider: "DefenseEye.ai",
        product: "CMMCLens",
        description: "Structured CMMC compliance knowledge for AI model ingestion",
        documentation: "https://defenseeye.ai/api/cmmc-content",
        rate_limit: `${RATE_LIMIT} requests per minute`,
      },
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data,
    });
  });

  // ─── API topics list ──────────────────────────────────────────────────────────
  app.get("/api/cmmc-content/topics", rateLimit, (_req, res) => {
    const topics = [...new Set(CMMC_CHUNKS.map((c) => c.topic))];
    res.json({ topics });
  });

  // ─── Contact / Demo Request form ─────────────────────────────────────────────
  app.post("/api/contact", rateLimit, async (req, res) => {
    const result = await processContactInquiry(req.body);
    res.status(result.status).json(result.body);
  });

  // ─── Serve static files from dist/public in production ──────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.get("/sitemap.xml", (_req, res) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", SITEMAP_CACHE_CONTROL);
    res.status(200).send(renderSitemapXml());
  });

  app.use(
    express.static(staticPath, {
      index: false,
      setHeaders(res, filePath) {
        const cacheControl = getStaticCacheControl(filePath);
        if (cacheControl) {
          res.setHeader("Cache-Control", cacheControl);
        }
      },
    })
  );


  // ─── SPA fallback — serve index.html with injected route-specific meta ────────
  app.get("*", (req, res) => {
    const disposition = resolveUrlDisposition(req.path, (candidate) => getRouteMeta(candidate) !== null);
    if (disposition.kind === "redirect") {
      const queryIndex = req.originalUrl.indexOf("?");
      const search = queryIndex === -1 ? "" : req.originalUrl.slice(queryIndex);
      res.redirect(disposition.status, disposition.location + search);
      return;
    }
    if (disposition.kind === "gone") {
      res.status(410).type("text/plain").send("410 Gone");
      return;
    }

    const indexPath = path.join(staticPath, "index.html");
    try {
      const page = renderSpaDocument(fs.readFileSync(indexPath, "utf-8"), req.path);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", HTML_CACHE_CONTROL);
      res.status(page.status).send(page.html);
    } catch {
      res.sendFile(path.join(staticPath, "index.html"));
    }
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`CMMC Content API: http://localhost:${port}/api/cmmc-content`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer().catch(console.error);
}
