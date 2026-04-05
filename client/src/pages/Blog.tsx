/*
 * DefenseEye.ai — Blog Index Page
 * Route: /blog
 * Design: Dark military/tactical HUD aesthetic
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { useSeo } from "@/hooks/useSeo";
import {
  ArrowRight,
  Search,
  Clock,
  Calendar,
  Tag,
  Mail,
  CheckCircle2,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { blogPosts, type BlogPost } from "@/data/blogPosts";

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const CATEGORIES = ["All", "CMMC Compliance", "SPRS Score", "C3PAO Assessment"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  "CMMC Compliance": "text-primary border-primary/40 bg-primary/10",
  "SPRS Score": "text-accent border-accent/40 bg-accent/10",
  "C3PAO Assessment": "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
};

// ─── Section Wrapper ────────────────────────────────────────────────────────

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
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

// ─── Featured Post Card ─────────────────────────────────────────────────────

function FeaturedPostCard({ post }: { post: BlogPost }) {
  const categoryColor = CATEGORY_COLORS[post.category] ?? "text-primary border-primary/40 bg-primary/10";
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bracket-decoration relative bg-card/60 backdrop-blur-sm border border-border/40 p-8 md:p-10 group hover:border-primary/40 transition-colors duration-300"
    >
      {/* Featured badge */}
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
          <BookOpen className="w-3 h-3" />
          Featured Article
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold border uppercase tracking-wider ${categoryColor}`}
        >
          <Tag className="w-3 h-3" />
          {post.category}
        </span>
      </div>

      <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
        <div className="space-y-4">
          <Link href={`/blog/${post.slug}`}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 cursor-pointer leading-tight">
              {post.title}
            </h2>
          </Link>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded border border-border/60 text-muted-foreground bg-secondary/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Meta + CTA */}
        <div className="flex flex-col gap-4 md:min-w-[200px]">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary/70" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary/70" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground/70">By</span>
              <span className="text-foreground font-medium">{post.author}</span>
            </div>
          </div>

          <Link href={`/blog/${post.slug}`}>
            <Button
              size="sm"
              className="w-full bg-primary text-background hover:bg-primary/90 font-heading font-semibold group/btn"
            >
              Read Article
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Post Card ──────────────────────────────────────────────────────────────

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const categoryColor = CATEGORY_COLORS[post.category] ?? "text-primary border-primary/40 bg-primary/10";
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bracket-decoration flex flex-col bg-card/60 backdrop-blur-sm border border-border/40 p-6 group hover:border-primary/40 transition-colors duration-300 h-full"
    >
      {/* Category */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-heading font-semibold border uppercase tracking-wider ${categoryColor}`}
        >
          {post.category}
        </span>
      </div>

      {/* Title */}
      <Link href={`/blog/${post.slug}`}>
        <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200 cursor-pointer leading-snug mb-3">
          {post.title}
        </h3>
      </Link>

      {/* Excerpt */}
      <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
        {post.excerpt}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded border border-border/50 text-muted-foreground/80 bg-secondary/20"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <span className="text-xs font-heading font-semibold text-primary group-hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap">
            Read Article
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </motion.article>
  );
}

// ─── Newsletter Section ─────────────────────────────────────────────────────

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  }

  return (
    <Section className="py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bracket-decoration bg-card/60 backdrop-blur-sm border border-border/40 p-8 md:p-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-accent/10 text-accent border border-accent/30 uppercase tracking-wider mb-6">
            <Mail className="w-3 h-3" />
            CMMC Intelligence
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
            Stay Ahead of CMMC Rule Changes
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Get practical guidance on readiness priorities, SPRS score movement, and C3PAO prep
            decisions while intent is high and award windows are open.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-4 px-6 bg-primary/10 border border-primary/30 rounded"
            >
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-heading font-semibold text-primary">
                You're subscribed! First issue coming soon.
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="your@company.com"
                className={`flex-1 px-4 py-3 bg-secondary/40 border rounded text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  status === "error"
                    ? "border-red-500/50 focus:ring-red-500/30"
                    : "border-border/60"
                }`}
              />
              <Button
                type="submit"
                className="bg-accent text-background hover:bg-accent/90 font-heading font-bold px-6 whitespace-nowrap"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          )}

          {status === "error" && (
            <p className="text-red-400 text-sm mt-2 text-left">
              Please enter a valid email address.
            </p>
          )}

          <p className="text-muted-foreground/60 text-xs mt-4">
            By subscribing you agree to our privacy policy. We never sell your data.
          </p>
        </div>
      </div>
    </Section>
  );
}

// ─── Main Blog Page ─────────────────────────────────────────────────────────

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useSeo(
    "CMMC Blog for Defense Contractors | DefenseEye.ai",
    "Expert CMMC 2.0 guides, compliance checklists, and actionable advice for DoD contractors. Topics: SPRS scoring, C3PAO assessments, NIST 800-171, SSP/POA&M, and CUI protection."
  );

  // Schema.org Blog JSON-LD
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "blog-schema";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "DefenseEye.ai CMMC Blog & Resource Center",
      description:
        "Expert CMMC compliance guides, SPRS score optimization strategies, and C3PAO assessment preparation resources for DoD defense contractors.",
      url: "https://defenseeye.ai/blog",
      publisher: {
        "@type": "Organization",
        name: "DefenseEye.ai",
        url: "https://defenseeye.ai",
      },
      blogPost: blogPosts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.metaDescription,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          "@type": "Organization",
          name: post.author,
        },
        url: `https://defenseeye.ai/blog/${post.slug}`,
      })),
    });
    const existing = document.getElementById("blog-schema");
    if (existing) existing.remove();
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("blog-schema");
      if (el) el.remove();
    };
  }, []);

  // Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q)) ||
      post.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts[0] ?? null;
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navigation Back ── */}
      <div className="border-b border-border/30 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <DefenseEyeLogo href="/" />
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/services/cmmc-readiness-sprint">
              <span className="hover:text-primary transition-colors cursor-pointer">CMMC Sprint</span>
            </Link>
            <Link href="/cmmclens">
              <span className="hover:text-primary transition-colors cursor-pointer">CMMCLens</span>
            </Link>
            <Link href="/#process">
              <span className="hover:text-primary transition-colors cursor-pointer">Readiness Path</span>
            </Link>
            <Link href="/knowledge-hub">
              <span className="hover:text-primary transition-colors cursor-pointer">Knowledge Hub</span>
            </Link>
            <Link href="/pricing">
              <span className="hover:text-primary transition-colors cursor-pointer">Pricing</span>
            </Link>
          </nav>
          <Link href="/#contact">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-semibold">
              Book Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <Section className="pt-20 pb-12 px-4 text-center border-b border-border/30">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-heading font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            CMMC Revenue Protection Insights
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight">
            Content Built for Teams That
            <span className="text-primary"> Cannot Afford Readiness Delays</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
            Every article is written to help defense contractors move from uncertainty to
            assessor-ready decisions faster: scope right, fix the right controls first, and reduce
            avoidable consulting drag.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles — e.g. SPRS score, MFA, C3PAO..."
              className="w-full pl-11 pr-4 py-3.5 bg-card/60 backdrop-blur-sm border border-border/60 rounded text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all"
            />
          </div>
        </div>
      </Section>

      {/* ── Category Filters ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded text-sm font-heading font-semibold border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-background border-primary"
                  : "bg-card/40 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
          {searchQuery && (
            <span className="px-4 py-2 text-sm text-muted-foreground">
              {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""} for "
              <span className="text-primary">{searchQuery}</span>"
            </span>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-heading text-xl font-semibold text-muted-foreground mb-2">
              No articles found
            </h2>
            <p className="text-muted-foreground/70 text-sm">
              Try a different search term or select "All" categories.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 border-border/60"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-10">
                <FeaturedPostCard post={featuredPost} />
              </div>
            )}

            {/* Remaining Posts Grid */}
            {remainingPosts.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    More Articles
                  </h2>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingPosts.map((post, i) => (
                    <PostCard key={post.slug} post={post} index={i} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* ── CTA Mid-page ── */}
      <Section className="py-14 px-4 border-y border-border/30 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
            Need a Faster Path to Assessment Readiness?
          </h2>
          <p className="text-muted-foreground mb-6">
            DefenseEye combines advisory and CMMC Lens automation to prioritize remediation,
            generate clean evidence, and shorten the cycle from "we might fail" to "we are ready."
          </p>
          <Link href="/#contact">
            <Button className="bg-accent text-background hover:bg-accent/90 font-heading font-bold text-base px-8 py-3">
              Start Free Trial with CMMC Lens
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* ── Newsletter ── */}
      <NewsletterSection />

      {/* ── Footer ── */}
      <footer className="border-t border-border/30 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} DefenseEye.ai — All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link href="/knowledge-hub">
              <span className="hover:text-primary transition-colors cursor-pointer">Knowledge Hub</span>
            </Link>
            <Link href="/case-studies">
              <span className="hover:text-primary transition-colors cursor-pointer">Case Studies</span>
            </Link>
            <Link href="/">
              <span className="hover:text-primary transition-colors cursor-pointer">Home</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
