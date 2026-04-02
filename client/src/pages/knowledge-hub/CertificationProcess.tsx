/*
 * CMMC Certification Process — Step-by-Step Guide
 * Route: /knowledge-hub/certification-process
 */

import { useEffect } from "react";
import { Link } from "wouter";
import KnowledgeHubLayout from "@/components/KnowledgeHubLayout";
import { CheckCircle2, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOC = [
  { id: "overview", label: "Certification Roadmap Overview" },
  { id: "step1", label: "Step 1: Gap Assessment" },
  { id: "step2", label: "Step 2: SSP & POA&M Creation" },
  { id: "step3", label: "Step 3: Implementing Controls" },
  { id: "step4", label: "Step 4: Selecting a C3PAO" },
  { id: "step5", label: "Step 5: Pre-Assessment Prep" },
  { id: "step6", label: "Step 6: The C3PAO Assessment" },
  { id: "step7", label: "Step 7: Receiving Your Certificate" },
  { id: "post-cert", label: "Maintaining Compliance" },
  { id: "timeline-cost", label: "Timeline & Cost Expectations" },
  { id: "automation", label: "How CMMC Lens Accelerates Each Step" },
  { id: "faq", label: "FAQ" },
];

const RELATED = [
  { title: "What is CMMC?", href: "/knowledge-hub/what-is-cmmc", description: "Complete intro to the CMMC framework, levels, and key terminology." },
  { title: "CMMC Level 1 vs Level 2", href: "/knowledge-hub/cmmc-levels", description: "Detailed comparison of both certification levels." },
  { title: "Understanding Your SPRS Score", href: "/knowledge-hub/sprs-score", description: "How SPRS is calculated and how to improve it before assessment." },
];

const STEPS = [
  {
    num: "01",
    title: "Gap Assessment and Baseline Evaluation",
    id: "step1",
    description: "The first step is establishing your current security posture against all 110 NIST 800-171 controls. This gap assessment identifies which controls are fully implemented, partially implemented, or not implemented — and produces an initial SPRS score.",
    details: [
      "Inventory all systems, networks, and assets that store, process, or transmit CUI",
      "Map existing security tools and configurations to NIST 800-171 control requirements",
      "Document all gaps with risk ratings (critical, high, medium, low)",
      "Calculate your preliminary SPRS score to set a readiness baseline",
      "Identify quick wins vs. long-term remediation items",
    ],
    timeManual: "4–8 weeks",
    timeWithLens: "3–5 days",
    note: "A thorough gap assessment is the most critical investment — it drives all subsequent planning.",
  },
  {
    num: "02",
    title: "Remediation Planning: SSP and POA&M",
    id: "step2",
    description: "Based on gap assessment findings, create your System Security Plan (SSP) — the master document describing how your organization implements each NIST 800-171 control — and your Plan of Action & Milestones (POA&M), which documents how and when you will address each gap.",
    details: [
      "SSP must cover all 110 controls: implemented, planned, or inherited from a cloud service provider",
      "POA&M entries must include responsible owner, target completion date, and mitigation approach",
      "Define your system boundary (what systems are in scope for CUI processing)",
      "Document control inheritance from cloud providers (AWS FedRAMP, Microsoft GCC High)",
      "SSP is a living document — update it continuously as controls are implemented",
    ],
    timeManual: "3–8 weeks",
    timeWithLens: "1–3 days (auto-generated)",
    note: "C3PAOs review your SSP first — a well-structured SSP significantly streamlines the assessment.",
  },
  {
    num: "03",
    title: "Implementing Required Controls",
    id: "step3",
    description: "This is the largest phase — actually implementing the security controls identified as gaps. The timeline varies significantly based on the number and severity of gaps found in your baseline assessment.",
    details: [
      "Prioritize by SPRS impact: fix highest-point-value controls first (MFA, encryption, audit logging)",
      "Implement access controls: least privilege, separation of duties, privileged account management",
      "Deploy multi-factor authentication for all CUI-system access",
      "Enable FIPS 140-2 validated encryption for data at rest and in transit",
      "Establish continuous audit logging and log review procedures",
      "Develop and test an incident response plan",
      "Implement configuration management baseline and change control",
      "Conduct security awareness training for all personnel with CUI access",
    ],
    timeManual: "3–12 months",
    timeWithLens: "3–12 months (remediation is hands-on, but CMMC Lens tracks progress)",
    note: "Remediation is the one phase that cannot be fully automated — it requires real security engineering work.",
  },
  {
    num: "04",
    title: "Selecting a C3PAO",
    id: "step4",
    description: "A Certified Third-Party Assessment Organization (C3PAO) must conduct your CMMC Level 2 assessment. All authorized C3PAOs are listed in the CMMC-AB marketplace at cyberAB.org.",
    details: [
      "Search cyberAB.org for C3PAOs with availability and relevant industry experience",
      "Request proposals from 2–3 organizations to compare scope and cost",
      "Verify the C3PAO's authorization status is 'Authorized' (not 'Candidate')",
      "Confirm assessors are Certified CMMC Assessors (CCAs) or Certified CMMC Professionals (CCPs)",
      "Review their assessment methodology and expected deliverables",
      "Sign a Letter of Engagement and Non-Disclosure Agreement",
      "Schedule the assessment — expect 2–4 month lead times for quality C3PAOs",
    ],
    timeManual: "2–6 weeks (scheduling)",
    timeWithLens: "2–6 weeks (CMMC Lens helps prepare your evidence package for C3PAO handoff)",
    note: "Do not select the cheapest option — choose a C3PAO with documented experience in your industry.",
  },
  {
    num: "05",
    title: "Pre-Assessment Preparation",
    id: "step5",
    description: "In the weeks before your assessment, focus on assembling and organizing the evidence package your C3PAO will review. This is where thorough documentation pays off.",
    details: [
      "Compile evidence for all 110 controls: policies, logs, screenshots, configurations, training records",
      "Organize evidence by NIST 800-171 control family and control number",
      "Conduct an internal mock assessment using NIST 800-171A assessment procedures",
      "Remediate any critical gaps identified in the mock assessment",
      "Brief all personnel who will be interviewed during the assessment",
      "Prepare your network diagrams and system boundary documentation",
      "Ensure all POA&M items are current and assigned",
    ],
    timeManual: "4–8 weeks",
    timeWithLens: "1–2 weeks (CMMC Lens auto-generates the evidence package)",
    note: "C3PAOs report that disorganized evidence packages are the #1 cause of assessment delays.",
  },
  {
    num: "06",
    title: "The C3PAO Assessment Process",
    id: "step6",
    description: "The formal CMMC Level 2 assessment typically runs 3–5 days on-site (or remotely) and follows NIST 800-171A assessment procedures. Assessors use three methods: examine (document review), interview (personnel), and test (technical verification).",
    details: [
      "Day 1: Kickoff meeting, system boundary walk-through, initial document review",
      "Days 2–3: Evidence review for all 110 controls by control family",
      "Day 3–4: Personnel interviews (IT staff, system owners, security personnel, end users)",
      "Day 4–5: Technical testing (access controls, encryption verification, audit log review)",
      "Final day: Preliminary findings briefing and Plan of Action discussion",
      "Post-assessment: C3PAO submits findings to CMMC-AB for quality review",
      "Certificate issuance: typically 30–60 days after assessment completion",
    ],
    timeManual: "3–5 days on-site + 30–60 days for certificate",
    timeWithLens: "Same timeline — but better-organized evidence reduces assessment duration",
    note: "Be transparent with assessors — attempting to obscure gaps typically results in conditional findings or failure.",
  },
  {
    num: "07",
    title: "Receiving Your CMMC Certificate",
    id: "step7",
    description: "After the assessment, the C3PAO submits results to the CMMC Accreditation Body (CMMC-AB) for quality review. Upon approval, your organization receives a CMMC Level 2 certificate valid for 3 years.",
    details: [
      "Assessment results are submitted to CMMC-AB within 5 business days",
      "CMMC-AB quality review takes approximately 30–60 days",
      "If conditional: you have 180 days to remediate POFAMs (Plan of Action for Assessment Method failures)",
      "Certificate is issued and posted in the Supplier Performance Risk System (SPRS)",
      "Your DoD contracting officers can verify certification status in SPRS",
      "Annual self-affirmations are required during the 3-year certificate period",
    ],
    timeManual: "30–90 days post-assessment",
    timeWithLens: "Same — CMMC Lens helps you prepare annual affirmation evidence",
    note: "A Conditional CMMC Certificate allows you to bid on contracts while remediating remaining gaps.",
  },
];

export default function CertificationProcess() {
  useEffect(() => {
    document.title = "CMMC Certification Process Step-by-Step (2025) | DefenseEye.ai Knowledge Hub";
  }, []);

  return (
    <KnowledgeHubLayout
      title="CMMC Certification Process Step-by-Step (2025)"
      description="A complete walkthrough of the CMMC Level 2 certification journey — from initial gap assessment through C3PAO audit, with timeline and cost expectations at each phase."
      lastUpdated="April 2025"
      tocItems={TOC}
      relatedArticles={RELATED}
      schemaType="Article"
    >
      {/* Quick Answer */}
      <div className="bg-primary/5 border border-primary/20 p-5 mb-8">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Quick Answer</p>
        <p className="text-foreground leading-relaxed">
          CMMC Level 2 certification involves 7 steps: gap assessment, SSP/POA&M creation, control remediation, C3PAO selection, pre-assessment preparation, the formal C3PAO assessment (3–5 days), and certificate issuance. The full process takes 6–18 months manually. Using CMMC Lens reduces the documentation-heavy phases by up to 80%, but hands-on remediation still requires dedicated security engineering effort.
        </p>
      </div>

      {/* Roadmap Overview */}
      <section id="overview">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Overview: The CMMC Level 2 Certification Roadmap</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Achieving CMMC Level 2 certification is a multi-phase journey that demands executive commitment, dedicated IT resources, and external expertise. Unlike CMMC Level 1 (annual self-assessment), Level 2 requires a formal assessment by a Certified Third-Party Assessment Organization (C3PAO) — which means your evidence must be bulletproof before you engage an assessor.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The seven steps below represent the standard path to certification. The total timeline depends heavily on your current security posture: organizations with mature security programs may complete remediation in 3–4 months, while organizations starting from scratch may require 12–18 months.
        </p>

        {/* Visual timeline */}
        <div className="overflow-x-auto mb-8">
          <div className="flex items-center gap-0 min-w-max">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center font-heading font-bold text-primary text-sm">
                    {s.num}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1.5 text-center max-w-[80px]">{s.title.split(":")[0].replace(/Step \d+ —? ?/, "")}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-8 h-0.5 bg-border/60 mx-1 mb-4" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Each Step */}
      {STEPS.map((step) => (
        <section id={step.id} key={step.id} className="mb-10">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded border border-primary/30 bg-primary/10 flex items-center justify-center shrink-0">
              <span className="font-heading font-bold text-primary text-lg">{step.num}</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground pt-2">{step.title}</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
          <ul className="space-y-2 mb-5">
            {step.details.map((d) => (
              <li key={d} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-card/40 border border-border/30 p-3">
              <p className="text-xs font-medium text-muted-foreground/70 uppercase mb-1">Manual Timeline</p>
              <p className="text-sm font-semibold text-foreground">{step.timeManual}</p>
            </div>
            <div className="bg-primary/5 border border-primary/20 p-3">
              <p className="text-xs font-medium text-primary/70 uppercase mb-1">With CMMC Lens</p>
              <p className="text-sm font-semibold text-primary">{step.timeWithLens}</p>
            </div>
          </div>
          {step.note && (
            <div className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/20 p-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-amber-400">Note:</span> {step.note}</p>
            </div>
          )}
        </section>
      ))}

      {/* Post-Certification */}
      <section id="post-cert" className="mb-10">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Maintaining CMMC Compliance Post-Certification</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          A CMMC Level 2 certificate is valid for 3 years, but compliance is not a one-time event. The DoD requires annual self-affirmations — a senior official (typically CISO or CEO) must affirm continued compliance each year via SPRS.
        </p>
        <ul className="space-y-2 mb-4">
          {[
            "Submit annual self-affirmation in SPRS confirming continued compliance",
            "Update SSP to reflect any configuration changes, new systems, or personnel changes",
            "Monitor for new CVEs and vulnerabilities affecting in-scope systems",
            "Maintain audit logs for minimum 3 years (or as required by contract)",
            "Report cyber incidents to DoD within 72 hours per DFARS 252.204-7012",
            "Conduct annual security awareness training for all CUI-handling personnel",
            "Review and update POA&M items quarterly",
          ].map((i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{i}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Timeline & Cost Table */}
      <section id="timeline-cost" className="mb-10">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Timeline and Cost Expectations</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm" role="table">
            <thead>
              <tr className="border-b-2 border-primary/30">
                <th className="text-left py-3 px-3 font-heading font-semibold text-foreground">Phase</th>
                <th className="text-center py-3 px-3 font-heading font-semibold text-muted-foreground">Manual Timeline</th>
                <th className="text-center py-3 px-3 font-heading font-semibold text-primary">With CMMC Lens</th>
                <th className="text-center py-3 px-3 font-heading font-semibold text-muted-foreground">Typical Cost (Manual)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Gap Assessment", "4–8 weeks", "3–5 days", "$15,000–$40,000"],
                ["SSP & POA&M Creation", "3–8 weeks", "1–3 days", "$10,000–$30,000"],
                ["Control Remediation", "3–12 months", "3–12 months", "$50,000–$500,000+"],
                ["C3PAO Selection", "2–6 weeks", "2–6 weeks", "N/A"],
                ["Pre-Assessment Prep", "4–8 weeks", "1–2 weeks", "$10,000–$25,000"],
                ["C3PAO Assessment", "3–5 days", "3–5 days", "$30,000–$100,000"],
                ["Certificate Issuance", "30–90 days", "30–90 days", "Included"],
                ["Total (excl. remediation)", "~6–12 months", "~4–8 months", "$65,000–$195,000+"],
              ].map(([phase, manual, lens, cost], i) => (
                <tr key={phase} className={`border-b border-border/30 ${i % 2 === 0 ? "bg-card/30" : ""}`}>
                  <td className="py-3 px-3 font-medium text-foreground">{phase}</td>
                  <td className="py-3 px-3 text-center text-muted-foreground">{manual}</td>
                  <td className="py-3 px-3 text-center text-primary font-medium">{lens}</td>
                  <td className="py-3 px-3 text-center text-muted-foreground">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          Cost estimates are based on industry benchmarks. Actual costs vary significantly by organization size, existing security posture, and C3PAO selected. CMMC Lens pricing starts at $499/month for Level 2.
        </p>
      </section>

      {/* CMMC Lens CTA section */}
      <section id="automation" className="mb-10 bg-primary/5 border border-primary/20 p-6">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
          How CMMC Lens Accelerates Each Step
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-5">
          CMMC Lens directly compresses the most documentation-intensive phases of certification — gap assessment, SSP/POA&M generation, and pre-assessment evidence packaging — while providing continuous monitoring to protect your compliance posture after certification.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          {[
            { step: "Gap Assessment", impact: "Automated scan reduces 4–8 weeks to 3–5 days" },
            { step: "SSP Generation", impact: "Auto-generates from evidence collection — 80% faster" },
            { step: "POA&M Creation", impact: "Gap findings automatically populate POA&M with remediation priorities" },
            { step: "Evidence Package", impact: "Pre-assessment evidence package auto-assembled for C3PAO handoff" },
            { step: "SPRS Tracking", impact: "Real-time score dashboard shows which controls to fix first" },
            { step: "Post-Cert Monitoring", impact: "365-day continuous monitoring with annual affirmation support" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-semibold text-foreground">{item.step}: </span>
                <span className="text-sm text-muted-foreground">{item.impact}</span>
              </div>
            </div>
          ))}
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          Start Your Free Trial — No Credit Card Required
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </section>

      {/* FAQ */}
      <section id="faq" className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Can I use a Conditional CMMC Certificate to bid on contracts?",
              a: "Yes. A Conditional CMMC Certificate is issued when an organization passes most controls but has minor findings. You have 180 days to remediate the remaining gaps (Plan of Action for Assessment Method, or POFAM). During this period, you can bid on and win DoD contracts.",
            },
            {
              q: "What happens if we fail the C3PAO assessment?",
              a: "If you receive a 'Not Met' finding on a significant number of controls, the C3PAO cannot issue a certificate. You will receive detailed findings and must remediate before scheduling a re-assessment. There is no penalty for failing — you simply cannot receive CMMC-required contracts until certified.",
            },
            {
              q: "Do subcontractors need their own CMMC certification?",
              a: "Yes, if the subcontractor handles, processes, or stores CUI. Prime contractors must flow down CMMC requirements to subcontractors who touch CUI under DFARS 252.204-7012. Subcontractors need their own CMMC Level 2 certification — they cannot rely on the prime's certificate.",
            },
            {
              q: "How often must we re-certify?",
              a: "CMMC Level 2 certificates are valid for 3 years. Annual self-affirmations must be submitted to SPRS each year affirming continued compliance. Significant changes to your environment (major infrastructure changes, mergers, new CUI systems) may require a re-assessment before the 3-year mark.",
            },
            {
              q: "What is the difference between CMMC and DFARS 252.204-7012?",
              a: "DFARS 252.204-7012 is the existing contractual requirement to implement NIST 800-171 and self-assert compliance. CMMC 2.0 builds on this by adding mandatory third-party assessment (for Level 2) and formal certification. CMMC does not replace DFARS — both requirements coexist.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border border-border/40 bg-card/30 p-5">
              <h3 className="font-heading font-semibold text-foreground mb-2">{q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <div className="border-t border-border/30 pt-6 mt-6">
        <p className="text-sm text-muted-foreground mb-3">Continue reading:</p>
        <div className="flex flex-wrap gap-3">
          {RELATED.map((r) => (
            <Link key={r.href} href={r.href} className="text-sm text-primary hover:underline flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5" />{r.title}
            </Link>
          ))}
        </div>
      </div>
    </KnowledgeHubLayout>
  );
}
