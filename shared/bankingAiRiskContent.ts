// Content for /solutions/banking-ai-agent-risk, shared by the React page
// (client/src/pages/BankingAiAgentRisk.tsx) and the server-rendered fallback (shared/seoRoutes.ts).
// Product language for DefyAIRisk is limited to what https://defy.defenseeye.ai states publicly
// (one register of AI agents, risk ranked in business terms, guided remediation with human review).
// Do not add customers, certifications, integrations, pricing, results, or regulatory guarantees.

export const BANKING_AI_RISK_PATH = "/solutions/banking-ai-agent-risk";
export const DEFY_AI_RISK_URL = "https://defy.defenseeye.ai";
/** Existing contact form, preset to the banking discovery inquiry (see ContactUs INQUIRY_PARAM_MAP). */
export const BANKING_DISCOVERY_HREF = "/contact?inquiry=banking-ai-risk-discovery";

export const BANKING_AI_RISK_CONTENT = {
  eyebrow: "AI-agent risk management for banks and regulated financial institutions",
  h1: "Know which AI agents put your bank at risk.",
  intro:
    "DefenseEye helps banks and regulated financial institutions discover AI agents, rank their risk in business terms, monitor behavior, govern ownership and approvals, and support guided remediation with human review.",
  primaryCta: "Request a Banking AI Risk Discovery Call",
  secondaryCta: "See the DefenseEye AI-Agent Risk Platform",
  painHeading: "AI adoption is moving faster than risk visibility.",
  pains: [
    {
      title: "Unknown exposure",
      text: "AI agents can be embedded in copilots, workflows, SaaS tools, cloud services, and internal applications. Teams may not have one reliable view of which agents exist, who owns them, what tools they can call, or what data they can access.",
    },
    {
      title: "Excessive access",
      text: "Permissions, connectors, APIs, and tool access can expand faster than governance reviews. Security and risk teams need to know whether an agent's access is still justified.",
    },
    {
      title: "Behavior outside the approved purpose",
      text: "Point-in-time reviews do not show whether an agent later accesses unusual data, uses an unexpected tool, violates policy, or behaves outside its approved workflow.",
    },
    {
      title: "Unsafe remediation",
      text: "Banks need to reduce risk without allowing uncontrolled changes to production systems. Remediation requires ownership, approval, evidence, and review before consequential changes are made.",
    },
  ],
  solutionHeading: "From agent visibility to accountable action.",
  capabilities: [
    { title: "Discover", text: "Create visibility into AI agents, use cases, owners, permissions, tools, models, and data paths." },
    { title: "Prioritize", text: "Translate technical findings into business-oriented risk so teams can focus on the issues that matter most." },
    { title: "Govern", text: "Support policies, approval gates, ownership, exceptions, evidence, and audit trails across the AI-agent lifecycle." },
    { title: "Guide remediation", text: "Prioritize corrective actions and support remediation with human review before consequential changes are made." },
  ],
  audienceHeading: "Built for teams responsible for safe AI adoption.",
  audiences: [
    "Banks and digital banks",
    "Fintech and payments companies",
    "Lending, fraud, AML, customer-service, and operations teams",
    "CIO, CTO, CISO, enterprise-risk, compliance, model-risk, and AI-governance leaders",
  ],
  productHeading: "See AI-agent risk in one operational view.",
  // The requested copy also said "monitor changes"; the public Defy page does not state that, so it is omitted.
  productText:
    "Defy helps teams maintain an AI-agent risk register, understand exposure in business terms, and coordinate guided remediation with human review before any change.",
  productCta: "Explore the Defy Platform",
  offerHeading: "Start with a focused banking AI-agent risk discovery call.",
  offerText:
    "We will discuss your AI-agent use cases, access paths, ownership model, monitoring needs, and practical next steps for governed remediation.",
  trustText:
    "DefenseEye combines AI governance, cybersecurity, risk management, and implementation support for organizations operating in sensitive environments.",
} as const;
