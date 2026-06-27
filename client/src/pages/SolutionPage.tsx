import { useEffect } from "react";
import { useLocation } from "wouter";
import { Activity, ArrowRight, BarChart3, Bot, CheckCircle2, ClipboardCheck, FileCheck, Network, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import { useSeo } from "@/hooks/useSeo";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";
const MARKETPLACE_URL = "https://marketplace.microsoft.com/en-us/search?search=CMMCLens";

type PageConfig = {
  eyebrow: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  icon: typeof Bot;
  summary: string;
  challenge: string;
  howHelps: string[];
  outcomes: string[];
  engagements: string[];
  frameworks: string[];
  deliverables: string[];
  why: string;
  faqs: Array<{ question: string; answer: string }>;
  cta: { label: string; href: string };
};

function page(config: PageConfig) {
  return config;
}

const commonFaq = {
  supplier: {
    question: "Does DefenseEye support supplier, subcontractor, and staff augmentation models?",
    answer:
      "Yes. DefenseEye is positioned to support advisory consulting, implementation projects, subcontracting, staff augmentation, fractional leadership, and platform-enabled consulting models.",
  },
};

const pages: Record<string, PageConfig> = {
  "/solutions/ai-transformation": page({
    eyebrow: "AI Transformation",
    title: "Secure AI Transformation Consulting",
    description:
      "DefenseEye helps organizations identify practical AI opportunities, prioritize use cases, prepare data and workflows, enable Copilot and Azure OpenAI, and measure operational value.",
    seoTitle: "AI Transformation Consulting and Adoption Roadmaps | DefenseEye",
    seoDescription:
      "AI transformation consulting for AI opportunity discovery, adoption roadmaps, Microsoft Copilot enablement, Azure OpenAI readiness, automation, data readiness, and value realization.",
    icon: Network,
    summary:
      "DefenseEye helps organizations identify practical AI opportunities, prioritize high-value use cases, prepare Microsoft and cloud environments, and implement AI adoption roadmaps with governance and security built in.",
    challenge:
      "AI programs often stall when experimentation is disconnected from governance, security, data readiness, and operational ownership.",
    howHelps: [
      "Identify AI opportunities across business, security, compliance, and operational workflows",
      "Prioritize use cases by value, feasibility, data readiness, risk, and implementation effort",
      "Create adoption roadmaps for Microsoft Copilot, Azure OpenAI, and business process automation",
      "Build governance-by-design into AI implementation planning",
    ],
    outcomes: [
      "Clearer AI investment priorities",
      "Reduced risk from ungoverned experimentation",
      "Workflow modernization tied to measurable operational value",
      "Stronger readiness for enterprise AI platforms",
    ],
    engagements: ["AI opportunity discovery", "AI adoption roadmap", "Copilot enablement planning", "Workflow automation assessment"],
    frameworks: ["NIST AI RMF", "Azure OpenAI", "Microsoft Copilot", "Data governance"],
    deliverables: ["Use-case inventory", "Prioritized roadmap", "Governance considerations", "Implementation plan", "Value measurement model"],
    why:
      "AI adoption creates durable value when it improves real work, protects sensitive data, and gives leaders a governed path from idea to operation.",
    cta: { label: "Plan a Secure AI Adoption Roadmap", href: "/contact?inquiry=ai-transformation" },
    faqs: [
      { question: "Where should organizations start with AI transformation?", answer: "Start by identifying workflows where AI can reduce manual effort, improve decision quality, or increase consistency, then prioritize by value, risk, feasibility, and data readiness." },
      { question: "How does DefenseEye avoid generic AI consulting?", answer: "DefenseEye focuses on implementation conditions: use-case value, data access, governance controls, security implications, ownership, and measurable operating outcomes." },
      commonFaq.supplier,
    ],
  }),
  "/solutions/ai-governance": page({
    eyebrow: "AI Governance",
    title: "AI Governance Consulting for Regulated Organizations",
    description:
      "DefenseEye helps organizations implement AI governance, responsible AI controls, human accountability, AI policy, model oversight, Copilot governance, and AI vendor risk practices.",
    seoTitle: "AI Governance and NIST AI RMF Consulting | DefenseEye",
    seoDescription:
      "AI governance consulting for NIST AI RMF, responsible AI, AI risk management, human accountability, model governance, policy development, and Copilot governance.",
    icon: Bot,
    summary:
      "DefenseEye helps organizations move from AI experimentation to governed adoption by implementing practical oversight, risk management, accountability, explainability, policy, and security controls.",
    challenge:
      "AI use is expanding faster than risk ownership, acceptable-use rules, data controls, vendor review, and human accountability practices.",
    howHelps: [
      "Align governance practices to NIST AI RMF and responsible AI operating practices",
      "Define AI policy, use-case review, oversight roles, and human accountability",
      "Assess shadow AI, AI vendor risk, model governance, and explainability needs",
      "Integrate Copilot governance with data protection, permissions, and security operations",
    ],
    outcomes: [
      "Clear AI decision rights and review criteria",
      "Improved explainability and accountability for AI-enabled workflows",
      "Reduced risk from unmanaged AI adoption and shadow AI",
      "Governance evidence that supports procurement and assurance reviews",
    ],
    engagements: ["AI governance readiness assessment", "AI policy and oversight model", "AI inventory and use-case review", "Copilot governance assessment"],
    frameworks: ["NIST AI RMF", "Responsible AI", "AI vendor risk", "Microsoft Purview"],
    deliverables: ["Governance model", "Policy outline", "Risk assessment approach", "AI inventory structure", "Oversight controls"],
    why:
      "AI governance matters because leaders need a practical way to approve AI use, monitor risk, preserve explainability, and keep humans accountable for consequential decisions.",
    cta: { label: "Discuss AI Governance Readiness", href: "/contact?inquiry=ai-governance" },
    faqs: [
      { question: "What is AI governance?", answer: "AI governance is the set of roles, policies, controls, oversight processes, and evidence used to manage AI systems responsibly and reduce AI-related risk." },
      { question: "How can organizations operationalize AI governance?", answer: "Start with AI inventory, risk ownership, policy development, oversight roles, lifecycle controls, monitoring practices, and evidence that shows governance is operating." },
      commonFaq.supplier,
    ],
  }),
  "/solutions/ai-security": page({
    eyebrow: "AI Security",
    title: "AI Security Consulting",
    description:
      "DefenseEye helps organizations reduce risks introduced by generative AI, LLMs, AI agents, sensitive data exposure, prompt injection, identity misuse, and inadequate monitoring.",
    seoTitle: "AI Security and Generative AI Risk Consulting | DefenseEye",
    seoDescription:
      "AI security consulting for generative AI risk assessments, LLM threat modeling, Azure AI security consulting, Copilot security, identity controls, and regulated AI adoption.",
    icon: ShieldCheck,
    summary:
      "DefenseEye helps organizations reduce risks introduced by generative AI, LLMs, AI agents, sensitive data exposure, prompt injection, identity misuse, and inadequate monitoring.",
    challenge:
      "Generative AI can expand access to sensitive data, introduce unclear outputs, and connect business workflows before security controls are ready.",
    howHelps: ["Assess AI threat modeling scenarios", "Review guardrails, logging, monitoring, access controls, and data protection", "Evaluate LLM workflows and AI agent risk", "Recommend secure AI adoption controls"],
    outcomes: ["Reduced AI-related security risk", "Clearer control priorities", "Better alignment between AI adoption and security operations", "Stronger readiness for regulated use cases"],
    engagements: ["Generative AI security assessment", "LLM threat modeling", "Copilot security review", "AI security architecture review"],
    frameworks: ["NIST AI RMF", "OWASP LLM Top 10", "Microsoft Entra", "Defender", "Sentinel", "Purview"],
    deliverables: ["Risk findings", "Threat scenarios", "Security recommendations", "Control roadmap"],
    why: "AI security makes adoption more durable by reducing avoidable risk before sensitive workflows and enterprise users depend on AI systems.",
    cta: { label: "Assess AI Security Risk", href: "/contact?inquiry=ai-security" },
    faqs: [
      { question: "What does an AI security assessment cover?", answer: "It typically covers data exposure, identity and permissions, prompt and output risks, integration paths, logging, monitoring, model behavior, and governance controls." },
      commonFaq.supplier,
    ],
  }),
  "/solutions/microsoft-copilot-enablement": page({
    eyebrow: "Microsoft Copilot Enablement",
    title: "Microsoft Copilot readiness with governance, security, and adoption planning",
    description:
      "DefenseEye helps organizations prepare Microsoft 365 and security environments for Copilot adoption with data governance, access controls, user workflows, and oversight.",
    seoTitle: "Microsoft Copilot Governance Consulting and Readiness | DefenseEye",
    seoDescription:
      "Microsoft Copilot governance consulting for permissions, data readiness, Microsoft 365, Purview, Entra, Defender, Security Copilot readiness, adoption planning, and oversight.",
    icon: Sparkles,
    summary:
      "DefenseEye supports Copilot enablement as more than a license rollout: data readiness, permissions, governance, security controls, user workflows, and operational measurement.",
    challenge:
      "Copilot can surface overshared information, reveal weak data governance, and create AI usage patterns before oversight is mature.",
    howHelps: ["Review Microsoft 365 permissions and data exposure", "Assess Purview, Entra, Defender, and governance alignment", "Define Copilot use cases and adoption controls", "Create a readiness roadmap"],
    outcomes: ["Lower data exposure risk", "More controlled adoption", "Clearer user guidance", "Improved executive confidence in rollout readiness"],
    engagements: ["Copilot readiness assessment", "Copilot governance model", "Security Copilot readiness", "Microsoft 365 data exposure review"],
    frameworks: ["Microsoft 365", "Copilot", "Security Copilot", "Entra", "Purview", "Defender", "Sentinel"],
    deliverables: ["Readiness findings", "Governance recommendations", "Use-case priorities", "Rollout controls"],
    why: "Copilot creates value when data, access, workflows, and accountability are ready before broad deployment.",
    cta: { label: "Assess Copilot Readiness", href: "/contact?inquiry=microsoft-copilot-readiness" },
    faqs: [
      { question: "How is Copilot enablement different from buying licenses?", answer: "Enablement includes data governance, permissions, security controls, use-case guidance, adoption planning, and oversight. Licenses alone do not create governed value." },
      commonFaq.supplier,
    ],
  }),
  "/solutions/microsoft-copilot-readiness": page({
    eyebrow: "Microsoft Copilot Readiness",
    title: "Microsoft Copilot Readiness Consulting",
    description:
      "DefenseEye helps organizations prepare Microsoft 365, identity, data governance, privacy, security, and user adoption controls before Copilot usage expands.",
    seoTitle: "Microsoft Copilot Readiness Consulting | DefenseEye",
    seoDescription:
      "Microsoft Copilot readiness consulting for governance, permissions, data exposure, Microsoft 365, Purview, Entra, Defender, privacy, security, and adoption planning.",
    icon: Sparkles,
    summary:
      "DefenseEye helps organizations assess whether Microsoft 365, identity, information governance, and operating controls are ready for safer Copilot adoption.",
    challenge:
      "Copilot can expose overshared content, weak permissions, unclear retention practices, and unmanaged AI usage if readiness work is skipped.",
    howHelps: [
      "Review Microsoft 365 permissions, sensitive data exposure, and information governance",
      "Assess Entra, Purview, Defender, Sentinel, and policy alignment",
      "Define Copilot governance, adoption guardrails, and human accountability expectations",
      "Create a practical readiness roadmap for staged deployment",
    ],
    outcomes: [
      "Reduced data exposure risk",
      "Clearer Copilot governance and adoption guardrails",
      "Better alignment between productivity goals and security controls",
      "Improved readiness for enterprise and regulated AI adoption",
    ],
    engagements: ["Copilot readiness assessment", "Microsoft 365 data exposure review", "Copilot governance model", "Security Copilot readiness planning"],
    frameworks: ["Microsoft 365", "Microsoft Copilot", "Microsoft Entra", "Microsoft Purview", "Microsoft Defender", "Microsoft Sentinel"],
    deliverables: ["Readiness findings", "Governance recommendations", "Adoption guardrails", "Risk-prioritized roadmap"],
    why:
      "Copilot readiness helps organizations adopt AI tools with clearer ownership, data protection, security monitoring, and accountable use.",
    cta: { label: "Assess Copilot Readiness", href: "/contact?inquiry=microsoft-copilot-readiness" },
    faqs: [
      { question: "What should be reviewed before Microsoft Copilot rollout?", answer: "Organizations should review permissions, overshared content, sensitive data handling, identity controls, user guidance, logging, governance workflows, and adoption priorities." },
      { question: "Does Copilot readiness include AI governance?", answer: "Yes. Copilot readiness should include AI use policies, accountability expectations, risk review, data governance, and controls for responsible adoption." },
      commonFaq.supplier,
    ],
  }),
  "/solutions/cybersecurity-risk": page({
    eyebrow: "Cybersecurity & Risk",
    title: "Cybersecurity and Risk Consulting",
    description:
      "DefenseEye helps regulated organizations evaluate cybersecurity risk, prioritize remediation, improve visibility, and prepare for customer, supplier, and audit expectations.",
    seoTitle: "Cybersecurity Risk Consulting for Regulated Environments | DefenseEye",
    seoDescription:
      "Cybersecurity and risk consulting for regulated industries, federal contractors, identity controls, threat visibility, remediation planning, and compliance preparedness.",
    icon: Activity,
    summary:
      "DefenseEye helps regulated organizations evaluate cybersecurity risk, prioritize remediation, improve visibility, and prepare for customer, supplier, and audit expectations.",
    challenge: "Security programs often have tool data, findings, and compliance requirements without a clear operating view of risk and remediation priorities.",
    howHelps: ["Review control and risk posture", "Prioritize remediation by business impact", "Align evidence to compliance requirements", "Improve reporting for leadership and assurance needs"],
    outcomes: ["Clearer risk visibility", "Prioritized remediation", "Improved compliance preparedness", "Better leadership reporting"],
    engagements: ["Cybersecurity risk assessment", "Security dashboard implementation", "Identity controls review", "Remediation roadmap"],
    frameworks: ["NIST CSF", "NIST SP 800-171", "RMF", "FedRAMP", "Zero Trust"],
    deliverables: ["Risk register", "Control findings", "Remediation roadmap", "Dashboard requirements"],
    why: "Risk-informed cybersecurity helps teams focus limited time on the issues that matter most to operations, customers, supplier reviews, and assurance expectations.",
    cta: { label: "Assess Cybersecurity Risk", href: "/contact?inquiry=cybersecurity-risk" },
    faqs: [{ question: "How does DefenseEye support cybersecurity readiness?", answer: "DefenseEye reviews controls, risk themes, identity and cloud posture, evidence, and remediation priorities to improve readiness and operational visibility." }, commonFaq.supplier],
  }),
  "/solutions/compliance-automation": page({
    eyebrow: "Compliance Automation",
    title: "Compliance Automation Consulting",
    description:
      "DefenseEye helps organizations reduce manual compliance work through evidence automation, control mapping, documentation support, dashboards, and readiness workflows.",
    seoTitle: "Compliance Evidence Automation and Readiness Consulting | DefenseEye",
    seoDescription:
      "Compliance evidence automation for CMMC Level 2 readiness automation, NIST SP 800-171 compliance automation, control mapping, documentation preparation, and audit readiness.",
    icon: FileCheck,
    summary:
      "DefenseEye helps compliance teams reduce manual evidence collection and improve traceability through workflow design, control mapping, automation planning, and platform-enabled consulting.",
    challenge: "Manual evidence work slows readiness, creates inconsistent documentation, and makes leadership visibility difficult.",
    howHelps: ["Map evidence sources to controls", "Identify automation opportunities", "Design readiness workflows and dashboards", "Assess CMMCLens fit when relevant"],
    outcomes: ["Reduced manual preparation effort", "Improved evidence traceability", "More consistent documentation", "Better audit and supplier readiness"],
    engagements: ["Evidence automation implementation", "Control mapping design", "SSP and policy automation", "Compliance dashboard implementation"],
    frameworks: ["CMMC", "NIST SP 800-171", "FedRAMP", "RMF", "NIST AI RMF"],
    deliverables: ["Evidence map", "Automation design", "Workflow backlog", "Dashboard requirements", "CMMCLens fit assessment"],
    why: "Compliance automation improves readiness by making evidence easier to find, explain, refresh, and connect to control expectations.",
    cta: { label: "Automate Compliance Readiness", href: "/contact?inquiry=compliance-automation" },
    faqs: [
      { question: "How does AI automate compliance evidence collection?", answer: "AI and workflow automation can map artifacts to controls, organize evidence, identify gaps, draft documentation, and improve traceability for human review." },
      commonFaq.supplier,
    ],
  }),
  "/solutions/cloud-security": page({
    eyebrow: "Cloud Security",
    title: "Microsoft Cloud Security and Compliance Consulting",
    description:
      "DefenseEye helps teams strengthen Azure, Azure Government, GCC High, Microsoft 365, identity, Zero Trust, monitoring, and compliance-aligned cloud security.",
    seoTitle: "Azure Cloud Security and GCC High Compliance Consulting | DefenseEye",
    seoDescription:
      "Azure Government compliance consulting, GCC High security and compliance, Microsoft Entra, Defender, Sentinel, Purview, Azure security, and regulated cloud security architecture.",
    icon: Network,
    summary:
      "DefenseEye helps organizations strengthen Microsoft cloud environments through secure architecture, identity controls, security monitoring, compliance alignment, and governance.",
    challenge: "Regulated cloud environments need secure architecture, visibility, identity controls, and evidence without slowing modernization.",
    howHelps: ["Review Azure and Microsoft 365 security posture", "Assess Entra, Defender, Sentinel, and Purview alignment", "Evaluate GCC High and Azure Government patterns", "Prioritize secure modernization actions"],
    outcomes: ["Improved cloud security posture", "Stronger identity and monitoring controls", "Better regulated environment readiness", "Clearer modernization priorities"],
    engagements: ["Azure security posture review", "GCC High readiness review", "Identity controls review", "Cloud compliance architecture assessment"],
    frameworks: ["Azure", "Azure Government", "GCC High", "Entra", "Defender", "Sentinel", "Purview", "Zero Trust"],
    deliverables: ["Security posture findings", "Architecture recommendations", "Remediation roadmap", "Evidence considerations"],
    why: "Cloud security is foundational for regulated AI adoption, compliance preparedness, and enterprise supplier confidence.",
    cta: { label: "Review Cloud Security Readiness", href: "/contact?inquiry=cloud-security" },
    faqs: [{ question: "How can Microsoft cloud environments support regulated AI adoption?", answer: "They can support regulated AI adoption through identity controls, data governance, security monitoring, policy management, logging, and compliance-aligned architecture." }, commonFaq.supplier],
  }),
  "/solutions/cmmclens-platform": page({
    eyebrow: "CMMCLens Platform",
    title: "CMMCLens evidence automation for compliance readiness",
    description:
      "CMMCLens is DefenseEye's flagship compliance automation platform for evidence collection, control traceability, readiness monitoring, SSP support, and policy automation.",
    seoTitle: "CMMCLens Compliance Automation Platform | DefenseEye",
    seoDescription:
      "CMMCLens supports CMMC Level 2 readiness, NIST SP 800-171 alignment, automated evidence collection, continuous readiness, gap identification, SSP generation, and policy automation.",
    icon: BarChart3,
    summary:
      "CMMCLens supports evidence automation, continuous readiness, executive visibility, and compliance traceability within DefenseEye's broader AI governance, cybersecurity, and compliance automation portfolio.",
    challenge: "Readiness programs often rely on fragmented artifacts, manual evidence work, and inconsistent documentation.",
    howHelps: ["Automate evidence collection", "Support NIST SP 800-171 and CMMC Level 2 traceability", "Identify gaps and remediation workflows", "Support AI-assisted SSP and policy generation"],
    outcomes: ["Reduced manual evidence effort", "Improved readiness visibility", "Stronger evidence traceability", "More consistent documentation"],
    engagements: ["CMMCLens fit assessment", "Evidence automation implementation", "SSP and policy documentation automation", "Compliance dashboard implementation"],
    frameworks: ["CMMC Level 2", "NIST SP 800-171", "SPRS", "SSP", "POA&M"],
    deliverables: ["Platform fit assessment", "Evidence workflow design", "Readiness dashboard", "Control traceability model"],
    why: "Compliance programs become more sustainable when evidence, gaps, remediation, and documentation are connected in a repeatable workflow.",
    cta: { label: "Explore CMMCLens", href: "/cmmclens" },
    faqs: [
      { question: "How does CMMCLens support NIST SP 800-171 and CMMC readiness?", answer: "CMMCLens supports evidence collection, control traceability, gap identification, readiness monitoring, and AI-assisted SSP and policy generation." },
      { question: "Can CMMCLens reduce manual evidence collection effort?", answer: "Where required source data and integrations are available, CMMCLens may reduce manual evidence collection effort by automating collection, mapping, and traceability workflows." },
      commonFaq.supplier,
    ],
  }),
};

export default function SolutionPage() {
  const [location] = useLocation();
  const config = pages[location] ?? pages["/solutions/ai-governance"];
  const Icon = config.icon;

  useSeo(config.seoTitle, config.seoDescription);

  useEffect(() => {
    const schema = [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: config.eyebrow,
        provider: { "@type": "Organization", name: "DefenseEye", url: "https://defenseeye.ai" },
        description: config.seoDescription,
        areaServed: { "@type": "Country", name: "United States" },
        about: config.frameworks.map((name) => ({ "@type": "Thing", name })),
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: config.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: config.eyebrow, item: `https://defenseeye.ai${location}` },
        ],
      },
    ];
    const id = "solution-page-schema";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.text = JSON.stringify(schema);
    document.head.appendChild(s);
    return () => document.getElementById(id)?.remove();
  }, [config, location]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="px-4">
        <section className="max-w-6xl mx-auto pt-16 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-5">
            <Icon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">{config.eyebrow}</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-5 max-w-4xl">{config.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">{config.description}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={config.cta.href}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                {config.cta.label} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="/capability-statement">
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                Request Capability Statement
              </Button>
            </a>
          </div>
        </section>

        <section className="max-w-6xl mx-auto pb-14">
          <div className="bg-primary/5 border border-primary/20 rounded-sm p-6">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Executive Summary</p>
            <p className="text-foreground leading-relaxed max-w-4xl">{config.summary}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-14 border-t border-border/30">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <Target className="w-6 h-6 text-primary mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Business Challenge</h2>
              <p className="text-muted-foreground leading-relaxed">{config.challenge}</p>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
              {config.howHelps.map((item) => (
                <div key={item} className="bg-card/50 border border-border/40 rounded-sm p-4">
                  <ClipboardCheck className="w-5 h-5 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-14 border-t border-border/30">
          <div className="grid lg:grid-cols-2 gap-8">
            <Panel title="Key Outcomes" icon={CheckCircle2} items={config.outcomes} />
            <Panel title="Representative Engagements" icon={Network} items={config.engagements} />
            <Panel title="Relevant Frameworks / Technologies" icon={ShieldCheck} items={config.frameworks} />
            <Panel title="Deliverables" icon={FileCheck} items={config.deliverables} />
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-14 border-t border-border/30">
          <div className="bg-card/50 border border-border/40 rounded-sm p-6">
            <Target className="w-6 h-6 text-primary mb-4" />
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Why It Matters</h2>
            <p className="text-muted-foreground leading-relaxed max-w-4xl">{config.why}</p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-14 border-t border-border/30">
          <div className="mb-8">
            <Network className="w-6 h-6 text-primary mb-4" />
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Frequently asked questions</h2>
            <p className="text-muted-foreground leading-relaxed">Concise answers for buyers, supplier teams, program owners, and governance leaders.</p>
          </div>
          <div className="space-y-4">
            {config.faqs.map((faq) => (
              <div key={faq.question} className="bg-card/40 border border-border/40 rounded-sm p-5">
                <h3 className="font-heading font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto py-14 border-t border-border/30">
          <div className="bg-card/50 border border-border/40 rounded-sm p-6 flex flex-col md:flex-row md:items-center gap-5">
            <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
            <div className="flex-1">
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">Available for enterprise supplier evaluation</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DefenseEye supports advisory, implementation, subcontracting, staff augmentation, and platform-enabled consulting opportunities.
              </p>
            </div>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Discuss Supplier Opportunities <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

function Panel({ title, icon: Icon, items }: { title: string; icon: typeof Bot; items: string[] }) {
  return (
    <div>
      <Icon className="w-6 h-6 text-primary mb-4" />
      <h2 className="font-heading text-2xl font-bold text-foreground mb-5">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 bg-card/50 border border-border/40 rounded-sm p-4">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
