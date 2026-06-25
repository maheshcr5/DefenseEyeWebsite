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

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";
const MARKETPLACE_URL = "https://marketplace.microsoft.com/en-us/search?search=CMMCLens";

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
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
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
                    <label className={labelCls}>Primary Need *</label>
                    <select required name="need" value={form.need} onChange={handleChange} className={inputCls}>
                      <option value="">Select need...</option>
                      <option>AI governance or responsible AI</option>
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
                  <p className="text-xs text-muted-foreground">No commitment. Practical next steps.</p>
                  <Button type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 disabled:opacity-60">
                    {submitting ? "Sending..." : "Schedule Consultation"}
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
    challenge: "Organizations need useful AI adoption without disconnected pilots or unmanaged data exposure.",
    approach: "DefenseEye identifies practical use cases, sequences adoption roadmaps, and connects automation to governance and operations.",
    outcome: "Teams move from AI interest to approved, measurable implementation.",
    href: "/solutions/ai-transformation",
  },
  {
    icon: Bot,
    title: "AI Governance",
    challenge: "AI use is expanding faster than policies, oversight, and accountability models.",
    approach: "DefenseEye builds governance programs aligned to NIST AI RMF, responsible AI, risk controls, explainability, and human accountability.",
    outcome: "Leaders gain a repeatable model for approving, monitoring, and governing AI systems.",
    href: "/solutions/ai-governance",
  },
  {
    icon: ShieldCheck,
    title: "AI Security",
    challenge: "Generative AI introduces new risks across prompts, data access, model behavior, and connected workflows.",
    approach: "DefenseEye assesses AI security architecture, threat scenarios, identity boundaries, and Security Copilot readiness.",
    outcome: "Organizations reduce AI-related security risk before adoption scales.",
    href: "/insights/security-copilot-cybersecurity-operations",
  },
  {
    icon: Activity,
    title: "Cybersecurity & Risk",
    challenge: "Security teams need clearer risk visibility across operations, controls, systems, and decision points.",
    approach: "DefenseEye connects cybersecurity architecture, risk management, control evidence, and remediation planning.",
    outcome: "Programs become easier to govern, explain, and improve over time.",
    href: "/why-defenseeye",
  },
  {
    icon: FileCheck,
    title: "Compliance Automation",
    challenge: "Manual evidence collection and documentation work slows assessments and increases inconsistency.",
    approach: "DefenseEye automates evidence workflows, control traceability, documentation preparation, and readiness monitoring.",
    outcome: "Teams reduce preparation effort and improve audit readiness.",
    href: "/insights/ai-automated-evidence-collection",
  },
  {
    icon: Network,
    title: "Cloud Security",
    challenge: "Regulated cloud environments require secure architecture, identity controls, and compliance-aware implementation.",
    approach: "DefenseEye supports Azure, Azure Government, GCC High patterns, Zero Trust, and secure modernization.",
    outcome: "Cloud programs align security, compliance, and operational readiness.",
    href: "/#microsoft",
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
    text: "DefenseEye helps organizations adopt AI securely, govern AI responsibly, strengthen cybersecurity, automate compliance work, and improve readiness.",
  },
  {
    title: "Who We Help",
    text: "Government agencies, defense contractors, regulated industries, prime contractors, and enterprise teams operating in Microsoft-centered environments.",
  },
  {
    title: "Why DefenseEye",
    text: "Combined experience across cybersecurity, federal compliance, cloud security, AI governance, privacy, regulatory response, and automation.",
  },
];

const outcomes = [
  {
    icon: Sparkles,
    title: "Accelerate AI Adoption",
    text: "Identify, prioritize, and implement practical AI use cases aligned to business objectives.",
  },
  {
    icon: Bot,
    title: "Improve Governance",
    text: "Establish responsible AI, cybersecurity, privacy, and compliance controls with clear accountability.",
  },
  {
    icon: FileCheck,
    title: "Reduce Manual Effort",
    text: "Automate evidence collection, documentation preparation, and readiness assessments.",
  },
  {
    icon: Activity,
    title: "Increase Operational Visibility",
    text: "Provide monitoring, analytics, and risk-informed decision support for program owners.",
  },
  {
    icon: ShieldCheck,
    title: "Strengthen Readiness",
    text: "Improve cybersecurity, compliance, and audit preparedness across regulated environments.",
  },
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
    "DefenseEye.ai — AI Transformation, AI Governance, Cybersecurity, Risk, and Compliance Automation",
    "DefenseEye helps government agencies, defense contractors, regulated industries, and enterprise teams adopt AI responsibly, improve governance, reduce operational risk, automate compliance work, and increase audit readiness."
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
          "DefenseEye is an AI transformation, AI governance, cybersecurity, risk, and compliance automation company serving government agencies, defense contractors, regulated enterprises, and Microsoft ecosystem partners.",
        knowsAbout: [
          "AI transformation",
          "AI governance",
          "Responsible AI",
          "NIST AI RMF",
          "AI security",
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
          "Cybersecurity compliance automation",
          "Federal cybersecurity advisory",
          "Cloud security architecture",
          "Data governance and privacy",
        ],
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
                Microsoft-aligned AI transformation, security, and governance
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-5 text-foreground">
              AI Transformation, AI Governance, Cybersecurity, Risk, and
              <span className="block text-primary"> Compliance Automation</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              DefenseEye helps government agencies, defense contractors, regulated industries, and enterprise teams adopt AI responsibly,
              improve governance, reduce operational risk, automate compliance activities, and prepare for audits with clearer evidence.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {["AI Adoption", "AI Governance", "Cybersecurity", "Risk Reduction", "Audit Readiness", "Microsoft Ecosystem"].map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-card/40 text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-10 h-12 w-full sm:w-auto">
                  Schedule Consultation <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="#services" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 text-base px-10 h-12 w-full sm:w-auto">
                  Explore Solutions
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-card/55 border border-primary/30 rounded-sm p-6 md:p-7 shadow-xl shadow-black/20">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-5">Operational Focus</p>
              <div className="space-y-3 mb-6">
                {[
                  ["What we do", "AI, security, governance, and automation"],
                  ["Who we help", "Government, defense, regulated enterprise"],
                  ["Why credible", "Microsoft ISV + federal compliance experience"],
                  ["Business outcome", "Responsible adoption and audit readiness"],
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
          <div className="grid md:grid-cols-3 gap-5">
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

      <Section id="services" className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">What We Do</p>
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

      <Section className="py-16 px-4 section-gray">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Outcomes We Deliver</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Operational outcomes leaders can evaluate
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              DefenseEye focuses on measurable progress: adoption, governance, automation, visibility, and readiness.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              "Microsoft Independent Software Vendor (ISV)",
              "Azure Marketplace presence through CMMCLens",
              "Azure expertise for secure architecture and modernization",
              "Azure Government and GCC High experience",
              "Microsoft security technologies and identity-aware integrations",
              "Microsoft 365 and Copilot experience",
              "Cloud security and compliance automation expertise",
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Plain-English Guides</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Answer-ready resources for buyers, program teams, and AI search
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
        </div>
      </Section>

      <Section id="contact" className="py-14 px-4 section-gray">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-8">
            <Target className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-accent tracking-wide uppercase">Consulting, advisory, platform, and partner opportunities</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-5 text-foreground">
            Schedule a practical conversation about AI, security, governance, and compliance
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Talk with DefenseEye about responsible AI adoption, governance, cybersecurity readiness, Microsoft-aligned architecture, federal compliance, or CMMCLens automation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-12 h-12 w-full sm:w-auto">
                Schedule Consultation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#services" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 text-base px-10 h-12 w-full sm:w-auto">
                Explore Solutions
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
                  { label: "Case Studies", href: "/case-studies" },
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
