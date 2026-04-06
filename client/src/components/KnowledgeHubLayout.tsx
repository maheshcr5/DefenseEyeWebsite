/*
 * KnowledgeHubLayout.tsx
 * Shared layout wrapper for all Knowledge Hub article pages.
 * Includes nav, breadcrumb, ToC sidebar, related articles sidebar,
 * article content area, and footer — all matching Home.tsx conventions.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Clock,
  BookOpen,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TocItem {
  id: string;
  label: string;
}

interface RelatedArticle {
  title: string;
  href: string;
  description: string;
}

export interface KnowledgeHubLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  tocItems: TocItem[];
  relatedArticles: RelatedArticle[];
  schemaType?: "Article" | "FAQPage";
  children: React.ReactNode;
}

// ─── Nav links (matches Home.tsx) ────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Services",  href: "/#services" },
  { label: "Pricing",   href: "/#pricing" },
  { label: "Resources", href: "/knowledge-hub" },
];

// ─── Main Layout Component ────────────────────────────────────────────────────

export default function KnowledgeHubLayout({
  title,
  description,
  lastUpdated,
  tocItems,
  relatedArticles,
  schemaType = "Article",
  children,
}: KnowledgeHubLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // ── Set document title & inject JSON-LD schema ──────────────────────────
  useEffect(() => {
    document.title = `${title} | DefenseEye CMMC Knowledge Hub`;

    // Inject meta description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Build JSON-LD
    const schema = {
      "@context": "https://schema.org",
      "@type": schemaType,
      headline: title,
      description,
      dateModified: lastUpdated,
      author: {
        "@type": "Organization",
        name: "DefenseEye",
        url: "https://defenseeye.ai",
      },
      publisher: {
        "@type": "Organization",
        name: "DefenseEye",
        logo: {
          "@type": "ImageObject",
          url: "https://defenseeye.ai/logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": typeof window !== "undefined" ? window.location.href : "",
      },
    };

    const existing = document.getElementById("knowledge-hub-schema");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "knowledge-hub-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById("knowledge-hub-schema");
      if (s) s.remove();
    };
  }, [title, description, lastUpdated, schemaType]);

  // ── Track active ToC section on scroll ──────────────────────────────────
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observers: IntersectionObserver[] = [];

    tocItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [tocItems]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Scan Line ── */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="scan-line absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm section-light"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <DefenseEyeLogo href="/" />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/#contact">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Book Free Assessment
              </Button>
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
            >
              <div className="container py-4 flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-2 border-t border-border/50">
                  <a href="/#contact" className="block">
                    <Button size="sm" className="bg-accent text-accent-foreground font-semibold w-full">
                      Book Free Assessment
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════════════════════════════════════════════
          BREADCRUMB
      ══════════════════════════════════════════════════════════════ */}
      <div className="pt-16 border-b border-border/20 bg-card/20">
        <div className="container py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-border" />
              </li>
              <li>
                <Link
                  href="/knowledge-hub"
                  className="hover:text-primary transition-colors"
                >
                  Knowledge Hub
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-border" />
              </li>
              <li className="text-foreground font-medium truncate max-w-xs">
                {title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MAIN CONTENT AREA (3-column layout on large screens)
      ══════════════════════════════════════════════════════════════ */}
      <div className="container py-10">
        <div className="flex gap-8 xl:gap-12">
          {/* ── LEFT SIDEBAR: Table of Contents ─────────────────────── */}
          <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
            <div className="sticky top-24">
              <div className="bg-card/60 backdrop-blur-sm border border-border/40 p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider">
                    In This Article
                  </span>
                </div>
                <nav aria-label="Table of contents">
                  <ul className="space-y-1">
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`block text-sm py-1.5 pl-3 border-l-2 transition-all duration-200 leading-snug ${
                            activeSection === item.id
                              ? "border-primary text-primary font-medium"
                              : "border-border/40 text-muted-foreground hover:text-primary hover:border-primary/50"
                          }`}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Last Updated */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                <Clock className="w-3.5 h-3.5 text-primary/60" />
                <span>Last updated: {lastUpdated}</span>
              </div>
            </div>
          </aside>

          {/* ── ARTICLE CONTENT ──────────────────────────────────────── */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 min-w-0"
          >
            {children}
          </motion.article>

          {/* ── RIGHT SIDEBAR: Related Articles ──────────────────────── */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <div className="bg-card/60 backdrop-blur-sm border border-border/40 p-5 mb-6">
                <h3 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-4">
                  Related Articles
                </h3>
                <ul className="space-y-4">
                  {relatedArticles.map((article) => (
                    <li key={article.href}>
                      <Link
                        href={article.href}
                        className="group block"
                      >
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 mb-1 leading-snug">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {article.description}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Read more</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Compact CTA */}
              <div className="bg-primary/5 border border-primary/20 p-5">
                <p className="font-heading font-semibold text-sm text-foreground mb-2">
                  Automate your CMMC readiness
                </p>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  CMMC Lens reduces documentation time by up to 80%.
                </p>
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full text-xs"
                  onClick={() => window.location.href = "/#contact"}
                >
                  Book Free Assessment
                  <ArrowRight className="w-3 h-3 ml-1.5" />
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer className="py-12 border-t border-gray-200 section-gray" role="contentinfo">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <DefenseEyeLogo />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered CMMC 2.0 compliance automation for Department of
                Defense contractors. Protecting Controlled Unclassified
                Information with intelligent automation.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "CMMC Lens", href: "/#features" },
                  { label: "Evidence Collection", href: "/#features" },
                  { label: "SSP Generation", href: "/#features" },
                  { label: "SPRS Monitoring", href: "/#features" },
                  { label: "Pricing", href: "/#pricing" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-2.5">
                {[
                  {
                    label: "CMMC Knowledge Hub",
                    href: "/knowledge-hub",
                  },
                  {
                    label: "NIST 800-171 Guide",
                    href: "/knowledge-hub/evidence-mapping",
                  },
                  {
                    label: "SPRS Score Guide",
                    href: "/knowledge-hub/sprs-score",
                  },
                  { label: "Blog", href: "/blog" },
                  { label: "Case Studies", href: "/case-studies" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "About DefenseEye", href: "/#contact" },
                  { label: "Careers", href: "/#contact" },
                  { label: "Contact Us", href: "/#contact" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} DefenseEye, Inc. All rights
              reserved. CMMC Lens is a trademark of DefenseEye.
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
