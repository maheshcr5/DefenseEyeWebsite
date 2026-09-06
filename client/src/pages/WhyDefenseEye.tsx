import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import {
  ArrowRight,
  Award,
  Bot,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

const APPROACH_POINTS = [
  {
    icon: Users,
    title: "Practitioner-led delivery",
    body: "DefenseEye connects advisory work to architecture, implementation, testing, remediation, and operational support rather than stopping at recommendations.",
  },
  {
    icon: ShieldCheck,
    title: "Security and governance built into implementation",
    body: "Identity, access, data protection, evaluation, traceability, monitoring, and human oversight are addressed as part of the delivery approach.",
  },
  {
    icon: ClipboardCheck,
    title: "Evidence and remediation workflows, not documentation alone",
    body: "CMMC and NIST readiness support connects requirements to evidence, gaps, ownership, POA&M work, and remediation progress.",
  },
  {
    icon: Bot,
    title: "Consulting supported by DefenseEye-developed capabilities",
    body: "Consulting can be complemented by the DefenseEye-developed CMMCLens platform and AttackSense security capability when those offerings are appropriate to the engagement.",
  },
];

const HELPS_WITH = [
  "Evaluate and implement AI and agentic AI with appropriate identity, data-access, security, governance, evaluation, and human-oversight controls",
  "Prepare for applicable CMMC and NIST SP 800-171 requirements through readiness, evidence, SSP, POA&M, gap-tracking, and remediation support",
  "Use CMMCLens to support evidence automation, control mapping, traceability, gap tracking, SSP and POA&M workflows, and readiness visibility",
  "Strengthen Microsoft cloud, Copilot, Azure AI, cybersecurity, and compliance architecture where supported by published capabilities",
];

const CREDENTIALS = [
  { icon: MapPin, label: "Redmond, Washington" },
  { icon: Award, label: "Multiple team members hold CMMC Certified Professional (CCP) credentials" },
  { icon: Building2, label: "OMWBE Minority Business Enterprise certified" },
  { icon: Building2, label: "NMSDC Minority Business Enterprise certified" },
  { icon: Building2, label: "Washington State Small Business Enterprise (SBE)" },
  { icon: ClipboardCheck, label: "CAGE 9ZDL5 and UEI E4DYPCKN7YN8" },
];

const STARTING_POINTS = [
  {
    title: "Explore CMMCLens",
    body: "For defense contractors organizing CMMC and NIST SP 800-171 evidence, control mappings, gaps, SSP and POA&M workflows.",
    href: "/cmmclens",
  },
  {
    title: "Discuss CMMC Readiness",
    body: "For organizations assessing current readiness, evidence, remediation priorities, and the appropriate consulting or automation path.",
    href: "/contact?inquiry=cmmc",
  },
  {
    title: "Request a Secure AI Readiness Consultation",
    body: "For regulated organizations evaluating secure AI or agentic AI use cases, architecture, governance, evaluation, and implementation.",
    href: "/secure-ai-adoption#secure-ai-consultation",
  },
  {
    title: "Discuss Supplier Opportunities",
    body: "For prime contractors, delivery partners, procurement teams, and organizations evaluating DefenseEye as a supplier or subcontractor.",
    href: "/supplier-readiness",
  },
];

export default function WhyDefenseEye() {
  useSeo(
    "Why DefenseEye | Secure AI, Cybersecurity and CMMC Practitioners",
    "Learn how DefenseEye combines secure AI implementation, cybersecurity, Microsoft cloud experience, CMMC readiness, and compliance automation to help regulated organizations and defense contractors move from requirements to practical delivery."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      {/* ── Hero ── */}
      <section className="py-20 px-4 section-navy">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Why DefenseEye</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-6 text-white">
            Secure AI and Compliance Automation, Built by Practitioners
          </h1>
          <p className="text-lg text-white/75 max-w-3xl mx-auto leading-relaxed">
            DefenseEye is a Redmond, Washington cybersecurity and AI company helping regulated organizations and
            defense contractors turn security, governance, and compliance requirements into practical implementation.
          </p>
        </div>
      </section>

      {/* ── What DefenseEye Helps Organizations Do ── */}
      <section className="py-16 px-4 section-light">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-8 text-foreground text-center">
            What DefenseEye Helps Organizations Do
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {HELPS_WITH.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-card border border-border/50 rounded-sm p-5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How the DefenseEye Approach Is Different ── */}
      <section className="py-16 px-4 section-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-8 text-foreground text-center">
            How the DefenseEye Approach Is Different
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {APPROACH_POINTS.map((point) => (
              <div key={point.title} className="flex flex-col p-6 bg-card border border-border/50 rounded-sm">
                <point.icon className="w-6 h-6 text-primary mb-4" />
                <p className="font-heading font-bold text-foreground mb-2 leading-snug">{point.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credentials and Company Information ── */}
      <section className="py-16 px-4 section-light">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 text-foreground text-center">
            Credentials and Company Information
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-center mb-8">
            Published, verifiable facts for procurement and diligence review. Professional credentials are held by
            individual team members and are not represented as company certifications.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {CREDENTIALS.map((item) => (
              <div key={item.label} className="flex items-start gap-3 bg-card border border-border/50 rounded-sm p-5">
                <item.icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            CMMCLens is available on Microsoft Marketplace — see the{" "}
            <a href="/cmmclens" className="text-primary hover:underline">
              CMMCLens platform page
            </a>{" "}
            for the direct listing.
          </p>
        </div>
      </section>

      {/* ── Leadership and Accountability ── */}
      <section className="py-16 px-4 section-gray">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-5 text-foreground">
            Leadership and Accountability
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            DefenseEye is led by founder Mahesh Coimbatore. The company's work brings together cybersecurity, secure
            AI adoption, enterprise delivery, risk, governance, and compliance automation.
          </p>
        </div>
      </section>

      {/* ── Representative Experience ── */}
      <section className="py-16 px-4 section-light">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-5 text-foreground">
            Representative Experience
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            The linked examples describe representative experience and capabilities DefenseEye is positioned to
            support. They are not presented as named customer case studies.
          </p>
          <a href="/representative-engagements">
            <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 font-semibold px-8">
              View Representative Engagements <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>

      {/* ── Choose the Right Starting Point ── */}
      <section className="py-16 px-4 section-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-8 text-foreground text-center">
            Choose the Right Starting Point
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STARTING_POINTS.map((point) => (
              <a
                key={point.title}
                href={point.href}
                className="flex flex-col p-6 bg-card border border-border/50 rounded-sm hover:border-primary/40 transition-colors"
              >
                <p className="font-heading font-bold text-foreground mb-2 leading-snug">{point.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{point.body}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                  Learn more <ArrowRight className="w-4 h-4 ml-1.5" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-4 section-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 text-white">Start a Conversation</h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Discuss your Secure AI, CMMC readiness, CMMCLens, or supplier opportunity with DefenseEye.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8">
                Start a Conversation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="/representative-engagements">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8">
                View Representative Engagements
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
