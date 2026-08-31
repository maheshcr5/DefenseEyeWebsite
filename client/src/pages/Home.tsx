import { useEffect, type ComponentType } from "react";
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck,
  LockKeyhole,
  Network,
  Scale,
  SearchCheck,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { COMPANY } from "@/data/companyFacts";
import { trackConversion } from "@/lib/tracking";

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
type IconText = [IconComponent, string];
type CapabilityLink = [string, string, IconComponent];

const HOME_TITLE = "DefenseEye | Secure Agentic AI Implementation";
const HOME_DESCRIPTION =
  "DefenseEye helps FinTechs, credit unions, and regulated organizations implement agentic AI with secure architecture, responsible governance, human oversight, and hands-on delivery support.";

const buyerProblems = [
  "Sensitive member and customer data exposure",
  "Excessive AI-agent permissions",
  "Uncontrolled access to internal systems and records",
  "Inaccurate or untraceable outputs",
  "Third-party model and vendor risk",
  "Insufficient human review for consequential actions",
  "Difficulty demonstrating governance and accountability",
];

const useCases = [
  "Member and customer-service knowledge assistants",
  "Internal policy and compliance research agents",
  "Fraud and case-investigation workflow support",
  "Secure document and data extraction",
  "Employee productivity and operations copilots",
  "Microsoft Copilot and Azure OpenAI adoption",
  "Human-reviewed agentic workflows for sensitive operations",
];

const capabilities: IconText[] = [
  [SearchCheck, "AI readiness and use-case prioritization"],
  [LockKeyhole, "Secure identity, data, agent, and integration architecture"],
  [Scale, "Responsible AI governance and NIST AI RMF alignment"],
  [ShieldCheck, "Evaluation, testing, monitoring, and human oversight"],
  [Bot, "Agentic AI engineering and implementation"],
  [Network, "Microsoft cloud, Copilot, and Azure OpenAI readiness"],
  [ClipboardCheck, "Cybersecurity and privacy controls for sensitive environments"],
];

const engagementSteps = [
  ["Assess", "Business value, data readiness, risks, and controls."],
  ["Design", "Architecture, governance, identity, oversight, and evaluation."],
  ["Implement", "Build, integrate, test, monitor, and scale."],
];

const whyDefenseEye: IconText[] = [
  [UserCheck, "Practitioner-led AI/ML engineering"],
  [ShieldCheck, "Cybersecurity and responsible AI governance"],
  [Network, "Microsoft and Azure experience"],
  [Building2, "Regulated-environment implementation perspective"],
  [CheckCircle2, "Hands-on delivery rather than strategy-only consulting"],
];

const secondaryCapabilities: CapabilityLink[] = [
  ["CMMC and NIST SP 800-171 readiness", "/cmmc-compliance-automation", FileCheck],
  ["CMMCLens compliance evidence automation", "/cmmclens", ClipboardCheck],
  ["AttackSense cybersecurity visibility", "/attacksense", ShieldCheck],
  ["Supplier and subcontracting support", "/supplier-readiness", Building2],
];

const secondaryCapabilityEvents = {
  "/cmmc-compliance-automation": "portfolio_cmmc_click",
  "/cmmclens": "cmmclens_click",
  "/attacksense": "attacksense_view",
  "/supplier-readiness": "supplier_readiness_view",
} as const;

export default function Home() {
  useSeo(HOME_TITLE, HOME_DESCRIPTION);

  useEffect(() => {
    const id = "home-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
        name: "DefenseEye",
        url: "https://defenseeye.ai",
        address: { "@type": "PostalAddress", addressLocality: "Redmond", addressRegion: "WA", addressCountry: "US" },
        areaServed: "United States",
        email: COMPANY.enterpriseEmail,
        description: HOME_DESCRIPTION,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "DefenseEye",
        url: "https://defenseeye.ai",
      },
    ]);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      <section className="section-navy nvidia-grid-bg px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <DefenseEyeLogo />
          </div>
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">SECURE AGENTIC AI FOR REGULATED ORGANIZATIONS</p>
            <h1 className="font-heading text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">Implement Agentic AI Securely</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              DefenseEye helps FinTechs, credit unions, and other regulated organizations implement AI agents with secure data access, responsible governance, human oversight, and practical delivery support.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="/secure-ai-adoption#secure-ai-consultation" onClick={() => trackConversion("consultation_click", { location: "home_hero_secure_ai" })}>
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                  Request a Secure AI Readiness Consultation <ArrowRight className="ml-2 size-4" />
                </Button>
              </a>
              <a
                href="/secure-ai-adoption"
                onClick={() => trackConversion("portfolio_ai_click", { location: "home_hero_text_link" })}
                className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Explore Secure AI Services
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Buyer Problems</p>
            <h2 className="font-heading text-4xl font-bold">AI agents introduce real operational risk when governance trails implementation</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Regulated financial organizations need practical controls before agents can retrieve records, summarize sensitive data, act across systems, or influence consequential workflows.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {buyerProblems.map((problem) => (
              <div key={problem} className="flex gap-3 border border-border/50 bg-card p-5">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-sm font-medium leading-relaxed">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gray px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Relevant Use Cases</p>
            <h2 className="font-heading text-4xl font-bold">Examples DefenseEye can help assess, govern, and implement</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              These use cases are examples, not customer deployment claims. High-impact decisions should retain appropriate human accountability.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {useCases.map((useCase) => (
              <div key={useCase} className="border-l-4 border-primary bg-card p-5">
                <p className="text-sm font-semibold leading-relaxed">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-navy px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">DefenseEye Capabilities</p>
            <h2 className="font-heading text-4xl font-bold">Secure AI readiness, architecture, governance, and implementation</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(([Icon, text]) => (
              <div key={text as string} className="border border-primary/20 bg-card/70 p-5">
                <Icon className="mb-4 size-6 text-primary" aria-hidden="true" />
                <h3 className="font-heading text-xl font-bold">{text as string}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Engagement Approach</p>
          <h2 className="font-heading text-4xl font-bold">From use-case clarity to governed delivery</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {engagementSteps.map(([title, text], index) => (
              <div key={title} className="border border-border/50 bg-card p-6">
                <div className="mb-4 flex size-10 items-center justify-center bg-primary font-bold text-primary-foreground">{index + 1}</div>
                <h3 className="font-heading text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gray px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Why DefenseEye</p>
            <h2 className="font-heading text-4xl font-bold">Practitioner-led implementation for regulated environments</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              DefenseEye connects AI/ML engineering, cybersecurity, responsible AI governance, and Microsoft cloud delivery support for teams that need working systems with appropriate controls.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyDefenseEye.map(([Icon, text]) => (
              <div key={text as string} className="flex gap-3 border border-border/50 bg-card p-5">
                <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-sm font-medium leading-relaxed">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-navy px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Next Step</p>
          <h2 className="font-heading text-4xl font-bold">Start with the use case, data, and controls</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Request a focused Secure AI readiness consultation for agentic AI opportunities, risks, architecture, governance, and implementation planning.
          </p>
          <a href="/secure-ai-adoption#secure-ai-consultation" onClick={() => trackConversion("consultation_click", { location: "home_midpage_secure_ai" })}>
            <Button size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              Request a Secure AI Readiness Consultation <ArrowRight className="ml-2 size-4" />
            </Button>
          </a>
        </div>
      </section>

      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Additional DefenseEye Capabilities</p>
            <h2 className="font-heading text-4xl font-bold">Focused portfolio paths remain available</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Secure AI is the primary homepage journey. DefenseEye also supports CMMC, compliance automation, cybersecurity visibility, and supplier-readiness work through dedicated pages.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {secondaryCapabilities.map(([title, href, Icon]) => (
              <a
                key={title as string}
                href={href as string}
                onClick={() => trackConversion(secondaryCapabilityEvents[href as keyof typeof secondaryCapabilityEvents], { portfolio: title as string, location: "home_additional_capabilities" })}
                className="group border border-border/50 bg-card p-5 transition-colors hover:border-primary/50"
              >
                <Icon className="mb-4 size-6 text-primary" aria-hidden="true" />
                <h3 className="font-heading text-lg font-bold group-hover:text-primary">{title as string}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
