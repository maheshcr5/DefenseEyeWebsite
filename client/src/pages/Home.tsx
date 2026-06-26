import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  CheckCircle2,
  FileCheck,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import NavBar from "@/components/NavBar";
import { useSeo } from "@/hooks/useSeo";
import {
  CALENDLY_URL,
  CAPABILITY_STATEMENT_PDF_URL,
  CERTIFICATIONS,
  COMPANY,
  FOUNDATIONAL_EXPERIENCE,
  MARKETPLACE_URL,
  SUPPLIER_IDENTIFIERS,
} from "@/data/companyFacts";
import { getStoredAttribution, trackConversion } from "@/lib/tracking";

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function LeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    title: "",
    phone: "",
    inquiryType: "",
    need: "",
    timeline: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, attribution: getStoredAttribution() }),
      });
      if (!res.ok) throw new Error("Server error");
      trackConversion("contact_form_submission", { form: "home_lead_modal", inquiryType: form.inquiryType || form.need });
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full bg-background border border-border/60 rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20";
  const labelCls = "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block";

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border/60 shadow-2xl rounded-sm z-10"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-start justify-between p-6 border-b border-border/40">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">Talk with DefenseEye</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Share your cybersecurity, AI governance, compliance, or automation need. We will respond within 24 hours.
                </p>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground ml-4 mt-0.5" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-10 text-center">
                <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">Thank you.</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  DefenseEye will follow up at <strong className="text-foreground">{form.email}</strong> within 24 hours.
                </p>
                <Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" onClick={onClose}>
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>First Name *</label>
                    <input required name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Last Name *</label>
                    <input required name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Work Email *</label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Company *</label>
                    <input required name="company" value={form.company} onChange={handleChange} className={inputCls} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Role *</label>
                    <input required name="title" value={form.title} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Optional Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Inquiry Type *</label>
                    <select required name="inquiryType" value={form.inquiryType} onChange={handleChange} className={inputCls}>
                      <option value="">Select inquiry...</option>
                      <option>Supplier / procurement inquiry</option>
                      <option>AI governance or responsible AI</option>
                      <option>Microsoft Copilot readiness</option>
                      <option>CMMC readiness</option>
                      <option>Compliance automation</option>
                      <option>Cloud security</option>
                      <option>Staff augmentation</option>
                      <option>Subcontracting</option>
                      <option>CMMCLens demo</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Primary Need</label>
                    <select name="need" value={form.need} onChange={handleChange} className={inputCls}>
                      <option value="">Select need...</option>
                      <option>AI security or Security Copilot readiness</option>
                      <option>Cybersecurity and compliance automation</option>
                      <option>Federal cybersecurity, RMF, FedRAMP, or CMMC</option>
                      <option>Azure or Microsoft cloud security architecture</option>
                      <option>Data governance, privacy, or regulatory readiness</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Timeline *</label>
                  <select required name="timeline" value={form.timeline} onChange={handleChange} className={inputCls}>
                    <option value="">Select timeline...</option>
                    <option>Immediate project</option>
                    <option>30-90 days</option>
                    <option>This quarter</option>
                    <option>Planning for next quarter</option>
                    <option>Exploring partnership or marketplace options</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Context</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4} className={`${inputCls} resize-none`} />
                </div>
                {submitError && <p className="text-sm text-destructive">{submitError}</p>}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">No commitment. We use your information to respond to this inquiry.</p>
                  <Button type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 disabled:opacity-60">
                    {submitting ? "Sending..." : "Discuss Supplier Opportunities"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const servicePortfolio = [
  {
    icon: Network,
    title: "AI Transformation",
    challenge: "AI interest is high, but many teams lack a practical path from use-case ideas to governed implementation.",
    approach: "DefenseEye identifies AI opportunities, prioritizes use cases, and builds adoption roadmaps with governance-by-design.",
    outcome: "A clear path to secure AI adoption, workflow modernization, and value realization.",
    href: "/solutions/ai-transformation",
  },
  {
    icon: Bot,
    title: "AI Governance",
    challenge: "AI use is expanding faster than policies, oversight, risk controls, and accountability models.",
    approach: "DefenseEye designs governance programs aligned to NIST AI RMF, ISO 42001 readiness, responsible AI, and model oversight.",
    outcome: "A repeatable operating model for approving, monitoring, and governing AI systems.",
    href: "/solutions/ai-governance",
  },
  {
    icon: ShieldCheck,
    title: "AI Security",
    challenge: "Generative AI introduces new risks across prompts, data access, model behavior, and connected workflows.",
    approach: "DefenseEye assesses AI security architecture, threat scenarios, identity boundaries, and Security Copilot readiness.",
    outcome: "Organizations reduce AI-related security risk before adoption scales.",
    href: "/solutions/ai-security",
  },
  {
    icon: Sparkles,
    title: "Microsoft Copilot Enablement",
    challenge: "Copilot adoption can expose overshared data, unclear ownership, and unmanaged AI usage.",
    approach: "DefenseEye assesses permissions, governance, data readiness, user workflows, and security controls before rollout.",
    outcome: "Copilot enablement that supports productivity while reducing governance and data exposure risk.",
    href: "/solutions/microsoft-copilot-enablement",
  },
  {
    icon: Activity,
    title: "Cybersecurity & Risk",
    challenge: "Security teams need clearer risk visibility across operations, controls, systems, and decision points.",
    approach: "DefenseEye connects cybersecurity architecture, risk management, control evidence, and remediation planning.",
    outcome: "Programs become easier to govern, explain, and improve over time.",
    href: "/solutions/cybersecurity-risk",
  },
  {
    icon: FileCheck,
    title: "Compliance Automation",
    challenge: "Manual evidence collection and documentation work slows assessments and increases inconsistency.",
    approach: "DefenseEye automates evidence workflows, control traceability, documentation preparation, and readiness monitoring.",
    outcome: "Teams reduce preparation effort and improve audit readiness.",
    href: "/solutions/compliance-automation",
  },
  {
    icon: Network,
    title: "Cloud Security",
    challenge: "Regulated cloud environments require secure architecture, identity controls, and compliance-aware implementation.",
    approach: "DefenseEye supports Azure, Azure Government, GCC High patterns, Zero Trust, and secure modernization.",
    outcome: "Cloud programs align security, compliance, and operational readiness.",
    href: "/solutions/cloud-security",
  },
  {
    icon: BarChart3,
    title: "CMMCLens Platform",
    challenge: "Readiness programs often depend on fragmented evidence, manual tracking, and inconsistent documentation.",
    approach: "CMMCLens centralizes evidence, traces controls, identifies gaps, and supports AI-assisted SSP and policy generation.",
    outcome: "Organizations improve continuous readiness without making CMMC the only focus.",
    href: "/cmmclens",
  },
];

const executiveSummary = [
  {
    title: "What We Do",
    text: "DefenseEye helps organizations adopt AI securely, govern AI responsibly, strengthen cybersecurity, automate compliance activities, and improve operational readiness.",
  },
  {
    title: "Who We Help",
    text: "Government agencies, defense contractors, regulated enterprises, prime contractors, technology companies, and enterprise teams operating in Microsoft-centered environments.",
  },
  {
    title: "How We Deliver",
    text: "DefenseEye supports advisory consulting, project delivery, staff augmentation, specialized subcontracting, platform-enabled consulting, and compliance automation.",
  },
  {
    title: "Why DefenseEye",
    text: "Cybersecurity, federal compliance, Microsoft cloud, AI governance, privacy, regulatory response, and compliance automation experience with supplier-ready credentials.",
  },
];

const outcomes = [
  {
    icon: Sparkles,
    title: "Accelerate Secure AI Adoption",
    text: "Identify, prioritize, and implement practical AI use cases aligned to business objectives, security controls, and governance requirements.",
  },
  {
    icon: Bot,
    title: "Improve AI Governance",
    text: "Establish responsible AI controls, oversight models, human accountability, explainability, and risk management practices.",
  },
  {
    icon: Sparkles,
    title: "Enable Microsoft Copilot Responsibly",
    text: "Prepare Microsoft 365, identity, data, privacy, and governance controls before Copilot or generative AI expansion.",
  },
  {
    icon: FileCheck,
    title: "Reduce Manual Compliance Effort",
    text: "Automate evidence collection, documentation preparation, control mapping, SSP/POA&M workflows, and readiness reporting.",
  },
  {
    icon: ShieldCheck,
    title: "Strengthen Cybersecurity Readiness",
    text: "Improve cloud security, identity controls, threat visibility, and compliance preparedness.",
  },
  {
    icon: Activity,
    title: "Increase Operational Visibility",
    text: "Provide analytics, dashboards, and risk-informed decision support for leadership, security, and compliance teams.",
  },
  {
    icon: Award,
    title: "Support Audit and Supplier Readiness",
    text: "Help organizations prepare for enterprise procurement, regulated customer expectations, third-party reviews, CMMC assessments, and federal compliance obligations.",
  },
];

const engagementOptions = [
  ["Advisory Consulting", "AI governance, cybersecurity, compliance, and cloud security advisory for executives, program leaders, and regulated teams."],
  ["Project Delivery", "Defined-scope engagements such as AI governance assessments, Copilot readiness reviews, Azure security assessments, CMMC readiness sprints, and compliance automation implementations."],
  ["Staff Augmentation", "Specialized consultants for AI governance, cybersecurity, cloud security, compliance automation, Microsoft security, and CMMC/NIST programs."],
  ["Specialized Subcontracting", "Support for prime contractors, system integrators, and enterprise suppliers needing minority-owned AI, cybersecurity, and compliance expertise."],
];

const whoWeHelp = [
  "Microsoft supplier procurement and inclusive sourcing teams",
  "Google and enterprise supplier teams",
  "Federal contractors and prime contractor programs",
  "Regulated industry executives and technology leaders",
  "CIO, CISO, CTO, compliance, risk, privacy, and AI governance teams",
  "System integrators seeking specialized AI and cybersecurity subcontractors",
];

const supplierReadiness = [
  "OMWBE-MBE Certified, NMSDC-MBE Certified, and WA State SBE",
  "CAGE: 9ZDL5 · UEI: E4DYPCKN7YN8 · DUNS: 119330734",
  "WA State UBI: 605-582-526 · NAICS: 541512, 541519, 541690, 561621",
  "CMMC Level 1 Certified; NIST 800-171 Level 2 in progress",
  "Azure Marketplace presence through CMMCLens",
  "Available for project-based consulting, advisory, implementation, subcontracting, and staff augmentation",
  "Security, governance, and compliance-centered delivery approach for regulated and federal contractor environments",
];

const foundationalExperience = FOUNDATIONAL_EXPERIENCE;

const deliveryModel = [
  ["Discover", "Understand business goals, regulatory requirements, AI use cases, cloud environment, and current risk posture."],
  ["Assess", "Evaluate controls, workflows, governance gaps, cybersecurity risks, compliance readiness, and automation opportunities."],
  ["Prioritize", "Develop a practical roadmap based on risk, business impact, implementation effort, and supplier or customer requirements."],
  ["Implement", "Deploy governance processes, automation workflows, security improvements, policies, dashboards, and documentation support."],
  ["Operationalize", "Support adoption, ownership, reporting, continuous monitoring, and readiness improvement."],
  ["Improve", "Measure outcomes, refine controls, reduce manual effort, and maintain readiness over time."],
];

const engagementModels = [
  "Advisory consulting",
  "Implementation projects",
  "Staff augmentation",
  "Fractional leadership",
  "Subcontracting",
  "Platform-enabled consulting",
  "Compliance automation support",
];

const representativeEngagements = [
  {
    title: "AI governance readiness assessment",
    situation: "An organization needs a practical view of AI use, risk ownership, and governance gaps.",
    approach: "DefenseEye reviews use cases, policies, roles, controls, and evidence expectations.",
    deliverable: "Readiness findings, risk themes, and a prioritized governance roadmap.",
    outcome: "Leadership gains a practical path from AI experimentation to governed adoption.",
  },
  {
    title: "Microsoft Copilot risk and governance assessment",
    situation: "A team is preparing for Copilot adoption and needs confidence in data access and oversight.",
    approach: "DefenseEye evaluates permissions, data exposure, Purview alignment, user workflows, and governance controls.",
    deliverable: "Copilot readiness report with remediation priorities and adoption controls.",
    outcome: "Copilot rollout planning aligns productivity goals with security and governance requirements.",
  },
  {
    title: "Azure security posture review",
    situation: "A cloud environment needs stronger identity, monitoring, configuration, and compliance alignment.",
    approach: "DefenseEye reviews Azure security architecture, Entra controls, Defender, Sentinel, and policy posture.",
    deliverable: "Risk-ranked findings and secure modernization recommendations.",
    outcome: "Cloud owners receive a prioritized path to improve security and operational readiness.",
  },
  {
    title: "CMMC Level 2 readiness sprint",
    situation: "A defense contractor needs to understand gaps against NIST SP 800-171 and CMMC Level 2 expectations.",
    approach: "DefenseEye reviews scope, evidence, SSP content, POA&M status, and remediation priorities.",
    deliverable: "Readiness assessment, prioritized action plan, and documentation improvement plan.",
    outcome: "The organization can focus effort on the highest-risk readiness gaps.",
  },
  {
    title: "Compliance evidence automation implementation",
    situation: "A compliance team spends too much time collecting evidence and preparing documentation.",
    approach: "DefenseEye maps controls to source systems, workflows, evidence requirements, and automation opportunities.",
    deliverable: "Evidence automation design, workflow recommendations, and CMMCLens fit assessment when relevant.",
    outcome: "Manual preparation effort decreases and evidence traceability improves.",
  },
  {
    title: "Fractional AI governance or cybersecurity advisory support",
    situation: "A program needs specialized guidance without a full-time leadership hire.",
    approach: "DefenseEye provides structured advisory support for policies, oversight, risks, controls, and reporting.",
    deliverable: "Recurring advisory cadence, decision support, and governance artifacts.",
    outcome: "Teams gain practical leadership support while internal ownership matures.",
  },
];

const faqs = [
  ["What does DefenseEye do?", "DefenseEye helps organizations adopt AI securely, govern AI responsibly, strengthen cybersecurity and cloud security, automate compliance readiness, and improve operational and audit preparedness."],
  ["How does DefenseEye help organizations adopt AI securely?", "DefenseEye identifies practical AI use cases, reviews data and access risks, designs governance controls, and supports implementation roadmaps that connect AI adoption with security and accountability."],
  ["What is AI governance and why does it matter for Microsoft Copilot?", "AI governance defines how AI tools are approved, monitored, secured, and used responsibly. For Copilot, it helps manage permissions, sensitive data exposure, oversight, policy expectations, and user accountability."],
  ["How can organizations prepare for ISO 42001?", "Organizations can start by inventorying AI systems, defining responsibilities, assessing AI risks, documenting policies, and aligning oversight controls with measurable operating practices."],
  ["How does AI automate compliance evidence collection?", "AI and workflow automation can map evidence sources to controls, organize artifacts, identify gaps, draft documentation, and improve traceability for human review."],
  ["What is the fastest practical path to CMMC Level 2 readiness?", "Start with scope, validate the CUI boundary, assess gaps against NIST SP 800-171, prioritize remediation, update the SSP and POA&M, and organize current evidence before assessment planning."],
  ["How does CMMCLens support NIST SP 800-171 and CMMC readiness?", "CMMCLens supports automated evidence collection, control traceability, gap identification, continuous readiness monitoring, and AI-assisted SSP and policy generation."],
  ["How can Microsoft cloud environments support regulated AI adoption?", "Microsoft cloud environments can support regulated AI adoption through identity controls, data governance, Purview, Defender, Sentinel, Azure security, logging, and policy-aligned architecture."],
  ["Why should enterprise procurement teams consider DefenseEye?", "DefenseEye is positioned as a minority-owned, supplier-ready AI, cybersecurity, cloud security, and compliance automation firm available for advisory, implementation, subcontracting, and staff augmentation engagements."],
  ["Does DefenseEye support supplier, subcontractor, and staff augmentation models?", "Yes. DefenseEye is positioned to support project-based consulting, subcontracting, staff augmentation, fractional leadership, platform-enabled consulting, and compliance automation support."],
];

const thoughtLeadership = [
  ["What is CMMC Level 2?", "/insights/what-is-cmmc-level-2"],
  ["What is RMF readiness?", "/insights/what-is-rmf-readiness"],
  ["What is NIST AI RMF?", "/insights/what-is-nist-ai-rmf"],
  ["AI Governance Services", "/solutions/ai-governance"],
  ["AI Transformation Services", "/solutions/ai-transformation"],
  ["How can AI automate evidence collection?", "/insights/ai-automated-evidence-collection"],
  ["How can organizations implement AI governance?", "/insights/implement-ai-governance"],
  ["How can Security Copilot improve cybersecurity operations?", "/insights/security-copilot-cybersecurity-operations"],
  ["What is continuous compliance monitoring?", "/insights/continuous-compliance-monitoring"],
  ["How can AI improve audit readiness?", "/insights/ai-audit-readiness"],
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  useSeo(
    "DefenseEye.ai — Secure AI Adoption, Governance, Cybersecurity, and Compliance Automation",
    "DefenseEye helps enterprise, government, and regulated organizations adopt AI securely, govern AI responsibly, enable Microsoft Copilot, strengthen cybersecurity, and automate compliance readiness."
  );

  useEffect(() => {
    const schema = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "DefenseEye",
        alternateName: "DefenseEye.ai",
        url: "https://defenseeye.ai",
        description:
          "DefenseEye is a supplier-ready AI, cybersecurity, cloud security, and compliance automation consulting and technology firm serving enterprise, government, regulated, and Microsoft ecosystem environments.",
        knowsAbout: [
          "AI transformation",
          "AI governance",
          "Responsible AI",
          "NIST AI RMF",
          "ISO 42001 readiness",
          "AI security",
          "Microsoft Copilot governance consulting",
          "Azure AI security consulting",
          "Cybersecurity architecture",
          "Governance risk and compliance automation",
          "CMMC",
          "RMF",
          "FedRAMP",
          "Azure Government",
          "Azure GCC High",
          "Microsoft Managed Identity",
          "Data governance",
          "Security Copilot",
          "Audit readiness",
        ],
        sameAs: ["https://www.linkedin.com/company/defenseeye"],
        email: COMPANY.email,
        telephone: COMPANY.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: "9921 187th Ct NE",
          addressLocality: "Redmond",
          addressRegion: "WA",
          postalCode: "98052",
          addressCountry: "US",
        },
        identifier: SUPPLIER_IDENTIFIERS.map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
      },
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "DefenseEye",
        url: "https://defenseeye.ai",
        email: COMPANY.email,
        telephone: COMPANY.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: "9921 187th Ct NE",
          addressLocality: "Redmond",
          addressRegion: "WA",
          postalCode: "98052",
          addressCountry: "US",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "DefenseEye AI Transformation, Cybersecurity, and Compliance Automation Services",
        url: "https://defenseeye.ai",
        areaServed: { "@type": "Country", name: "United States" },
        serviceType: [
          "AI transformation",
          "AI governance",
          "AI security",
          "Microsoft Copilot enablement",
          "Cybersecurity compliance automation",
          "Federal cybersecurity advisory",
          "Cloud security architecture",
          "Supplier readiness support",
          "Data governance and privacy",
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "DefenseEye.ai",
        url: "https://defenseeye.ai",
        description:
          "Secure AI adoption, AI governance, cybersecurity, cloud security, supplier readiness, and compliance automation resources from DefenseEye.",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://defenseeye.ai/",
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "CMMCLens",
        applicationCategory: "Cybersecurity and compliance automation",
        operatingSystem: "Web",
        description:
          "CMMCLens is an AI-assisted cybersecurity and compliance intelligence platform for automated evidence collection, gap assessments, SSP generation, policy generation, traceability, risk remediation workflows, and continuous readiness monitoring.",
        brand: { "@type": "Brand", name: "DefenseEye" },
        offers: { "@type": "Offer", url: MARKETPLACE_URL },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ];
    const id = "defenseeye-home-schema";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.text = JSON.stringify(schema);
    document.head.appendChild(s);
    return () => document.getElementById(id)?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden nvidia-grid-bg">
      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <NavBar />

      <header className="relative pt-20 pb-20 px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[620px] rounded-full bg-primary/8 blur-[150px]" />
          <div className="absolute top-24 left-1/4 w-[360px] h-[260px] rounded-full bg-accent/[0.08] blur-[110px]" />
          <div className="absolute bottom-0 right-0 w-[360px] h-[260px] rounded-full bg-sky-400/[0.06] blur-[120px]" />
        </div>
        <motion.div
          className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary tracking-wide uppercase">
                Supplier-ready AI, cybersecurity, cloud security, and compliance automation
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-5 text-foreground">
              Secure AI Adoption, Governance, and Compliance Automation
              <span className="block text-primary"> for Regulated Organizations</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              DefenseEye helps enterprise, government, and regulated organizations adopt AI securely, govern AI responsibly,
              strengthen cybersecurity, and automate compliance readiness across Microsoft cloud and modern enterprise environments.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {["Secure AI Adoption", "AI Governance", "Microsoft Copilot", "Cloud Security", "Supplier Readiness", "Compliance Automation"].map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-card/40 text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto" onClick={() => trackConversion("consultation_booking_click", { location: "home_hero" })}>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-10 h-12 w-full sm:w-auto">
                  Discuss Supplier Opportunities <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href={CAPABILITY_STATEMENT_PDF_URL} className="w-full sm:w-auto" onClick={() => trackConversion("capability_statement_download", { location: "home_hero" })}>
                <Button variant="outline" size="lg" className="border-primary/40 text-primary hover:bg-primary/10 text-base px-10 h-12 w-full sm:w-auto">
                  Request Capability Statement
                </Button>
              </a>
              <a href="/cmmclens" className="w-full sm:w-auto" onClick={() => trackConversion("cmmclens_click", { location: "home_hero" })}>
                <Button variant="outline" size="lg" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 text-base px-10 h-12 w-full sm:w-auto">
                  Explore CMMCLens
                </Button>
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-5">
              Available for advisory, implementation, subcontracting, and staff augmentation engagements.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-card/55 border border-primary/30 rounded-sm p-6 md:p-7 shadow-xl shadow-black/20">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-5">Operational Focus</p>
              <div className="space-y-3 mb-6">
                {[
                  ["What we do", "AI, security, governance, and automation"],
                  ["Who we help", "Enterprise, federal, suppliers, integrators"],
                  ["Why credible", "Supplier readiness + practitioner experience"],
                  ["Business outcome", "Governed adoption and compliance readiness"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-border/30 last:border-b-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-semibold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Bot, label: "AI" },
                  { icon: ShieldCheck, label: "Cybersecurity" },
                  { icon: Network, label: "GRC" },
                  { icon: Award, label: "Microsoft" },
                ].map((item) => (
                  <div key={item.label} className="bg-background/60 border border-border/40 rounded-sm p-4">
                    <item.icon className="w-5 h-5 text-primary mb-3" />
                    <p className="text-sm font-heading font-semibold">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <Section className="py-12 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {executiveSummary.map((item) => (
              <div key={item.title} className="bg-card border border-border/50 rounded-sm p-6">
                <CheckCircle2 className="w-5 h-5 text-primary mb-3" />
                <h2 className="font-heading font-semibold text-lg text-foreground mb-2">{item.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-14 px-4 section-light">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Who We Help</p>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Built for enterprise, supplier, and regulated environments
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              DefenseEye is positioned to support organizations that need specialized AI, cybersecurity, cloud security, and compliance automation capability without unsupported claims about customer traction.
            </p>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
            {whoWeHelp.map((item) => (
              <div key={item} className="bg-card/50 border border-border/40 rounded-sm p-4">
                <CheckCircle2 className="w-5 h-5 text-primary mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 px-4 section-gray">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Outcomes We Deliver</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Operational outcomes leaders can evaluate
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              DefenseEye focuses on secure AI adoption, accountable governance, reduced manual effort, stronger readiness, and supplier evaluation confidence.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {outcomes.map((item) => (
              <div key={item.title} className="bg-card/50 border border-border/40 rounded-sm p-5">
                <item.icon className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-heading font-semibold text-sm text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">How Enterprise Organizations Can Engage DefenseEye</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Flexible engagement models for procurement, delivery, and subcontracting needs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              DefenseEye is structured to support supplier onboarding, capability review, subcontracting discussions, and enterprise procurement evaluation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {engagementOptions.map(([title, text]) => (
              <div key={title} className="bg-card/50 border border-border/40 rounded-sm p-5">
                <Award className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-heading font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="services" className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Core Services</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-3 text-foreground">
              Services organized for executive evaluation and operational delivery
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each service connects a business challenge to a practical implementation path and a measurable operational outcome.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {servicePortfolio.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex flex-col bg-card/50 border border-border/40 rounded-sm p-7 hover:border-primary/30 transition-all duration-300"
              >
                <svc.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-heading font-bold text-foreground mb-2">{svc.title}</h3>
                <div className="space-y-3 mb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Challenge:</span> {svc.challenge}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Approach:</span> {svc.approach}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Outcome:</span> {svc.outcome}</p>
                </div>
                <a href={svc.href} className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="microsoft" className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Microsoft Ecosystem Experience</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              Microsoft-aligned delivery experience for regulated environments
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              DefenseEye supports Microsoft-centered programs where cloud security, identity, governance, compliance automation, and AI adoption must be implemented with evidence and accountability.
            </p>
            <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline mt-5">
              View the CMMCLens Azure Marketplace listing <ArrowRight className="w-4 h-4" />
            </a>
            <div className="mt-4">
              <a href="/microsoft-ecosystem" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                View Microsoft ecosystem details <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              "Microsoft Independent Software Vendor (ISV)",
              "Azure Marketplace presence through CMMCLens",
              "Azure expertise for secure architecture and modernization",
              "Azure Government and GCC High familiarity",
              "Microsoft Entra, Defender, Sentinel, Purview, and Azure security alignment",
              "Microsoft 365 and Copilot enablement experience",
              "Cloud security and compliance automation expertise",
              "Experience supporting regulated and defense-oriented environments",
            ].map((item) => (
              <div key={item} className="bg-card/50 border border-border/40 rounded-sm p-5">
                <Award className="w-5 h-5 text-primary mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="cmmclens" className="py-16 px-4 section-gray">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Featured Solutions</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              CMMCLens is a flagship platform within the broader DefenseEye portfolio
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              CMMCLens supports evidence automation, continuous readiness, and compliance analytics across cybersecurity and governance programs. CMMC is an important use case, but the platform is designed to support broader readiness and traceability needs.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Internal implementations have demonstrated approximately 80% reduction in manual evidence collection effort where
              the required source data and integrations are available.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/cmmclens">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  Explore CMMCLens <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                  Microsoft Marketplace
                </Button>
              </a>
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              "Automated evidence collection",
              "Continuous readiness monitoring",
              "Gap identification",
              "Risk remediation workflows",
              "Evidence traceability",
              "AI-assisted SSP generation",
              "AI-assisted policy generation",
              "Compliance analytics",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-card/50 border border-border/40 rounded-sm p-4">
                <FileCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Trust and Credibility</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Why Organizations Choose DefenseEye
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              DefenseEye combines advisory, architecture, governance, and automation experience without relying on biography-heavy claims.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              "Microsoft ISV with a commercially available Marketplace solution",
              "NMSDC Certified Minority Business Enterprise",
              "Government and enterprise cybersecurity experience",
              "Compliance automation expertise across federal and regulated environments",
              "Secure cloud architecture experience for Microsoft and Azure environments",
              "AI transformation, responsible AI, governance, and risk management capabilities",
            ].map((item) => (
              <div key={item} className="bg-card border border-border/50 rounded-sm p-6">
                <Award className="w-5 h-5 text-primary mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 px-4 section-gray">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Expertise Areas</p>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Capability-based experience, not resume-heavy claims
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              DefenseEye presents expertise through what teams need to accomplish: architecture, readiness, authorization,
              governance, evidence, remediation, and operational control.
            </p>
          </div>
          <div className="lg:col-span-8 flex flex-wrap gap-2">
            {[
              "Cybersecurity architecture",
              "Federal compliance",
              "FedRAMP",
              "RMF",
              "CMMC",
              "Azure security",
              "AI governance",
              "Privacy and regulatory response",
              "Enterprise AI platforms",
              "AI transformation roadmaps",
              "Microsoft Copilot enablement",
              "Data governance",
              "Compliance automation",
              "Identity security",
              "Zero Trust",
              "SSP and POA&M development",
            ].map((tag) => (
              <span key={tag} className="text-sm px-3 py-2 border border-border/50 bg-card/40 rounded-sm text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Supplier Readiness</p>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Structured for procurement evaluation
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              DefenseEye is positioned to support supplier, subcontractor, advisory, implementation, and staff augmentation models for enterprise and regulated environments.
            </p>
            <div className="flex flex-col gap-3 mt-5">
              <a href="/supplier-readiness" className="text-sm font-semibold text-primary hover:underline">View supplier readiness details</a>
              <a href="/capability-statement" className="text-sm font-semibold text-primary hover:underline">View capability statement</a>
            </div>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
            {supplierReadiness.map((item) => (
              <div key={item} className="bg-card/50 border border-border/40 rounded-sm p-4">
                <Award className="w-5 h-5 text-primary mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 px-4 section-gray">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Foundational Experience</p>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Practitioner experience across AI, cloud, cybersecurity, and compliance
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              DefenseEye's consultants bring experience from enterprise technology, Microsoft cloud engineering, financial services, federal cybersecurity, regulated environments, and compliance automation programs.
            </p>
          </div>
          <div className="lg:col-span-8 flex flex-wrap gap-2">
            {foundationalExperience.map((item) => (
              <span key={item} className="text-sm px-3 py-2 border border-border/50 bg-card/40 rounded-sm text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Delivery Model</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Practical phases for advisory, implementation, and subcontracting work
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Engagements can be structured as advisory consulting, implementation projects, staff augmentation, fractional leadership, subcontracting, platform-enabled consulting, or compliance automation support.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {deliveryModel.map(([phase, text]) => (
              <div key={phase} className="bg-card/50 border border-border/40 rounded-sm p-5">
                <Target className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-heading font-semibold text-foreground mb-2">{phase}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {engagementModels.map((item) => (
              <span key={item} className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-card/40 text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Representative Engagements</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Engagement types DefenseEye is positioned to support
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These are representative engagement models, not completed customer proof points.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-5 mb-16">
            {representativeEngagements.map((item) => (
              <div key={item.title} className="bg-card/50 border border-border/40 rounded-sm p-6">
                <h3 className="font-heading font-bold text-foreground mb-3">{item.title}</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Situation:</span> {item.situation}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Approach:</span> {item.approach}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Deliverable:</span> {item.deliverable}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Typical outcome:</span> {item.outcome}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5 mb-16">
            <div className="bg-card/50 border border-border/40 rounded-sm p-6">
              <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">AI Governance and CMMC Authority</p>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                Practical guidance for AI governance and compliance readiness
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                DefenseEye connects NIST AI RMF, ISO 42001 readiness, responsible AI, human accountability, Copilot governance, AI security, CMMC, NIST SP 800-171, FedRAMP, RMF, evidence automation, and SSP/POA&M support.
              </p>
              <div className="flex flex-wrap gap-2">
                {["NIST AI RMF", "ISO 42001 readiness", "CMMC", "NIST SP 800-171", "FedRAMP", "Microsoft Copilot"].map((item) => (
                  <span key={item} className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-background/40 text-muted-foreground">{item}</span>
                ))}
              </div>
            </div>
            <div className="bg-card/50 border border-border/40 rounded-sm p-6">
              <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">DefenseEye Advisor</p>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                One collapsed advisor for practical readiness questions
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                DefenseEye Advisor stays collapsed until selected and supports secure AI adoption, AI governance, Copilot readiness, Azure security, compliance automation, CMMC, NIST 800-171, and supplier/subcontracting inquiries.
              </p>
              <button
                className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                onClick={() => {
                  trackConversion("defenseeye_advisor_opened", { location: "home_section" });
                  window.dispatchEvent(new CustomEvent("defenseeye:open-advisor"));
                }}
              >
                Open DefenseEye Advisor <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          <div className="text-center mb-10">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Plain-English Guides</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Knowledge Hub and FAQ for buyers, program teams, and AI search
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These pages are structured for search engines, answer engines, and generative discovery while giving readers direct practical answers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {thoughtLeadership.map(([label, href]) => (
              <a key={href} href={href} className="group bg-card border border-border/50 rounded-sm p-5 hover:border-primary/40 transition-colors">
                <BookIcon />
                <p className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors mt-3">{label}</p>
              </a>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-10">
            {faqs.map(([question, answer]) => (
              <div key={question} className="bg-card/40 border border-border/40 rounded-sm p-5">
                <h3 className="font-heading font-semibold text-foreground mb-2">{question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="contact" className="py-14 px-4 section-gray">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-8">
            <Target className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-accent tracking-wide uppercase">Supplier, subcontracting, advisory, and implementation opportunities</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-5 text-foreground">
            Discuss supplier opportunities with DefenseEye
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Available for advisory, implementation, subcontracting, staff augmentation, platform-enabled consulting, and compliance automation support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto" onClick={() => trackConversion("consultation_booking_click", { location: "home_final_cta" })}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-12 h-12 w-full sm:w-auto">
                Discuss Supplier Opportunities <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="/capability-statement" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 text-base px-10 h-12 w-full sm:w-auto">
                Request Capability Statement
              </Button>
            </a>
            <a href="/cmmclens" className="w-full sm:w-auto" onClick={() => trackConversion("cmmclens_click", { location: "home_final_cta" })}>
              <Button variant="outline" size="lg" className="border-primary/40 text-primary hover:bg-primary/10 text-base px-10 h-12 w-full sm:w-auto">
                Explore CMMCLens
              </Button>
            </a>
          </div>
        </div>
      </Section>

      <footer className="py-14 px-4 border-t border-border/30 section-gray" role="contentinfo">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="mb-4">
                <DefenseEyeLogo />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                AI transformation, AI governance, cybersecurity, risk, compliance, and automation for government, defense, and regulated organizations.
              </p>
              <p className="text-xs text-muted-foreground/60">NAICS: 541512, 541519 · SAM Registered · NMSDC Certified MBE</p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-xs text-foreground mb-4 uppercase tracking-widest">Services</h4>
              <ul className="space-y-2.5">
                {["AI Transformation", "AI Governance", "AI Security", "Cloud Security", "Compliance Automation", "CMMC Readiness"].map((label) => (
                  <li key={label}>
                    <a href="#services" className="text-sm text-muted-foreground hover:text-primary transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-xs text-foreground mb-4 uppercase tracking-widest">Products</h4>
              <ul className="space-y-2.5">
                <li><a href="/cmmclens" className="text-sm text-muted-foreground hover:text-primary transition-colors">CMMCLens</a></li>
                <li><a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Microsoft Marketplace</a></li>
                <li><a href="/knowledge-hub" className="text-sm text-muted-foreground hover:text-primary transition-colors">Knowledge Hub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-xs text-foreground mb-4 uppercase tracking-widest">Company</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Why DefenseEye", href: "/why-defenseeye" },
                  { label: "Supplier Readiness", href: "/supplier-readiness" },
                  { label: "Capability Statement", href: "/capability-statement" },
                  { label: "Delivery Model", href: "/delivery-model" },
                  { label: "Representative Engagements", href: "/representative-engagements" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Support", href: "/support" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} DefenseEye, Inc. All rights reserved. CMMCLens is a trademark of DefenseEye.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
              <span className="text-border">|</span>
              <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
              <span className="text-border">|</span>
              <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BookIcon() {
  return (
    <div className="w-9 h-9 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
      <BarChart3 className="w-4 h-4 text-primary" />
    </div>
  );
}
