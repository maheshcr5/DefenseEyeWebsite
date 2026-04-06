import { useEffect, useState } from "react";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { ArrowRight, CheckCircle2, Zap, FileCheck, Activity, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

// ─── FAQ Item ──────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 bg-card/40 rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card/70 transition-colors duration-200"
        aria-expanded={open}
      >
        <span className="font-heading font-semibold text-foreground pr-4 text-sm md:text-base leading-snug">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-primary shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── FAQ Data — sourced from Reddit r/CMMC, Discord, Quora, forums ─────────
const FAQ_ITEMS = [
  // ── CMMCLens-specific
  {
    question: "What is CMMCLens and how does it work?",
    answer:
      "CMMCLens is DefenseEye's CMMC Level 2 readiness automation platform. It maps your technical environment against all 110 NIST SP 800-171 Rev. 2 controls, auto-collects evidence from your Microsoft 365 GCC High or Azure Government tenant, generates your System Security Plan (SSP) and POA&M in real time, and tracks your live SPRS score. You connect your environment, CMMCLens runs the assessment logic, and your advisory team reviews gaps with you — no months of manual spreadsheet work.",
  },
  {
    question: "How quickly can CMMCLens get our company assessment-ready?",
    answer:
      "For a company that has already done some basic security hygiene, CMMCLens typically compresses a 12-month preparation timeline to 3–5 months when paired with DefenseEye advisory. Companies starting from scratch can realistically reach C3PAO-ready status in 6–9 months. The biggest variable is how many high-weighted controls (3-point and 5-point deductions) are unimplemented — CMMCLens prioritizes those first so you close the right gaps in the right order.",
  },
  {
    question: "Can small teams with limited IT staff use CMMCLens?",
    answer:
      "Yes — CMMCLens is specifically designed for small-to-mid defense contractors with 10 to 300 employees and lean IT teams. It automates the evidence collection work that typically requires a full-time compliance analyst, and paired with DefenseEye advisors it means you don't need to hire a CMMC expert internally. Most of our clients have one IT generalist on staff, not a dedicated security team.",
  },
  {
    question: "Do I need CMMC Level 1 or Level 2?",
    answer:
      "It depends on whether your contracts involve Controlled Unclassified Information (CUI). CMMC Level 1 covers 17 basic practices from FAR 52.204-21 and applies to companies handling only Federal Contract Information (FCI) — annual self-attestation is allowed. CMMC Level 2 covers all 110 practices from NIST SP 800-171 Rev. 2 and is required for any company that processes, stores, or transmits CUI. If your contract has a DFARS 252.204-7012 clause, or if you work on programs involving weapons systems, technical data, or sensitive DoD information, you almost certainly need Level 2. CMMCLens supports both levels.",
  },
  // ── SPRS Score — top Reddit/Quora question
  {
    question: "What is the fastest way to improve our SPRS score?",
    answer:
      "Focus on the 5-point deduction controls first — these are the high-impact controls that drop your score the most per gap. Key ones: MFA for all privileged accounts (3.5.3, 5 pts), system audit logging (3.3.1, 5 pts), boundary protection and network access controls (3.13.1, 5 pts), and incident response plan (3.6.1, 5 pts). Next, tackle 3-point controls like media sanitization, configuration management baselines, and access control reviews. CMMCLens calculates your deduction breakdown in real time so you always know which fixes move the score the most.",
  },
  {
    question: "What's a realistic SPRS score for a small company starting from scratch?",
    answer:
      "Companies with basic IT hygiene (antivirus, patching, some access control) typically start between -50 and +30 when they first calculate their NIST SP 800-171 score. Companies with no formal security program often score below -60. A score of 110 (perfect) is rare — most certified Level 2 companies complete their C3PAO assessment with scores between 85 and 110. DefenseEye's goal is to close your highest-risk gaps first so your SPRS submission to sprs.apps.mil is defensible before award, then continue improving toward assessment.",
  },
  // ── Prime contractor pressure
  {
    question: "Our prime contractor is asking for CMMC compliance proof — what do we send them?",
    answer:
      "Right now (before full CMMC rollout), your prime can request your SPRS score submitted to sprs.apps.mil via DFARS 252.204-7019. You can share your score and submission date from the SPRS portal. Some primes are also asking for a signed System Security Plan (SSP) and a summary of implemented controls. Under CMMC 2.0 final rule, primes with a DFARS 252.204-7021 clause will eventually require you to show an active C3PAO certification or conditional certification. CMMCLens generates printable SSP summaries and control attestation documentation for exactly this purpose.",
  },
  // ── GCC High / cloud — one of the most debated Reddit topics
  {
    question: "Does Microsoft 365 GCC High automatically make us CMMC compliant?",
    answer:
      "No — GCC High is a necessary tool for many CMMC Level 2 programs, but it does not make you compliant by itself. GCC High inherits a set of controls from Microsoft per their Customer Responsibility Matrix (CRM), but you must still configure MFA and Conditional Access correctly, enable audit logging, deploy endpoint encryption (BitLocker/Defender), enforce DLP for CUI, and document all 110 controls in your SSP. M365 Commercial does NOT satisfy CMMC requirements for CUI per DFARS 252.239-7010. CMMCLens reads your GCC High tenant configuration and maps what's inherited vs. what you still need to implement.",
  },
  {
    question: "Can we use Google Workspace, AWS Commercial, or Salesforce instead of GCC High for CMMC?",
    answer:
      "Generally no for CUI processing. CMMC Level 2 requires that cloud services used to process, store, or transmit CUI meet FedRAMP Moderate authorization at minimum per DFARS 252.204-7012 and CMMC 2.0 guidance. Google Workspace for Government is FedRAMP Moderate authorized, but it lacks many of the DoD-specific controls in GCC High and is not accepted by most C3PAOs for CUI. AWS GovCloud (FedRAMP High) is acceptable for CUI workloads when properly configured. Salesforce Government Cloud Plus is also FedRAMP High authorized. Standard commercial AWS, Google Workspace Business, and Salesforce Professional are not acceptable for CUI.",
  },
  // ── C3PAO assessment process
  {
    question: "What happens if we fail a C3PAO assessment?",
    answer:
      "A failed C3PAO assessment does not result in immediate contract termination, but it does delay certification and can jeopardize contract renewal if the solicitation requires active CMMC status. After a failed assessment, you enter a remediation period — the C3PAO issues a deficiency report listing failed practices, you close those gaps, and request a reassessment. Under 32 CFR Part 170, certain minor failures can be captured in a POA&M with a 180-day closure window. DefenseEye typically conducts a pre-assessment readiness review (mock assessment) before you schedule with a C3PAO to catch failures before they become official.",
  },
  {
    question: "What controls are most commonly failed in CMMC Level 2 assessments?",
    answer:
      "Based on patterns from CMMC assessments and C3PAO reporting, the most commonly failed control families are: Access Control (3.1.x) — especially role-based access and privileged account separation; Identification and Authentication (3.5.x) — particularly MFA gaps for non-admin users; Audit and Accountability (3.3.x) — incomplete logging, missing audit review processes; Configuration Management (3.4.x) — no formal baseline configurations; and Incident Response (3.6.x) — plans exist on paper but staff cannot demonstrate them. CMMCLens flags all of these with specific remediation steps in priority order.",
  },
  // ── CUI scoping — top Discord question
  {
    question: "What is CUI and how do we know if we handle it?",
    answer:
      "CUI (Controlled Unclassified Information) is federal information that requires safeguarding per law, regulation, or government-wide policy — but is not classified. It's defined and managed by NARA at archives.gov/cui. For defense contractors, common CUI categories include: technical data on weapons systems or military specs (ITAR-controlled), contract performance information with sensitive details, personally identifiable information (PII) about DoD personnel, and acquisition-sensitive information marked CUI//SP-EXPT. If your contracts include a DFARS 252.204-7012 clause, or if you receive government-furnished data, drawings, or specifications marked 'CUI' or 'FOUO,' you are handling CUI and need CMMC Level 2.",
  },
  {
    question: "How do we figure out our CUI boundary for CMMC scoping?",
    answer:
      "CUI boundary scoping is one of the most consequential decisions in CMMC preparation — a scope that's too broad inflates your compliance cost; too narrow risks assessment failure. The boundary includes all systems that process, store, or transmit CUI: your workstations that open CUI documents, your email system if CUI arrives there, your file shares where CUI is stored, and any cloud services that host or process CUI. Systems that protect those systems (firewalls, SIEM, identity) are typically in scope as security protection assets. DefenseEye's advisory program includes a formal scoping workshop as the first step — we help you define the minimum defensible boundary before starting remediation.",
  },
  // ── Roles/players — common forum confusion
  {
    question: "What is the difference between a C3PAO, RPO, and MSSP for CMMC?",
    answer:
      "C3PAO (Certified Third-Party Assessment Organization): authorized by the Cyber AB to conduct official CMMC Level 2 assessments. Only C3PAOs can certify your CMMC status. RPO (Registered Provider Organization): advisory and consulting firms listed by the Cyber AB that help you prepare for assessment. They cannot certify you. MSSP (Managed Security Service Provider): a company that manages security services for you — sometimes listed as an RPO, sometimes not. DefenseEye operates as an advisory/consulting partner (RPO-equivalent) offering gap assessment, remediation guidance, and CMMCLens automation — we prepare you for certification by your selected C3PAO.",
  },
  // ── Subcontractors — big Reddit thread topic
  {
    question: "Do subcontractors need CMMC if the prime contractor is already certified?",
    answer:
      "Yes, in most cases. Under DFARS 252.204-7021, primes must flow CMMC requirements down to subcontractors who handle CUI or provide security protection services. The rule is: if a subcontractor touches CUI relevant to the contract, they need the same CMMC Level as the prime (typically Level 2). This is one of the most expensive surprises in defense supply chains. If you are a sub handling only Federal Contract Information (not CUI), you may only need Level 1. Review your subcontract carefully — if it contains a DFARS 252.204-7012 or 7021 clause, CMMC likely applies to you.",
  },
  // ── POA&M / conditional cert — common question from nervous contractors
  {
    question: "Can we get conditionally certified with open POA&M items?",
    answer:
      "Yes, under 32 CFR Part 170.21, CMMC Level 2 conditional certification is available for assessments where certain non-critical controls are incomplete but documented with a credible POA&M. You have 180 days from conditional certification to close all POA&M items. However, critical controls cannot be in POA&M status at initial certification — these include: MFA for privileged accounts (3.5.3), CUI encryption in transit and at rest (3.13.8, 3.13.10), and audit event logging (3.3.1). A properly written POA&M includes specific control numbers, named responsible owners, realistic closure dates, and genuine compensating controls — not placeholder language.",
  },
  // ── MSP outsourcing — Reddit favorite
  {
    question: "Can we outsource our CMMC compliance to an MSP or MSSP?",
    answer:
      "Partially. An MSP or MSSP can implement and manage many of the technical controls on your behalf — endpoint management, logging, patching, identity management — and this is a legitimate approach. However, CMMC requires your organization to formally own the compliance program: your leadership must attest to the SSP, your staff must be able to demonstrate control implementation to assessors, and you must have internal incident response and configuration management processes. You cannot simply hand CMMC to a vendor and walk away. DefenseEye typically works alongside your existing MSP — we handle the compliance program and documentation, while your MSP handles day-to-day technical operations.",
  },
];

export default function CMMCLens() {
  useSeo(
    "CMMCLens Automation | Urgent CMMC Readiness Platform by DefenseEye",
    "CMMCLens automation for urgent CMMC readiness: automated evidence collection, real-time risk remediation, SSP/POA&M generation, and C3PAO-ready packages. Answers to the most common CMMC questions from defense contractors."
  );

  useEffect(() => {
    const schema = [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "CMMCLens",
        description:
          "CMMC Level 2 automation platform for defense contractors. Supports automated evidence collection, real-time risk remediation, and real-time SSP/POA&M generation.",
        brand: { "@type": "Brand", name: "DefenseEye" },
        category: "CMMC Readiness Automation",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ];
    const id = "cmmclens-schema";
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
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#0D1B33]">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <a href="/services/cmmc-readiness-sprint" className="hover:text-primary transition-colors">CMMC Sprint</a>
            <a href="/services/cmmc-scoping" className="hover:text-primary transition-colors">Scoping</a>
            <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="/knowledge-hub" className="hover:text-primary transition-colors">Knowledge Hub</a>
          </nav>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Book Urgent CMMC Call
            </Button>
          </a>
        </div>
      </header>

      <main className="px-4">
        {/* ── Hero ── */}
        <section className="max-w-6xl mx-auto pt-16 pb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Product</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-5">
            CMMCLens: CMMC Level 2 Automation for Deadline-Driven Teams
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
            Built for defense contractors that need urgent CMMC readiness, not months of manual prep.
            Pair CMMCLens with DefenseEye advisory to accelerate C3PAO readiness confidence.
          </p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Get CMMCLens + Advisory Plan <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </section>

        {/* ── Feature Cards ── */}
        <section className="max-w-6xl mx-auto pb-14 grid md:grid-cols-3 gap-5">
          {[
            {
              icon: FileCheck,
              title: "Automated Evidence Collection",
              text: "Map technical evidence to NIST 800-171 controls with less manual effort.",
            },
            {
              icon: Activity,
              title: "Real-Time Risk Remediation",
              text: "See gaps as they happen and prioritize fixes by contract impact.",
            },
            {
              icon: Zap,
              title: "Real-Time Documentation",
              text: "Generate SSP, POA&M, policies, procedures, and standards in real time.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-card/50 border border-border/40 p-6 rounded-sm">
              <f.icon className="w-5 h-5 text-primary mb-3" />
              <p className="font-heading font-semibold mb-1">{f.title}</p>
              <p className="text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </section>

        {/* ── FAQ Section ── */}
        <section className="max-w-4xl mx-auto py-14 border-t border-border/30">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
              Frequently Asked Questions
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              The Questions Every Defense Contractor Is Asking About CMMC
            </h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Compiled from Reddit r/CMMC, defense contractor Discord communities, Quora, and CMMC compliance forums — answered with authoritative citations.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>

          <div className="mt-12 bg-primary/5 border border-primary/20 rounded-sm p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              Still have questions? Talk to a CMMC advisor.
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Our certified advisors answer operational CMMC questions every day. Book a free 30-minute call — no pitch, just answers.
            </p>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8">
                Book a Free CMMC Call <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
