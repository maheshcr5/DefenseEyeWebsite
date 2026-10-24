// Plain-text content for /datasheets/:slug, shared by the React page
// (client/src/pages/Datasheets.tsx) and the server-rendered fallback HTML.

export type Sheet = {
  slug: string;
  title: string;
  value: string;
  who: string[];
  problems: string[];
  helps: string[];
  deliverables: string[];
  outcomes: string[];
  credentials: string[];
  engagement: string[];
  cta: string;
  contact: "enterprise" | "partners" | "support";
  /** Which booking link the primary CTA uses. */
  booking: "general" | "cmmclens";
};

export const DATASHEET_CONTENT: Record<string, Sheet> = {
  "secure-ai-adoption": {
    slug: "secure-ai-adoption",
    title: "Secure AI Adoption Datasheet",
    value: "DefenseEye helps regulated organizations adopt AI securely with governance, Microsoft Copilot readiness, AI security, accountability, and practical implementation roadmaps.",
    who: ["Microsoft Copilot adopters", "Azure OpenAI users", "Regulated enterprises", "Government contractors", "CIO, CISO, CTO, risk, privacy, and governance leaders"],
    problems: ["Shadow AI", "Unclear AI accountability", "Sensitive data exposure", "Model and vendor risk", "Weak oversight workflows"],
    helps: ["AI governance readiness", "Responsible AI policy", "NIST AI RMF alignment", "AI risk register", "Human oversight model"],
    deliverables: ["AI governance charter", "AI risk register", "AI policy", "Use case intake workflow", "Executive roadmap"],
    outcomes: ["Reduced AI adoption risk", "Less rework", "Faster governed adoption", "Improved data protection", "Clear accountability"],
    credentials: ["NIST AI RMF familiarity", "Microsoft cloud security experience", "CIPM"],
    engagement: ["AI governance readiness assessment", "Copilot readiness review", "AI operating model design", "Executive AI roadmap"],
    cta: "Discuss Secure AI Adoption",
    contact: "enterprise",
    booking: "general",
  },
  "cmmc-compliance-automation": {
    slug: "cmmc-compliance-automation",
    title: "CMMC & Compliance Automation Datasheet",
    value: "DefenseEye provides CCP-led CMMC Level 2 readiness, NIST SP 800-171 support, SSP/POA&M preparation, evidence automation, and CMMCLens-enabled readiness workflows.",
    who: ["Defense contractors", "Government contractors", "Prime contractors", "Subcontractors handling CUI", "MSPs/MSSPs", "Compliance and security teams"],
    problems: ["Manual evidence collection", "SSP ownership gaps", "POA&M tracking issues", "Weak control traceability", "SPRS uncertainty"],
    helps: ["CMMC Level 2 readiness", "NIST SP 800-171 gap analysis", "SSP and POA&M support", "Evidence automation", "Remediation workflow support"],
    deliverables: ["Readiness findings", "Gap analysis", "Evidence plan", "SSP/POA&M support", "CMMCLens onboarding plan"],
    outcomes: ["Reduced manual evidence burden", "Better readiness visibility", "Faster remediation prioritization", "Improved assessment preparation"],
    credentials: ["Multiple CMMC Certified Professionals", "CMMC Level 1 Certified", "NIST 800-171 Level 2 in progress"],
    engagement: ["2-4 week readiness sprint", "NIST 800-171 gap assessment", "Evidence automation implementation", "Prime supply-chain readiness support"],
    cta: "Assess CMMC Readiness",
    contact: "enterprise",
    booking: "general",
  },
  cmmclens: {
    slug: "cmmclens",
    title: "CMMCLens Product Sheet",
    value: "CMMCLens helps organizations structure CMMC and NIST SP 800-171 readiness through evidence automation, control mapping, gap tracking, SSP/POA&M workflows, and readiness dashboards.",
    who: ["Defense contractors", "Government contractors", "MSPs/MSSPs", "Compliance teams", "Prime contractors supporting supply-chain readiness"],
    problems: ["Manual evidence work", "Disconnected control mapping", "Gap tracking inconsistency", "Readiness reporting friction"],
    helps: ["Evidence automation", "Control mapping", "Gap identification", "Remediation workflow tracking", "SSP support", "POA&M support", "AI-assisted policy generation", "Readiness dashboards", "Executive reporting"],
    deliverables: ["CMMCLens onboarding", "Evidence workflow setup", "Control mapping", "Dashboard configuration", "Readiness reporting"],
    outcomes: ["Reduced manual evidence work", "Improved traceability", "Better readiness visibility", "More structured remediation", "Improved assessment preparation"],
    credentials: ["Multiple CMMC Certified Professionals", "CMMC Level 1 Certified", "NIST SP 800-171 readiness support"],
    engagement: ["Product demo", "Implementation planning", "Evidence workflow configuration", "Platform-enabled consulting"],
    cta: "Request CMMCLens Demo",
    contact: "support",
    booking: "cmmclens",
  },
  "microsoft-copilot-readiness": {
    slug: "microsoft-copilot-readiness",
    title: "Microsoft Copilot Readiness Datasheet",
    value: "DefenseEye helps organizations prepare Microsoft 365, identity, data governance, privacy, security, and adoption controls before scaling Microsoft Copilot.",
    who: ["Microsoft 365 leaders", "Security teams", "Privacy teams", "CIO and CISO organizations", "Regulated enterprises"],
    problems: ["Over-permissioned data", "Unclear data ownership", "Copilot adoption friction", "Privacy risk", "Missing rollout guardrails"],
    helps: ["Microsoft 365 readiness review", "Entra and identity review", "Purview alignment", "Defender and security control review", "Adoption governance"],
    deliverables: ["Copilot readiness findings", "Risk-ranked remediation plan", "Data governance recommendations", "Adoption control roadmap"],
    outcomes: ["Lower data exposure risk", "Improved governance", "Clearer rollout priorities", "Better user readiness"],
    credentials: ["Microsoft cloud security experience", "Azure Fundamentals", "Privacy and compliance experience", "CIPM"],
    engagement: ["Copilot readiness assessment", "Data exposure review", "Governance roadmap", "Implementation support"],
    cta: "Assess Copilot Readiness",
    contact: "enterprise",
    booking: "general",
  },
  "supplier-readiness": {
    slug: "supplier-readiness",
    title: "DefenseEye Supplier Readiness Datasheet",
    value: "DefenseEye is a Redmond, WA-based minority-owned AI, cybersecurity, Microsoft cloud, CMMC, and compliance automation supplier available for advisory, implementation, subcontracting, and staff augmentation opportunities.",
    who: ["Enterprise procurement teams", "Prime contractors", "Inclusive sourcing teams", "Microsoft-centered programs", "Regulated organizations"],
    problems: ["Need specialized AI and cybersecurity subcontractors", "Supplier capability evaluation", "Minority-owned supplier sourcing", "Compliance automation support needs"],
    helps: ["Advisory consulting", "Project delivery", "Staff augmentation", "Specialized subcontracting", "Platform-enabled consulting"],
    deliverables: ["Capability overview", "Supplier identifiers", "Credential summary", "Engagement model fit", "Procurement-ready contact path"],
    outcomes: ["Easier supplier evaluation", "Clear procurement details", "Specialized delivery capacity", "Stronger subcontracting readiness"],
    credentials: ["WA State UBI: 605-582-526", "CAGE: 9ZDL5", "UEI: E4DYPCKN7YN8", "DUNS: 119330734", "NAICS: 541512, 541519, 541690, 561621", "OMWBE-MBE Certified", "NMSDC-MBE Certified", "WA State SBE", "CMMC Level 1 Certified", "Multiple CMMC Certified Professionals", "NIST 800-171 Level 2 in progress", "CIPM", "Azure Fundamentals", "FedRAMP experience"],
    engagement: ["Advisory consulting", "Project delivery", "Staff augmentation", "Specialized subcontracting", "Platform-enabled consulting"],
    cta: "Discuss Supplier Opportunities",
    contact: "partners",
    booking: "general",
  },
};
