import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { ArrowRight, BookOpen, TrendingUp, Users, CheckCircle2, ShieldCheck } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

const DIFFERENTIATORS = [
  {
    image: "/ccp-badge.svg",
    title: "CCP-Led, Not IT Generalists",
    body: "Led by Certified CMMC Professionals. We know the difference between what the standard says on paper and what C3PAOs actually flag during assessments.",
  },
  {
    icon: Users,
    title: "Built Only for Defense Contractors",
    body: "Not a broad MSP that added CMMC to the service menu. Every engagement is designed around CUI handling, DFARS obligations, and active DoD contract risk.",
  },
  {
    icon: BookOpen,
    title: "Real Deliverables — Not Slide Decks",
    body: "You get SSP drafts, POA&Ms, scoping documents, and remediation roadmaps your team can act on the same week you receive them. Not a 90-slide readiness overview.",
  },
  {
    icon: TrendingUp,
    title: "Fast — Because Contracts Don't Wait",
    body: "Readiness sprints engineered for defense contractors with active deadlines. Clarity and a prioritized action plan in days, not quarters of back-and-forth.",
  },
];

const PROOF_POINTS = [
  "Contractors who scope before gap assessment reduce remediation cost by 30–50%",
  "CCP credential holders understand C3PAO expectations — not just the NIST text",
  "Fixed-price engagements mean no billing surprises when your contract timeline shifts",
  "SSP and POA&M outputs meet assessor documentation standards from day one",
];

export default function WhyDefenseEye() {
  useSeo(
    "Why DefenseEye | CCP-Led CMMC Advisory for Defense Contractors",
    "Why U.S. defense contractors choose DefenseEye for CMMC readiness: CCP-led consulting, built only for defense, real deliverables, and fast turnaround for contract-driven timelines."
  );

  useEffect(() => {
    const schema = [
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "DefenseEye — CMMC Advisory",
        description:
          "CCP-led CMMC advisory and consulting for U.S. defense contractors. Scoping, gap assessment, SSP, POA&M, and C3PAO-ready documentation for CMMC Level 2.",
        url: "https://defenseeye.ai/why-defenseeye",
        provider: { "@type": "Organization", name: "DefenseEye" },
        areaServed: "US",
        serviceType: "CMMC Advisory Consulting",
      },
    ];
    const id = "why-de-schema";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.type = "application/ld+json";
      s.text = JSON.stringify(schema);
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
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Why DefenseEye</p>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold leading-tight mb-5 text-white">
            Why Defense Contractors<br className="hidden sm:block" />
            <span className="text-primary"> Choose DefenseEye</span>
          </h1>
          <p className="text-lg text-white/75 max-w-3xl mx-auto leading-relaxed mb-8">
            When your DoD contract depends on CMMC readiness, generic IT advice isn't enough.
            DefenseEye is purpose-built for one thing: getting defense contractors ready fast —
            with credentials, documentation, and deliverables that hold up under C3PAO scrutiny.
          </p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8">
              See If We're the Right Fit — Book a 30-Min Call <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>

      {/* ── CCP Credentials ── */}
      <section className="py-16 px-4 section-light">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">The Credential That Matters</p>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-5 text-foreground">
                Led by Certified CMMC Professionals
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The CCP (Certified CMMC Professional) is the foundational CMMC credential issued through the Cyber AB — the official CMMC accreditation body. CCP holders have completed rigorous CMMC-specific training and examination covering the full assessment methodology.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This means we understand not just what the 110 NIST SP 800-171 controls require, but how assessors evaluate evidence, what documentation gaps fail audits, and where defense contractors consistently over- or under-invest in remediation.
              </p>
              <div className="flex flex-col gap-2.5">
                {[
                  "Cyber AB–accredited credential",
                  "CMMC-specific training, not general cybersecurity",
                  "Assessment methodology from the assessor's perspective",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-gray-50 border border-border/50 rounded-md p-10 flex flex-col items-center gap-4">
                <img src="/ccp-badge.svg" alt="Certified CMMC Professional badge" className="w-28 h-28" />
                <p className="text-sm font-semibold text-foreground text-center">Certified CMMC Professional</p>
                <p className="text-xs text-muted-foreground text-center">Issued by the Cyber AB<br />Official CMMC Accreditation Body</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Differentiators ── */}
      <section className="py-16 px-4 section-gray">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">What Makes Us Different</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 text-foreground">
              Not a Generic IT Firm. A Defense-Specific Practice.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Most CMMC consultants are general IT firms that added CMMC to their service list after the DoD mandate. DefenseEye was designed from the ground up for defense contractor compliance.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.title} className="flex flex-col p-6 bg-card border border-border/50 rounded-sm">
                {"image" in d ? (
                  <img src={d.image as string} alt="CCP badge" className="w-9 h-9 mb-4" />
                ) : (
                  <d.icon className="w-6 h-6 text-primary mb-4" />
                )}
                <p className="font-heading font-bold text-foreground mb-2 leading-snug">{d.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof Points ── */}
      <section className="py-16 px-4 section-light">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">What You Can Expect</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 text-foreground">
              Outcomes That Protect Your Contracts
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {PROOF_POINTS.map((p) => (
              <div key={p} className="flex items-start gap-3 bg-card border border-border/50 rounded-sm p-5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="/case-studies">
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 font-semibold px-8">
                See Case Studies <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 section-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 text-white">
            Ready to Work With a Team That Only Does CMMC?
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Book a 30-minute call. We'll assess your current posture, contract timeline, and give you a realistic next step — no sales pressure, no vague scope.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8">
                Book a 30-Min Call <ArrowRight className="w-4 h-4 ml-2" />
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
