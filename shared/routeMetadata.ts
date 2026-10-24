// Single source of truth for each public route's <title>, meta description, and
// robots directive. The server injects these into the HTML it sends, the shared SEO
// route registry uses them for schema and server-rendered fallbacks, and the client
// useSeo hook applies them after hydration — so crawlers that do and do not run
// JavaScript see the same title. Page components may still pass their own strings to
// useSeo; those are only fallbacks for routes that are not listed here.
//
// Keep titles unique and roughly 60 characters or fewer, and descriptions roughly
// 160 characters or fewer, so they display without truncation in search results.
// server/seo-routes.test.ts enforces uniqueness and length budgets.

export type RouteMetadata = {
  title: string;
  description: string;
  /** Omit for the default "index, follow". */
  robots?: "noindex, follow";
};

// The /lp/ landing pages are indexable. If they are confirmed to be used only for
// paid or outbound campaigns, add `robots: "noindex, follow"` to their entries: that
// also removes them from the sitemap (see isNoindexRoute and SITEMAP_ENTRIES).

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  "/": {
    title: "DefenseEye | Secure Agentic AI for Regulated Organizations",
    description:
      "DefenseEye helps financial services, credit unions, and other regulated organizations implement agentic AI with governance, secure architecture, and human oversight.",
  },

  // ─── Secure AI ──────────────────────────────────────────────────────────────
  "/secure-ai-adoption": {
    title: "Secure Agentic AI Readiness & Implementation | DefenseEye",
    description:
      "DefenseEye helps regulated organizations implement agentic AI with secure architecture, responsible governance, risk controls, and hands-on delivery support.",
  },
  "/solutions/ai-governance": {
    title: "AI Governance & NIST AI RMF Consulting | DefenseEye",
    description:
      "Move from AI experimentation to governed adoption with AI inventories, risk tiering, policy, human oversight, accountability, and NIST AI RMF alignment.",
  },
  "/solutions/ai-transformation": {
    title: "Secure AI Transformation & Adoption Roadmaps | DefenseEye",
    description:
      "Identify practical AI opportunities, prioritize use cases, prepare Microsoft and cloud environments, and implement governed AI adoption roadmaps.",
  },
  "/solutions/ai-security": {
    title: "AI Security & Generative AI Risk Consulting | DefenseEye",
    description:
      "Reduce risks from generative AI, LLMs, and AI agents: sensitive data exposure, prompt injection, identity misuse, excessive permissions, and weak monitoring.",
  },
  "/solutions/microsoft-copilot-readiness": {
    title: "Microsoft Copilot Readiness Consulting | DefenseEye",
    description:
      "Prepare Microsoft 365 for Copilot: permissions, oversharing, Purview data governance, Entra identity, Defender, privacy, and adoption guardrails.",
  },
  "/industries/financial-services-credit-unions": {
    title: "Secure AI for Financial Services & Credit Unions | DefenseEye",
    description:
      "Evaluate and implement AI and agentic AI in financial services and credit unions with data-access controls, traceability, monitoring, and human oversight.",
  },

  // ─── Cybersecurity, cloud, and AttackSense ─────────────────────────────────
  "/solutions/cybersecurity-risk": {
    title: "Cybersecurity Risk Consulting for Regulated Teams | DefenseEye",
    description:
      "Evaluate cybersecurity risk, prioritize remediation, improve visibility, and prepare for customer, supplier, and audit expectations in regulated environments.",
  },
  "/solutions/cloud-security": {
    title: "Azure & GCC High Cloud Security Consulting | DefenseEye",
    description:
      "Strengthen Azure, Azure Government, GCC High, and Microsoft 365 with secure architecture, Entra identity controls, monitoring, and compliance alignment.",
  },
  "/attacksense": {
    title: "AttackSense Attack Surface Intelligence | DefenseEye",
    description:
      "AttackSense consolidates attack surface findings, vulnerability signals, attack path context, and remediation ownership into risk-ranked, executive-ready views.",
  },
  "/attacksense/docs": {
    title: "AttackSense Quick Start Guide | DefenseEye",
    description:
      "Read and download the DefenseEye AttackSense Quick Start Guide for setup, onboarding, and early adoption guidance.",
  },
  "/microsoft-ecosystem": {
    title: "Microsoft Ecosystem: Copilot, Azure & Compliance | DefenseEye",
    description:
      "How DefenseEye supports Microsoft-centered environments: AI governance, Copilot readiness, Azure security, Microsoft cloud compliance, and CMMC readiness.",
  },

  // ─── CMMC and compliance automation ────────────────────────────────────────
  "/cmmc-compliance-automation": {
    title: "CMMC Compliance Automation & CCP-Led Readiness | DefenseEye",
    description:
      "CCP-led CMMC Level 1 and Level 2 readiness, NIST SP 800-171 alignment, SSP and POA&M preparation, and evidence automation through CMMCLens.",
  },
  "/industries/defense-industrial-base": {
    title: "Defense Industrial Base Cybersecurity & CMMC | DefenseEye",
    description:
      "Cybersecurity and compliance support for defense suppliers: CUI scoping, NIST SP 800-171 readiness, SSP and POA&M support, and CMMCLens evidence workflows.",
  },
  "/cmmc": {
    title: "CMMC Readiness, Evidence & Advisory Support | DefenseEye",
    description:
      "CMMC readiness planning, NIST SP 800-171 alignment, SSP and POA&M support, evidence automation, and CMMCLens-enabled readiness workflows.",
  },
  "/cmmc-level-2-readiness": {
    title: "CMMC Level 2 Readiness Consulting | DefenseEye",
    description:
      "CMMC Level 2 readiness support for CUI scope, NIST SP 800-171 gaps, SSP, POA&M, evidence planning, SPRS, and assessment preparation.",
  },

  "/services/cmmc-readiness-sprint": {
    title: "Fixed-Scope CMMC Readiness Sprint for DoD Contractors | DefenseEye",
    description:
      "A fixed-price, 2–4 week CMMC readiness sprint: gap assessment, NIST 800-171 mapping, SSP and POA&M starter package, and a remediation roadmap.",
  },
  "/services/cmmc-scoping": {
    title: "CMMC Scoping: Define Your CUI Boundary | DefenseEye",
    description:
      "CMMC scoping for defense contractors: define your CUI environment boundary, reduce assessment scope, and document scope before your gap assessment.",
  },
  "/cmmc-evidence-automation": {
    title: "CMMC Evidence Automation & Traceability | DefenseEye",
    description:
      "CMMC evidence automation with CMMCLens: control mapping, evidence traceability, readiness dashboards, and documentation workflows.",
  },
  "/nist-800-171": {
    title: "NIST SP 800-171 Readiness & Compliance Automation | DefenseEye",
    description:
      "NIST SP 800-171 readiness support for control review, evidence planning, SSP and POA&M support, SPRS preparation, and compliance automation.",
  },
  "/cmmc-readiness-sprint-guide": {
    title: "4-Week CMMC Readiness Sprint Guide | DefenseEye",
    description:
      "A practical 4-week CMMC readiness guide for defense contractors: scope quickly, fix high-risk gaps, and prepare for a C3PAO assessment.",
  },
  "/solutions/compliance-automation": {
    title: "Compliance Evidence Automation Consulting | DefenseEye",
    description:
      "Reduce manual compliance work with evidence automation, control mapping, readiness dashboards, SSP and POA&M support, and GRC workflow automation.",
  },
  "/cmmclens": {
    title: "CMMCLens CMMC & NIST 800-171 Compliance Platform | DefenseEye",
    description:
      "CMMCLens is DefenseEye's compliance automation platform for CMMC and NIST SP 800-171: evidence automation, control mapping, gap tracking, and SSP/POA&M workflows.",
  },
  "/solutions/cmmclens-platform": {
    title: "CMMCLens for Compliance Evidence Automation | DefenseEye",
    description:
      "How CMMCLens supports evidence collection, gap identification, continuous readiness, AI-assisted SSP and policy drafting, and executive visibility.",
  },
  "/pricing": {
    title: "CMMC Readiness Pricing & Engagement Options | DefenseEye",
    description:
      "CMMC readiness pricing guidance for small and mid-sized defense contractors, with fixed-scope options, practical deliverables, and fast quote turnaround.",
  },
  "/faq": {
    title: "CMMC FAQ: Common Questions Answered | DefenseEye",
    description:
      "Answers to common CMMC 2.0 questions from defense contractors: Level 1 vs Level 2, CUI, SPRS scores, C3PAO assessments, timelines, and costs.",
  },

  // ─── CMMC Knowledge Hub ────────────────────────────────────────────────────
  "/knowledge-hub": {
    title: "CMMC Knowledge Hub: Guides for DoD Contractors | DefenseEye",
    description:
      "Plain-English CMMC 2.0 guides for DoD contractors: CMMC levels, NIST 800-171 evidence mapping, SPRS scoring, and the certification process.",
  },
  "/knowledge-hub/what-is-cmmc": {
    title: "What Is CMMC? A Complete Guide for DoD Contractors | DefenseEye",
    description:
      "What CMMC 2.0 means for DoD contractors: the three levels, FCI vs CUI, assessment types, key terms, and how CMMC affects contract eligibility.",
  },
  "/knowledge-hub/cmmc-levels": {
    title: "CMMC Level 1 vs Level 2: Which Do You Need? | DefenseEye",
    description:
      "Compare CMMC Level 1 and Level 2: required practices, assessment type, who needs each level, and how to determine the right level for your contracts.",
  },
  "/knowledge-hub/evidence-mapping": {
    title: "NIST 800-171 Evidence Mapping for CMMC | DefenseEye",
    description:
      "How to map evidence to NIST SP 800-171 controls for CMMC Level 2, what assessors expect, and how automation supports traceability across Azure and M365.",
  },
  "/knowledge-hub/sprs-score": {
    title: "SPRS Score: How to Calculate & Improve It | DefenseEye",
    description:
      "How SPRS scoring works, how to calculate and submit your score, and which NIST 800-171 remediation priorities improve it fastest.",
  },
  "/knowledge-hub/certification-process": {
    title: "CMMC Level 2 Certification Process Step by Step | DefenseEye",
    description:
      "The CMMC Level 2 certification path step by step: gap assessment, SSP, POA&M, C3PAO assessment preparation, and post-assessment sustainment.",
  },

  // ─── CMMC blog ─────────────────────────────────────────────────────────────
  "/blog": {
    title: "CMMC Blog: Practical Guides for Defense Contractors | DefenseEye",
    description:
      "Practical CMMC guides for defense contractors: NIST 800-171, SPRS improvement, C3PAO assessment preparation, CUI, POA&Ms, and CMMC Level 2 readiness.",
  },
  "/blog/cmmc-level-2-compliance-checklist-2025": {
    title: "CMMC Level 2 Compliance Checklist (110 Controls) | DefenseEye",
    description:
      "A CMMC Level 2 checklist for DoD contractors covering the 110 NIST 800-171 controls, SSP and POA&M requirements, and C3PAO assessment preparation.",
  },
  "/blog/how-to-improve-sprs-score-fast": {
    title: "How to Improve Your SPRS Score Fast | DefenseEye",
    description:
      "Improve your SPRS score with high-impact NIST 800-171 priorities, quick wins, and a practical remediation roadmap for defense contractors.",
  },
  "/blog/what-to-expect-c3pao-assessment": {
    title: "What to Expect in a C3PAO Assessment | DefenseEye",
    description:
      "What to expect in a C3PAO assessment: choosing an assessor, assessment phases, common failure points, and what drives the CMMC Level 2 timeline.",
  },
  "/blog/what-counts-as-cui-plain-english-guide": {
    title: "What Counts as CUI? A Plain-English Guide | DefenseEye",
    description:
      "A plain-English CUI guide for DoD contractors: what counts as CUI, what does not, and which CMMC Level 2 protections it triggers.",
  },
  "/blog/cmmc-level-2-small-business-guide": {
    title: "CMMC Level 2 for Small Businesses: What You Need | DefenseEye",
    description:
      "CMMC Level 2 guidance for small defense contractors: control expectations, inheritance options, and practical paths to affordable compliance.",
  },
  "/blog/gcc-high-vs-m365-commercial-cmmc": {
    title: "GCC High vs M365 Commercial for CMMC Level 2 | DefenseEye",
    description:
      "Compare GCC High and M365 Commercial for CMMC Level 2: which tenant fits your CUI obligations, cost trade-offs, and implementation impact.",
  },
  "/blog/cmmc-poam-guide-what-assessors-want": {
    title: "CMMC POA&M: What Assessors Actually Look For | DefenseEye",
    description:
      "What C3PAO assessors expect in a CMMC POA&M: required fields, acceptable timelines, and the mistakes that can block certification.",
  },
  "/blog/cmmc-consultant-red-flags": {
    title: "7 Red Flags When Hiring a CMMC Consultant | DefenseEye",
    description:
      "Seven red flags when hiring a CMMC consultant, with credential checks and interview questions that help you avoid costly misalignment.",
  },

  // ─── Insights (answer-focused explainers) ──────────────────────────────────
  "/insights/what-is-cmmc-level-2": {
    title: "What Is CMMC Level 2? Requirements Explained | DefenseEye",
    description:
      "A plain-English explanation of CMMC Level 2 for defense contractors handling CUI: requirements, evidence, SSP, POA&M, and assessment readiness.",
  },
  "/insights/what-is-rmf-readiness": {
    title: "What Is RMF Readiness? A Practical Definition | DefenseEye",
    description:
      "What RMF readiness means for federal systems: system boundaries, control evidence, documented risk decisions, and continuous monitoring.",
  },
  "/insights/what-is-nist-ai-rmf": {
    title: "What Is the NIST AI RMF? Plain-English Guide | DefenseEye",
    description:
      "A plain-English guide to the NIST AI Risk Management Framework and how organizations govern, map, measure, and manage AI system risk.",
  },
  "/insights/ai-automated-evidence-collection": {
    title: "How AI Can Automate Compliance Evidence Collection | DefenseEye",
    description:
      "How AI and workflow automation reduce evidence collection effort through control mapping, traceability, and gap detection — with human review kept in place.",
  },
  "/insights/implement-ai-governance": {
    title: "How to Implement AI Governance: Practical Steps | DefenseEye",
    description:
      "Practical steps for implementing AI governance: AI inventories, risk tiering, role definition, human oversight, and the evidence that shows it works.",
  },
  "/insights/security-copilot-cybersecurity-operations": {
    title: "Security Copilot for Cybersecurity Operations | DefenseEye",
    description:
      "How Microsoft Security Copilot can support alert triage, investigation, threat hunting, and response playbooks — with governance and analyst oversight.",
  },
  "/insights/continuous-compliance-monitoring": {
    title: "What Is Continuous Compliance Monitoring? | DefenseEye",
    description:
      "Continuous compliance monitoring explained: control status, evidence freshness, configuration drift, remediation tracking, and audit readiness.",
  },
  "/insights/ai-audit-readiness": {
    title: "How AI Can Improve Audit Readiness | DefenseEye",
    description:
      "How AI supports audit readiness through evidence organization, control narrative drafting, gap detection, source traceability, and human review.",
  },

  // ─── Company, supplier, and procurement ────────────────────────────────────
  "/why-defenseeye": {
    title: "Why DefenseEye: Practitioner-Led Secure AI & Compliance",
    description:
      "Practitioner-led delivery with security and governance built in: why regulated teams choose DefenseEye for secure AI, cybersecurity, and compliance automation.",
  },
  "/supplier-readiness": {
    title: "Supplier Readiness: Minority-Owned AI & Cyber Firm | DefenseEye",
    description:
      "DefenseEye is a Redmond, WA minority-owned AI, cybersecurity, Microsoft cloud, and compliance automation supplier for advisory and subcontracting work.",
  },
  "/capability-statement": {
    title: "DefenseEye Capability Statement: AI, Cyber & CMMC",
    description:
      "DefenseEye capabilities in AI governance, cybersecurity, CMMC advisory, Microsoft cloud security, compliance automation, and the CMMCLens platform.",
  },
  "/delivery-model": {
    title: "Delivery Model & Engagement Formats | DefenseEye",
    description:
      "How DefenseEye engages: advisory, project delivery, staff augmentation, subcontracting, and platform-enabled consulting across AI, cyber, and CMMC.",
  },
  "/representative-engagements": {
    title: "Representative AI, Cyber & CMMC Engagements | DefenseEye",
    description:
      "Engagement types DefenseEye is positioned to support across AI governance, Copilot readiness, CMMC, and cloud security. Representative, not case studies.",
  },
  "/datasheets": {
    title: "DefenseEye Datasheets: AI, CMMC, CMMCLens & Copilot",
    description:
      "Concise DefenseEye datasheets for secure AI adoption, CMMC compliance automation, CMMCLens, Microsoft Copilot readiness, and supplier evaluation.",
  },
  "/datasheets/secure-ai-adoption": {
    title: "Secure AI Adoption Datasheet | DefenseEye",
    description:
      "One-page overview of DefenseEye secure AI adoption support: AI governance, Microsoft Copilot readiness, NIST AI RMF alignment, and AI security.",
  },
  "/datasheets/cmmc-compliance-automation": {
    title: "CMMC & Compliance Automation Datasheet | DefenseEye",
    description:
      "One-page overview of CCP-led CMMC readiness, NIST SP 800-171 support, SSP/POA&M workflows, evidence automation, and CMMCLens.",
  },
  "/datasheets/cmmclens": {
    title: "CMMCLens Product Sheet | DefenseEye",
    description:
      "CMMCLens product sheet: CMMC and NIST SP 800-171 readiness, evidence automation, control mapping, gap tracking, SSP/POA&M workflows, and dashboards.",
  },
  "/datasheets/microsoft-copilot-readiness": {
    title: "Microsoft Copilot Readiness Datasheet | DefenseEye",
    description:
      "One-page overview of Microsoft Copilot readiness across Microsoft 365, identity, data governance, privacy, security, and adoption controls.",
  },
  "/datasheets/supplier-readiness": {
    title: "Supplier Readiness Datasheet | DefenseEye",
    description:
      "DefenseEye supplier facts in one page: Redmond, WA location, minority-owned certifications, CAGE, UEI, NAICS, CMMC credentials, and engagement models.",
  },
  "/contact": {
    title: "Contact DefenseEye: AI, Cybersecurity & Compliance Inquiries",
    description:
      "Contact DefenseEye about secure AI, AI governance, Copilot readiness, cybersecurity, CMMC readiness, compliance automation, CMMCLens, or supplier opportunities.",
  },
  "/support": {
    title: "Customer & Product Support | DefenseEye",
    description:
      "Contact DefenseEye support by email, find help for common topics and urgent issues, and use self-serve CMMC resources for CMMCLens and DefenseEye services.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | DefenseEye",
    description:
      "How DefenseEye collects, uses, and protects your information when you use DefenseEye.ai and CMMCLens.",
  },
  "/terms": {
    title: "Terms of Service | DefenseEye",
    description:
      "DefenseEye Terms of Service for the DefenseEye website, CMMCLens platform, support, and advisory services.",
  },

  // ─── Focused offer / campaign landing pages ────────────────────────────────
  "/lp/secure-ai-adoption": {
    title: "Secure AI Adoption Consulting for Regulated Teams | DefenseEye",
    description:
      "Secure AI adoption consulting for AI governance, Microsoft Copilot readiness, data protection, NIST AI RMF alignment, and oversight workflows.",
  },
  "/lp/ai-governance-consulting": {
    title: "AI Governance Readiness Assessment | DefenseEye",
    description:
      "AI governance consulting for NIST AI RMF, responsible AI, human accountability, policy, oversight, and AI risk management.",
  },
  "/lp/microsoft-copilot-readiness": {
    title: "Microsoft Copilot Readiness Assessment | DefenseEye",
    description:
      "Microsoft Copilot readiness assessment for Microsoft 365, identity, data governance, privacy, security controls, and adoption guardrails.",
  },
  "/lp/cmmc-level-2-readiness": {
    title: "CMMC Level 2 Readiness Assessment | DefenseEye",
    description:
      "CMMC Level 2 readiness consulting for CUI scope, NIST SP 800-171 gaps, SSP, POA&M, evidence planning, SPRS, and assessment readiness.",
  },
  "/lp/cmmc-compliance-automation": {
    title: "CMMC Compliance Automation Sprint | DefenseEye",
    description:
      "CCP-led CMMC readiness and CMMCLens automation for NIST SP 800-171 evidence, SSP/POA&M workflows, remediation tracking, and dashboards.",
  },
  "/lp/cmmc-evidence-automation": {
    title: "CMMC Evidence Automation with CMMCLens | DefenseEye",
    description:
      "CMMC evidence automation and compliance traceability with CMMCLens, control mapping, readiness dashboards, and documentation workflows.",
  },
  "/lp/cmmclens-demo": {
    title: "Request a CMMCLens Demo | DefenseEye",
    description:
      "Request a CMMCLens demo for CMMC and NIST SP 800-171 evidence automation, control mapping, gap tracking, SSP/POA&M workflows, and dashboards.",
  },
  "/lp/microsoft-supplier-ai-consulting": {
    title: "Minority-Owned AI & Cybersecurity Supplier | DefenseEye",
    description:
      "Supplier-ready AI, cybersecurity, cloud security, Microsoft Copilot, and compliance automation support for Microsoft-centered environments.",
  },
  "/lp/azure-cloud-security": {
    title: "Azure Cloud Security & Compliance Review | DefenseEye",
    description:
      "Azure cloud security support for Azure, Azure Government, GCC High, Entra, Defender, Sentinel, Purview, and compliance alignment.",
  },
  "/lp/compliance-automation": {
    title: "Compliance Automation for Evidence & Reporting | DefenseEye",
    description:
      "Compliance automation for evidence collection, control mapping, documentation support, readiness workflows, and audit preparedness.",
  },
};

function normalizeMetadataPath(routePath: string) {
  if (!routePath || routePath === "/") return "/";
  return routePath.replace(/\/+$/, "");
}

export function getRouteMetadata(routePath: string): RouteMetadata | null {
  return ROUTE_METADATA[normalizeMetadataPath(routePath)] ?? null;
}

export function isNoindexRoute(routePath: string) {
  return getRouteMetadata(routePath)?.robots === "noindex, follow";
}
