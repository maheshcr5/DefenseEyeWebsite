// Homepage answer content and audience paths, shared by client/src/pages/Home.tsx
// and the server-rendered fallback (rendered visibly there, and emitted as FAQPage
// structured data). Every statement restates facts published elsewhere on the site:
// certifications in companyFacts.ts, claim boundaries in public/llms.txt, and the
// human-oversight language used on the Secure AI and insight pages. Do not add
// customers, statistics, or capabilities here that the site does not already support.

export type HomeAnswer = { question: string; answer: string };

export const HOME_AT_A_GLANCE: HomeAnswer[] = [
  {
    question: "What is DefenseEye?",
    answer:
      "DefenseEye is a Redmond, Washington–based, minority-owned consulting and software company. It helps regulated organizations adopt AI securely by combining AI governance, cybersecurity, Microsoft cloud security, and compliance automation, and it builds two products: CMMCLens for CMMC and NIST SP 800-171 evidence automation, and AttackSense for attack surface and remediation intelligence.",
  },
  {
    question: "Who does DefenseEye work with?",
    answer:
      "Regulated organizations and teams that handle sensitive data: financial-services firms, FinTechs, and credit unions adopting AI; security, risk, and compliance teams in Microsoft-centered environments; and defense contractors preparing for CMMC. DefenseEye also works with enterprise procurement teams and partners as a supplier and subcontractor.",
  },
  {
    question: "What problems does DefenseEye help solve?",
    answer:
      "AI agents and copilots that can reach sensitive data before governance is ready; unclear AI permissions, accountability, and human review points; scattered compliance evidence and manual CMMC preparation; and security findings without clear remediation priorities or owners.",
  },
  {
    question: "How does an engagement work?",
    answer:
      "Most work follows three stages. Assess: business value, data readiness, risks, and controls. Design: architecture, governance, identity, oversight, and evaluation. Implement: build, integrate, test, monitor, and scale. Engagements can be advisory, project-based, staff augmentation, or subcontracted.",
  },
  {
    question: "What stays under human control?",
    answer:
      "People keep authority over consequential decisions. High-impact AI-assisted actions keep appropriate human review and accountability, and automated compliance evidence still needs human approval before it is relied on for risk decisions or shared with assessors.",
  },
  {
    question: "How are governance and auditability handled?",
    answer:
      "Through practical controls: AI inventories and risk tiering, least-privilege access, logging and traceability from AI-assisted outputs back to their sources, evaluation and monitoring, and evidence mapped to the controls it supports. DefenseEye is not a C3PAO, does not certify organizations, and does not guarantee assessment outcomes.",
  },
];

export type HomePath = {
  audience: string;
  description: string;
  cta: string;
  href: string;
  /** Analytics intent recorded when a visitor chooses this path (see client/src/lib/analytics.ts). */
  intent?: "secure_ai" | "cmmc" | "supplier";
};

// Starting points for the buyer groups the site has dedicated content for.
export const HOME_PATHS: HomePath[] = [
  {
    audience: "Financial services & credit unions",
    description: "Evaluate AI use cases with data-access controls, traceability, monitoring, and human oversight.",
    cta: "See the financial services path",
    href: "/industries/financial-services-credit-unions",
    intent: "secure_ai",
  },
  {
    audience: "Regulated teams adopting AI or Copilot",
    description: "Prioritize use cases and put governance, secure architecture, and oversight in place before agents go live.",
    cta: "Plan secure AI adoption",
    href: "/secure-ai-adoption",
    intent: "secure_ai",
  },
  {
    audience: "Security and risk leaders",
    description: "Turn findings into prioritized remediation with clear owners and executive-ready risk visibility.",
    cta: "Prioritize cyber risk",
    href: "/solutions/cybersecurity-risk",
  },
  {
    audience: "Defense suppliers preparing for CMMC",
    description: "Scope CUI, close NIST SP 800-171 gaps, and organize evidence with CCP-led support and CMMCLens.",
    cta: "Prepare for CMMC",
    href: "/industries/defense-industrial-base",
    intent: "cmmc",
  },
  {
    audience: "Procurement teams and partners",
    description: "Review supplier identifiers, certifications, delivery models, and capability materials.",
    cta: "Review supplier facts",
    href: "/supplier-readiness",
    intent: "supplier",
  },
];
