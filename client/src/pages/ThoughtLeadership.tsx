import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import RelatedResources from "@/components/RelatedResources";
import NavBar from "@/components/NavBar";
import { useSeo } from "@/hooks/useSeo";

import { GENERAL_DISCOVERY_BOOKING_URL } from "@/data/companyFacts";

import { INSIGHTS } from "@shared/insightsContent";

export default function ThoughtLeadership() {
  const [location] = useLocation();
  const slug = location.split("/").filter(Boolean).pop() ?? "";
  const page = INSIGHTS.find((item) => item.slug === slug) ?? INSIGHTS[0];

  useSeo(`${page.title} | DefenseEye`, page.description);

  useEffect(() => {
    const schema = [
      {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: page.title,
        description: page.description,
        url: `https://defenseeye.ai/insights/${page.slug}`,
        author: { "@type": "Organization", name: "DefenseEye" },
        publisher: { "@type": "Organization", name: "DefenseEye", url: "https://defenseeye.ai" },
        about: page.related.map((name) => ({ "@type": "Thing", name })),
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ];
    const id = "insight-schema";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.text = JSON.stringify(schema);
    document.head.appendChild(s);
    return () => document.getElementById(id)?.remove();
  }, [page]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="px-4">
        <article className="max-w-4xl mx-auto pt-16 pb-16">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">DefenseEye Insight</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-5">{page.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{page.description}</p>

          <section className="bg-primary/5 border border-primary/20 rounded-sm p-6 mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Direct Answer</p>
            <p className="text-foreground leading-relaxed">{page.answer}</p>
          </section>

          <div className="space-y-10">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{section.heading}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {section.points.map((point) => (
                    <div key={point} className="flex items-start gap-3 bg-card/50 border border-border/40 rounded-sm p-4">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-12 pt-10 border-t border-border/30">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-5">Frequently asked questions</h2>
            <div className="space-y-4">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="bg-card/40 border border-border/40 rounded-sm p-5">
                  <h3 className="font-heading font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 bg-card/50 border border-border/40 rounded-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <FileText className="w-8 h-8 text-primary shrink-0" />
              <div className="flex-1">
                <h2 className="font-heading text-xl font-bold text-foreground mb-2">Need an operational plan?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  DefenseEye helps organizations turn these concepts into governed programs, architecture decisions, evidence workflows, and readiness outcomes.
                </p>
              </div>
              <a href={GENERAL_DISCOVERY_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  Book a Consultation <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </section>
          <RelatedResources className="mt-14" />
        </article>
      </main>
      <Footer />
    </div>
  );
}
