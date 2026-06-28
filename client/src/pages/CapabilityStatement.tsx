import { useEffect } from "react";
import { Download, Mail, Phone } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { CERTIFICATIONS, COMPANY, CORE_COMPETENCIES, ENGAGEMENT_MODELS, SUPPLIER_IDENTIFIERS } from "@/data/companyFacts";
import { trackConversion } from "@/lib/tracking";

const DIFFERENTIATORS = [
  "Minority-owned AI, cybersecurity, and compliance automation supplier",
  "Practitioner-led Microsoft cloud, AI governance, federal cybersecurity, and compliance experience",
  "Proprietary CMMCLens platform for compliance evidence automation",
  "Ability to support advisory, implementation, subcontracting, and staff augmentation engagements",
  "Focus on regulated, defense contractor, and Microsoft-centered environments",
];

export default function CapabilityStatement() {
  useSeo(
    "DefenseEye Capability Statement | AI, Cybersecurity, CMMC, and Compliance Automation",
    "DefenseEye provides AI governance, cybersecurity, CMMC advisory, Microsoft cloud security, compliance automation, and CMMCLens platform capability for enterprise, government, and regulated environments."
  );

  useEffect(() => {
    const id = "capability-statement-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "DefenseEye Capability Statement",
        url: "https://defenseeye.ai/capability-statement",
        mainEntity: {
          "@type": "Organization",
          name: COMPANY.legalName,
          url: "https://defenseeye.ai",
          email: COMPANY.enterpriseEmail,
          telephone: COMPANY.phone,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Redmond",
            addressRegion: "WA",
            addressCountry: "US",
          },
          identifier: SUPPLIER_IDENTIFIERS.map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "DefenseEye",
        url: "https://defenseeye.ai",
        email: COMPANY.enterpriseEmail,
        address: { "@type": "PostalAddress", addressLocality: "Redmond", addressRegion: "WA", addressCountry: "US" },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: "Capability Statement", item: "https://defenseeye.ai/capability-statement" },
        ],
      },
    ]);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main>
        <section className="pt-16 pb-14 px-4 section-navy">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Capability Statement</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-5">
              DefenseEye Capability Statement
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              AI, cybersecurity, Microsoft cloud, CMMC, and compliance automation capability for enterprise, government, defense contractor, and regulated environments.
            </p>
            {/* TODO: Publish a corrected PDF only after confirming it contains no residential street address or personal email. */}
            <a href="/contact?inquiry=supplier" onClick={() => trackConversion("capability_statement_download", { location: "capability_statement_page_request" })}>
              <Button className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Request PDF Capability Statement <Download className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </section>

        <section className="py-16 px-4 section-light">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
            <Block title="Company Overview" items={[
              "DefenseEye is a Redmond, WA-based AI-driven cybersecurity and compliance automation firm serving defense contractors, government contractors, public-sector organizations, and regulated enterprises.",
              `${COMPANY.name} | ${COMPANY.location} | ${COMPANY.website}`,
              "Available for advisory, implementation, staff augmentation, specialized subcontracting, and platform-enabled consulting",
              "CMMCLens flagship compliance automation platform",
            ]} />
            <Block title="Supplier Identifiers" items={SUPPLIER_IDENTIFIERS.map(([label, value]) => `${label}: ${value}`)} />
            <Block title="Core Competencies" items={CORE_COMPETENCIES} />
            <Block title="Certifications & Status" items={CERTIFICATIONS} />
            <Block title="Differentiators" items={DIFFERENTIATORS} />
            <Block title="Representative Engagement Models" items={ENGAGEMENT_MODELS} />
          </div>
        </section>

        <section className="py-14 px-4 section-gray">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold mb-4">Contact Information</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm text-muted-foreground">
              <a className="inline-flex items-center justify-center gap-2 hover:text-primary" href={`mailto:${COMPANY.enterpriseEmail}`} onClick={() => trackConversion("enterprise_email_click", { location: "capability_statement" })}>
                <Mail className="w-4 h-4" /> {COMPANY.enterpriseEmail}
              </a>
              <a className="inline-flex items-center justify-center gap-2 hover:text-primary" href={`mailto:${COMPANY.partnersEmail}`} onClick={() => trackConversion("partners_email_click", { location: "capability_statement_partners" })}>
                <Mail className="w-4 h-4" /> {COMPANY.partnersEmail}
              </a>
              <a className="inline-flex items-center justify-center gap-2 hover:text-primary" href={`mailto:${COMPANY.supportEmail}`} onClick={() => trackConversion("support_email_click", { location: "capability_statement_support" })}>
                <Mail className="w-4 h-4" /> {COMPANY.supportEmail}
              </a>
              <a className="inline-flex items-center justify-center gap-2 hover:text-primary" href={`tel:${COMPANY.phone.replace(/[^0-9]/g, "")}`} onClick={() => trackConversion("phone_click", { location: "capability_statement" })}>
                <Phone className="w-4 h-4" /> {COMPANY.phone}
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-4">{COMPANY.address}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-card/50 border border-border/40 rounded-sm p-6">
      <h2 className="font-heading text-xl font-bold mb-4">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
