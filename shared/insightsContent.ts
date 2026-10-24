// Plain-text content for /insights/:slug answer pages, shared by the React page
// (client/src/pages/ThoughtLeadership.tsx) and the server-rendered fallback HTML.

export type Insight = {
  slug: string;
  title: string;
  description: string;
  answer: string;
  sections: { heading: string; points: string[] }[];
  faqs: { question: string; answer: string }[];
  related: string[];
};

export const INSIGHTS: Insight[] = [
  {
    slug: "what-is-cmmc-level-2",
    title: "What is CMMC Level 2?",
    description: "Plain-English explanation of CMMC Level 2 for defense contractors handling CUI.",
    answer:
      "CMMC Level 2 is the cybersecurity certification level for defense contractors that process, store, or transmit Controlled Unclassified Information. It is based on the 110 security requirements in NIST SP 800-171 and usually requires a third-party assessment by a C3PAO for contracts involving CUI.",
    sections: [
      { heading: "What it requires", points: ["A defined CUI environment and assessment boundary", "A System Security Plan describing control implementation", "Evidence mapped to each applicable NIST 800-171 requirement", "POA&M management where allowed", "Assessment readiness for a C3PAO or required self-assessment path"] },
      { heading: "How DefenseEye helps", points: ["CUI scoping and control gap assessment", "SSP and POA&M development", "Evidence automation through CMMCLens", "Microsoft GCC High and Azure Government readiness support"] },
    ],
    faqs: [
      { question: "Who needs CMMC Level 2?", answer: "Organizations that handle CUI under DoD contracts generally need CMMC Level 2." },
      { question: "Is CMMC Level 2 only documentation?", answer: "No. Documentation must reflect implemented technical, administrative, and operational controls." },
    ],
    related: ["CMMC", "NIST 800-171", "CUI", "C3PAO", "SSP"],
  },
  {
    slug: "what-is-rmf-readiness",
    title: "What is RMF readiness?",
    description: "A practical explanation of RMF readiness for federal systems and authorization programs.",
    answer:
      "RMF readiness means an organization has the governance, control implementation, documentation, evidence, risk decisions, and operational processes needed to move through the NIST Risk Management Framework and support authorization decisions.",
    sections: [
      { heading: "Readiness indicators", points: ["System categorization is clear", "Controls are selected and implemented", "Evidence supports control claims", "Risks are documented and owned", "Continuous monitoring is planned and operational"] },
      { heading: "Common gaps", points: ["Unclear system boundary", "Outdated SSP content", "Evidence that is not traceable to controls", "POA&Ms without owners or dates", "Weak connection between cloud architecture and authorization evidence"] },
    ],
    faqs: [
      { question: "Is RMF readiness the same as authorization?", answer: "No. Readiness prepares the system and evidence package for authorization, but an authorizing official makes the risk decision." },
      { question: "Can automation support RMF?", answer: "Yes. Automation can improve evidence collection, control monitoring, traceability, and POA&M management." },
    ],
    related: ["RMF", "NIST 800-53", "Authorization", "SSP", "POA&M"],
  },
  {
    slug: "what-is-nist-ai-rmf",
    title: "What is NIST AI RMF?",
    description: "Plain-English guide to the NIST AI Risk Management Framework.",
    answer:
      "The NIST AI Risk Management Framework is a voluntary framework that helps organizations govern, map, measure, and manage risks from artificial intelligence systems. It supports trustworthy AI by focusing on validity, safety, security, resilience, accountability, transparency, explainability, privacy, and fairness.",
    sections: [
      { heading: "Core functions", points: ["Govern AI risk roles, policies, and accountability", "Map AI systems, context, stakeholders, and impacts", "Measure risks through testing, evaluation, and monitoring", "Manage risks through controls, mitigations, and oversight"] },
      { heading: "Why it matters", points: ["AI systems introduce operational, legal, security, privacy, and reputational risk", "Executives need explainable governance, not only model performance metrics", "Regulated organizations need auditable AI decisions and controls"] },
    ],
    faqs: [
      { question: "Is NIST AI RMF mandatory?", answer: "It is voluntary unless incorporated into contracts, policy, regulatory expectations, or organizational governance requirements." },
      { question: "Does NIST AI RMF apply to generative AI?", answer: "Yes. It can be applied to generative AI systems, copilots, agents, and AI-enabled workflows." },
    ],
    related: ["NIST AI RMF", "Responsible AI", "AI governance", "AI risk"],
  },
  {
    slug: "ai-automated-evidence-collection",
    title: "How can AI automate evidence collection?",
    description: "How AI and workflow automation can reduce compliance evidence collection effort.",
    answer:
      "AI can automate evidence collection by identifying relevant artifacts, mapping them to controls, summarizing evidence context, detecting missing items, and keeping traceability between systems, risks, controls, and documentation. Human review is still needed for approval, interpretation, and risk decisions.",
    sections: [
      { heading: "Where AI helps", points: ["Classifying evidence artifacts", "Mapping evidence to control objectives", "Drafting evidence narratives", "Finding stale or missing evidence", "Supporting assessor-ready traceability"] },
      { heading: "Controls to keep in place", points: ["Human approval for final evidence claims", "Access controls for sensitive artifacts", "Audit logs for evidence handling", "Clear source-of-record rules", "Model output review before submission"] },
    ],
    faqs: [
      { question: "Can AI replace compliance staff?", answer: "No. AI can reduce manual effort, but compliance teams still own judgment, validation, approvals, and risk acceptance." },
      { question: "What is the main benefit?", answer: "The main benefit is less manual collection effort and stronger evidence traceability." },
    ],
    related: ["Evidence automation", "Compliance automation", "Audit readiness", "CMMCLens"],
  },
  {
    slug: "implement-ai-governance",
    title: "How can organizations implement AI governance?",
    description: "Practical steps for implementing AI governance and responsible AI programs.",
    answer:
      "Organizations can implement AI governance by inventorying AI use cases, defining risk ownership, aligning policies to a framework such as NIST AI RMF, setting approval and monitoring processes, securing AI systems, and documenting how AI risks are measured and managed.",
    sections: [
      { heading: "Implementation steps", points: ["Create an AI system inventory", "Classify AI use cases by risk and data sensitivity", "Define roles for business, legal, security, privacy, and technology owners", "Adopt control requirements for high-risk use cases", "Monitor model, data, security, and operational risks"] },
      { heading: "Evidence to maintain", points: ["Use case approvals", "Risk assessments", "Data handling decisions", "Security reviews", "Human oversight procedures", "Incident and change records"] },
    ],
    faqs: [
      { question: "Who owns AI governance?", answer: "AI governance is shared across leadership, legal, privacy, security, data, technology, and business owners." },
      { question: "Where should a company start?", answer: "Start with an AI inventory and risk tiering process before buying additional tools." },
    ],
    related: ["AI governance", "Responsible AI", "NIST AI RMF", "Data governance"],
  },
  {
    slug: "security-copilot-cybersecurity-operations",
    title: "How can Security Copilot improve cybersecurity operations?",
    description: "How Microsoft Security Copilot can support security operations when implemented with governance.",
    answer:
      "Security Copilot can improve cybersecurity operations by helping analysts summarize alerts, accelerate investigation, draft incident response actions, query security data, and reduce repetitive triage work. It works best when paired with strong identity, logging, data governance, and human oversight.",
    sections: [
      { heading: "Operational use cases", points: ["Alert summarization", "Incident investigation support", "Threat hunting assistance", "KQL query generation", "Response playbook drafting", "Security knowledge retrieval"] },
      { heading: "Readiness considerations", points: ["Identity and access model", "Logging coverage", "Data quality", "Prompt and output governance", "Security review of AI-assisted workflows"] },
    ],
    faqs: [
      { question: "Does Security Copilot replace analysts?", answer: "No. It can improve analyst productivity, but humans remain responsible for decisions and response actions." },
      { question: "What should be assessed first?", answer: "Assess data readiness, permissions, logging quality, and the governance model for AI-assisted security work." },
    ],
    related: ["Security Copilot", "AI security", "SOC operations", "Microsoft security"],
  },
  {
    slug: "continuous-compliance-monitoring",
    title: "What is continuous compliance monitoring?",
    description: "Definition and practical value of continuous compliance monitoring.",
    answer:
      "Continuous compliance monitoring is the ongoing tracking of controls, evidence, risks, configuration changes, and remediation status so organizations can maintain readiness between audits instead of preparing only at assessment time.",
    sections: [
      { heading: "What to monitor", points: ["Identity and access changes", "Security configuration drift", "Evidence freshness", "Control ownership", "Open findings and POA&Ms", "Documentation changes"] },
      { heading: "Business outcomes", points: ["Reduced audit preparation effort", "Earlier detection of compliance drift", "Better governance visibility", "More consistent evidence traceability", "Stronger readiness for customer and regulator requests"] },
    ],
    faqs: [
      { question: "Is continuous monitoring only technical?", answer: "No. It includes technical controls, process evidence, documentation, ownership, and risk decisions." },
      { question: "How does automation help?", answer: "Automation reduces manual checking and gives teams earlier visibility into gaps." },
    ],
    related: ["Continuous compliance", "Control monitoring", "Evidence automation", "Risk management"],
  },
  {
    slug: "ai-audit-readiness",
    title: "How can AI improve audit readiness?",
    description: "How AI can support audit and assessment readiness without replacing human assurance.",
    answer:
      "AI can improve audit readiness by organizing evidence, drafting control narratives, identifying missing documentation, summarizing gaps, and connecting artifacts to control requirements. It should support human-reviewed audit preparation, not create unsupported compliance claims.",
    sections: [
      { heading: "Useful AI applications", points: ["Evidence classification", "Control narrative drafting", "Gap summarization", "Policy and procedure consistency checks", "Audit request response support", "Readiness dashboard summaries"] },
      { heading: "Governance requirements", points: ["Human review before audit submission", "Source traceability", "Access controls for sensitive records", "Version control", "Clear separation between draft content and approved evidence"] },
    ],
    faqs: [
      { question: "Can AI make an organization audit-ready by itself?", answer: "No. AI can speed preparation, but audit readiness depends on implemented controls, evidence quality, and accountable governance." },
      { question: "What is the safest use of AI in audits?", answer: "Use AI to organize, summarize, and draft, while requiring human review and source traceability for final claims." },
    ],
    related: ["Audit readiness", "AI automation", "Evidence traceability", "Compliance"],
  },
];
