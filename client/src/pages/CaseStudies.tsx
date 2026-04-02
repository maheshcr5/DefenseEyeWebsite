/*
 * DefenseEye.ai — Case Studies / Contractor Profiles Page
 * Route: /case-studies
 * NOTE: DefenseEye has no real customers yet. These are representative
 * contractor archetypes based on common DIB challenges — NOT testimonials.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  Users,
  MapPin,
  Shield,
  TrendingUp,
  Clock,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Zap,
  BarChart3,
  BookOpen,
  Mail,
  Star,
  ChevronRight,
  Target,
  Layers,
} from "lucide-react";

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

// ─── Data ───────────────────────────────────────────────────────────────────

interface ContractorProfile {
  id: string;
  type: string;
  sizeRange: string;
  region: string;
  cmmcLevel: string;
  icon: React.ReactNode;
  accentColor: string;
  challenge: {
    headline: string;
    details: string[];
  };
  howCmmcLensHelps: {
    headline: string;
    features: string[];
  };
  projectedResults: {
    timeSaved: string;
    sprsImprovement: string;
    docReduction: string;
    additionalNotes: string;
  };
}

const PROFILES: ContractorProfile[] = [
  {
    id: "mid-tier-subcontractor",
    type: "Mid-Tier Defense Subcontractor",
    sizeRange: "50–250 employees",
    region: "Mid-Atlantic / Southeast",
    cmmcLevel: "CMMC Level 2",
    icon: <Building2 className="w-7 h-7" />,
    accentColor: "text-primary",
    challenge: {
      headline: "Inherited compliance debt from a rapid DoD contract expansion",
      details: [
        "Won a significant subcontract requiring CMMC Level 2 certification within 18 months, but the IT environment had grown organically with no formal NIST 800-171 program.",
        "Over 300 servers, workstations, and cloud instances with no centralized asset inventory or baseline configuration documentation.",
        "SPRS score was never calculated — estimated gap of 60–80 points below 110.",
        "No dedicated CISO or cybersecurity staff; IT function handled by a 4-person generalist team.",
        "Prime contractor threatening to flow down CMMC assessment requirement within 12 months.",
      ],
    },
    howCmmcLensHelps: {
      headline: "Automated gap analysis and prioritized remediation roadmap",
      features: [
        "Automated asset discovery integrations identify all systems within the CUI boundary in hours, not weeks.",
        "AI-assisted control mapping evaluates each of the 110 NIST 800-171 practices against your existing configurations.",
        "Live SPRS score calculator shows current score and projects impact of each planned remediation.",
        "Pre-populated SSP framework with implementation guidance reduces documentation from 6 months to 6 weeks.",
        "POA&M tracking with automated deadline reminders keeps the remediation program on schedule.",
        "Weekly compliance health dashboard gives the IT team and leadership a shared view of progress.",
      ],
    },
    projectedResults: {
      timeSaved: "~800 hours of manual documentation work",
      sprsImprovement: "+45 to +60 SPRS points within 90 days of active use",
      docReduction: "65–70% reduction in SSP documentation effort",
      additionalNotes:
        "Typical organizations in this profile reach SPRS scores of 85–100+ within 6 months by following CMMC Lens's prioritized remediation roadmap.",
    },
  },
  {
    id: "aerospace-parts-manufacturer",
    type: "Aerospace Parts Manufacturer",
    sizeRange: "150–500 employees",
    region: "Midwest / Great Lakes",
    cmmcLevel: "CMMC Level 2",
    icon: <Layers className="w-7 h-7" />,
    accentColor: "text-accent",
    challenge: {
      headline: "CUI sprawl across operational technology and legacy manufacturing systems",
      details: [
        "Manufacturing environment includes CNC machines, PLCs, and engineering workstations running Windows 7 and Windows Server 2008 — systems that cannot be patched or easily replaced.",
        "CUI (technical drawings, manufacturing tolerances, materials specifications) flows between ERP, CAD systems, and shared network drives with inconsistent access controls.",
        "Previous self-assessment produced an SPRS score of -43 — a score that is putting existing contracts at risk during recompetitions.",
        "Operational Technology (OT) and IT networks are not segmented, creating a broad CUI boundary that inflates assessment scope.",
        "Engineering teams resist security controls that slow down design workflows.",
      ],
    },
    howCmmcLensHelps: {
      headline: "OT/IT boundary scoping and compensating control documentation",
      features: [
        "Boundary scoping tools help formally separate OT network assets from the CUI boundary where technically justifiable, reducing assessment scope.",
        "Compensating control templates provide defensible documentation for legacy systems that cannot meet standard patch requirements.",
        "Access control audit workflows identify and remediate overly permissive file share and ERP permissions across engineering systems.",
        "Network segmentation guidance and implementation checklists support IT/OT separation projects.",
        "Evidence collection automation captures screenshots, configuration exports, and log samples continuously — not as a pre-assessment scramble.",
        "SPRS score projection helps prioritize which gap closures most efficiently move the score toward a compliant level.",
      ],
    },
    projectedResults: {
      timeSaved: "~600 hours across IT and engineering teams",
      sprsImprovement: "+50 to +70 SPRS points over 6 months",
      docReduction: "60% reduction in assessment preparation time",
      additionalNotes:
        "Organizations with complex OT environments typically see the highest proportional improvement from proper scope boundary definition — often recovering 15–25 SPRS points through scope clarification alone.",
    },
  },
  {
    id: "it-services-prime",
    type: "IT Services Prime Contractor",
    sizeRange: "200–800 employees",
    region: "National / Remote-First",
    cmmcLevel: "CMMC Level 2 (with Level 3 roadmap)",
    icon: <Target className="w-7 h-7" />,
    accentColor: "text-emerald-400",
    challenge: {
      headline: "Managing CMMC compliance across multiple DoD clients and MSP environments",
      details: [
        "Provides managed IT services to 12 DoD prime contractors, each with different CUI environments, scope boundaries, and contract-specific compliance requirements.",
        "As an MSP within client CUI boundaries, must demonstrate its own CMMC compliance AND ensure service delivery infrastructure doesn't introduce gaps for clients.",
        "Cloud-first service delivery architecture spans AWS GovCloud, Azure Government, and M365 GCC High — each with its own evidence collection and documentation requirements.",
        "High employee turnover in technical roles creates ongoing access control and security awareness training challenges.",
        "C3PAO assessment scheduled for Q3 — 7 months away — with no centralized compliance tracking in place.",
      ],
    },
    howCmmcLensHelps: {
      headline: "Multi-tenant compliance management and cloud-native evidence collection",
      features: [
        "Multi-tenant workspace architecture allows management of compliance programs for the firm's own environment and visibility into client readiness separately.",
        "Cloud provider evidence integrations automatically pull configuration data from AWS GovCloud, Azure Government, and M365 GCC High into the evidence library.",
        "User lifecycle tracking integrates with HR systems to flag access control gaps when employees onboard, transfer, or depart.",
        "Assessment preparation mode organizes all 110 practices with evidence artifacts by assessor-ready category for streamlined C3PAO document review.",
        "Continuous monitoring dashboards provide real-time compliance posture visibility — not just a point-in-time snapshot.",
        "Automated security awareness training completion tracking resolves one of the most common evidence gaps in IT service environments.",
      ],
    },
    projectedResults: {
      timeSaved: "~1,200 hours annually across compliance and service delivery teams",
      sprsImprovement: "+35 to +50 SPRS points in first 60 days",
      docReduction: "75% reduction in C3PAO assessment preparation effort",
      additionalNotes:
        "IT services firms that manage compliance for multiple DoD clients report the highest ROI from CMMC Lens due to the platform's multi-tenant architecture and cloud-native integrations.",
    },
  },
  {
    id: "small-defense-manufacturer",
    type: "Small Defense Manufacturer",
    sizeRange: "10–50 employees",
    region: "Southwest / Pacific Northwest",
    cmmcLevel: "CMMC Level 2",
    icon: <Users className="w-7 h-7" />,
    accentColor: "text-violet-400",
    challenge: {
      headline: "No internal cybersecurity expertise — C3PAO assessment required within 12 months",
      details: [
        "15-person machine shop producing precision defense components. The owner handles all IT; there is no dedicated cybersecurity or compliance staff.",
        "Currently using consumer-grade equipment, personal Microsoft 365 accounts, and shared network drives — none configured for CUI handling.",
        "Received a contract modification requiring CMMC Level 2 certification as a condition of renewal — expiring in 14 months.",
        "Previous quote from a CMMC consultant: $180,000 for full compliance build-out and assessment readiness. Budget is $40,000.",
        "Owner-operator has no time to study NIST 800-171 documentation and needs a guided, step-by-step path.",
      ],
    },
    howCmmcLensHelps: {
      headline: "Guided compliance path designed for resource-constrained small manufacturers",
      features: [
        "Plain-language control descriptions translate NIST 800-171 technical requirements into actionable tasks anyone can understand and complete.",
        "Step-by-step remediation playbooks provide specific, vendor-specific implementation instructions (e.g., exactly how to enable MFA in Microsoft 365 Business Premium).",
        "SSP auto-generation creates a compliant System Security Plan from answers to guided questionnaires — no compliance expertise required.",
        "SPRS score calculator with what-if modeling shows exactly which actions will have the highest score impact for the lowest cost.",
        "MSP partner network connects small manufacturers with vetted IT service providers who specialize in CMMC-compliant infrastructure buildouts.",
        "Flat monthly pricing keeps total compliance management costs well within small business budgets.",
      ],
    },
    projectedResults: {
      timeSaved: "~400 hours of owner/operator time",
      sprsImprovement: "+55 to +80 SPRS points over 9 months with guided remediation",
      docReduction: "80% reduction vs. manual SSP development",
      additionalNotes:
        "Small manufacturers represent the fastest-growing segment of CMMC assessment demand. Those who use structured compliance platforms report total program costs 60–70% lower than organizations that engage traditional consultants for the same scope.",
    },
  },
];

// ─── Industry Stats ─────────────────────────────────────────────────────────

const STATS = [
  {
    value: "80,000+",
    label: "Defense contractors in the DIB supply chain",
    source: "DoD / CMMC-AB",
  },
  {
    value: "-36",
    label: "Average self-reported SPRS score across DIB contractors",
    source: "DoD Internal Survey Data",
  },
  {
    value: "70%",
    label: "Of DIB contractors have not begun formal CMMC preparation",
    source: "DCSA / Industry Surveys",
  },
  {
    value: "$183K",
    label: "Average cost of a ransomware incident for a defense contractor",
    source: "IBM Cost of a Data Breach 2024",
  },
];

// ─── Contractor Profile Card ────────────────────────────────────────────────

function ProfileCard({ profile, index }: { profile: ContractorProfile; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bracket-decoration bg-card/60 backdrop-blur-sm border border-border/40 overflow-hidden group hover:border-primary/30 transition-colors duration-300"
    >
      {/* Card Header */}
      <div className="p-6 border-b border-border/40 bg-secondary/10">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded border border-border/40 bg-card/60 ${profile.accentColor}`}>
            {profile.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-heading text-xl font-bold mb-1 ${profile.accentColor}`}>
              {profile.type}
            </h3>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {profile.sizeRange}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {profile.region}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                {profile.cmmcLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-amber-400">
            The Challenge
          </h4>
        </div>
        <p className="text-foreground font-medium mb-3 leading-snug">{profile.challenge.headline}</p>
        <ul className="space-y-2">
          {profile.challenge.details.map((detail, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <ChevronRight className="w-3.5 h-3.5 text-amber-400/60 mt-0.5 shrink-0" />
              <span className="leading-relaxed">{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* How CMMC Lens Helps */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-primary shrink-0" />
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">
            How CMMC Lens Addresses It
          </h4>
        </div>
        <p className="text-foreground font-medium mb-3 leading-snug">{profile.howCmmcLensHelps.headline}</p>
        <ul className="space-y-2">
          {profile.howCmmcLensHelps.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary/70 mt-0.5 shrink-0" />
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Projected Results */}
      <div className="p-6 border-b border-border/30 bg-primary/5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary shrink-0" />
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">
            Projected Results
          </h4>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="font-heading text-lg font-bold text-accent">
              {profile.projectedResults.timeSaved.split(" ")[0]}
            </div>
            <div className="text-xs text-muted-foreground mt-1 leading-tight">
              {profile.projectedResults.timeSaved.split(" ").slice(1).join(" ")}
            </div>
          </div>
          <div className="text-center border-x border-border/30">
            <div className="font-heading text-lg font-bold text-primary">
              {profile.projectedResults.sprsImprovement.split(" ")[0]}
            </div>
            <div className="text-xs text-muted-foreground mt-1 leading-tight">
              SPRS improvement (90 days)
            </div>
          </div>
          <div className="text-center">
            <div className="font-heading text-lg font-bold text-accent">
              {profile.projectedResults.docReduction.split(" ")[0]}
            </div>
            <div className="text-xs text-muted-foreground mt-1 leading-tight">
              doc effort reduction
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/80 leading-relaxed italic border-l-2 border-primary/20 pl-3">
          {profile.projectedResults.additionalNotes}
        </p>
      </div>

      {/* CTA */}
      <div className="p-6 bg-card/20">
        <p className="text-sm text-muted-foreground mb-4">
          <span className="text-foreground font-medium">This profile matches your company?</span>{" "}
          Book a 30-minute discovery call to see how CMMC Lens would work for your specific environment.
        </p>
        <Link href="/#demo">
          <Button
            size="sm"
            className="w-full bg-primary text-background hover:bg-primary/90 font-heading font-semibold group/btn"
          >
            Book a Demo
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({
  stat,
  index,
}: {
  stat: { value: string; label: string; source: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bracket-decoration bg-card/60 backdrop-blur-sm border border-border/40 p-6 text-center"
    >
      <div className="font-heading text-4xl font-bold text-accent mb-2">{stat.value}</div>
      <div className="text-muted-foreground text-sm leading-relaxed mb-3">{stat.label}</div>
      <div className="text-xs text-muted-foreground/50 border-t border-border/30 pt-2">
        Source: {stat.source}
      </div>
    </motion.div>
  );
}

// ─── Early Access Form ──────────────────────────────────────────────────────

function EarlyAccessForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [size, setSize] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email) || !company) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
    setCompany("");
    setSize("");
  }

  return (
    <div className="bracket-decoration bg-card/60 backdrop-blur-sm border border-primary/30 p-8 md:p-10">
      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6"
        >
          <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
          <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
            You're on the list!
          </h3>
          <p className="text-muted-foreground">
            We'll be in touch within 48 hours to discuss your compliance environment and schedule
            your onboarding. Welcome to the DefenseEye founding cohort.
          </p>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-accent" />
            <h3 className="font-heading text-xl font-bold text-foreground">
              Apply for Early Access
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-heading font-medium text-muted-foreground mb-1.5">
                  Work Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="you@company.com"
                  className={`w-full px-4 py-3 bg-secondary/40 border rounded text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    status === "error" && !email
                      ? "border-red-500/50"
                      : "border-border/60"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-muted-foreground mb-1.5">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Acme Defense LLC"
                  className={`w-full px-4 py-3 bg-secondary/40 border rounded text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    status === "error" && !company
                      ? "border-red-500/50"
                      : "border-border/60"
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-heading font-medium text-muted-foreground mb-1.5">
                Company Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/40 border border-border/60 rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                <option value="">Select company size</option>
                <option value="1-10">1–10 employees</option>
                <option value="11-50">11–50 employees</option>
                <option value="51-250">51–250 employees</option>
                <option value="251-500">251–500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
            {status === "error" && (
              <p className="text-red-400 text-sm">
                Please provide a valid work email and company name.
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-accent text-background hover:bg-accent/90 font-heading font-bold text-base py-3"
            >
              Apply for Early Access — 6 Months Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground/70 text-center">
              No credit card required. We'll review your application and reach out within 48 hours.
              By submitting you agree to our privacy policy.
            </p>
          </form>
        </>
      )}
    </div>
  );
}

// ─── Main CaseStudies Page ──────────────────────────────────────────────────

export default function CaseStudies() {
  useEffect(() => {
    document.title = "Contractor Profiles — Who We're Building For | DefenseEye.ai";
  }, []);

  // Schema.org FAQ JSON-LD
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "case-studies-faq-schema";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the most common CMMC challenge for small defense contractors?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "The most common challenge for small defense contractors is the lack of internal cybersecurity expertise combined with the resource burden of documenting all 110 NIST 800-171 controls in a System Security Plan (SSP). Many small contractors have implemented reasonable security controls but lack the compliance documentation to prove it — leading to artificially low SPRS scores that don't reflect their actual security posture.",
          },
        },
        {
          "@type": "Question",
          name: "How long does it typically take to prepare for a CMMC Level 2 C3PAO assessment?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Organizations with significant compliance gaps typically need 9–18 months of active remediation work before they are ready for a C3PAO assessment. Organizations that are already implementing most NIST 800-171 controls but lack documentation can often be ready in 3–6 months. Using a compliance automation platform like CMMC Lens can reduce preparation time by 40–70% by automating evidence collection, SSP generation, and SPRS score tracking.",
          },
        },
        {
          "@type": "Question",
          name: "What happens to a defense contractor's SPRS score if they fail a C3PAO assessment?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "If a contractor fails a C3PAO assessment, the C3PAO submits the findings to the CMMC-AB, which may result in a conditional certification (if gaps are minor and can be remediated within 180 days) or no certification. An outstanding failure without a credible remediation plan can be flagged in SPRS and may affect the contractor's ability to win or retain DoD contracts. Contractors must then remediate identified gaps and undergo re-assessment, incurring additional assessment costs.",
          },
        },
      ],
    });
    const existing = document.getElementById("case-studies-faq-schema");
    if (existing) existing.remove();
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("case-studies-faq-schema");
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navigation ── */}
      <div className="border-b border-border/30 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <span className="font-heading font-bold text-primary text-lg cursor-pointer tracking-wider">
              DefenseEye<span className="text-accent">.ai</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/knowledge-hub">
              <span className="hover:text-primary transition-colors cursor-pointer">Knowledge Hub</span>
            </Link>
            <Link href="/blog">
              <span className="hover:text-primary transition-colors cursor-pointer">Blog</span>
            </Link>
            <Link href="/case-studies">
              <span className="text-primary font-semibold cursor-pointer">Case Studies</span>
            </Link>
          </nav>
          <Link href="/#demo">
            <Button size="sm" className="bg-primary text-background hover:bg-primary/90 font-heading font-semibold">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <Section className="pt-20 pb-16 px-4 text-center border-b border-border/30">
        <div className="max-w-4xl mx-auto">
          {/* Honest framing badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-heading font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20 uppercase tracking-wider mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Representative Contractor Profiles — Not Customer Testimonials
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight">
            Built for Contractors Like You —{" "}
            <span className="text-primary">See How CMMC Lens</span> Solves Real DoD Compliance
            Challenges
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-6">
            DefenseEye is in early access. These are representative contractor archetypes based on
            the most common challenges we hear from the Defense Industrial Base — not case studies
            from paying customers. We believe in being transparent about where we are in our
            journey.
          </p>
          <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded bg-primary/10 border border-primary/20 text-sm text-primary">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              <strong>Founding Cohort:</strong> We are actively onboarding our first group of
              contractors. Join early, get 6 months free, and shape the product roadmap.
            </span>
          </div>
        </div>
      </Section>

      {/* ── Industry Stats ── */}
      <Section className="py-14 px-4 border-b border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
              The Scale of the CMMC Challenge Across the DIB
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real industry data that illustrates why CMMC compliance automation is not optional
              for defense contractors competing for or holding DoD contracts.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ── Contractor Profiles Grid ── */}
      <Section className="py-16 px-4" id="profiles">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider mb-4">
              <Target className="w-3.5 h-3.5" />
              Contractor Archetypes
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Which Profile Fits Your Organization?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These profiles are drawn from hundreds of conversations with DIB contractors across
              size ranges, industries, and compliance maturity levels. Each reflects real challenges
              — and the specific ways CMMC Lens is designed to address them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {PROFILES.map((profile, i) => (
              <ProfileCard key={profile.id} profile={profile} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ── What CMMC Lens Delivers ── */}
      <Section className="py-14 px-4 border-y border-border/30 bg-card/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
              What CMMC Lens Delivers Across Every Profile
            </h2>
            <p className="text-muted-foreground">
              Core capabilities that apply regardless of your size, industry, or current compliance posture.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <BarChart3 className="w-5 h-5 text-primary" />,
                title: "Live SPRS Score",
                desc: "Real-time calculation of your SPRS score as you implement and document controls — no more guessing.",
              },
              {
                icon: <FileCheck className="w-5 h-5 text-primary" />,
                title: "Auto-Generated SSP",
                desc: "NIST 800-171 System Security Plan populated from your control implementation data — reviewed and ready for assessors.",
              },
              {
                icon: <Target className="w-5 h-5 text-primary" />,
                title: "POA&M Management",
                desc: "Track every open gap with assigned owners, due dates, and automated reminders. Never miss a remediation deadline.",
              },
              {
                icon: <Shield className="w-5 h-5 text-primary" />,
                title: "Evidence Library",
                desc: "Centralized, organized evidence artifacts for all 110 NIST 800-171 practices — structured the way C3PAO assessors need to see them.",
              },
              {
                icon: <Zap className="w-5 h-5 text-primary" />,
                title: "Prioritized Remediation",
                desc: "AI-driven roadmap ranks controls by SPRS point impact and implementation effort — maximize score per hour of work.",
              },
              {
                icon: <Clock className="w-5 h-5 text-primary" />,
                title: "Continuous Monitoring",
                desc: "Compliance posture tracked continuously — not just before assessments. Know your score at any moment.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bracket-decoration bg-card/60 backdrop-blur-sm border border-border/40 p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded bg-primary/10 border border-primary/20">
                    {item.icon}
                  </div>
                  <h3 className="font-heading font-bold text-foreground">{item.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Early Access Program ── */}
      <Section className="py-16 px-4" id="early-access">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-accent/10 text-accent border border-accent/20 uppercase tracking-wider mb-4">
              <Star className="w-3.5 h-3.5" />
              Early Access Program
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Join the DefenseEye Founding Contractor Cohort
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
              We're inviting a limited group of defense contractors to join our founding customer
              cohort. Early access members get 6 months of CMMC Lens at no cost, direct access to
              the product team, and a meaningful voice in shaping the roadmap.
            </p>

            {/* Benefits list */}
            <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
              {[
                {
                  icon: <Star className="w-5 h-5 text-accent" />,
                  title: "6 Months Free",
                  desc: "Full platform access — every feature, no artificial limits — at no cost during the founding period.",
                },
                {
                  icon: <Users className="w-5 h-5 text-accent" />,
                  title: "Shape the Roadmap",
                  desc: "Monthly calls with the product team. Your compliance challenges directly influence what we build next.",
                },
                {
                  icon: <Shield className="w-5 h-5 text-accent" />,
                  title: "White-Glove Onboarding",
                  desc: "Dedicated onboarding support to map your current environment and get your initial SPRS score calculated in your first week.",
                },
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="bracket-decoration bg-card/60 border border-border/40 p-5 hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 rounded bg-accent/10 border border-accent/20">
                      {benefit.icon}
                    </div>
                    <h3 className="font-heading font-bold text-foreground text-sm">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <EarlyAccessForm />

          <div className="mt-6 text-center">
            <p className="text-muted-foreground/70 text-sm">
              Founding cohort is limited to 50 contractors. Applications are reviewed within 48
              hours. Priority given to contractors with active DoD contracts requiring CMMC Level
              2 certification.
            </p>
          </div>
        </div>
      </Section>

      {/* ── FAQ Section ── */}
      <Section className="py-14 px-4 border-t border-border/30 bg-card/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
              Common Questions About CMMC Challenges
            </h2>
          </div>
          <div className="space-y-0 border border-border/40 divide-y divide-border/40">
            {[
              {
                q: "What is the most common CMMC challenge for small defense contractors?",
                a: "The most common challenge for small defense contractors is the lack of internal cybersecurity expertise combined with the resource burden of documenting all 110 NIST 800-171 controls in a System Security Plan (SSP). Many small contractors have implemented reasonable security controls but lack the compliance documentation to prove it — leading to artificially low SPRS scores that don't reflect their actual security posture. CMMC Lens is specifically designed to close this documentation gap efficiently.",
              },
              {
                q: "How long does it typically take to prepare for a CMMC Level 2 C3PAO assessment?",
                a: "Organizations with significant compliance gaps typically need 9–18 months of active remediation work before they are ready for a C3PAO assessment. Organizations that are already implementing most NIST 800-171 controls but lack documentation can often be ready in 3–6 months. Using a compliance automation platform like CMMC Lens can reduce preparation time by 40–70% by automating evidence collection, SSP generation, and SPRS score tracking.",
              },
              {
                q: "What happens to a defense contractor's SPRS score if they fail a C3PAO assessment?",
                a: "If a contractor fails a C3PAO assessment, the C3PAO submits findings to the CMMC-AB, which may result in a conditional certification (if gaps are minor and can be remediated within 180 days) or no certification. An unresolved failure can be flagged in SPRS and may affect the contractor's ability to win or retain DoD contracts. Contractors must then remediate identified gaps and undergo re-assessment, incurring additional assessment costs — making pre-assessment readiness the most cost-effective investment.",
              },
            ].map((faq, i) => (
              <div key={i} className="p-6">
                <h3 className="font-heading font-semibold text-foreground mb-2 leading-snug flex items-start gap-3">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed ml-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Bottom CTA ── */}
      <Section className="py-16 px-4 border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Your CMMC Compliance Journey?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            See your real SPRS score, identify your highest-impact gaps, and get a prioritized
            remediation roadmap — in your first session with CMMC Lens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#demo">
              <Button className="bg-accent text-background hover:bg-accent/90 font-heading font-bold text-base px-8 py-3">
                Start Free Trial — CMMC Lens
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-border/60 text-foreground hover:border-primary/60 hover:text-primary font-heading font-semibold text-base px-8 py-3"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Read the CMMC Blog
              </Button>
            </Link>
          </div>
        </div>
      </Section>

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
