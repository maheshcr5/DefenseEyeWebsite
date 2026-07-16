import { useEffect } from "react";
import { Activity, ArrowRight, CheckCircle2, FileText, Radar, ShieldAlert, Workflow, Zap } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CALENDLY_URL, COMPANY } from "@/data/companyFacts";
import { useSeo } from "@/hooks/useSeo";
import { trackConversion } from "@/lib/tracking";

export default function AttackSense() {
  useSeo(
    "AttackSense | DefenseEye Attack Surface and Remediation Intelligence",
    "AttackSense helps teams turn attack surface findings, vulnerability signals, and remediation work into prioritized operational intelligence."
  );

  useEffect(() => {
    const id = "attacksense-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "AttackSense",
        brand: { "@type": "Brand", name: "DefenseEye" },
        applicationCategory: "Cybersecurity operations",
        operatingSystem: "Web",
        description:
          "AttackSense helps security teams consolidate attack surface findings, vulnerability signals, remediation ownership, and executive-ready risk visibility.",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: "AttackSense", item: "https://defenseeye.ai/attacksense" },
        ],
      },
    ]);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, []);

  const capabilities = [
    ["Signal consolidation", "Bring scanner, cloud, endpoint, and analyst findings into one risk-informed operating view."],
    ["Prioritized remediation", "Convert noisy issue lists into action plans based on exploitability, exposure, owner, and business impact."],
    ["Attack path awareness", "Track how identity, cloud, endpoint, and application weaknesses combine into realistic attack opportunities."],
    ["Executive visibility", "Give leaders concise posture, trend, and remediation status without burying them in raw findings."],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      <section className="section-navy nvidia-grid-bg px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Radar className="size-4" /> AttackSense
          </div>
          <h1 className="font-heading text-5xl font-bold leading-tight text-foreground sm:text-6xl lg:text-7xl">
            Attack Surface Intelligence for Actionable Remediation
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            AttackSense helps security teams move beyond static vulnerability lists by turning exposure data, attack paths, and remediation ownership into a focused operating picture for reducing real risk.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("consultation_click", { location: "attacksense_hero" })}>
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                Discuss AttackSense <ArrowRight className="ml-2 size-4" />
              </Button>
            </a>
            <a href="/attacksense/docs" onClick={() => trackConversion("attacksense_docs_click", { location: "attacksense_hero" })}>
              <Button size="lg" variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/10 sm:w-auto">
                View Quick Start Guide
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Value Add</p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">From Findings to Defensible Action</h2>
            <p className="mt-3 text-muted-foreground">
              AttackSense is designed for teams that already have security data but need sharper prioritization, clearer ownership, and a reliable way to explain remediation progress.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(([title, desc]) => (
              <div key={title} className="rounded-sm border border-border/60 bg-card p-6">
                <ShieldAlert className="mb-3 size-6 text-primary" />
                <h3 className="font-heading mb-2 text-xl font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gray px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Operational Outcomes</p>
            <h2 className="font-heading mb-6 text-3xl font-bold">What AttackSense Helps Improve</h2>
            <ul className="space-y-4">
              {[
                "Reduce alert fatigue by filtering exposure signals into risk-ranked work.",
                "Align security, IT, cloud, and application owners around remediation accountability.",
                "Identify weak links across identity, endpoint, cloud, and application surfaces.",
                "Track remediation progress in a way leadership and customers can understand.",
                "Support audit, supplier, and governance conversations with clearer evidence of risk reduction.",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border border-border/60 bg-card p-8">
            <Activity className="mb-4 size-7 text-primary" />
            <h3 className="font-heading mb-4 text-2xl font-bold">Built for Repeatable Security Operations</h3>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              AttackSense gives teams a structured path from intake to triage, prioritization, action, and reporting. The result is less time debating raw findings and more time closing the exposures that matter.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Radar, label: "Exposure Intake" },
                { icon: Zap, label: "Risk Prioritization" },
                { icon: Workflow, label: "Owner Workflows" },
                { icon: FileText, label: "Guide-Driven Adoption" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 rounded-sm border border-border/40 bg-muted/30 px-3 py-2 text-sm font-medium">
                  <item.icon className="size-4 text-accent" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-navy px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-4xl font-bold">Start With the Quick Start Guide</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Review the AttackSense setup path, then contact DefenseEye to align the workflow with your environment and remediation operating model.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a href="/attacksense/docs" onClick={() => trackConversion("attacksense_docs_click", { location: "attacksense_footer" })}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Open Docs <ArrowRight className="ml-2 size-4" />
              </Button>
            </a>
            <a href={`mailto:${COMPANY.enterpriseEmail}?subject=AttackSense%20Inquiry`} onClick={() => trackConversion("enterprise_email_click", { location: "attacksense_footer" })}>
              <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                Contact DefenseEye
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
