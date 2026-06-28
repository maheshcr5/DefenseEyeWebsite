import { useEffect } from "react";
import { ArrowRight, Bot, CheckCircle2, ShieldCheck, Sparkles, UserCheck, Lock, AlertTriangle, Cpu, HelpCircle } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CALENDLY_URL, COMPANY } from "@/data/companyFacts";
import { useSeo } from "@/hooks/useSeo";
import { trackConversion } from "@/lib/tracking";

export default function SecureAiAdoption() {
  useSeo(
    "Secure AI Adoption Consulting | DefenseEye AI Governance & Copilot Readiness",
    "DefenseEye helps regulated organizations operationalize secure AI adoption through AI governance, Microsoft Copilot readiness, NIST AI RMF alignment, and AI risk management."
  );

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
        name: "Secure & Responsible AI Adoption Consulting",
        description: "Practitioner-led AI governance, Microsoft Copilot readiness, NIST AI RMF alignment, and AI security oversight.",
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      {/* Hero Section */}
      <section className="section-navy nvidia-grid-bg px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Bot className="size-4" /> Secure AI Adoption Consulting
          </div>
          <h1 className="font-heading text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl text-foreground">
            Secure & Responsible AI Adoption Consulting
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            DefenseEye helps regulated enterprises move from AI experimentation to governed adoption by establishing clear policies, security guardrails, identity controls, human accountability, and implementation roadmaps.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("consultation_click", { location: "ai_consulting_hero" })}>
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                Discuss Secure AI Adoption <ArrowRight className="ml-2 size-4" />
              </Button>
            </a>
            <a href={`mailto:${COMPANY.enterpriseEmail}`} onClick={() => trackConversion("enterprise_email_click", { location: "ai_consulting_hero" })}>
              <Button size="lg" variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/10 sm:w-auto">
                Contact AI Practice ({COMPANY.enterpriseEmail})
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Audience Alignment</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">Who This Is For</h2>
            <p className="mt-3 text-muted-foreground">Designed for leadership teams driving enterprise AI initiatives in regulated environments.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Microsoft Copilot Adopters", "Organizations expanding M365 Copilot or GitHub Copilot requiring identity, data sensitivity, and permission controls."],
              ["Azure OpenAI & LLM Builders", "Engineering and product teams building generative AI workflows on Azure OpenAI, enterprise LLMs, or custom agents."],
              ["CIO, CISO & Privacy Officers", "Governance leaders establishing AI risk registers, human oversight policies, explainability standards, and third-party AI risk controls."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-sm border border-border/60 bg-card p-6">
                <UserCheck className="mb-3 size-6 text-primary" />
                <h3 className="font-heading text-xl font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="section-gray px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Risk Mitigation</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">Problems We Solve</h2>
            <p className="mt-3 text-muted-foreground">Prevent unmonitored AI rollout risks before they impact security, privacy, or compliance postures.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Shadow AI Workflows", "Unapproved employee usage of public LLMs leading to IP and sensitive data disclosure."],
              ["Over-Permissioned Copilot", "Copilot indexing sensitive financial, HR, or legal data due to weak Microsoft 365 permissions."],
              ["Third-Party Vendor AI Risk", "Unvetted AI features embedded in enterprise SaaS vendors without security evaluation."],
              ["Lack of AI Accountability", "Missing human oversight models and unclear organizational ownership for AI outcomes."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-sm border border-border/50 bg-card p-5">
                <AlertTriangle className="mb-3 size-5 text-accent" />
                <h3 className="font-heading text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How DefenseEye Helps & Deliverables */}
      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Capability Areas</p>
            <h2 className="font-heading text-3xl font-bold mb-6">How DefenseEye Helps</h2>
            <ul className="space-y-4">
              {[
                "AI governance readiness assessment and executive briefing",
                "NIST AI RMF alignment and risk framework mapping",
                "Responsible AI policy drafting and governance charter creation",
                "Microsoft Copilot data, identity, and security readiness review",
                "Azure OpenAI threat modeling and enterprise agent guardrails",
                "AI vendor/model risk evaluation and intake intake governance workflows",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border border-border/60 bg-muted/30 p-8">
            <h3 className="font-heading text-2xl font-bold mb-4">Representative Deliverables</h3>
            <ul className="space-y-3">
              {[
                "Enterprise AI Governance Charter",
                "NIST AI RMF Alignment Roadmap",
                "Responsible AI Operating Policy",
                "Copilot Security & Permission Audit Report",
                "AI Risk Register & Intake Workflow",
                "Human Accountability & Oversight Framework",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-medium">
                  <Sparkles className="size-4 text-accent shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Microsoft Copilot & Azure AI Focus */}
      <section className="section-navy px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Microsoft Ecosystem Specialization</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">Microsoft Copilot & Azure AI Readiness</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We leverage deep Microsoft cloud security experience across Entra, Purview, Defender, and Sentinel to prepare your environment before deploying enterprise copilots.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-sm border border-primary/20 bg-card/60 p-6">
              <Lock className="mb-4 size-6 text-primary" />
              <h3 className="font-heading text-xl font-bold mb-2">Data Protection & Purview</h3>
              <p className="text-sm text-muted-foreground">Audit sensitive data labels, DLP policies, and access controls so Copilot strictly honors organizational boundaries.</p>
            </div>
            <div className="rounded-sm border border-primary/20 bg-card/60 p-6">
              <Cpu className="mb-4 size-6 text-primary" />
              <h3 className="font-heading text-xl font-bold mb-2">Azure OpenAI Guardrails</h3>
              <p className="text-sm text-muted-foreground">Implement enterprise content filtering, private endpoints, managed identities, and secure API architecture for LLM apps.</p>
            </div>
            <div className="rounded-sm border border-primary/20 bg-card/60 p-6">
              <ShieldCheck className="mb-4 size-6 text-primary" />
              <h3 className="font-heading text-xl font-bold mb-2">AI Identity & Access</h3>
              <p className="text-sm text-muted-foreground">Configure Microsoft Entra conditional access, privileged identity management, and service principal governance for AI agents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              ["How does AI governance differ from traditional IT governance?", "AI governance specifically addresses non-deterministic model behavior, training data privacy, intellectual property risk, model drift, human accountability, and explainability."],
              ["What is the timeline for an AI governance readiness assessment?", "Typically 2 to 4 weeks depending on organizational complexity, active AI use cases, and cloud infrastructure maturity."],
              ["Does DefenseEye sell AI software or consulting?", "This practice provides practitioner-led advisory consulting, threat modeling, policy creation, and implementation guidance."],
            ].map(([q, a]) => (
              <div key={q} className="rounded-sm border border-border/50 bg-card p-5">
                <h3 className="font-heading text-lg font-bold flex items-center gap-2 mb-2">
                  <HelpCircle className="size-5 text-primary shrink-0" /> {q}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-7">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-navy px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-4xl font-bold">Accelerate AI Adoption With Confidence</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Schedule an executive discussion to align your business goals with secure AI governance controls.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("consultation_click", { location: "ai_consulting_footer" })}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Discuss Secure AI Adoption <ArrowRight className="ml-2 size-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
