import { useEffect } from "react";
import { Award, Building2, Download, Mail, Phone, ShieldCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { CAPABILITY_STATEMENT_PDF_URL, CERTIFICATIONS, COMPANY, CORE_COMPETENCIES, ENGAGEMENT_MODELS, SUPPLIER_IDENTIFIERS } from "@/data/companyFacts";
import { trackConversion } from "@/lib/tracking";

export default function SupplierReadiness() {
  useSeo(
    "Supplier Readiness | Minority-Owned AI, Cybersecurity, and Compliance Supplier | DefenseEye",
    "DefenseEye supplier readiness details for procurement teams: CAGE, UEI, DUNS, NAICS, OMWBE-MBE, NMSDC-MBE, CMMC Level 1, AI governance, cybersecurity, cloud security, and compliance automation capabilities."
  );

  useEffect(() => {
    const id = "supplier-readiness-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "DefenseEye",
        url: "https://defenseeye.ai/supplier-readiness",
        email: COMPANY.email,
        telephone: COMPANY.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: "9921 187th Ct NE",
          addressLocality: "Redmond",
          addressRegion: "WA",
          postalCode: "98052",
          addressCountry: "US",
        },
        identifier: SUPPLIER_IDENTIFIERS.map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
        serviceType: CORE_COMPETENCIES,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: "Supplier Readiness", item: "https://defenseeye.ai/supplier-readiness" },
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
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Supplier Readiness</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-5">
              Minority-owned AI, cybersecurity, cloud security, and compliance automation supplier
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              DefenseEye is available for advisory, implementation, subcontracting, staff augmentation, platform-enabled consulting, and compliance automation support across enterprise, government, defense contractor, and regulated environments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a href={CAPABILITY_STATEMENT_PDF_URL} onClick={() => trackConversion("capability_statement_download", { location: "supplier_readiness_hero" })}>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  Open Capability Statement <Download className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="/contact">
                <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                  Request Supplier Review
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 section-light">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
            <InfoPanel title="Company Snapshot" icon={<Building2 className="w-5 h-5 text-primary" />}>
              <p>DefenseEye</p>
              <p>{COMPANY.location}</p>
              <p>AI, cybersecurity, compliance automation, and Microsoft cloud consulting</p>
              <p>Minority-owned business</p>
            </InfoPanel>
            <InfoPanel title="Engagement Models" icon={<ShieldCheck className="w-5 h-5 text-primary" />}>
              {ENGAGEMENT_MODELS.map((item) => <p key={item}>{item}</p>)}
            </InfoPanel>
            <InfoPanel title="Contact" icon={<Mail className="w-5 h-5 text-primary" />}>
              <a href={`mailto:${COMPANY.email}`} onClick={() => trackConversion("email_click", { location: "supplier_readiness" })}>{COMPANY.email}</a>
              <a href={`tel:${COMPANY.phone.replace(/[^0-9]/g, "")}`} onClick={() => trackConversion("phone_click", { location: "supplier_readiness" })}>{COMPANY.phone}</a>
              <p>{COMPANY.address}</p>
            </InfoPanel>
          </div>
        </section>

        <section className="py-16 px-4 section-gray">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            <CardBlock title="Supplier Identifiers" items={SUPPLIER_IDENTIFIERS.map(([label, value]) => `${label}: ${value}`)} />
            <CardBlock title="Certifications & Status" items={CERTIFICATIONS} />
          </div>
        </section>

        <section className="py-16 px-4 section-light">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Core Supplier Capabilities</p>
              <h2 className="font-heading text-3xl font-bold">Capabilities relevant to procurement and subcontracting teams</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CORE_COMPETENCIES.map((item) => (
                <div key={item} className="bg-card/50 border border-border/40 rounded-sm p-5">
                  <Award className="w-5 h-5 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoPanel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card/50 border border-border/40 rounded-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h2 className="font-heading font-bold text-foreground">{title}</h2>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

function CardBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-card/50 border border-border/40 rounded-sm p-6">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-5">{title}</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item} className="border border-border/40 bg-background/40 rounded-sm p-4 text-sm text-muted-foreground">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
