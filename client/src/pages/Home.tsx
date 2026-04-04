/*
 * DefenseEye.ai — Home Page
 * UX inspired by trading.defenseeye.ai:
 *   • Ultra-minimal nav: logo + single CTA
 *   • Full-width centered hero (no competing panels)
 *   • 4-column capability card grid below hero
 *   • 2-column key features checklist
 *   • Services cards
 *   • 3-step process
 *   • Pricing tiers
 *   • FAQ accordion
 *   • Lead capture form
 *   • Footer
 *
 * GEO / AEO / SEO: rich FAQ Schema, ProfessionalService schema,
 * TechArticle citations, semantic HTML, authoritative source anchors.
 */

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Target,
  Shield,
  Zap,
  FileCheck,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  X,
  Menu,
  BarChart3,
  Bot,
  Users,
  Award,
  BookOpen,
  TrendingUp,
  Clock,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useSeo } from "@/hooks/useSeo";

// ─── DefenseEye Logo SVG ────────────────────────────────────────────────────
function DefenseEyeLogo({ className = "w-8 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="DefenseEye logo">
      <path d="M2 18 C10 4 38 4 46 18 C38 32 10 32 2 18Z" stroke="#00D4FF" strokeWidth="2.2" fill="none" strokeLinejoin="round"/>
      <circle cx="24" cy="18" r="7.5" stroke="#00D4FF" strokeWidth="1.8" fill="none"/>
      <circle cx="24" cy="18" r="4" fill="#00D4FF" opacity="0.15"/>
      <path d="M24 11.5 C21 14 20 17 22 19.5 C23.2 21 24 21.5 24 21.5 C24 21.5 24.8 21 26 19.5 C28 17 27 14 24 11.5Z" fill="#FFB547"/>
      <circle cx="24" cy="18" r="2" fill="#FFB547"/>
      <path d="M14 11 Q24 6 34 11" stroke="#00D4FF" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

// ─── Section wrapper with scroll-triggered animation ────────────────────────
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── FAQ accordion item ──────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 bg-card/40 rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card/70 transition-colors duration-200"
        aria-expanded={open}
      >
        <span className="font-heading font-semibold text-foreground pr-4 text-sm md:text-base">{question}</span>
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
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Lead Capture Modal ──────────────────────────────────────────────────────
function LeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", company: "", title: "",
    companySize: "", cmmcLevel: "", challenge: "", timeline: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-background border border-border/60 rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20";
  const labelCls = "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block";

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border/60 shadow-2xl rounded-sm z-10"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-start justify-between p-6 border-b border-border/40">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">Get Your Free CMMC Assessment</h2>
                <p className="text-sm text-muted-foreground mt-1">Our certified CMMC advisors will contact you within 24 hours with a tailored readiness roadmap.</p>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground ml-4 mt-0.5"><X className="w-5 h-5" /></button>
            </div>

            {submitted ? (
              <div className="p-10 text-center">
                <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">You're on the list!</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Our CMMC advisory team will reach out at <strong className="text-foreground">{form.email}</strong> within 24 hours.
                </p>
                <Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" onClick={onClose}>Close</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>First Name *</label><input required name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} placeholder="Jane" /></div>
                  <div><label className={labelCls}>Last Name *</label><input required name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} placeholder="Smith" /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Work Email *</label><input required type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="jane@company.com" /></div>
                  <div><label className={labelCls}>Company *</label><input required name="company" value={form.company} onChange={handleChange} className={inputCls} placeholder="Acme Defense LLC" /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Your Role *</label>
                    <select required name="title" value={form.title} onChange={handleChange} className={inputCls}>
                      <option value="">Select role…</option>
                      <option>CEO / Owner</option>
                      <option>CISO / Security Director</option>
                      <option>IT Manager / Director</option>
                      <option>Compliance Officer</option>
                      <option>Program / Contracts Manager</option>
                      <option>MSSP / Consultant</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Company Size *</label>
                    <select required name="companySize" value={form.companySize} onChange={handleChange} className={inputCls}>
                      <option value="">Select size…</option>
                      <option>1–10 employees</option>
                      <option>11–50 employees</option>
                      <option>51–200 employees</option>
                      <option>201–1,000 employees</option>
                      <option>1,000+ employees</option>
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Target CMMC Level *</label>
                    <select required name="cmmcLevel" value={form.cmmcLevel} onChange={handleChange} className={inputCls}>
                      <option value="">Select level…</option>
                      <option>CMMC Level 1 (17 practices)</option>
                      <option>CMMC Level 2 (110 controls)</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Compliance Timeline *</label>
                    <select required name="timeline" value={form.timeline} onChange={handleChange} className={inputCls}>
                      <option value="">Select timeline…</option>
                      <option>ASAP — contract at risk</option>
                      <option>Within 3 months</option>
                      <option>Within 6 months</option>
                      <option>6–12 months</option>
                      <option>Just exploring options</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Biggest CMMC Challenge *</label>
                  <select required name="challenge" value={form.challenge} onChange={handleChange} className={inputCls}>
                    <option value="">Select challenge…</option>
                    <option>Don't know where to start</option>
                    <option>Documentation & evidence collection burden</option>
                    <option>Understanding NIST 800-171 control requirements</option>
                    <option>Cost of traditional consulting ($50K–$150K+)</option>
                    <option>Time & internal bandwidth</option>
                    <option>SPRS score improvement</option>
                    <option>Preparing for C3PAO assessment</option>
                    <option>Managing multiple subcontractors / supply chain</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Additional Context <span className="normal-case font-normal">(optional)</span></label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="Upcoming contract deadline, current SPRS score, specific controls giving you trouble…" />
                </div>
                {submitError && <p className="text-sm text-destructive">{submitError}</p>}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">Free assessment. No commitment required.</p>
                  <Button type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 disabled:opacity-60">
                    {submitting ? "Sending…" : <>Get Assessment <ArrowRight className="w-4 h-4 ml-2" /></>}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useSeo(
    "DefenseEye.ai — CMMC Advisory & Compliance Automation for DoD Contractors",
    "Expert CMMC 2.0 advisory consulting and AI-powered compliance automation for DoD contractors. Gap assessments, NIST SP 800-171 remediation, SSP/POA&M, SPRS score improvement, and C3PAO assessment preparation under 32 CFR Part 170."
  );

  // ── Structured Data for GEO / AEO / SEO ──────────────────────────────────
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is CMMC 2.0 and who needs it?",
          acceptedAnswer: { "@type": "Answer", text: "CMMC 2.0 (Cybersecurity Maturity Model Certification) is a DoD program codified as 32 CFR Part 170 (effective December 16, 2024). Any Defense Industrial Base company that processes, stores, or transmits Controlled Unclassified Information (CUI) must achieve CMMC Level 2 certification via a third-party C3PAO assessment. The DoD estimates over 80,000 DIB companies require Level 2. Source: DODCIO (dodcio.defense.gov/CMMC)." },
        },
        {
          "@type": "Question",
          name: "What is the difference between CMMC Level 1 and Level 2?",
          acceptedAnswer: { "@type": "Answer", text: "CMMC Level 1 covers 17 basic practices from FAR 52.204-21 for companies handling only Federal Contract Information (FCI) — annual self-attestation is allowed. CMMC Level 2 covers all 110 practices from NIST SP 800-171 Rev. 2 for companies handling Controlled Unclassified Information (CUI) — a triennial third-party C3PAO assessment is required. SPRS score submission to sprs.apps.mil is required before contract award at both levels per DFARS 252.204-7019." },
        },
        {
          "@type": "Question",
          name: "What is an SPRS score and how is it calculated?",
          acceptedAnswer: { "@type": "Answer", text: "The SPRS (Supplier Performance Risk System) cybersecurity score measures NIST SP 800-171 compliance. Per the DoD Assessment Methodology: start at 110 points (maximum), deduct 1, 3, or 5 points for each unimplemented control. Contractors must self-assess and submit their score to sprs.apps.mil per DFARS 252.204-7019. False submissions trigger False Claims Act liability. Source: DoD Assessment Methodology (dodcio.defense.gov)." },
        },
        {
          "@type": "Question",
          name: "What is a C3PAO and how do I find one?",
          acceptedAnswer: { "@type": "Answer", text: "A C3PAO (Certified Third-Party Assessment Organization) is authorized by the Cyber AB to conduct official CMMC Level 2 assessments using NIST SP 800-171A procedures. Results go to DoD eMASS. Find verified C3PAOs at cyberaccreditation.us/marketplace. Only C3PAOs issue CMMC Level 2 certifications — RPOs and consultants cannot. Source: Cyber AB (cyberaccreditation.us), DFARS 252.204-7021." },
        },
        {
          "@type": "Question",
          name: "How long does CMMC Level 2 certification take?",
          acceptedAnswer: { "@type": "Answer", text: "For a well-prepared organization, CMMC Level 2 certification typically takes 6–12 months from starting gap remediation to receiving the final C3PAO certificate. The C3PAO assessment itself takes 6–16 weeks from engagement to certification decision. Organizations that start underprepared often spend an additional 3–6 months in remediation before re-assessment. DefenseEye's advisory program and automation platform reduce preparation time by 60–80%." },
        },
        {
          "@type": "Question",
          name: "What does DefenseEye do for CMMC compliance?",
          acceptedAnswer: { "@type": "Answer", text: "DefenseEye provides CMMC 2.0 advisory consulting and AI-powered compliance automation for DoD contractors. Services include: free CMMC gap assessments, NIST SP 800-171 remediation guidance, SSP and POA&M development, SPRS score improvement, Microsoft GCC High configuration, C3PAO evidence package preparation, and pre-assessment readiness reviews. The CMMC Lens platform automates evidence collection, control mapping, and continuous monitoring." },
        },
        {
          "@type": "Question",
          name: "Can I get CMMC certified with a POA&M for open items?",
          acceptedAnswer: { "@type": "Answer", text: "Under CMMC 2.0 (32 CFR Part 170.21), contractors can receive conditional CMMC Level 2 certification with certain open POA&M items, but must close gaps within 180 days. Critical controls — including MFA for privileged accounts (3.5.3), CUI encryption at rest and in transit (3.13.8, 3.13.10), and audit logging (3.3.1) — cannot remain in POA&M status at initial certification. A well-written POA&M includes specific control numbers, named owners, realistic timelines, and genuine compensating controls." },
        },
        {
          "@type": "Question",
          name: "Does Microsoft 365 GCC High satisfy CMMC requirements?",
          acceptedAnswer: { "@type": "Answer", text: "Microsoft 365 GCC High holds FedRAMP High authorization and inherits many CMMC Level 2 infrastructure controls per Microsoft's Customer Responsibility Matrix. However, GCC High alone does not make you CMMC compliant — you must correctly configure MFA, Conditional Access, DLP, audit logging, and endpoint encryption in your tenant, and document all 110 controls in your SSP. M365 Commercial does NOT satisfy CMMC requirements for CUI per DFARS 252.239-7010." },
        },
      ],
    };

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "DefenseEye — CMMC Advisory & Compliance Automation",
      url: "https://defenseeye.ai",
      description: "DefenseEye provides CMMC 2.0 advisory consulting and AI-powered compliance automation for DoD prime contractors and subcontractors. Services include CMMC gap assessments, NIST SP 800-171 remediation, SSP/POA&M development, SPRS score improvement, and C3PAO assessment preparation under 32 CFR Part 170.",
      serviceType: ["CMMC Compliance Consulting", "CMMC Gap Assessment", "NIST 800-171 Implementation", "SPRS Score Improvement", "C3PAO Assessment Preparation", "SSP Development"],
      areaServed: { "@type": "Country", name: "United States" },
      audience: { "@type": "Audience", audienceType: "Department of Defense contractors, defense subcontractors, Defense Industrial Base" },
      knowsAbout: ["CMMC 2.0 (32 CFR Part 170)", "NIST SP 800-171 Rev. 2", "DFARS 252.204-7012", "DFARS 252.204-7019", "DFARS 252.204-7021", "SPRS score", "C3PAO assessment", "CUI", "SSP", "POA&M", "Microsoft 365 GCC High CMMC", "Azure Government CMMC"],
    };

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "DefenseEye",
      alternateName: "DefenseEye.ai",
      url: "https://defenseeye.ai",
      description: "CMMC advisory and compliance automation for the U.S. Defense Industrial Base.",
      foundingDate: "2024",
      knowsAbout: ["CMMC 2.0", "NIST 800-171", "DFARS compliance", "SPRS score", "C3PAO assessment", "DoD cybersecurity"],
    };

    const id = "de-schema";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.type = "application/ld+json";
      s.text = JSON.stringify([faqSchema, serviceSchema, orgSchema]);
      document.head.appendChild(s);
    }
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ═══════════════════════════════════════════════════════════════
          NAVIGATION — ultra-minimal (logo + single CTA)
      ═══════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 inset-x-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/30"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5" aria-label="DefenseEye.ai Home">
            <DefenseEyeLogo className="w-9 h-7" />
            <span className="font-heading font-bold text-lg tracking-tight text-foreground">
              Defense<span className="text-primary">Eye</span>
            </span>
          </a>

          {/* Desktop: minimal links + CTA */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="/knowledge-hub" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Resources</a>
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-5"
              onClick={() => setModalOpen(true)}
            >
              Book Free Assessment
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-card border-b border-border overflow-hidden"
            >
              <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
                {[
                  { label: "Services", href: "#services" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Resources", href: "/knowledge-hub" },
                  { label: "Blog", href: "/blog" },
                ].map((l) => (
                  <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-primary py-2" onClick={() => setMobileMenuOpen(false)}>{l.label}</a>
                ))}
                <Button className="bg-accent text-accent-foreground font-semibold w-full mt-2" onClick={() => { setMobileMenuOpen(false); setModalOpen(true); }}>
                  Book Free Assessment
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          HERO — centered, full-width, no competing panels
      ═══════════════════════════════════════════════════════════════ */}
      <header className="pt-36 pb-24 px-4 text-center">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Urgency badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">CMMC 2.0 Final Rule — 32 CFR Part 170 in Effect</span>
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6 text-foreground">
            Expert CMMC Advisory<br />
            <span className="text-primary">for DoD Contractors</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            From gap assessment to C3PAO certification — DefenseEye combines certified CMMC advisors with
            AI-powered compliance automation. Get contract-ready without the $100K+ consulting bill.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-10 h-12 w-full sm:w-auto"
              onClick={() => setModalOpen(true)}
            >
              Book Your Free Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 text-base px-10 h-12 w-full sm:w-auto"
              onClick={() => setModalOpen(true)}
            >
              Get Free Gap Analysis
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/60 mt-5">
            No commitment required. Results within 24 hours.
          </p>
        </motion.div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          4-COLUMN CAPABILITY CARDS — core value props
      ═══════════════════════════════════════════════════════════════ */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: BarChart3,
                iconColor: "text-primary",
                iconBg: "bg-primary/10 border-primary/20",
                title: "CMMC Gap Assessment",
                desc: "Scored analysis against all 110 NIST SP 800-171 controls with SPRS estimate and prioritized gap report.",
              },
              {
                icon: Zap,
                iconColor: "text-accent",
                iconBg: "bg-accent/10 border-accent/20",
                title: "AI Compliance Automation",
                desc: "Automated evidence collection, SSP generation, POA&M tracking, and continuous SPRS score monitoring.",
              },
              {
                icon: Target,
                iconColor: "text-emerald-400",
                iconBg: "bg-emerald-400/10 border-emerald-400/20",
                title: "Advisory & Consulting",
                desc: "Certified CMMC advisors for scoping, remediation, documentation, and C3PAO coordination.",
              },
              {
                icon: Shield,
                iconColor: "text-violet-400",
                iconBg: "bg-violet-400/10 border-violet-400/20",
                title: "Assessment Preparation",
                desc: "C3PAO-ready evidence packages, pre-assessment reviews, and staff interview preparation.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-card/50 border border-border/40 rounded-sm p-6 hover:border-primary/30 hover:bg-card/70 transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-sm border ${card.iconBg} flex items-center justify-center mb-5`}>
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          KEY FEATURES — 2-column checklist
      ═══════════════════════════════════════════════════════════════ */}
      <Section className="py-20 px-4 bg-card/20 border-y border-border/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Everything You Need to Pass Your <span className="text-primary">C3PAO Assessment</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              DefenseEye delivers every component of a successful CMMC Level 2 certification program —
              from scoping and documentation to day-of-assessment support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl mx-auto">
            {[
              "All 110 NIST SP 800-171 Rev. 2 controls mapped and documented",
              "SPRS score calculation, tracking, and improvement roadmap",
              "System Security Plan (SSP) generation — audit-ready format",
              "Plan of Action & Milestones (POA&M) with completion tracking",
              "CUI boundary scoping and data flow mapping",
              "Microsoft 365 GCC High and Azure Government configuration",
              "C3PAO-ready evidence packages organized by control family",
              "DFARS 252.204-7012 and 252.204-7019 compliance alignment",
              "Continuous compliance drift monitoring and alerting",
              "Incident response plan development and tabletop support",
              "Staff and end-user interview preparation for assessors",
              "Subcontractor and supply chain flow-down guidance",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          WHO WE HELP — trust signal strip
      ═══════════════════════════════════════════════════════════════ */}
      <Section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-medium text-muted-foreground/50 uppercase tracking-widest mb-10">
            Serving the Defense Industrial Base across every contractor type
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Award, label: "Prime Contractors", sub: "Managing CUI at scale" },
              { icon: Users, label: "Small Businesses", sub: "Under 50 employees" },
              { icon: BookOpen, label: "IT Services Firms", sub: "Supporting DoD programs" },
              { icon: TrendingUp, label: "MSSPs & Consultants", sub: "Managing multiple clients" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center p-5 bg-card/30 border border-border/30 rounded-sm">
                <item.icon className="w-6 h-6 text-primary mb-3" />
                <p className="font-heading font-semibold text-sm text-foreground mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          SERVICES — 3 detailed service cards
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="services" className="py-20 px-4 bg-card/20 border-y border-border/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Full-Service CMMC Support</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Advisory + Automation — Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Traditional CMMC consulting runs $50K–$150K. DefenseEye delivers the same expert guidance
              at a fraction of the cost — powered by automation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                badge: "Start Here — Free",
                badgeColor: "text-emerald-400 border-emerald-400/40 bg-emerald-400/5",
                icon: FileCheck,
                iconColor: "text-emerald-400",
                title: "CMMC Gap Assessment",
                desc: "We evaluate your posture against all 110 NIST SP 800-171 controls, calculate your estimated SPRS score, and deliver a prioritized remediation roadmap — at no cost.",
                features: [
                  "110-control gap analysis",
                  "SPRS score estimate",
                  "Prioritized remediation roadmap",
                  "CUI boundary review",
                  "Results within 24 hours",
                ],
              },
              {
                badge: "Most Requested",
                badgeColor: "text-primary border-primary/40 bg-primary/5",
                icon: Bot,
                iconColor: "text-primary",
                title: "Level 2 Readiness Program",
                desc: "Our advisors guide your team through full CMMC Level 2 readiness — remediation, SSP and POA&M development, evidence collection, and C3PAO selection and prep.",
                features: [
                  "End-to-end advisory",
                  "SSP & POA&M development",
                  "AI-powered evidence collection",
                  "SPRS score improvement",
                  "C3PAO assessment preparation",
                ],
              },
              {
                badge: "Enterprise",
                badgeColor: "text-muted-foreground border-border/50 bg-card/30",
                icon: Lock,
                iconColor: "text-violet-400",
                title: "MSSP & Prime Contractor",
                desc: "Multi-client CMMC program management for MSSPs and prime contractors managing subcontractor compliance across the supply chain.",
                features: [
                  "Multi-tenant management",
                  "Subcontractor flow-down",
                  "Supply chain risk mapping",
                  "Custom reporting",
                  "Dedicated advisor",
                ],
              },
            ].map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex flex-col bg-card/50 border border-border/40 rounded-sm p-7 hover:border-primary/30 transition-all duration-300"
              >
                <div className={`self-start text-xs font-semibold border px-2.5 py-1 rounded-full mb-5 ${svc.badgeColor}`}>
                  {svc.badge}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <svc.icon className={`w-5 h-5 ${svc.iconColor}`} />
                  <h3 className="font-heading font-bold text-foreground">{svc.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{svc.desc}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 w-full mt-auto"
                  onClick={() => setModalOpen(true)}
                >
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          PROCESS — 3 numbered steps
      ═══════════════════════════════════════════════════════════════ */}
      <Section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              How We Get You <span className="text-primary">Certified</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A structured, advisor-led process from your first call to your C3PAO assessment certificate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: BarChart3,
                title: "Free Gap Assessment",
                desc: "We evaluate your current security posture against all 110 NIST SP 800-171 controls, calculate your estimated SPRS score, and deliver a prioritized gap report within 24 hours — no cost, no commitment.",
              },
              {
                step: "02",
                icon: FileCheck,
                title: "Remediation & Documentation",
                desc: "Our certified advisors guide technical remediation while CMMC Lens generates your SSP, POA&M, policies, and evidence packages. We handle the documentation so your team can focus on closing gaps.",
              },
              {
                step: "03",
                icon: Award,
                title: "C3PAO Assessment Ready",
                desc: "We organize your complete evidence package, conduct a pre-assessment readiness review, prepare your staff for assessor interviews, and coordinate with your selected C3PAO for a smooth assessment.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className="relative"
              >
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-[calc(100%+1rem)] w-8 h-px bg-border/50" />
                )}
                <div className="flex items-start gap-5">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="font-heading font-bold text-primary text-sm">{step.step}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="w-4 h-4 text-primary" />
                      <h3 className="font-heading font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          URGENCY BANNER — loss aversion for desperate contractors
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 bg-destructive/5 border-y border-destructive/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <AlertTriangle className="w-8 h-8 text-destructive shrink-0" />
          <div className="flex-1">
            <p className="font-heading font-bold text-foreground mb-1">CMMC 2.0 is now in effect for new DoD contracts.</p>
            <p className="text-sm text-muted-foreground">Under 32 CFR Part 170 (effective December 16, 2024), DoD solicitations are beginning to include CMMC requirements. Contractors without a certification plan risk losing contract eligibility. SPRS score submission is required before contract award per DFARS 252.204-7019.</p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shrink-0 px-7" onClick={() => setModalOpen(true)}>
            Start Now
          </Button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Transparent Pricing</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              CMMC Compliance at a Fraction of <span className="text-primary">Traditional Consulting Cost</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Traditional CMMC consulting runs $50K–$150K+. DefenseEye delivers expert advisory and AI automation at a predictable rate — free trial, no credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                tier: "Starter",
                price: "$199",
                period: "/month",
                badge: null,
                description: "For small contractors starting their CMMC Level 1 journey.",
                features: ["CMMC Level 1 (17 practices)", "Up to 10 users", "Automated evidence collection", "Basic SSP generation", "SPRS score dashboard", "Email support"],
                cta: "Book Free Assessment",
                highlight: false,
              },
              {
                tier: "Professional",
                price: "$499",
                period: "/month",
                badge: "Most Popular",
                description: "Full CMMC Level 2 automation for contractors handling CUI.",
                features: ["CMMC Level 1 + Level 2 (110 controls)", "Up to 50 users", "AI-driven NIST 800-171 mapping", "Full SSP & POA&M generation", "C3PAO assessment prep package", "Real-time SPRS score tracking", "365-day continuous monitoring", "Priority support"],
                cta: "Book Free Assessment",
                highlight: true,
              },
              {
                tier: "Enterprise",
                price: "Custom",
                period: "",
                badge: null,
                description: "For prime contractors and MSSPs managing multiple clients.",
                features: ["Unlimited users & environments", "Multi-tenant MSSP dashboard", "Dedicated Customer Success Manager", "Custom NIST 800-172 controls", "White-label option", "SLA-backed uptime", "On-site C3PAO coordination", "24/7 priority support"],
                cta: "Free Consultation",
                highlight: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`relative flex flex-col rounded-sm border p-7 ${
                  plan.highlight
                    ? "border-primary/50 bg-card/80 shadow-lg shadow-primary/10"
                    : "border-border/40 bg-card/40"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <p className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-2">{plan.tier}</p>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="font-heading text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground text-sm mb-1">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={plan.highlight ? "bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full" : "border-primary/40 text-primary hover:bg-primary/10 w-full"}
                  variant={plan.highlight ? undefined : "outline"}
                  onClick={() => setModalOpen(true)}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8">
            All plans include a 14-day free trial. No credit card required. Annual billing available (2 months free).
          </p>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          FAQ — AEO / LLM citation optimized
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="faq" className="py-20 px-4 bg-card/20 border-y border-border/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Frequently Asked Questions About <span className="text-primary">CMMC 2.0</span>
            </h2>
            <p className="text-muted-foreground">
              Authoritative answers to the most common CMMC questions from DoD contractors —
              sourced from DODCIO, NIST, Cyber AB, and DFARS.
            </p>
          </div>

          <div className="space-y-3">
            <FAQItem
              question="What is CMMC 2.0 and who needs it?"
              answer="CMMC 2.0 (Cybersecurity Maturity Model Certification) is a DoD program codified as 32 CFR Part 170, effective December 16, 2024. Any Defense Industrial Base company that processes, stores, or transmits Controlled Unclassified Information (CUI) must achieve CMMC Level 2 certification via a third-party C3PAO assessment. The DoD estimates over 80,000 DIB companies require Level 2. (Source: DODCIO — dodcio.defense.gov/CMMC)"
            />
            <FAQItem
              question="What is the difference between CMMC Level 1 and Level 2?"
              answer="CMMC Level 1 covers 17 basic practices from FAR 52.204-21 for companies handling only Federal Contract Information (FCI) — annual self-attestation is allowed. CMMC Level 2 covers all 110 practices from NIST SP 800-171 Rev. 2 for CUI contractors — a triennial C3PAO assessment is required for most contracts. SPRS score submission to sprs.apps.mil is mandatory before contract award at both levels per DFARS 252.204-7019."
            />
            <FAQItem
              question="What is an SPRS score and why does it matter?"
              answer="The SPRS (Supplier Performance Risk System) cybersecurity score measures your NIST SP 800-171 compliance. Per the DoD Assessment Methodology: start at 110 points, deduct 1, 3, or 5 points for each unimplemented control. Contracting officers review your score before award. Scores below 70 are considered high risk. False submissions create False Claims Act liability — the DoJ Civil Cyber-Fraud Initiative actively pursues cases. (Source: DoD Assessment Methodology — dodcio.defense.gov)"
            />
            <FAQItem
              question="What is a C3PAO and how do I find one?"
              answer="A C3PAO (Certified Third-Party Assessment Organization) is authorized by the Cyber AB to conduct official CMMC Level 2 assessments using NIST SP 800-171A procedures. Results are submitted to DoD's eMASS system. Verify authorized C3PAOs at cyberaccreditation.us/marketplace. Only C3PAOs can issue CMMC Level 2 certifications — RPOs and consultants cannot conduct formal assessments. (Source: Cyber AB — cyberaccreditation.us, DFARS 252.204-7021)"
            />
            <FAQItem
              question="How long does CMMC Level 2 certification take?"
              answer="For a well-prepared organization, CMMC Level 2 certification typically takes 6–12 months from starting gap remediation to receiving the C3PAO certificate. The C3PAO assessment itself takes 6–16 weeks from engagement to certification decision. Organizations starting underprepared often spend an additional 3–6 months in remediation before re-assessment. DefenseEye's advisory and automation platform reduces preparation time by 60–80%."
            />
            <FAQItem
              question="Can I still get certified if I have open POA&M items?"
              answer="Under 32 CFR Part 170.21, contractors can receive conditional CMMC Level 2 certification with certain open POA&M items and must close them within 180 days. However, critical controls — including MFA for privileged accounts (3.5.3), CUI encryption at rest/transit (3.13.8, 3.13.10), and audit logging (3.3.1) — cannot remain in POA&M status at initial certification. A proper POA&M includes specific control numbers, named owners, realistic timelines, and genuine compensating controls."
            />
            <FAQItem
              question="Does Microsoft 365 GCC High satisfy CMMC Level 2 requirements?"
              answer="M365 GCC High holds FedRAMP High authorization and inherits many CMMC Level 2 infrastructure controls per Microsoft's Customer Responsibility Matrix. However, GCC High alone is not sufficient — you must correctly configure MFA, Conditional Access, DLP, audit logging, and endpoint encryption, and document all 110 controls in your SSP. M365 Commercial does NOT satisfy CMMC requirements for CUI per DFARS 252.239-7010."
            />
            <FAQItem
              question="How much does CMMC Level 2 certification cost?"
              answer="A C3PAO assessment typically costs $30,000–$120,000 for small-to-mid-size companies. Pre-assessment consulting and remediation can add $25,000–$150,000+ depending on existing gaps. The DoD's regulatory analysis estimated average annual costs of ~$57,000 for already-compliant companies and significantly more for those with major gaps. DefenseEye's advisory and automation approach reduces preparation costs by 60–80% compared to traditional consulting engagements."
            />
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          CONTACT / LEAD CAPTURE
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-8">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-accent tracking-wide uppercase">Response within 24 hours</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-5 text-foreground">
            Ready to Start Your CMMC Journey?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Book your free CMMC gap assessment. Our certified advisors will evaluate your current
            posture, estimate your SPRS score, and deliver a prioritized roadmap to certification.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-12 h-12 w-full sm:w-auto"
              onClick={() => setModalOpen(true)}
            >
              Book Your Free Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 text-base px-10 h-12 w-full sm:w-auto"
              onClick={() => setModalOpen(true)}
            >
              Get Free Gap Analysis
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Free assessment. No commitment. No credit card.
          </p>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="py-14 px-4 border-t border-border/30" role="contentinfo">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <DefenseEyeLogo className="w-9 h-7" />
                <span className="font-heading font-bold text-lg tracking-tight text-foreground">
                  Defense<span className="text-primary">Eye</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                CMMC 2.0 advisory consulting and AI-powered compliance automation for the U.S. Defense Industrial Base.
              </p>
              <p className="text-xs text-muted-foreground/60">NAICS: 541512, 541519 · SAM Registered</p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-heading font-semibold text-xs text-foreground mb-4 uppercase tracking-widest">Services</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Free CMMC Assessment", href: "#contact" },
                  { label: "Level 2 Readiness Program", href: "#services" },
                  { label: "SPRS Score Improvement", href: "#services" },
                  { label: "C3PAO Assessment Prep", href: "#services" },
                  { label: "Enterprise / MSSP", href: "#services" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-heading font-semibold text-xs text-foreground mb-4 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "CMMC Knowledge Hub", href: "/knowledge-hub" },
                  { label: "What Is CMMC 2.0?", href: "/knowledge-hub/what-is-cmmc" },
                  { label: "SPRS Score Guide", href: "/knowledge-hub/sprs-score" },
                  { label: "C3PAO Assessment Guide", href: "/knowledge-hub/certification-process" },
                  { label: "CMMC Blog", href: "/blog" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Authoritative Links */}
            <div>
              <h4 className="font-heading font-semibold text-xs text-foreground mb-4 uppercase tracking-widest">Authoritative Sources</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "DODCIO CMMC Program", href: "https://dodcio.defense.gov/CMMC/" },
                  { label: "NIST SP 800-171", href: "https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final" },
                  { label: "Cyber AB Marketplace", href: "https://cyberaccreditation.us/marketplace" },
                  { label: "NARA CUI Registry", href: "https://www.archives.gov/cui" },
                  { label: "DFARS 252.204-7012", href: "https://www.acquisition.gov/dfars/252.204-7012" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} DefenseEye, Inc. All rights reserved.
              CMMC Lens is a trademark of DefenseEye.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="/knowledge-hub" className="hover:text-primary transition-colors">Knowledge Hub</a>
              <span className="text-border">|</span>
              <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
              <span className="text-border">|</span>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
