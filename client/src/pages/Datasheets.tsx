import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle2, Download, FileText } from "lucide-react";
import RelatedResources from "@/components/RelatedResources";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CERTIFICATIONS, CMMCLENS_BOOKING_URL, COMPANY, ENGAGEMENT_MODELS, GENERAL_DISCOVERY_BOOKING_URL, SUPPLIER_IDENTIFIERS } from "@/data/companyFacts";
import { useSeo } from "@/hooks/useSeo";
import { trackConversion } from "@/lib/tracking";
import { DATASHEET_CONTENT, type Sheet } from "@shared/datasheetContent";

const sheets = DATASHEET_CONTENT;
const BOOKING_URLS = { general: GENERAL_DISCOVERY_BOOKING_URL, cmmclens: CMMCLENS_BOOKING_URL } as const;

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
      <Footer />
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
            <a href={BOOKING_URLS[sheet.booking]} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion(sheet.slug === "cmmclens" ? "cmmclens_demo_click" : "consultation_click", { datasheet: sheet.slug })}>
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
      <section className="section-light px-4 pb-12 print:hidden">
        <RelatedResources className="mx-auto max-w-6xl" />
      </section>
      <Footer />
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
