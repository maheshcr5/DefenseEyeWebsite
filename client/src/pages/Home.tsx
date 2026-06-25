import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  CheckCircle2,
  Cloud,
  FileCheck,
  Landmark,
  Lock,
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
                    {submitting ? "Sending..." : "Request Consultation"}
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
    icon: Bot,
    title: "AI Governance & Responsible AI",
    text: "NIST AI RMF alignment, governance programs, AI risk assessments, and responsible AI readiness.",
  },
  {
    icon: ShieldCheck,
    title: "AI Security",
    text: "Generative AI security assessments, LLM threat modeling, AI architecture reviews, and Security Copilot readiness.",
  },
  {
    icon: Activity,
    title: "Cybersecurity & Compliance Automation",
    text: "Continuous compliance, evidence automation, control monitoring, and risk remediation workflows.",
  },
  {
    icon: Landmark,
    title: "Federal Cybersecurity",
    text: "RMF, FedRAMP, CMMC, SSP development, POA&M management, and authorization readiness.",
  },
  {
    icon: Cloud,
    title: "Cloud Security Architecture",
    text: "Azure security, identity security, Zero Trust, and secure cloud modernization.",
  },
  {
    icon: Lock,
    title: "Data Governance & Privacy",
    text: "Data governance, privacy programs, regulatory readiness, and information protection.",
  },
];

const thoughtLeadership = [
  ["What is CMMC Level 2?", "/insights/what-is-cmmc-level-2"],
  ["What is RMF readiness?", "/insights/what-is-rmf-readiness"],
  ["What is NIST AI RMF?", "/insights/what-is-nist-ai-rmf"],
  ["How can AI automate evidence collection?", "/insights/ai-automated-evidence-collection"],
  ["How can organizations implement AI governance?", "/insights/implement-ai-governance"],
  ["How can Security Copilot improve cybersecurity operations?", "/insights/security-copilot-cybersecurity-operations"],
  ["What is continuous compliance monitoring?", "/insights/continuous-compliance-monitoring"],
  ["How can AI improve audit readiness?", "/insights/ai-audit-readiness"],
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  useSeo(
    "DefenseEye.ai — AI-Powered Cybersecurity, Governance, Risk, and Compliance Automation",
    "DefenseEye helps government agencies, defense contractors, and regulated organizations accelerate cybersecurity readiness, governance, risk management, and compliance through AI-enabled automation, Microsoft-aligned cloud security, and evidence-driven decision support."
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
          "DefenseEye is an AI-powered cybersecurity, governance, risk, compliance, and automation company serving government agencies, defense contractors, regulated enterprises, and Microsoft ecosystem partners.",
        knowsAbout: [
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
        ],
        sameAs: ["https://www.linkedin.com/company/defenseeye"],
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "DefenseEye AI Cybersecurity and Compliance Automation Services",
        url: "https://defenseeye.ai",
        areaServed: { "@type": "Country", name: "United States" },
        serviceType: [
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
                Microsoft-aligned AI cybersecurity and GRC automation
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-5 text-foreground">
              AI-Powered Cybersecurity, Governance, Risk, and
              <span className="block text-primary"> Compliance Automation</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Helping government agencies, defense contractors, and regulated organizations accelerate cybersecurity readiness,
              governance, risk management, and compliance through AI-enabled automation and evidence-driven decision support.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {["AI Governance", "Cybersecurity", "Compliance Automation", "Microsoft Ecosystem", "Government + Enterprise"].map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-card/40 text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-10 h-12 w-full sm:w-auto">
                  Book a Consultation <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="/cmmclens" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 text-base px-10 h-12 w-full sm:w-auto">
                  Explore CMMCLens
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-card/55 border border-primary/30 rounded-sm p-6 md:p-7 shadow-xl shadow-black/20">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-5">Operational Focus</p>
              <div className="space-y-3 mb-6">
                {[
                  ["AI risk decisions", "Explainable governance"],
                  ["Evidence readiness", "Automated collection"],
                  ["Microsoft cloud", "Azure Government + GCC High"],
                  ["Federal programs", "RMF, FedRAMP, CMMC"],
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
                  { icon: Cloud, label: "Microsoft" },
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              "Microsoft ISV",
              "Microsoft Marketplace Solution",
              "Azure Government Experience",
              "Azure GCC High Integrations",
              "NMSDC Certified MBE",
            ].map((item) => (
              <div key={item} className="bg-card border border-border/50 rounded-sm p-5">
                <CheckCircle2 className="w-5 h-5 text-primary mb-3" />
                <p className="font-heading font-semibold text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="microsoft" className="py-16 px-4 section-gray">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Microsoft Ecosystem</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              Built for Microsoft-aligned cybersecurity and compliance programs
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              DefenseEye works in Microsoft environments where identity, cloud security, data protection, and evidence collection
              must support federal and enterprise compliance obligations.
            </p>
            <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline mt-5">
              View the CMMCLens Microsoft Marketplace listing <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              "Microsoft Independent Software Vendor (ISV)",
              "Microsoft Marketplace solution availability for CMMCLens",
              "Azure Government architecture and compliance experience",
              "Azure GCC High and Microsoft 365 GCC High integrations",
              "Managed Identity integrations for secure service access",
              "Microsoft-aligned evidence and compliance automation",
            ].map((item) => (
              <div key={item} className="bg-card/50 border border-border/40 rounded-sm p-5">
                <Cloud className="w-5 h-5 text-primary mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="services" className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Service Portfolio</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-3 text-foreground">
              Advisory and automation for regulated organizations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Capability-based support across AI governance, cybersecurity, federal compliance, cloud architecture, data governance, and automation.
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
                <p className="text-sm text-muted-foreground leading-relaxed">{svc.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="cmmclens" className="py-16 px-4 section-gray">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">Flagship Platform</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              CMMCLens is a compliance intelligence and evidence automation platform
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              CMMCLens supports broader cybersecurity and governance objectives, not only CMMC. It helps teams reduce manual
              evidence work, improve traceability, maintain documentation consistency, and accelerate assessment readiness.
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
              "Automated gap assessments",
              "Continuous readiness monitoring",
              "AI-generated SSPs",
              "AI-generated policies and procedures",
              "Risk remediation workflows",
              "Evidence traceability",
              "Assessment readiness acceleration",
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
              Credibility through capabilities and operational outcomes
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              "Microsoft ISV with a commercially available Marketplace solution",
              "NMSDC Certified Minority Business Enterprise",
              "Government and enterprise cybersecurity experience",
              "Compliance automation expertise across federal and regulated environments",
              "Secure cloud architecture experience for Microsoft and Azure environments",
              "AI governance, responsible AI, and risk management capabilities",
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
            Build a stronger cybersecurity, AI governance, and compliance operating model
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Talk with DefenseEye about AI governance, cybersecurity readiness, Microsoft-aligned architecture, federal compliance, or CMMCLens automation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-12 h-12 w-full sm:w-auto">
                Book a Consultation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Button variant="outline" size="lg" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 text-base px-10 h-12 w-full sm:w-auto" onClick={() => setModalOpen(true)}>
              Send Project Context
            </Button>
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
                AI-powered cybersecurity, governance, risk, compliance, and automation for government, defense, and regulated organizations.
              </p>
              <p className="text-xs text-muted-foreground/60">NAICS: 541512, 541519 · SAM Registered · NMSDC Certified MBE</p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-xs text-foreground mb-4 uppercase tracking-widest">Services</h4>
              <ul className="space-y-2.5">
                {["AI Governance", "AI Security", "Compliance Automation", "Federal Cybersecurity", "Cloud Security Architecture"].map((label) => (
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
                <li><a href="/copilot" className="text-sm text-muted-foreground hover:text-primary transition-colors">CMMC Copilot</a></li>
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
