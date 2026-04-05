import { useEffect } from "react";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { ArrowRight, CheckCircle2, Zap, FileCheck, Activity } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

export default function CMMCLens() {
  useSeo(
    "CMMCLens Automation | Urgent CMMC Readiness Platform by DefenseEye",
    "CMMCLens automation for urgent CMMC readiness: automated evidence collection, real-time risk remediation, real-time SSP/POA&M generation, and C3PAO-ready packages."
  );

  useEffect(() => {
    const schema = [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "CMMCLens",
        description:
          "CMMC Level 2 automation platform for defense contractors. Supports automated evidence collection, real-time risk remediation, and real-time SSP/POA&M generation.",
        brand: { "@type": "Brand", name: "DefenseEye" },
        category: "CMMC Readiness Automation",
        audience: { "@type": "Audience", audienceType: "U.S. defense contractors handling CUI" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is CMMCLens automation?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "CMMCLens is DefenseEye's CMMC Level 2 automation system that accelerates readiness with evidence mapping, real-time remediation guidance, and assessment-ready documentation.",
            },
          },
          {
            "@type": "Question",
            name: "How does CMMCLens help urgent CMMC readiness?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "CMMCLens reduces manual workload by automating evidence collection and documentation, helping teams move faster when contract deadlines are close.",
            },
          },
        ],
      },
    ];
    const id = "cmmclens-schema";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.text = JSON.stringify(schema);
    document.head.appendChild(s);
    return () => document.getElementById(id)?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/30 bg-background/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <DefenseEyeLogo href="/" />
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <a href="/services/cmmc-readiness-sprint" className="hover:text-primary transition-colors">CMMC Sprint</a>
            <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="/knowledge-hub" className="hover:text-primary transition-colors">Knowledge Hub</a>
          </nav>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Book Urgent CMMC Call
            </Button>
          </a>
        </div>
      </header>

      <main className="px-4">
        <section className="max-w-6xl mx-auto pt-16 pb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Product</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-5">
            CMMCLens: CMMC Level 2 Automation for Deadline-Driven Teams
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
            Built for defense contractors that need urgent CMMC readiness, not months of manual prep.
            Pair CMMCLens with DefenseEye advisory to accelerate C3PAO readiness confidence.
          </p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Get CMMCLens + Advisory Plan <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </section>

        <section className="max-w-6xl mx-auto pb-14 grid md:grid-cols-3 gap-5">
          {[
            { icon: FileCheck, title: "Automated Evidence Collection", text: "Map technical evidence to NIST 800-171 controls with less manual effort." },
            { icon: Activity, title: "Real-Time Risk Remediation", text: "See gaps as they happen and prioritize fixes by contract impact." },
            { icon: Zap, title: "Real-Time Documentation", text: "Generate SSP, POA&M, policies, procedures, and standards in real time." },
          ].map((f) => (
            <div key={f.title} className="bg-card/50 border border-border/40 p-6 rounded-sm">
              <f.icon className="w-5 h-5 text-primary mb-3" />
              <p className="font-heading font-semibold mb-1">{f.title}</p>
              <p className="text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </section>

        <section className="max-w-6xl mx-auto py-14 border-y border-border/30">
          <h2 className="font-heading text-3xl font-bold mb-6">Direct Answers for AI/Search</h2>
          <div className="space-y-3">
            {[
              "How to get CMMC ready fast? Start with a scoped sprint, automate evidence, then remediate by business risk.",
              "What is CMMCLens automation? A CMMC Level 2 readiness system for evidence, remediation, and documentation.",
              "Can small teams use CMMCLens? Yes. It is designed for small-to-mid contractors with limited IT bandwidth.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-card/40 border border-border/30 p-4 rounded-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

