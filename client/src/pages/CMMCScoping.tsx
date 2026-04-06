/*
 * DefenseEye — CMMC Scoping Service Page
 * Dedicated page for CMMC scoping: defining CUI environment boundary before assessment.
 * GEO / AEO / SEO optimized with FAQPage + ProfessionalService JSON-LD schema.
 */

import { useEffect } from "react";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import {
  ArrowRight,
  Users,
  Network,
  Monitor,
  FileText,
  Globe,
  Building2,
  CheckCircle2,
  Target,
  TrendingDown,
  ShieldCheck,
} from "lucide-react";
import NavBar from "@/components/NavBar";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

const NAV_LINKS = [
  { label: "CMMC Sprint", href: "/services/cmmc-readiness-sprint" },
  { label: "Scoping", href: "/services/cmmc-scoping" },
  { label: "CMMCLens", href: "/cmmclens" },
  { label: "Pricing", href: "/pricing" },
  { label: "Knowledge Hub", href: "/knowledge-hub" },
  { label: "Blog", href: "/blog" },
];

const SCOPE_AREAS = [
  {
    icon: Users,
    title: "People & Roles",
    desc: "Identify every person, role, and team that creates, processes, stores, or transmits CUI — including contractors, subcontractors, and third-party staff.",
  },
  {
    icon: Network,
    title: "Networks & Boundaries",
    desc: "Define the CUI enclave: which networks, VLANs, and communication paths carry CUI. Isolate in-scope assets from out-of-scope infrastructure.",
  },
  {
    icon: Monitor,
    title: "Systems & Endpoints",
    desc: "Inventory workstations, servers, cloud instances, and mobile devices that touch CUI. Determine which systems carry CMMC Level 2 control obligations.",
  },
  {
    icon: FileText,
    title: "CUI Flows & Data Paths",
    desc: "Map exactly how CUI enters, moves through, and exits your environment — email, file shares, cloud storage, contractor portals, and removable media.",
  },
  {
    icon: Globe,
    title: "Third-Party & External Access",
    desc: "Assess external system access, managed service providers, cloud platforms, and any technology that touches CUI — each carries flow-down obligations.",
  },
  {
    icon: Building2,
    title: "Physical Locations",
    desc: "Identify offices, labs, secure rooms, and remote work environments where CUI is physically accessed or stored. Include facility controls in scope.",
  },
];

const BENEFITS = [
  {
    icon: TrendingDown,
    title: "Smaller Scope = Lower Cost",
    desc: "Every system out of scope is a control you don't have to document, implement, or defend. Proper scoping routinely reduces total compliance overhead by 30–50%.",
  },
  {
    icon: ShieldCheck,
    title: "Better SPRS Score",
    desc: "A tightly defined, correctly scoped environment means fewer applicable controls flagged as missing. Your NIST 800-171 self-assessment score improves before you implement a single fix.",
  },
  {
    icon: Target,
    title: "Fewer Failed Controls",
    desc: "Assessors only evaluate what's in scope. Undefined boundaries force assessors to assume the worst — broad scope, maximum controls. Scoping protects your assessment outcome.",
  },
];

const DELIVERABLES = [
  "CUI environment diagram (asset map with data flows)",
  "Scoping boundary document (assessor-facing narrative)",
  "In-scope / out-of-scope asset inventory",
  "Control applicability matrix (which 110 controls apply to your environment)",
  "Pre-SSP scoping narrative ready for System Security Plan integration",
  "Recommendations for scope reduction opportunities",
];

const FAQS = [
  {
    q: "What is CMMC scoping?",
    a: "CMMC scoping is the process of defining exactly which systems, people, networks, and facilities fall within your CMMC assessment boundary — specifically those that store, process, or transmit Controlled Unclassified Information (CUI). A properly scoped environment limits the number of CMMC Level 2 controls that must be implemented and documented, reducing cost and assessment risk.",
  },
  {
    q: "Is CMMC scoping required before a gap assessment?",
    a: "Yes. Without a defined CUI boundary, a gap assessment against all 110 NIST SP 800-171 controls may apply controls to systems that don't need them, inflating your deficiency count and remediation cost. CMMC scoping should precede any gap assessment, SSP development, or C3PAO engagement.",
  },
  {
    q: "How long does CMMC scoping take?",
    a: "A professional CMMC scoping engagement with DefenseEye typically takes 1–2 weeks for small-to-mid defense contractors. It involves interviews with IT and program staff, review of existing architecture and contracts, CUI data flow mapping, and production of the scoping boundary document.",
  },
  {
    q: "Can I reduce my CMMC scope?",
    a: "Yes — and this is one of the highest-value activities in compliance preparation. Scope reduction strategies include isolating CUI to a dedicated enclave, migrating CUI to GovCloud environments with existing FedRAMP authorizations, and limiting user access to only those who need CUI. DefenseEye evaluates feasible reduction options as part of every scoping engagement.",
  },
  {
    q: "Does CMMC scoping cover subcontractors?",
    a: "Yes. CMMC flow-down obligations require that subcontractors handling CUI also meet CMMC requirements. Your scoping engagement should map which external parties receive, transmit, or access CUI — and each represents a separate scoping and compliance obligation under DFARS 252.204-7012 and 252.204-7021.",
  },
];

export default function CMMCScoping() {
  useSeo(
    "CMMC Scoping | Define Your CUI Boundary | DefenseEye",
    "Professional CMMC scoping for defense contractors. Define your CUI environment boundary, reduce assessment scope, and build a C3PAO-ready scoping document before your gap assessment."
  );

  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "CMMC Scoping — DefenseEye",
      description:
        "CMMC scoping services for U.S. defense contractors: CUI environment boundary definition, asset inventory, control applicability mapping, and pre-SSP scoping documentation.",
      url: "https://defenseeye.ai/services/cmmc-scoping",
      provider: { "@type": "Organization", name: "DefenseEye" },
      areaServed: "US",
      serviceType: "CMMC Scoping",
    };

    const id = "cmmc-scoping-schema";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.type = "application/ld+json";
      s.text = JSON.stringify([faqSchema, serviceSchema]);
      document.head.appendChild(s);
    }
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      {/* ── Hero ── */}
      <section className="py-20 px-4 section-navy">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <Target className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">Start Here — Before the Gap Assessment</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold leading-tight mb-5 text-white">
            Know Exactly What You're
            <br />
            <span className="text-primary">Defending Before Assessors Arrive</span>
          </h1>
          <p className="text-lg text-white/75 leading-relaxed max-w-3xl mx-auto mb-8">
            CMMC scoping defines your CUI environment boundary — which systems, people, and networks actually need to meet CMMC Level 2 controls. Skip this step and you'll document, remediate, and pay for controls you don't need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8">
                Book a Scoping Call <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="/services/cmmc-readiness-sprint">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8">
                View CMMC Readiness Sprint
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── What Is Scoping ── */}
      <section className="py-16 px-4 section-light">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">What Is CMMC Scoping?</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 text-foreground">
              Your Compliance Scope Determines Your Cost
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              Under CMMC 2.0 and NIST SP 800-171, all 110 controls apply only to systems within your CUI assessment boundary. The boundary is not assumed — it must be explicitly defined, documented, and defensible to your C3PAO.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            {[
              { label: "DFARS 252.204-7012", desc: "Requires documented safeguarding of all CUI systems" },
              { label: "NIST SP 800-171 Rev 2", desc: "110 controls applied to defined CUI environment" },
              { label: "CMMC 2.0 Level 2", desc: "C3PAO assesses your scoped environment — not your whole IT estate" },
            ].map((item) => (
              <div key={item.label} className="bg-card rounded-sm border border-border/50 p-5">
                <p className="font-heading font-bold text-primary text-sm mb-1">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Scope ── */}
      <section className="py-16 px-4 section-gray">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Scope Coverage</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 text-foreground">
              Every CUI Vector, Mapped and Documented
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              DefenseEye's scoping engagement covers all six dimensions of your CUI environment — so your boundary document stands up to assessor scrutiny.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCOPE_AREAS.map((area) => (
              <div key={area.title} className="bg-card border border-border/50 rounded-sm p-6">
                <area.icon className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-heading font-bold text-foreground mb-2">{area.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Scope First ── */}
      <section className="py-16 px-4 section-light">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Why Scope Before Everything Else</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 text-foreground">
              Scoping Is the Highest-ROI Step in CMMC Readiness
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Most contractors skip scoping and jump straight to gap assessments — then spend months remediating controls that never applied to their environment.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-card border border-border/50 rounded-sm p-6">
                <b.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-heading font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deliverables ── */}
      <section className="py-16 px-4 section-gray">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">What You Receive</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 text-foreground">
              Assessor-Ready Scoping Deliverables
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every output from DefenseEye's scoping engagement is structured for direct use in your SSP, C3PAO submission, and SPRS self-assessment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {DELIVERABLES.map((d) => (
              <div key={d} className="flex items-start gap-3 bg-card border border-border/50 rounded-sm p-4">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 section-light">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-3 text-foreground">CMMC Scoping FAQ</h2>
            <p className="text-muted-foreground">Direct answers for contractors preparing for CMMC Level 2 assessment.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="border border-border/50 bg-card/40 rounded-sm p-5">
                <p className="font-heading font-bold text-foreground mb-2">{f.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 section-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 text-white">
            Start With Scoping. Save Months of Rework.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Contractors who scope correctly before their gap assessment spend less, remediate less, and pass assessments faster. Book a 30-minute call to start defining your CUI boundary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8">
                Book a Scoping Call <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="/services/cmmc-readiness-sprint">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8">
                View the Full Readiness Sprint
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
            <a href="/services/cmmc-readiness-sprint" className="hover:text-primary transition-colors">CMMC Sprint</a>
            <a href="/faq" className="hover:text-primary transition-colors">FAQ</a>
            <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
