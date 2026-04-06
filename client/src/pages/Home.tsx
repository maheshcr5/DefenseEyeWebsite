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
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import {
  Target,
  ClipboardCheck,
  Zap,
  FileCheck,
  CheckCircle2,
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
  PlayCircle,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useSeo } from "@/hooks/useSeo";

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
  const [painIdx, setPainIdx] = useState(0);
  const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";
  const heroPainPoints = [
    "“We have a contract renewal in 90 days and still no CMMC plan.”",
    "“Our prime is demanding proof of CUI compliance and we have nothing.”",
    "“We’re a 3-person IT team trying to pass a CMMC Level 2 audit.”",
    "“We paid for an assessment. Nobody told us what to actually fix first.”",
  ];

  useSeo(
    "DefenseEye.ai — CMMC Readiness Experts for U.S. Defense Contractors",
    "CMMC readiness experts and CMMC consultants for U.S. defense contractors. Get a CMMC gap assessment, NIST 800-171 compliance mapping, SSP and POA&M support, and fast CMMC Level 2 readiness."
  );

  // ── Structured Data for GEO / AEO / SEO ──────────────────────────────────
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do I need CMMC Level 2?",
          acceptedAnswer: { "@type": "Answer", text: "If your company handles Controlled Unclassified Information (CUI), you typically need CMMC Level 2 aligned to NIST SP 800-171 controls. Contractors handling only Federal Contract Information may only need Level 1." },
        },
        {
          "@type": "Question",
          name: "How long does CMMC readiness take?",
          acceptedAnswer: { "@type": "Answer", text: "Most small-to-mid defense contractors can complete an initial CMMC readiness sprint in 2-4 weeks, then execute remediation based on identified gaps and scope complexity." },
        },
        {
          "@type": "Question",
          name: "What happens if we are not compliant?",
          acceptedAnswer: { "@type": "Answer", text: "You risk losing eligibility for DoD contracts that require CMMC evidence, plus delays and higher remediation costs when compliance is deferred." },
        },
        {
          "@type": "Question",
          name: "What if we fail CMMC?",
          acceptedAnswer: { "@type": "Answer", text: "A failed or incomplete readiness posture can delay contract awards and increase remediation cost under deadline pressure. Preparing early with a structured readiness sprint lowers that risk." },
        },
        {
          "@type": "Question",
          name: "How much does CMMC compliance cost?",
          acceptedAnswer: { "@type": "Answer", text: "Cost depends on your current control maturity and environment. DefenseEye starts with a fixed-price CMMC readiness sprint so you can scope cost before full remediation." },
        },
        {
          "@type": "Question",
          name: "Can small companies pass CMMC?",
          acceptedAnswer: { "@type": "Answer", text: "Yes. Small companies can pass CMMC with clear scope, a practical SSP and POA&M, and a prioritized remediation plan matched to available IT capacity." },
        },
        {
          "@type": "Question",
          name: "What is CMMCLens automation?",
          acceptedAnswer: { "@type": "Answer", text: "CMMCLens is DefenseEye's CMMC Level 2 automation for evidence collection, real-time risk remediation, and real-time SSP/POA&M documentation workflows." },
        },
        {
          "@type": "Question",
          name: "How can I get CMMC ready in 2-4 weeks?",
          acceptedAnswer: { "@type": "Answer", text: "Use a scoped readiness sprint: prioritize high-risk gaps first, automate evidence and documentation, then package results for C3PAO readiness." },
        },
      ],
    };

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "DefenseEye — CMMC Advisory & Compliance Automation",
      url: "https://defenseeye.ai",
      description: "DefenseEye provides CMMC readiness consulting for U.S. defense contractors. Services include fixed-price CMMC readiness sprints, CMMC gap assessments, NIST SP 800-171 mapping, SSP and POA&M support, and C3PAO preparation.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Seattle",
        addressRegion: "WA",
        addressCountry: "US",
      },
      areaServed: { "@type": "Country", name: "United States" },
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

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "CMMCLens",
      brand: { "@type": "Brand", name: "DefenseEye" },
      url: "https://defenseeye.ai/cmmclens",
      category: "CMMC Level 2 Automation",
      description: "CMMC Level 2 automation for defense contractors: real-time risk remediation plus real-time SSP/POA&M generation.",
    };

    const videoSchema = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: "CMMC Assessment Readiness Briefing for DoD Contractors",
      description: "DefenseEye overview of CMMC consulting, advisory, and automation for faster CMMC assessment readiness.",
      embedUrl: "https://www.youtube.com/embed/g3Yhk1nUb7s",
      contentUrl: "https://www.youtube.com/watch?v=g3Yhk1nUb7s",
      uploadDate: "2026-04-04",
      publisher: {
        "@type": "Organization",
        name: "DefenseEye",
        url: "https://defenseeye.ai",
      },
    };

    const id = "de-schema";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.type = "application/ld+json";
      s.text = JSON.stringify([faqSchema, serviceSchema, orgSchema, productSchema, videoSchema]);
      document.head.appendChild(s);
    }
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setPainIdx((i) => (i + 1) % heroPainPoints.length);
    }, 2600);
    return () => clearInterval(t);
  }, [heroPainPoints.length]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden nvidia-grid-bg">
      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ═══════════════════════════════════════════════════════════════
          NAVIGATION — enterprise command style
      ═══════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm section-light"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <DefenseEyeLogo href="/" />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2 border border-border/40 bg-card/35 px-2 py-1 rounded-full">
            {[
              { label: "CMMC Sprint", href: "/services/cmmc-readiness-sprint" },
              { label: "CMMCLens", href: "/cmmclens" },
              { label: "Readiness Path", href: "#process" },
              { label: "Knowledge Hub", href: "/knowledge-hub" },
              { label: "Insights", href: "/blog" },
              { label: "Pricing", href: "/pricing" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-card/70"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-5"
              onClick={() => setModalOpen(true)}
            >
              Get Assessment
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
              className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
            >
              <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
                {[
                  { label: "CMMC Sprint", href: "/services/cmmc-readiness-sprint" },
                  { label: "CMMCLens", href: "/cmmclens" },
                  { label: "Readiness Path", href: "#process" },
                  { label: "Knowledge Hub", href: "/knowledge-hub" },
                  { label: "Insights", href: "/blog" },
                  { label: "Case Studies", href: "/case-studies" },
                  { label: "Pricing", href: "/pricing" },
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
          HERO — Armada-style command center layout
      ═══════════════════════════════════════════════════════════════ */}
      <header className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[620px] rounded-full bg-primary/8 blur-[150px]" />
          <div className="absolute top-24 left-1/4 w-[360px] h-[260px] rounded-full bg-accent/[0.08] blur-[110px]" />
          <div className="absolute bottom-0 right-0 w-[360px] h-[260px] rounded-full bg-sky-400/[0.06] blur-[120px]" />
        </div>
        <motion.div
          className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary tracking-wide uppercase">CMMC 2.0 Requirements Are Now Active in New DoD Awards</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-5 text-foreground">
              Your Next DoD Award
              <span className="block text-primary">Requires CMMC Proof</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Defense contractors that work with DefenseEye don’t just survive CMMC audits—they walk in with a C3PAO-ready package, a defensible SPRS narrative, and evidence their prime can’t question. CCP-led advisory plus CMMC Level 2 automation that delivers your SSP, POA&M, policies, and evidence in 2–4 weeks.
            </p>

            <div className="mb-7 min-h-[28px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={painIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm text-primary/90 font-medium"
                >
                  {heroPainPoints[painIdx]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-10 h-12 w-full sm:w-auto"
                >
                  Book Your Urgent CMMC Call
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <Button
                variant="outline"
                size="lg"
                className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 text-base px-10 h-12 w-full sm:w-auto"
                onClick={() => setModalOpen(true)}
              >
                Get CMMC Readiness Assessment
              </Button>
            </div>

            <p className="text-xs text-muted-foreground/75 mt-5">
              Built for defense subcontractors under 150 employees with active CUI contract requirements or an upcoming C3PAO assessment. Not for federal agencies or large prime contractors.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-card/55 border border-primary/30 rounded-sm p-6 md:p-7 shadow-xl shadow-black/20">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-5">Assessment Command Center</p>
              <div className="space-y-3 mb-6">
                {[
                  { icon: AlertTriangle, label: "Contract Risk Signal", value: "High", tone: "text-destructive" },
                  { icon: BarChart3, label: "Readiness Snapshot", value: "24-Hour Gap Report", tone: "text-primary" },
                  { icon: Zap, label: "Automation Output", value: "Real-Time SSP + POA&M", tone: "text-accent" },
                  { icon: ClipboardCheck, label: "Assessment Posture", value: "C3PAO-Ready Package", tone: "text-emerald-400" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between border border-border/40 bg-background/60 rounded-sm px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <row.icon className={`w-4 h-4 ${row.tone}`} />
                      <span className="text-xs text-muted-foreground">{row.label}</span>
                    </div>
                    <span className={`text-xs font-semibold ${row.tone}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { num: "2-4 wks", label: "Sprint Timeline" },
                  { num: "110", label: "Controls Mapped" },
                  { num: "60-80%", label: "Manual Work Reduced" },
                  { num: "24 hrs", label: "First Action Plan" },
                ].map((metric) => (
                  <div key={metric.label} className="border border-border/35 bg-background/65 rounded-sm p-3 text-center">
                    <p className="font-heading text-lg font-bold text-foreground">{metric.num}</p>
                    <p className="text-[11px] text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto mt-10 px-1">
          <div className="border border-border/30 bg-card/30 rounded-sm p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground/70">Focused Defense Hubs</p>
            <div className="flex flex-wrap items-center gap-2">
              {["Seattle", "Washington D.C. Metro", "Huntsville", "San Diego", "U.S. Defense Industrial Base"].map((hub) => (
                <span key={hub} className="text-xs px-2.5 py-1 rounded border border-border/40 text-muted-foreground bg-background/60">
                  {hub}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          NVIDIA-STYLE PRODUCT STRIP
      ═══════════════════════════════════════════════════════════════ */}
      <Section className="py-16 px-4 section-navy">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Platform Modules</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
                The Tools That Accelerate CMMC Readiness
              </h2>
            </div>
            <a href="/cmmclens" className="hidden sm:inline-flex text-sm text-primary hover:underline">
              Explore CMMCLens <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Bot,
                title: "CMMC Level 2 Automation",
                body: "Automate evidence collection, control mapping, and SSP plus POA&M workflows in one runtime.",
                cta: "/cmmclens",
                ctaLabel: "View Automation",
                glow: "from-primary/20 via-primary/5 to-transparent",
              },
              {
                icon: FileCheck,
                title: "Assessment Preparation",
                body: "Generate assessor-ready packages with interview prep, policy alignment, and evidence traceability.",
                cta: "/services/cmmc-readiness-sprint",
                ctaLabel: "View Sprint",
                glow: "from-emerald-400/20 via-emerald-400/5 to-transparent",
              },
              {
                icon: BarChart3,
                title: "Real-Time Risk Prioritization",
                body: "Prioritize remediation by contract impact, SPRS weight, and timeline pressure to move faster.",
                cta: "/pricing",
                ctaLabel: "View Pricing",
                glow: "from-lime-300/20 via-lime-300/5 to-transparent",
              },
            ].map((card) => (
              <div key={card.title} className="relative overflow-hidden border border-border/40 bg-card/55 rounded-sm p-6 hover:border-primary/40 transition-colors">
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glow}`} />
                <div className="relative">
                  <div className="w-10 h-10 rounded-sm border border-primary/30 bg-background/70 flex items-center justify-center mb-4">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{card.body}</p>
                  <a href={card.cta} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                    {card.ctaLabel} <ArrowRight className="w-4 h-4 ml-1.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>


      {/* ═══════════════════════════════════════════════════════════════
          VIDEO BRIEFING — trust + urgency for high-intent visitors
      ═══════════════════════════════════════════════════════════════ */}
      <Section className="py-20 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-5">
                <PlayCircle className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary tracking-wide uppercase">Watch: CMMC Readiness Briefing</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold leading-tight mb-4 text-foreground">
                See How DefenseEye Accelerates
                <span className="text-primary"> CMMC Assessment Readiness</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                If your team is under deadline pressure for CMMC consulting, advisory, or automation
                like `cmmclensgov.azurewebsites.net`, this walkthrough shows the execution model
                that turns uncertainty into assessment-ready progress.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "What to fix first when contracts are at risk",
                  "How advisory + automation shortens prep cycles",
                  "How to organize evidence for C3PAO confidence",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 mb-2">Key Moments</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "00:00 Contract Risk", href: "https://www.youtube.com/watch?v=g3Yhk1nUb7s&t=0s" },
                    { label: "01:10 CMMC Sprint", href: "https://www.youtube.com/watch?v=g3Yhk1nUb7s&t=70s" },
                    { label: "02:20 SSP + POA&M", href: "https://www.youtube.com/watch?v=g3Yhk1nUb7s&t=140s" },
                    { label: "03:30 C3PAO Prep", href: "https://www.youtube.com/watch?v=g3Yhk1nUb7s&t=210s" },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2.5 py-1 rounded border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  Schedule a Fast 30-Min Assessment Call <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>

            <div className="lg:col-span-7">
              <div className="relative bracket-decoration bg-card/50 border border-border/40 p-3">
                <div className="relative w-full overflow-hidden rounded-sm border border-border/30 bg-black aspect-video">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/g3Yhk1nUb7s?rel=0"
                    title="CMMC Assessment Readiness Briefing"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          PROBLEM SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <Section className="py-20 px-4 section-navy">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-destructive uppercase tracking-widest mb-3">If This Sounds Familiar</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
              This Is Where Most Teams Stall
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Most defense subcontractors we meet are under-resourced, under time pressure, and one CMMC question away from contract anxiety.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              CMMC Title 32 is active, and acquisition clause rollout is tightening bid windows through 2025-2026.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              "You might lose contracts because CMMC evidence is not assessment-ready.",
              "Your team is confused about CMMC Level 2, NIST 800-171 compliance, and what to fix first.",
              "You have 1-3 IT staff and cannot run day-to-day operations plus full compliance execution.",
            ].map((item) => (
              <div key={item} className="bg-card/50 border border-border/40 p-6 rounded-sm">
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          4-COLUMN CAPABILITY CARDS — core value props
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="mb-9 text-center">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">How We Move You Forward</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              What You Get in <span className="text-primary">One Unified Execution Model</span>
            </h2>
          </div>
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
                title: "CMMC Level 2 Automation",
                desc: "Real-time risk remediation, real-time SSP/policies/procedures/standards generation, POA&M tracking, and continuous SPRS monitoring.",
              },
              {
                icon: Target,
                iconColor: "text-emerald-400",
                iconBg: "bg-emerald-400/10 border-emerald-400/20",
                title: "Advisory & Consulting",
                desc: "Certified CMMC advisors for scoping, remediation, documentation, and C3PAO coordination.",
              },
              {
                icon: ClipboardCheck,
                iconColor: "text-sky-400",
                iconBg: "bg-sky-400/10 border-sky-400/20",
                title: "Assessment Preparation",
                desc: "C3PAO-ready evidence packages, mock interviews, and executive-ready risk narratives.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-card/50 border border-border/40 rounded-sm p-6 hover:border-primary/30 hover:bg-card/75 transition-all duration-300"
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
      <Section className="py-20 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Solution</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Stop Firefighting CMMC.
              <span className="text-primary"> Start Operating Like a Program Your Prime Trusts</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              After guiding dozens of defense contractors through gap assessments and C3PAO preparations, we built a structured approach that produces real deliverables—not slide decks. Fixed price. Defined scope. Contractor-sized speed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl mx-auto">
            {[
              "CMMC gap assessment (CMMC Level 1 / CMMC Level 2 aligned)",
              "NIST SP 800-171 compliance mapping across all 110 controls",
              "SSP starter package (System Security Plan)",
              "POA&M with prioritized remediation actions",
              "Prioritized remediation roadmap tied to business risk",
              "SPRS score estimate with improvement priorities",
              "CUI boundary scoping and data flow mapping",
              "C3PAO-ready evidence structure by control family",
              "DFARS 252.204-7012 and 252.204-7019 alignment guidance",
              "Interview-readiness prep for assessors and leadership",
              "Execution support for lean IT teams (1-3 staff)",
              "Automation-assisted documentation and evidence workflows",
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
      <Section className="py-16 px-4 section-gray">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-medium text-muted-foreground/50 uppercase tracking-widest mb-10">
            Why DefenseEye
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { image: "/ccp-badge.svg", label: "CCP-Led Support", sub: "Led by Certified CMMC Professionals (CCPs)" },
              { icon: Users, label: "Defense-Focused", sub: "Built for U.S. defense contractors handling CUI" },
              { icon: BookOpen, label: "Practical Outputs", sub: "SSP and POA&M deliverables your team can use now" },
              { icon: TrendingUp, label: "Fast Turnaround", sub: "Designed for contract-driven readiness timelines" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center p-5 bg-card/30 border border-border/30 rounded-sm">
                {(() => {
                  const Icon = item.icon;
                  return item.image ? (
                    <img src={item.image} alt="CMMC CCP badge" className="w-10 h-10 mb-3" />
                  ) : Icon ? (
                    <Icon className="w-6 h-6 text-primary mb-3" />
                  ) : null;
                })()}
                <p className="font-heading font-semibold text-sm text-foreground mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Built for defense contractors. Aligned with DoD requirements. Serving U.S. teams nationwide, including Washington and Seattle region suppliers.
          </p>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          SERVICES — 3 detailed service cards
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="services" className="py-20 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">How We Work</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Start with the <span className="text-primary">CMMC Readiness Sprint</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fixed-price, scope-first, and designed for small-to-mid contractors that need speed without sacrificing quality.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Urgent buyer?{" "}
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Book a call now
              </a>
              {" "}to protect active DoD contract opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                badge: "Primary Entry Point",
                badgeColor: "text-emerald-400 border-emerald-400/40 bg-emerald-400/5",
                icon: FileCheck,
                iconColor: "text-emerald-400",
                title: "CMMC Readiness Sprint",
                desc: "A fixed-price sprint that gives you a CMMC gap assessment, NIST 800-171 mapping, SSP starter, POA&M, and prioritized roadmap.",
                features: [
                  "Fixed-price engagement",
                  "2-4 week timeline",
                  "Level 1 / Level 2 alignment",
                  "SSP + POA&M starter deliverables",
                  "Roadmap tied to contract risk",
                ],
              },
              {
                badge: "Most Requested",
                badgeColor: "text-primary border-primary/40 bg-primary/5",
                icon: Bot,
                iconColor: "text-primary",
                title: "Level 2 Implementation Support",
                desc: "For teams that need ongoing CMMC consultant support after the sprint: remediation execution, control hardening, and assessment prep.",
                features: [
                  "End-to-end advisory",
                  "SSP & POA&M development",
                  "CMMC Level 2 automation workflows",
                  "Real-time risk remediation",
                  "Real-time SSP/policies/procedures/standards docs",
                  "SPRS score improvement",
                  "C3PAO assessment preparation",
                ],
              },
              {
                badge: "Enterprise",
                badgeColor: "text-muted-foreground border-border/50 bg-card/30",
                icon: Lock,
                iconColor: "text-violet-400",
                title: "MSSP & Prime Enablement",
                desc: "Multi-entity readiness management for MSSPs and prime contractors responsible for subcontractor compliance outcomes.",
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
                {svc.title === "CMMC Readiness Sprint" ? (
                  <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="mt-auto">
                    <Button
                      variant="outline"
                      className="border-primary/40 text-primary hover:bg-primary/10 w-full"
                    >
                      Book Your Urgent CMMC Readiness Call <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant="outline"
                    className="border-primary/40 text-primary hover:bg-primary/10 w-full mt-auto"
                    onClick={() => setModalOpen(true)}
                  >
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          PROCESS — 3 numbered steps
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="process" className="py-20 px-4 section-gray">
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
                desc: "Our certified advisors guide technical remediation while CMMC Level 2 automation generates SSP, policies, procedures, standards, POA&M, and evidence packages in real time.",
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
      <section className="py-10 px-4 bg-[#0D1B33] border-y border-[#FFB547]/30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <AlertTriangle className="w-8 h-8 text-[#FFB547] shrink-0" />
          <div className="flex-1">
            <p className="font-heading font-bold text-white mb-1">If your next award requires CMMC proof, waiting is the risk.</p>
            <p className="text-sm text-white/70">CMMC requirements are in active rollout under 32 CFR Part 170 (effective December 16, 2024). Teams without a readiness plan, evidence package, and SPRS discipline are exposing pipeline revenue and renewal confidence.</p>
          </div>
          <Button className="bg-[#FFB547] text-[#0D1B33] hover:bg-[#FFB547]/90 font-semibold shrink-0 px-7" onClick={() => setModalOpen(true)}>
            Start Now
          </Button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="pricing" className="py-20 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Pricing / Entry Point</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Fixed-Price Start for <span className="text-primary">Small and Mid-Sized Contractors</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start with a fixed-price CMMC readiness sprint, then scale only where needed. Built for teams that need speed and budget clarity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                tier: "Starter",
                price: "Tailored",
                period: "",
                badge: null,
                description: "For contractors starting CMMC readiness with urgent clarity needs.",
                features: ["Initial CMMC scope and gap review", "Level 1 / Level 2 alignment", "SSP starter structure", "POA&M starter actions", "SPRS direction guidance", "Advisor support"],
                cta: "Get Tailored Quote",
                highlight: false,
              },
              {
                tier: "Professional",
                price: "Tailored",
                period: "",
                badge: "Most Popular",
                description: "Full CMMC Level 2 automation for contractors handling CUI under deadlines.",
                features: ["110-control NIST 800-171 mapping", "Real-time risk remediation", "Real-time SSP/policies/procedures/standards", "Full POA&M workflow", "C3PAO assessment prep package", "Real-time SPRS tracking", "Continuous monitoring", "Priority support"],
                cta: "Book Urgent Readiness Call",
                highlight: true,
              },
              {
                tier: "Enterprise",
                price: "Custom",
                period: "",
                badge: null,
                description: "For prime contractors and MSSPs managing multiple clients.",
                features: ["Unlimited users & environments", "Multi-tenant MSSP dashboard", "Dedicated Customer Success Manager", "Custom NIST 800-172 controls", "White-label option", "SLA-backed uptime", "On-site C3PAO coordination", "24/7 priority support"],
                cta: "Request Custom Scope",
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
            Transparent scope, tailored quote, and a practical rollout path for urgent contract timelines.
          </p>
        </div>
      </Section>

      {/* FAQ TEASER */}
      <Section className="py-12 px-4 section-gray">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl font-bold mb-3 text-foreground">
            Common CMMC Questions — Answered
          </h2>
          <p className="text-muted-foreground mb-5">
            Level 1 vs Level 2, CUI scope, SPRS scores, C3PAO assessments, timelines, and costs — all in plain language.
          </p>
          <a href="/faq" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            Browse the full CMMC FAQ <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          CONTACT / LEAD CAPTURE
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="contact" className="py-20 px-4 section-light">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-8">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-accent tracking-wide uppercase">Response within 24 hours</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-5 text-foreground">
            Protect Your DoD Contracts Before It Is Too Late
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Get a fast CMMC readiness assessment with clear next steps for CMMC Level 2 and NIST 800-171 compliance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-12 h-12 w-full sm:w-auto"
              onClick={() => setModalOpen(true)}
            >
              Get Your CMMC Readiness Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 text-base px-10 h-12 w-full sm:w-auto"
              onClick={() => setModalOpen(true)}
            >
              Book a 30-min CMMC Call
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
      <footer className="py-14 px-4 border-t border-border/30 section-gray" role="contentinfo">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <DefenseEyeLogo />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                CMMC 2.0 advisory consulting and CMMC Level 2 automation for the U.S. Defense Industrial Base.
              </p>
              <p className="text-xs text-muted-foreground/60">NAICS: 541512, 541519 · SAM Registered</p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-heading font-semibold text-xs text-foreground mb-4 uppercase tracking-widest">Services</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "CMMC Readiness Sprint", href: "/services/cmmc-readiness-sprint" },
                  { label: "Get CMMC Gap Assessment", href: "#contact" },
                  { label: "CMMC Level 2 Support", href: "#services" },
                  { label: "SSP and POA&M Support", href: "#services" },
                  { label: "C3PAO Assessment Prep", href: "#services" },
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
                  { label: "CMMCLens Product Page", href: "/cmmclens" },
                  { label: "4-Week Sprint Guide", href: "/cmmc-readiness-sprint-guide" },
                  { label: "CMMC FAQ", href: "/faq" },
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
              <a href="/faq" className="hover:text-primary transition-colors">FAQ</a>
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
