// Plain-text content for the /lp/ campaign landing pages, shared by the React page
// (client/src/pages/LandingPage.tsx) and the server-rendered fallback HTML.

export type LandingConfig = {
  title: string;
  desc: string;
  pains: string[];
  helps: string[];
  outcomes: string[];
  engagement: string;
  cta: string;
  /** Which booking link the primary CTA uses. */
  booking: "general" | "cmmclens";
};

export const LANDING_PAGE_CONTENT: Record<string, LandingConfig> = {
  "/lp/secure-ai-adoption": {
    title: "Secure AI adoption consulting for regulated teams",
    desc: "Move from AI experimentation to governed implementation with AI policy, NIST AI RMF alignment, Microsoft Copilot readiness, data protection, and oversight workflows.",
    pains: ["AI pilots are moving faster than governance", "Sensitive data and permissions are not ready", "Executives need accountability and measurable readiness"],
    helps: ["AI governance readiness assessment", "Secure adoption roadmap tied to controls", "Human oversight and AI risk workflow"],
    outcomes: ["Reduced AI adoption risk", "Less rework", "Faster governed implementation"],
    engagement: "Representative engagement: secure AI adoption readiness review with policy, control, risk, and implementation roadmap deliverables.",
    cta: "Discuss Secure AI Adoption",
    booking: "general",
  },
  "/lp/ai-governance-consulting": {
    title: "AI governance consulting for regulated organizations",
    desc: "Practical support for NIST AI RMF, responsible AI, human accountability, policy, oversight, and AI risk management.",
    pains: ["AI use is expanding without clear ownership", "Policies do not match real workflows", "Procurement and assurance teams need explainable controls"],
    helps: ["AI inventory and use-case intake", "Governance model and policy development", "Risk assessment and oversight workflow"],
    outcomes: ["Clearer accountability", "Reduced shadow AI risk", "Better readiness for procurement and assurance reviews"],
    engagement: "Representative engagement: AI governance readiness assessment with a governance roadmap and policy/control recommendations.",
    cta: "Discuss AI Governance Readiness",
    booking: "general",
  },
  "/lp/microsoft-copilot-readiness": {
    title: "Microsoft Copilot readiness assessment",
    desc: "Prepare Microsoft 365, identity, data governance, privacy, and security controls before broad Copilot adoption.",
    pains: ["Overshared files can surface through Copilot", "Permissions and ownership may be unclear", "Security and privacy teams need rollout guardrails"],
    helps: ["Microsoft 365 and Entra readiness review", "Purview and data governance alignment", "Copilot adoption controls and roadmap"],
    outcomes: ["Lower data exposure risk", "More accountable adoption", "Clearer implementation priorities"],
    engagement: "Representative engagement: Copilot governance assessment with data exposure findings, guardrails, and readiness roadmap.",
    cta: "Assess Copilot Readiness",
    booking: "general",
  },
  "/lp/cmmc-level-2-readiness": {
    title: "CMMC Level 2 readiness consulting",
    desc: "Focused support for CUI scope, NIST SP 800-171 gaps, SSP, POA&M, evidence planning, SPRS, and assessment readiness.",
    pains: ["Evidence is scattered", "SSP and POA&M materials are incomplete", "Teams need readiness clarity before assessment planning"],
    helps: ["Control gap review", "Evidence and documentation plan", "Prioritized remediation roadmap"],
    outcomes: ["Improved readiness visibility", "Reduced assessment friction", "Clearer executive next steps"],
    engagement: "Representative engagement: CMMC Level 2 readiness sprint with findings, roadmap, evidence plan, and executive summary.",
    cta: "Assess CMMC Readiness",
    booking: "general",
  },
  "/lp/cmmc-compliance-automation": {
    title: "CMMC compliance automation for evidence and readiness workflows",
    desc: "CCP-led readiness support and CMMCLens automation for NIST SP 800-171 evidence, SSP/POA&M workflows, remediation tracking, and readiness dashboards.",
    pains: ["Evidence is scattered across tools and documents", "Remediation ownership is unclear", "Leaders need readiness visibility before customer or assessment pressure"],
    helps: ["Control and evidence mapping", "CMMCLens implementation planning", "CCP-led readiness and remediation workflow support"],
    outcomes: ["Reduced manual evidence burden", "Better traceability", "Clearer remediation priorities"],
    engagement: "Representative engagement: CMMC compliance automation sprint with evidence workflow design, gap priorities, and CMMCLens onboarding plan.",
    cta: "Explore CMMC Automation",
    booking: "general",
  },
  "/lp/cmmc-evidence-automation": {
    title: "CMMC evidence automation with CMMCLens",
    desc: "Reduce manual evidence collection and improve traceability through CMMCLens and compliance workflow automation.",
    pains: ["Evidence collection is manual", "Control mapping is inconsistent", "Readiness reporting is hard to maintain"],
    helps: ["Evidence source mapping", "Workflow automation design", "CMMCLens fit assessment"],
    outcomes: ["Reduced manual effort", "Improved traceability", "More consistent documentation"],
    engagement: "Representative engagement: compliance evidence automation implementation with dashboards and control mapping.",
    cta: "Explore Evidence Automation",
    booking: "general",
  },
  "/lp/cmmclens-demo": {
    title: "CMMCLens demo for CMMC evidence automation",
    desc: "See how CMMCLens structures CMMC and NIST SP 800-171 readiness with evidence automation, control mapping, gap tracking, SSP/POA&M workflows, and dashboards.",
    pains: ["Manual evidence requests consume staff time", "Control traceability is difficult to maintain", "Readiness reporting is inconsistent"],
    helps: ["CMMCLens product walkthrough", "Evidence workflow fit assessment", "Implementation scope and integration planning"],
    outcomes: ["Improved evidence discipline", "Better readiness visibility", "More structured remediation"],
    engagement: "Representative engagement: CMMCLens demo and evidence automation fit review.",
    cta: "Request CMMCLens Demo",
    booking: "cmmclens",
  },
  "/lp/microsoft-supplier-ai-consulting": {
    title: "Minority-owned AI governance and cybersecurity supplier for Microsoft-centered environments",
    desc: "Supplier-ready AI, cybersecurity, cloud security, Microsoft Copilot, and compliance automation support for enterprise procurement and subcontracting teams.",
    pains: ["Supplier teams need specialized AI/cyber capability", "Programs need minority-owned subcontracting options", "Microsoft-centered environments require credible domain expertise"],
    helps: ["Supplier onboarding support", "Advisory and staff augmentation models", "Microsoft cloud and compliance capability"],
    outcomes: ["Easier procurement evaluation", "Specialized delivery capacity", "Clear supplier identifiers and credentials"],
    engagement: "Representative engagement: supplier capability review for AI governance, cybersecurity, cloud security, or compliance automation support.",
    cta: "Discuss Supplier Opportunities",
    booking: "general",
  },
  "/lp/azure-cloud-security": {
    title: "Azure cloud security and compliance review",
    desc: "Support for Azure, Azure Government, GCC High patterns, Entra, Defender, Sentinel, Purview, secure architecture, and compliance alignment.",
    pains: ["Cloud controls are fragmented", "Identity and monitoring need review", "Regulated environments require stronger evidence and governance"],
    helps: ["Azure posture review", "Identity and monitoring recommendations", "Security and compliance roadmap"],
    outcomes: ["Stronger cloud security", "Clearer remediation priorities", "Better compliance readiness"],
    engagement: "Representative engagement: Azure security and compliance review with risk-ranked findings and roadmap.",
    cta: "Review Azure Security",
    booking: "general",
  },
  "/lp/compliance-automation": {
    title: "Compliance automation for evidence, workflows, and readiness reporting",
    desc: "Help compliance teams reduce manual effort through evidence automation, control mapping, documentation support, and readiness dashboards.",
    pains: ["Manual evidence work consumes staff time", "Documentation lacks consistency", "Leaders need better readiness visibility"],
    helps: ["Control and evidence mapping", "Workflow automation planning", "Dashboard and reporting design"],
    outcomes: ["Reduced compliance preparation effort", "Improved evidence traceability", "Stronger audit readiness"],
    engagement: "Representative engagement: compliance automation roadmap with workflow design and CMMCLens fit assessment.",
    cta: "Discuss Compliance Automation",
    booking: "general",
  },
};
