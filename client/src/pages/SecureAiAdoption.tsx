import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bot, CheckCircle2, ClipboardCheck, Cpu, LockKeyhole, ShieldCheck, UserCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { getStoredAttribution, trackConversion } from "@/lib/tracking";
import { reportOpenAiAdsLeadCreated } from "@/lib/openaiAds";
import { beginContactSubmission, completeContactSubmission, releaseContactSubmission, type ContactSubmissionGuard } from "./ContactUs";

export const SECURE_AI_INQUIRY_TYPE = "Secure AI Adoption";

const SECURE_AI_TITLE = "Secure Agentic AI Consulting | DefenseEye";
const SECURE_AI_DESCRIPTION =
  "DefenseEye helps regulated organizations implement agentic AI with secure architecture, responsible governance, risk controls, and hands-on delivery support.";

export type SecureAiFormValues = {
  firstName: string;
  email: string;
  company: string;
  title: string;
  aiAdoptionStage: string;
  need: string;
  timeline: string;
  message: string;
};

export async function submitSecureAiInquiry(form: SecureAiFormValues) {
  if (!form.firstName || !form.email || !form.company || !form.aiAdoptionStage || !form.need) {
    throw new Error("Secure AI form validation failed");
  }

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: form.firstName,
      email: form.email,
      company: form.company,
      title: form.title,
      inquiryType: SECURE_AI_INQUIRY_TYPE,
      aiAdoptionStage: form.aiAdoptionStage,
      need: form.need,
      timeline: form.timeline,
      message: form.message || "Secure AI adoption inquiry",
      attribution: getStoredAttribution(),
    }),
  });

  if (!response.ok) throw new Error("Secure AI form failed");
  reportOpenAiAdsLeadCreated();
  trackConversion("contact_form_submit", { form: "secure_ai_adoption", inquiryType: SECURE_AI_INQUIRY_TYPE });
}

export default function SecureAiAdoption() {
  useSeo(SECURE_AI_TITLE, SECURE_AI_DESCRIPTION);

  useEffect(() => {
    const id = "secure-ai-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Secure Agentic AI Readiness and Implementation",
        description: SECURE_AI_DESCRIPTION,
        provider: { "@type": "ProfessionalService", name: "DefenseEye", url: "https://defenseeye.ai" },
        areaServed: "United States",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: "Secure AI Adoption", item: "https://defenseeye.ai/secure-ai-adoption" },
        ],
      },
    ]);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, []);

  const scrollToForm = () => {
    document.getElementById("secure-ai-consultation")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      <section className="section-navy nvidia-grid-bg px-4 pb-16 pt-20 sm:pb-20 sm:pt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Bot className="size-4" /> Secure Agentic AI Readiness & Implementation
            </div>
            <h1 className="font-heading text-5xl font-bold leading-tight text-foreground sm:text-6xl lg:text-7xl">
              Implement Agentic AI Securely
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Move from AI exploration to governed implementation with secure architecture, responsible AI controls, and hands-on delivery support.
            </p>
            <Button onClick={scrollToForm} size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              Request a Secure AI Readiness Consultation <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="border border-primary/20 bg-card/60 p-6 shadow-2xl shadow-black/20">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Use cases", "Prioritized by value, risk, and data readiness"],
                ["Controls", "Governance, oversight, testing, and monitoring"],
                ["Architecture", "Secure identity, data, agent, and integration patterns"],
                ["Delivery", "Implementation support from pilot through scale"],
              ].map(([label, body]) => (
                <div key={label} className="border border-border/50 bg-background/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">{label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-light px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Who We Help</p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Regulated teams moving from AI interest to responsible implementation</h2>
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground">
            DefenseEye supports regulated organizations and teams handling sensitive data that want to explore, pilot, implement, or scale agentic AI responsibly. The focus is practical: align business use cases with security, governance, privacy, identity, data protection, and operational controls before AI systems become embedded in daily work.
          </p>
        </div>
      </section>

      <section className="section-gray px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">What DefenseEye Delivers</p>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">Secure AI implementation support with governance built in</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              [ClipboardCheck, "AI readiness and use-case prioritization"],
              [LockKeyhole, "Secure agent, identity, data, and integration architecture"],
              [ShieldCheck, "Responsible AI governance and NIST AI RMF alignment"],
              [UserCheck, "Human oversight, evaluation, testing, and operational controls"],
              [Cpu, "Hands-on agentic AI implementation and integration support"],
            ].map(([Icon, text]) => (
              <div key={text as string} className="border border-border/60 bg-card p-6">
                <Icon className="mb-4 size-6 text-primary" />
                <h3 className="font-heading text-xl font-bold">{text as string}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Engagement Approach</p>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">A simple path from readiness to scale</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Assess", "Assess the use case, risks, data, and readiness."],
              ["02", "Design", "Design the secure architecture and governance controls."],
              ["03", "Implement", "Implement, evaluate, and scale the solution."],
            ].map(([step, title, body]) => (
              <div key={step} className="border-l-4 border-primary bg-card p-6">
                <p className="text-sm font-semibold text-primary">{step}</p>
                <h3 className="mt-2 font-heading text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gray px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Financial Services</p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Secure AI for Financial Services</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              DefenseEye helps financial-services teams assess and implement agentic AI workflows with practical controls for sensitive financial and member information.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Identity and least-privilege access for agents",
              "Human oversight and traceability",
              "Model and third-party risk review",
              "Data-loss prevention for sensitive workflows",
              "Evaluation and monitoring before scale",
              "Responsible customer-facing and internal AI workflows",
            ].map((item) => (
              <div key={item} className="flex gap-3 border border-border/60 bg-card p-5">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-navy px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Why DefenseEye</p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Practitioner-led AI, cybersecurity, governance, and Microsoft cloud delivery</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "AI/ML engineering experience connected to implementation realities",
              "Cybersecurity and responsible AI governance perspective for regulated environments",
              "Microsoft and Azure experience across identity, data, cloud security, and AI adoption patterns",
              "Hands-on delivery support for teams that need working systems, not only slideware",
            ].map((item) => (
              <div key={item} className="flex gap-3 border border-primary/20 bg-card/60 p-5">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="secure-ai-consultation" className="section-light scroll-mt-20 px-4 py-16">
        <span id="secure-ai-inquiry" className="sr-only" aria-hidden="true" />
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Secure AI Inquiry</p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Request a Secure AI Readiness Consultation</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Share where your team is in the AI adoption journey. DefenseEye will review the context and respond through the appropriate enterprise channel.
            </p>
          </div>
          <SecureAiInquiryForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SecureAiInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submissionGuardRef = useRef<ContactSubmissionGuard>({ inFlight: false, completed: false });
  const [form, setForm] = useState<SecureAiFormValues>({
    firstName: "",
    email: "",
    company: "",
    title: "",
    aiAdoptionStage: "",
    need: "",
    timeline: "",
    message: "",
  });

  const inputCls =
    "w-full bg-background border border-border/60 rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20";
  const labelCls = "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!beginContactSubmission(submissionGuardRef.current)) return;
    setSubmitting(true);
    setError("");
    try {
      await submitSecureAiInquiry(form);
      completeContactSubmission(submissionGuardRef.current);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email enterprise@defenseeye.ai.");
    } finally {
      releaseContactSubmission(submissionGuardRef.current);
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-border/40 bg-card/50 p-8 text-center">
        <h3 className="font-heading text-xl font-bold mb-2">Thank you.</h3>
        <p className="text-sm text-muted-foreground">DefenseEye will review your Secure AI adoption inquiry and respond through the enterprise channel.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border/40 bg-card/50 p-6 space-y-5">
      <input type="hidden" name="inquiryType" value={SECURE_AI_INQUIRY_TYPE} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="secure-ai-name" className={labelCls}>Name *</label>
          <input id="secure-ai-name" required name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="secure-ai-email" className={labelCls}>Work Email *</label>
          <input id="secure-ai-email" required type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} autoComplete="email" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="secure-ai-company" className={labelCls}>Company *</label>
          <input id="secure-ai-company" required name="company" value={form.company} onChange={handleChange} className={inputCls} autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="secure-ai-role" className={labelCls}>Role</label>
          <input id="secure-ai-role" name="title" value={form.title} onChange={handleChange} className={inputCls} autoComplete="organization-title" />
        </div>
      </div>
      <div>
        <label htmlFor="secure-ai-stage" className={labelCls}>AI Adoption Stage *</label>
        <select id="secure-ai-stage" required name="aiAdoptionStage" value={form.aiAdoptionStage} onChange={handleChange} className={inputCls}>
          <option value="">Select stage...</option>
          <option>Exploring opportunities</option>
          <option>Evaluating use cases</option>
          <option>Running a pilot</option>
          <option>Preparing to scale</option>
          <option>Already operating AI systems</option>
        </select>
      </div>
      <div>
        <label htmlFor="secure-ai-need" className={labelCls}>Primary Need *</label>
        <select id="secure-ai-need" required name="need" value={form.need} onChange={handleChange} className={inputCls}>
          <option value="">Select primary need...</option>
          <option>Use-case and readiness assessment</option>
          <option>Secure AI architecture</option>
          <option>AI governance and risk management</option>
          <option>Agentic AI implementation</option>
          <option>Microsoft Copilot or Azure OpenAI readiness</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="secure-ai-timeline" className={labelCls}>Desired Timeline</label>
        <select id="secure-ai-timeline" name="timeline" value={form.timeline} onChange={handleChange} className={inputCls}>
          <option value="">Select timeline...</option>
          <option>Immediate</option>
          <option>30-60 days</option>
          <option>This quarter</option>
          <option>Next quarter</option>
          <option>Exploring options</option>
        </select>
      </div>
      <div>
        <label htmlFor="secure-ai-context" className={labelCls}>Additional Context</label>
        <textarea id="secure-ai-context" name="message" value={form.message} onChange={handleChange} rows={4} className={`${inputCls} resize-none`} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
        {submitting ? "Sending..." : "Request a Secure AI Readiness Consultation"}
      </Button>
    </form>
  );
}
