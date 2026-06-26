import { useEffect, useState } from "react";
import { ArrowRight, Mail, Calendar, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { useSeo } from "@/hooks/useSeo";
import { CAPABILITY_STATEMENT_URL, COMPANY } from "@/data/companyFacts";
import { getStoredAttribution, trackConversion } from "@/lib/tracking";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

export default function ContactUs() {
  useSeo(
    "Contact DefenseEye | AI, Cybersecurity, Governance, and Compliance Support",
    "Contact DefenseEye for AI transformation, AI governance, Microsoft Copilot readiness, cybersecurity, compliance automation, supplier opportunities, partnership inquiries, or CMMCLens support."
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
            Whether you have an AI adoption question, a governance need, a compliance deadline, or need CMMCLens support, we respond within one business day.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-6">

          {/* Supplier opportunities */}
          <div className="bg-card/50 border border-border/40 rounded-sm p-7 flex flex-col">
            <Calendar className="w-7 h-7 text-primary mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">Discuss Supplier Opportunities</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              Schedule a 60-minute discussion on AI, cybersecurity, governance, compliance automation, subcontracting, staff augmentation, or CMMCLens fit.
            </p>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full">
                Discuss Supplier Opportunities <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>

          <div className="bg-card/50 border border-border/40 rounded-sm p-7 flex flex-col">
            <FileIcon />
            <h2 className="font-heading text-xl font-bold mb-2">Capability Statement</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              Review DefenseEye's supplier capability statement for identifiers, certifications, engagement models, and core competencies.
            </p>
            <a href={CAPABILITY_STATEMENT_URL} onClick={() => trackConversion("capability_statement_download", { location: "contact_page" })}>
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 font-semibold w-full">
                Open
              </Button>
            </a>
          </div>

          {/* Email */}
          <div className="bg-card/50 border border-border/40 rounded-sm p-7 flex flex-col">
            <Mail className="w-7 h-7 text-primary mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">Enterprise Inquiries</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              Use this mailbox for enterprise AI consulting, AI governance, Copilot readiness, cybersecurity, and compliance automation inquiries.
            </p>
            <a href={`mailto:${COMPANY.enterpriseEmail}`} onClick={() => trackConversion("enterprise_email_click", { location: "contact_enterprise" })}>
              <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 font-semibold w-full">
                {COMPANY.enterpriseEmail}
              </Button>
            </a>
          </div>

          <div className="bg-card/50 border border-border/40 rounded-sm p-7 flex flex-col">
            <MessageSquare className="w-7 h-7 text-primary mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">Support</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              For marketplace, SaaS, CMMCLens customer support, billing, cancellation, or product issue reporting, use the support mailbox.
            </p>
            <a href={`mailto:${COMPANY.supportEmail}?subject=DefenseEye Support Request`} onClick={() => trackConversion("support_email_click", { location: "contact_support" })}>
              <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 font-semibold w-full">
                {COMPANY.supportEmail}
              </Button>
            </a>
          </div>

          {/* CMMCLens Support */}
          <div className="bg-card/50 border border-border/40 rounded-sm p-7 flex flex-col">
            <MessageSquare className="w-7 h-7 text-primary mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">Supplier & Partner</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              For supplier, partnership, subcontracting, prime contractor, Microsoft, Google, or Meta procurement outreach, use the partnerships mailbox.
            </p>
            <a href={`mailto:${COMPANY.partnersEmail}?subject=DefenseEye Supplier or Partner Inquiry`} onClick={() => trackConversion("partners_email_click", { location: "contact_partners" })}>
              <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 font-semibold w-full">
                {COMPANY.partnersEmail}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <ContactFormSection />

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
                body: "We respond to all inquiries within one business day. For urgent contract, audit, security, or AI governance situations, note that in your email and we will prioritize your response.",
              },
              {
                heading: "Free consultation",
                body: "Your first call is free. We'll discuss your goals, constraints, environment, and next practical steps, with no commitment to purchase.",
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

function ContactFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    title: "",
    inquiryType: "",
    timeline: "",
    message: "",
    phone: "",
  });

  useEffect(() => {
    const inquiry = new URLSearchParams(window.location.search).get("inquiry");
    const map: Record<string, string> = {
      supplier: "Supplier / procurement inquiry",
      partner: "Partnership / subcontracting",
      "ai-transformation": "AI governance consulting",
      "ai-governance": "AI governance consulting",
      "ai-security": "AI governance consulting",
      "microsoft-copilot-readiness": "Microsoft Copilot readiness",
      cmmc: "CMMC readiness",
      "compliance-automation": "Compliance automation",
      "cybersecurity-risk": "Cloud security",
      "cloud-security": "Cloud security",
      "staff-augmentation": "Staff augmentation",
      cmmclens: "CMMCLens demo",
      support: "Product support",
    };
    if (inquiry && map[inquiry]) {
      setForm((current) => ({ ...current, inquiryType: map[inquiry] }));
    }
  }, []);

  const inputCls =
    "w-full bg-background border border-border/60 rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20";
  const labelCls = "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, attribution: getStoredAttribution() }),
      });
      if (!response.ok) throw new Error("Contact form failed");
      trackConversion("contact_form_submit", { form: "contact_page", inquiryType: form.inquiryType });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email enterprise@defenseeye.ai or partners@defenseeye.ai.");
    } finally {
      setSubmitting(false);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  return (
    <section className="py-16 px-4 section-light">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Inquiry Form</p>
          <h2 className="font-heading text-3xl font-bold mb-3">Tell us what you need</h2>
          <p className="text-muted-foreground leading-relaxed">
            Use this form for supplier, partnership, subcontracting, AI governance, Microsoft Copilot, cybersecurity, cloud security, CMMC, compliance automation, product support, or CMMCLens inquiries.
          </p>
        </div>
        {submitted ? (
          <div className="bg-card/50 border border-border/40 rounded-sm p-8 text-center">
            <h3 className="font-heading text-xl font-bold mb-2">Thank you.</h3>
            <p className="text-sm text-muted-foreground">DefenseEye will review your inquiry and respond through the appropriate enterprise or partner channel.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card/50 border border-border/40 rounded-sm p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Name *</label><input required name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} placeholder="First name" /></div>
              <div><label className={labelCls}>Last Name *</label><input required name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} placeholder="Last name" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Work Email *</label><input required type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Organization *</label><input required name="company" value={form.company} onChange={handleChange} className={inputCls} /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Role *</label><input required name="title" value={form.title} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Optional Phone</label><input name="phone" value={form.phone} onChange={handleChange} className={inputCls} /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Inquiry Type *</label>
                <select required name="inquiryType" value={form.inquiryType} onChange={handleChange} className={inputCls}>
                  <option value="">Select inquiry type...</option>
                  <option>Supplier / procurement inquiry</option>
                  <option>Partnership / subcontracting</option>
                  <option>AI governance consulting</option>
                  <option>Microsoft Copilot readiness</option>
                  <option>CMMC readiness</option>
                  <option>Compliance automation</option>
                  <option>Cloud security</option>
                  <option>Staff augmentation</option>
                  <option>CMMCLens demo</option>
                  <option>Product support</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Timeline *</label>
                <select required name="timeline" value={form.timeline} onChange={handleChange} className={inputCls}>
                  <option value="">Select timeline...</option>
                  <option>Immediate</option>
                  <option>30-60 days</option>
                  <option>This quarter</option>
                  <option>Next quarter</option>
                  <option>Exploring options</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Message *</label>
              <textarea required name="message" value={form.message} onChange={handleChange} rows={5} className={`${inputCls} resize-none`} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              {submitting ? "Sending..." : "Submit Inquiry"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

function FileIcon() {
  return <div className="w-7 h-7 text-primary mb-4 flex items-center justify-center border border-primary/40 rounded-sm text-xs font-bold">PDF</div>;
}
