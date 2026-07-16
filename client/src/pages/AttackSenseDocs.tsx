import { useEffect } from "react";
import { ArrowRight, Download, ExternalLink, FileText, ShieldCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CALENDLY_URL } from "@/data/companyFacts";
import { useSeo } from "@/hooks/useSeo";
import { trackConversion } from "@/lib/tracking";

const GUIDE_URL = "/docs/DefenseEye_AttackSense_Quick_Start_Guide.pdf";

export default function AttackSenseDocs() {
  useSeo(
    "AttackSense Guide | DefenseEye",
    "Read and download the DefenseEye AttackSense Guide for setup, onboarding, and early adoption guidance."
  );

  useEffect(() => {
    trackConversion("attacksense_docs_view");

    const id = "attacksense-docs-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "DefenseEye AttackSense Guide",
        name: "AttackSense Guide",
        description: "Quick start documentation for DefenseEye AttackSense setup and early adoption.",
        publisher: { "@type": "Organization", name: "DefenseEye", url: "https://defenseeye.ai" },
        url: "https://defenseeye.ai/attacksense/docs",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: "AttackSense", item: "https://defenseeye.ai/attacksense" },
          { "@type": "ListItem", position: 3, name: "AttackSense Guide", item: "https://defenseeye.ai/attacksense/docs" },
        ],
      },
    ]);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      <section className="section-navy nvidia-grid-bg px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <FileText className="size-4" /> AttackSense Guide
          </div>
          <h1 className="font-heading text-5xl font-bold leading-tight">DefenseEye AttackSense Guide</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Published guidance for getting started with AttackSense, aligning the workflow to your security operations process, and moving from raw findings to prioritized remediation.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={GUIDE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("attacksense_guide_open", { location: "docs_hero" })}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Open PDF <ExternalLink className="ml-2 size-4" />
              </Button>
            </a>
            <a href={GUIDE_URL} download onClick={() => trackConversion("attacksense_guide_download", { location: "docs_hero" })}>
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                <Download className="mr-2 size-4" /> Download Guide
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="section-light px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="overflow-hidden rounded-sm border border-border/60 bg-card">
            <iframe
              title="DefenseEye AttackSense Guide"
              src={GUIDE_URL}
              className="h-[72vh] min-h-[620px] w-full bg-white"
            />
          </div>
          <aside className="space-y-4">
            <div className="rounded-sm border border-border/50 bg-card p-5">
              <ShieldCheck className="mb-3 size-6 text-primary" />
              <h2 className="font-heading text-xl font-bold">Use This Guide For</h2>
              <ul className="mt-4 space-y-3">
                {[
                  "Initial AttackSense orientation",
                  "Security operations workflow alignment",
                  "Remediation ownership planning",
                  "Internal rollout and training conversations",
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-sm border border-primary/20 bg-primary/5 p-5">
              <h2 className="font-heading text-xl font-bold">Need Help Applying It?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                DefenseEye can help map AttackSense to your current vulnerability, attack surface, cloud security, and remediation workflows.
              </p>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("consultation_click", { location: "attacksense_docs_sidebar" })}>
                <Button className="mt-5 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Discuss AttackSense <ArrowRight className="ml-2 size-4" />
                </Button>
              </a>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
