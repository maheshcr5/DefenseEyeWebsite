/*
 * DefenseEye.ai Landing Page — "Command Center" Design
 * Design: Tactical Interface / Military HUD aesthetic
 * Colors: Navy base (#0A1628), Cyan accent (#00D4FF), Amber CTA (#FFB547)
 * Typography: Space Grotesk (headings) + IBM Plex Sans (body)
 */

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Zap,
  BarChart3,
  FileCheck,
  Clock,
  Eye,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  Target,
  Layers,
  Bot,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  DollarSign,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── Image URLs ───
const HERO_DASHBOARD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663028771419/EuH9Png2HimpzgUP2fBtWN/hero-dashboard-j54sqsSTsp5DE5ZQ49aRch.webp";
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663028771419/EuH9Png2HimpzgUP2fBtWN/hero-bg-pattern-iega5H83gpAZQ7MY3Y2dWm.webp";
const FEATURE_EVIDENCE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663028771419/EuH9Png2HimpzgUP2fBtWN/feature-evidence-ZzfobMQwYhy9eGaaH7uYxP.webp";
const FEATURE_MONITORING = "https://d2xsxph8kpxj0f.cloudfront.net/310419663028771419/EuH9Png2HimpzgUP2fBtWN/feature-monitoring-7m8CSn8qMd6ychfXsmM3xY.webp";
const FEATURE_SHIELD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663028771419/EuH9Png2HimpzgUP2fBtWN/feature-shield-KkbkpNAAaqNTB8dVtCaqST.webp";

// ─── Animated Counter ───
function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── FAQ Item ───
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors duration-200"
        aria-expanded={open}
      >
        <span className="font-heading font-semibold text-foreground pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-primary shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
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
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section Wrapper with InView animation ───
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── Structured Data for LLMs / AI Agents / SEO ───
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is CMMC 2.0 and why do DoD contractors need it?",
          acceptedAnswer: { "@type": "Answer", text: "CMMC 2.0 (Cybersecurity Maturity Model Certification) is a Department of Defense framework that requires all defense contractors to demonstrate specific cybersecurity practices to protect Controlled Unclassified Information (CUI) and Federal Contract Information (FCI). Starting in 2025, CMMC certification is being phased into all new DoD contracts, making compliance mandatory for contractors who want to continue working with the Department of Defense." },
        },
        {
          "@type": "Question",
          name: "How does CMMC Lens automate CMMC compliance?",
          acceptedAnswer: { "@type": "Answer", text: "CMMC Lens uses AI-governed automation to streamline the entire CMMC readiness process. It automatically collects evidence from cloud environments (AWS, Azure, GCC High), maps that evidence to all 110 NIST 800-171 controls, generates your System Security Plan (SSP) and Plan of Action & Milestones (POA&M), and continuously monitors your SPRS score — reducing manual documentation and preparation work by up to 80%." },
        },
        {
          "@type": "Question",
          name: "What is the difference between CMMC Level 1 and Level 2?",
          acceptedAnswer: { "@type": "Answer", text: "CMMC Level 1 requires 17 basic cybersecurity practices for protecting Federal Contract Information (FCI) and allows annual self-assessment. CMMC Level 2 requires all 110 security controls from NIST SP 800-171 to protect Controlled Unclassified Information (CUI) and mandates a third-party C3PAO assessment. CMMC Lens supports both levels with automated evidence mapping and compliance tracking." },
        },
        {
          "@type": "Question",
          name: "How long does it take to achieve CMMC readiness with DefenseEye?",
          acceptedAnswer: { "@type": "Answer", text: "With CMMC Lens, most organizations can achieve audit readiness in days rather than the typical 6–12 months required for manual processes. The AI-driven platform automates evidence collection, NIST 800-171 control mapping, and documentation generation, reducing documentation and preparation time by up to 80%." },
        },
        {
          "@type": "Question",
          name: "What is an SPRS score and how does DefenseEye improve it?",
          acceptedAnswer: { "@type": "Answer", text: "The Supplier Performance Risk System (SPRS) score is a numerical representation of your NIST 800-171 compliance, ranging from -203 to 110. DefenseEye's CMMC Lens continuously monitors your security posture, provides real-time SPRS score tracking, and identifies specific controls that need remediation to maximize your score before C3PAO assessment." },
        },
      ],
    };

    const videoSchema = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: "What Is CMMC 2.0? CMMC Compliance Explained for DoD Contractors",
      description: "A plain-English overview of CMMC 2.0 — what DoD prime and subcontractors need to know about CMMC Level 2, NIST 800-171, C3PAO assessments, and how to achieve certification faster with AI automation.",
      thumbnailUrl: "https://img.youtube.com/vi/g3Yhk1nUb7s/maxresdefault.jpg",
      embedUrl: "https://www.youtube.com/embed/g3Yhk1nUb7s",
      url: "https://www.youtube.com/watch?v=g3Yhk1nUb7s",
      publisher: { "@type": "Organization", name: "DefenseEye", url: "https://defenseeye.ai" },
    };

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "DefenseEye",
      url: "https://defenseeye.ai",
      description: "AI-powered CMMC 2.0 compliance automation for Department of Defense contractors. Protecting Controlled Unclassified Information with intelligent automation.",
      knowsAbout: ["CMMC 2.0", "NIST 800-171", "DFARS 252.204-7012", "SPRS score", "C3PAO assessment", "CUI protection", "DoD cybersecurity"],
    };

    const scriptId = "defenseeye-schema";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.text = JSON.stringify([faqSchema, videoSchema, orgSchema]);
      document.head.appendChild(script);
    }
    return () => { document.getElementById(scriptId)?.remove(); };
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Knowledge Hub", href: "/knowledge-hub" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── Scan Line Effect ─── */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="scan-line absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          NAVIGATION
      ═══════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30" role="navigation" aria-label="Main navigation">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group" aria-label="DefenseEye.ai Home">
            <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:glow-cyan transition-all duration-300">
              <Shield className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-foreground">
              Defense<span className="text-primary">Eye</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10">
              Book a Demo
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold glow-amber">
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-card border-b border-border overflow-hidden"
            >
              <div className="container py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                  <Button variant="outline" size="sm" className="border-primary/40 text-primary w-full">
                    Book a Demo
                  </Button>
                  <Button size="sm" className="bg-accent text-accent-foreground w-full font-semibold">
                    Start Free Trial
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <header className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary pulse-ring" />
                <span className="text-xs font-medium text-primary tracking-wide uppercase">AI-Governed CMMC 2.0 Compliance</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                Automate <span className="text-primary">CMMC Readiness</span> in Days, Not Months
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                CMMC Lens by DefenseEye uses AI-driven automation to handle evidence collection, NIST 800-171 control mapping, SSP generation, and continuous SPRS score monitoring — reducing documentation and preparation time by up to 80% for DoD contractors pursuing CMMC 2.0 certification.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8 glow-amber">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-primary/40 text-primary hover:bg-primary/10 text-base px-8">
                  Book a Demo
                </Button>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>DFARS Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>NIST 800-171 Aligned</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>FedRAMP Ready</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Dashboard Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              <div className="bracket-decoration p-1">
                <img
                  src={HERO_DASHBOARD}
                  alt="CMMC Lens compliance dashboard showing real-time CMMC 2.0 readiness metrics, NIST 800-171 control mapping, and SPRS score monitoring"
                  className="w-full rounded-sm border border-border/30 shadow-2xl"
                  loading="eager"
                  width={1376}
                  height={768}
                />
              </div>
              {/* Floating status badge */}
              <div className="absolute -bottom-4 -left-4 bg-card border border-primary/30 rounded px-4 py-2.5 shadow-xl glow-cyan">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-foreground">Compliance Status: Active</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          SOCIAL PROOF / STATS
      ═══════════════════════════════════════════════════════════════ */}
      <Section className="py-16 border-y border-border/30 bg-card/30">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: 80, suffix: "%", label: "Reduction in Documentation Time", icon: Clock },
              { value: 80, suffix: "%", label: "Less Manual Effort", icon: Zap },
              { value: 1000, suffix: "+", label: "Hours Saved Per Assessment", icon: BarChart3 },
              { value: 365, suffix: "", label: "Days of Continuous Monitoring", icon: Eye },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3 opacity-70" />
                <div className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          SOCIAL PROOF — Industry Stats & Trust Signals
      ═══════════════════════════════════════════════════════════════ */}
      <Section className="py-20 lg:py-28">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-4">
              <span className="text-xs font-medium text-primary tracking-wide uppercase">The CMMC Challenge</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              Why DoD Contractors Need <span className="text-primary">CMMC Automation</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              CMMC Level 2 compliance is mandatory for DoD prime and sub-contractors handling CUI. The manual path is expensive, slow, and error-prone.
            </p>
          </div>

          {/* Industry pain-point stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Clock,
                stat: "6–12 months",
                label: "Average manual CMMC Level 2 readiness timeline",
                source: "DoD CMMC Program Office",
              },
              {
                icon: DollarSign,
                stat: "$50K–$150K+",
                label: "Typical consulting fees for manual compliance preparation",
                source: "Industry benchmark",
              },
              {
                icon: TrendingUp,
                stat: "300,000+",
                label: "Defense contractors in the DIB required to comply with CMMC",
                source: "Office of the Under Secretary of Defense",
              },
            ].map((item, i) => (
              <motion.div
                key={item.stat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bracket-decoration bg-card/60 border border-border/40 p-6 text-center"
              >
                <item.icon className="w-7 h-7 text-accent mx-auto mb-3" />
                <div className="font-heading text-2xl font-bold text-accent mb-2">{item.stat}</div>
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{item.label}</p>
                <p className="text-xs text-muted-foreground/50 italic">{item.source}</p>
              </motion.div>
            ))}
          </div>

          {/* How DefenseEye Addresses It */}
          <div className="max-w-4xl mx-auto bg-card/40 border border-primary/20 p-8 lg:p-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-heading text-2xl font-bold mb-4">
                  Built for the <span className="text-primary">Defense Industrial Base</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  DefenseEye is purpose-built for the contractors, subcontractors, and MSSPs navigating the CMMC ecosystem. Our platform eliminates the guesswork from NIST 800-171 control mapping and slashes documentation time — so your team can focus on the hands-on remediation work that actually needs human judgment.
                </p>
                <ul className="space-y-3">
                  {[
                    "DoD prime contractors (CMMC Level 2 required)",
                    "Defense subcontractors handling CUI under DFARS 252.204-7012",
                    "MSSPs supporting multiple DIB clients",
                    "Organizations with SPRS scores below 70 needing rapid improvement",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                {[
                  { icon: Award, label: "Early Access Program", desc: "Join our founding customer cohort and shape the product roadmap." },
                  { icon: Users, label: "CMMC Expert Advisory Board", desc: "Built with guidance from C3PAO assessors and DoD cybersecurity practitioners." },
                  { icon: BookOpen, label: "Free CMMC Knowledge Hub", desc: "Access our library of guides, checklists, and SPRS calculators — no signup required." },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 bg-background/40 border border-border/30">
                    <div className="w-9 h-9 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <item.icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-sm text-foreground mb-0.5">{item.label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURES — CMMC Lens Capabilities
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="features" className="py-20 lg:py-28">
        <div className="container">
          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-4">
              <span className="text-xs font-medium text-primary tracking-wide uppercase">CMMC Lens Capabilities</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              AI-Powered <span className="text-primary">CMMC 2.0 Compliance</span> Automation
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              CMMC Lens automates the most time-consuming aspects of Cybersecurity Maturity Model Certification readiness, from evidence collection to continuous SPRS score monitoring.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                title: "AI-Driven Evidence Collection",
                description: "Automatically collect and organize compliance evidence from your AWS, Azure, and GCC High cloud environments. Our AI maps each artifact to the relevant NIST 800-171 controls.",
                image: FEATURE_EVIDENCE,
              },
              {
                icon: FileCheck,
                title: "Automated SSP & POA&M Generation",
                description: "Generate your System Security Plan and Plan of Action & Milestones documents automatically. CMMC Lens produces audit-ready documentation aligned with DFARS and FAR requirements.",
                image: null,
              },
              {
                icon: Target,
                title: "NIST 800-171 Control Mapping",
                description: "Automatically map your security controls to all 110 NIST SP 800-171 requirements. Identify gaps instantly and receive prioritized remediation guidance for CMMC Level 2 readiness.",
                image: null,
              },
              {
                icon: BarChart3,
                title: "Real-Time SPRS Score Tracking",
                description: "Monitor your Supplier Performance Risk System score continuously. Track progress as you close gaps and see exactly which controls impact your score the most.",
                image: null,
              },
              {
                icon: Eye,
                title: "365-Day Continuous Monitoring",
                description: "Maintain compliance year-round with continuous monitoring of your security posture. Receive alerts when configurations drift or new vulnerabilities affect your CMMC readiness.",
                image: FEATURE_MONITORING,
              },
              {
                icon: Layers,
                title: "C3PAO Assessment Preparation",
                description: "Prepare for your Certified Third-Party Assessment Organization audit with pre-assessment checklists, evidence packages, and gap analysis reports tailored to your CMMC level.",
                image: null,
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`group bracket-decoration bg-card/60 backdrop-blur-sm border border-border/40 p-6 hover:border-primary/40 transition-all duration-300 ${feature.image ? "md:col-span-1 row-span-1" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
                {feature.image && (
                  <div className="mt-5 rounded overflow-hidden border border-border/20">
                    <img
                      src={feature.image}
                      alt={`${feature.title} visualization for CMMC compliance automation`}
                      className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="how-it-works" className="py-20 lg:py-28 bg-card/20 border-y border-border/20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-4">
              <span className="text-xs font-medium text-primary tracking-wide uppercase">How CMMC Lens Works</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              From Assessment to <span className="text-primary">Certification</span> in Three Steps
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              CMMC Lens streamlines the entire CMMC 2.0 compliance journey for DoD contractors, turning months of manual work into days of automated readiness.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Your Environment",
                description: "Integrate CMMC Lens with your cloud infrastructure (AWS, Azure, GCC High, Microsoft 365). Our platform securely scans your environment and automatically inventories all security controls and configurations relevant to NIST 800-171.",
              },
              {
                step: "02",
                title: "AI Maps & Analyzes",
                description: "Our AI engine automatically maps your existing security evidence to all 110 NIST 800-171 controls, identifies compliance gaps, calculates your real-time SPRS score, and generates your SSP and POA&M documentation.",
              },
              {
                step: "03",
                title: "Achieve Audit Readiness",
                description: "Receive a complete, audit-ready evidence package for your C3PAO assessment. CMMC Lens provides continuous monitoring to maintain compliance, alerting you to any configuration drift that could impact your CMMC certification.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="relative"
              >
                <div className="bracket-decoration bg-card/60 backdrop-blur-sm border border-border/40 p-8 h-full">
                  <div className="font-heading text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h3 className="font-heading text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-8 h-8 text-primary/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          VIDEO — CMMC Explained
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="cmmc-overview-video" className="py-20 lg:py-28">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-4">
              <span className="text-xs font-medium text-primary tracking-wide uppercase">CMMC Explained</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              Watch: <span className="text-primary">What Is CMMC 2.0</span> and Why It Matters for DoD Contractors
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A plain-English breakdown of the Cybersecurity Maturity Model Certification — CMMC Level 2 requirements, NIST 800-171 controls, C3PAO assessments, and how AI automation accelerates your path to certification.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* 16:9 responsive embed */}
            <div className="relative w-full overflow-hidden rounded-sm border border-border/40 shadow-2xl mb-8" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/g3Yhk1nUb7s"
                title="What Is CMMC 2.0? CMMC Compliance Explained for DoD Contractors | DefenseEye"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Key takeaways */}
            <div className="bg-card/60 border border-border/40 p-8">
              <h3 className="font-heading text-lg font-semibold mb-5 text-foreground">Key Takeaways</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "CMMC 2.0 is mandatory for all DoD prime and subcontractors handling CUI",
                  "CMMC Level 2 requires all 110 NIST SP 800-171 controls — not optional",
                  "C3PAO third-party assessments required for most Level 2 contractors",
                  "SPRS scores must be submitted to the government before contract awards",
                  "Manual CMMC preparation typically takes 6–12 months and $50K–$150K+",
                  "AI-driven automation reduces readiness documentation time by up to 80%",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          CMMC LEVELS COMPARISON
      ═══════════════════════════════════════════════════════════════ */}
      <Section className="py-20 lg:py-28">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              CMMC Level 1 vs <span className="text-primary">Level 2</span> Comparison
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Understanding the difference between CMMC certification levels is critical for DoD contractors. CMMC Lens supports both levels with tailored automation workflows.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" role="table">
                <thead>
                  <tr className="border-b-2 border-primary/30">
                    <th className="text-left py-4 px-4 font-heading font-semibold text-foreground">Criteria</th>
                    <th className="text-center py-4 px-4 font-heading font-semibold text-primary">Level 1</th>
                    <th className="text-center py-4 px-4 font-heading font-semibold text-accent">Level 2</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { criteria: "Number of Controls", l1: "17 practices", l2: "110 controls (NIST 800-171)" },
                    { criteria: "Data Protected", l1: "FCI only", l2: "CUI and FCI" },
                    { criteria: "Assessment Type", l1: "Annual self-assessment", l2: "C3PAO third-party assessment" },
                    { criteria: "Documentation Required", l1: "Basic policies", l2: "Full SSP, POA&M, evidence packages" },
                    { criteria: "SPRS Score Required", l1: "Not required", l2: "Yes (submitted to SPRS)" },
                    { criteria: "CMMC Lens Support", l1: "Full automation", l2: "Full automation + C3PAO prep" },
                  ].map((row, i) => (
                    <tr key={row.criteria} className={`border-b border-border/30 ${i % 2 === 0 ? "bg-card/30" : ""}`}>
                      <td className="py-3.5 px-4 text-sm font-medium text-foreground">{row.criteria}</td>
                      <td className="py-3.5 px-4 text-sm text-center text-muted-foreground">{row.l1}</td>
                      <td className="py-3.5 px-4 text-sm text-center text-muted-foreground">{row.l2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          SHIELD / CUI PROTECTION SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <Section className="py-20 lg:py-28 bg-card/20 border-y border-border/20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <img
                src={FEATURE_SHIELD}
                alt="AI-powered digital shield protecting Controlled Unclassified Information for CMMC compliance"
                className="w-full max-w-md mx-auto rounded-sm border border-border/30"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
                Protect <span className="text-primary">Controlled Unclassified Information</span> with AI-Governed Security
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                DefenseEye's CMMC Lens provides comprehensive CUI protection aligned with DFARS 252.204-7012 and the Federal Acquisition Regulation. Our AI-governed platform ensures your organization meets every requirement for handling sensitive defense information.
              </p>
              <ul className="space-y-4">
                {[
                  "Automated CUI identification and classification across your environment",
                  "Encryption validation for data at rest and in transit (FIPS 140-2)",
                  "Access control monitoring aligned with NIST 800-171 AC controls",
                  "Incident response plan generation and testing workflows",
                  "Supply chain risk management for CMMC ecosystem partners",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="pricing" className="py-20 lg:py-28">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-4">
              <span className="text-xs font-medium text-primary tracking-wide uppercase">Transparent Pricing</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              CMMC Compliance at a Fraction of <span className="text-primary">Consulting Costs</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Traditional CMMC consulting runs $50K–$150K+. CMMC Lens delivers AI-driven automation at a predictable monthly rate — with a free trial, no credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                tier: "Starter",
                price: "$199",
                period: "/month",
                badge: null,
                description: "Perfect for small contractors beginning their CMMC Level 1 journey.",
                features: [
                  "CMMC Level 1 (17 practices)",
                  "Up to 10 users",
                  "Automated evidence collection",
                  "Basic SSP generation",
                  "SPRS score dashboard",
                  "Email support",
                ],
                cta: "Start Free Trial",
                ctaVariant: "outline" as const,
              },
              {
                tier: "Professional",
                price: "$499",
                period: "/month",
                badge: "Most Popular",
                description: "Full CMMC Level 2 automation for contractors handling CUI.",
                features: [
                  "CMMC Level 1 + Level 2 (110 controls)",
                  "Up to 50 users",
                  "AI-driven NIST 800-171 mapping",
                  "Full SSP & POA&M generation",
                  "C3PAO assessment prep package",
                  "Real-time SPRS score tracking",
                  "365-day continuous monitoring",
                  "Priority support",
                ],
                cta: "Start Free Trial",
                ctaVariant: "default" as const,
              },
              {
                tier: "Enterprise",
                price: "Custom",
                period: "",
                badge: null,
                description: "For large contractors, primes, and MSSPs managing multiple clients.",
                features: [
                  "Unlimited users & environments",
                  "Multi-tenant MSSP dashboard",
                  "Dedicated Customer Success Manager",
                  "Custom NIST 800-172 controls",
                  "White-label option",
                  "SLA-backed uptime guarantee",
                  "On-site C3PAO coordination",
                  "24/7 priority support",
                ],
                cta: "Book a Demo",
                ctaVariant: "outline" as const,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`relative bracket-decoration flex flex-col border p-7 ${
                  plan.badge
                    ? "border-primary/60 bg-card/80 shadow-lg shadow-primary/10"
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
                  <p className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">{plan.tier}</p>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="font-heading text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground text-sm mb-1">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{plan.description}</p>
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
                  variant={plan.ctaVariant === "default" ? undefined : "outline"}
                  className={
                    plan.ctaVariant === "default"
                      ? "bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full glow-amber"
                      : "border-primary/40 text-primary hover:bg-primary/10 w-full"
                  }
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
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
          FAQ SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="faq" className="py-20 lg:py-28">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked Questions About <span className="text-primary">CMMC Compliance</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Common questions about the Cybersecurity Maturity Model Certification, NIST 800-171, and how DefenseEye's CMMC Lens automates compliance for DoD contractors.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            <FAQItem
              question="What is CMMC 2.0 and why do DoD contractors need it?"
              answer="CMMC 2.0 (Cybersecurity Maturity Model Certification) is a Department of Defense framework that requires all defense contractors to demonstrate specific cybersecurity practices to protect Controlled Unclassified Information (CUI) and Federal Contract Information (FCI). Starting in 2025, CMMC certification is being phased into all new DoD contracts, making compliance mandatory for contractors who want to continue working with the Department of Defense."
            />
            <FAQItem
              question="How does CMMC Lens automate CMMC compliance?"
              answer="CMMC Lens uses AI-governed automation to streamline the entire CMMC readiness process. It automatically collects evidence from your cloud environments (AWS, Azure, GCC High), maps that evidence to NIST 800-171 controls, generates your System Security Plan (SSP) and Plan of Action & Milestones (POA&M), and continuously monitors your SPRS score. This reduces manual documentation and preparation work by up to 80% — while your team handles the remaining hands-on assessment activities."
            />
            <FAQItem
              question="What is the difference between CMMC Level 1 and Level 2?"
              answer="CMMC Level 1 requires 17 basic cybersecurity practices focused on protecting Federal Contract Information (FCI) and allows self-assessment. CMMC Level 2 requires all 110 security controls from NIST SP 800-171 to protect Controlled Unclassified Information (CUI) and requires assessment by a Certified Third-Party Assessment Organization (C3PAO). CMMC Lens supports both levels with automated evidence mapping and compliance tracking."
            />
            <FAQItem
              question="How long does it take to achieve CMMC readiness with DefenseEye?"
              answer="With CMMC Lens, most organizations can achieve audit readiness in days rather than the typical 6-12 months required with manual processes. Our AI-driven platform automates evidence collection, control mapping, and documentation generation, reducing documentation and preparation time by up to 80%. The exact timeline depends on your current security posture and target CMMC level — Level 2 still requires hands-on remediation and C3PAO coordination."
            />
            <FAQItem
              question="Does CMMC Lens help with NIST 800-171 and DFARS compliance?"
              answer="Yes. CMMC 2.0 Level 2 is directly aligned with NIST SP 800-171 Rev 2, and DFARS clause 252.204-7012 requires contractors to implement these controls. CMMC Lens automatically maps your existing security evidence to all 110 NIST 800-171 controls, identifies gaps, and generates the documentation required for both DFARS compliance and CMMC certification."
            />
            <FAQItem
              question="What is an SPRS score and how does DefenseEye improve it?"
              answer="The Supplier Performance Risk System (SPRS) score is a numerical representation of your organization's compliance with NIST 800-171 controls, ranging from -203 to 110. DefenseEye's CMMC Lens continuously monitors your security posture and provides real-time SPRS score tracking, identifying specific controls that need attention to maximize your score before assessment."
            />
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="contact" className="py-20 lg:py-28 bg-card/30 border-y border-border/20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
              Ready to Automate Your <span className="text-primary">CMMC 2.0 Compliance</span>?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
              Join DoD contractors who trust DefenseEye's CMMC Lens to achieve audit readiness faster. Start your free trial today and see how AI-driven automation can transform your CMMC compliance journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-10 glow-amber">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-primary/40 text-primary hover:bg-primary/10 text-base px-10">
                Book a Demo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-6">No credit card required. Full access to CMMC Lens for 14 days.</p>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="py-12 border-t border-border/30" role="contentinfo">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-primary" />
                </div>
                <span className="font-heading font-bold text-lg tracking-tight text-foreground">
                  Defense<span className="text-primary">Eye</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered CMMC 2.0 compliance automation for Department of Defense contractors. Protecting Controlled Unclassified Information with intelligent automation.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">Product</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "CMMC Lens", href: "#features" },
                  { label: "Evidence Collection", href: "#features" },
                  { label: "SSP Generation", href: "#features" },
                  { label: "SPRS Monitoring", href: "#features" },
                  { label: "Pricing", href: "#pricing" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "CMMC Knowledge Hub", href: "/knowledge-hub" },
                  { label: "NIST 800-171 Guide", href: "/knowledge-hub/evidence-mapping" },
                  { label: "SPRS Score Guide", href: "/knowledge-hub/sprs-score" },
                  { label: "Blog", href: "/blog" },
                  { label: "Case Studies", href: "/case-studies" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "About DefenseEye", href: "#contact" },
                  { label: "Careers", href: "#contact" },
                  { label: "Contact Us", href: "#contact" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} DefenseEye, Inc. All rights reserved. CMMC Lens is a trademark of DefenseEye.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>CAGE Code: Available</span>
              <span className="text-border">|</span>
              <span>NAICS: 541512, 541519</span>
              <span className="text-border">|</span>
              <span>SAM Registered</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
