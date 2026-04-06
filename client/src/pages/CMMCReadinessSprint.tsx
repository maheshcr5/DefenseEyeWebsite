import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { CheckCircle2, ArrowRight, Award, Clock, FileCheck } from "lucide-react";
import NavBar from "@/components/NavBar";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

const FAQS = [
  {
    q: "Do I need CMMC Level 2?",
    a: "If your company stores, processes, or transmits CUI, you will typically need CMMC Level 2 and NIST 800-171 compliance evidence for contract eligibility.",
  },
  {
    q: "How long does CMMC readiness take?",
    a: "Most small-to-mid defense contractors can complete an initial CMMC Readiness Sprint in 2-4 weeks, then execute remediation based on priority and scope.",
  },
  {
    q: "What happens if we are not compliant?",
    a: "You risk losing eligibility for DoD opportunities that require CMMC evidence, and you may face delays, rework, or lost pipeline revenue.",
  },
  {
    q: "What if we fail CMMC?",
    a: "A failed readiness posture can delay contract awards and force costly remediation under pressure. A structured readiness sprint lowers this risk before formal assessment.",
  },
  {
    q: "How much does CMMC compliance cost?",
    a: "Costs vary by current posture and environment complexity. DefenseEye starts with a fixed-price readiness sprint so teams can scope cost before full remediation.",
  },
  {
    q: "Can small companies pass CMMC?",
    a: "Yes. Small companies can pass CMMC with the right scope, clear SSP and POA&M documentation, and a practical remediation plan.",
  },
];

export default function CMMCReadinessSprint() {
  useSeo(
    "CMMC Readiness Sprint | DefenseEye CMMC Consultant for DoD Contractors",
    "Fixed-price CMMC Readiness Sprint for U.S. defense contractors. CMMC gap assessment, NIST 800-171 compliance mapping, SSP and POA&M starter package, and remediation roadmap."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      {/* ── Hero ── */}
      <section className="py-20 px-4 section-navy">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">
            CMMC Readiness Sprint
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold leading-tight mb-5 text-white">
            Get CMMC Ready in 2-4 Weeks
          </h1>
          <p className="text-lg text-white/75 max-w-3xl leading-relaxed mb-6">
            For defense contractors seeking specialized help with CMMC assessment readiness.
            We help you protect DoD contracts with a fast, practical CMMC assessment and implementation, so you stay compliant and contract-ready.
          </p>
          <p className="text-sm text-white/60 max-w-3xl mb-8">
            If you need urgent CMMC readiness help, book a call now:{" "}
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {CALENDLY_URL}
            </a>
            . Low-friction triage call (20-30 minutes) for defense contractors handling CUI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Schedule a Fast 30-Min Assessment Call <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Get Immediate Help to Protect Your DoD Contracts
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="px-4 py-12 section-light">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            "You're being asked about CMMC or DFARS and don't have clear answers.",
            "Your IT team is small and overloaded with daily operations.",
            "You need CMMC Level 2 readiness, but don't know what to do first.",
          ].map((item) => (
            <div key={item} className="bg-card/50 border border-border/40 p-5 rounded-sm">
              <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What You Get ── */}
      <section className="px-4 py-14 section-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 text-foreground">What You Get in the Sprint</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            A fixed-price engagement designed for practical execution, not theoretical compliance decks.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "CMMC gap assessment (Level 1 / Level 2 aligned)",
              "NIST SP 800-171 compliance mapping",
              "SSP (System Security Plan) starter package",
              "POA&M with prioritized actions",
              "Prioritized remediation roadmap by business risk",
              "Clear next-step plan for C3PAO assessment readiness",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-card border border-border/50 p-4 rounded-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why DefenseEye ── */}
      <section className="px-4 py-14 section-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-7 text-foreground">Why DefenseEye</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: Award, title: "CCP-Led", body: "Led by Certified CMMC Professionals focused on defense contracting reality." },
              { icon: Clock, title: "Fast Turnaround", body: "Designed for companies that need momentum in days, not quarters." },
              { icon: FileCheck, title: "Practical Deliverables", body: "SSP and POA&M outputs your team can immediately use." },
              { icon: CheckCircle2, title: "DoD-Aligned", body: "Built for U.S. defense contractors and NIST 800-171 compliance outcomes." },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border/50 p-5 rounded-sm">
                <item.icon className="w-5 h-5 text-primary mb-3" />
                <p className="font-heading font-semibold mb-1 text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-7">
            Serving U.S. defense contractors nationwide, including Washington and Seattle-region suppliers.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-14 section-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-7 text-foreground">CMMC Readiness FAQ</h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-card border border-border/50 p-5 rounded-sm">
                <p className="font-heading font-semibold mb-2 text-foreground">{f.q}</p>
                <p className="text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-16 section-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-3 text-white">
            Protect Your DoD Contracts Before It Is Too Late
          </h2>
          <p className="text-white/70 mb-8">
            Start with a fixed-price CMMC readiness sprint built for small and mid-sized defense contractors.
          </p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8">
              Book Your Urgent CMMC Readiness Call <ArrowRight className="w-4 h-4 ml-2" />
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
            <a href="/services/cmmc-scoping" className="hover:text-primary transition-colors">Scoping</a>
            <a href="/faq" className="hover:text-primary transition-colors">FAQ</a>
            <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
