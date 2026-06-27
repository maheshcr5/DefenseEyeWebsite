import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle2, ClipboardCheck, FileCheck, ShieldCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { CALENDLY_URL, CERTIFICATIONS } from "@/data/companyFacts";
import { useSeo } from "@/hooks/useSeo";
import { trackConversion } from "@/lib/tracking";

type PortfolioConfig = {
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  opening: string;
  who: string[];
  problems: string[];
  helpsTitle: string;
  helpsIntro?: string;
  helps: string[];
  deliverablesTitle: string;
  deliverables: string[];
  outcomes: string[];
  cta: string;
  event: "portfolio_ai_click" | "portfolio_cmmc_click";
};

const configs: Record<string, PortfolioConfig> = {
  "/secure-ai-adoption": {
    path: "/secure-ai-adoption",
    title: "Secure & Responsible AI Adoption Consulting",
    metaTitle: "Secure AI Adoption Consulting | DefenseEye AI Governance, Copilot Readiness, and AI Security",
    metaDescription:
      "DefenseEye helps regulated organizations adopt AI securely through AI governance, Microsoft Copilot readiness, NIST AI RMF implementation, ISO 42001 readiness, AI security, and responsible AI operating models.",
    eyebrow: "Secure AI Adoption",
    opening:
      "DefenseEye helps organizations move from AI experimentation to governed implementation by connecting AI use cases, policies, security controls, human accountability, and operational workflows.",
    who: ["Microsoft Copilot adopters", "Azure OpenAI users", "Regulated enterprises", "Government contractors", "Security and compliance teams", "CIO, CISO, CTO, risk, privacy, and governance leaders"],
    problems: ["Shadow AI", "Unclear AI accountability", "Weak AI policy", "Sensitive data exposure", "Model/vendor risk", "Copilot data readiness gaps", "Lack of AI inventory", "Missing oversight workflows"],
    helpsTitle: "How DefenseEye Helps",
    helps: ["AI governance readiness assessment", "AI use case intake model", "Responsible AI policy", "NIST AI RMF alignment", "ISO 42001 readiness", "Microsoft Copilot readiness", "AI security assessment", "AI risk register", "Human oversight model", "Executive AI roadmap"],
    deliverablesTitle: "Deliverables",
    deliverables: ["AI governance charter", "AI risk register", "AI policy", "Copilot readiness findings", "AI use case intake workflow", "Oversight model", "Roadmap", "Executive briefing"],
    outcomes: ["Reduced AI adoption risk", "Less rework", "Faster governed adoption", "Improved data protection", "Better executive visibility", "Clearer accountability"],
    cta: "Discuss Secure AI Adoption",
    event: "portfolio_ai_click",
  },
  "/cmmc-compliance-automation": {
    path: "/cmmc-compliance-automation",
    title: "CMMC & Compliance Automation",
    metaTitle: "CMMC Compliance Automation | DefenseEye CCP-Led CMMC Readiness and CMMCLens",
    metaDescription:
      "DefenseEye provides CCP-led CMMC Level 2 readiness, NIST SP 800-171 support, SSP/POA&M preparation, compliance evidence automation, and CMMCLens platform-enabled readiness workflows.",
    eyebrow: "CMMC Compliance Automation",
    opening:
      "DefenseEye helps defense contractors and regulated organizations prepare for CMMC and NIST SP 800-171 readiness through CCP-led advisory, evidence automation, remediation workflows, and CMMCLens readiness visibility.",
    who: ["Defense contractors", "Government contractors", "Prime contractors", "Subcontractors handling CUI", "MSPs/MSSPs supporting DIB customers", "Compliance and security teams"],
    problems: ["Manual evidence collection", "Unclear SSP ownership", "POA&M tracking gaps", "Weak control traceability", "SPRS uncertainty", "CUI boundary confusion", "C3PAO readiness concerns", "Supply-chain readiness pressure"],
    helpsTitle: "CCP-led Readiness",
    helpsIntro:
      "DefenseEye includes multiple CMMC Certified Professionals supporting CMMC Level 1, CMMC Level 2 readiness, NIST SP 800-171 alignment, SSP/POA&M preparation, evidence traceability, and assessment preparation. DefenseEye is not a C3PAO and does not certify organizations or guarantee assessment outcomes.",
    helps: ["Evidence automation", "Control mapping", "Gap identification", "Remediation workflows", "SSP support", "POA&M tracking", "AI-assisted policy generation", "Readiness dashboards", "Executive visibility"],
    deliverablesTitle: "Engagement Options",
    deliverables: ["2-4 week CMMC readiness sprint", "NIST 800-171 gap assessment", "SSP/POA&M support", "Evidence automation implementation", "CMMCLens onboarding", "Prime supply-chain readiness support"],
    outcomes: ["Reduced manual evidence burden", "Better readiness visibility", "Faster remediation prioritization", "Improved assessment preparation", "Stronger prime/customer confidence"],
    cta: "Assess CMMC Readiness",
    event: "portfolio_cmmc_click",
  },
};

export default function PortfolioPage() {
  const [location] = useLocation();
  const config = configs[location] ?? configs["/secure-ai-adoption"];
  useSeo(config.metaTitle, config.metaDescription);

  useEffect(() => {
    const id = "portfolio-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: config.title,
        description: config.metaDescription,
        provider: { "@type": "ProfessionalService", name: "DefenseEye", url: "https://defenseeye.ai" },
        areaServed: "United States",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: config.title, item: `https://defenseeye.ai${config.path}` },
        ],
      },
    ]);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, [config]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <section className="section-navy nvidia-grid-bg px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">{config.eyebrow}</p>
          <h1 className="max-w-4xl font-heading text-5xl font-bold leading-tight sm:text-6xl">{config.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{config.opening}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion(config.event, { location: "portfolio_hero", path: config.path })}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">{config.cta} <ArrowRight className="ml-2 size-4" /></Button>
            </a>
            <a href="/datasheets" onClick={() => trackConversion("datasheet_view", { location: config.path })}>
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">View Datasheets</Button>
            </a>
          </div>
        </div>
      </section>

      <Section title="Who This Is For" items={config.who} icon="shield" />
      <Section title="Problems We Solve" items={config.problems} gray icon="check" />

      <section className="section-light px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 max-w-3xl">
            <h2 className="font-heading text-3xl font-bold">{config.helpsTitle}</h2>
            {config.helpsIntro && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{config.helpsIntro}</p>}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {config.helps.map((item) => (
              <Card key={item} text={item} icon={<ClipboardCheck className="size-5 text-primary" />} />
            ))}
          </div>
        </div>
      </section>

      <Section title={config.deliverablesTitle} items={config.deliverables} gray icon="file" />
      <Section title="Economic Outcomes" items={config.outcomes} icon="check" />

      <section className="section-navy px-4 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-4xl font-bold">{config.cta}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            DefenseEye can help translate governance, compliance, security, and evidence needs into practical workflows and readiness plans.
          </p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("consultation_click", { location: "portfolio_final", path: config.path })}>
            <Button size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">{config.cta}</Button>
          </a>
        </div>
      </section>
    </div>
  );
}

function Section({ title, items, gray = false, icon }: { title: string; items: string[]; gray?: boolean; icon: "shield" | "check" | "file" }) {
  return (
    <section className={`px-4 py-14 ${gray ? "section-gray" : "section-light"}`}>
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 font-heading text-3xl font-bold">{title}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item} text={item} icon={icon === "shield" ? <ShieldCheck className="size-5 text-primary" /> : icon === "file" ? <FileCheck className="size-5 text-primary" /> : <CheckCircle2 className="size-5 text-primary" />} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-border/50 bg-card p-5">
      <div className="mb-3">{icon}</div>
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
