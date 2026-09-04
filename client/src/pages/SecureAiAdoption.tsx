import { useEffect, useRef, useState, type ChangeEvent, type ComponentProps, type ComponentType, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Cpu,
  Loader2,
  LockKeyhole,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserRound,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSeo } from "@/hooks/useSeo";
import { cn } from "@/lib/utils";
import { getStoredAttribution, trackConversion } from "@/lib/tracking";
import { reportOpenAiAdsLeadCreated } from "@/lib/openaiAds";
import { beginContactSubmission, completeContactSubmission, releaseContactSubmission, type ContactSubmissionGuard } from "./ContactUs";

export const SECURE_AI_INQUIRY_TYPE = "Secure AI Adoption";
const CONSENT_KEY = "de_cookie_consent";
const CONSENT_VERSION = 2;

export type SecureAiFunnelEventName =
  | "secure_ai_primary_cta_click"
  | "secure_ai_pilot_cta_click"
  | "secure_ai_form_start"
  | "secure_ai_form_submit_success";

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

type SecureAiFormErrors = Partial<Record<keyof SecureAiFormValues, string>>;

export const AI_ADOPTION_STAGE_OPTIONS = [
  {
    value: "Exploring opportunities",
    label: "Exploring",
    description: "Identifying where AI could create value.",
  },
  {
    value: "Evaluating use cases",
    label: "Evaluating",
    description: "Comparing specific workflows, risks, and data needs.",
  },
  {
    value: "Running a pilot",
    label: "Piloting",
    description: "Testing AI in a controlled environment.",
  },
  {
    value: "Preparing to scale",
    label: "Preparing to scale",
    description: "Planning governance, architecture, and operating controls.",
  },
  {
    value: "Already operating AI systems",
    label: "Operating AI",
    description: "Improving oversight for deployed AI capabilities.",
  },
] as const;

export const PRIMARY_NEED_OPTIONS = [
  "Use-case and readiness assessment",
  "Secure AI architecture",
  "AI governance and risk management",
  "Agentic AI implementation",
  "Microsoft Copilot or Azure OpenAI readiness",
  "Other",
] as const;

export const DESIRED_TIMELINE_OPTIONS = [
  "Immediate",
  "30-60 days",
  "This quarter",
  "Next quarter",
  "Exploring options",
] as const;

const WORK_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

declare global {
  interface Window {
    __gaId?: string;
    gtag?: (...args: unknown[]) => void;
  }
}

export function hasSecureAiAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CONSENT_KEY) || "{}") as {
      status?: string;
      version?: number;
      purposes?: { analytics?: boolean };
    };

    return parsed.status === "accepted" && parsed.version === CONSENT_VERSION && parsed.purposes?.analytics === true;
  } catch {
    return false;
  }
}

export function trackSecureAiFunnelEvent(name: SecureAiFunnelEventName, detail: Record<string, string> = {}) {
  if (!hasSecureAiAnalyticsConsent()) return;
  if (typeof window.gtag !== "function" || !window.__gaId) return;

  window.gtag("event", name, {
    send_to: window.__gaId,
    event_category: "secure_ai_funnel",
    ...detail,
  });
}

export function trackSecureAiFormStartOnce(startedRef: { current: boolean }) {
  if (startedRef.current) return;
  startedRef.current = true;
  trackSecureAiFunnelEvent("secure_ai_form_start", { funnel_step: "form_start" });
}

export function validateSecureAiForm(form: SecureAiFormValues): SecureAiFormErrors {
  const errors: SecureAiFormErrors = {};

  if (!form.firstName.trim()) errors.firstName = "Please enter your full name.";
  if (!form.email.trim()) {
    errors.email = "Please enter your work email.";
  } else if (!WORK_EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "Please enter a valid work email.";
  }
  if (!form.company.trim()) errors.company = "Please enter your organization.";
  if (!form.aiAdoptionStage) errors.aiAdoptionStage = "Please choose where your organization is today.";
  if (!form.need) errors.need = "Please choose what you would like help with.";

  return errors;
}

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
  trackSecureAiFunnelEvent("secure_ai_form_submit_success", { funnel_step: "submit_success" });
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
    trackSecureAiFunnelEvent("secure_ai_primary_cta_click", { cta_location: "hero", funnel_step: "primary_cta" });
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
            <a
              href="/representative-engagements"
              className="mt-5 inline-flex items-center text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              View Representative Engagements <ArrowRight className="ml-2 size-4" />
            </a>
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

      <section className="section-gray px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Focused First Step</p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Start with a Secure AI Readiness Sprint</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              For regulated organizations, including financial services teams and credit unions, an initial scoped engagement can help turn a promising AI or agentic AI idea into a practical pilot plan with the right security, governance, and oversight questions on the table.
            </p>
            <a
              href="#secure-ai-consultation"
              onClick={() => trackSecureAiFunnelEvent("secure_ai_pilot_cta_click", { cta_location: "readiness_sprint", funnel_step: "pilot_cta" })}
              className="mt-6 inline-flex items-center text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Request a Pilot Scoping Call <ArrowRight className="ml-2 size-4" />
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "The priority AI or agentic AI use case",
              "Sensitive data, systems, and access risks",
              "Governance and human-oversight requirements",
              "Secure target architecture",
              "Pilot success criteria and an implementation roadmap",
            ].map((item) => (
              <div key={item} className="flex gap-3 border border-border/60 bg-card p-5">
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
              The initial conversation can clarify priority use cases, security and governance risks, architecture and implementation options, and practical next steps.
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
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof SecureAiFormValues, boolean>>>({});
  const formStartedRef = useRef(false);
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

  const formErrors = validateSecureAiForm(form);
  const visibleError = (field: keyof SecureAiFormValues) => (submitAttempted || touched[field] ? formErrors[field] : undefined);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    trackSecureAiFormStartOnce(formStartedRef);
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const updateField = (field: keyof SecureAiFormValues, value: string) => {
    trackSecureAiFormStartOnce(formStartedRef);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const markTouched = (field: keyof SecureAiFormValues) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitAttempted(true);
    if (Object.keys(formErrors).length > 0) return;
    if (!beginContactSubmission(submissionGuardRef.current)) return;
    setSubmitting(true);
    setError("");
    try {
      await submitSecureAiInquiry(form);
      completeContactSubmission(submissionGuardRef.current);
      setSubmitted(true);
    } catch {
      setError("We couldn't submit your request right now. Please try again or email enterprise@defenseeye.ai.");
    } finally {
      releaseContactSubmission(submissionGuardRef.current);
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-primary/25 bg-background p-8 text-center text-foreground shadow-2xl shadow-background/15">
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-primary" aria-hidden="true" />
        <h3 className="font-heading text-2xl font-bold">Thank you. Your consultation request has been received.</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          DefenseEye will review your information and follow up to coordinate the next conversation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-lg border border-primary/20 bg-background p-5 text-foreground shadow-2xl shadow-background/15 sm:p-7">
      <input type="hidden" name="inquiryType" value={SECURE_AI_INQUIRY_TYPE} />
      <div className="border-b border-white/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Secure AI Consultation</p>
        <h3 className="mt-2 font-heading text-2xl font-bold text-white">Request a Secure AI Readiness Consultation</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Tell us a little about your organization and AI initiative. We'll use this information to make the conversation focused and relevant.
        </p>
        <p className="mt-2 text-xs font-medium text-slate-400">No obligation. Your information is used to prepare for the consultation.</p>
      </div>

      <div className="mt-6 space-y-7">
        <FormSection title="About You" description="A few details so the right DefenseEye practitioner can follow up.">
          <div className="grid gap-4 sm:grid-cols-2">
            <ConsultationTextField
              id="secure-ai-name"
              name="firstName"
              label="Full Name"
              required
              icon={UserRound}
              value={form.firstName}
              onChange={handleChange}
              onBlur={() => markTouched("firstName")}
              error={visibleError("firstName")}
              autoComplete="name"
            />
            <ConsultationTextField
              id="secure-ai-email"
              name="email"
              label="Work Email"
              required
              type="email"
              icon={Mail}
              value={form.email}
              onChange={handleChange}
              onBlur={() => markTouched("email")}
              error={visibleError("email")}
              autoComplete="email"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ConsultationTextField
              id="secure-ai-company"
              name="company"
              label="Organization"
              required
              icon={Building2}
              value={form.company}
              onChange={handleChange}
              onBlur={() => markTouched("company")}
              error={visibleError("company")}
              autoComplete="organization"
            />
            <ConsultationTextField
              id="secure-ai-role"
              name="title"
              label="Role / Job Title"
              optional
              placeholder="e.g., CIO, CISO, Head of AI, IT Director"
              icon={BriefcaseBusiness}
              value={form.title}
              onChange={handleChange}
              autoComplete="organization-title"
            />
          </div>
        </FormSection>

        <FormSection title="Your AI Initiative" description="Help us understand where you are and what would make the conversation useful.">
          <StageRadioCards
            value={form.aiAdoptionStage}
            error={visibleError("aiAdoptionStage")}
            onChange={(value) => {
              updateField("aiAdoptionStage", value);
              markTouched("aiAdoptionStage");
            }}
          />
          <NeedChoiceCards
            value={form.need}
            error={visibleError("need")}
            onChange={(value) => {
              updateField("need", value);
              markTouched("need");
            }}
          />
          <div className="max-w-xl">
            <ConsultationSelect
              id="secure-ai-timeline"
              name="timeline"
              label="Desired Timeline"
              helper="When would you like to begin planning or implementation?"
              placeholder="Select timeline"
              optional
              icon={Clock}
              value={form.timeline}
              options={DESIRED_TIMELINE_OPTIONS}
              onValueChange={(value) => updateField("timeline", value)}
            />
          </div>
        </FormSection>

        <FormSection title="Conversation" description="Optional context helps us prepare without turning this into a long intake form.">
          <ConsultationTextarea
            id="secure-ai-context"
            name="message"
            label="Anything else you'd like us to know?"
            optional
            helper="Share relevant use cases, constraints, security concerns, or questions."
            value={form.message}
            onChange={handleChange}
          />
        </FormSection>
      </div>

      {error && (
        <p className="mt-5 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-red-100" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="mt-7 min-h-12 w-full bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {submitting ? "Sending request..." : "Request Secure AI Consultation"}
      </Button>
    </form>
  );
}

type ConsultationIcon = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4" aria-label={title}>
      <div>
        <h4 className="font-heading text-lg font-semibold text-white">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-slate-300">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ConsultationLabel({
  htmlFor,
  label,
  required,
  optional,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-white">
      {label}
      {required && <span className="ml-1 text-primary" aria-label="required">*</span>}
      {optional && <span className="ml-1 font-normal text-slate-400">(Optional)</span>}
    </label>
  );
}

function FieldHint({
  id,
  helper,
  error,
}: {
  id: string;
  helper?: string;
  error?: string;
}) {
  if (error) {
    return (
      <p id={id} className="mt-1.5 text-sm font-medium text-red-200" role="alert">
        {error}
      </p>
    );
  }

  if (!helper) return null;

  return (
    <p id={id} className="mt-1.5 text-xs leading-relaxed text-slate-400">
      {helper}
    </p>
  );
}

function describedBy(id: string, helper?: string, error?: string) {
  return error || helper ? `${id}-hint` : undefined;
}

function ConsultationTextField({
  id,
  label,
  required,
  optional,
  icon: Icon,
  error,
  helper,
  className,
  ...props
}: ComponentProps<typeof Input> & {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  icon: ConsultationIcon;
  error?: string;
  helper?: string;
}) {
  return (
    <div>
      <ConsultationLabel htmlFor={id} label={label} required={required} optional={optional} />
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
        <Input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, helper, error)}
          className={cn(
            "min-h-12 rounded-md border-slate-300 bg-white pl-10 pr-3 text-base text-slate-950 shadow-sm placeholder:text-slate-500 focus-visible:border-primary focus-visible:ring-primary/35 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-300 dark:bg-white dark:text-slate-950 dark:placeholder:text-slate-500 md:text-sm",
            error && "border-red-300 focus-visible:border-red-300 focus-visible:ring-red-300/40",
            className
          )}
          {...props}
        />
      </div>
      <FieldHint id={`${id}-hint`} helper={helper} error={error} />
    </div>
  );
}

function ConsultationTextarea({
  id,
  label,
  required,
  optional,
  helper,
  error,
  className,
  ...props
}: ComponentProps<typeof Textarea> & {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  helper?: string;
  error?: string;
}) {
  return (
    <div>
      <ConsultationLabel htmlFor={id} label={label} required={required} optional={optional} />
      <div className="relative">
        <MessageSquareText className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" aria-hidden />
        <Textarea
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, helper, error)}
          rows={4}
          className={cn(
            "min-h-32 resize-y rounded-md border-slate-300 bg-white px-3 py-3 pl-10 text-base text-slate-950 shadow-sm placeholder:text-slate-500 focus-visible:border-primary focus-visible:ring-primary/35 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-300 dark:bg-white dark:text-slate-950 dark:placeholder:text-slate-500 md:text-sm",
            error && "border-red-300 focus-visible:border-red-300 focus-visible:ring-red-300/40",
            className
          )}
          {...props}
        />
      </div>
      <FieldHint id={`${id}-hint`} helper={helper} error={error} />
    </div>
  );
}

function ConsultationSelect({
  id,
  name,
  label,
  placeholder,
  options,
  value,
  required,
  optional,
  helper,
  error,
  icon: Icon,
  onValueChange,
}: {
  id: string;
  name: keyof SecureAiFormValues;
  label: string;
  placeholder: string;
  options: readonly string[];
  value: string;
  required?: boolean;
  optional?: boolean;
  helper?: string;
  error?: string;
  icon: ConsultationIcon;
  onValueChange: (value: string) => void;
}) {
  return (
    <div>
      <ConsultationLabel htmlFor={id} label={label} required={required} optional={optional} />
      <Select name={name} value={value} onValueChange={onValueChange} required={required}>
        <SelectTrigger
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, helper, error)}
          className={cn(
            "min-h-12 w-full rounded-md border-slate-300 bg-white px-3 text-left text-base font-medium text-slate-950 shadow-sm data-[placeholder]:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/35 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-300 dark:bg-white dark:text-slate-950 dark:hover:bg-white dark:data-[placeholder]:text-slate-500 md:text-sm",
            error && "border-red-300 focus:border-red-300 focus:ring-red-300/40"
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            <SelectValue placeholder={placeholder} />
          </span>
        </SelectTrigger>
        <SelectContent
          position="popper"
          sideOffset={6}
          className="z-[80] max-h-72 rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-2xl"
        >
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="min-h-11 cursor-pointer rounded-sm px-3 py-2.5 text-sm text-slate-900 focus:bg-primary/15 focus:text-slate-950 data-[state=checked]:bg-primary/20 data-[state=checked]:font-semibold data-[state=checked]:text-slate-950"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldHint id={`${id}-hint`} helper={helper} error={error} />
    </div>
  );
}

function NeedChoiceCards({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-white">
        Primary Need
        <span className="ml-1 text-primary" aria-label="required">*</span>
      </legend>
      <p id="secure-ai-need-hint" className="mt-1 text-xs leading-relaxed text-slate-400">
        What would you like help with first?
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-describedby={error ? "secure-ai-need-error" : "secure-ai-need-hint"}>
        {PRIMARY_NEED_OPTIONS.map((option) => {
          const selected = value === option;
          return (
            <label
              key={option}
              className={cn(
                "flex min-h-14 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-colors",
                "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background",
                selected
                  ? "border-primary bg-primary/15 text-white shadow-lg shadow-primary/10"
                  : "border-white/15 bg-white/[0.04] text-slate-100 hover:border-primary/60 hover:bg-white/[0.07]"
              )}
            >
              <input
                type="radio"
                name="need"
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                required
                className="sr-only"
                aria-invalid={error ? true : undefined}
              />
              <Sparkles className={cn("h-4 w-4 shrink-0", selected ? "text-primary" : "text-slate-400")} aria-hidden />
              <span className="text-sm font-medium leading-snug">{option}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id="secure-ai-need-error" className="mt-2 text-sm font-medium text-red-200" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function StageRadioCards({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-white">
        AI Adoption Stage
        <span className="ml-1 text-primary" aria-label="required">*</span>
      </legend>
      <p id="secure-ai-stage-hint" className="mt-1 text-xs leading-relaxed text-slate-400">
        Where is your organization today? Choose the stage that best matches your current initiative.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-describedby={error ? "secure-ai-stage-error" : "secure-ai-stage-hint"}>
        {AI_ADOPTION_STAGE_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex min-h-[112px] cursor-pointer flex-col rounded-md border p-4 transition-colors",
                "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background",
                selected
                  ? "border-primary bg-primary/15 text-white shadow-lg shadow-primary/10"
                  : "border-white/15 bg-white/[0.04] text-white hover:border-primary/60 hover:bg-white/[0.07]"
              )}
            >
              <input
                type="radio"
                name="aiAdoptionStage"
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                required
                className="sr-only"
                aria-invalid={error ? true : undefined}
              />
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    selected ? "border-primary bg-primary" : "border-slate-400 bg-transparent"
                  )}
                  aria-hidden="true"
                >
                  {selected && <span className="h-1.5 w-1.5 rounded-full bg-background" />}
                </span>
                {option.label}
              </span>
              <span className="mt-2 text-xs leading-relaxed text-slate-300">{option.description}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id="secure-ai-stage-error" className="mt-2 text-sm font-medium text-red-200" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
