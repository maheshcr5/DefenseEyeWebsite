/*
 * DefenseEye.ai — Blog Post Template
 * Route: /blog/:slug
 * Design: Dark military/tactical HUD aesthetic
 */

import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { useSeo } from "@/hooks/useSeo";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  Twitter,
  Linkedin,
  ChevronRight,
  BookOpen,
  Bot,
  ExternalLink,
} from "lucide-react";
import { blogPosts, type BlogPost, type ContentBlock, type TableContent } from "@/data/blogPosts";

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  "CMMC Compliance": "text-primary border-primary/40 bg-primary/10",
  "SPRS Score": "text-accent border-accent/40 bg-accent/10",
  "C3PAO Assessment": "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
};

// ─── Content Block Renderer ─────────────────────────────────────────────────

function RenderContentBlock({ block, index }: { block: ContentBlock; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const animProps = {
    ref,
    initial: { opacity: 0, y: 16 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.4, delay: Math.min(index * 0.05, 0.3) },
  };

  if (block.type === "h2") {
    return (
      <motion.div {...animProps}>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4 pb-3 border-b border-border/40 leading-tight">
          {block.content as string}
        </h2>
      </motion.div>
    );
  }

  if (block.type === "h3") {
    return (
      <motion.div {...animProps}>
        <h3 className="font-heading text-xl font-bold text-primary mt-8 mb-3 leading-snug">
          {block.content as string}
        </h3>
      </motion.div>
    );
  }

  if (block.type === "p") {
    return (
      <motion.div {...animProps}>
        <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-5">
          {block.content as string}
        </p>
      </motion.div>
    );
  }

  if (block.type === "ul") {
    const items = block.content as string[];
    return (
      <motion.div {...animProps}>
        <ul className="space-y-2.5 mb-6">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-muted-foreground">
              <ChevronRight className="w-4 h-4 text-primary mt-1 shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    );
  }

  if (block.type === "table") {
    const tableData = block.content as TableContent;
    return (
      <motion.div {...animProps} className="mb-8">
        <div className="overflow-x-auto rounded border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary/10 border-b border-border/40">
                {tableData.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-heading font-semibold text-primary uppercase tracking-wider text-xs whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className={`border-b border-border/20 transition-colors ${
                    ri % 2 === 0 ? "bg-card/40" : "bg-card/20"
                  } hover:bg-primary/5`}
                >
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-muted-foreground align-top leading-relaxed">
                      {cell || (
                        <span className="inline-block w-4 h-0.5 bg-border/60 rounded" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  return null;
}

// ─── CTA Box ───────────────────────────────────────────────────────────────

function CTABox({ variant = "inline" }: { variant?: "inline" | "bottom" }) {
  return (
    <div
      className={`bracket-decoration bg-primary/5 border border-primary/30 p-6 md:p-8 ${
        variant === "bottom" ? "mt-12" : "my-10"
      }`}
    >
      <div className="flex items-start gap-4">
        <Bot className="w-8 h-8 text-primary shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-2">
            Automate Your CMMC Readiness with CMMC Lens
          </h3>
          <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
            Stop managing compliance in spreadsheets. CMMC Lens maps all 110 NIST 800-171
            controls to your environment, calculates your live SPRS score, generates your SSP,
            and tracks POA&M items — all in one platform built for defense contractors.
          </p>
          <Link href="/#contact">
            <Button className="bg-accent text-background hover:bg-accent/90 font-heading font-bold">
              Start Free Trial — CMMC Lens
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Related Post Card ──────────────────────────────────────────────────────

function RelatedPostCard({ post }: { post: BlogPost }) {
  const categoryColor = CATEGORY_COLORS[post.category] ?? "text-primary border-primary/40 bg-primary/10";
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="bracket-decoration bg-card/60 backdrop-blur-sm border border-border/40 p-5 group hover:border-primary/40 transition-colors duration-300 cursor-pointer h-full flex flex-col">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-heading font-semibold border uppercase tracking-wider mb-3 self-start ${categoryColor}`}
        >
          {post.category}
        </span>
        <h4 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2 flex-1">
          {post.title}
        </h4>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/30">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
          <span className="text-primary font-semibold flex items-center gap-1 ml-auto">
            Read <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}

// ─── Social Share Buttons ───────────────────────────────────────────────────

function SocialShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = encodeURIComponent(`https://defenseeye.ai/blog/${slug}`);
  const text = encodeURIComponent(`${title} — via @DefenseEyeAI`);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground font-heading font-medium flex items-center gap-1.5">
        <Share2 className="w-4 h-4" />
        Share:
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-semibold border border-border/50 bg-card/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors rounded"
      >
        <Twitter className="w-3.5 h-3.5" />
        X / Twitter
        <ExternalLink className="w-3 h-3 opacity-50" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-semibold border border-border/50 bg-card/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors rounded"
      >
        <Linkedin className="w-3.5 h-3.5" />
        LinkedIn
        <ExternalLink className="w-3 h-3 opacity-50" />
      </a>
    </div>
  );
}

// ─── Not Found ──────────────────────────────────────────────────────────────

function PostNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
        <h1 className="font-heading text-3xl font-bold text-foreground mb-3">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The article you're looking for doesn't exist or may have been moved.
        </p>
        <Link href="/blog">
          <Button className="bg-primary text-background hover:bg-primary/90 font-heading font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Progress Bar ───────────────────────────────────────────────────────────

function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-50 origin-left"
      style={{ scaleX }}
    />
  );
}

// ─── Main BlogPost Page ─────────────────────────────────────────────────────

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const post = blogPosts.find((p) => p.slug === slug) ?? null;

  // Scroll-based reading progress
  const [_scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight > 0) setScrollPct(Math.round((scrollTop / scrollHeight) * 100));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Page title + meta description
  useSeo(
    post ? `${post.title} | DefenseEye.ai` : "Article Not Found | DefenseEye.ai",
    post?.metaDescription ?? "Expert CMMC 2.0 compliance guides for DoD contractors — NIST 800-171, SPRS scores, C3PAO assessments, and more. Free resources from DefenseEye."
  );

  // Schema.org BlogPosting JSON-LD
  useEffect(() => {
    if (!post) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "blogpost-schema";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: post.title,
      description: post.metaDescription,
      abstract: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      inLanguage: "en-US",
      author: {
        "@type": "Organization",
        name: "DefenseEye Advisory Team",
        url: "https://defenseeye.ai",
        description: "CMMC 2.0 compliance practitioners serving the U.S. Defense Industrial Base",
      },
      publisher: {
        "@type": "Organization",
        name: "DefenseEye",
        url: "https://defenseeye.ai",
        logo: {
          "@type": "ImageObject",
          url: "https://defenseeye.ai/logo.png",
        },
        knowsAbout: ["CMMC 2.0", "NIST SP 800-171", "DFARS compliance", "C3PAO assessment", "SPRS score", "DoD cybersecurity"],
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://defenseeye.ai/blog/${post.slug}`,
      },
      url: `https://defenseeye.ai/blog/${post.slug}`,
      keywords: post.tags.join(", "),
      articleSection: post.category,
      about: {
        "@type": "Thing",
        name: "CMMC 2.0 Compliance",
        description: "Cybersecurity Maturity Model Certification for DoD contractors under 32 CFR Part 170",
        sameAs: ["https://dodcio.defense.gov/CMMC/"],
      },
      image: {
        "@type": "ImageObject",
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028771419/EuH9Png2HimpzgUP2fBtWN/hero-dashboard-MRfN7kPE4hmjGfzaoj2jb9.png",
        width: 1200,
        height: 630,
      },
      citation: [
        { "@type": "CreativeWork", name: "CMMC 2.0 Final Rule (32 CFR Part 170)", url: "https://federalregister.gov/d/2024-21128" },
        { "@type": "CreativeWork", name: "NIST SP 800-171 Rev. 2", url: "https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final" },
        { "@type": "CreativeWork", name: "DoD CMMC Program", url: "https://dodcio.defense.gov/CMMC/" },
      ],
    });
    const existing = document.getElementById("blogpost-schema");
    if (existing) existing.remove();
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("blogpost-schema");
      if (el) el.remove();
    };
  }, [post]);

  if (!post) return <PostNotFound />;

  const categoryColor = CATEGORY_COLORS[post.category] ?? "text-primary border-primary/40 bg-primary/10";
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      // Same category first
      const aMatch = a.category === post.category ? 0 : 1;
      const bMatch = b.category === post.category ? 0 : 1;
      return aMatch - bMatch;
    })
    .slice(0, 2);

  // Insert CTA after ~40% of content blocks
  const ctaInsertIndex = Math.floor(post.content.length * 0.45);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgressBar />

      {/* ── Navigation ── */}
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

      {/* ── Breadcrumb ── */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-2">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">
            <span className="hover:text-primary transition-colors cursor-pointer">Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-border" />
          <Link href="/blog">
            <span className="hover:text-primary transition-colors cursor-pointer">Blog</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-border" />
          <span className="text-foreground/60 truncate max-w-[200px] md:max-w-none">
            {post.title}
          </span>
        </nav>
      </div>

      {/* ── Article Header ── */}
      <header className="max-w-4xl mx-auto px-4 pt-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Category + Reading time */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold border uppercase tracking-wider ${categoryColor}`}
            >
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 border-l-2 border-primary/40 pl-5">
            {post.excerpt}
          </p>

          {/* Meta bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-border/40">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded border border-primary/30 bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-foreground font-medium text-sm">{post.author}</div>
                  <div className="text-muted-foreground/70 text-xs">{post.authorTitle}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary/70" />
                <span>Published {formatDate(post.publishedAt)}</span>
              </div>
              {post.updatedAt !== post.publishedAt && (
                <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground/70">
                  <span>Updated {formatDate(post.updatedAt)}</span>
                </div>
              )}
            </div>
            <SocialShareButtons title={post.title} slug={post.slug} />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded border border-border/50 text-muted-foreground bg-secondary/20 hover:border-primary/30 hover:text-primary transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </header>

      {/* ── Article Body ── */}
      <article className="max-w-4xl mx-auto px-4 pb-16">
        {post.content.map((block, index) => (
          <div key={index}>
            <RenderContentBlock block={block} index={index} />
            {/* Inject CTA mid-article */}
            {index === ctaInsertIndex && <CTABox variant="inline" />}
          </div>
        ))}

        {/* Bottom CTA */}
        <CTABox variant="bottom" />

        {/* Share again at bottom */}
        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/blog">
            <Button variant="outline" size="sm" className="border-border/60 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          <SocialShareButtons title={post.title} slug={post.slug} />
        </div>
      </article>

      {/* ── Related Posts ── */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border/30 bg-card/20 py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Related Articles
              </h2>
              <div className="flex-1 h-px bg-border/40" />
              <Link href="/blog">
                <span className="text-xs font-heading font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <RelatedPostCard key={related.slug} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-border/30 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} DefenseEye.ai — All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/knowledge-hub">
              <span className="hover:text-primary transition-colors cursor-pointer">Knowledge Hub</span>
            </Link>
            <Link href="/blog">
              <span className="hover:text-primary transition-colors cursor-pointer">Blog</span>
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
