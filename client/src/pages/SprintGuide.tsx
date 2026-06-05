import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import NavBar from "@/components/NavBar";
import { InfoTooltip } from "@/components/InfoTooltip";

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
      <NavBar />

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
                tooltip: "Before remediation, you need to know which systems actually handle CUI — your assessment boundary. Every system you legitimately exclude from scope eliminates dozens of controls you don't need to implement, document, or defend. Contractors who scope first routinely cut compliance overhead by 30–50% and avoid spending months fixing controls that never applied to their environment.",
                controls: ["CUI Boundary", "NIST 3.1 AC", "DFARS 7012"],
              },
              {
                title: "Week 2: Remediation Priority Plan",
                points: [
                  "Address high-impact gaps first",
                  "Launch real-time risk remediation tracking",
                  "Set owner/timeline for each open control",
                ],
                tooltip: "The 110 NIST controls carry unequal SPRS weight — some cost 5 points per gap, others just 1. A prioritized plan targets your highest-deduction controls first (MFA for privileged accounts: −5 pts, audit logging: −5 pts, boundary protection: −5 pts), so each hour of your lean IT team's time moves the SPRS score the most. Without priority order, contractors burn budget on low-weight gaps while high-weight ones stay open.",
                controls: ["SPRS Priority", "NIST 3.5.3 IA", "NIST 3.3.1 AU"],
              },
              {
                title: "Week 3: Documentation and Evidence",
                points: [
                  "Build SSP and POA&M in assessment-ready structure",
                  "Generate policies, procedures, and standards",
                  "Map artifacts to control families",
                ],
                tooltip: "C3PAO assessors verify evidence for every claimed control — not just policy statements. An SSP that maps each of the 110 controls to specific technical artifacts (screenshots, config exports, logs), paired with a POA&M documenting all open gaps with credible closure dates, is what separates a passed assessment from a conditional or failed one. Starting with a structured template eliminates the 3–6 month blank-page problem most contractors face.",
                controls: ["SSP", "POA&M", "C3PAO Evidence"],
              },
              {
                title: "Week 4: C3PAO Readiness",
                points: [
                  "Pre-assessment walkthrough and interview prep",
                  "Finalize evidence package quality checks",
                  "Lock a practical execution plan for remaining gaps",
                ],
                tooltip: "Most assessment failures aren't technical gaps — they're demonstration failures. Assessors ask your team to show controls working live, not just point at documents. A mock assessment walkthrough catches presentation gaps before they become official failures. C3PAO reassessments cost $20K–$80K per additional round — a pre-assessment review is the highest-ROI investment before booking your official date.",
                controls: ["C3PAO Prep", "NIST 3.12 CA", "Mock Assessment"],
              },
            ].map((s) => (
              <div key={s.title} className="bg-card/50 border border-border/40 p-6 rounded-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <h2 className="font-heading text-2xl font-bold">{s.title}</h2>
                  <InfoTooltip explanation={s.tooltip} controls={s.controls} side="right" />
                </div>
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

