import { ArrowRight, Mail, BookOpen, MessageSquare, Calendar, HelpCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { useSeo } from "@/hooks/useSeo";

const SUPPORT_EMAIL = "support@defenseeye.ai";
const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

export default function Support() {
  useSeo(
    "Support | DefenseEye",
    "Get support for DefenseEye advisory services and the CMMCLens platform. Email support@defenseeye.ai or browse our CMMC Knowledge Hub."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      {/* Hero */}
      <section className="pt-16 pb-14 px-4 section-navy">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Help &amp; Support</p>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold leading-tight mb-4">
            How Can We Help?
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Support for CMMCLens subscribers and DefenseEye advisory clients. We also have deep self-serve CMMC resources in our Knowledge Hub.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section className="py-16 px-4 section-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl font-bold mb-8 text-center">Contact Support</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">

            <div className="bg-card/50 border border-border/40 rounded-sm p-7 flex flex-col">
              <Mail className="w-7 h-7 text-primary mb-4" />
              <h3 className="font-heading text-lg font-bold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                For CMMCLens platform issues, billing questions, advisory service follow-up, or any other request — email us and we'll respond within one business day.
              </p>
              <a href={`mailto:${SUPPORT_EMAIL}`}>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full">
                  <Mail className="w-4 h-4 mr-2" /> {SUPPORT_EMAIL}
                </Button>
              </a>
            </div>

            <div className="bg-card/50 border border-border/40 rounded-sm p-7 flex flex-col">
              <Calendar className="w-7 h-7 text-primary mb-4" />
              <h3 className="font-heading text-lg font-bold mb-2">Urgent Issues — Book a Call</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                For time-sensitive contract deadlines or critical platform issues, book a direct call. We prioritize active subscribers and clients under contract pressure.
              </p>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 font-semibold w-full">
                  Book Urgent Call <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>

          {/* Common support topics */}
          <h2 className="font-heading text-2xl font-bold mb-6 text-center">Common Topics</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Zap className="w-5 h-5 text-primary" />,
                title: "CMMCLens Platform",
                items: [
                  "Account access and login",
                  "Evidence collection setup",
                  "SSP and POA&M exports",
                  "Control mapping questions",
                  "Billing and subscription",
                ],
                cta: { label: "Email support", href: `mailto:${SUPPORT_EMAIL}?subject=CMMCLens Platform Support` },
              },
              {
                icon: <MessageSquare className="w-5 h-5 text-primary" />,
                title: "Advisory Services",
                items: [
                  "CMMC readiness sprint status",
                  "Gap assessment deliverables",
                  "SSP / POA&M review questions",
                  "C3PAO prep next steps",
                  "Scoping clarifications",
                ],
                cta: { label: "Email your advisor", href: `mailto:${SUPPORT_EMAIL}?subject=Advisory Service Question` },
              },
              {
                icon: <HelpCircle className="w-5 h-5 text-primary" />,
                title: "CMMC Questions",
                items: [
                  "CMMC Level 1 vs Level 2",
                  "What is CUI?",
                  "SPRS score improvement",
                  "C3PAO assessment process",
                  "Timeline and cost estimates",
                ],
                cta: { label: "Browse FAQ", href: "/faq" },
              },
            ].map((group) => (
              <div key={group.title} className="bg-card/40 border border-border/40 rounded-sm p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  {group.icon}
                  <h3 className="font-heading font-semibold text-foreground text-sm">{group.title}</h3>
                </div>
                <ul className="space-y-1.5 mb-5 flex-1">
                  {group.items.map((item) => (
                    <li key={item} className="text-xs text-muted-foreground">&bull; {item}</li>
                  ))}
                </ul>
                <a href={group.cta.href}>
                  <Button variant="outline" size="sm" className="border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 text-xs w-full">
                    {group.cta.label} <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Self-serve resources */}
      <section className="py-16 px-4 section-gray">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl font-bold mb-2 text-center">Self-Serve CMMC Resources</h2>
          <p className="text-sm text-muted-foreground text-center mb-10">Find answers without waiting — our Knowledge Hub covers the most common CMMC questions in depth.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "CMMC FAQ", desc: "15+ common contractor questions answered", href: "/faq" },
              { label: "What Is CMMC 2.0?", desc: "Overview, history, and applicability", href: "/knowledge-hub/what-is-cmmc" },
              { label: "CMMC Level 1 vs Level 2", desc: "Which level applies to you", href: "/knowledge-hub/cmmc-levels" },
              { label: "SPRS Score Guide", desc: "How to calculate and improve your score", href: "/knowledge-hub/sprs-score" },
              { label: "Evidence Mapping", desc: "NIST 800-171 control mapping guide", href: "/knowledge-hub/evidence-mapping" },
              { label: "C3PAO Assessment Guide", desc: "What the assessment looks like end-to-end", href: "/knowledge-hub/certification-process" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group bg-card/40 border border-border/40 rounded-sm p-5 hover:border-primary/40 transition-colors block"
              >
                <div className="flex items-start gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                </div>
                <p className="text-xs text-muted-foreground pl-6">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 section-gray">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <DefenseEyeLogo size="sm" />
          <span>&copy; {new Date().getFullYear()} DefenseEye, Inc. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
