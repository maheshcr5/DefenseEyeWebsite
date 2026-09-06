export const SITE_ORIGIN = "https://defenseeye.ai";
export const ROUTE_SCHEMA_SCRIPT_ID = "defenseeye-route-schema";

export type StructuredDataKind =
  | "home"
  | "service"
  | "software"
  | "collection"
  | "about"
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
};

export type SitemapEntry = {
  path: string;
  lastmod: string;
  changefreq: "weekly" | "monthly";
  priority: string;
};

const materialSeoUpdateDate = "2026-08-31";
const customerJourneyUpdateDate = "2026-09-01";
const industryPagesUpdateDate = "2026-09-04";
const whyDefenseEyeUpdateDate = "2026-09-05";

export const TIER_1_ROUTES: SeoRoute[] = [
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

export const TIER_1_PATHS = TIER_1_ROUTES.map((route) => route.path);

export function getSeoRoute(routePath: string) {
  return TIER_1_ROUTES.find((route) => route.path === normalizePath(routePath)) ?? null;
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

function renderLinkList(links: SeoLink[] = []) {
  if (links.length === 0) return "";
  return `<ul>${links.map((link) => `<li><a href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a></li>`).join("")}</ul>`;
}

export function renderRouteFallbackHtml(route: SeoRoute) {
  return `
      <!-- Route-specific no-JavaScript content generated from the SEO route registry. React replaces this on load. -->
      <div class="de-pr" data-seo-route="${escapeAttribute(route.path)}">
        <nav>
          <a class="brand" href="${SITE_ORIGIN}">DefenseEye.ai</a>
          <p style="margin-top:.6rem;font-size:.85rem;line-height:1.6">
            ${route.links
              .slice(0, 5)
              .map((link) => `<a class="klink" href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a>`)
              .join(" · ")}
          </p>
        </nav>
        <main>
          ${route.eyebrow ? `<p class="eyebrow">${escapeHtml(route.eyebrow)}</p>` : ""}
          <h1>${escapeHtml(route.h1)}</h1>
          <p class="lead">${escapeHtml(route.summary)}</p>
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
          <section>
            <h2>Related DefenseEye Resources</h2>
            ${renderLinkList(route.links)}
          </section>
        </main>
      </div>`;
}

export function buildRouteSchemas(route: SeoRoute) {
  const canonical = canonicalUrl(route.path);
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: "DefenseEye",
    alternateName: "DefenseEye.ai",
    url: SITE_ORIGIN,
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      ...(route.path === "/"
        ? []
        : [{ "@type": "ListItem", position: 2, name: route.h1, item: canonical }]),
    ],
  };

  if (route.schemaKind === "home") {
    return [
      {
        "@context": "https://schema.org",
        ...organization,
        description:
          "DefenseEye is a practitioner-led secure agentic AI, cybersecurity, responsible AI governance, Microsoft cloud, CMMC readiness, and compliance automation supplier.",
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
    about: route.topics.map((name) => ({ "@type": "Thing", name })),
  };

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
        applicationCategory:
          route.path === "/cmmclens" ? "Cybersecurity compliance automation" : "Cybersecurity operations",
        operatingSystem: "Web",
      },
      { "@context": "https://schema.org", ...breadcrumb },
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
      { "@context": "https://schema.org", ...breadcrumb },
    ];
  }

  return [webPage, { "@context": "https://schema.org", ...breadcrumb }];
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
  { path: "/knowledge-hub/what-is-cmmc", lastmod: "2026-04-04", changefreq: "monthly", priority: "0.9" },
  { path: "/knowledge-hub/cmmc-levels", lastmod: "2026-04-04", changefreq: "monthly", priority: "0.9" },
  { path: "/knowledge-hub/evidence-mapping", lastmod: "2026-04-04", changefreq: "monthly", priority: "0.8" },
  { path: "/knowledge-hub/sprs-score", lastmod: "2026-04-04", changefreq: "monthly", priority: "0.9" },
  { path: "/knowledge-hub/certification-process", lastmod: "2026-04-04", changefreq: "monthly", priority: "0.9" },
  { path: "/blog/cmmc-level-2-compliance-checklist-2025", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/how-to-improve-sprs-score-fast", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/what-to-expect-c3pao-assessment", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/what-counts-as-cui-plain-english-guide", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/cmmc-level-2-small-business-guide", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/gcc-high-vs-m365-commercial-cmmc", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/cmmc-poam-guide-what-assessors-want", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/cmmc-consultant-red-flags", lastmod: "2026-04-01", changefreq: "monthly", priority: "0.8" },
  { path: "/solutions/cybersecurity-risk", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.8" },
  { path: "/solutions/compliance-automation", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.8" },
  { path: "/solutions/cloud-security", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.8" },
  { path: "/solutions/cmmclens-platform", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.8" },
  { path: "/delivery-model", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/representative-engagements", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/microsoft-ecosystem", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
  { path: "/cmmc-readiness-sprint", lastmod: "2026-06-26", changefreq: "monthly", priority: "0.8" },
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
];

export const SITEMAP_ENTRIES: SitemapEntry[] = [
  ...TIER_1_ROUTES.map(({ path, lastmod, changefreq, priority }) => ({ path, lastmod, changefreq, priority })),
  ...additionalSitemapEntries,
].sort((a, b) => canonicalUrl(a.path).localeCompare(canonicalUrl(b.path)));

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
