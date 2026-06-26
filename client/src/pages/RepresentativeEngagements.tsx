import { ArrowRight, ClipboardCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { CALENDLY_URL } from "@/data/companyFacts";
import { trackConversion } from "@/lib/tracking";

const engagements = [
  ["Microsoft Copilot Governance Readiness", "An organization plans to expand Copilot usage but needs clarity on data exposure, permissions, privacy, and governance risks.", "Assess Microsoft 365, identity, information governance, data protection, policy, and adoption readiness.", "Risk findings, governance recommendations, adoption guardrails, readiness roadmap.", "More secure and accountable Copilot adoption."],
  ["AI Governance Program Setup", "Leadership needs a practical governance model for generative AI and enterprise AI use cases.", "Align AI inventory, policies, oversight, risk assessment, human accountability, and NIST AI RMF/ISO 42001 readiness.", "AI governance charter, use case intake model, risk controls, oversight workflow.", "Governed AI adoption with clear accountability."],
  ["CMMC Level 2 Readiness Sprint", "A defense contractor needs to prepare for NIST 800-171 / CMMC Level 2 expectations.", "Assess control gaps, SSP, POA&M, SPRS, evidence, policies, and remediation priorities.", "Gap analysis, readiness roadmap, evidence plan, executive summary.", "Improved CMMC readiness and reduced assessment friction."],
  ["Compliance Evidence Automation", "Compliance evidence is fragmented across systems, people, and manual documentation.", "Use CMMCLens and workflow automation to map controls, collect evidence, track gaps, and monitor readiness.", "Evidence workflows, dashboards, control mapping, documentation support.", "Reduced manual compliance effort and stronger traceability."],
  ["Azure Security and Compliance Review", "A Microsoft cloud environment requires stronger security, governance, identity, and compliance alignment.", "Review Azure, Entra, Defender, Sentinel, Purview, policy, logging, and secure architecture patterns.", "Security findings, prioritized roadmap, control alignment, governance recommendations.", "Stronger Microsoft cloud security and compliance posture."],
  ["AI Security Assessment", "Generative AI, LLMs, or AI agents introduce data exposure, prompt injection, identity, and monitoring risks.", "Evaluate AI workflows, access controls, guardrails, logging, model/data risk, and operational oversight.", "AI risk register, mitigation roadmap, security control recommendations.", "Reduced AI risk and improved operational control."],
];

export default function RepresentativeEngagements() {
  useSeo(
    "Representative Engagements | DefenseEye",
    "Representative engagement types DefenseEye is positioned to support, including Copilot governance, AI governance, CMMC readiness, evidence automation, Azure security, and AI security assessments."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <section className="pt-16 pb-14 px-4 section-navy">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Representative Engagements</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-5">Examples of engagement types DefenseEye is positioned to support</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            These examples describe possible engagement structures and deliverables. They are not completed customer case studies or performance claims.
          </p>
        </div>
      </section>
      <section className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-5">
          {engagements.map(([title, situation, approach, deliverables, outcome]) => (
            <div key={title} className="bg-card/50 border border-border/40 rounded-sm p-6">
              <ClipboardCheck className="w-5 h-5 text-primary mb-4" />
              <h2 className="font-heading text-xl font-bold mb-4">{title}</h2>
              <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <p><span className="text-foreground font-medium">Situation:</span> {situation}</p>
                <p><span className="text-foreground font-medium">Approach:</span> {approach}</p>
                <p><span className="text-foreground font-medium">Deliverables:</span> {deliverables}</p>
                <p><span className="text-foreground font-medium">Expected outcome:</span> {outcome}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-4xl mx-auto text-center mt-12">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("consultation_booking_click", { location: "representative_engagements" })}>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Discuss an Engagement Model <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
