import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowRight, Bot, CheckCircle2, ChevronDown, FileCheck, GitBranch, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import { useSeo } from "@/hooks/useSeo";
import { trackConversion } from "@/lib/tracking";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";
const MARKETPLACE_URL = "https://marketplace.microsoft.com/en-us/search?search=CMMCLens";

const FAQ_ITEMS = [
  {
    question: "What is CMMCLens?",
    answer:
      "CMMCLens is an AI-assisted cybersecurity and compliance automation platform from DefenseEye. It helps organizations collect evidence, map gaps, generate documentation, track readiness, and manage remediation workflows across cybersecurity and governance objectives. CMMC is a flagship use case, but the platform is positioned for broader compliance intelligence and evidence automation.",
  },
  {
    question: "Is CMMCLens only for CMMC?",
    answer:
      "No. CMMCLens supports CMMC readiness, but its core value is evidence automation, control traceability, continuous readiness monitoring, and documentation consistency. Those capabilities also support broader governance, risk, compliance, federal cybersecurity, and audit readiness programs.",
  },
  {
    question: "How does CMMCLens reduce manual evidence collection effort?",
    answer:
      "CMMCLens connects evidence sources, organizes artifacts, maps them to controls and readiness objectives, and keeps traceability available for review. It may reduce manual evidence collection effort depending on environment maturity, integrations, available source data, and scope.",
  },
  {
    question: "What Microsoft environments does CMMCLens support?",
    answer:
      "CMMCLens is designed for Microsoft-aligned security and compliance programs, including Azure Government, Azure GCC High patterns, Microsoft 365 and GCC High evidence sources, identity-aware integrations, and Managed Identity patterns where applicable.",
  },
  {
    question: "What outcomes does CMMCLens help improve?",
    answer:
      "CMMCLens helps organizations accelerate assessment readiness, reduce manual evidence collection effort, improve evidence traceability, increase documentation consistency, improve governance visibility, reduce compliance preparation effort, and support continuous cybersecurity readiness.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 bg-card/40 rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card/70 transition-colors duration-200"
        aria-expanded={open}
      >
        <span className="font-heading font-semibold text-foreground pr-4 text-sm md:text-base leading-snug">{question}</span>
        <ChevronDown className={`w-4 h-4 text-primary shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CMMCLens() {
  useSeo(
    "CMMCLens Compliance Automation Platform | DefenseEye",
    "CMMCLens is DefenseEye's flagship compliance automation platform for CMMC and NIST 800-171 readiness, evidence automation, control mapping, gap tracking, SSP and POA&M workflows, policy support, and readiness visibility."
  );

  useEffect(() => {
    const schema = [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "CMMCLens",
        description:
          "AI-assisted cybersecurity and compliance automation platform for automated evidence collection, automated gap assessments, continuous readiness monitoring, AI-generated SSPs, AI-generated policies and procedures, risk remediation workflows, evidence traceability, and assessment readiness acceleration.",
        brand: { "@type": "Brand", name: "DefenseEye" },
        applicationCategory: "Cybersecurity compliance automation",
        operatingSystem: "Web",
        offers: { "@type": "Offer", url: MARKETPLACE_URL },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: "CMMCLens", item: "https://defenseeye.ai/cmmclens" },
        ],
      },
    ];
    const id = "cmmclens-schema";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.text = JSON.stringify(schema);
    document.head.appendChild(s);
    return () => document.getElementById(id)?.remove();
  }, []);

  const capabilities = [
    ["Automated evidence collection", "Collect and organize evidence from connected systems with control-level traceability."],
    ["Automated gap assessments", "Identify missing or weak control evidence and prioritize remediation work."],
    ["Continuous readiness monitoring", "Track posture changes, documentation status, and control readiness over time."],
    ["AI-generated SSPs", "Produce structured System Security Plan content from approved control context and evidence."],
    ["AI-generated policies and procedures", "Create draft policy and procedure language that can be reviewed and governed."],
    ["Risk remediation workflows", "Move from findings to owners, actions, due dates, and readiness impact."],
    ["Evidence traceability", "Connect artifacts to control objectives, assessment needs, and governance decisions."],
    ["Assessment readiness acceleration", "Reduce preparation friction before CMMC, RMF, FedRAMP, or internal audit reviews."],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      <main className="px-4">
        <section className="max-w-6xl mx-auto pt-16 pb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Flagship Platform</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-5">
            CMMCLens Compliance Automation Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
            CMMCLens is DefenseEye's flagship compliance automation platform for CMMC and NIST 800-171 readiness. It supports evidence automation, control mapping, gap tracking, SSP/POA&M workflows, policy support, and readiness visibility.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("cmmclens_click", { location: "cmmclens_hero_briefing" })}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Request CMMCLens Briefing <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("cmmclens_click", { location: "cmmclens_marketplace" })}>
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                Microsoft Marketplace Listing
              </Button>
            </a>
          </div>
        </section>

        <section className="max-w-6xl mx-auto pb-14 grid md:grid-cols-4 gap-5">
          {[
            { icon: FileCheck, title: "Evidence Automation", text: "Reduce manual collection and organize artifacts for review." },
            { icon: GitBranch, title: "Traceability", text: "Map evidence to controls, risks, findings, and documentation." },
            { icon: Bot, title: "AI-Assisted Documentation", text: "Generate SSP, policy, procedure, and readiness content for review." },
            { icon: Activity, title: "Continuous Readiness", text: "Monitor changes and keep readiness visible over time." },
          ].map((f) => (
            <div key={f.title} className="bg-card/50 border border-border/40 p-6 rounded-sm">
              <f.icon className="w-5 h-5 text-primary mb-3" />
              <p className="font-heading font-semibold mb-1">{f.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </section>

        <section className="max-w-6xl mx-auto py-14 border-t border-border/30">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Platform Capabilities</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Built for outcomes, not checklist noise
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                CMMCLens supports outcomes buyers care about: faster assessment readiness, reduced evidence work, stronger traceability,
                improved documentation consistency, and clearer governance visibility.
              </p>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
              {capabilities.map(([title, text]) => (
                <div key={title} className="bg-card/40 border border-border/40 rounded-sm p-5">
                  <CheckCircle2 className="w-5 h-5 text-primary mb-3" />
                  <p className="font-heading font-semibold text-foreground mb-1">{title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-14 border-t border-border/30">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: ShieldCheck,
                title: "CMMC and NIST 800-171",
                text: "A flagship use case for defense contractors that need SSPs, POA&Ms, evidence traceability, and C3PAO readiness support.",
              },
              {
                icon: Zap,
                title: "Federal and enterprise GRC",
                text: "Reusable control evidence, remediation workflows, and continuous readiness patterns for regulated environments.",
              },
              {
                icon: Bot,
                title: "AI governance and security",
                text: "Support evidence-driven oversight for AI risk, responsible AI controls, Security Copilot readiness, and AI security reviews.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-primary/5 border border-primary/20 rounded-sm p-6">
                <item.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-14 border-t border-border/30">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Frequently Asked Questions</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              CMMCLens questions, answered directly
            </h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Plain-English answers for cybersecurity, compliance, Microsoft ecosystem, and federal readiness buyers.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>

          <div className="mt-12 bg-primary/5 border border-primary/20 rounded-sm p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">Review CMMCLens for your environment</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Discuss evidence sources, Microsoft integrations, readiness objectives, and the best path for a pilot or advisory engagement.
            </p>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("cmmclens_click", { location: "cmmclens_final_briefing" })}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8">
                Book a CMMCLens Briefing <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
