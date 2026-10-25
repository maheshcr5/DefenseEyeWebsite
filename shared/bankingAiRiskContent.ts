// Content for /solutions/banking-ai-agent-risk, shared by the React page
// (client/src/pages/BankingAiAgentRisk.tsx) and the server-rendered fallback (shared/seoRoutes.ts).
// Product language for DefyAIRisk is limited to what https://defy.defenseeye.ai states publicly
// (one register of AI agents, risk ranked in business terms, guided remediation with human review,
// sign-in with Microsoft or Google and administrator-approved access).
// "DefyAIRisk" is the public product name; no shorter name is approved. Monitoring is not claimed
// because the public product page does not state it.
// Do not add customers, certifications, integrations, pricing, results, or regulatory guarantees.

export const BANKING_AI_RISK_PATH = "/solutions/banking-ai-agent-risk";
export const DEFY_AI_RISK_URL = "https://defy.defenseeye.ai";
/** Existing contact form, preset to the banking discovery inquiry (see ContactUs INQUIRY_PARAM_MAP). */
export const BANKING_DISCOVERY_HREF = "/contact?inquiry=banking-ai-risk-discovery";

export const BANKING_AI_RISK_CONTENT = {
  eyebrow: "AI-agent risk management for banks and regulated financial institutions",
  h1: "Know which AI agents put your bank at risk.",
  intro:
    "DefenseEye helps banks and regulated financial institutions discover AI agents, rank their risk in business terms, govern ownership and approvals, and support guided remediation with human review.",
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
  workflowHeading: "From AI-agent risk to governed action.",
  workflowIntro:
    "A practical workflow DefenseEye helps teams put in place. Consequential remediation is subject to appropriate human review.",
  workflow: [
    { title: "Discover", text: "Identify AI agents, use cases, owners, tools, and data paths." },
    { title: "Assess", text: "Review each agent's permissions, controls, and governance gaps." },
    { title: "Prioritize", text: "Rank findings by business impact so the highest risks are addressed first." },
    { title: "Review and approve", text: "Owners and approvers review proposed actions before consequential changes are made." },
    { title: "Remediate", text: "Carry out approved actions through guided remediation, not uncontrolled changes." },
    { title: "Record evidence", text: "Keep a record of decisions, approvals, and completed actions for risk, compliance, audit, and leadership." },
  ],
  audienceHeading: "Built for teams responsible for safe AI adoption.",
  audiences: [
    "Banks and digital banks",
    "Fintech and payments companies",
    "Lending, fraud, AML, customer-service, and operations teams",
    "CIO, CTO, CISO, enterprise-risk, compliance, model-risk, and AI-governance leaders",
  ],
  productHeading: "See AI-agent risk in one operational view.",
  productText:
    "DefyAIRisk is DefenseEye's AI-agent risk platform. It helps teams maintain an up-to-date view of AI-agent risk in one register, understand exposure in business terms, and coordinate guided remediation with human review before any change.",
  productCta: "Explore the DefyAIRisk Platform",
  engagementHeading: "Know what you will leave with.",
  engagementIntro:
    "You will leave the discovery call with a recommended next step for your highest-risk AI use cases: a focused assessment, a pilot, or a product demonstration.",
  engagementTopicsIntro:
    "If a focused assessment is the right fit, we will agree its scope and outputs with you. Topics to scope together include:",
  engagementTopics: [
    "AI-agent and use-case inventory",
    "Review of owners, permissions, tools, and data paths",
    "Business-oriented risk and control-gap summary",
    "Governance and approval-gap findings",
    "Prioritized remediation backlog",
    "Recommended pilot or implementation path",
  ],
  trustHeading: "Evaluate DefenseEye with confidence.",
  trustPoints: [
    {
      title: "People stay in control",
      text: "Guided remediation keeps consequential changes subject to human review and approval before they are made.",
    },
    {
      title: "Controlled platform access",
      text: "DefyAIRisk users sign in with a Microsoft or Google work account, and an administrator approves each new user's access request.",
    },
    {
      title: "What we do not claim",
      text: "DefenseEye is not a certification body or regulator. It does not grant regulatory approval, promise specific outcomes, or make uncontrolled changes to your systems.",
    },
  ],
  faqHeading: "Questions banking teams ask",
  faqs: [
    {
      question: "What AI-agent risks can DefenseEye help us identify?",
      answer:
        "DefenseEye helps identify AI agents that are not inventoried, access that is broader than an agent's purpose requires, gaps in ownership and approvals, and remediation that lacks review or evidence.",
    },
    {
      question: "Can DefenseEye help us understand which agents, tools, permissions, and data paths are involved?",
      answer:
        "Yes. Discovery covers AI agents, use cases, owners, permissions, tools, models, and data paths, so teams can see what each agent can reach and who is accountable for it.",
    },
    {
      question: "Does DefenseEye make changes automatically?",
      answer:
        "No. DefenseEye supports guided remediation: corrective actions are prioritized and proposed, and appropriate human review and approval take place before any consequential change is made.",
    },
    {
      question: "What happens during the first banking AI-agent risk discovery call?",
      answer:
        "We discuss where AI agents are being used, what access and ownership questions matter most, and whether a focused assessment, pilot, or product demonstration is the right next step.",
    },
    {
      question: "Is DefenseEye a certification body or regulator?",
      answer:
        "No. DefenseEye does not certify compliance or grant regulatory approval. It helps teams strengthen AI-agent governance, risk visibility, and evidence for their own risk, compliance, and audit functions.",
    },
    {
      question: "How does DefenseEye relate to DefyAIRisk?",
      answer:
        "DefyAIRisk is DefenseEye's AI-agent risk platform. It provides one register of AI agents, ranks risks in business terms, and supports guided remediation with human review before any change. DefenseEye also provides advisory and implementation support for AI governance, cybersecurity, and risk management.",
    },
  ],
  offerHeading: "Start with a focused conversation about your highest-risk AI use cases.",
  offerText:
    "We will discuss where AI agents are being used, what access and ownership questions matter most, and whether a focused assessment, pilot, or product demonstration is the right next step.",
  trustText:
    "DefenseEye combines AI governance, cybersecurity, risk management, and implementation support for organizations operating in sensitive environments.",
} as const;
