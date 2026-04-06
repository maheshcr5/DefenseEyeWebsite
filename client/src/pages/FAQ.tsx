/*
 * DefenseEye — CMMC FAQ Page
 * Dedicated FAQ for GEO / AEO / SEO citation in LLMs and search engines.
 * FAQPage JSON-LD schema included for structured data indexing.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { useSeo } from "@/hooks/useSeo";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

const NAV_LINKS = [
  { label: "CMMC Sprint", href: "/services/cmmc-readiness-sprint" },
  { label: "Scoping", href: "/services/cmmc-scoping" },
  { label: "CMMCLens", href: "/cmmclens" },
  { label: "Pricing", href: "/pricing" },
  { label: "Knowledge Hub", href: "/knowledge-hub" },
  { label: "Blog", href: "/blog" },
];

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQS: { category: string; q: string; a: string }[] = [
  // CMMC Basics
  {
    category: "CMMC Basics",
    q: "Do I need CMMC Level 2?",
    a: "If your company handles Controlled Unclassified Information (CUI) under a DoD contract, you typically need CMMC Level 2, which requires alignment with all 110 controls in NIST SP 800-171. If your contract only involves Federal Contract Information (FCI) and no CUI, CMMC Level 1 (basic cyber hygiene, 17 practices) may be sufficient. Check your contract's DFARS clause 252.204-7012 and 252.204-7021 to confirm.",
  },
  {
    category: "CMMC Basics",
    q: "What is the difference between CMMC Level 1 and Level 2?",
    a: "CMMC Level 1 covers 17 basic cybersecurity practices from FAR 52.204-21 and allows annual self-assessment. CMMC Level 2 covers all 110 NIST SP 800-171 controls and requires a triennial third-party assessment by a C3PAO for most contracts — or an annual self-assessment for non-critical programs. Level 2 is where most defense subcontractors handling CUI will be assessed.",
  },
  {
    category: "CMMC Basics",
    q: "What is CUI and do we have it?",
    a: "Controlled Unclassified Information (CUI) is government-created or owned information that requires safeguarding per law, regulation, or government-wide policy. Common examples include technical drawings, specs, export-controlled design data, ITAR/EAR materials, and contract performance data. If your DoD prime sends you technical files, performance data, or anything marked 'CUI' or 'FOUO,' you likely handle CUI. The NARA CUI Registry (archives.gov/cui) lists all authorized categories.",
  },
  {
    category: "CMMC Basics",
    q: "Is CMMC active right now for new DoD contracts?",
    a: "Yes. CMMC 2.0 final rule (32 CFR Part 170) was published October 2024 and is now enforceable. CMMC contract clauses are being incorporated into new DoD solicitations through DFARS 252.204-7021. Contractors without documented compliance posture face bid disqualification as clause rollout accelerates through 2025–2026.",
  },

  // Readiness & Timeline
  {
    category: "Readiness & Timeline",
    q: "How long does CMMC readiness take?",
    a: "An initial gap assessment and readiness sprint can be completed in 2–4 weeks, producing your gap report, NIST 800-171 control mapping, SSP starter, and POA&M. Full remediation timelines depend on your starting posture — contractors with moderate gaps typically need 3–6 months of structured effort. Contractors with severe gaps (missing MFA, no logging, no incident response plan) may need 6–12 months. Starting with a scoped sprint lets you know your exact timeline before committing to full remediation.",
  },
  {
    category: "Readiness & Timeline",
    q: "What if we have a contract renewal or award deadline coming up?",
    a: "Prioritize a rapid gap assessment immediately. DefenseEye's CMMC Readiness Sprint delivers a gap report, SPRS score estimate, SSP starter, and POA&M in 2–4 weeks — giving you the documented posture needed to support a contract bid or renewal. A Plan of Action & Milestones (POA&M) demonstrating active remediation is often acceptable to primes under active contract pressure, but this window is narrowing as enforcement tightens.",
  },
  {
    category: "Readiness & Timeline",
    q: "Can a small company (under 50 employees) pass CMMC Level 2?",
    a: "Yes — company size is not a disqualifier. The assessment evaluates control implementation, not headcount. Small companies succeed by scoping their CUI environment tightly (limiting which systems touch CUI), automating evidence collection, and building a documented SSP and POA&M that shows assessors a clear, maintained compliance program. DefenseEye has guided lean teams through C3PAO-ready packages with as few as 2 IT staff.",
  },

  // Costs & Pricing
  {
    category: "Costs & Pricing",
    q: "How much does CMMC compliance cost?",
    a: "CMMC readiness costs vary by your starting control maturity, environment complexity, and whether you use managed security tools. A typical CMMC Readiness Sprint (gap assessment + SSP + POA&M) for a small-to-mid contractor runs $8,000–$25,000. Full Level 2 remediation support adds $20,000–$80,000+ depending on gaps. C3PAO assessment fees from accredited third-party assessors range from $30,000–$100,000+. DefenseEye starts with a fixed-price sprint so you can scope your total investment before committing.",
  },
  {
    category: "Costs & Pricing",
    q: "What is a SPRS score and how do we improve it?",
    a: "The Supplier Performance Risk System (SPRS) score is a self-reported numeric score (ranging from -203 to +110) reflecting your NIST 800-171 implementation status. Each unimplemented control is weighted by severity — some controls carry higher negative weight than others. You improve your SPRS score by implementing missing controls, particularly high-weight ones like Multi-Factor Authentication (AC.3.022), audit logging (AU.2.042), and incident response planning (IR.2.092). DefenseEye's gap assessment identifies the highest-value controls to implement first for fastest score improvement.",
  },

  // Assessment & C3PAO
  {
    category: "C3PAO & Assessment",
    q: "What happens during a C3PAO CMMC Level 2 assessment?",
    a: "A C3PAO assessment (conducted by a Certified Third-Party Assessment Organization accredited by the Cyber AB) involves document review, interviews with IT and leadership staff, and technical verification of control implementation. Assessors examine your SSP, policies, procedures, network diagrams, configuration evidence, and audit logs across all 110 CMMC Level 2 practices. The process typically spans 3–10 days onsite/remote depending on environment size. Failing practices can be captured in a POA&M for conditional certification, but high-risk practices must be remediated before a final certificate is issued.",
  },
  {
    category: "C3PAO & Assessment",
    q: "What is the difference between a C3PAO, RPO, and MSSP?",
    a: "A C3PAO (Certified Third-Party Assessment Organization) is an accredited organization authorized by the Cyber AB to conduct official CMMC Level 2 assessments and issue certificates. An RPO (Registered Practitioner Organization) provides consulting and advisory services to help contractors prepare for CMMC — they cannot issue certificates. An MSSP (Managed Security Service Provider) offers managed security tools and services (logging, MDR, endpoint protection) that support compliance but are not assessors or advisors. DefenseEye operates as an RPO-aligned advisory firm — we prepare you for your C3PAO assessment, not conduct it.",
  },
  {
    category: "C3PAO & Assessment",
    q: "What are the most commonly failed CMMC controls?",
    a: "Based on DoD assessment data and NIST 800-171 self-assessment patterns, the most commonly deficient control families are: Access Control (AC) — specifically MFA enforcement and least-privilege; Audit & Accountability (AU) — missing log collection, retention, and review; Configuration Management (CM) — undocumented baselines; Identification & Authentication (IA) — weak password policies; System & Communications Protection (SC) — unencrypted CUI in transit; and Risk Assessment (RA) — absent formal risk assessment documentation. These are also the highest-weight controls for SPRS score.",
  },

  // CMMCLens & DefenseEye
  {
    category: "DefenseEye & CMMCLens",
    q: "What is CMMCLens?",
    a: "CMMCLens is DefenseEye's CMMC Level 2 automation platform. It automates evidence collection, NIST 800-171 control mapping, real-time SSP and POA&M generation, and policy/procedure drafting — reducing the manual compliance work that typically requires a full-time analyst. CMMCLens is designed to work alongside DefenseEye's advisory services so lean IT teams can produce C3PAO-ready documentation without hiring a dedicated compliance staff.",
  },
  {
    category: "DefenseEye & CMMCLens",
    q: "How is DefenseEye different from other CMMC consultants?",
    a: "DefenseEye combines CCP-led (Certified CMMC Professional) advisory with automation tooling — most consultants offer one or the other. We start every engagement with a fixed-price sprint so you know total scope and cost before committing. We specialize exclusively in CMMC for the U.S. Defense Industrial Base, with deep focus on contractors under 150 employees handling CUI. We don't sell generic cybersecurity services — every deliverable is CMMC-specific, assessor-ready, and tied to your contract risk.",
  },
];

// Group FAQs by category
const CATEGORIES = Array.from(new Set(FAQS.map((f) => f.category)));

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 bg-card/40 rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card/70 transition-colors duration-200"
        aria-expanded={open}
      >
        <span className="font-heading font-semibold text-foreground pr-4 text-sm md:text-base">{q}</span>
        <ChevronDown className={`w-4 h-4 text-primary shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
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
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  useSeo(
    "CMMC FAQ — Common Questions Answered | DefenseEye",
    "Answers to the most common CMMC 2.0 questions from defense contractors: Level 1 vs Level 2, CUI, SPRS scores, C3PAO assessments, timelines, and costs."
  );

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    const id = "faq-page-schema";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.type = "application/ld+json";
      s.text = JSON.stringify(schema);
      document.head.appendChild(s);
    }
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Nav ── */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 section-light">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <DefenseEyeLogo href="/" />
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#0D1B33]">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-primary transition-colors">{l.label}</a>
            ))}
          </nav>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-5">
              Book Assessment
            </Button>
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="py-16 px-4 section-navy">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">CMMC Answers Without the Runaround</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold leading-tight mb-4 text-foreground">
            CMMC Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Plain-language answers to the questions defense contractors ask most — about compliance timelines, costs, Level 2 assessments, and how to protect DoD contract eligibility.
          </p>
        </div>
      </section>

      {/* ── FAQ by Category ── */}
      <main className="py-16 px-4 section-light">
        <div className="max-w-3xl mx-auto">
          {/* Quick-jump */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={`#${cat.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                className="text-xs px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
              >
                {cat}
              </a>
            ))}
          </div>

          {CATEGORIES.map((cat) => (
            <section
              key={cat}
              id={cat.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
              className="mb-12"
            >
              <h2 className="font-heading text-xl font-bold text-foreground mb-4 pb-2 border-b border-border/40">
                {cat}
              </h2>
              <div className="space-y-3">
                {FAQS.filter((f) => f.category === cat).map((f) => (
                  <FAQItem key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* ── CTA ── */}
      <section className="py-16 px-4 section-gray">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-6">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-accent tracking-wide uppercase">Response within 24 hours</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4 text-foreground">
            Still have questions about your specific situation?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Every contractor's CUI environment is different. Book a free 30-minute call and get answers specific to your contracts, IT setup, and timeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8">
                Book a Free CMMC Call <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="/cmmclens">
              <Button variant="outline" size="lg" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 px-8">
                Explore CMMCLens FAQ
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 py-8 px-4 section-gray">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <DefenseEyeLogo size="sm" />
          <span>&copy; {new Date().getFullYear()} DefenseEye, Inc. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <a href="/knowledge-hub" className="hover:text-primary transition-colors">Knowledge Hub</a>
            <a href="/cmmclens" className="hover:text-primary transition-colors">CMMCLens</a>
            <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
