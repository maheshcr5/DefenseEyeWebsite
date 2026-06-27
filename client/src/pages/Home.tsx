import { useEffect } from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
} from "lucide-react";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { CALENDLY_URL, COMPANY, MARKETPLACE_URL } from "@/data/companyFacts";
import { trackConversion } from "@/lib/tracking";

const trustStrip = [
  "Multiple CMMC Certified Professionals",
  "CMMC Level 1 Certified",
  "NIST SP 800-171 L2 In Progress",
  "CAGE 9ZDL5",
  "UEI E4DYPCKN7YN8",
];

const problemCards = [
  ["AI adoption without governance", "Teams deploy copilots, agents, and AI workflows before data, identity, privacy, and oversight controls are ready."],
  ["Compliance evidence trapped in manual work", "CMMC and NIST SP 800-171 readiness often depend on spreadsheets, screenshots, disconnected documents, and repeated evidence requests."],
  ["Security and compliance disconnected from execution", "Risk findings do not always translate into remediation workflows, ownership, dashboards, or measurable progress."],
  ["Enterprise procurement needs supplier confidence", "Large organizations need suppliers who can show capability, credentials, delivery models, and readiness without overclaiming."],
];

const portfolios = [
  {
    title: "Secure & Responsible AI Adoption",
    href: "/secure-ai-adoption",
    cta: "Explore Secure AI Adoption",
    event: "portfolio_ai_click" as const,
    icon: Bot,
    description:
      "For organizations adopting Microsoft Copilot, Azure OpenAI, generative AI, LLM workflows, or enterprise AI systems that require governance, security, accountability, and operational controls.",
    services: [
      "AI governance readiness",
      "Microsoft Copilot readiness",
      "AI security assessment",
      "Responsible AI policy and oversight",
      "NIST AI RMF implementation",
      "ISO 42001 readiness",
      "AI risk and vendor review",
      "Secure AI adoption roadmap",
    ],
    outcomes: [
      "Reduced AI adoption risk",
      "Clear AI accountability model",
      "Better data and identity control",
      "Faster governed implementation",
      "Improved executive visibility",
    ],
  },
  {
    title: "CMMC & Compliance Automation",
    href: "/cmmc-compliance-automation",
    cta: "Explore CMMC Automation",
    event: "portfolio_cmmc_click" as const,
    icon: FileCheck,
    description:
      "For defense contractors, government contractors, primes, and regulated organizations preparing for CMMC, NIST SP 800-171, customer audits, supplier readiness, and compliance evidence discipline.",
    services: [
      "CMMC Level 2 readiness",
      "NIST SP 800-171 gap analysis",
      "SSP and POA&M support",
      "SPRS readiness",
      "Evidence automation",
      "CMMCLens implementation",
      "Remediation workflow support",
      "Prime supply-chain readiness",
    ],
    outcomes: [
      "Reduced manual evidence burden",
      "Better control traceability",
      "Clear remediation priorities",
      "Improved audit preparedness",
      "Stronger customer and supplier readiness",
    ],
  },
];

const readinessPanels = [
  ["Secure AI Adoption", "Move from AI experimentation to governed adoption with clear policies, oversight, security controls, and implementation roadmaps.", ShieldCheck],
  ["Microsoft Copilot Readiness", "Prepare Microsoft 365, identity, privacy, and security controls before expanding Copilot across the organization.", Sparkles],
  ["CMMC Evidence Automation", "Replace fragmented manual compliance work with evidence workflows, readiness dashboards, and control traceability.", ClipboardCheck],
  ["Supplier Readiness", "Support enterprise supplier, subcontracting, and procurement evaluation with clear capability and readiness information.", Building2],
];

const outcomeRows = [
  ["Manual evidence collection", "High labor cost, repeated requests, delayed readiness", "Automate evidence workflows and control traceability"],
  ["Ungoverned AI adoption", "Data exposure, rework, delayed deployment", "Implement AI governance, security, and readiness controls early"],
  ["Disconnected security findings", "Risk remains unresolved, ownership unclear", "Convert findings into prioritized remediation workflows"],
  ["Copilot readiness gaps", "Over-permissioned data, privacy risk, adoption friction", "Assess identity, data governance, security, and user readiness"],
  ["CMMC uncertainty", "Contract risk and assessment friction", "Provide CCP-led readiness support and CMMCLens automation"],
  ["Big-firm consulting cost", "High advisory cost, slow execution", "Practitioner-led, focused delivery with platform-enabled automation"],
];

const whyCards = [
  ["Practitioner-led", "Senior advisors with experience across Microsoft cloud, federal cybersecurity, AI governance, privacy, regulatory response, and compliance automation.", UserCheck],
  ["CCP-led CMMC readiness", "DefenseEye includes multiple CMMC Certified Professionals supporting CMMC and NIST SP 800-171 readiness.", Award],
  ["Automation-enabled", "CMMCLens helps structure evidence collection, gap tracking, SSP/POA&M workflows, and readiness visibility.", BarChart3],
  ["Microsoft-centered", "Experience aligned to Azure, Microsoft 365, Copilot, Entra, Defender, Sentinel, Purview, Azure Government, and GCC High patterns.", Network],
  ["Supplier-ready", "Minority-owned business with supplier identifiers, NAICS codes, CAGE, UEI, and engagement models for advisory, implementation, subcontracting, and staff augmentation.", Building2],
];

const differentRows = [
  ["Broad AI strategy decks", "Governed AI adoption roadmaps tied to controls and implementation"],
  ["Manual compliance evidence", "Evidence automation and traceability through CMMCLens"],
  ["Disconnected advisory work", "Advisory, implementation, dashboards, and workflows connected"],
  ["CMMC treated as documentation", "CMMC treated as operational readiness"],
  ["AI governance treated as policy only", "AI governance connected to security, identity, data, oversight, and adoption"],
  ["Supplier claims without procurement detail", "Clear supplier readiness, identifiers, certifications, and engagement models"],
];

const engagementSteps = [
  ["1", "Clarify scope", "Identify the AI, Microsoft cloud, CMMC, supplier, or evidence-readiness problem that needs action."],
  ["2", "Assess readiness", "Review policies, controls, workflows, data exposure, evidence, and ownership against the selected portfolio."],
  ["3", "Prioritize execution", "Translate findings into a roadmap, remediation workflow, implementation plan, or CMMCLens onboarding path."],
  ["4", "Operationalize", "Support teams with practitioner-led consulting, staff augmentation, dashboards, documentation, and automation."],
];

const datasheets = [
  ["Secure AI Adoption Datasheet", "/datasheets/secure-ai-adoption"],
  ["CMMC Automation Datasheet", "/datasheets/cmmc-compliance-automation"],
  ["CMMCLens Product Sheet", "/datasheets/cmmclens"],
  ["Microsoft Copilot Readiness Datasheet", "/datasheets/microsoft-copilot-readiness"],
  ["Supplier Readiness Datasheet", "/datasheets/supplier-readiness"],
];

const faqs = [
  ["Does DefenseEye certify organizations for CMMC?", "No. DefenseEye provides CCP-led readiness support, advisory, documentation, evidence automation, and preparation support. DefenseEye does not claim C3PAO status or certify organizations."],
  ["What is the main difference between the two portfolios?", "Secure AI Adoption focuses on governance, Copilot, Azure AI, security, policy, and oversight. CMMC & Compliance Automation focuses on NIST SP 800-171, CMMC readiness, evidence, SSP/POA&M workflows, and CMMCLens."],
  ["How does CMMCLens reduce manual effort?", "CMMCLens may reduce manual evidence collection effort depending on environment maturity, integrations, available source data, and implementation scope."],
];

export default function Home() {
  useSeo(
    "DefenseEye | Secure AI Adoption and CMMC Compliance Automation",
    "DefenseEye helps regulated organizations operationalize secure AI adoption and CMMC readiness through practitioner-led consulting, Microsoft cloud security expertise, and compliance automation."
  );

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
        description:
          "Practitioner-led AI governance, Microsoft cloud security, CMMC readiness, and compliance automation supplier for regulated organizations.",
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "DefenseEye",
        url: "https://defenseeye.ai",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
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
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">Practitioner-led AI governance, Microsoft cloud security, and compliance automation</p>
            <h1 className="font-heading text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              Operationalize Secure AI Adoption and CMMC Readiness
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              DefenseEye helps regulated organizations turn AI governance, Microsoft cloud security, and compliance evidence into practical workflows, readiness dashboards, and measurable operational outcomes.
            </p>
          </div>
          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {[
              "Secure and responsible AI adoption",
              "Microsoft Copilot and Azure AI readiness",
              "CMMC and NIST SP 800-171 readiness",
              "Compliance evidence automation",
              "Supplier-ready consulting, subcontracting, and staff augmentation",
            ].map((item) => (
              <div key={item} className="rounded-sm border border-primary/20 bg-card/50 p-3 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#portfolios">
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                Explore the Two Portfolios <ArrowRight className="ml-2 size-4" />
              </Button>
            </a>
            <a href="/datasheets" onClick={() => trackConversion("datasheet_view", { location: "home_hero" })}>
              <Button size="lg" variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/10 sm:w-auto">
                Request Datasheets
              </Button>
            </a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("supplier_inquiry_click", { location: "home_hero" })}>
              <Button size="lg" variant="outline" className="w-full border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary sm:w-auto">
                Discuss Supplier Opportunities
              </Button>
            </a>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Practitioner-led consulting supported by CMMCLens compliance automation.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {trustStrip.map((item) => (
              <span key={item} className="rounded-sm border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Problem Framing</p>
            <h2 className="font-heading text-4xl font-bold">The Problem: AI and Compliance Programs Are Still Managed in Silos</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Regulated organizations are adopting AI while also facing stricter cybersecurity, compliance, supplier, and audit expectations. Too often, AI governance, cloud security, CMMC evidence, policies, and remediation workflows are managed separately. The result is duplicated effort, unclear accountability, weak evidence traceability, delayed readiness, and higher operating cost.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {problemCards.map(([title, text]) => (
              <div key={title} className="rounded-sm border border-border/50 bg-card p-5">
                <Target className="mb-4 size-5 text-primary" />
                <h3 className="font-heading text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolios" className="section-gray px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Two Portfolio Paths</p>
            <h2 className="font-heading text-4xl font-bold">Two Focused Portfolios. One Readiness Operating Model.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {portfolios.map((portfolio) => {
              const Icon = portfolio.icon;
              return (
                <article key={portfolio.title} className="rounded-sm border border-border/50 bg-card p-6">
                  <div className="mb-5 flex items-start gap-4">
                    <div className="rounded-sm border border-primary/20 bg-primary/10 p-3">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl font-bold">{portfolio.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{portfolio.description}</p>
                    </div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <ListBlock title="Services" items={portfolio.services} />
                    <ListBlock title="Business Outcomes" items={portfolio.outcomes} />
                  </div>
                  <a href={portfolio.href} onClick={() => trackConversion(portfolio.event, { location: "home_portfolio_card" })}>
                    <Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                      {portfolio.cta} <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-navy px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Operational Readiness</p>
            <h2 className="font-heading text-4xl font-bold">From Risk Discussion to Operational Readiness</h2>
          </div>
          <div className="flex snap-x gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {readinessPanels.map(([title, text, Icon]) => (
              <div key={title as string} className="min-w-[270px] snap-start rounded-sm border border-primary/20 bg-card/70 p-5">
                {/* TODO: Replace this lightweight diagram panel with approved custom enterprise imagery when available. */}
                <div className="mb-5 flex h-32 items-center justify-center rounded-sm border border-border/40 bg-background/40" aria-label={`${title} visual panel`}>
                  <Icon className="size-12 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-xl font-bold">{title as string}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Business Outcomes</p>
            <h2 className="font-heading text-4xl font-bold">Designed to Reduce the Cost of Readiness</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              DefenseEye is built around the operating economics of regulated AI and compliance programs: reduce manual effort, reduce rework, shorten readiness cycles, improve traceability, and give leaders clearer visibility into risk and progress.
            </p>
          </div>
          <div className="overflow-x-auto rounded-sm border border-border/50">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted/60 text-foreground">
                <tr>
                  <th className="p-4 font-heading text-base">Operational challenge</th>
                  <th className="p-4 font-heading text-base">Economic impact</th>
                  <th className="p-4 font-heading text-base">DefenseEye approach</th>
                </tr>
              </thead>
              <tbody>
                {outcomeRows.map(([challenge, impact, approach]) => (
                  <tr key={challenge} className="border-t border-border/50 bg-card/50">
                    <td className="p-4 font-medium">{challenge}</td>
                    <td className="p-4 text-muted-foreground">{impact}</td>
                    <td className="p-4 text-muted-foreground">{approach}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            CMMCLens may reduce manual evidence collection effort depending on environment maturity, integrations, and implementation scope.
          </p>
        </div>
      </section>

      <section className="section-gray px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Why DefenseEye</p>
            <h2 className="font-heading text-4xl font-bold">Why DefenseEye</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              DefenseEye combines practitioner-led consulting, Microsoft cloud security experience, CMMC credentials, AI governance expertise, and compliance automation in a focused delivery model for regulated organizations.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {whyCards.map(([title, text, Icon]) => (
              <div key={title as string} className="rounded-sm border border-border/50 bg-card p-5">
                <Icon className="mb-4 size-5 text-primary" />
                <h3 className="font-heading text-lg font-bold">{title as string}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 font-heading text-4xl font-bold">What Makes DefenseEye Different</h2>
          <div className="overflow-x-auto rounded-sm border border-border/50">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="p-4 font-heading text-base">Traditional approach</th>
                  <th className="p-4 font-heading text-base">DefenseEye approach</th>
                </tr>
              </thead>
              <tbody>
                {differentRows.map(([traditional, defenseeye]) => (
                  <tr key={traditional} className="border-t border-border/50 bg-card/50">
                    <td className="p-4 text-muted-foreground">{traditional}</td>
                    <td className="p-4 font-medium">{defenseeye}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-gray px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Delivery Model</p>
            <h2 className="font-heading text-4xl font-bold">How Engagements Work</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {engagementSteps.map(([number, title, text]) => (
              <div key={number} className="rounded-sm border border-border/50 bg-card p-5">
                <div className="mb-4 flex size-9 items-center justify-center rounded-sm bg-primary text-primary-foreground font-bold">{number}</div>
                <h3 className="font-heading text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-navy px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">CMMCLens Platform</p>
            <h2 className="font-heading text-4xl font-bold">Compliance Evidence Automation for Readiness Workflows</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              CMMCLens helps organizations structure CMMC and NIST SP 800-171 readiness through evidence automation, control mapping, gap tracking, SSP/POA&M workflows, and readiness dashboards.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="/cmmclens" onClick={() => trackConversion("cmmclens_click", { location: "home_cmmclens" })}>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Explore CMMCLens</Button>
              </a>
              <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">Microsoft Marketplace</Button>
              </a>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {["Evidence automation", "Control mapping", "Gap identification", "Remediation workflows", "SSP support", "POA&M tracking", "AI-assisted policy generation", "Readiness dashboards"].map((item) => (
              <div key={item} className="rounded-sm border border-border/40 bg-card/60 p-4 text-sm text-muted-foreground">
                <CheckCircle2 className="mb-2 size-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Supplier Readiness</p>
            <h2 className="font-heading text-4xl font-bold">Supplier Readiness Snapshot</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              DefenseEye is available for advisory, implementation, subcontracting, and staff augmentation opportunities.
            </p>
            <a href="/supplier-readiness" onClick={() => trackConversion("supplier_inquiry_click", { location: "home_supplier_snapshot" })}>
              <Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">View Supplier Readiness</Button>
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {[
              "Redmond, WA",
              "OMWBE-MBE Certified",
              "NMSDC-MBE Certified",
              "WA State SBE",
              "CAGE 9ZDL5",
              "UEI E4DYPCKN7YN8",
              "NAICS 541512, 541519, 541690, 561621",
              "Multiple CMMC Certified Professionals",
            ].map((item) => (
              <div key={item} className="rounded-sm border border-border/50 bg-card p-4 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gray px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Procurement Assets</p>
            <h2 className="font-heading text-4xl font-bold">Datasheets and Product Sheets</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Download concise one-page overviews for AI adoption, CMMC automation, CMMCLens, Microsoft Copilot readiness, and supplier evaluation.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {datasheets.map(([label, href]) => (
              <a key={href} href={href} onClick={() => trackConversion("datasheet_view", { datasheet: label, location: "home" })} className="group rounded-sm border border-border/50 bg-card p-5 transition-colors hover:border-primary/50">
                <FileCheck className="mb-4 size-5 text-primary" />
                <h3 className="font-heading text-lg font-bold group-hover:text-primary">{label}</h3>
              </a>
            ))}
          </div>
          <a href="/datasheets" onClick={() => trackConversion("datasheet_view", { location: "home_datasheets_cta" })}>
            <Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">View Datasheets</Button>
          </a>
        </div>
      </section>

      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Knowledge Hub</p>
            <h2 className="font-heading text-4xl font-bold">Practical Answers for AI Governance and CMMC Readiness</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-sm border border-border/50 bg-card p-5">
                <h3 className="font-heading text-lg font-bold">{question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer}</p>
              </div>
            ))}
          </div>
          <a href="/knowledge-hub">
            <Button variant="outline" className="mt-6 border-primary/40 text-primary hover:bg-primary/10">Visit Knowledge Hub</Button>
          </a>
        </div>
      </section>

      <section className="section-navy px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Next Step</p>
          <h2 className="font-heading text-4xl font-bold">Turn Readiness Work Into an Operating Model</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            Discuss secure AI adoption, CMMC automation, supplier readiness, or CMMCLens with DefenseEye.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("consultation_click", { location: "home_final_cta" })}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Discuss Readiness <ArrowRight className="ml-2 size-4" /></Button>
            </a>
            <a href="/datasheets" onClick={() => trackConversion("datasheet_view", { location: "home_final_cta" })}>
              <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">Request Datasheets</Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-foreground">{title}</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="section-gray border-t border-border/30 px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
        <div>
          <DefenseEyeLogo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Secure AI adoption, Microsoft cloud security, CMMC readiness, and compliance automation for regulated organizations.
          </p>
          <div className="mt-4 space-y-1 text-xs text-muted-foreground">
            <p>Redmond, WA</p>
            <p>Consulting: <a className="hover:text-primary" href={`mailto:${COMPANY.enterpriseEmail}`} onClick={() => trackConversion("enterprise_email_click", { location: "footer" })}>{COMPANY.enterpriseEmail}</a></p>
            <p>Supplier: <a className="hover:text-primary" href={`mailto:${COMPANY.partnersEmail}`} onClick={() => trackConversion("partners_email_click", { location: "footer" })}>{COMPANY.partnersEmail}</a></p>
            <p>Product support: <a className="hover:text-primary" href={`mailto:${COMPANY.supportEmail}`} onClick={() => trackConversion("support_email_click", { location: "footer" })}>{COMPANY.supportEmail}</a></p>
          </div>
        </div>
        <FooterLinks title="Portfolios" links={[["Secure AI Adoption", "/secure-ai-adoption"], ["CMMC Automation", "/cmmc-compliance-automation"], ["Microsoft Copilot Readiness", "/solutions/microsoft-copilot-readiness"], ["Microsoft Cloud Security", "/solutions/cloud-security"]]} />
        <FooterLinks title="Resources" links={[["CMMCLens", "/cmmclens"], ["Datasheets", "/datasheets"], ["Knowledge Hub", "/knowledge-hub"], ["Capability Statement", "/capability-statement"]]} />
        <FooterLinks title="Company" links={[["Supplier Readiness", "/supplier-readiness"], ["Delivery Model", "/delivery-model"], ["Representative Engagements", "/representative-engagements"], ["Contact", "/contact"], ["Support", "/support"], ["Privacy Policy", "/privacy-policy"]]} />
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-border/30 pt-5 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} DefenseEye, Inc. All rights reserved. CMMCLens is a trademark of DefenseEye.
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h4 className="mb-4 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([label, href]) => (
          <li key={href}>
            <a href={href} className="text-sm text-muted-foreground transition-colors hover:text-primary">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
