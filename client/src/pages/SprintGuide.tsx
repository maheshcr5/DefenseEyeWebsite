import { useEffect } from "react";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

export default function SprintGuide() {
  useSeo(
    "The 4-Week CMMC Readiness Sprint Guide | DefenseEye",
    "The 4-week CMMC readiness sprint guide for defense contractors under deadline pressure: scope, gap assessment, remediation priorities, SSP/POA&M, and C3PAO readiness."
  );

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: "The 4-Week CMMC Readiness Sprint: How to Prepare for C3PAO Assessments on a Deadline",
      author: { "@type": "Organization", name: "DefenseEye" },
      publisher: { "@type": "Organization", name: "DefenseEye" },
      about: ["CMMC readiness", "C3PAO readiness", "NIST 800-171", "CMMC Level 2"],
      url: "https://defenseeye.ai/cmmc-readiness-sprint-guide",
    };
    const id = "sprint-guide-schema";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.text = JSON.stringify(schema);
    document.head.appendChild(s);
    return () => document.getElementById(id)?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 section-light">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <DefenseEyeLogo href="/" />
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <a href="/services/cmmc-readiness-sprint" className="hover:text-primary transition-colors">CMMC Sprint</a>
            <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="/cmmclens" className="hover:text-primary transition-colors">CMMCLens</a>
          </nav>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Book Urgent CMMC Call
            </Button>
          </a>
        </div>
      </header>

      <main className="px-4">
        <section className="max-w-5xl mx-auto pt-16 pb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Pillar Guide</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-5">
            The 4-Week CMMC Readiness Sprint
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            For defense contractors under contract pressure: a practical path to C3PAO readiness
            using focused advisory and CMMCLens automation.
          </p>

          <div className="space-y-5">
            {[
              {
                title: "Week 1: Scope and Baseline",
                points: [
                  "Define CUI boundary and critical systems",
                  "Run CMMC gap assessment against NIST 800-171",
                  "Establish immediate contract-risk priorities",
                ],
              },
              {
                title: "Week 2: Remediation Priority Plan",
                points: [
                  "Address high-impact gaps first",
                  "Launch real-time risk remediation tracking",
                  "Set owner/timeline for each open control",
                ],
              },
              {
                title: "Week 3: Documentation and Evidence",
                points: [
                  "Build SSP and POA&M in assessment-ready structure",
                  "Generate policies, procedures, and standards",
                  "Map artifacts to control families",
                ],
              },
              {
                title: "Week 4: C3PAO Readiness",
                points: [
                  "Pre-assessment walkthrough and interview prep",
                  "Finalize evidence package quality checks",
                  "Lock a practical execution plan for remaining gaps",
                ],
              },
            ].map((s) => (
              <div key={s.title} className="bg-card/50 border border-border/40 p-6 rounded-sm">
                <h2 className="font-heading text-2xl font-bold mb-3">{s.title}</h2>
                <ul className="space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Start My CMMC Sprint Plan <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

