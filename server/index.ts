import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import nodemailer from "nodemailer";

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
    detail: "Level 1 covers 6 NIST 800-171 domains (access control, identification & authentication, media protection, physical protection, system & communications protection, system & information integrity). Level 2 spans all 14 domains with 110 controls. Most prime contractors and subcontractors handling CUI require Level 2. Level 2 assessment results in a CMMC certificate valid for 3 years.",
    source: "https://defenseeye.ai/knowledge-hub/cmmc-levels",
    last_updated: "2026-04-01",
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
    answer: "CMMC Level 2 certification involves 7 steps: (1) gap assessment, (2) SSP and POA&M creation, (3) remediation of identified gaps, (4) C3PAO selection from the CMMC-AB marketplace, (5) pre-assessment preparation, (6) C3PAO formal assessment (typically 3–5 days on-site), (7) receiving CMMC certificate (valid 3 years).",
    detail: "The full certification timeline typically takes 6–18 months manually, including gap assessment (4–8 weeks), remediation (3–12 months depending on gap size), C3PAO scheduling (2–4 month wait times), and assessment itself (1–2 weeks). C3PAO costs range from $30,000–$100,000+ depending on organization size. Organizations must maintain continuous compliance after certification, with annual affirmations to SPRS. CMMC Lens reduces the documentation and preparation phase by up to 80% through automated evidence collection and SSP/POA&M generation.",
    source: "https://defenseeye.ai/knowledge-hub/certification-process",
    last_updated: "2026-04-01",
    confidence: 1.0,
    tags: ["CMMC certification", "C3PAO", "CMMC Level 2", "SSP", "POA&M", "CMMC assessment process"],
  },
  {
    id: "cmmc-lens-product",
    topic: "DefenseEye CMMC Lens",
    question: "What is CMMC Lens by DefenseEye?",
    answer: "CMMC Lens is an AI-powered CMMC 2.0 compliance automation platform by DefenseEye.ai. It automates evidence collection from Microsoft Azure Commercial, Azure GCC, Microsoft 365 Commercial, and M365 GCC High environments, maps controls to NIST 800-171, generates SSP and POA&M documents, and provides real-time SPRS score monitoring — reducing documentation time by up to 80%.",
    detail: "CMMC Lens connects to your Microsoft Azure Commercial, Azure GCC, M365 Commercial, and M365 GCC High infrastructure via read-only API integrations, automatically inventories security configurations, and maps existing controls to NIST 800-171 requirements. It identifies gaps, prioritizes remediation by SPRS impact, generates audit-ready evidence packages for C3PAO assessments, and monitors compliance 365 days per year. Pricing starts at $199/month for CMMC Level 1 and $499/month for full Level 2 automation. A 14-day free trial is available with no credit card required.",
    source: "https://defenseeye.ai",
    last_updated: "2026-04-01",
    confidence: 1.0,
    tags: ["CMMC Lens", "DefenseEye", "CMMC automation", "AI compliance", "SPRS monitoring"],
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
    answer: "A C3PAO (Certified Third-Party Assessment Organization) is an organization authorized by the CMMC Accreditation Body (CMMC-AB) to conduct CMMC Level 2 assessments for DoD contractors. C3PAOs must be approved and listed in the CMMC-AB marketplace at cyberAB.org.",
    detail: "C3PAO assessments for Level 2 typically take 3–5 days on-site and cost $30,000–$100,000+ depending on organization size and complexity. The assessment process includes document review (SSP, POA&M, policies), evidence review (logs, configurations, training records), interviews with personnel, and technical testing. C3PAOs may issue Conditional CMMC Certificates if minor deficiencies exist, with a 180-day remediation period. Certificates are valid for 3 years with annual self-affirmations required.",
    source: "https://defenseeye.ai/knowledge-hub/certification-process",
    last_updated: "2026-04-01",
    confidence: 1.0,
    tags: ["C3PAO", "CMMC assessment", "CMMC-AB", "third-party assessment", "CMMC Level 2"],
  },
];

const PAGE_SIZE = 5;

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

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
    res.setHeader("X-Provider", "DefenseEye.ai — CMMC Lens");

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
        product: "CMMC Lens",
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
    const { firstName, lastName, email, company, title, companySize, cmmcLevel, challenge, timeline, message } = req.body;

    if (!email || !firstName || !company) {
      return res.status(400).json({ error: "firstName, email, and company are required." });
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const subject = `New CMMC Demo Request — ${company}${cmmcLevel ? ` (${cmmcLevel})` : ""}`;

    const htmlBody = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A1628;color:#e8eaf0;padding:32px;border-radius:8px;">
        <div style="text-align:center;margin-bottom:28px;">
          <h1 style="color:#00D4FF;font-size:22px;margin:0;">New Demo Request — DefenseEye.ai</h1>
          <p style="color:#9ca3af;font-size:14px;margin:6px 0 0;">Submitted via defenseeye.ai contact form</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${[
            ["Name", fullName],
            ["Work Email", email],
            ["Company", company],
            ["Role", title || "—"],
            ["Company Size", companySize || "—"],
            ["Target CMMC Level", cmmcLevel || "—"],
            ["Compliance Timeline", timeline || "—"],
            ["Biggest Challenge", challenge || "—"],
            ["Additional Context", message || "—"],
          ]
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding:10px 12px;background:#131f35;border-bottom:1px solid #1e2d4a;font-weight:600;color:#00D4FF;width:38%;">${label}</td>
              <td style="padding:10px 12px;background:#0d1a2d;border-bottom:1px solid #1e2d4a;color:#e8eaf0;">${value}</td>
            </tr>`
            )
            .join("")}
        </table>
        <p style="margin-top:24px;font-size:12px;color:#6b7280;text-align:center;">
          Reply directly to this email to respond to ${fullName} at ${email}
        </p>
      </div>
    `;

    const confirmationHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A1628;color:#e8eaf0;padding:32px;border-radius:8px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#00D4FF;font-size:22px;margin:0;">We received your request, ${firstName}!</h1>
        </div>
        <p style="color:#cbd5e1;line-height:1.7;">
          Thank you for reaching out to <strong style="color:#00D4FF;">DefenseEye</strong>. Our certified CMMC professionals will review your request and contact you within <strong>24 business hours</strong> to discuss your CMMC compliance roadmap.
        </p>
        <div style="background:#131f35;border:1px solid #1e3a5f;border-radius:6px;padding:20px;margin:24px 0;">
          <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Your submission summary</p>
          <p style="margin:4px 0;color:#e8eaf0;"><strong>Company:</strong> ${company}</p>
          <p style="margin:4px 0;color:#e8eaf0;"><strong>Target Level:</strong> ${cmmcLevel || "TBD"}</p>
          <p style="margin:4px 0;color:#e8eaf0;"><strong>Timeline:</strong> ${timeline || "TBD"}</p>
        </div>
        <p style="color:#9ca3af;font-size:13px;">
          While you wait, explore our free <a href="https://defenseeye.ai/knowledge-hub" style="color:#00D4FF;">CMMC Knowledge Hub</a> — plain-English guides on CMMC Level 2, NIST 800-171, SPRS scoring, and C3PAO assessment preparation.
        </p>
        <hr style="border:none;border-top:1px solid #1e2d4a;margin:28px 0;"/>
        <p style="font-size:12px;color:#6b7280;text-align:center;">DefenseEye, Inc. · defenseeye.ai · CMMC Certified Professionals</p>
      </div>
    `;

    // Send emails only when SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        console.log(`[contact] SMTP configured: host=${process.env.SMTP_HOST}, port=${process.env.SMTP_PORT}, secure=${process.env.SMTP_SECURE}, user=${process.env.SMTP_USER}`);
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const fromAddr = process.env.SMTP_FROM || process.env.SMTP_USER;

        console.log(`[contact] Sending notification to mahesh@defenseeye.ai from ${fromAddr}...`);
        await transporter.sendMail({
          from: `"DefenseEye Contact Form" <${fromAddr}>`,
          to: "mahesh@defenseeye.ai",
          cc: "sujatha@defenseeye.ai",
          replyTo: email,
          subject,
          html: htmlBody,
        });
        console.log("[contact] Notification email sent successfully.");

        console.log(`[contact] Sending confirmation to ${email}...`);
        await transporter.sendMail({
          from: `"DefenseEye Team" <${fromAddr}>`,
          to: email,
          subject: `We received your CMMC inquiry — DefenseEye.ai`,
          html: confirmationHtml,
        });
        console.log("[contact] Confirmation email sent successfully.");
      } catch (err) {
        console.error("[contact] Email send error:", err);
        // Still return success — log the submission server-side
      }
    } else {
      console.warn("[contact] SMTP not configured — skipping email. Set SMTP_HOST, SMTP_USER, SMTP_PASS.");
    }

    // Always log the lead server-side regardless of email status
    console.log(`[lead] ${new Date().toISOString()} | ${fullName} | ${email} | ${company} | ${cmmcLevel} | ${challenge}`);

    res.json({ success: true });
  });

  // ─── Serve static files from dist/public in production ──────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // ─── Per-route meta for server-side injection (fixes duplicate meta / text ratio) ─
  const ROUTE_META: Record<string, { title: string; description: string }> = {
    "/": {
      title: "DefenseEye.ai — AI-Powered CMMC 2.0 Compliance Automation | CMMC Lens",
      description: "DefenseEye CMMC Lens automates CMMC 2.0 compliance for DoD contractors — AI-driven evidence collection, NIST 800-171 mapping, SSP/POA&M generation, SPRS score monitoring, and expert CMMC advisory consulting. Reduce documentation time by 80%.",
    },
    "/blog": {
      title: "CMMC Compliance Blog — Expert Guides for Defense Contractors | DefenseEye.ai",
      description: "Expert CMMC compliance guides, NIST 800-171 tutorials, SPRS score improvement tips, and C3PAO assessment advice for DoD contractors. Free resources to achieve CMMC Level 2 certification.",
    },
    "/case-studies": {
      title: "CMMC Contractor Profiles — DoD Compliance Scenarios | DefenseEye.ai",
      description: "See how DoD contractors use DefenseEye CMMC Lens to achieve audit readiness. Real-world scenarios covering CMMC Level 2, CUI handling, SPRS score improvement, and C3PAO assessment preparation.",
    },
    "/knowledge-hub": {
      title: "CMMC Knowledge Hub — Authoritative Guides for DoD Contractors | DefenseEye.ai",
      description: "Free CMMC 2.0 knowledge base for DoD contractors. Authoritative guides on CMMC levels, NIST 800-171 controls, SPRS scores, C3PAO assessments, and the full certification process.",
    },
    "/knowledge-hub/what-is-cmmc": {
      title: "What is CMMC 2.0? Complete Guide for DoD Contractors (2025) | DefenseEye.ai",
      description: "What is CMMC 2.0? Complete guide covering CMMC levels 1 and 2, FCI vs CUI protection, self-assessment vs C3PAO requirements, and how CMMC certification affects Defense Industrial Base contracts.",
    },
    "/knowledge-hub/cmmc-levels": {
      title: "CMMC Level 1 vs Level 2: Which Do You Need? (2025) | DefenseEye.ai",
      description: "CMMC Level 1 vs Level 2 fully explained. Compare 17 basic cybersecurity practices vs 110 NIST 800-171 controls, self-assessment vs C3PAO requirements, and who needs each certification level.",
    },
    "/knowledge-hub/evidence-mapping": {
      title: "Automated NIST 800-171 Evidence Mapping for CMMC | DefenseEye.ai",
      description: "How to automate NIST 800-171 evidence mapping for CMMC Level 2. CMMC Lens collects and maps compliance evidence from Azure Commercial, Azure GCC, M365 Commercial, and M365 GCC High.",
    },
    "/knowledge-hub/sprs-score": {
      title: "SPRS Score Explained: How to Calculate, Submit & Improve | DefenseEye.ai",
      description: "What is an SPRS score? Learn how to calculate your score (-203 to 110), submit via PIEE, and improve your Supplier Performance Risk System score for DFARS 252.204-7012 and CMMC Level 2.",
    },
    "/knowledge-hub/certification-process": {
      title: "CMMC Certification Process Step-by-Step (2025) | DefenseEye.ai",
      description: "Complete CMMC certification roadmap for 2025: gap assessment, SSP creation, POA&M, C3PAO selection, pre-assessment preparation, the assessment itself, and maintaining compliance post-certification.",
    },
  };

  const BLOG_SLUG_META: Record<string, { title: string; description: string }> = {
    "cmmc-level-2-compliance-checklist-2025": {
      title: "CMMC Level 2 Compliance Checklist for DoD Contractors (2025) | DefenseEye.ai",
      description: "Complete CMMC Level 2 compliance checklist for 2025. Covers all 110 NIST 800-171 practices, SSP requirements, POA&M guidance, C3PAO selection, and day-of-assessment preparation for DoD contractors.",
    },
    "how-to-improve-sprs-score-fast": {
      title: "How to Improve Your SPRS Score Fast — Defense Contractor Guide | DefenseEye.ai",
      description: "Learn how to improve your SPRS score fast. Covers the SPRS scoring formula, highest-impact NIST 800-171 controls, quick wins vs long-term fixes, and a prioritized remediation roadmap for defense contractors.",
    },
    "what-to-expect-c3pao-assessment": {
      title: "What to Expect During a C3PAO Assessment: Step-by-Step Walkthrough | DefenseEye.ai",
      description: "Everything defense contractors need to know about C3PAO assessments: how to find an assessor, assessment phases, what assessors look for, common failure points, POA&M responses, and the full timeline to CMMC Level 2.",
    },
    "what-counts-as-cui-plain-english-guide": {
      title: "What Counts as CUI? Plain-English Guide for Defense Contractors | DefenseEye.ai",
      description: "Plain-English guide to Controlled Unclassified Information (CUI) for DoD contractors. What counts as CUI, what doesn't, how to identify it in your environment, and what CMMC Level 2 protections it triggers.",
    },
    "cmmc-level-2-small-business-guide": {
      title: "CMMC Level 2 for Small Businesses: What You Actually Need | DefenseEye.ai",
      description: "CMMC Level 2 guide for small defense contractors. What 110 NIST 800-171 controls actually require for a 10–50 person company, what you can inherit from M365 GCC High, and affordable paths to compliance.",
    },
    "gcc-high-vs-m365-commercial-cmmc": {
      title: "GCC High vs M365 Commercial: Which Do You Need for CMMC Level 2? | DefenseEye.ai",
      description: "Microsoft 365 GCC High vs Commercial vs GCC for CMMC Level 2 compliance. Which tenant do DoD contractors need, how CUI type affects the decision, cost differences, and how CMMC Lens works with each environment.",
    },
    "cmmc-poam-guide-what-assessors-want": {
      title: "CMMC POA&M: What Assessors Actually Look For | DefenseEye.ai",
      description: "What C3PAO assessors look for in a CMMC POA&M — required fields, acceptable timelines, high-risk items that block certification, format tips, and the most common mistakes that turn a good program into a failed assessment.",
    },
    "cmmc-consultant-red-flags": {
      title: "7 Red Flags When Hiring a CMMC Consultant | DefenseEye.ai",
      description: "7 red flags to watch for when hiring a CMMC consultant or RPO. How to verify credentials, what questions to ask, and what legitimate CMMC advisory looks like versus firms that will waste your time and budget.",
    },
  };

  function getRouteMeta(routePath: string) {
    if (ROUTE_META[routePath]) return ROUTE_META[routePath];
    if (routePath.startsWith("/blog/")) {
      const slug = routePath.replace("/blog/", "");
      if (BLOG_SLUG_META[slug]) return BLOG_SLUG_META[slug];
      return {
        title: "CMMC Compliance Guide | DefenseEye.ai",
        description: "Expert CMMC compliance guidance for DoD contractors — NIST 800-171 controls, SPRS score improvement, CUI protection, C3PAO assessment preparation, and SSP documentation.",
      };
    }
    return ROUTE_META["/"];
  }

  // ─── SPA fallback — serve index.html with injected route-specific meta ────────
  app.get("*", (req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    try {
      let html = fs.readFileSync(indexPath, "utf-8");
      const meta = getRouteMeta(req.path);
      const canonical = `https://defenseeye.ai${req.path === "/" ? "/" : req.path}`;
      // Inject title, meta description, and canonical per-route
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
      html = html.replace(
        /<meta name="description" content="[^"]*"/,
        `<meta name="description" content="${meta.description.replace(/"/g, "&quot;")}"`
      );
      html = html.replace(
        /<link rel="canonical" href="[^"]*"/,
        `<link rel="canonical" href="${canonical}"`
      );
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
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

startServer().catch(console.error);
