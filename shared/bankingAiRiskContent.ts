// Content for /solutions/banking-ai-agent-risk, shared by the React page
// (client/src/pages/BankingAiAgentRisk.tsx) and the server-rendered fallback (shared/seoRoutes.ts).
// Product language for DefyAIRisk is limited to what https://defy.defenseeye.ai states publicly.
// Do not add customers, certifications, integrations, pricing, results, or regulatory guarantees.

export const BANKING_AI_RISK_PATH = "/solutions/banking-ai-agent-risk";
export const DEFY_AI_RISK_URL = "https://defy.defenseeye.ai";
/** Existing contact form, preset to the banking discovery inquiry (see ContactUs INQUIRY_PARAM_MAP). */
export const BANKING_DISCOVERY_HREF = "/contact?inquiry=banking-ai-risk-discovery";

export const BANKING_AI_RISK_CONTENT = {
  eyebrow: "AI-agent risk management for financial institutions",
  h1: "Adopt AI without losing control of risk.",
  intro:
    "DefenseEye helps banks and fintechs discover, monitor, govern, and remediate AI-agent risk across sensitive data, tools, workflows, and third-party systems.",
  primaryCta: "Request a Banking AI Risk Discovery Call",
  secondaryCta: "See the DefenseEye AI-Agent Risk Platform",
  painHeading: "Where AI-agent risk builds up",
  painIntro: "As AI agents reach customer data, internal tools, and third-party systems, these are common sources of risk.",
  pains: [
    {
      title: "Unknown AI-agent exposure",
      text: "Agents and automations can be adopted faster than they are inventoried, leaving gaps in what is running and what it can reach.",
    },
    {
      title: "Excessive permissions and sensitive-data access",
      text: "Agents can inherit broader access to data, systems, and tools than their tasks require.",
    },
    {
      title: "Fragmented ownership across security, risk, compliance, and technology",
      text: "Each team may see part of the picture, with no single owner accountable for an agent's risk.",
    },
    {
      title: "Slow or undocumented remediation",
      text: "Fixes can stall, or be made without the review and evidence that oversight requires.",
    },
  ],
  solutionHeading: "How DefenseEye helps",
  capabilities: [
    { title: "Discover", text: "Maintain visibility into agents, tools, permissions, owners, and data paths." },
    { title: "Detect", text: "Identify risky behavior, control gaps, anomalous activity, and potential exposure." },
    { title: "Govern", text: "Establish policies, approval gates, ownership, evidence, and audit trails." },
    { title: "Remediate", text: "Support guided remediation with human review before any change." },
  ],
  productHeading: "DefyAIRisk by DefenseEye",
  productText:
    "DefyAIRisk by DefenseEye provides one register of AI agents, ranks risks in business terms, and supports guided remediation with human review before any change.",
  offerHeading: "Start with a focused banking AI risk discovery call.",
  offerText:
    "Map current AI-agent use cases, identify priority exposure, and define practical next steps for monitoring, governance, and guided remediation.",
} as const;
