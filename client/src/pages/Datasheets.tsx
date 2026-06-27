import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle2, Download, FileText } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { CALENDLY_URL, CERTIFICATIONS, COMPANY, ENGAGEMENT_MODELS, SUPPLIER_IDENTIFIERS } from "@/data/companyFacts";
import { useSeo } from "@/hooks/useSeo";
import { trackConversion } from "@/lib/tracking";

type Sheet = {
  slug: string;
  title: string;
  value: string;
  who: string[];
  problems: string[];
  helps: string[];
  deliverables: string[];
  outcomes: string[];
  credentials: string[];
  engagement: string[];
  cta: string;
  contact: "enterprise" | "partners" | "support";
};

const sheets: Record<string, Sheet> = {
  "secure-ai-adoption": {
    slug: "secure-ai-adoption",
    title: "Secure AI Adoption Datasheet",
    value: "DefenseEye helps regulated organizations adopt AI securely with governance, Microsoft Copilot readiness, AI security, accountability, and practical implementation roadmaps.",
    who: ["Microsoft Copilot adopters", "Azure OpenAI users", "Regulated enterprises", "Government contractors", "CIO, CISO, CTO, risk, privacy, and governance leaders"],
    problems: ["Shadow AI", "Unclear AI accountability", "Sensitive data exposure", "Model and vendor risk", "Weak oversight workflows"],
    helps: ["AI governance readiness", "Responsible AI policy", "NIST AI RMF alignment", "ISO 42001 readiness", "AI risk register", "Human oversight model"],
    deliverables: ["AI governance charter", "AI risk register", "AI policy", "Use case intake workflow", "Executive roadmap"],
    outcomes: ["Reduced AI adoption risk", "Less rework", "Faster governed adoption", "Improved data protection", "Clear accountability"],
    credentials: ["NIST AI RMF familiarity", "ISO 42001 readiness support", "Microsoft cloud security experience", "CIPM"],
    engagement: ["AI governance readiness assessment", "Copilot readiness review", "AI operating model design", "Executive AI roadmap"],
    cta: "Discuss Secure AI Adoption",
    contact: "enterprise",
  },
  "cmmc-compliance-automation": {
    slug: "cmmc-compliance-automation",
    title: "CMMC & Compliance Automation Datasheet",
    value: "DefenseEye provides CCP-led CMMC Level 2 readiness, NIST SP 800-171 support, SSP/POA&M preparation, evidence automation, and CMMCLens-enabled readiness workflows.",
    who: ["Defense contractors", "Government contractors", "Prime contractors", "Subcontractors handling CUI", "MSPs/MSSPs", "Compliance and security teams"],
    problems: ["Manual evidence collection", "SSP ownership gaps", "POA&M tracking issues", "Weak control traceability", "SPRS uncertainty"],
    helps: ["CMMC Level 2 readiness", "NIST SP 800-171 gap analysis", "SSP and POA&M support", "Evidence automation", "Remediation workflow support"],
    deliverables: ["Readiness findings", "Gap analysis", "Evidence plan", "SSP/POA&M support", "CMMCLens onboarding plan"],
    outcomes: ["Reduced manual evidence burden", "Better readiness visibility", "Faster remediation prioritization", "Improved assessment preparation"],
    credentials: ["Multiple CMMC Certified Professionals", "CMMC Level 1 Certified", "NIST 800-171 Level 2 in progress"],
    engagement: ["2-4 week readiness sprint", "NIST 800-171 gap assessment", "Evidence automation implementation", "Prime supply-chain readiness support"],
    cta: "Assess CMMC Readiness",
    contact: "enterprise",
  },
  cmmclens: {
    slug: "cmmclens",
    title: "CMMCLens Product Sheet",
    value: "CMMCLens helps organizations structure CMMC and NIST SP 800-171 readiness through evidence automation, control mapping, gap tracking, SSP/POA&M workflows, and readiness dashboards.",
    who: ["Defense contractors", "Government contractors", "MSPs/MSSPs", "Compliance teams", "Prime contractors supporting supply-chain readiness"],
    problems: ["Manual evidence work", "Disconnected control mapping", "Gap tracking inconsistency", "Readiness reporting friction"],
    helps: ["Evidence automation", "Control mapping", "Gap identification", "Remediation workflow tracking", "SSP support", "POA&M support", "AI-assisted policy generation", "Readiness dashboards", "Executive reporting"],
    deliverables: ["CMMCLens onboarding", "Evidence workflow setup", "Control mapping", "Dashboard configuration", "Readiness reporting"],
    outcomes: ["Reduced manual evidence work", "Improved traceability", "Better readiness visibility", "More structured remediation", "Improved assessment preparation"],
    credentials: ["Multiple CMMC Certified Professionals", "CMMC Level 1 Certified", "NIST SP 800-171 readiness support"],
    engagement: ["Product demo", "Implementation planning", "Evidence workflow configuration", "Platform-enabled consulting"],
    cta: "Request CMMCLens Demo",
    contact: "support",
  },
  "microsoft-copilot-readiness": {
    slug: "microsoft-copilot-readiness",
    title: "Microsoft Copilot Readiness Datasheet",
    value: "DefenseEye helps organizations prepare Microsoft 365, identity, data governance, privacy, security, and adoption controls before scaling Microsoft Copilot.",
    who: ["Microsoft 365 leaders", "Security teams", "Privacy teams", "CIO and CISO organizations", "Regulated enterprises"],
    problems: ["Over-permissioned data", "Unclear data ownership", "Copilot adoption friction", "Privacy risk", "Missing rollout guardrails"],
    helps: ["Microsoft 365 readiness review", "Entra and identity review", "Purview alignment", "Defender and security control review", "Adoption governance"],
    deliverables: ["Copilot readiness findings", "Risk-ranked remediation plan", "Data governance recommendations", "Adoption control roadmap"],
    outcomes: ["Lower data exposure risk", "Improved governance", "Clearer rollout priorities", "Better user readiness"],
    credentials: ["Microsoft cloud security experience", "Azure Fundamentals", "Privacy and compliance experience", "CIPM"],
    engagement: ["Copilot readiness assessment", "Data exposure review", "Governance roadmap", "Implementation support"],
    cta: "Assess Copilot Readiness",
    contact: "enterprise",
  },
  "supplier-readiness": {
    slug: "supplier-readiness",
    title: "DefenseEye Supplier Readiness Datasheet",
    value: "DefenseEye is a Redmond, WA-based minority-owned AI, cybersecurity, Microsoft cloud, CMMC, and compliance automation supplier available for advisory, implementation, subcontracting, and staff augmentation opportunities.",
    who: ["Enterprise procurement teams", "Prime contractors", "Inclusive sourcing teams", "Microsoft-centered programs", "Regulated organizations"],
    problems: ["Need specialized AI and cybersecurity subcontractors", "Supplier capability evaluation", "Minority-owned supplier sourcing", "Compliance automation support needs"],
    helps: ["Advisory consulting", "Project delivery", "Staff augmentation", "Specialized subcontracting", "Platform-enabled consulting"],
    deliverables: ["Capability overview", "Supplier identifiers", "Credential summary", "Engagement model fit", "Procurement-ready contact path"],
    outcomes: ["Easier supplier evaluation", "Clear procurement details", "Specialized delivery capacity", "Stronger subcontracting readiness"],
    credentials: ["WA State UBI: 605-582-526", "CAGE: 9ZDL5", "UEI: E4DYPCKN7YN8", "DUNS: 119330734", "NAICS: 541512, 541519, 541690, 561621", "OMWBE-MBE Certified", "NMSDC-MBE Certified", "WA State SBE", "CMMC Level 1 Certified", "Multiple CMMC Certified Professionals", "NIST 800-171 Level 2 in progress", "CIPM", "Azure Fundamentals", "FedRAMP experience"],
    engagement: ["Advisory consulting", "Project delivery", "Staff augmentation", "Specialized subcontracting", "Platform-enabled consulting"],
    cta: "Discuss Supplier Opportunities",
    contact: "partners",
  },
};

const contactMap = {
  enterprise: ["Consulting", COMPANY.enterpriseEmail, "enterprise_email_click"] as const,
  partners: ["Supplier and partnership", COMPANY.partnersEmail, "partners_email_click"] as const,
  support: ["Product support", COMPANY.supportEmail, "support_email_click"] as const,
};

export default function Datasheets() {
  const [location] = useLocation();
  const slug = location.replace("/datasheets/", "");
  const sheet = location === "/datasheets" ? null : sheets[slug];

  if (!sheet) return <DatasheetIndex />;
  return <DatasheetDetail sheet={sheet} />;
}

function DatasheetIndex() {
  useSeo(
    "DefenseEye Datasheets | AI Adoption, CMMC Automation, CMMCLens, Copilot, Supplier Readiness",
    "Download concise DefenseEye datasheets for secure AI adoption, CMMC compliance automation, CMMCLens, Microsoft Copilot readiness, and supplier evaluation."
  );

  useEffect(() => {
    trackConversion("datasheet_view", { datasheet: "index" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <section className="section-navy nvidia-grid-bg px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">Procurement Assets</p>
          <h1 className="font-heading text-5xl font-bold">DefenseEye Datasheets</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Concise one-page overviews for enterprise buyers, procurement teams, partners, and regulated organizations evaluating DefenseEye.
          </p>
        </div>
      </section>
      <section className="section-light px-4 py-14">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.values(sheets).map((sheet) => (
            <a key={sheet.slug} href={`/datasheets/${sheet.slug}`} onClick={() => trackConversion(sheet.slug === "supplier-readiness" ? "supplier_datasheet_view" : "datasheet_view", { datasheet: sheet.slug })} className="group rounded-sm border border-border/50 bg-card p-6 transition-colors hover:border-primary/50">
              <FileText className="mb-4 size-6 text-primary" />
              <h2 className="font-heading text-2xl font-bold group-hover:text-primary">{sheet.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{sheet.value}</p>
              <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary">View datasheet <ArrowRight className="ml-1 size-4" /></span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function DatasheetDetail({ sheet }: { sheet: Sheet }) {
  const contact = contactMap[sheet.contact];
  const contactEvent = contact[2];

  useSeo(`${sheet.title} | DefenseEye Datasheets`, sheet.value);

  useEffect(() => {
    trackConversion(sheet.slug === "cmmclens" ? "cmmclens_product_sheet_view" : sheet.slug === "supplier-readiness" ? "supplier_datasheet_view" : "datasheet_view", { datasheet: sheet.slug });
    const id = "datasheet-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": sheet.slug === "cmmclens" ? "Product" : "Service",
        name: sheet.title,
        description: sheet.value,
        brand: { "@type": "Brand", name: "DefenseEye" },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: "Datasheets", item: "https://defenseeye.ai/datasheets" },
          { "@type": "ListItem", position: 3, name: sheet.title, item: `https://defenseeye.ai/datasheets/${sheet.slug}` },
        ],
      },
    ]);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, [sheet]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <section className="section-navy nvidia-grid-bg px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">DefenseEye Datasheet</p>
          <h1 className="font-heading text-5xl font-bold">{sheet.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{sheet.value}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion(sheet.slug === "cmmclens" ? "cmmclens_demo_click" : "consultation_click", { datasheet: sheet.slug })}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">{sheet.cta} <ArrowRight className="ml-2 size-4" /></Button>
            </a>
            <button type="button" onClick={() => { window.print(); trackConversion("datasheet_download", { datasheet: sheet.slug, format: "print_pdf" }); }}>
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10"><Download className="mr-2 size-4" /> Export / Print PDF</Button>
            </button>
          </div>
        </div>
      </section>
      <section className="section-light px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Block title="Who It Is For" items={sheet.who} />
          <Block title="Problems Addressed" items={sheet.problems} />
          <Block title="How DefenseEye Helps" items={sheet.helps} />
          <Block title="Key Deliverables" items={sheet.deliverables} />
          <Block title="Business Outcomes" items={sheet.outcomes} />
          <Block title="Relevant Credentials" items={sheet.credentials.length ? sheet.credentials : CERTIFICATIONS} />
          <Block title="Engagement Options" items={sheet.engagement.length ? sheet.engagement : ENGAGEMENT_MODELS} />
          {sheet.slug === "supplier-readiness" && <Block title="Supplier Facts" items={SUPPLIER_IDENTIFIERS.map(([k, v]) => `${k}: ${v}`)} />}
          <div className="rounded-sm border border-border/50 bg-card p-5">
            <h2 className="font-heading text-xl font-bold">Contact</h2>
            <p className="mt-3 text-sm text-muted-foreground">{contact[0]} inquiries</p>
            <a href={`mailto:${contact[1]}`} onClick={() => trackConversion(contactEvent, { datasheet: sheet.slug })} className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">
              {contact[1]}
            </a>
            <p className="mt-4 text-sm text-muted-foreground">Redmond, WA</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-sm border border-border/50 bg-card p-5">
      <h2 className="font-heading text-xl font-bold">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
