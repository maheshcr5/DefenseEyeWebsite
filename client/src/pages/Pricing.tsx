import { useEffect } from "react";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { CheckCircle2, ArrowRight, Clock, FileCheck, AlertTriangle } from "lucide-react";

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
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 section-light">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <DefenseEyeLogo href="/" />
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <a href="/services/cmmc-readiness-sprint" className="hover:text-primary transition-colors">CMMC Sprint</a>
            <a href="/cmmclens" className="hover:text-primary transition-colors">CMMCLens</a>
            <a href="/cmmc-readiness-sprint-guide" className="hover:text-primary transition-colors">4-Week Guide</a>
            <a href="/knowledge-hub" className="hover:text-primary transition-colors">Knowledge Hub</a>
            <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
          </nav>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Book Your Urgent CMMC Readiness Call
            </Button>
          </a>
        </div>
      </header>

      <main className="px-4">
        <section className="max-w-6xl mx-auto pt-16 pb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">
            CMMC Readiness Cost and Pricing
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-5">
            Flexible, Transparent Pricing for
            <span className="text-primary"> Urgent CMMC Readiness</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-7">
            Designed for small and mid-sized U.S. defense contractors that need fast, practical help.
            Invest in compliance before delay costs you contracts.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8">
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
        </section>

        <section className="max-w-6xl mx-auto py-12 border-y border-border/30">
          <h2 className="font-heading text-3xl font-bold mb-3 text-center">Choose the Right Engagement Speed</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">
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
                <p className="font-heading text-xl font-bold mb-2">{plan.tier}</p>
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
        </section>

        <section className="max-w-6xl mx-auto py-12">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-card/40 border border-border/30 p-5 rounded-sm">
              <AlertTriangle className="w-5 h-5 text-destructive mb-3" />
              <p className="font-heading font-semibold mb-1">Cost of Delay</p>
              <p className="text-sm text-muted-foreground">
                Waiting can cost more than action if contract eligibility is at risk.
              </p>
            </div>
            <div className="bg-card/40 border border-border/30 p-5 rounded-sm">
              <Clock className="w-5 h-5 text-primary mb-3" />
              <p className="font-heading font-semibold mb-1">Speed to Clarity</p>
              <p className="text-sm text-muted-foreground">
                Fast scoping reduces wasted spend and keeps internal IT focused.
              </p>
            </div>
            <div className="bg-card/40 border border-border/30 p-5 rounded-sm">
              <FileCheck className="w-5 h-5 text-primary mb-3" />
              <p className="font-heading font-semibold mb-1">Contract Protection</p>
              <p className="text-sm text-muted-foreground">
                Prioritize controls that materially protect revenue and award confidence.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-12 border-y border-border/30">
          <h2 className="font-heading text-3xl font-bold mb-6">Pricing FAQ</h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-card/40 border border-border/30 p-5 rounded-sm">
                <p className="font-heading font-semibold mb-2">{f.q}</p>
                <p className="text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-16 text-center">
          <h2 className="font-heading text-3xl font-bold mb-3">
            Protect Your DoD Contracts Before Deadlines
          </h2>
          <p className="text-muted-foreground mb-8">
            Book now to get a tailored CMMC readiness quote and clear next steps.
          </p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8">
              Schedule a Fast 30-Min Assessment Call <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </section>
      </main>
    </div>
  );
}
