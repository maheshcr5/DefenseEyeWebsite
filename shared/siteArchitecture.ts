// Hub-and-spoke information architecture for defenseeye.ai.
//
// - ROUTE_PARENTS assigns each public page to the hub (or parent) it belongs under.
//   It drives visible breadcrumbs, BreadcrumbList schema, the "back to hub" link,
//   and each hub's list of the pages in its section.
// - RELATED_LINKS (shared/relatedLinks.ts) holds hand-picked contextual links
//   between pages that answer related buyer questions. It lives in its own module
//   so the global navigation bundle does not carry it.
// - FOOTER_NAVIGATION is the sitewide footer, shared by the React Footer and the
//   server-rendered fallback so crawlers that do and do not run JavaScript see the
//   same link graph.
//
// Only add a link when a reader of the source page would plausibly want the
// destination next. Do not add links just to raise inlink counts.

export type ArchitectureLink = {
  label: string;
  href: string;
  description?: string;
};

export type FooterGroup = {
  title: string;
  links: ArchitectureLink[];
};

// Short names used for breadcrumbs and section lists.
export const ROUTE_NAMES: Record<string, string> = {
  "/": "Home",
  "/secure-ai-adoption": "Secure AI Adoption",
  "/solutions/ai-governance": "AI Governance",
  "/solutions/ai-transformation": "AI Transformation",
  "/solutions/ai-security": "AI Security",
  "/solutions/microsoft-copilot-readiness": "Microsoft Copilot Readiness",
  "/industries/financial-services-credit-unions": "Financial Services & Credit Unions",
  "/solutions/cybersecurity-risk": "Cybersecurity Risk",
  "/attacksense": "AttackSense",
  "/attacksense/docs": "AttackSense Quick Start Guide",
  "/solutions/cloud-security": "Microsoft Cloud Security",
  "/microsoft-ecosystem": "Microsoft Ecosystem Experience",
  "/cmmc-compliance-automation": "CMMC & Compliance Automation",
  "/industries/defense-industrial-base": "Defense Industrial Base",
  "/cmmc": "CMMC Readiness Overview",
  "/cmmc-level-2-readiness": "CMMC Level 2 Readiness",
  "/services/cmmc-readiness-sprint": "Fixed-Scope CMMC Readiness Sprint",
  "/services/cmmc-scoping": "CMMC Scoping",
  "/cmmc-evidence-automation": "CMMC Evidence Automation",
  "/nist-800-171": "NIST SP 800-171 Readiness",
  "/cmmc-readiness-sprint-guide": "4-Week CMMC Readiness Sprint Guide",
  "/solutions/compliance-automation": "Compliance Automation Consulting",
  "/cmmclens": "CMMCLens",
  "/solutions/cmmclens-platform": "CMMCLens Platform Overview",
  "/pricing": "CMMC Readiness Pricing",
  "/faq": "CMMC FAQ",
  "/knowledge-hub": "CMMC Knowledge Hub",
  "/knowledge-hub/what-is-cmmc": "What Is CMMC?",
  "/knowledge-hub/cmmc-levels": "CMMC Level 1 vs Level 2",
  "/knowledge-hub/evidence-mapping": "NIST 800-171 Evidence Mapping",
  "/knowledge-hub/sprs-score": "SPRS Score Guide",
  "/knowledge-hub/certification-process": "CMMC Certification Process",
  "/blog": "CMMC Blog",
  "/blog/cmmc-level-2-compliance-checklist-2025": "CMMC Level 2 Compliance Checklist",
  "/blog/how-to-improve-sprs-score-fast": "How to Improve Your SPRS Score",
  "/blog/what-to-expect-c3pao-assessment": "What to Expect in a C3PAO Assessment",
  "/blog/what-counts-as-cui-plain-english-guide": "What Counts as CUI?",
  "/blog/cmmc-level-2-small-business-guide": "CMMC Level 2 for Small Businesses",
  "/blog/gcc-high-vs-m365-commercial-cmmc": "GCC High vs M365 Commercial",
  "/blog/cmmc-poam-guide-what-assessors-want": "CMMC POA&M Guide",
  "/blog/cmmc-consultant-red-flags": "CMMC Consultant Red Flags",
  "/insights/what-is-cmmc-level-2": "What Is CMMC Level 2?",
  "/insights/what-is-rmf-readiness": "What Is RMF Readiness?",
  "/insights/what-is-nist-ai-rmf": "What Is the NIST AI RMF?",
  "/insights/ai-automated-evidence-collection": "AI-Automated Evidence Collection",
  "/insights/implement-ai-governance": "How to Implement AI Governance",
  "/insights/security-copilot-cybersecurity-operations": "Security Copilot for Security Operations",
  "/insights/continuous-compliance-monitoring": "Continuous Compliance Monitoring",
  "/insights/ai-audit-readiness": "AI and Audit Readiness",
  "/why-defenseeye": "Why DefenseEye",
  "/supplier-readiness": "Supplier Readiness",
  "/capability-statement": "Capability Statement",
  "/delivery-model": "Delivery Model",
  "/representative-engagements": "Representative Engagements",
  "/datasheets": "Datasheets",
  "/datasheets/secure-ai-adoption": "Secure AI Adoption Datasheet",
  "/datasheets/cmmc-compliance-automation": "CMMC & Compliance Automation Datasheet",
  "/datasheets/cmmclens": "CMMCLens Product Sheet",
  "/datasheets/microsoft-copilot-readiness": "Microsoft Copilot Readiness Datasheet",
  "/datasheets/supplier-readiness": "Supplier Readiness Datasheet",
  "/contact": "Contact",
  "/support": "Support",
  "/privacy-policy": "Privacy Policy",
  "/terms": "Terms of Service",
  "/lp/secure-ai-adoption": "Secure AI Adoption Consulting",
  "/lp/ai-governance-consulting": "AI Governance Readiness Assessment",
  "/lp/microsoft-copilot-readiness": "Microsoft Copilot Readiness Assessment",
  "/lp/cmmc-level-2-readiness": "CMMC Level 2 Readiness Assessment",
  "/lp/cmmc-compliance-automation": "CMMC Compliance Automation Sprint",
  "/lp/cmmc-evidence-automation": "CMMC Evidence Automation",
  "/lp/cmmclens-demo": "CMMCLens Demo",
  "/lp/microsoft-supplier-ai-consulting": "Minority-Owned AI & Cybersecurity Supplier",
  "/lp/azure-cloud-security": "Azure Cloud Security Review",
  "/lp/compliance-automation": "Compliance Automation",
};

// Hubs: "/" (home), "/secure-ai-adoption", "/solutions/cybersecurity-risk",
// "/cmmc-compliance-automation", "/knowledge-hub", "/blog", "/supplier-readiness",
// and "/datasheets". Every other page sits under one of them.
export const ROUTE_PARENTS: Record<string, string> = {
  "/secure-ai-adoption": "/",
  "/solutions/cybersecurity-risk": "/",
  "/cmmc-compliance-automation": "/",
  "/supplier-readiness": "/",
  "/why-defenseeye": "/",
  "/contact": "/",
  "/support": "/",
  "/privacy-policy": "/",
  "/terms": "/",

  // Secure AI hub
  "/solutions/ai-governance": "/secure-ai-adoption",
  "/solutions/ai-transformation": "/secure-ai-adoption",
  "/solutions/ai-security": "/secure-ai-adoption",
  "/solutions/microsoft-copilot-readiness": "/secure-ai-adoption",
  "/industries/financial-services-credit-unions": "/secure-ai-adoption",
  "/insights/implement-ai-governance": "/solutions/ai-governance",
  "/insights/what-is-nist-ai-rmf": "/solutions/ai-governance",

  // Cybersecurity and Microsoft cloud hub
  "/attacksense": "/solutions/cybersecurity-risk",
  "/attacksense/docs": "/attacksense",
  "/solutions/cloud-security": "/solutions/cybersecurity-risk",
  "/insights/security-copilot-cybersecurity-operations": "/solutions/cybersecurity-risk",

  // CMMC and compliance automation hub
  "/industries/defense-industrial-base": "/cmmc-compliance-automation",
  "/cmmc": "/cmmc-compliance-automation",
  "/cmmc-level-2-readiness": "/cmmc-compliance-automation",
  "/nist-800-171": "/cmmc-compliance-automation",
  "/services/cmmc-readiness-sprint": "/cmmc-compliance-automation",
  "/services/cmmc-scoping": "/cmmc-compliance-automation",
  "/cmmc-evidence-automation": "/cmmc-compliance-automation",
  "/solutions/compliance-automation": "/cmmc-compliance-automation",
  "/cmmclens": "/cmmc-compliance-automation",
  "/pricing": "/cmmc-compliance-automation",
  "/faq": "/cmmc-compliance-automation",
  "/knowledge-hub": "/",
  "/blog": "/",
  "/solutions/cmmclens-platform": "/cmmclens",
  "/cmmc-readiness-sprint-guide": "/services/cmmc-readiness-sprint",
  "/insights/ai-automated-evidence-collection": "/solutions/compliance-automation",
  "/insights/continuous-compliance-monitoring": "/solutions/compliance-automation",
  "/insights/ai-audit-readiness": "/solutions/compliance-automation",
  "/insights/what-is-rmf-readiness": "/solutions/compliance-automation",

  // CMMC Knowledge Hub
  "/knowledge-hub/what-is-cmmc": "/knowledge-hub",
  "/knowledge-hub/cmmc-levels": "/knowledge-hub",
  "/knowledge-hub/evidence-mapping": "/knowledge-hub",
  "/knowledge-hub/sprs-score": "/knowledge-hub",
  "/knowledge-hub/certification-process": "/knowledge-hub",
  "/insights/what-is-cmmc-level-2": "/knowledge-hub",

  // CMMC blog
  "/blog/cmmc-level-2-compliance-checklist-2025": "/blog",
  "/blog/how-to-improve-sprs-score-fast": "/blog",
  "/blog/what-to-expect-c3pao-assessment": "/blog",
  "/blog/what-counts-as-cui-plain-english-guide": "/blog",
  "/blog/cmmc-level-2-small-business-guide": "/blog",
  "/blog/gcc-high-vs-m365-commercial-cmmc": "/blog",
  "/blog/cmmc-poam-guide-what-assessors-want": "/blog",
  "/blog/cmmc-consultant-red-flags": "/blog",

  // Company, supplier, and procurement hub
  "/capability-statement": "/supplier-readiness",
  "/delivery-model": "/supplier-readiness",
  "/representative-engagements": "/supplier-readiness",
  "/microsoft-ecosystem": "/supplier-readiness",
  "/datasheets": "/supplier-readiness",
  "/datasheets/secure-ai-adoption": "/datasheets",
  "/datasheets/cmmc-compliance-automation": "/datasheets",
  "/datasheets/cmmclens": "/datasheets",
  "/datasheets/microsoft-copilot-readiness": "/datasheets",
  "/datasheets/supplier-readiness": "/datasheets",

  // Campaign landing pages (noindex) sit under the solution they promote.
  "/lp/secure-ai-adoption": "/secure-ai-adoption",
  "/lp/ai-governance-consulting": "/solutions/ai-governance",
  "/lp/microsoft-copilot-readiness": "/solutions/microsoft-copilot-readiness",
  "/lp/cmmc-level-2-readiness": "/cmmc-level-2-readiness",
  "/lp/cmmc-compliance-automation": "/cmmc-compliance-automation",
  "/lp/cmmc-evidence-automation": "/cmmc-evidence-automation",
  "/lp/cmmclens-demo": "/cmmclens",
  "/lp/microsoft-supplier-ai-consulting": "/supplier-readiness",
  "/lp/azure-cloud-security": "/solutions/cloud-security",
  "/lp/compliance-automation": "/solutions/compliance-automation",
};

const link = (href: string, label: string, description?: string): ArchitectureLink => ({ href, label, description });

export const FOOTER_NAVIGATION: FooterGroup[] = [
  {
    title: "Secure AI",
    links: [
      link("/secure-ai-adoption", "Secure AI Adoption"),
      link("/solutions/ai-governance", "AI Governance"),
      link("/solutions/ai-security", "AI Security"),
      link("/solutions/ai-transformation", "AI Transformation"),
      link("/solutions/microsoft-copilot-readiness", "Microsoft Copilot Readiness"),
    ],
  },
  {
    title: "Cybersecurity & Cloud",
    links: [
      link("/solutions/cybersecurity-risk", "Cybersecurity Risk"),
      link("/attacksense", "AttackSense"),
      link("/solutions/cloud-security", "Microsoft Cloud Security"),
      link("/microsoft-ecosystem", "Microsoft Ecosystem"),
    ],
  },
  {
    title: "CMMC & Compliance",
    links: [
      link("/cmmc-compliance-automation", "CMMC Compliance Automation"),
      link("/cmmclens", "CMMCLens"),
      link("/services/cmmc-scoping", "CMMC Scoping"),
      link("/services/cmmc-readiness-sprint", "CMMC Readiness Sprint"),
      link("/solutions/compliance-automation", "Compliance Automation"),
      link("/pricing", "Pricing"),
    ],
  },
  {
    title: "Industries",
    links: [
      link("/industries/financial-services-credit-unions", "Financial Services & Credit Unions"),
      link("/industries/defense-industrial-base", "Defense Industrial Base"),
    ],
  },
  {
    title: "Resources",
    links: [
      link("/knowledge-hub", "Knowledge Hub"),
      link("/blog", "CMMC Blog"),
      link("/faq", "CMMC FAQ"),
      link("/datasheets", "Datasheets"),
      link("/capability-statement", "Capability Statement"),
    ],
  },
  {
    title: "Company",
    links: [
      link("/why-defenseeye", "Why DefenseEye"),
      link("/supplier-readiness", "Supplier Readiness"),
      link("/delivery-model", "Delivery Model"),
      link("/representative-engagements", "Representative Engagements"),
      link("/contact", "Contact"),
      link("/support", "Support"),
      link("/privacy-policy", "Privacy Policy"),
      link("/terms", "Terms of Service"),
    ],
  },
];

export function getRouteName(routePath: string) {
  return ROUTE_NAMES[routePath] ?? null;
}

/** Ancestors from Home down to (and including) the given path. */
export function getBreadcrumbTrail(routePath: string): ArchitectureLink[] {
  const trail: ArchitectureLink[] = [];
  const seen = new Set<string>();
  let current: string | undefined = routePath;
  while (current && !seen.has(current)) {
    seen.add(current);
    trail.unshift({ href: current, label: ROUTE_NAMES[current] ?? current });
    if (current === "/") break;
    current = ROUTE_PARENTS[current] ?? "/";
  }
  return trail;
}

/** Pages whose parent is the given hub, in registry order. */
export function getSectionPages(hubPath: string): ArchitectureLink[] {
  return Object.entries(ROUTE_PARENTS)
    .filter(([childPath, parent]) => parent === hubPath && !childPath.startsWith("/lp/"))
    .map(([childPath]) => ({ href: childPath, label: ROUTE_NAMES[childPath] ?? childPath }));
}
