// Hand-picked contextual links between pages that answer related buyer questions,
// with anchor text that describes the destination. Rendered by the server fallback
// (shared/seoRoutes.ts) and by client/src/components/RelatedResources.tsx.
//
// Only add a link when a reader of the source page would plausibly want the
// destination next. Do not add links just to raise inlink counts.

import { HOME_PATHS } from "./homeContent";
import { ROUTE_PARENTS, type ArchitectureLink } from "./siteArchitecture";

const link = (href: string, label: string, description?: string): ArchitectureLink => ({ href, label, description });

export const RELATED_LINKS: Record<string, ArchitectureLink[]> = {
  // Homepage audience paths (shared/homeContent.ts).
  "/": HOME_PATHS.map((path) => link(path.href, path.cta, `${path.audience}: ${path.description}`)),

  // Secure AI
  "/secure-ai-adoption": [
    link("/insights/implement-ai-governance", "Practical steps to implement AI governance", "AI inventories, risk tiering, roles, and governance evidence."),
    link("/insights/what-is-nist-ai-rmf", "What the NIST AI RMF asks of AI programs"),
    link("/datasheets/secure-ai-adoption", "Secure AI adoption one-page datasheet"),
    link("/lp/secure-ai-adoption", "Secure AI adoption readiness review"),
  ],
  "/solutions/ai-governance": [
    link("/insights/implement-ai-governance", "Practical steps to implement AI governance", "AI inventories, risk tiering, roles, and governance evidence."),
    link("/solutions/banking-ai-agent-risk", "AI-agent risk management for banks and fintechs", "Discover, prioritize, govern, and guide remediation of AI-agent risk."),
    link("/insights/what-is-nist-ai-rmf", "Plain-English guide to the NIST AI RMF", "How to govern, map, measure, and manage AI risk."),
    link("/industries/financial-services-credit-unions", "AI risk management for financial institutions", "Governance and oversight for banks, credit unions, and FinTechs."),
    link("/datasheets/secure-ai-adoption", "Secure AI adoption datasheet"),
    link("/lp/ai-governance-consulting", "AI governance readiness assessment", "A focused assessment with a governance roadmap and policy and control recommendations."),
  ],
  "/solutions/ai-transformation": [
    link("/solutions/ai-governance", "AI governance assessment", "Put oversight and accountability in place before scaling use cases."),
    link("/solutions/microsoft-copilot-readiness", "Microsoft Copilot readiness review"),
    link("/industries/financial-services-credit-unions", "Secure AI use cases in financial services"),
    link("/lp/secure-ai-adoption", "Secure AI adoption readiness review", "Policy, control, risk, and implementation roadmap deliverables."),
  ],
  "/solutions/ai-security": [
    link("/solutions/cybersecurity-risk", "Cybersecurity risk consulting", "Prioritize remediation across the wider security program."),
    link("/solutions/banking-ai-agent-risk", "AI-agent permissions and data-access risk in banking"),
    link("/insights/security-copilot-cybersecurity-operations", "Using Security Copilot in security operations"),
    link("/solutions/microsoft-copilot-readiness", "Copilot data-exposure and permissions review"),
  ],
  "/solutions/microsoft-copilot-readiness": [
    link("/datasheets/microsoft-copilot-readiness", "Microsoft Copilot readiness datasheet"),
    link("/microsoft-ecosystem", "DefenseEye experience in Microsoft-centered environments"),
    link("/insights/security-copilot-cybersecurity-operations", "Security Copilot for cybersecurity operations"),
    link("/lp/microsoft-copilot-readiness", "Copilot governance assessment", "Data exposure findings, guardrails, and a readiness roadmap."),
  ],
  "/industries/financial-services-credit-unions": [
    link("/solutions/banking-ai-agent-risk", "AI-agent risk management for banks and fintechs", "Discover, prioritize, govern, and guide remediation of AI-agent risk."),
    link("/solutions/ai-governance", "AI governance and NIST AI RMF alignment"),
    link("/solutions/ai-security", "AI security for sensitive financial data"),
    link("/insights/implement-ai-governance", "How to implement AI governance in practice"),
  ],
  "/solutions/banking-ai-agent-risk": [
    link("/industries/financial-services-credit-unions", "Secure AI for financial services and credit unions"),
    link("/solutions/ai-governance", "AI governance and NIST AI RMF alignment"),
    link("/solutions/ai-security", "AI security for agents, data access, and permissions"),
    link("/insights/implement-ai-governance", "How to implement AI governance in practice"),
  ],
  "/insights/implement-ai-governance": [
    link("/solutions/ai-governance", "AI governance consulting from DefenseEye"),
    link("/insights/what-is-nist-ai-rmf", "What is the NIST AI RMF?"),
    link("/industries/financial-services-credit-unions", "AI governance for financial institutions"),
    link("/lp/ai-governance-consulting", "Start with an AI governance readiness assessment"),
  ],
  "/insights/what-is-nist-ai-rmf": [
    link("/solutions/ai-governance", "NIST AI RMF alignment support"),
    link("/insights/implement-ai-governance", "Practical steps to implement AI governance"),
    link("/solutions/ai-security", "AI security risk assessment"),
  ],

  // Cybersecurity and Microsoft cloud
  "/solutions/cybersecurity-risk": [
    link("/insights/security-copilot-cybersecurity-operations", "How Security Copilot can support analysts"),
    link("/insights/continuous-compliance-monitoring", "Continuous compliance monitoring explained"),
    link("/solutions/ai-security", "Security risks introduced by AI agents and LLMs"),
  ],
  "/attacksense": [
    link("/solutions/cybersecurity-risk", "Cybersecurity risk consulting", "Pair attack surface intelligence with remediation planning."),
    link("/solutions/cloud-security", "Microsoft cloud security review"),
  ],
  "/attacksense/docs": [
    link("/attacksense", "AttackSense product overview"),
  ],
  "/solutions/cloud-security": [
    link("/microsoft-ecosystem", "DefenseEye's Microsoft ecosystem experience"),
    link("/blog/gcc-high-vs-m365-commercial-cmmc", "GCC High vs M365 Commercial for CMMC"),
    link("/solutions/microsoft-copilot-readiness", "Microsoft Copilot readiness review"),
    link("/lp/azure-cloud-security", "Azure security and compliance review", "Risk-ranked findings and a security and compliance roadmap."),
  ],
  "/microsoft-ecosystem": [
    link("/solutions/cloud-security", "Azure and GCC High cloud security consulting"),
    link("/solutions/microsoft-copilot-readiness", "Microsoft Copilot readiness consulting"),
    link("/datasheets/microsoft-copilot-readiness", "Microsoft Copilot readiness datasheet"),
    link("/insights/security-copilot-cybersecurity-operations", "Security Copilot for cybersecurity operations"),
    link("/lp/azure-cloud-security", "Azure cloud security and compliance review"),
  ],
  "/insights/security-copilot-cybersecurity-operations": [
    link("/solutions/cybersecurity-risk", "Cybersecurity risk consulting"),
    link("/microsoft-ecosystem", "Microsoft security and cloud experience"),
    link("/solutions/ai-security", "Governing AI tools inside security teams"),
  ],

  // CMMC and compliance automation
  "/cmmc-compliance-automation": [
    link("/knowledge-hub", "CMMC Knowledge Hub guides", "Plain-English explanations of levels, evidence, SPRS, and certification."),
    link("/blog", "CMMC articles for defense contractors"),
    link("/datasheets/cmmc-compliance-automation", "CMMC & compliance automation datasheet"),
    link("/lp/cmmc-compliance-automation", "CMMC compliance automation sprint"),
  ],
  "/industries/defense-industrial-base": [
    link("/services/cmmc-scoping", "CMMC scoping to define your CUI boundary"),
    link("/knowledge-hub/what-is-cmmc", "What CMMC means for defense suppliers"),
    link("/blog/what-counts-as-cui-plain-english-guide", "What counts as CUI?"),
    link("/cmmclens", "CMMCLens evidence automation"),
  ],
  "/cmmc": [
    link("/knowledge-hub/what-is-cmmc", "What is CMMC? Complete guide"),
    link("/services/cmmc-scoping", "CMMC scoping service"),
    link("/pricing", "CMMC readiness pricing and engagement options"),
    link("/lp/cmmc-compliance-automation", "CMMC compliance automation sprint", "Evidence workflow design, gap priorities, and a CMMCLens onboarding plan."),
  ],
  "/cmmc-level-2-readiness": [
    link("/knowledge-hub/cmmc-levels", "CMMC Level 1 vs Level 2 comparison"),
    link("/blog/cmmc-level-2-compliance-checklist-2025", "CMMC Level 2 compliance checklist"),
    link("/services/cmmc-readiness-sprint", "Fixed-scope CMMC readiness sprint"),
    link("/lp/cmmc-level-2-readiness", "CMMC Level 2 readiness assessment", "Findings, roadmap, evidence plan, and executive summary."),
  ],
  "/nist-800-171": [
    link("/knowledge-hub/evidence-mapping", "Mapping evidence to NIST 800-171 controls"),
    link("/knowledge-hub/sprs-score", "How SPRS scores are calculated"),
    link("/blog/cmmc-level-2-compliance-checklist-2025", "NIST 800-171 control checklist for CMMC Level 2"),
    link("/insights/what-is-rmf-readiness", "RMF readiness for federal systems"),
  ],
  "/services/cmmc-readiness-sprint": [
    link("/cmmc-readiness-sprint-guide", "How a 4-week readiness sprint is organized"),
    link("/services/cmmc-scoping", "Start with CMMC scoping"),
    link("/pricing", "CMMC readiness pricing"),
    link("/blog/cmmc-poam-guide-what-assessors-want", "What assessors expect in a POA&M"),
  ],
  "/services/cmmc-scoping": [
    link("/blog/what-counts-as-cui-plain-english-guide", "What counts as CUI?"),
    link("/blog/gcc-high-vs-m365-commercial-cmmc", "Choosing GCC High or M365 Commercial for CUI"),
    link("/knowledge-hub/cmmc-levels", "Which CMMC level applies to you"),
    link("/services/cmmc-readiness-sprint", "Follow scoping with a readiness sprint"),
  ],
  "/cmmc-evidence-automation": [
    link("/knowledge-hub/evidence-mapping", "NIST 800-171 evidence mapping guide"),
    link("/insights/ai-automated-evidence-collection", "How AI can automate evidence collection"),
    link("/solutions/cmmclens-platform", "CMMCLens platform overview"),
    link("/lp/cmmc-evidence-automation", "Evidence automation implementation with CMMCLens", "Dashboards and control mapping for compliance evidence."),
  ],
  "/cmmc-readiness-sprint-guide": [
    link("/services/cmmc-readiness-sprint", "Book a fixed-scope readiness sprint"),
    link("/services/cmmc-scoping", "CMMC scoping service"),
    link("/knowledge-hub/certification-process", "The CMMC certification process step by step"),
  ],
  "/solutions/compliance-automation": [
    link("/insights/ai-automated-evidence-collection", "How AI can automate evidence collection"),
    link("/insights/continuous-compliance-monitoring", "What continuous compliance monitoring involves"),
    link("/insights/ai-audit-readiness", "How AI can improve audit readiness"),
    link("/insights/what-is-rmf-readiness", "What RMF readiness means"),
    link("/cmmclens", "CMMCLens compliance automation platform"),
    link("/lp/compliance-automation", "Compliance automation roadmap and CMMCLens fit assessment"),
  ],
  "/cmmclens": [
    link("/solutions/cmmclens-platform", "CMMCLens platform capabilities overview"),
    link("/datasheets/cmmclens", "CMMCLens product sheet"),
    link("/knowledge-hub/evidence-mapping", "How evidence mapping to NIST 800-171 works"),
    link("/lp/cmmclens-demo", "CMMCLens demo and evidence automation fit review"),
  ],
  "/solutions/cmmclens-platform": [
    link("/cmmclens", "CMMCLens product page and demo"),
    link("/datasheets/cmmclens", "CMMCLens product sheet"),
    link("/cmmc-evidence-automation", "CMMC evidence automation and traceability"),
    link("/lp/cmmclens-demo", "Request a CMMCLens demo and fit review"),
  ],
  "/pricing": [
    link("/services/cmmc-readiness-sprint", "What the fixed-scope readiness sprint includes"),
    link("/services/cmmc-scoping", "CMMC scoping engagement"),
    link("/delivery-model", "DefenseEye engagement formats"),
    link("/blog/cmmc-consultant-red-flags", "Red flags when hiring a CMMC consultant"),
  ],
  "/faq": [
    link("/knowledge-hub/what-is-cmmc", "What is CMMC? Complete guide"),
    link("/knowledge-hub/sprs-score", "SPRS score guide"),
    link("/pricing", "CMMC readiness pricing"),
  ],
  "/insights/ai-automated-evidence-collection": [
    link("/solutions/compliance-automation", "Compliance evidence automation consulting"),
    link("/cmmclens", "CMMCLens evidence automation"),
    link("/insights/ai-audit-readiness", "How AI can improve audit readiness"),
    link("/lp/cmmc-evidence-automation", "Put CMMC evidence automation in place"),
  ],
  "/insights/continuous-compliance-monitoring": [
    link("/solutions/compliance-automation", "Compliance automation consulting"),
    link("/insights/ai-automated-evidence-collection", "AI-automated evidence collection"),
    link("/insights/what-is-rmf-readiness", "Continuous monitoring in RMF readiness"),
    link("/solutions/cybersecurity-risk", "Cybersecurity risk and remediation"),
  ],
  "/insights/ai-audit-readiness": [
    link("/solutions/compliance-automation", "Compliance evidence automation"),
    link("/insights/continuous-compliance-monitoring", "Continuous compliance monitoring"),
    link("/solutions/ai-governance", "Governing the AI tools used in audits"),
    link("/lp/compliance-automation", "Plan compliance automation for evidence and reporting"),
  ],
  "/insights/what-is-rmf-readiness": [
    link("/solutions/compliance-automation", "Evidence and control automation for authorization work"),
    link("/insights/continuous-compliance-monitoring", "Continuous monitoring for compliance programs"),
    link("/nist-800-171", "NIST SP 800-171 readiness"),
  ],

  // CMMC Knowledge Hub
  "/knowledge-hub": [
    link("/blog", "CMMC articles for defense contractors"),
    link("/faq", "CMMC frequently asked questions"),
    link("/insights/what-is-cmmc-level-2", "Short answer: what is CMMC Level 2?"),
    link("/cmmc-compliance-automation", "CMMC readiness and evidence automation services"),
  ],
  "/knowledge-hub/what-is-cmmc": [
    link("/knowledge-hub/cmmc-levels", "CMMC Level 1 vs Level 2 compared"),
    link("/blog/what-counts-as-cui-plain-english-guide", "What counts as CUI?"),
    link("/insights/what-is-cmmc-level-2", "What is CMMC Level 2?"),
  ],
  "/knowledge-hub/cmmc-levels": [
    link("/blog/cmmc-level-2-small-business-guide", "CMMC Level 2 for small businesses"),
    link("/insights/what-is-cmmc-level-2", "What CMMC Level 2 requires"),
    link("/services/cmmc-scoping", "CMMC scoping to confirm your level and boundary"),
  ],
  "/knowledge-hub/evidence-mapping": [
    link("/insights/ai-automated-evidence-collection", "How AI can automate evidence collection"),
    link("/blog/cmmc-level-2-compliance-checklist-2025", "CMMC Level 2 compliance checklist"),
    link("/cmmclens", "CMMCLens evidence automation"),
  ],
  "/knowledge-hub/sprs-score": [
    link("/blog/how-to-improve-sprs-score-fast", "How to improve your SPRS score fast"),
    link("/blog/cmmc-poam-guide-what-assessors-want", "CMMC POA&M guide"),
    link("/knowledge-hub/certification-process", "The CMMC certification process"),
  ],
  "/knowledge-hub/certification-process": [
    link("/blog/what-to-expect-c3pao-assessment", "What to expect in a C3PAO assessment"),
    link("/blog/cmmc-poam-guide-what-assessors-want", "What assessors look for in a POA&M"),
    link("/cmmc-readiness-sprint-guide", "4-week CMMC readiness sprint guide"),
  ],
  "/insights/what-is-cmmc-level-2": [
    link("/knowledge-hub/cmmc-levels", "CMMC Level 1 vs Level 2 in depth"),
    link("/cmmc-level-2-readiness", "CMMC Level 2 readiness consulting"),
    link("/blog/cmmc-level-2-compliance-checklist-2025", "CMMC Level 2 compliance checklist"),
    link("/lp/cmmc-level-2-readiness", "Assess your CMMC Level 2 readiness"),
  ],

  // CMMC blog
  "/blog": [
    link("/knowledge-hub", "CMMC Knowledge Hub guides"),
    link("/faq", "CMMC FAQ"),
  ],
  "/blog/cmmc-level-2-compliance-checklist-2025": [
    link("/knowledge-hub/evidence-mapping", "Mapping evidence to each NIST 800-171 control"),
    link("/blog/cmmc-level-2-small-business-guide", "CMMC Level 2 for small businesses"),
    link("/services/cmmc-readiness-sprint", "Fixed-scope CMMC readiness sprint"),
  ],
  "/blog/how-to-improve-sprs-score-fast": [
    link("/knowledge-hub/sprs-score", "How SPRS scoring works"),
    link("/blog/cmmc-poam-guide-what-assessors-want", "Writing a POA&M assessors accept"),
  ],
  "/blog/what-to-expect-c3pao-assessment": [
    link("/knowledge-hub/certification-process", "The CMMC certification process step by step"),
    link("/blog/cmmc-poam-guide-what-assessors-want", "What assessors look for in a POA&M"),
    link("/cmmc-readiness-sprint-guide", "Prepare with a 4-week readiness sprint"),
  ],
  "/blog/what-counts-as-cui-plain-english-guide": [
    link("/knowledge-hub/what-is-cmmc", "What is CMMC?"),
    link("/services/cmmc-scoping", "Define your CUI boundary with CMMC scoping"),
    link("/blog/gcc-high-vs-m365-commercial-cmmc", "Where CUI can live: GCC High vs M365 Commercial"),
  ],
  "/blog/cmmc-level-2-small-business-guide": [
    link("/knowledge-hub/cmmc-levels", "CMMC Level 1 vs Level 2"),
    link("/pricing", "CMMC readiness pricing for small contractors"),
    link("/blog/cmmc-consultant-red-flags", "Red flags when hiring a CMMC consultant"),
  ],
  "/blog/gcc-high-vs-m365-commercial-cmmc": [
    link("/solutions/cloud-security", "Azure and GCC High cloud security consulting"),
    link("/blog/what-counts-as-cui-plain-english-guide", "What counts as CUI?"),
  ],
  "/blog/cmmc-poam-guide-what-assessors-want": [
    link("/knowledge-hub/sprs-score", "How POA&M items affect your SPRS score"),
    link("/blog/what-to-expect-c3pao-assessment", "What to expect in a C3PAO assessment"),
  ],
  "/blog/cmmc-consultant-red-flags": [
    link("/why-defenseeye", "How DefenseEye approaches CMMC work"),
    link("/pricing", "CMMC readiness pricing"),
    link("/blog/cmmc-level-2-small-business-guide", "CMMC Level 2 for small businesses"),
  ],

  // Company, supplier, and procurement
  "/supplier-readiness": [
    link("/datasheets/supplier-readiness", "Supplier readiness datasheet"),
    link("/microsoft-ecosystem", "Microsoft ecosystem experience"),
    link("/lp/microsoft-supplier-ai-consulting", "Minority-owned supplier support for Microsoft-centered programs"),
  ],
  "/why-defenseeye": [
    link("/delivery-model", "How DefenseEye delivers engagements"),
    link("/representative-engagements", "Representative engagement types"),
    link("/supplier-readiness", "Supplier facts and certifications"),
  ],
  "/capability-statement": [
    link("/datasheets", "DefenseEye datasheets"),
    link("/delivery-model", "Engagement formats"),
  ],
  "/delivery-model": [
    link("/representative-engagements", "Representative engagement types"),
    link("/pricing", "CMMC readiness pricing and engagement options"),
    link("/capability-statement", "Capability statement"),
  ],
  "/representative-engagements": [
    link("/delivery-model", "How engagements are structured"),
    link("/why-defenseeye", "Why DefenseEye"),
  ],
  "/datasheets": [
    link("/capability-statement", "Capability statement"),
  ],
  "/datasheets/secure-ai-adoption": [
    link("/secure-ai-adoption", "Secure AI adoption services"),
    link("/solutions/ai-governance", "AI governance consulting"),
  ],
  "/datasheets/cmmc-compliance-automation": [
    link("/cmmc-compliance-automation", "CMMC & compliance automation services"),
    link("/services/cmmc-readiness-sprint", "Fixed-scope CMMC readiness sprint"),
  ],
  "/datasheets/cmmclens": [
    link("/cmmclens", "CMMCLens product page and demo"),
    link("/solutions/cmmclens-platform", "CMMCLens platform overview"),
  ],
  "/datasheets/microsoft-copilot-readiness": [
    link("/solutions/microsoft-copilot-readiness", "Microsoft Copilot readiness consulting"),
    link("/microsoft-ecosystem", "Microsoft ecosystem experience"),
    link("/lp/microsoft-copilot-readiness", "Microsoft Copilot readiness assessment"),
  ],
  "/datasheets/supplier-readiness": [
    link("/supplier-readiness", "Supplier readiness overview"),
    link("/capability-statement", "Capability statement"),
    link("/lp/microsoft-supplier-ai-consulting", "Supplier capability review for Microsoft-centered environments"),
  ],
  "/contact": [
    link("/secure-ai-adoption", "Secure AI readiness consultation"),
    link("/cmmc-compliance-automation", "CMMC readiness and automation"),
    link("/supplier-readiness", "Supplier and partnership information"),
  ],
};

/** Curated related links, excluding the page itself and its direct parent. */
export function getRelatedLinks(routePath: string): ArchitectureLink[] {
  const parent = ROUTE_PARENTS[routePath];
  return (RELATED_LINKS[routePath] ?? []).filter((item) => item.href !== routePath && item.href !== parent);
}
