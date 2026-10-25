export const SITE_ORIGIN = "https://defenseeye.ai";
import { blogPosts } from "../client/src/data/blogPosts";
import { WHAT_IS_CMMC_CONTENT } from "./whatIsCmmcContent";
import { CERTIFICATION_PROCESS_CONTENT } from "./certificationProcessContent";
import { CMMC_LEVELS_CONTENT } from "./cmmcLevelsContent";
import { EVIDENCE_MAPPING_CONTENT } from "./evidenceMappingContent";
import { SPRS_SCORE_CONTENT } from "./sprsScoreContent";
import { getRouteMetadata, isNoindexRoute } from "./routeMetadata";
import { INSIGHTS } from "./insightsContent";
import { HOME_AT_A_GLANCE } from "./homeContent";
import { LANDING_PAGE_CONTENT } from "./landingPageContent";
import { DATASHEET_CONTENT } from "./datasheetContent";
import { SOLUTION_PAGE_CONTENT } from "./solutionPageContent";
import { BANKING_AI_RISK_CONTENT, BANKING_AI_RISK_PATH, BANKING_DISCOVERY_HREF, DEFY_AI_RISK_URL } from "./bankingAiRiskContent";
import {
  FOOTER_NAVIGATION,
  ROUTE_NAMES,
  getBreadcrumbTrail,
  getSectionPages,
  type ArchitectureLink,
} from "./siteArchitecture";
import { getRelatedLinks } from "./relatedLinks";

export const ROUTE_SCHEMA_SCRIPT_ID = "defenseeye-route-schema";

export type StructuredDataKind =
  | "home"
  | "service"
  | "software"
  | "collection"
  | "about"
  | "article"
  | "page";

export type SeoLink = {
  label: string;
  href: string;
};

export type SeoSection = {
  heading: string;
  body?: string;
  items?: string[];
};

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow?: string;
  summary: string;
  sections: SeoSection[];
  links: SeoLink[];
  schemaKind: StructuredDataKind;
  serviceType?: string;
  topics: string[];
  lastmod: string;
  changefreq: "weekly" | "monthly";
  priority: string;
  /** Pre-rendered article body for pages whose full content is shared with the server. */
  bodyHtml?: string;
  /** Question-and-answer pairs visible on the page; also emitted as FAQPage schema. */
  faqs?: SeoFaq[];
  /** Set when bodyHtml already renders the FAQs, so they are not rendered twice. */
  faqsInBody?: boolean;
  /** Article metadata for schemaKind "article". */
  article?: { author: string; datePublished?: string; dateModified?: string };
};

export type SeoFaq = { question: string; answer: string };

export type SitemapEntry = {
  path: string;
  lastmod: string;
  changefreq: "weekly" | "monthly";
  priority: string;
};

// These are the ordinary, always-available links in the rendered site header and
// footer. Keep the server-rendered document on the same public navigation graph:
// the React header uses hover menus, which should not be a prerequisite for a
// crawler (or a keyboard-only visitor) to discover these destinations.
const PUBLIC_NAVIGATION_LINKS: SeoLink[] = [
  { label: "Secure AI Adoption", href: "/secure-ai-adoption" },
  { label: "AI Governance", href: "/solutions/ai-governance" },
  { label: "Microsoft Copilot Readiness", href: "/solutions/microsoft-copilot-readiness" },
  { label: "Financial Services and Credit Unions", href: "/industries/financial-services-credit-unions" },
  { label: "CMMC and Compliance Automation", href: "/cmmc-compliance-automation" },
  { label: "CMMCLens", href: "/cmmclens" },
  { label: "AttackSense", href: "/attacksense" },
  { label: "CMMC Knowledge Hub", href: "/knowledge-hub" },
  { label: "CMMC Blog", href: "/blog" },
  { label: "Datasheets", href: "/datasheets" },
  { label: "Supplier Readiness", href: "/supplier-readiness" },
  { label: "Delivery Model", href: "/delivery-model" },
  { label: "Representative Engagements", href: "/representative-engagements" },
  { label: "Capability Statement", href: "/capability-statement" },
  { label: "Contact DefenseEye", href: "/contact" },
  { label: "Support", href: "/support" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const BLOG_INDEX_LINKS: SeoLink[] = [
  { label: "CMMC Level 2 Compliance Checklist for DoD Contractors", href: "/blog/cmmc-level-2-compliance-checklist-2025" },
  { label: "How to Improve Your SPRS Score Fast", href: "/blog/how-to-improve-sprs-score-fast" },
  { label: "What to Expect During a C3PAO Assessment", href: "/blog/what-to-expect-c3pao-assessment" },
  { label: "What Counts as CUI?", href: "/blog/what-counts-as-cui-plain-english-guide" },
  { label: "CMMC Level 2 for Small Businesses", href: "/blog/cmmc-level-2-small-business-guide" },
  { label: "GCC High vs M365 Commercial for CMMC", href: "/blog/gcc-high-vs-m365-commercial-cmmc" },
  { label: "CMMC POA&M: What Assessors Look For", href: "/blog/cmmc-poam-guide-what-assessors-want" },
  { label: "CMMC Consultant Red Flags", href: "/blog/cmmc-consultant-red-flags" },
];

const KNOWLEDGE_HUB_LINKS: SeoLink[] = [
  { label: "What is CMMC?", href: "/knowledge-hub/what-is-cmmc" },
  { label: "CMMC Level 1 vs Level 2", href: "/knowledge-hub/cmmc-levels" },
  { label: "Automated Evidence Mapping for NIST 800-171", href: "/knowledge-hub/evidence-mapping" },
  { label: "Understanding Your SPRS Score", href: "/knowledge-hub/sprs-score" },
  { label: "CMMC Certification Process", href: "/knowledge-hub/certification-process" },
  { label: "What is CMMC Level 2?", href: "/insights/what-is-cmmc-level-2" },
  { label: "What is NIST AI RMF?", href: "/insights/what-is-nist-ai-rmf" },
  { label: "How can organizations implement AI governance?", href: "/insights/implement-ai-governance" },
  { label: "How can AI automate evidence collection?", href: "/insights/ai-automated-evidence-collection" },
];

const materialSeoUpdateDate = "2026-08-31";
const customerJourneyUpdateDate = "2026-09-01";
const industryPagesUpdateDate = "2026-09-04";
const whyDefenseEyeUpdateDate = "2026-09-05";

const TIER_1_ROUTE_DEFINITIONS: SeoRoute[] = [
  {
    path: "/",
    title: "DefenseEye | Secure Agentic AI Implementation",
    description:
      "DefenseEye helps FinTechs, credit unions, and regulated organizations implement agentic AI with secure architecture, responsible governance, human oversight, and hands-on delivery support.",
    h1: "Implement Agentic AI Securely",
    eyebrow: "Secure Agentic AI for Regulated Organizations",
    summary:
      "DefenseEye helps regulated organizations move from AI exploration to governed agentic AI implementation while keeping CMMC, CMMCLens, AttackSense, and supplier readiness available as focused portfolio paths.",
    sections: [
      {
        heading: "Secure AI Implementation Focus",
        body:
          "The homepage now introduces DefenseEye's Secure AI implementation practice for organizations that need secure data access, identity controls, responsible governance, human oversight, and practical delivery support before AI agents become operational.",
      },
      {
        heading: "Additional DefenseEye Capabilities",
        items: [
          "CMMC and NIST SP 800-171 readiness",
          "CMMCLens compliance evidence automation",
          "AttackSense attack surface intelligence",
          "Supplier and subcontracting support",
        ],
      },
    ],
    links: [
      { label: "Request a Secure AI Readiness Consultation", href: "/secure-ai-adoption#secure-ai-consultation" },
      { label: "Explore CMMC readiness and automation", href: "/cmmc" },
      { label: "Review the CMMCLens compliance automation platform", href: "/cmmclens" },
      { label: "View AttackSense attack surface intelligence", href: "/attacksense" },
      { label: "See supplier readiness information", href: "/supplier-readiness" },
      { label: "View Representative Engagements", href: "/representative-engagements" },
      { label: "Why DefenseEye", href: "/why-defenseeye" },
    ],
    faqs: HOME_AT_A_GLANCE,
    schemaKind: "home",
    topics: ["Secure AI adoption", "AI governance", "Agentic AI implementation", "CMMC", "CMMCLens", "AttackSense"],
    lastmod: customerJourneyUpdateDate,
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/secure-ai-adoption",
    title: "Secure Agentic AI Consulting | DefenseEye",
    description:
      "DefenseEye helps regulated organizations implement agentic AI with secure architecture, responsible governance, risk controls, and hands-on delivery support.",
    h1: "Implement Agentic AI Securely",
    eyebrow: "Secure Agentic AI Readiness & Implementation",
    summary:
      "DefenseEye helps regulated organizations and teams handling sensitive data explore, pilot, implement, and scale agentic AI responsibly through secure architecture, governance, oversight, evaluation, and implementation support.",
    sections: [
      {
        heading: "Who DefenseEye Helps",
        body:
          "Regulated organizations and teams handling sensitive data that want to explore, pilot, implement, or scale agentic AI responsibly.",
      },
      {
        heading: "What DefenseEye Delivers",
        items: [
          "AI readiness and use-case prioritization",
          "Secure agent, identity, data, and integration architecture",
          "Responsible AI governance and NIST AI RMF alignment",
          "Human oversight, evaluation, testing, and operational controls",
          "Hands-on agentic AI implementation and integration support",
        ],
      },
      {
        heading: "Secure AI for Financial Services",
        body:
          "DefenseEye helps financial-services teams assess and implement agentic AI workflows with practical controls for sensitive financial and member information, least-privilege access, traceability, evaluation, monitoring, and human oversight.",
      },
    ],
    links: [
      { label: "Request a Secure AI Readiness Consultation", href: "/secure-ai-adoption#secure-ai-consultation" },
      { label: "Review AI governance consulting", href: "/solutions/ai-governance" },
      { label: "Review Microsoft Copilot readiness", href: "/solutions/microsoft-copilot-readiness" },
      { label: "Review AI security consulting", href: "/solutions/ai-security" },
      { label: "View Representative Engagements", href: "/representative-engagements" },
      { label: "Why DefenseEye", href: "/why-defenseeye" },
    ],
    schemaKind: "service",
    serviceType: "Secure agentic AI readiness and implementation consulting",
    topics: ["Secure agentic AI implementation", "Responsible AI governance", "NIST AI RMF", "Financial services AI readiness"],
    lastmod: customerJourneyUpdateDate,
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    path: "/industries/financial-services-credit-unions",
    title: "Secure AI for Financial Services and Credit Unions | DefenseEye",
    description:
      "DefenseEye helps financial-services teams and credit unions evaluate and implement AI and agentic AI with security, governance, data-access controls, traceability, monitoring, and human oversight.",
    h1: "Secure AI for Financial Services and Credit Unions",
    eyebrow: "Financial Services & Credit Unions",
    summary:
      "DefenseEye helps regulated financial-services teams and credit unions evaluate and implement AI and agentic AI with appropriate security, governance, data-access controls, traceability, evaluation, monitoring, and human oversight.",
    sections: [
      {
        heading: "Who this is for",
        body:
          "Financial-services, FinTech, banking, lending, payments, insurance, and credit union teams exploring AI-enabled workflows involving sensitive customer, member, operational, or internal business data.",
        items: [
          "Security, risk, compliance, privacy, and technology leaders evaluating AI adoption",
          "Teams preparing Microsoft Copilot, Azure OpenAI, or agentic workflow pilots",
          "Organizations that need practical controls without treating consulting as a financial product",
        ],
      },
      {
        heading: "Common AI adoption challenges",
        items: [
          "Sensitive financial, member, customer, or employee data exposure",
          "Unclear AI-agent permissions, system access, and human approval points",
          "Difficulty tracing AI-assisted decisions, outputs, and source material",
          "Model, vendor, prompt, evaluation, monitoring, and change-management risk",
          "Balancing innovation goals with audit, oversight, and policy expectations",
        ],
      },
      {
        heading: "How DefenseEye can help",
        items: [
          "Prioritize use cases by value, feasibility, data sensitivity, and risk",
          "Review AI governance, human oversight, and accountability requirements",
          "Design secure target architecture for identity, data access, logging, and monitoring",
          "Assess Microsoft Copilot readiness and broader secure AI implementation needs",
          "Define pilot success criteria, evaluation practices, and implementation roadmaps",
        ],
      },
      {
        heading: "Why DefenseEye for Secure AI in Financial Services",
        body:
          "For teams deciding whether an AI use case is ready to move forward, DefenseEye brings published secure-AI, governance, and Microsoft readiness capabilities to the discussion. Representative engagements describe the types of work DefenseEye is positioned to support; they are not customer case studies.",
        items: [
          "Secure architecture for sensitive data, identity, system access, integrations, logging, and monitoring",
          "AI governance, evaluation, testing, accountability, and human-oversight practices",
          "Microsoft Copilot and Azure OpenAI readiness support for data, permissions, information governance, and operating controls",
          "Practical support from use-case prioritization through pilot planning and governed implementation",
        ],
      },
      {
        heading: "What a Readiness Conversation Can Clarify",
        items: [
          "The priority use case and intended business outcome",
          "Sensitive data, systems, and integrations involved",
          "Identity, access, and security boundaries",
          "Governance, evaluation, and human-oversight requirements",
          "Whether a readiness sprint or pilot-scoping engagement is appropriate",
        ],
      },
      {
        heading: "Relevant Secure AI solutions and resources",
        items: [
          "Secure AI adoption and readiness consultation",
          "AI governance, AI security, AI transformation, and Microsoft Copilot readiness support",
          "Representative engagements that show the types of work DefenseEye is positioned to support",
        ],
      },
    ],
    links: [
      { label: "Request a Secure AI Readiness Consultation", href: "/secure-ai-adoption#secure-ai-consultation" },
      { label: "Explore Secure AI adoption", href: "/secure-ai-adoption" },
      { label: "AI-agent risk management for banks and fintechs", href: BANKING_AI_RISK_PATH },
      { label: "Review AI governance consulting", href: "/solutions/ai-governance" },
      { label: "Review AI security consulting", href: "/solutions/ai-security" },
      { label: "Review AI transformation consulting", href: "/solutions/ai-transformation" },
      { label: "Review Microsoft Copilot readiness", href: "/solutions/microsoft-copilot-readiness" },
      { label: "View Representative Engagements", href: "/representative-engagements" },
    ],
    schemaKind: "service",
    serviceType: "Secure AI consulting for financial services and credit unions",
    topics: [
      "Financial services AI readiness",
      "Credit union AI governance",
      "Secure AI adoption",
      "Agentic AI governance",
      "Microsoft Copilot readiness",
    ],
    lastmod: industryPagesUpdateDate,
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: BANKING_AI_RISK_PATH,
    title: "AI-Agent Risk Management for Banks and Fintechs | DefenseEye",
    description:
      "DefenseEye helps banks and fintechs discover AI-agent exposure, prioritize business risk, govern approvals, monitor behavior, and guide remediation.",
    h1: BANKING_AI_RISK_CONTENT.h1,
    eyebrow: BANKING_AI_RISK_CONTENT.eyebrow,
    summary: BANKING_AI_RISK_CONTENT.intro,
    sections: [
      {
        heading: BANKING_AI_RISK_CONTENT.painHeading,
        items: BANKING_AI_RISK_CONTENT.pains.map((pain) => `${pain.title}: ${pain.text}`),
      },
      {
        heading: BANKING_AI_RISK_CONTENT.solutionHeading,
        items: BANKING_AI_RISK_CONTENT.capabilities.map((capability) => `${capability.title}: ${capability.text}`),
      },
      { heading: BANKING_AI_RISK_CONTENT.audienceHeading, items: [...BANKING_AI_RISK_CONTENT.audiences] },
      { heading: BANKING_AI_RISK_CONTENT.productHeading, body: BANKING_AI_RISK_CONTENT.productText },
      { heading: BANKING_AI_RISK_CONTENT.offerHeading, body: `${BANKING_AI_RISK_CONTENT.offerText} ${BANKING_AI_RISK_CONTENT.trustText}` },
    ],
    links: [
      { label: BANKING_AI_RISK_CONTENT.primaryCta, href: BANKING_DISCOVERY_HREF },
      { label: BANKING_AI_RISK_CONTENT.productCta, href: DEFY_AI_RISK_URL },
      { label: "Secure AI for financial services and credit unions", href: "/industries/financial-services-credit-unions" },
      { label: "Review AI governance consulting", href: "/solutions/ai-governance" },
    ],
    schemaKind: "service",
    serviceType: "AI-agent risk management for banks and fintechs",
    topics: ["AI-agent risk management", "Banking AI governance", "Fintech AI risk", "AI-agent monitoring", "Guided remediation"],
    lastmod: "2026-10-25",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/industries/defense-industrial-base",
    title: "Cybersecurity and Compliance Support for the Defense Industrial Base | DefenseEye",
    description:
      "DefenseEye supports defense contractors, subcontractors, suppliers, and federal contractor teams preparing for applicable cybersecurity, CMMC, NIST SP 800-171, evidence, and supplier-readiness requirements.",
    h1: "Cybersecurity and Compliance Support for the Defense Industrial Base",
    eyebrow: "Defense Industrial Base & Federal Contractors",
    summary:
      "DefenseEye supports defense contractors, subcontractors, suppliers, and organizations preparing for applicable federal cybersecurity requirements with cybersecurity readiness, CMMC and NIST SP 800-171 support, evidence planning, and compliance automation.",
    sections: [
      {
        heading: "Who this is for",
        body:
          "Defense contractors, subcontractors, suppliers, and federal contractor teams that need to understand and prepare for requirements that may apply based on contract scope, CUI handling, flow-downs, and customer expectations.",
        items: [
          "Organizations handling or preparing to handle controlled unclassified information",
          "Teams responding to prime contractor, supplier, or federal customer cybersecurity expectations",
          "Leaders evaluating CMMC readiness, evidence automation, and supplier documentation needs",
        ],
      },
      {
        heading: "Common readiness and evidence challenges",
        items: [
          "Unclear CUI scope, system boundaries, and shared responsibility across suppliers",
          "Fragmented SSP, POA&M, policy, asset, and evidence materials",
          "Difficulty mapping evidence to NIST SP 800-171 and CMMC readiness expectations",
          "Manual readiness reporting without clear ownership or remediation traceability",
          "Need to present supplier capabilities without overstating readiness or outcomes",
        ],
      },
      {
        heading: "How DefenseEye can help",
        items: [
          "Review readiness scope, control gaps, evidence, SSP, POA&M, and remediation priorities",
          "Align cybersecurity work with applicable CMMC and NIST SP 800-171 preparation needs",
          "Use compliance automation where it can improve evidence traceability and readiness visibility",
          "Assess whether CMMCLens fits the evidence, documentation, and readiness workflow",
          "Support capability-statement, supplier-readiness, and representative engagement materials",
        ],
      },
      {
        heading: "Why DefenseEye for Defense Contractors and Suppliers",
        body:
          "For organizations deciding how to prepare, DefenseEye combines published CMMC readiness, compliance-automation, supplier, and Microsoft-centered security capabilities without representing assessment or certification outcomes.",
        items: [
          "Multiple CMMC Certified Professionals supporting CMMC and NIST SP 800-171 readiness work",
          "SSP, POA&M, evidence, and remediation workflow support",
          "CMMCLens for evidence collection, control mapping, and readiness workflows",
          "Published supplier identifiers, procurement information, and Microsoft cloud security and compliance capabilities",
        ],
      },
      {
        heading: "What an Initial Readiness Conversation Can Clarify",
        items: [
          "Applicable contract and information-handling context",
          "Current assessment and evidence status",
          "Priority control and remediation gaps",
          "SSP, POA&M, and evidence workflow needs",
          "Whether consulting, automation, or supplier support is the appropriate path",
        ],
      },
      {
        heading: "Relevant solutions and procurement resources",
        items: [
          "CMMC readiness, Level 2 preparation, compliance automation, and evidence automation",
          "CMMCLens for evidence automation, control mapping, and readiness workflows",
          "Supplier readiness, capability statement, and representative engagements",
        ],
      },
    ],
    links: [
      { label: "Discuss CMMC Readiness", href: "/contact?inquiry=cmmc" },
      { label: "Review CMMC readiness", href: "/cmmc" },
      { label: "Review CMMC Level 2 readiness", href: "/cmmc-level-2-readiness" },
      { label: "Review CMMC compliance automation", href: "/cmmc-compliance-automation" },
      { label: "Explore CMMCLens", href: "/cmmclens" },
      { label: "Review supplier readiness", href: "/supplier-readiness" },
      { label: "Open the capability statement", href: "/capability-statement" },
      { label: "View Representative Engagements", href: "/representative-engagements" },
    ],
    schemaKind: "service",
    serviceType: "Cybersecurity and compliance readiness support for defense contractors",
    topics: [
      "Defense Industrial Base cybersecurity",
      "Federal contractor cybersecurity",
      "CMMC readiness",
      "NIST SP 800-171",
      "CMMCLens",
      "Supplier readiness",
    ],
    lastmod: industryPagesUpdateDate,
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/solutions/ai-governance",
    title: "AI Governance and NIST AI RMF Consulting | DefenseEye",
    description:
      "AI governance consulting for NIST AI RMF, responsible AI, AI risk management, human accountability, model governance, policy development, and Copilot governance.",
    h1: "AI Governance Consulting for Regulated Organizations",
    eyebrow: "AI Governance",
    summary:
      "DefenseEye helps organizations move from AI experimentation to governed adoption by implementing practical oversight, risk management, accountability, explainability, policy, and security controls.",
    sections: [
      {
        heading: "How DefenseEye Helps",
        items: [
          "Align governance practices to NIST AI RMF and responsible AI operating practices",
          "Define AI policy, use-case review, oversight roles, and human accountability",
          "Assess shadow AI, AI vendor risk, model governance, and explainability needs",
          "Integrate Copilot governance with data protection, permissions, and security operations",
        ],
      },
    ],
    links: [
      { label: "Plan Secure AI implementation", href: "/secure-ai-adoption" },
      { label: "Assess Microsoft Copilot readiness", href: "/solutions/microsoft-copilot-readiness" },
      { label: "Read the NIST AI RMF explanation", href: "/insights/what-is-nist-ai-rmf" },
    ],
    schemaKind: "service",
    serviceType: "AI governance and NIST AI RMF consulting",
    topics: ["AI governance", "NIST AI RMF", "Responsible AI", "Copilot governance"],
    lastmod: materialSeoUpdateDate,
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    path: "/solutions/ai-transformation",
    title: "AI Transformation Consulting and Adoption Roadmaps | DefenseEye",
    description:
      "AI transformation consulting for AI opportunity discovery, adoption roadmaps, Microsoft Copilot enablement, Azure OpenAI readiness, automation, data readiness, and value realization.",
    h1: "Secure AI Transformation Consulting",
    eyebrow: "AI Transformation",
    summary:
      "DefenseEye helps organizations identify practical AI opportunities, prioritize high-value use cases, prepare Microsoft and cloud environments, and implement AI adoption roadmaps with governance and security built in.",
    sections: [
      {
        heading: "Transformation Priorities",
        items: [
          "Use-case discovery and prioritization",
          "Data and workflow readiness",
          "Microsoft Copilot and Azure OpenAI readiness",
          "Governance-by-design adoption planning",
        ],
      },
    ],
    links: [
      { label: "Move from roadmap to Secure AI implementation", href: "/secure-ai-adoption" },
      { label: "Review AI governance consulting", href: "/solutions/ai-governance" },
      { label: "Review AI security controls", href: "/solutions/ai-security" },
    ],
    schemaKind: "service",
    serviceType: "Secure AI transformation consulting",
    topics: ["AI transformation", "AI adoption roadmap", "Azure OpenAI readiness", "Copilot enablement"],
    lastmod: materialSeoUpdateDate,
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    path: "/solutions/ai-security",
    title: "AI Security and Generative AI Risk Consulting | DefenseEye",
    description:
      "AI security consulting for generative AI risk assessments, LLM threat modeling, Azure AI security consulting, Copilot security, identity controls, and regulated AI adoption.",
    h1: "AI Security Consulting",
    eyebrow: "AI Security",
    summary:
      "DefenseEye helps organizations reduce risks introduced by generative AI, LLMs, AI agents, sensitive data exposure, prompt injection, identity misuse, and inadequate monitoring.",
    sections: [
      {
        heading: "AI Security Controls",
        items: [
          "AI threat modeling and LLM workflow review",
          "Guardrail, logging, monitoring, and access-control review",
          "Sensitive data and agent-permission risk analysis",
          "Secure Azure OpenAI and Copilot adoption recommendations",
        ],
      },
    ],
    links: [
      { label: "Implement Secure AI with architecture support", href: "/secure-ai-adoption" },
      { label: "Review AI governance consulting", href: "/solutions/ai-governance" },
      { label: "Assess Microsoft Copilot readiness", href: "/solutions/microsoft-copilot-readiness" },
    ],
    schemaKind: "service",
    serviceType: "AI security and generative AI risk consulting",
    topics: ["AI security", "Azure OpenAI risk", "LLM threat modeling", "AI agent identity"],
    lastmod: materialSeoUpdateDate,
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/solutions/microsoft-copilot-readiness",
    title: "Microsoft Copilot Readiness Consulting | DefenseEye",
    description:
      "Microsoft Copilot readiness consulting for governance, permissions, data exposure, Microsoft 365, Purview, Entra, Defender, privacy, security, and adoption planning.",
    h1: "Microsoft Copilot Readiness Consulting",
    eyebrow: "Microsoft Copilot Readiness",
    summary:
      "DefenseEye helps organizations assess whether Microsoft 365, identity, information governance, and operating controls are ready for safer Copilot adoption.",
    sections: [
      {
        heading: "Copilot Readiness Areas",
        items: [
          "Microsoft 365 permissions and overshared content review",
          "Entra, Purview, Defender, and Sentinel alignment",
          "Copilot governance, adoption guardrails, and human accountability",
          "Risk-prioritized roadmap for staged deployment",
        ],
      },
    ],
    links: [
      { label: "Connect Copilot readiness to Secure AI implementation", href: "/secure-ai-adoption" },
      { label: "Review AI governance consulting", href: "/solutions/ai-governance" },
      { label: "Review AI security consulting", href: "/solutions/ai-security" },
    ],
    schemaKind: "service",
    serviceType: "Microsoft Copilot readiness consulting",
    topics: ["Microsoft Copilot readiness", "Microsoft 365 permissions", "Purview", "Entra", "Defender"],
    lastmod: materialSeoUpdateDate,
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/cmmc",
    title: "CMMC Readiness, Evidence Automation, and Advisory Support | DefenseEye",
    description:
      "CMMC readiness planning, NIST SP 800-171 alignment, SSP and POA&M support, evidence automation, and CMMCLens-enabled readiness workflows.",
    h1: "CMMC readiness, evidence automation, and advisory support",
    eyebrow: "CMMC / NIST SP 800-171",
    summary:
      "DefenseEye supports defense contractors with CMMC readiness planning, NIST SP 800-171 alignment, SSP and POA&M support, evidence automation, and CMMCLens-enabled readiness workflows.",
    sections: [
      {
        heading: "CMMC Readiness Support",
        items: [
          "CMMC Level 2 readiness consulting",
          "NIST SP 800-171 control alignment",
          "SSP and POA&M support",
          "Evidence automation and traceability",
          "CMMCLens platform fit assessment",
        ],
      },
    ],
    links: [
      { label: "Review CMMC Level 2 readiness", href: "/cmmc-level-2-readiness" },
      { label: "Review NIST SP 800-171 readiness", href: "/nist-800-171" },
      { label: "Explore CMMCLens evidence automation", href: "/cmmclens" },
      { label: "Use the CMMC Knowledge Hub", href: "/knowledge-hub" },
    ],
    schemaKind: "service",
    serviceType: "CMMC readiness and compliance automation advisory",
    topics: ["CMMC", "CMMC Level 2", "NIST SP 800-171", "SSP", "POA&M", "SPRS"],
    lastmod: materialSeoUpdateDate,
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/cmmc-level-2-readiness",
    title: "CMMC Level 2 Readiness Consulting and Automation | DefenseEye",
    description:
      "CMMC Level 2 readiness support for CUI scope, NIST SP 800-171 gaps, SSP, POA&M, evidence planning, SPRS, and assessment readiness.",
    h1: "CMMC Level 2 readiness consulting and automation",
    eyebrow: "CMMC Level 2",
    summary:
      "DefenseEye helps organizations prepare for CMMC Level 2 expectations through scope review, control gap analysis, readiness roadmap, evidence planning, and documentation support.",
    sections: [
      {
        heading: "Level 2 Readiness Areas",
        items: [
          "CUI boundary review",
          "110-control readiness assessment",
          "SPRS and remediation prioritization",
          "C3PAO assessment readiness planning",
          "Executive readiness summary",
        ],
      },
    ],
    links: [
      { label: "Review the CMMC pillar page", href: "/cmmc" },
      { label: "Review NIST SP 800-171 readiness", href: "/nist-800-171" },
      { label: "Read what CMMC Level 2 requires", href: "/insights/what-is-cmmc-level-2" },
    ],
    schemaKind: "service",
    serviceType: "CMMC Level 2 readiness consulting",
    topics: ["CMMC Level 2 readiness", "CUI", "SPRS", "C3PAO readiness"],
    lastmod: materialSeoUpdateDate,
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/cmmc-compliance-automation",
    title: "CMMC Compliance Automation | DefenseEye CCP-Led CMMC Readiness and CMMCLens",
    description:
      "DefenseEye provides CCP-led CMMC Level 2 readiness, NIST SP 800-171 support, SSP/POA&M preparation, compliance evidence automation, and CMMCLens platform-enabled readiness workflows.",
    h1: "CMMC & Compliance Automation",
    eyebrow: "CMMC Compliance Practice",
    summary:
      "DefenseEye provides CCP-led CMMC readiness support, NIST SP 800-171 gap assessment, System Security Plan and POA&M support, and evidence automation workflows supported by CMMCLens.",
    sections: [
      {
        heading: "Core Offering",
        items: [
          "CCP-led readiness and gap assessment",
          "SSP and POA&M management support",
          "SPRS score benchmarking and remediation workflow tracking",
          "CMMCLens evidence automation and dashboards",
        ],
      },
    ],
    links: [
      { label: "Review the CMMC pillar page", href: "/cmmc" },
      { label: "Explore CMMCLens platform capabilities", href: "/cmmclens" },
      { label: "Review CMMC evidence automation services", href: "/cmmc-evidence-automation" },
      { label: "Use the CMMC Knowledge Hub", href: "/knowledge-hub" },
    ],
    schemaKind: "service",
    serviceType: "CMMC compliance automation and readiness consulting",
    topics: ["CMMC compliance automation", "CMMCLens", "SSP", "POA&M", "Evidence automation"],
    lastmod: materialSeoUpdateDate,
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    path: "/cmmc-evidence-automation",
    title: "CMMC Evidence Automation | DefenseEye",
    description:
      "CMMC evidence automation with CMMCLens, control mapping, traceability, readiness dashboards, and documentation workflows.",
    h1: "CMMC evidence automation and compliance traceability",
    eyebrow: "Evidence Automation",
    summary:
      "DefenseEye uses automation and CMMCLens to support evidence collection, control mapping, documentation workflows, dashboards, and continuous readiness monitoring.",
    sections: [
      {
        heading: "Evidence Automation Services",
        items: [
          "Automated evidence collection planning",
          "Control mapping and evidence traceability",
          "Readiness dashboards",
          "SSP and POA&M workflow support",
        ],
      },
    ],
    links: [
      { label: "Compare with the CMMCLens product page", href: "/cmmclens" },
      { label: "Review CMMC compliance automation", href: "/cmmc-compliance-automation" },
      { label: "Read the evidence mapping guide", href: "/knowledge-hub/evidence-mapping" },
    ],
    schemaKind: "service",
    serviceType: "CMMC evidence automation consulting",
    topics: ["CMMC evidence automation", "Control mapping", "Traceability", "CMMCLens"],
    lastmod: materialSeoUpdateDate,
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/nist-800-171",
    title: "NIST SP 800-171 Readiness and Compliance Automation | DefenseEye",
    description:
      "NIST SP 800-171 readiness support for control review, evidence planning, SSP support, POA&M support, SPRS, and compliance automation.",
    h1: "NIST SP 800-171 readiness and compliance automation",
    eyebrow: "NIST SP 800-171",
    summary:
      "DefenseEye supports NIST SP 800-171 alignment through control review, evidence planning, documentation support, remediation prioritization, and automation workflows.",
    sections: [
      {
        heading: "NIST SP 800-171 Support",
        items: [
          "Control readiness review",
          "SSP and POA&M support",
          "Evidence mapping",
          "SPRS score improvement planning",
          "Compliance automation workflows",
        ],
      },
    ],
    links: [
      { label: "Review CMMC Level 2 readiness", href: "/cmmc-level-2-readiness" },
      { label: "Review the CMMC pillar page", href: "/cmmc" },
      { label: "Read the NIST evidence mapping guide", href: "/knowledge-hub/evidence-mapping" },
    ],
    schemaKind: "service",
    serviceType: "NIST SP 800-171 readiness consulting",
    topics: ["NIST SP 800-171", "SPRS", "SSP", "POA&M", "CMMC Level 2"],
    lastmod: materialSeoUpdateDate,
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/cmmclens",
    title: "CMMCLens Compliance Automation Platform | DefenseEye",
    description:
      "CMMCLens is DefenseEye's flagship compliance automation platform for CMMC and NIST SP 800-171 readiness, evidence automation, control mapping, gap tracking, SSP and POA&M workflows, policy support, and readiness visibility.",
    h1: "CMMCLens Compliance Automation Platform",
    eyebrow: "Flagship Platform",
    summary:
      "CMMCLens is DefenseEye's compliance automation platform for evidence automation, control mapping, gap tracking, SSP and POA&M workflows, policy support, and readiness visibility.",
    sections: [
      {
        heading: "Platform Capabilities",
        items: [
          "Automated evidence collection",
          "Control mapping and traceability",
          "Gap tracking and remediation workflows",
          "AI-assisted documentation for human review",
          "Continuous readiness monitoring",
        ],
      },
    ],
    links: [
      { label: "Review CMMC evidence automation services", href: "/cmmc-evidence-automation" },
      { label: "Review CMMC compliance automation", href: "/cmmc-compliance-automation" },
      { label: "Read the evidence mapping guide", href: "/knowledge-hub/evidence-mapping" },
      { label: "Why DefenseEye", href: "/why-defenseeye" },
    ],
    schemaKind: "software",
    topics: ["CMMCLens", "Compliance automation", "Evidence automation", "CMMC"],
    lastmod: materialSeoUpdateDate,
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/attacksense",
    title: "AttackSense | DefenseEye Attack Surface and Remediation Intelligence",
    description:
      "AttackSense helps security teams consolidate attack surface findings, vulnerability signals, attack path context, remediation ownership, and executive-ready risk visibility.",
    h1: "Attack Surface Intelligence for Actionable Remediation",
    eyebrow: "AttackSense",
    summary:
      "AttackSense helps security teams move beyond static vulnerability lists by turning exposure data, attack paths, and remediation ownership into a focused operating picture for reducing real risk.",
    sections: [
      {
        heading: "Operational Outcomes",
        items: [
          "Signal consolidation",
          "Prioritized remediation",
          "Attack path awareness",
          "Executive-ready risk visibility",
        ],
      },
    ],
    links: [
      { label: "View the AttackSense guide", href: "/attacksense/docs" },
      { label: "Review DefenseEye cybersecurity risk consulting", href: "/solutions/cybersecurity-risk" },
      { label: "See supplier readiness information", href: "/supplier-readiness" },
    ],
    schemaKind: "service",
    serviceType: "Attack surface intelligence and remediation prioritization support",
    topics: ["AttackSense", "Attack surface intelligence", "Vulnerability remediation", "Security operations"],
    lastmod: materialSeoUpdateDate,
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    path: "/supplier-readiness",
    title: "DefenseEye Supplier Readiness | AI, Cybersecurity, CMMC, and Microsoft Cloud Consulting",
    description:
      "DefenseEye is a Redmond, WA-based minority-owned AI, cybersecurity, Microsoft cloud, and compliance automation firm available for enterprise supplier, subcontracting, advisory, implementation, and staff augmentation opportunities.",
    h1: "Supplier-Ready AI, Cybersecurity, and Compliance Expertise",
    eyebrow: "Supplier Readiness",
    summary:
      "DefenseEye is available for enterprise supplier, subcontracting, advisory, implementation, staff augmentation, and platform-enabled consulting opportunities across AI governance, cybersecurity, Microsoft cloud, CMMC, and compliance automation.",
    sections: [
      {
        heading: "Supplier Capabilities",
        items: [
          "AI governance and secure AI implementation support",
          "Cybersecurity and Microsoft cloud security",
          "CMMC readiness and compliance automation",
          "CMMCLens and AttackSense portfolio support",
        ],
      },
    ],
    links: [
      { label: "Review the capability statement", href: "/capability-statement" },
      { label: "Explore Secure AI adoption support", href: "/secure-ai-adoption" },
      { label: "Review CMMC readiness support", href: "/cmmc" },
    ],
    schemaKind: "service",
    serviceType: "Supplier-ready AI, cybersecurity, CMMC, and Microsoft cloud consulting",
    topics: ["Supplier readiness", "AI consulting supplier", "Cybersecurity supplier", "CMMC supplier"],
    lastmod: materialSeoUpdateDate,
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    path: "/knowledge-hub",
    title: "CMMC Knowledge Hub | DefenseEye",
    description:
      "Authoritative CMMC 2.0 guides for DoD contractors: levels, NIST 800-171 controls, SPRS scoring, and certification process.",
    h1: "CMMC Knowledge Hub",
    eyebrow: "CMMC Education",
    summary:
      "The DefenseEye Knowledge Hub organizes practical CMMC, NIST SP 800-171, SPRS, evidence mapping, certification, and AI governance resources for teams preparing for regulated assurance work.",
    sections: [
      {
        heading: "Featured Resources",
        items: [
          "What is CMMC?",
          "CMMC Level 1 vs Level 2",
          "Automated evidence mapping for NIST SP 800-171",
          "SPRS score guidance",
          "CMMC certification process",
        ],
      },
    ],
    links: [
      { label: "Read what CMMC means for contractors", href: "/knowledge-hub/what-is-cmmc" },
      { label: "Compare CMMC levels", href: "/knowledge-hub/cmmc-levels" },
      { label: "Read the NIST evidence mapping guide", href: "/knowledge-hub/evidence-mapping" },
      { label: "Review the CMMC service pillar", href: "/cmmc" },
      { label: "Read the CMMC blog", href: "/blog" },
    ],
    schemaKind: "collection",
    topics: ["CMMC education", "NIST SP 800-171", "SPRS", "Evidence mapping", "CMMC certification"],
    lastmod: materialSeoUpdateDate,
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/blog",
    title: "CMMC Blog for Defense Contractors | DefenseEye.ai",
    description:
      "Practical CMMC guides for defense contractors: NIST 800-171, SPRS improvement, C3PAO assessment prep, and CMMC Level 2 readiness.",
    h1: "CMMC Blog for Defense Contractors",
    eyebrow: "CMMC Revenue Protection Insights",
    summary:
      "DefenseEye's blog provides practical CMMC guidance for defense contractors, including CMMC Level 2 checklists, SPRS improvement, C3PAO assessment preparation, CUI guidance, GCC High decisions, POA&M expectations, and consultant selection.",
    sections: [
      {
        heading: "Featured Articles",
        items: [
          "CMMC Level 2 Compliance Checklist for DoD Contractors",
          "How to Improve SPRS Score Fast",
          "What to Expect in a C3PAO Assessment",
          "What Counts as CUI",
          "CMMC POA&M Guidance",
        ],
      },
    ],
    links: [
      { label: "Read the CMMC Level 2 checklist", href: "/blog/cmmc-level-2-compliance-checklist-2025" },
      { label: "Read how to improve an SPRS score", href: "/blog/how-to-improve-sprs-score-fast" },
      { label: "Read what to expect in a C3PAO assessment", href: "/blog/what-to-expect-c3pao-assessment" },
      { label: "Review the CMMC service pillar", href: "/cmmc" },
      { label: "Use the CMMC Knowledge Hub", href: "/knowledge-hub" },
    ],
    schemaKind: "collection",
    topics: ["CMMC blog", "CMMC Level 2", "SPRS", "C3PAO", "CUI", "POA&M"],
    lastmod: materialSeoUpdateDate,
    changefreq: "weekly",
    priority: "0.8",
  },
  {
    path: "/why-defenseeye",
    title: "Why DefenseEye | Secure AI, Cybersecurity and CMMC Practitioners",
    description:
      "Learn how DefenseEye combines secure AI implementation, cybersecurity, Microsoft cloud experience, CMMC readiness, and compliance automation to help regulated organizations and defense contractors move from requirements to practical delivery.",
    h1: "Secure AI and Compliance Automation, Built by Practitioners",
    eyebrow: "Why DefenseEye",
    summary:
      "DefenseEye is a Redmond, Washington cybersecurity and AI company helping regulated organizations and defense contractors turn security, governance, and compliance requirements into practical implementation.",
    sections: [
      {
        heading: "What DefenseEye Helps Organizations Do",
        items: [
          "Evaluate and implement AI and agentic AI with identity, data-access, security, governance, evaluation, and human-oversight controls",
          "Prepare for applicable CMMC and NIST SP 800-171 requirements through readiness, evidence, SSP, POA&M, gap-tracking, and remediation support",
          "Use CMMCLens to support evidence automation, control mapping, traceability, gap tracking, SSP and POA&M workflows, and readiness visibility",
          "Strengthen Microsoft cloud, Copilot, Azure AI, cybersecurity, and compliance architecture where supported by published capabilities",
        ],
      },
      {
        heading: "How the DefenseEye Approach Is Different",
        items: [
          "Practitioner-led delivery: advisory work connects to architecture, implementation, testing, remediation, and operational support rather than stopping at recommendations",
          "Security and governance built into implementation: identity, access, data protection, evaluation, traceability, monitoring, and human oversight are part of the delivery approach",
          "Evidence and remediation workflows, not documentation alone: CMMC and NIST readiness support connects requirements to evidence, gaps, ownership, POA&M work, and remediation progress",
          "Consulting can be complemented by the DefenseEye-developed CMMCLens platform and AttackSense security capability when those offerings are appropriate to the engagement",
        ],
      },
      {
        heading: "Credentials and Company Information",
        body: "Published, verifiable facts for procurement and diligence review. Professional credentials are held by individual team members, not represented as company certifications.",
        items: [
          "Redmond, Washington",
          "Multiple team members hold CMMC Certified Professional (CCP) credentials",
          "OMWBE Minority Business Enterprise certified",
          "NMSDC Minority Business Enterprise certified",
          "Washington State Small Business Enterprise (SBE)",
          "CAGE 9ZDL5 and UEI E4DYPCKN7YN8",
          "CMMCLens is available on Microsoft Marketplace",
        ],
      },
      {
        heading: "Leadership and Accountability",
        body: "DefenseEye is led by founder Mahesh Coimbatore. The company's work brings together cybersecurity, secure AI adoption, enterprise delivery, risk, governance, and compliance automation.",
      },
      {
        heading: "Representative Experience",
        body: "The linked examples describe representative experience and capabilities DefenseEye is positioned to support. They are not presented as named customer case studies.",
      },
      {
        heading: "Choose the Right Starting Point",
        items: [
          "Explore CMMCLens: for defense contractors organizing CMMC and NIST SP 800-171 evidence, control mappings, gaps, SSP and POA&M workflows",
          "Discuss CMMC Readiness: for organizations assessing current readiness, evidence, remediation priorities, and the appropriate consulting or automation path",
          "Request a Secure AI Readiness Consultation: for regulated organizations evaluating secure AI or agentic AI use cases, architecture, governance, evaluation, and implementation",
          "Discuss Supplier Opportunities: for prime contractors, delivery partners, procurement teams, and organizations evaluating DefenseEye as a supplier or subcontractor",
        ],
      },
    ],
    links: [
      { label: "Explore CMMCLens", href: "/cmmclens" },
      { label: "Discuss CMMC Readiness", href: "/contact?inquiry=cmmc" },
      { label: "Request a Secure AI Readiness Consultation", href: "/secure-ai-adoption#secure-ai-consultation" },
      { label: "Discuss Supplier Opportunities", href: "/supplier-readiness" },
      { label: "View Representative Engagements", href: "/representative-engagements" },
      { label: "Open the capability statement", href: "/capability-statement" },
      { label: "Start a Conversation", href: "/contact" },
    ],
    schemaKind: "about",
    topics: ["Why DefenseEye", "Company overview", "Secure AI", "Cybersecurity", "CMMC readiness", "Compliance automation"],
    lastmod: whyDefenseEyeUpdateDate,
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy | DefenseEye",
    description:
      "DefenseEye Privacy Policy for DefenseEye.ai, CMMCLens, customer data, privacy requests, and service communications.",
    h1: "Privacy Policy",
    eyebrow: "Legal",
    summary:
      "DefenseEye's Privacy Policy explains what information DefenseEye collects, how it is used, and how it is protected across DefenseEye.ai and CMMCLens.",
    sections: [
      {
        heading: "Effective and Last Updated",
        body: "Effective April 1, 2026. Last updated August 29, 2026.",
      },
    ],
    links: [
      { label: "Contact DefenseEye", href: "/contact" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Support", href: "/support" },
    ],
    schemaKind: "page",
    topics: ["Privacy policy", "Data protection", "DefenseEye legal"],
    lastmod: "2026-08-29",
    changefreq: "monthly",
    priority: "0.4",
  },
  {
    path: "/support",
    title: "Support | DefenseEye",
    description:
      "Get CMMCLens product support, marketplace support, billing support, customer issue reporting, and advisory service follow-up from DefenseEye.",
    h1: "How Can We Help?",
    eyebrow: "Help & Support",
    summary:
      "Support for CMMCLens subscribers and DefenseEye advisory clients, plus self-serve resources for CMMC, AI governance, and compliance automation questions.",
    sections: [
      {
        heading: "Contact Support",
        items: [
          "Email Support — support@defenseeye.ai for platform issues, billing questions, and advisory service follow-up",
          "Urgent Issues — email urgent requests for time-sensitive contract deadlines or critical platform issues",
        ],
      },
      {
        heading: "Common Topics",
        items: [
          "CMMCLens Platform: account access, evidence collection setup, SSP/POA&M exports, control mapping, billing",
          "Advisory Services: readiness sprint status, gap assessment deliverables, C3PAO prep next steps, scoping",
          "CMMC Questions: Level 1 vs Level 2, what counts as CUI, SPRS score improvement, C3PAO process, timelines",
        ],
      },
      {
        heading: "Self-Serve CMMC Resources",
        body: "The DefenseEye Knowledge Hub covers the most common CMMC questions in depth.",
      },
    ],
    links: [
      { label: "Browse the CMMC FAQ", href: "/faq" },
      { label: "Use the CMMC Knowledge Hub", href: "/knowledge-hub" },
      { label: "Read what CMMC 2.0 means for contractors", href: "/knowledge-hub/what-is-cmmc" },
      { label: "Contact DefenseEye", href: "/contact" },
    ],
    schemaKind: "page",
    topics: ["DefenseEye support", "CMMCLens support", "Customer support"],
    lastmod: "2026-09-06",
    changefreq: "monthly",
    priority: "0.5",
  },
  {
    path: "/faq",
    title: "CMMC FAQ — Common Questions Answered | DefenseEye",
    description:
      "Answers to the most common CMMC 2.0 questions from defense contractors: Level 1 vs Level 2, CUI, SPRS scores, C3PAO assessments, timelines, and costs.",
    h1: "CMMC Frequently Asked Questions",
    eyebrow: "CMMC Answers Without the Runaround",
    summary:
      "Plain-language answers to the questions defense contractors ask most — about compliance timelines, costs, Level 2 assessments, and how to protect DoD contract eligibility.",
    sections: [
      {
        heading: "Topics Covered",
        items: [
          "CMMC Level 1 vs Level 2",
          "What counts as CUI",
          "SPRS score improvement",
          "C3PAO assessment process",
          "Timelines and cost estimates",
        ],
      },
    ],
    links: [
      { label: "Use the CMMC Knowledge Hub", href: "/knowledge-hub" },
      { label: "Contact Support", href: "/support" },
      { label: "Review the CMMC pillar page", href: "/cmmc" },
    ],
    schemaKind: "page",
    topics: ["CMMC FAQ", "CMMC Level 2", "SPRS", "C3PAO"],
    lastmod: "2026-09-06",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/capability-statement",
    title: "DefenseEye Capability Statement | AI, Cybersecurity, CMMC, and Compliance Automation",
    description:
      "DefenseEye provides AI governance, cybersecurity, CMMC advisory, Microsoft cloud security, compliance automation, and CMMCLens platform capability for enterprise, government, and regulated environments.",
    h1: "DefenseEye Capability Statement",
    eyebrow: "Capability Statement",
    summary:
      "AI, cybersecurity, Microsoft cloud, CMMC, and compliance automation capability for enterprise, government, defense contractor, and regulated environments.",
    sections: [
      {
        heading: "Differentiators",
        items: [
          "Minority-owned AI, cybersecurity, and compliance automation supplier",
          "Practitioner-led Microsoft cloud, AI governance, federal cybersecurity, and compliance experience",
          "Proprietary CMMCLens platform for compliance evidence automation",
          "Ability to support advisory, implementation, subcontracting, and staff augmentation engagements",
          "Focus on regulated, defense contractor, and Microsoft-centered environments",
        ],
      },
    ],
    links: [
      { label: "Request the PDF capability statement", href: "/contact?inquiry=supplier" },
      { label: "Review supplier readiness", href: "/supplier-readiness" },
      { label: "Why DefenseEye", href: "/why-defenseeye" },
    ],
    schemaKind: "page",
    topics: ["Capability statement", "Supplier readiness", "AI governance", "CMMC"],
    lastmod: "2026-06-26",
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    path: "/services/cmmc-scoping",
    title: "CMMC Scoping | Define Your CUI Boundary | DefenseEye",
    description:
      "Professional CMMC scoping for defense contractors. Define your CUI environment boundary, reduce assessment scope, and build assessment-preparation scoping documentation before your gap assessment.",
    h1: "Know Exactly What You're Defending Before Assessors Arrive",
    eyebrow: "Start Here — Before the Gap Assessment",
    summary:
      "CMMC scoping defines your CUI environment boundary — which systems, people, and networks actually need to meet CMMC Level 2 controls. Skip this step and you'll document, remediate, and pay for controls you don't need.",
    sections: [
      {
        heading: "Scoping Areas We Review",
        items: [
          "People & Roles",
          "Networks & Boundaries",
          "Systems & Endpoints",
          "CUI Flows & Data Paths",
          "Third-Party & External Access",
          "Physical Locations",
        ],
      },
      {
        heading: "Why Scoping First",
        items: ["Smaller Scope = Lower Cost", "Better SPRS Score", "Fewer Failed Controls"],
      },
    ],
    links: [
      { label: "Discuss CMMC Readiness", href: "/contact?inquiry=cmmc" },
      { label: "View CMMC Readiness Sprint", href: "/services/cmmc-readiness-sprint" },
      { label: "Review the CMMC pillar page", href: "/cmmc" },
    ],
    schemaKind: "service",
    serviceType: "CMMC scoping and CUI boundary definition consulting",
    topics: ["CMMC scoping", "CUI boundary", "CMMC Level 2 readiness"],
    lastmod: "2026-09-06",
    changefreq: "monthly",
    priority: "0.7",
  },
];

// Titles and descriptions always come from the shared metadata registry so the
// server-injected <title>, the schema, and the hydrated client title match.
function withRouteMetadata(route: SeoRoute): SeoRoute {
  const metadata = getRouteMetadata(route.path);
  const solutionFaqs = SOLUTION_PAGE_CONTENT[route.path]?.faqs;
  return {
    ...route,
    ...(metadata ? { title: metadata.title, description: metadata.description } : {}),
    ...(route.faqs === undefined && solutionFaqs ? { faqs: solutionFaqs } : {}),
  };
}

export const TIER_1_ROUTES: SeoRoute[] = TIER_1_ROUTE_DEFINITIONS.map(withRouteMetadata);

export const TIER_1_PATHS = TIER_1_ROUTES.map((route) => route.path);

// Routes whose full text lives in shared/ content modules (or is short enough to
// restate here), so the server can render real, page-specific content for crawlers
// and AI agents that do not execute JavaScript. Section headings mirror the visible
// React page; nothing here says anything the page itself does not say.
const BLOG_ROUTES: SeoRoute[] = blogPosts.map((post) => ({
  path: `/blog/${post.slug}`,
  title: `${post.title} | DefenseEye`,
  description: post.metaDescription,
  h1: post.title,
  eyebrow: post.category,
  summary: post.excerpt,
  sections: [],
  links: [],
  schemaKind: "article" as const,
  article: { author: post.author, datePublished: post.publishedAt, dateModified: post.updatedAt },
  topics: post.tags.length > 0 ? post.tags : ["CMMC", "Defense contractor readiness"],
  lastmod: post.updatedAt,
  changefreq: "monthly" as const,
  priority: "0.8",
  bodyHtml: renderBlogContent(post.content),
}));

const KNOWLEDGE_HUB_ARTICLE_ROUTES: SeoRoute[] = KNOWLEDGE_HUB_LINKS.slice(0, 5).map((link) => ({
  path: link.href,
  title: link.label + " | DefenseEye Knowledge Hub",
  description: "DefenseEye Knowledge Hub resource: " + link.label + ".",
  h1: link.label,
  eyebrow: "CMMC Knowledge Hub",
  summary: "Explore DefenseEye's CMMC Knowledge Hub guidance on " + link.label + ".",
  sections: [],
  links: [],
  schemaKind: "article" as const,
  article: { author: "DefenseEye Advisory Team" },
  topics: ["CMMC", "NIST SP 800-171"],
  lastmod: "2026-04-04",
  changefreq: "monthly" as const,
  priority: "0.8",
  faqsInBody: true,
  ...getKnowledgeHubContentOverride(link.href),
}));

const INSIGHT_ROUTES: SeoRoute[] = INSIGHTS.map((insight) => ({
  path: `/insights/${insight.slug}`,
  title: `${insight.title} | DefenseEye`,
  description: insight.description,
  h1: insight.title,
  eyebrow: "Insight",
  summary: insight.answer,
  sections: insight.sections.map((section) => ({ heading: section.heading, items: section.points })),
  links: [],
  faqs: insight.faqs,
  schemaKind: "article" as const,
  // Insight pages show no publication or update date, so their schema carries none.
  article: { author: "DefenseEye" },
  topics: insight.related,
  lastmod: "2026-06-25",
  changefreq: "monthly" as const,
  priority: "0.8",
}));

const SOLUTION_ROUTES: SeoRoute[] = Object.entries(SOLUTION_PAGE_CONTENT)
  .filter(([routePath]) => !TIER_1_PATHS.includes(routePath) && getRouteMetadata(routePath) !== null)
  .map(([routePath, page]) => ({
    path: routePath,
    title: page.seoTitle,
    description: page.seoDescription,
    h1: page.title,
    eyebrow: page.eyebrow,
    summary: page.description,
    sections: [
      { heading: "Executive Summary", body: page.summary },
      { heading: "Business Challenge", body: page.challenge, items: page.howHelps },
      { heading: "Key Outcomes", items: page.outcomes },
      { heading: "Representative Engagements", items: page.engagements },
      { heading: "Relevant Frameworks / Technologies", items: page.frameworks },
      { heading: "Deliverables", items: page.deliverables },
      { heading: "Why It Matters", body: page.why },
    ],
    links: [
      { label: page.cta.label, href: page.cta.href },
      ...(page.relatedLinks ?? []).map(({ label, href }) => ({ label, href })),
    ],
    faqs: page.faqs,
    schemaKind: "service" as const,
    serviceType: page.eyebrow,
    topics: page.frameworks,
    lastmod: "2026-06-25",
    changefreq: "monthly" as const,
    priority: "0.8",
  }));

const LANDING_PAGE_ROUTES: SeoRoute[] = Object.entries(LANDING_PAGE_CONTENT).map(([routePath, page]) => ({
  path: routePath,
  title: `${page.title} | DefenseEye`,
  description: page.desc,
  h1: page.title,
  eyebrow: "DefenseEye",
  summary: page.desc,
  sections: [
    { heading: "Common Pain Points", items: page.pains },
    { heading: "How DefenseEye Helps", items: page.helps },
    { heading: "Outcomes", items: page.outcomes },
    { heading: "Representative Engagement", body: page.engagement },
  ],
  links: [],
  schemaKind: "service" as const,
  serviceType: page.title,
  topics: page.helps,
  lastmod: "2026-06-26",
  changefreq: "monthly" as const,
  priority: "0.7",
}));

const DATASHEET_ROUTES: SeoRoute[] = Object.values(DATASHEET_CONTENT).map((sheet) => ({
  path: `/datasheets/${sheet.slug}`,
  title: `${sheet.title} | DefenseEye`,
  description: sheet.value,
  h1: sheet.title,
  eyebrow: "DefenseEye Datasheet",
  summary: sheet.value,
  sections: [
    { heading: "Who It Is For", items: sheet.who },
    { heading: "Problems Addressed", items: sheet.problems },
    { heading: "How DefenseEye Helps", items: sheet.helps },
    { heading: "Key Deliverables", items: sheet.deliverables },
    { heading: "Business Outcomes", items: sheet.outcomes },
    ...(sheet.credentials.length > 0 ? [{ heading: "Relevant Credentials", items: sheet.credentials }] : []),
    ...(sheet.engagement.length > 0 ? [{ heading: "Engagement Options", items: sheet.engagement }] : []),
  ],
  links: [],
  schemaKind: "page" as const,
  topics: sheet.helps,
  lastmod: "2026-06-26",
  changefreq: "monthly" as const,
  priority: "0.8",
}));

// Pages whose content is authored directly in JSX. The server fallback carries the
// page's real H1 and lead paragraph plus its place in the site architecture; it does
// not invent section copy. Titles and descriptions come from routeMetadata.ts.
const SUMMARY_ROUTE_DEFINITIONS: ReadonlyArray<readonly [path: string, h1: string, eyebrow: string, lead: string | null]> = [
  ["/services/cmmc-readiness-sprint", "Get CMMC Ready in 2-4 Weeks", "CMMC Readiness Sprint", null],
  ["/cmmc-readiness-sprint-guide", "The 4-Week CMMC Readiness Sprint", "CMMC Readiness Guide", null],
  ["/pricing", "Flexible, Transparent Pricing for Urgent CMMC Readiness", "CMMC Readiness Pricing", null],
  ["/attacksense/docs", "DefenseEye AttackSense Guide", "AttackSense", "Published guidance for getting started with AttackSense, aligning the workflow to your security operations process, and moving from raw findings to prioritized remediation."],
  ["/microsoft-ecosystem", "Microsoft Ecosystem Experience", "Microsoft Ecosystem", "DefenseEye is positioned for organizations operating in Microsoft-centered environments, including Azure, Microsoft 365, Microsoft Security, Copilot, Azure Government, and GCC High patterns."],
  ["/delivery-model", "DefenseEye Delivery Model", "Delivery Model", "DefenseEye supports structured advisory, implementation, staff augmentation, subcontracting, and platform-enabled consulting engagements for enterprise, government, defense contractor, and regulated environments."],
  ["/representative-engagements", "Representative Engagements", "Representative Engagements", "The examples below describe engagement types DefenseEye is positioned to support. They are not presented as completed customer case studies."],
  ["/datasheets", "DefenseEye Datasheets", "Datasheets", "Concise one-page overviews for enterprise buyers, procurement teams, partners, and regulated organizations evaluating DefenseEye."],
  ["/contact", "Contact DefenseEye", "Contact", null],
  ["/terms", "Terms of Service", "Legal", null],
];

const SUMMARY_ROUTES: SeoRoute[] = SUMMARY_ROUTE_DEFINITIONS.map(([routePath, h1, eyebrow, lead]) => ({
  path: routePath,
  title: routePath,
  description: routePath,
  h1,
  eyebrow,
  summary: lead ?? getRouteMetadata(routePath)?.description ?? "",
  sections: [],
  links: [],
  schemaKind: "page" as const,
  topics: [ROUTE_NAMES[routePath] ?? h1],
  lastmod: "2026-10-23",
  changefreq: "monthly" as const,
  priority: "0.7",
}));

const INDEXED_RESOURCE_ROUTE_DEFINITIONS: SeoRoute[] = [
  ...BLOG_ROUTES,
  ...KNOWLEDGE_HUB_ARTICLE_ROUTES,
  ...INSIGHT_ROUTES,
  ...SOLUTION_ROUTES,
  ...LANDING_PAGE_ROUTES,
  ...DATASHEET_ROUTES,
  ...SUMMARY_ROUTES,
];

const INDEXED_RESOURCE_ROUTES: SeoRoute[] = INDEXED_RESOURCE_ROUTE_DEFINITIONS.map(withRouteMetadata);

export function getSeoRoute(routePath: string) {
  const path = normalizePath(routePath);
  return TIER_1_ROUTES.find((route) => route.path === path) ?? INDEXED_RESOURCE_ROUTES.find((route) => route.path === path) ?? null;
}

export function normalizePath(routePath: string) {
  if (!routePath || routePath === "/") return "/";
  return routePath.replace(/\/+$/, "");
}

export function canonicalUrl(path: string) {
  return `${SITE_ORIGIN}${path === "/" ? "/" : path}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value);
}

function renderList(items: string[] = []) {
  if (items.length === 0) return "";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderBlogContent(blocks: Array<{ type: string; content: unknown }>) {
  return blocks.map((block) => {
    if (block.type === "h2" || block.type === "h3" || block.type === "p") {
      return "<" + block.type + ">" + escapeHtml(block.content as string) + "</" + block.type + ">";
    }
    if (block.type === "ul") return renderList(block.content as string[]);
    if (block.type === "table") {
      const table = block.content as { headers: string[]; rows: string[][] };
      return "<table><thead><tr>" + table.headers.map((cell) => "<th>" + escapeHtml(cell) + "</th>").join("") + "</tr></thead><tbody>" + table.rows.map((row) => "<tr>" + row.map((cell) => "<td>" + escapeHtml(cell) + "</td>").join("") + "</tr>").join("") + "</tbody></table>";
    }
    return "";
  }).join("");
}

function renderWhatIsCmmcTable(table: { headers: readonly string[]; rows: readonly (readonly string[])[] }) {
  return "<table><thead><tr>" +
    table.headers.map((cell) => "<th>" + escapeHtml(cell) + "</th>").join("") +
    "</tr></thead><tbody>" +
    table.rows.map((row) => "<tr>" + row.map((cell) => "<td>" + escapeHtml(cell) + "</td>").join("") + "</tr>").join("") +
    "</tbody></table>";
}

function renderWhatIsCmmcContent() {
  const article = WHAT_IS_CMMC_CONTENT;
  const section = (id: string, heading: string, body: string) =>
    '<section id="' + escapeAttribute(id) + '"><h2>' + escapeHtml(heading) + "</h2>" + body + "</section>";
  const paragraphs = (items: readonly string[]) => items.map((item) => "<p>" + escapeHtml(item) + "</p>").join("");
  const cards = (items: readonly { title: string; description: string }[]) =>
    "<dl>" + items.map((item) => "<dt>" + escapeHtml(item.title) + "</dt><dd>" + escapeHtml(item.description) + "</dd>").join("") + "</dl>";
  const emphasized = (text: string, emphasis: readonly string[]) => {
    let output = escapeHtml(text);
    for (const value of emphasis) output = output.replace(escapeHtml(value), "<strong>" + escapeHtml(value) + "</strong>");
    return output;
  };

  return [
    '<section aria-labelledby="quick-answer"><h2 id="quick-answer">Quick Answer</h2><p>' + emphasized(article.quickAnswer, article.quickAnswerEmphasis) + "</p></section>",
    section(article.definition.id, article.definition.heading, article.definition.paragraphs.map((item, index) => "<p>" + emphasized(item, article.definition.paragraphEmphasis[index] ?? []) + "</p>").join("") + cards(article.definition.cards)),
    section(article.history.id, article.history.heading,
      "<p>" + escapeHtml(article.history.introduction) + "</p><ol>" +
      article.history.items.map((item) => "<li><strong>" + escapeHtml(item.year + " — " + item.event) + "</strong><p>" + escapeHtml(item.description) + "</p></li>").join("") + "</ol>"),
    section(article.whoNeedsIt.id, article.whoNeedsIt.heading,
      "<p>" + escapeHtml(article.whoNeedsIt.introduction) + "</p>" + renderList([...article.whoNeedsIt.items]) +
      "<p><strong>Important:</strong> " + escapeHtml(article.whoNeedsIt.note) + "</p>"),
    section(article.levels.id, article.levels.heading,
      "<p>" + escapeHtml(article.levels.introduction) + "</p>" + renderWhatIsCmmcTable(article.levels.table) + "<p>" + escapeHtml(article.levels.note) + "</p>"),
    section(article.comparison.id, article.comparison.heading,
      "<p>" + escapeHtml(article.comparison.introduction) + "</p>" + renderWhatIsCmmcTable(article.comparison.table)),
    section(article.terms.id, article.terms.heading,
      "<p>" + escapeHtml(article.terms.introduction) + "</p>" + cards(article.terms.items)),
    section(article.automation.id, article.automation.heading,
      article.automation.paragraphs.map((item, index) => "<p>" + emphasized(item, article.automation.paragraphEmphasis[index] ?? []) + "</p>").join("") + "<h3>" + escapeHtml(article.automation.title) + "</h3><p>" +
      escapeHtml(article.automation.subtitle) + "</p>" + renderList([...article.automation.capabilities]) +
      "<p>Learn more: " + article.automation.links.map((link) => '<a href="' + escapeAttribute(link.href) + '">' + escapeHtml(link.label) + "</a>").join(" · ") + "</p>"),
    section(article.faq.id, article.faq.heading,
      "<dl>" + article.faq.items.map((item) => "<dt>" + escapeHtml(item.question) + "</dt><dd>" + escapeHtml(item.answer) + "</dd>").join("") + "</dl>"),
  ].join("");
}

function renderCertificationProcessContent() {
  const article = CERTIFICATION_PROCESS_CONTENT;
  const list = (items: readonly string[]) => renderList([...items]);
  const stepHtml = article.steps.map((step) =>
    '<section id="' + escapeAttribute(step.id) + '"><h2>' + escapeHtml(step.title) + "</h2><p>" +
    escapeHtml(step.description) + "</p>" + list(step.details) +
    "<dl><dt>Timing</dt><dd>" + escapeHtml(step.timeManual) +
    "</dd><dt>How CMMCLens can help</dt><dd>" + escapeHtml(step.timeWithLens) +
    "</dd></dl><p><strong>Note:</strong> " + escapeHtml(step.note) + "</p></section>"
  ).join("");
  const table = "<table><thead><tr>" + article.timeline.headers.map((cell) => "<th>" + escapeHtml(cell) + "</th>").join("") +
    "</tr></thead><tbody>" + article.timeline.rows.map((row) => "<tr>" + row.map((cell) => "<td>" + escapeHtml(cell) + "</td>").join("") + "</tr>").join("") + "</tbody></table>";

  return [
    '<section aria-labelledby="certification-quick-answer"><h2 id="certification-quick-answer">Quick Answer</h2><p>' + escapeHtml(article.quickAnswer) + "</p></section>",
    '<section id="' + article.overview.id + '"><h2>' + escapeHtml(article.overview.heading) + "</h2>" + article.overview.paragraphs.map((item) => "<p>" + escapeHtml(item) + "</p>").join("") + "</section>",
    stepHtml,
    '<section id="' + article.postCertification.id + '"><h2>' + escapeHtml(article.postCertification.heading) + "</h2><p>" + escapeHtml(article.postCertification.paragraph) + "</p>" + list(article.postCertification.items) + "</section>",
    '<section id="' + article.timeline.id + '"><h2>' + escapeHtml(article.timeline.heading) + "</h2>" + table + "<p>" + escapeHtml(article.timeline.note) + "</p></section>",
    '<section id="' + article.automation.id + '"><h2>' + escapeHtml(article.automation.heading) + "</h2><p>" + escapeHtml(article.automation.paragraph) + "</p><dl>" + article.automation.items.map((item) => "<dt>" + escapeHtml(item.step) + "</dt><dd>" + escapeHtml(item.impact) + "</dd>").join("") + "</dl><p>" + escapeHtml(article.automation.cta) + "</p></section>",
    '<section id="' + article.faq.id + '"><h2>' + escapeHtml(article.faq.heading) + "</h2><dl>" + article.faq.items.map((item) => "<dt>" + escapeHtml(item.question) + "</dt><dd>" + escapeHtml(item.answer) + "</dd>").join("") + "</dl></section>",
    '<nav aria-label="Continue reading">' + article.related.map((item) => '<a href="' + escapeAttribute(item.href) + '">' + escapeHtml(item.title) + "</a>").join(" · ") + "</nav>",
  ].join("");
}

function renderCmmcLevelsContent() {
  const article = CMMC_LEVELS_CONTENT;
  const paragraphs = (items: readonly string[]) =>
    items.map((item) => "<p>" + escapeHtml(item) + "</p>").join("");
  const section = (id: string, heading: string, body: string) =>
    '<section id="' + escapeAttribute(id) + '"><h2>' + escapeHtml(heading) + "</h2>" + body + "</section>";

  return [
    '<section aria-labelledby="cmmc-levels-quick-answer"><h2 id="cmmc-levels-quick-answer">Quick Answer</h2><p>' +
      article.quickAnswer.map((part) => part.strong === true ? "<strong>" + escapeHtml(part.text) + "</strong>" : escapeHtml(part.text)).join("") + "</p></section>",
    section(article.level1.id, article.level1.heading,
      paragraphs(article.level1.paragraphs) + "<h3>" + escapeHtml(article.level1.listHeading) + "</h3>" +
      renderList([...article.level1.practices]) + "<p><strong>Note:</strong> " + escapeHtml(article.level1.note) + "</p>"),
    section(article.level2.id, article.level2.heading,
      paragraphs(article.level2.paragraphs) + "<dl>" + article.level2.stats.map((stat) =>
        "<dt>" + escapeHtml(stat.label) + "</dt><dd>" + escapeHtml(stat.value) + "</dd>").join("") + "</dl>"),
    section(article.comparison.id, article.comparison.heading,
      "<p>" + escapeHtml(article.comparison.introduction) + "</p>" + renderWhatIsCmmcTable(article.comparison)),
    section(article.determine.id, article.determine.heading,
      "<p>" + escapeHtml(article.determine.introduction) + "</p><ol>" + article.determine.items.map((item) =>
        "<li><strong>" + escapeHtml(item.step + ". " + item.title) + "</strong><p>" + escapeHtml(item.description) + "</p></li>").join("") + "</ol>"),
    section(article.domains.id, article.domains.heading,
      "<p>" + escapeHtml(article.domains.introduction) + "</p>" + renderWhatIsCmmcTable(article.domains)),
    section(article.sprs.id, article.sprs.heading,
      paragraphs(article.sprs.paragraphs) + '<p><a href="' + escapeAttribute(article.sprs.link.href) + '">' + escapeHtml(article.sprs.link.label) + "</a></p>"),
    section(article.automation.id, article.automation.heading,
      "<p>" + escapeHtml(article.automation.paragraph) + "</p>" + article.automation.groups.map((group) =>
        "<h3>" + escapeHtml(group.title) + "</h3>" + renderList([...group.features])).join("")),
    section(article.faq.id, article.faq.heading,
      "<dl>" + article.faq.items.map((item) =>
        "<dt>" + escapeHtml(item.question) + "</dt><dd>" + escapeHtml(item.answer) + "</dd>").join("") + "</dl>"),
    '<nav aria-label="Continue reading">' + article.related.map((item) =>
      '<a href="' + escapeAttribute(item.href) + '">' + escapeHtml(item.title) + "</a>").join(" · ") + "</nav>",
  ].join("");
}

function renderEvidenceMappingContent() {
  const article = EVIDENCE_MAPPING_CONTENT;
  const paragraphs = (items: readonly string[]) => items.map((item) => "<p>" + escapeHtml(item) + "</p>").join("");
  const section = (id: string, heading: string, body: string) =>
    '<section id="' + escapeAttribute(id) + '"><h2>' + escapeHtml(heading) + "</h2>" + body + "</section>";

  return [
    '<section aria-labelledby="evidence-mapping-quick-answer"><h2 id="evidence-mapping-quick-answer">Quick Answer</h2><p>' +
      article.quickAnswer.map((part) => part.strong ? "<strong>" + escapeHtml(part.text) + "</strong>" : escapeHtml(part.text)).join("") + "</p></section>",
    section(article.definition.id, article.definition.heading,
      paragraphs(article.definition.paragraphs) + "<dl>" + article.definition.stats.map((stat) =>
        "<dt>" + escapeHtml(stat.label) + "</dt><dd>" + escapeHtml(stat.value) + "</dd>").join("") + "</dl>"),
    section(article.controlFamilies.id, article.controlFamilies.heading,
      "<p>" + escapeHtml(article.controlFamilies.introduction) + "</p>" + renderWhatIsCmmcTable(article.controlFamilies)),
    section(article.comparison.id, article.comparison.heading,
      "<p>" + escapeHtml(article.comparison.introduction) + "</p>" + renderWhatIsCmmcTable(article.comparison)),
    section(article.collection.id, article.collection.heading,
      "<p>" + escapeHtml(article.collection.introduction) + "</p><ol>" + article.collection.steps.map((step) =>
        "<li><strong>" + escapeHtml(step.step + " — " + step.title) + "</strong><p>" + escapeHtml(step.description) + "</p></li>").join("") + "</ol>"),
    section(article.cloud.id, article.cloud.heading,
      "<p>" + escapeHtml(article.cloud.introduction) + "</p>" + article.cloud.platforms.map((platform) =>
        "<h3>" + escapeHtml(platform.platform) + "</h3>" + renderList([...platform.evidence])).join("")),
    section(article.documents.id, article.documents.heading,
      "<p>" + escapeHtml(article.documents.introduction) + "</p>" + article.documents.items.map((item) =>
        "<h3>" + escapeHtml(item.title) + "</h3>" + paragraphs(item.paragraphs)).join("")),
    section(article.automation.id, article.automation.heading,
      "<p>" + escapeHtml(article.automation.paragraph) + "</p><h3>" + escapeHtml(article.automation.cardTitle) +
      "</h3><p>" + escapeHtml(article.automation.cardSubtitle) + "</p>" + renderList([...article.automation.capabilities]) +
      "<p>Related: " + article.automation.links.map((link) => '<a href="' + escapeAttribute(link.href) + '">' + escapeHtml(link.label) + "</a>").join(" · ") + "</p>"),
    section(article.faq.id, article.faq.heading,
      "<dl>" + article.faq.items.map((item) => "<dt>" + escapeHtml(item.question) + "</dt><dd>" + escapeHtml(item.answer) + "</dd>").join("") + "</dl>"),
    '<nav aria-label="Continue reading">' + article.related.map((item) =>
      '<a href="' + escapeAttribute(item.href) + '">' + escapeHtml(item.title) + "</a>").join(" · ") + "</nav>",
  ].join("");
}

function renderSprsScoreContent() {
  const article = SPRS_SCORE_CONTENT;
  const section = (id: string, heading: string, body: string) =>
    '<section id="' + escapeAttribute(id) + '"><h2>' + escapeHtml(heading) + "</h2>" + body + "</section>";
  const table = (value: { headers: readonly string[]; rows: readonly (readonly string[])[] }) => renderWhatIsCmmcTable(value);
  const orderedCards = (items: readonly { step?: string; number?: string; title: string; description?: string; detail?: string }[]) =>
    "<ol>" + items.map((item) => "<li><strong>" + escapeHtml((item.step ?? item.number ?? "") + " — " + item.title) +
      "</strong><p>" + escapeHtml(item.description ?? item.detail ?? "") + "</p></li>").join("") + "</ol>";

  return [
    '<section aria-labelledby="sprs-quick-answer"><h2 id="sprs-quick-answer">Quick Answer</h2><p>' +
      article.quickAnswer.map((part) => part.strong ? "<strong>" + escapeHtml(part.text) + "</strong>" : escapeHtml(part.text)).join("") + "</p></section>",
    section(article.overview.id, article.overview.heading,
      article.overview.paragraphs.map((paragraph) => "<p>" + (paragraph.emphasis ? "<strong>" + escapeHtml(paragraph.emphasis) + "</strong>" : "") + escapeHtml(paragraph.text) + "</p>").join("") +
      "<dl>" + article.overview.stats.map((stat) => "<dt>" + escapeHtml(stat.label) + "</dt><dd>" + escapeHtml(stat.value) + "</dd>").join("") + "</dl>"),
    section(article.calculation.id, article.calculation.heading,
      "<p>" + escapeHtml(article.calculation.introduction) + "</p><h3>" + escapeHtml(article.calculation.formulaHeading) +
      "</h3><pre>" + article.calculation.formula.map(escapeHtml).join("\n") + "</pre><p>" + escapeHtml(article.calculation.explanation) +
      "</p><p>" + escapeHtml(article.calculation.assessmentIntroduction) + " " + article.calculation.assessmentStates.map((state, index) =>
        (index === 0 ? "" : index === article.calculation.assessmentStates.length - 1 ? ", or " : ", ") + "<strong>" + escapeHtml(state.label) + "</strong> (" + escapeHtml(state.description) + ")").join("") + ".</p>"),
    section(article.scoreRanges.id, article.scoreRanges.heading, table(article.scoreRanges)),
    section(article.domainImpact.id, article.domainImpact.heading,
      "<p>" + escapeHtml(article.domainImpact.introduction) + "</p>" + table(article.domainImpact)),
    section(article.submission.id, article.submission.heading,
      "<p>" + escapeHtml(article.submission.introduction) + "</p>" + orderedCards(article.submission.steps)),
    section(article.improvements.id, article.improvements.heading,
      "<p>" + escapeHtml(article.improvements.introduction) + "</p>" + orderedCards(article.improvements.items)),
    section(article.comparison.id, article.comparison.heading,
      "<p>" + escapeHtml(article.comparison.introduction) + "</p>" + table(article.comparison)),
    section(article.automation.id, article.automation.heading,
      "<p>" + escapeHtml(article.automation.paragraph) + "</p><h3>" + escapeHtml(article.automation.cardTitle) +
      "</h3><p>" + escapeHtml(article.automation.cardSubtitle) + "</p>" + renderList([...article.automation.capabilities])),
    section(article.faq.id, article.faq.heading,
      "<dl>" + article.faq.items.map((item) => "<dt>" + escapeHtml(item.question) + "</dt><dd>" + escapeHtml(item.answer) + "</dd>").join("") + "</dl>"),
    '<nav aria-label="Continue reading">' + article.related.map((item) =>
      '<a href="' + escapeAttribute(item.href) + '">' + escapeHtml(item.title) + "</a>").join(" · ") + "</nav>",
  ].join("");
}

// Converts the visible "Last updated" label (e.g. "September 2026") into an ISO 8601
// year-month, so Article schema states exactly what the page shows and no more.
export function monthYearToIsoMonth(label: string): string | undefined {
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const match = label.match(/^([A-Z][a-z]+) (\d{4})$/);
  const month = match ? MONTHS.indexOf(match[1]) + 1 : 0;
  return match && month > 0 ? `${match[2]}-${String(month).padStart(2, "0")}` : undefined;
}

function getKnowledgeHubContentOverride(path: string): Partial<SeoRoute> {
  if (path === "/knowledge-hub/what-is-cmmc") {
    return {
      title: WHAT_IS_CMMC_CONTENT.title + " | DefenseEye Knowledge Hub",
      description: WHAT_IS_CMMC_CONTENT.description,
      h1: WHAT_IS_CMMC_CONTENT.h1,
      summary: WHAT_IS_CMMC_CONTENT.description,
      sections: [],
      faqs: WHAT_IS_CMMC_CONTENT.faq.items.map(({ question, answer }) => ({ question, answer })),
      article: { author: "DefenseEye Advisory Team", dateModified: monthYearToIsoMonth(WHAT_IS_CMMC_CONTENT.lastUpdated) },
      bodyHtml: renderWhatIsCmmcContent(),
    };
  }
  if (path === "/knowledge-hub/certification-process") {
    return {
      title: CERTIFICATION_PROCESS_CONTENT.title + " | DefenseEye Knowledge Hub",
      description: CERTIFICATION_PROCESS_CONTENT.description,
      h1: CERTIFICATION_PROCESS_CONTENT.h1,
      summary: CERTIFICATION_PROCESS_CONTENT.description,
      sections: [],
      faqs: CERTIFICATION_PROCESS_CONTENT.faq.items.map(({ question, answer }) => ({ question, answer })),
      article: { author: "DefenseEye Advisory Team", dateModified: monthYearToIsoMonth(CERTIFICATION_PROCESS_CONTENT.lastUpdated) },
      bodyHtml: renderCertificationProcessContent(),
    };
  }
  if (path === "/knowledge-hub/cmmc-levels") {
    return {
      title: CMMC_LEVELS_CONTENT.title + " | DefenseEye Knowledge Hub",
      description: CMMC_LEVELS_CONTENT.description,
      h1: CMMC_LEVELS_CONTENT.h1,
      summary: CMMC_LEVELS_CONTENT.description,
      sections: [],
      faqs: CMMC_LEVELS_CONTENT.faq.items.map(({ question, answer }) => ({ question, answer })),
      article: { author: "DefenseEye Advisory Team", dateModified: monthYearToIsoMonth(CMMC_LEVELS_CONTENT.lastUpdated) },
      bodyHtml: renderCmmcLevelsContent(),
    };
  }
  if (path === "/knowledge-hub/evidence-mapping") {
    return {
      title: EVIDENCE_MAPPING_CONTENT.title + " | DefenseEye Knowledge Hub",
      description: EVIDENCE_MAPPING_CONTENT.description,
      h1: EVIDENCE_MAPPING_CONTENT.h1,
      summary: EVIDENCE_MAPPING_CONTENT.description,
      sections: [],
      faqs: EVIDENCE_MAPPING_CONTENT.faq.items.map(({ question, answer }) => ({ question, answer })),
      article: { author: "DefenseEye Advisory Team", dateModified: monthYearToIsoMonth(EVIDENCE_MAPPING_CONTENT.lastUpdated) },
      bodyHtml: renderEvidenceMappingContent(),
    };
  }
  if (path === "/knowledge-hub/sprs-score") {
    return {
      title: SPRS_SCORE_CONTENT.title + " | DefenseEye Knowledge Hub",
      description: SPRS_SCORE_CONTENT.description,
      h1: SPRS_SCORE_CONTENT.h1,
      summary: SPRS_SCORE_CONTENT.description,
      sections: [],
      faqs: SPRS_SCORE_CONTENT.faq.items.map(({ question, answer }) => ({ question, answer })),
      article: { author: "DefenseEye Advisory Team", dateModified: monthYearToIsoMonth(SPRS_SCORE_CONTENT.lastUpdated) },
      bodyHtml: renderSprsScoreContent(),
    };
  }
  return {};
}

function renderLinkList(links: SeoLink[] = []) {
  if (links.length === 0) return "";
  return `<ul>${links.map((link) => `<li><a href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a></li>`).join("")}</ul>`;
}

function renderNavigation(links: SeoLink[], className = "") {
  return `<nav class="${className}" aria-label="DefenseEye navigation"><ul>${links
    .map((link) => `<li><a href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a></li>`)
    .join("")}</ul></nav>`;
}

function renderIndexResources(route: SeoRoute) {
  if (route.path === "/blog") {
    return `<section><h2>Published CMMC articles</h2><p>Browse every published article without using search or filters.</p>${renderLinkList(BLOG_INDEX_LINKS)}</section>`;
  }
  if (route.path === "/knowledge-hub") {
    return `<section><h2>Knowledge Hub resources</h2><p>Explore CMMC readiness, evidence, and AI governance resources.</p>${renderLinkList(KNOWLEDGE_HUB_LINKS)}</section>`;
  }
  return "";
}

function renderBreadcrumbs(routePath: string) {
  if (routePath === "/") return "";
  const trail = getBreadcrumbTrail(routePath);
  return `<nav class="de-pr-breadcrumb" aria-label="Breadcrumb"><ol>${trail
    .map((item, index) =>
      index === trail.length - 1
        ? `<li aria-current="page">${escapeHtml(item.label)}</li>`
        : `<li><a href="${escapeAttribute(item.href)}">${escapeHtml(item.label)}</a></li>`
    )
    .join("")}</ol></nav>`;
}

function renderFaqs(faqs: SeoFaq[] = []) {
  if (faqs.length === 0) return "";
  return `<section><h2>Frequently asked questions</h2><dl>${faqs
    .map((faq) => `<dt>${escapeHtml(faq.question)}</dt><dd>${escapeHtml(faq.answer)}</dd>`)
    .join("")}</dl></section>`;
}

function renderDescribedLinkList(links: ArchitectureLink[]) {
  return `<ul>${links
    .map(
      (link) =>
        `<li><a href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a>${
          link.description ? ` — ${escapeHtml(link.description)}` : ""
        }</li>`
    )
    .join("")}</ul>`;
}

function renderFooterNavigation() {
  return `<nav class="de-pr-footer-nav" aria-label="Site directory">${FOOTER_NAVIGATION.map(
    (group) => `<h2>${escapeHtml(group.title)}</h2>${renderLinkList(group.links)}`
  ).join("")}</nav>`;
}

// Links a reader of this page is likely to want next: the route's own links, its
// hub's other pages (on hubs), and curated related pages. Each destination appears
// once, and links already present in the article body are not repeated.
function collectContextualLinks(route: SeoRoute) {
  const seen = new Set<string>([route.path]);
  for (const match of (route.bodyHtml ?? "").matchAll(/href="([^"]+)"/g)) seen.add(match[1]);
  const take = (links: ArchitectureLink[]) =>
    links.filter((link) => {
      if (seen.has(link.href)) return false;
      seen.add(link.href);
      return true;
    });
  const parentPath = getBreadcrumbTrail(route.path).at(-2)?.href;
  const parent = parentPath ? [{ href: parentPath, label: `Back to ${ROUTE_NAMES[parentPath] ?? "DefenseEye"}` }] : [];
  return {
    section: take(getSectionPages(route.path)),
    related: take([...route.links, ...getRelatedLinks(route.path), ...parent]),
  };
}

export function renderRouteFallbackHtml(route: SeoRoute) {
  const { section, related } = collectContextualLinks(route);
  return `
      <!-- Route-specific public content generated from the shared SEO route registry. React hydrates this route on load. -->
      <div class="de-pr" data-seo-route="${escapeAttribute(route.path)}">
        <header>
          <a class="brand" href="${SITE_ORIGIN}/">DefenseEye.ai</a>
          ${renderNavigation(PUBLIC_NAVIGATION_LINKS, "de-pr-nav")}
        </header>
        <main>
          ${renderBreadcrumbs(route.path)}
          ${route.eyebrow ? `<p class="eyebrow">${escapeHtml(route.eyebrow)}</p>` : ""}
          <h1>${escapeHtml(route.h1)}</h1>
          <p class="lead">${escapeHtml(route.summary)}</p>
          ${route.bodyHtml ? `<article>${route.bodyHtml}</article>` : ""}
          ${route.sections
            .map(
              (section) => `
          <section>
            <h2>${escapeHtml(section.heading)}</h2>
            ${section.body ? `<p>${escapeHtml(section.body)}</p>` : ""}
            ${renderList(section.items)}
          </section>`
            )
            .join("")}
          ${route.faqsInBody ? "" : renderFaqs(route.faqs)}
          ${renderIndexResources(route)}
          ${section.length > 0 ? `<section><h2>In this section</h2>${renderDescribedLinkList(section)}</section>` : ""}
          ${related.length > 0 ? `<section><h2>Related DefenseEye resources</h2>${renderDescribedLinkList(related)}</section>` : ""}
        </main>
        <footer>
          <p>DefenseEye helps regulated organizations adopt AI securely and stay audit-ready, combining AI governance, cybersecurity, Microsoft cloud security, CMMC readiness, and compliance automation.</p>
          ${renderFooterNavigation()}
        </footer>
      </div>`;
}

export const ORGANIZATION_LOGO_URL = `${SITE_ORIGIN}/defenseeye-logo.png`;
// Same 1200x630 card as og:image in client/index.html.
export const SHARE_IMAGE_URL = `${SITE_ORIGIN}/og-default.png`;

// One Organization entity, referenced by @id from every page. Only facts published
// on the site (name, URL, Redmond WA location, contact email, LinkedIn) are used.
const ORGANIZATION_ENTITY = {
  "@type": "Organization",
  "@id": `${SITE_ORIGIN}/#organization`,
  name: "DefenseEye",
  alternateName: "DefenseEye.ai",
  url: `${SITE_ORIGIN}/`,
  logo: { "@type": "ImageObject", url: ORGANIZATION_LOGO_URL },
};

export function buildRouteSchemas(route: SeoRoute) {
  const canonical = canonicalUrl(route.path);
  const organization = ORGANIZATION_ENTITY;

  const trail = route.path === "/" ? [{ href: "/", label: "Home" }] : getBreadcrumbTrail(route.path);
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      // Same labels as the visible breadcrumb (client/src/components/Breadcrumbs.tsx).
      name: item.label,
      item: canonicalUrl(item.href),
    })),
  };

  // FAQPage only when the questions and answers are visible on the page itself.
  const faqPage =
    route.faqs && route.faqs.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${canonical}#faq`,
            mainEntity: route.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
        ]
      : [];

  if (route.schemaKind === "home") {
    return [
      {
        "@context": "https://schema.org",
        ...organization,
        description:
          "DefenseEye is a practitioner-led secure agentic AI, cybersecurity, responsible AI governance, Microsoft cloud, CMMC readiness, and compliance automation supplier.",
        address: { "@type": "PostalAddress", addressLocality: "Redmond", addressRegion: "WA", addressCountry: "US" },
        email: "enterprise@defenseeye.ai",
        sameAs: ["https://www.linkedin.com/company/defenseeye"],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        name: "DefenseEye.ai",
        url: SITE_ORIGIN,
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${SITE_ORIGIN}/#professional-service`,
        name: "DefenseEye",
        url: SITE_ORIGIN,
        description: route.description,
        provider: { "@id": `${SITE_ORIGIN}/#organization` },
        areaServed: { "@type": "Country", name: "United States" },
        knowsAbout: route.topics,
      },
      ...faqPage,
    ];
  }

  const webPage = {
    "@context": "https://schema.org",
    "@type":
      route.schemaKind === "collection" ? "CollectionPage" : route.schemaKind === "about" ? "AboutPage" : "WebPage",
    "@id": `${canonical}#webpage`,
    name: route.h1,
    url: canonical,
    description: route.description,
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    breadcrumb: { "@id": `${canonical}#breadcrumb` },
    about: route.topics.map((name) => ({ "@type": "Thing", name })),
  };

  // The Organization and WebSite nodes are repeated (compactly) on every page so @id
  // references from publisher/provider/isPartOf resolve within the page's own data.
  const shared = [
    { "@context": "https://schema.org", ...organization },
    { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_ORIGIN}/#website`, name: "DefenseEye.ai", url: `${SITE_ORIGIN}/`, publisher: { "@id": `${SITE_ORIGIN}/#organization` } },
    { "@context": "https://schema.org", ...breadcrumb },
    ...faqPage,
  ];

  if (route.schemaKind === "software") {
    return [
      webPage,
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": `${canonical}#software`,
        name: route.path === "/cmmclens" ? "CMMCLens" : "AttackSense",
        url: canonical,
        description: route.description,
        brand: { "@type": "Brand", name: "DefenseEye" },
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
        applicationCategory: "SecurityApplication",
        applicationSubCategory:
          route.path === "/cmmclens" ? "Cybersecurity compliance automation" : "Cybersecurity operations",
        operatingSystem: "Web",
      },
      ...shared,
    ];
  }

  if (route.schemaKind === "service") {
    return [
      webPage,
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: route.h1,
        url: canonical,
        description: route.description,
        provider: { "@id": `${SITE_ORIGIN}/#organization` },
        serviceType: route.serviceType ?? route.h1,
        areaServed: { "@type": "Country", name: "United States" },
        about: route.topics.map((name) => ({ "@type": "Thing", name })),
      },
      ...shared,
    ];
  }

  if (route.schemaKind === "article" && route.article) {
    const isBlogPost = route.path.startsWith("/blog/");
    const author =
      route.article.author === "DefenseEye"
        ? { "@id": `${SITE_ORIGIN}/#organization` }
        : { "@type": "Organization", name: route.article.author, url: `${SITE_ORIGIN}/` };
    return [
      webPage,
      {
        "@context": "https://schema.org",
        "@type": isBlogPost ? "BlogPosting" : "Article",
        "@id": `${canonical}#article`,
        headline: route.h1.length > 110 ? route.h1.slice(0, 107) + "..." : route.h1,
        description: route.description,
        url: canonical,
        mainEntityOfPage: { "@id": `${canonical}#webpage` },
        image: SHARE_IMAGE_URL,
        author,
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
        ...(route.article.datePublished ? { datePublished: route.article.datePublished } : {}),
        ...(route.article.dateModified ? { dateModified: route.article.dateModified } : {}),
        about: route.topics.map((name) => ({ "@type": "Thing", name })),
        inLanguage: "en-US",
      },
      ...shared,
    ];
  }

  return [webPage, ...shared];
}

export function renderRouteSchemaScript(route: SeoRoute) {
  return `    <script id="${ROUTE_SCHEMA_SCRIPT_ID}" type="application/ld+json" data-server-route-schema="true" data-route-path="${route.path}">
${JSON.stringify(buildRouteSchemas(route), null, 2)}
    </script>`;
}

const additionalSitemapEntries: SitemapEntry[] = [
  { path: "/services/cmmc-readiness-sprint", lastmod: "2026-04-04", changefreq: "weekly", priority: "0.9" },
  { path: "/attacksense/docs", lastmod: "2026-07-16", changefreq: "monthly", priority: "0.8" },
  { path: "/datasheets", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/datasheets/secure-ai-adoption", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/datasheets/cmmc-compliance-automation", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/datasheets/cmmclens", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/datasheets/microsoft-copilot-readiness", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/datasheets/supplier-readiness", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/insights/what-is-cmmc-level-2", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/insights/what-is-rmf-readiness", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/insights/what-is-nist-ai-rmf", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/insights/ai-automated-evidence-collection", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/insights/implement-ai-governance", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/insights/security-copilot-cybersecurity-operations", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/insights/continuous-compliance-monitoring", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/insights/ai-audit-readiness", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/pricing", lastmod: "2026-04-04", changefreq: "weekly", priority: "0.9" },
  { path: "/cmmc-readiness-sprint-guide", lastmod: "2026-04-04", changefreq: "weekly", priority: "0.9" },
  { path: "/knowledge-hub/what-is-cmmc", lastmod: "2026-10-24", changefreq: "monthly", priority: "0.9" },
  { path: "/knowledge-hub/cmmc-levels", lastmod: "2026-10-24", changefreq: "monthly", priority: "0.9" },
  { path: "/knowledge-hub/evidence-mapping", lastmod: "2026-10-24", changefreq: "monthly", priority: "0.8" },
  { path: "/knowledge-hub/sprs-score", lastmod: "2026-10-24", changefreq: "monthly", priority: "0.9" },
  { path: "/knowledge-hub/certification-process", lastmod: "2026-10-24", changefreq: "monthly", priority: "0.9" },
  { path: "/blog/cmmc-level-2-compliance-checklist-2025", lastmod: "2026-10-23", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/how-to-improve-sprs-score-fast", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/what-to-expect-c3pao-assessment", lastmod: "2026-10-24", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/what-counts-as-cui-plain-english-guide", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/cmmc-level-2-small-business-guide", lastmod: "2026-10-24", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/gcc-high-vs-m365-commercial-cmmc", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/cmmc-poam-guide-what-assessors-want", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/cmmc-consultant-red-flags", lastmod: "2026-10-23", changefreq: "monthly", priority: "0.8" },
  { path: "/solutions/cybersecurity-risk", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.8" },
  { path: "/solutions/compliance-automation", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.8" },
  { path: "/solutions/cloud-security", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.8" },
  { path: "/solutions/cmmclens-platform", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.8" },
  { path: "/delivery-model", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/representative-engagements", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/microsoft-ecosystem", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/lp/ai-governance-consulting", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.7" },
  { path: "/lp/secure-ai-adoption", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.7" },
  { path: "/lp/microsoft-copilot-readiness", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.7" },
  { path: "/lp/cmmc-level-2-readiness", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.7" },
  { path: "/lp/cmmc-compliance-automation", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.7" },
  { path: "/lp/cmmc-evidence-automation", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.7" },
  { path: "/lp/cmmclens-demo", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.7" },
  { path: "/lp/microsoft-supplier-ai-consulting", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.7" },
  { path: "/lp/azure-cloud-security", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.7" },
  { path: "/lp/compliance-automation", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", lastmod: "2026-10-23", changefreq: "monthly", priority: "0.7" },
  // Matches the "Last updated" date shown on the Terms of Service page.
  { path: "/terms", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.3" },
];

// Routes marked noindex in shared/routeMetadata.ts are excluded: a sitemap should
// list only canonical, indexable URLs.
export const SITEMAP_ENTRIES: SitemapEntry[] = [
  ...TIER_1_ROUTES.map(({ path, lastmod, changefreq, priority }) => ({ path, lastmod, changefreq, priority })),
  ...additionalSitemapEntries,
].filter((entry) => !isNoindexRoute(entry.path)).sort((a, b) => canonicalUrl(a.path).localeCompare(canonicalUrl(b.path)));

export function renderSitemapXml(entries: SitemapEntry[] = SITEMAP_ENTRIES) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${canonicalUrl(entry.path)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}
