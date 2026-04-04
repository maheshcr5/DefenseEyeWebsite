/*
 * CMMC Knowledge Hub — Index Page
 * Route: /knowledge-hub
 * The authoritative resource center for DoD contractors navigating CMMC 2.0.
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import {
  Shield,
  BookOpen,
  BarChart3,
  FileCheck,
  Target,
  Layers,
  ArrowRight,
  Clock,
  Menu,
  X,
  Mail,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

// ─── Nav (matches Home.tsx) ───────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Services",  href: "/#services" },
  { label: "Pricing",   href: "/#pricing" },
  { label: "Resources", href: "/knowledge-hub" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30" role="navigation" aria-label="Main navigation">
      <div className="container flex items-center justify-between h-16">
        <DefenseEyeLogo href="/" />
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/#contact"><Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">Book Free Assessment</Button></Link>
        </div>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="container py-4 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-primary py-2" onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
            <div className="pt-2 border-t border-border/50">
              <Link href="/#contact"><Button size="sm" className="bg-accent text-accent-foreground w-full font-semibold">Book Free Assessment</Button></Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Article cards data ───────────────────────────────────────────────────────
const HUB_ARTICLES = [
  {
    icon: Shield,
    title: "What is CMMC?",
    subtitle: "The Complete Introduction",
    description: "Understand the Cybersecurity Maturity Model Certification — its purpose, history, levels, key terminology, and why every DoD contractor must comply by 2025.",
    href: "/knowledge-hub/what-is-cmmc",
    readTime: "15 min",
    tags: ["CMMC 2.0", "DoD", "CUI", "FCI"],
    featured: true,
  },
  {
    icon: Layers,
    title: "CMMC Level 1 vs Level 2",
    subtitle: "Detailed Comparison Guide",
    description: "A comprehensive side-by-side comparison of CMMC Level 1 (17 practices) and Level 2 (110 NIST 800-171 controls), including assessment types, costs, and timelines.",
    href: "/knowledge-hub/cmmc-levels",
    readTime: "12 min",
    tags: ["CMMC Level 2", "C3PAO", "NIST 800-171"],
    featured: true,
  },
  {
    icon: FileCheck,
    title: "Automated Evidence Mapping for NIST 800-171",
    subtitle: "How AI Transforms Compliance",
    description: "How automated evidence collection and AI control mapping cut CMMC Level 2 documentation time by up to 80% — covering all 14 NIST 800-171 control families.",
    href: "/knowledge-hub/evidence-mapping",
    readTime: "10 min",
    tags: ["NIST 800-171", "Evidence", "SSP", "POA&M"],
    featured: false,
  },
  {
    icon: BarChart3,
    title: "Understanding Your SPRS Score",
    subtitle: "Calculate, Submit, and Improve",
    description: "Everything you need to know about the Supplier Performance Risk System score: how it's calculated (-203 to 110), how to submit it, and the fastest ways to improve it.",
    href: "/knowledge-hub/sprs-score",
    readTime: "11 min",
    tags: ["SPRS", "DFARS", "Scoring", "Improvement"],
    featured: true,
  },
  {
    icon: Target,
    title: "CMMC Certification Process",
    subtitle: "Step-by-Step for 2025",
    description: "A complete walkthrough of the CMMC Level 2 certification journey — from initial gap assessment through C3PAO audit, with timeline and cost expectations at each phase.",
    href: "/knowledge-hub/certification-process",
    readTime: "13 min",
    tags: ["C3PAO", "Certification", "Assessment", "Timeline"],
    featured: false,
  },
];

// ─── Topic tags with links ────────────────────────────────────────────────────
const ALL_TAGS: { label: string; href: string }[] = [
  { label: "CMMC 2.0", href: "/knowledge-hub/what-is-cmmc" },
  { label: "NIST 800-171", href: "/knowledge-hub/evidence-mapping" },
  { label: "SPRS Score", href: "/knowledge-hub/sprs-score" },
  { label: "C3PAO", href: "/knowledge-hub/certification-process" },
  { label: "CUI", href: "/knowledge-hub/what-is-cmmc" },
  { label: "DFARS", href: "/knowledge-hub/what-is-cmmc" },
  { label: "SSP", href: "/blog/cmmc-level-2-compliance-checklist-2025" },
  { label: "POA&M", href: "/blog/cmmc-level-2-compliance-checklist-2025" },
  { label: "FCI", href: "/knowledge-hub/cmmc-levels" },
  { label: "Level 2", href: "/knowledge-hub/cmmc-levels" },
  { label: "Evidence Mapping", href: "/knowledge-hub/evidence-mapping" },
  { label: "Audit Readiness", href: "/blog/what-to-expect-c3pao-assessment" },
  { label: "Continuous Monitoring", href: "/knowledge-hub/sprs-score" },
  { label: "GCC High", href: "/knowledge-hub/what-is-cmmc" },
  { label: "FIPS 140-2", href: "/knowledge-hub/evidence-mapping" },
  { label: "ITAR", href: "/knowledge-hub/what-is-cmmc" },
];

export default function KnowledgeHub() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    document.title = "CMMC 2.0 Knowledge Hub — NIST 800-171, SPRS, C3PAO Guides for DoD Contractors | DefenseEye.ai";
    // Inject meta description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Authoritative CMMC 2.0 compliance guides for DoD contractors — what CMMC is, Level 1 vs Level 2 requirements, SPRS score calculation, C3PAO assessment process, evidence mapping, and SSP/POA&M guidance. All content references DODCIO, NIST, DFARS, and Cyber AB authoritative sources.";
    // Inject WebPage + SpecialAnnouncement + ItemList schema for LLM/AI engine visibility
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "schema-knowledge-hub";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "CMMC Knowledge Hub — Authoritative Guides for DoD Contractors",
        "description": "The DefenseEye CMMC Knowledge Hub provides authoritative, practitioner-written guides on CMMC 2.0 compliance for the Defense Industrial Base. Topics include what CMMC requires, NIST SP 800-171 implementation, SPRS score calculation and improvement, C3PAO assessment preparation, evidence mapping, and System Security Plan development. All content cites DoD, NIST, and Cyber AB primary sources.",
        "url": "https://defenseeye.ai/knowledge-hub",
        "about": { "@type": "Thing", "name": "CMMC 2.0 Compliance", "sameAs": "https://dodcio.defense.gov/CMMC/" },
        "publisher": {
          "@type": "Organization",
          "name": "DefenseEye",
          "url": "https://defenseeye.ai",
          "knowsAbout": ["CMMC 2.0", "NIST SP 800-171", "C3PAO assessment", "SPRS score", "DoD cybersecurity"],
        },
        "hasPart": HUB_ARTICLES.map((a) => ({
          "@type": "TechArticle",
          "name": a.title,
          "url": `https://defenseeye.ai${a.href}`,
          "description": a.description,
          "about": { "@type": "Thing", "name": "CMMC 2.0", "sameAs": "https://dodcio.defense.gov/CMMC/" },
        })),
      },
    ]);
    if (!document.getElementById("schema-knowledge-hub")) {
      document.head.appendChild(script);
    }
    return () => { document.getElementById("schema-knowledge-hub")?.remove(); };
  }, []);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubscribed(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Scan line */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="scan-line absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <Nav />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <header className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 border-b border-border/20">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Knowledge Hub</span>
          </nav>

          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-5">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary tracking-wide uppercase">Free Resource Center</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
              CMMC <span className="text-primary">Knowledge Hub</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl">
              The authoritative resource for DoD contractors navigating CMMC 2.0, NIST 800-171, SPRS scores, and C3PAO assessments. Built by the DefenseEye team — updated for 2025.
            </p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /><span>No signup required</span></div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /><span>Updated April 2025</span></div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /><span>5 in-depth guides</span></div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── Article Grid ──────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main grid */}
            <div className="lg:col-span-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-8">
                All Guides <span className="text-muted-foreground font-normal text-lg">({HUB_ARTICLES.length})</span>
              </h2>

              {/* Featured articles (larger) */}
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                {HUB_ARTICLES.filter((a) => a.featured).map((article, i) => (
                  <motion.div
                    key={article.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <Link href={article.href} className="group block bracket-decoration bg-card/60 border border-border/40 hover:border-primary/40 transition-all duration-300 p-6 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <article.icon className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{article.readTime}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-primary/70 uppercase tracking-wider mb-1">{article.subtitle}</p>
                      <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{article.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {article.tags.map((t) => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground/70">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                        Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Non-featured articles (smaller, horizontal) */}
              <div className="space-y-4">
                {HUB_ARTICLES.filter((a) => !a.featured).map((article, i) => (
                  <motion.div
                    key={article.href}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <Link href={article.href} className="group flex items-start gap-5 bg-card/40 border border-border/30 hover:border-primary/30 transition-all duration-300 p-5">
                      <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors mt-0.5">
                        <article.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-primary/70 uppercase tracking-wider mb-0.5">{article.subtitle}</p>
                        <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{article.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{article.description}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Popular Topics */}
              <div className="bg-card/40 border border-border/30 p-5">
                <h3 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-4">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map(({ label, href }) => (
                    <Link key={label} href={href} className="text-xs px-2.5 py-1 border border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-card/40 border border-border/30 p-5">
                <h3 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-4">CMMC At a Glance</h3>
                <div className="space-y-3">
                  {[
                    { label: "Level 1 practices", value: "17" },
                    { label: "Level 2 controls (NIST 800-171)", value: "110" },
                    { label: "Control families", value: "14" },
                    { label: "SPRS score range", value: "-203 to 110" },
                    { label: "DIB contractors affected", value: "300,000+" },
                    { label: "C3PAO assessment validity", value: "3 years" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-heading font-semibold text-primary">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bracket-decoration bg-primary/5 border border-primary/20 p-5 text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-foreground mb-2">Ready to Automate?</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Let CMMC Lens handle evidence collection, NIST mapping, and SSP generation automatically.
                </p>
                <Link href="/#contact">
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full">
                    Start Free Trial <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-card/20 border-y border-border/20">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold mb-2">
              CMMC Updates to Your Inbox
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Get notified when new guides are published and when CMMC regulations change. No spam — unsubscribe anytime.
            </p>
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-primary font-medium">
                <CheckCircle2 className="w-5 h-5" />
                You're subscribed — thanks!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@company.com"
                  required
                  className="flex-1 bg-background border border-border/60 text-foreground text-sm px-3 py-2 focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground/50"
                />
                <Button type="submit" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shrink-0">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="py-10 border-t border-border/30" role="contentinfo">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-heading font-bold text-foreground">Defense<span className="text-primary">Eye</span></span>
          </div>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} DefenseEye, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <Link href="/case-studies" className="hover:text-primary transition-colors">Case Studies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
