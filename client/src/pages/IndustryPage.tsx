import { ArrowRight, Building2, CheckCircle2, FileCheck, Network, ShieldCheck, Users } from "lucide-react";
import { useLocation } from "wouter";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";

type IndustryPageConfig = {
  eyebrow: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  sections: Array<{
    heading: string;
    body?: string;
    items: string[];
  }>;
  links: Array<{ label: string; href: string; description: string }>;
  cta: { label: string; href: string; note: string };
};

export const INDUSTRY_PAGES: Record<string, IndustryPageConfig> = {
  "/industries/financial-services-credit-unions": {
    eyebrow: "Financial Services & Credit Unions",
    h1: "Secure AI for Financial Services and Credit Unions",
    title: "Secure AI for Financial Services and Credit Unions | DefenseEye",
    description:
      "DefenseEye helps financial-services teams and credit unions evaluate and implement AI and agentic AI with security, governance, data-access controls, traceability, monitoring, and human oversight.",
    intro:
      "DefenseEye helps regulated financial-services teams and credit unions evaluate and implement AI and agentic AI with appropriate security, governance, data-access controls, traceability, evaluation, monitoring, and human oversight.",
    sections: [
      {
        heading: "Who this is for",
        body:
          "This page is for financial-services, FinTech, banking, lending, payments, insurance, and credit union teams exploring AI-enabled workflows involving sensitive customer, member, operational, or internal business data.",
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
        heading: "Relevant Secure AI solutions and resources",
        items: [
          "Secure AI adoption and readiness consultation",
          "AI governance, AI security, AI transformation, and Microsoft Copilot readiness support",
          "Representative engagements that show the types of work DefenseEye is positioned to support",
        ],
      },
    ],
    links: [
      { label: "Secure AI adoption", href: "/secure-ai-adoption", description: "Explore the Secure AI readiness and implementation funnel." },
      { label: "AI governance", href: "/solutions/ai-governance", description: "Define responsible AI oversight, policy, accountability, and review practices." },
      { label: "AI security", href: "/solutions/ai-security", description: "Assess identity, data, model, agent, prompt, logging, and monitoring risks." },
      { label: "AI transformation", href: "/solutions/ai-transformation", description: "Prioritize AI use cases and adoption roadmaps with governance built in." },
      { label: "Microsoft Copilot readiness", href: "/solutions/microsoft-copilot-readiness", description: "Prepare Microsoft 365 data, permissions, Purview, Entra, and security controls." },
      { label: "Representative engagements", href: "/representative-engagements", description: "Review engagement types DefenseEye is positioned to support." },
    ],
    cta: {
      label: "Request a Secure AI Readiness Consultation",
      href: "/secure-ai-adoption#secure-ai-consultation",
      note: "Use the existing Secure AI consultation form to discuss a focused AI readiness or pilot-scoping conversation.",
    },
  },
  "/industries/defense-industrial-base": {
    eyebrow: "Defense Industrial Base & Federal Contractors",
    h1: "Cybersecurity and Compliance Support for the Defense Industrial Base",
    title: "Cybersecurity and Compliance Support for the Defense Industrial Base | DefenseEye",
    description:
      "DefenseEye supports defense contractors, subcontractors, suppliers, and federal contractor teams preparing for applicable cybersecurity, CMMC, NIST SP 800-171, evidence, and supplier-readiness requirements.",
    intro:
      "DefenseEye supports defense contractors, subcontractors, suppliers, and organizations preparing for applicable federal cybersecurity requirements with cybersecurity readiness, CMMC and NIST SP 800-171 support, evidence planning, and compliance automation.",
    sections: [
      {
        heading: "Who this is for",
        body:
          "This page is for defense contractors, subcontractors, suppliers, and federal contractor teams that need to understand and prepare for requirements that may apply based on contract scope, CUI handling, flow-downs, and customer expectations.",
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
        heading: "Relevant solutions and procurement resources",
        items: [
          "CMMC readiness, Level 2 preparation, compliance automation, and evidence automation",
          "CMMCLens for evidence automation, control mapping, and readiness workflows",
          "Supplier readiness, capability statement, and representative engagements",
        ],
      },
    ],
    links: [
      { label: "CMMC readiness", href: "/cmmc", description: "Review CMMC readiness, evidence automation, and advisory support." },
      { label: "CMMC Level 2 readiness", href: "/cmmc-level-2-readiness", description: "Focus on CUI scope, gaps, SSP, POA&M, SPRS, and assessment preparation." },
      { label: "CMMC compliance automation", href: "/cmmc-compliance-automation", description: "Connect readiness support with automation and CMMCLens-enabled workflows." },
      { label: "CMMCLens", href: "/cmmclens", description: "Explore DefenseEye's compliance evidence automation platform." },
      { label: "Supplier readiness", href: "/supplier-readiness", description: "Review supplier identifiers, engagement models, and procurement context." },
      { label: "Capability statement", href: "/capability-statement", description: "Open DefenseEye's procurement-ready company overview." },
      { label: "Representative engagements", href: "/representative-engagements", description: "Review engagement types DefenseEye is positioned to support." },
    ],
    cta: {
      label: "Discuss CMMC Readiness",
      href: "/contact?inquiry=cmmc",
      note: "Use the existing DefenseEye contact workflow for CMMC, supplier, or compliance-readiness inquiries.",
    },
  },
};

export default function IndustryPage() {
  const [location] = useLocation();
  const path = location.split("?")[0].split("#")[0];
  const config = INDUSTRY_PAGES[path] ?? INDUSTRY_PAGES["/industries/financial-services-credit-unions"];

  useSeo(config.title, config.description);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main>
        <section className="section-navy px-4 pb-14 pt-16">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <a href="/" className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
                Home
              </a>
              <span aria-hidden="true" className="mx-2">
                /
              </span>
              <span>Industries</span>
            </nav>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">{config.eyebrow}</p>
            <h1 className="max-w-4xl font-heading text-4xl font-bold leading-tight sm:text-5xl">{config.h1}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{config.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={config.cta.href}>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {config.cta.label} <ArrowRight className="ml-2 size-4" />
                </Button>
              </a>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{config.cta.note}</p>
            </div>
          </div>
        </section>

        <section className="section-light px-4 py-14">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
            {config.sections.map((section, index) => (
              <article key={section.heading} className="border border-border/50 bg-card p-6">
                {index === 0 ? <Users className="mb-4 size-6 text-primary" /> : null}
                {index === 1 ? <ShieldCheck className="mb-4 size-6 text-primary" /> : null}
                {index === 2 ? <Network className="mb-4 size-6 text-primary" /> : null}
                {index === 3 ? <FileCheck className="mb-4 size-6 text-primary" /> : null}
                <h2 className="font-heading text-2xl font-bold">{section.heading}</h2>
                {section.body ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p> : null}
                <ul className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section-gray px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-3">
              <Building2 className="size-6 text-primary" aria-hidden="true" />
              <h2 className="font-heading text-3xl font-bold">Related DefenseEye resources</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {config.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group border border-border/60 bg-card p-5 transition-colors hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <span className="text-sm font-semibold text-primary group-hover:text-primary/80">{link.label}</span>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{link.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
