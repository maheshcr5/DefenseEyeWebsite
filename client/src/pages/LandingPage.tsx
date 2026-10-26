import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { CAPABILITY_STATEMENT_URL, CERTIFICATIONS, CMMCLENS_BOOKING_URL, GENERAL_DISCOVERY_BOOKING_URL } from "@/data/companyFacts";
import { trackConversion } from "@/lib/tracking";
import { LANDING_PAGE_CONTENT } from "@shared/landingPageContent";

const BOOKING_URLS = { general: GENERAL_DISCOVERY_BOOKING_URL, cmmclens: CMMCLENS_BOOKING_URL } as const;

export default function LandingPage() {
  const [location] = useLocation();
  const config = LANDING_PAGE_CONTENT[location] ?? LANDING_PAGE_CONTENT["/lp/ai-governance-consulting"];
  const bookingUrl = BOOKING_URLS[config.booking];
  useSeo(`${config.title} | DefenseEye`, config.desc);

  useEffect(() => {
    if (location.includes("ai-governance")) trackConversion("ai_governance_view", { location });
    if (location.includes("microsoft-supplier")) trackConversion("microsoft_ecosystem_view", { location });
    if (location.includes("cmmc")) trackConversion("cmmc_readiness_view", { location });
    const id = "landing-page-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: config.title,
        description: config.desc,
        provider: { "@type": "Organization", name: "DefenseEye", url: "https://defenseeye.ai" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How can DefenseEye help?",
            acceptedAnswer: { "@type": "Answer", text: config.helps.join(" ") },
          },
          {
            "@type": "Question",
            name: "What outcome should buyers expect?",
            acceptedAnswer: { "@type": "Answer", text: config.outcomes.join(" ") },
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: config.title, item: `https://defenseeye.ai${location}` },
        ],
      },
    ]);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <section className="pt-16 pb-14 px-4 section-navy">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">DefenseEye</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-5">{config.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{config.desc}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold self-start sm:self-auto">
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("landing_page_cta_click", { location, cta: config.cta })}>{config.cta} <ArrowRight className="w-4 h-4 ml-2" /></a>
            </Button>
            <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 self-start sm:self-auto">
              <a href={CAPABILITY_STATEMENT_URL} onClick={() => trackConversion("landing_page_cta_click", { location, cta: "capability_statement" })}>Request Capability Statement</a>
            </Button>
          </div>
        </div>
      </section>
      <LandingSection title="Common Pain Points" items={config.pains} />
      <LandingSection title="How DefenseEye Helps" items={config.helps} gray />
      <LandingSection title="Outcomes" items={config.outcomes} />
      <section className="py-14 px-4 section-gray">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="bg-card/50 border border-border/40 rounded-sm p-6">
            <h2 className="font-heading text-xl font-bold mb-3">Representative Engagement</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{config.engagement}</p>
          </div>
          <div className="bg-card/50 border border-border/40 rounded-sm p-6">
            <h2 className="font-heading text-xl font-bold mb-3">Relevant Credentials</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{CERTIFICATIONS.slice(0, 5).join(" · ")}</p>
          </div>
          <div className="bg-card/50 border border-border/40 rounded-sm p-6">
            <h2 className="font-heading text-xl font-bold mb-3">Economic Impact</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{config.outcomes.join(", ")} through focused readiness work, fewer manual loops, and clearer ownership.</p>
          </div>
          <div className="bg-card/50 border border-border/40 rounded-sm p-6">
            <h2 className="font-heading text-xl font-bold mb-3">Deliverables</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Readiness findings, prioritized roadmap, executive summary, and implementation next steps aligned to the selected portfolio.</p>
          </div>
        </div>
      </section>
      <section className="py-14 px-4 section-light">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="bg-card/50 border border-border/40 rounded-sm p-6">
            <h2 className="font-heading text-xl font-bold mb-3">How can DefenseEye help?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{config.helps.join(" ")}</p>
          </div>
          <div className="bg-card/50 border border-border/40 rounded-sm p-6">
            <h2 className="font-heading text-xl font-bold mb-3">What outcome should buyers expect?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{config.outcomes.join(" ")}</p>
          </div>
        </div>
      </section>
      <div data-conversion-hook={location.replace(/\W+/g, "_")} className="sr-only" />
    </div>
  );
}

function LandingSection({ title, items, gray = false }: { title: string; items: string[]; gray?: boolean }) {
  return (
    <section className={`py-14 px-4 ${gray ? "section-gray" : "section-light"}`}>
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-2xl font-bold mb-6">{title}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item} className="bg-card/50 border border-border/40 rounded-sm p-5">
              <CheckCircle2 className="w-5 h-5 text-primary mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
