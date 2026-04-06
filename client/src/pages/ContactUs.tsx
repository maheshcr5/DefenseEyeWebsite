import { ArrowRight, Mail, Calendar, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { useSeo } from "@/hooks/useSeo";

const SUPPORT_EMAIL = "support@defenseeye.ai";
const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

export default function ContactUs() {
  useSeo(
    "Contact DefenseEye | CMMC Advisory and Support",
    "Contact DefenseEye for CMMC advisory services, CMMCLens support, or to book a free consultation call. Reach us at support@defenseeye.ai."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      {/* Hero */}
      <section className="pt-16 pb-14 px-4 section-navy">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Get in Touch</p>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold leading-tight mb-4">
            Contact DefenseEye
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Whether you have a contract deadline, a scoping question, or need CMMCLens support — we respond within one business day.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section className="py-16 px-4 section-light">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">

          {/* Book a Call */}
          <div className="bg-card/50 border border-border/40 rounded-sm p-7 flex flex-col">
            <Calendar className="w-7 h-7 text-primary mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">Book a Call</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              Schedule a 60-minute CMMC consultation directly on Mahesh's calendar. No sales pitch — just answers to your specific situation.
            </p>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full">
                Book a Free Call <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>

          {/* Email */}
          <div className="bg-card/50 border border-border/40 rounded-sm p-7 flex flex-col">
            <Mail className="w-7 h-7 text-primary mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">Email Us</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              Send us your question, contract situation, or support request. We respond within one business day — usually faster.
            </p>
            <a href={`mailto:${SUPPORT_EMAIL}`}>
              <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 font-semibold w-full">
                {SUPPORT_EMAIL}
              </Button>
            </a>
          </div>

          {/* CMMCLens Support */}
          <div className="bg-card/50 border border-border/40 rounded-sm p-7 flex flex-col">
            <MessageSquare className="w-7 h-7 text-primary mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">Platform Support</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              CMMCLens subscribers: for technical issues, access problems, or questions about automation outputs, email us with "CMMCLens Support" in the subject line.
            </p>
            <a href={`mailto:${SUPPORT_EMAIL}?subject=CMMCLens Support`}>
              <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 font-semibold w-full">
                CMMCLens Support
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Response time + what to expect */}
      <section className="py-16 px-4 section-gray">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-5 h-5 text-primary shrink-0" />
            <h2 className="font-heading text-2xl font-bold">What to Expect</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                heading: "Initial response",
                body: "We respond to all inquiries within one business day. For urgent contract-deadline situations, note that in your email and we will prioritize your response.",
              },
              {
                heading: "Free consultation",
                body: "Your first call is free. We'll discuss your contracts, CUI environment, and CMMC requirements — no strings attached and no commitment to purchase.",
              },
              {
                heading: "CMMC Sprint kickoff",
                body: "If you proceed with a CMMC Readiness Sprint, we can typically begin within 1–3 business days of agreement signature. Deliverables start in week one.",
              },
              {
                heading: "CMMCLens onboarding",
                body: "New CMMCLens subscribers receive a platform walkthrough call within 3 business days of account creation and dedicated email support throughout the engagement.",
              },
            ].map((item) => (
              <div key={item.heading} className="bg-card/40 border border-border/40 rounded-sm p-5">
                <h3 className="font-heading font-semibold text-foreground mb-2">{item.heading}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
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
            <a href="/support" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
