import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Bot, CheckCircle2, ClipboardCheck, Network, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import { useSeo } from "@/hooks/useSeo";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

const pages = {
  "/solutions/ai-governance": {
    eyebrow: "AI Governance & Responsible AI",
    title: "AI governance programs built for responsible adoption",
    description:
      "DefenseEye helps organizations create practical AI governance programs that define accountability, manage risk, guide responsible AI use, and support secure, explainable deployment.",
    seoTitle: "AI Governance and Responsible AI Services | DefenseEye",
    seoDescription:
      "AI governance services covering NIST AI RMF, responsible AI, AI risk management, policy development, AI controls, oversight, and human accountability.",
    icon: Bot,
    directAnswer:
      "AI governance gives organizations a repeatable way to approve, monitor, secure, and improve AI systems. It connects policies, risk decisions, controls, human accountability, and evidence so AI can be adopted responsibly.",
    executiveSummary:
      "DefenseEye helps organizations turn AI governance from policy language into an operating model: use-case intake, risk review, model oversight, security controls, policy evidence, and accountable human decision-making.",
    keyOutcomes: [
      "Defined decision rights for AI use cases, vendors, data, and model behavior",
      "NIST AI RMF-aligned controls that can be explained to leaders, auditors, and procurement teams",
      "Human accountability and oversight built into AI-assisted workflows",
      "Evidence that supports responsible AI, cybersecurity, privacy, and compliance expectations",
    ],
    whyItMatters:
      "AI programs fail when ownership, data access, model behavior, security review, and policy expectations are handled separately. Governance gives leaders a practical way to approve AI use, monitor risk, preserve explainability, and keep humans accountable for consequential decisions.",
    sections: [
      {
        heading: "Implementation focus",
        points: [
          "NIST AI RMF alignment and practical governance structure",
          "Responsible AI principles translated into operating controls",
          "AI risk management for use cases, vendors, data, and model behavior",
          "AI governance frameworks that fit enterprise and public sector oversight needs",
          "AI policy development for acceptable use, review, approval, and monitoring",
          "Model governance for lifecycle, data, output quality, and change oversight",
          "AI security review for prompts, permissions, integrations, and sensitive data exposure",
          "Human accountability for AI-assisted decisions and high-risk workflows",
        ],
      },
      {
        heading: "Key outcomes",
        points: [
          "Clearer decision rights for AI initiatives",
          "Reduced risk from unmanaged AI adoption",
          "Better explainability for leaders, auditors, and customers",
          "Stronger oversight of AI systems, data use, and outputs",
          "More consistent governance evidence for procurement and regulatory requests",
          "Responsible AI deployment without unnecessary process burden",
        ],
      },
    ],
    faqs: [
      {
        question: "What is AI governance?",
        answer:
          "AI governance is the set of roles, policies, controls, oversight processes, and evidence that help an organization use AI responsibly and manage AI-related risk.",
      },
      {
        question: "How does NIST AI RMF fit into AI governance?",
        answer:
          "NIST AI RMF provides a structured way to govern, map, measure, and manage AI risks. DefenseEye uses it as a practical reference for governance design, risk assessment, control development, and oversight.",
      },
      {
        question: "Who should be accountable for AI systems?",
        answer:
          "Accountability should include business owners, technology teams, security, privacy, legal, compliance, and executive oversight. Human accountability remains necessary for AI-assisted decisions.",
      },
    ],
    related: ["NIST AI RMF", "Responsible AI", "AI risk management", "AI policy development", "AI controls"],
  },
  "/solutions/ai-transformation": {
    eyebrow: "AI Transformation & Automation",
    title: "AI transformation that starts with practical business value",
    description:
      "DefenseEye helps organizations identify useful AI opportunities, prioritize use cases, create adoption roadmaps, automate business processes, and enable Microsoft Copilot responsibly.",
    seoTitle: "AI Transformation and Automation Services | DefenseEye",
    seoDescription:
      "AI transformation services covering opportunity identification, AI adoption roadmaps, business process automation, Microsoft Copilot enablement, use-case prioritization, and value realization.",
    icon: Sparkles,
    directAnswer:
      "AI transformation is the disciplined use of AI to improve business processes, decision support, employee productivity, and operational outcomes. It works best when adoption, governance, security, and value measurement are designed together.",
    executiveSummary:
      "DefenseEye helps teams identify practical AI opportunities, prioritize use cases, enable Microsoft Copilot responsibly, automate selected workflows, and measure whether AI adoption is improving operational performance.",
    keyOutcomes: [
      "Prioritized AI opportunities tied to business value, feasibility, risk, and data readiness",
      "Adoption roadmaps that connect implementation, governance, security, and ownership",
      "Microsoft Copilot enablement that addresses permissions, data exposure, and user workflows",
      "Automation plans focused on cycle time, manual effort, consistency, and decision visibility",
    ],
    whyItMatters:
      "AI adoption creates value when it improves real work. A practical transformation program identifies where AI can reduce friction, protects sensitive data, measures outcomes, and gives teams a path from experimentation to governed implementation.",
    sections: [
      {
        heading: "Implementation focus",
        points: [
          "AI opportunity identification across business, operations, security, compliance, and customer workflows",
          "AI adoption roadmaps with practical sequencing and ownership",
          "Business process automation for repetitive, evidence-heavy, and knowledge-work tasks",
          "Microsoft Copilot enablement with governance, permissions, and data readiness",
          "AI use-case prioritization based on value, risk, feasibility, and readiness",
          "AI value realization through measurable outcomes and operational adoption",
        ],
      },
      {
        heading: "Key outcomes",
        points: [
          "Faster movement from AI ideas to approved use cases",
          "Better alignment between AI investments and operational value",
          "Reduced risk from ungoverned AI experimentation",
          "Clearer automation opportunities in compliance and knowledge workflows",
          "Stronger readiness for Microsoft Copilot and enterprise AI platforms",
          "A repeatable model for responsible AI deployment",
        ],
      },
    ],
    faqs: [
      {
        question: "Where should an organization start with AI transformation?",
        answer:
          "Start by identifying business processes where AI can reduce manual effort, improve decisions, or increase consistency, then prioritize those use cases by value, risk, feasibility, and data readiness.",
      },
      {
        question: "How is Microsoft Copilot enablement different from a license rollout?",
        answer:
          "Copilot enablement includes permissions, data governance, security controls, use-case training, adoption planning, and oversight. Licenses alone do not create measurable value.",
      },
      {
        question: "How should AI value be measured?",
        answer:
          "AI value should be measured through operational outcomes such as cycle time reduction, improved documentation quality, lower manual effort, better decision visibility, and stronger governance evidence.",
      },
    ],
    related: ["AI transformation", "AI adoption roadmap", "Microsoft Copilot", "Business process automation", "AI value realization"],
  },
} as const;

export default function SolutionPage() {
  const [location] = useLocation();
  const page = pages[location as keyof typeof pages] ?? pages["/solutions/ai-governance"];
  const Icon = page.icon;

  useSeo(page.seoTitle, page.seoDescription);

  useEffect(() => {
    const schema = [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: page.eyebrow,
        provider: { "@type": "Organization", name: "DefenseEye", url: "https://defenseeye.ai" },
        description: page.seoDescription,
        areaServed: { "@type": "Country", name: "United States" },
        about: page.related.map((name) => ({ "@type": "Thing", name })),
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
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
          {
            "@type": "ListItem",
            position: 2,
            name: page.eyebrow,
            item: `https://defenseeye.ai${location}`,
          },
        ],
      },
    ];
    const id = "solution-page-schema";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.text = JSON.stringify(schema);
    document.head.appendChild(s);
    return () => document.getElementById(id)?.remove();
  }, [page]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="px-4">
        <section className="max-w-6xl mx-auto pt-16 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-5">
            <Icon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">{page.eyebrow}</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-5 max-w-4xl">{page.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">{page.description}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Schedule Consultation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="/#services">
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                Explore Solutions
              </Button>
            </a>
          </div>
        </section>

        <section className="max-w-6xl mx-auto pb-14">
          <div className="bg-primary/5 border border-primary/20 rounded-sm p-6">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Executive Summary</p>
            <p className="text-foreground leading-relaxed max-w-4xl mb-4">{page.executiveSummary}</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">{page.directAnswer}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto pb-14">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <Target className="w-6 h-6 text-primary mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Why It Matters</h2>
              <p className="text-muted-foreground leading-relaxed">{page.whyItMatters}</p>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {page.keyOutcomes.map((outcome) => (
                <div key={outcome} className="bg-card/50 border border-border/40 rounded-sm p-4">
                  <CheckCircle2 className="w-5 h-5 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-14 border-t border-border/30">
          <div className="grid lg:grid-cols-2 gap-8">
            {page.sections.map((section, index) => {
              const SectionIcon = index === 0 ? ClipboardCheck : Target;
              return (
                <div key={section.heading}>
                  <SectionIcon className="w-6 h-6 text-primary mb-4" />
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-5">{section.heading}</h2>
                  <div className="space-y-3">
                    {section.points.map((point) => (
                      <div key={point} className="flex items-start gap-3 bg-card/50 border border-border/40 rounded-sm p-4">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-14 border-t border-border/30">
          <div className="mb-8">
            <Network className="w-6 h-6 text-primary mb-4" />
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Frequently asked questions</h2>
            <p className="text-muted-foreground leading-relaxed">
              Short answers for buyers, program owners, and governance teams evaluating how to move forward.
            </p>
          </div>
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="bg-card/40 border border-border/40 rounded-sm p-5">
                <h3 className="font-heading font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto py-14 border-t border-border/30">
          <div className="bg-card/50 border border-border/40 rounded-sm p-6 flex flex-col md:flex-row md:items-center gap-5">
            <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
            <div className="flex-1">
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">Build with governance from the start</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DefenseEye helps teams connect AI adoption, security, compliance evidence, and operational ownership so programs can scale with less risk.
              </p>
            </div>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Schedule Consultation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
