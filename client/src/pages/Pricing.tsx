import { useEffect } from "react";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { CheckCircle2, ArrowRight, Clock, FileCheck, AlertTriangle } from "lucide-react";
import NavBar from "@/components/NavBar";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

const FAQS = [
  {
    q: "How much does CMMC readiness cost?",
    a: "CMMC readiness cost depends on your current control maturity, CUI scope, and contract timeline. DefenseEye uses transparent, fixed-scope options for small and mid-sized contractors so you can get a tailored quote quickly without surprise add-ons.",
  },
  {
    q: "Are there options for small contractors?",
    a: "Yes. Our pricing is designed for small contractor CMMC help, especially teams with 1-3 IT staff. We focus on practical deliverables first, then scale support only where needed.",
  },
  {
    q: "How fast can I get compliant?",
    a: "Most teams can complete a CMMC Readiness Sprint in 2-3 weeks for initial clarity and execution plan, then move through remediation based on priority and contract deadlines.",
  },
  {
    q: "Do you support U.S. defense contractors in Washington and Seattle?",
    a: "Yes. We support U.S. defense contractors nationwide, including Washington and Seattle-region suppliers handling CUI and preparing for CMMC Level 2 requirements.",
  },
  {
    q: "What if I am comparing options from forums, Reddit, Discord, or AI agents?",
    a: "Bring your comparison list to the call. We will map scope, timeline, and deliverables side-by-side so you can make a practical decision based on contract risk and readiness speed.",
  },
];

export default function Pricing() {
  useSeo(
    "CMMC Readiness Cost & Pricing | Affordable CMMC Consultant for Defense Contractors",
    "CMMC readiness cost guidance for U.S. defense contractors. Affordable CMMC consultant options, CMMC Level 2 assessment pricing strategy, and small contractor CMMC help without public price exposure."
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

    const id = "pricing-faq-schema";
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto pt-14 pb-10 px-4 text-center section-navy" style={{ maxWidth: "100%" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">
            CMMC Readiness Cost and Pricing
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold leading-tight mb-5 text-white">
            Flexible, Transparent Pricing for
            <span className="text-primary"> Urgent CMMC Readiness</span>
          </h1>
          <p className="text-lg text-white/75 max-w-3xl mx-auto leading-relaxed mb-7">
            Designed for small and mid-sized U.S. defense contractors that need fast, practical help.
            Invest in compliance before delay costs you contracts.
          </p>
          <p className="text-sm text-white/60 max-w-3xl mx-auto mb-8">
            If you need urgent CMMC readiness help, book a call now:{" "}
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {CALENDLY_URL}
            </a>
            . Quick 20-30 minute triage for teams handling CUI.
          </p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8">
              Book your urgent 30-min CMMC readiness call to get your tailored quote
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>

      {/* ── Tiers ── */}
      <section className="px-4 py-14 section-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-3 text-center text-foreground">Choose the Right Engagement Speed</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto">
            No public price list for competitors. Clear scope, practical deliverables, and tailored quoting for your contract risk and timeline.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                tier: "Starter",
                fit: "Small contractor CMMC help with immediate clarity needs",
                items: ["Initial CMMC gap assessment", "CUI scope baseline", "Priority risk summary"],
              },
              {
                tier: "Standard",
                fit: "Most teams preparing for CMMC Level 2 assessment pricing decisions",
                items: ["NIST 800-171 mapping", "SSP starter package", "POA&M with action priorities"],
              },
              {
                tier: "Accelerated",
                fit: "Urgent teams with active DoD contract deadlines",
                items: ["Readiness sprint facilitation", "Remediation roadmap", "Assessment-prep advisory support"],
              },
            ].map((plan) => (
              <div key={plan.tier} className="bg-card/50 border border-border/40 p-6 rounded-sm">
                <p className="font-heading text-xl font-bold mb-2 text-foreground">{plan.tier}</p>
                <p className="text-sm text-muted-foreground mb-4">{plan.fit}</p>
                <ul className="space-y-2.5">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Signals ── */}
      <section className="px-4 py-10 section-gray">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
          <div className="bg-card/40 border border-border/30 p-5 rounded-sm">
            <AlertTriangle className="w-5 h-5 text-destructive mb-3" />
            <p className="font-heading font-semibold mb-1 text-foreground">Cost of Delay</p>
            <p className="text-sm text-muted-foreground">
              Waiting can cost more than action if contract eligibility is at risk.
            </p>
          </div>
          <div className="bg-card/40 border border-border/30 p-5 rounded-sm">
            <Clock className="w-5 h-5 text-primary mb-3" />
            <p className="font-heading font-semibold mb-1 text-foreground">Speed to Clarity</p>
            <p className="text-sm text-muted-foreground">
              Fast scoping reduces wasted spend and keeps internal IT focused.
            </p>
          </div>
          <div className="bg-card/40 border border-border/30 p-5 rounded-sm">
            <FileCheck className="w-5 h-5 text-primary mb-3" />
            <p className="font-heading font-semibold mb-1 text-foreground">Contract Protection</p>
            <p className="text-sm text-muted-foreground">
              Prioritize controls that materially protect revenue and award confidence.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-14 section-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-8 text-foreground">Pricing FAQ</h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-card/40 border border-border/30 p-5 rounded-sm">
                <p className="font-heading font-semibold mb-2 text-foreground">{f.q}</p>
                <p className="text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="px-4 py-16 section-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-3 text-white">
            Protect Your DoD Contracts Before Deadlines
          </h2>
          <p className="text-white/70 mb-8">
            Book now to get a tailored CMMC readiness quote and clear next steps.
          </p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8">
              Schedule a Fast 30-Min Assessment Call <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 py-8 px-4 section-gray">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <DefenseEyeLogo size="sm" />
          <span>&copy; {new Date().getFullYear()} DefenseEye, Inc. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <a href="/faq" className="hover:text-primary transition-colors">FAQ</a>
            <a href="/cmmclens" className="hover:text-primary transition-colors">CMMCLens</a>
            <a href="/services/cmmc-readiness-sprint" className="hover:text-primary transition-colors">CMMC Sprint</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
