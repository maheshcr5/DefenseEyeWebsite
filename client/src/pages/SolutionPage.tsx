import { useEffect } from "react";
import { useLocation } from "wouter";
import { Activity, ArrowRight, BarChart3, Bot, CheckCircle2, ClipboardCheck, FileCheck, Network, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import RelatedResources from "@/components/RelatedResources";
import NavBar from "@/components/NavBar";
import { useSeo } from "@/hooks/useSeo";
import { GENERAL_DISCOVERY_BOOKING_URL } from "@/data/companyFacts";
import { trackCtaClick } from "@/lib/analytics";
import { intentFromCtaContext } from "@/lib/tracking";
import { SOLUTION_PAGE_CONTENT } from "@shared/solutionPageContent";

const MARKETPLACE_URL = "https://marketplace.microsoft.com/en-us/product/cmmc.defenseeye-cmmc-l2-continuous-compliance?tab=Overview";

const pages = SOLUTION_PAGE_CONTENT;

/** cta_click for a solution page; intent comes from the page or CTA destination when it is topic-specific. */
export function trackSolutionCta(pagePath: string, ctaHref: string, name: string, location: "solution_hero" | "solution_supplier") {
  trackCtaClick({
    name,
    location,
    intent: location === "solution_supplier" || name === "capability_statement" ? "supplier" : intentFromCtaContext(pagePath, ctaHref),
  });
}

const SOLUTION_ICONS: Record<string, typeof Bot> = {
  "/solutions/ai-transformation": Network,
  "/solutions/ai-governance": Bot,
  "/solutions/ai-security": ShieldCheck,
  "/solutions/microsoft-copilot-enablement": Sparkles,
  "/solutions/microsoft-copilot-readiness": Sparkles,
  "/solutions/cybersecurity-risk": Activity,
  "/solutions/compliance-automation": FileCheck,
  "/solutions/cloud-security": Network,
  "/solutions/cmmclens-platform": BarChart3,
};

export default function SolutionPage() {
  const [location] = useLocation();
  const config = pages[location] ?? pages["/solutions/ai-governance"];
  const Icon = SOLUTION_ICONS[location] ?? Bot;

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
            <a href={config.cta.href} onClick={() => trackSolutionCta(location, config.cta.href, "solution_primary", "solution_hero")}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                {config.cta.label} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="/capability-statement" onClick={() => trackSolutionCta(location, "/capability-statement", "capability_statement", "solution_hero")}>
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

        <RelatedResources className="max-w-6xl mx-auto pb-14" extraLinks={config.relatedLinks} />

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
            <a href={GENERAL_DISCOVERY_BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackSolutionCta(location, GENERAL_DISCOVERY_BOOKING_URL, "supplier_opportunities", "solution_supplier")}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Discuss Supplier Opportunities <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
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
