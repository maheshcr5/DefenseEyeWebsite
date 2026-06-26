import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { CALENDLY_URL, CAPABILITY_STATEMENT_URL, CERTIFICATIONS } from "@/data/companyFacts";
import { trackConversion } from "@/lib/tracking";

type LandingConfig = {
  title: string;
  desc: string;
  pains: string[];
  helps: string[];
  outcomes: string[];
  engagement: string;
  cta: string;
};

const configs: Record<string, LandingConfig> = {
  "/lp/ai-governance-consulting": {
    title: "AI governance consulting for regulated organizations",
    desc: "Practical support for NIST AI RMF, ISO 42001 readiness, responsible AI, human accountability, policy, oversight, and AI risk management.",
    pains: ["AI use is expanding without clear ownership", "Policies do not match real workflows", "Procurement and assurance teams need explainable controls"],
    helps: ["AI inventory and use-case intake", "Governance model and policy development", "Risk assessment and oversight workflow"],
    outcomes: ["Clearer accountability", "Reduced shadow AI risk", "Better readiness for procurement and assurance reviews"],
    engagement: "Representative engagement: AI governance readiness assessment with a governance roadmap and policy/control recommendations.",
    cta: "Discuss AI Governance Readiness",
  },
  "/lp/microsoft-copilot-readiness": {
    title: "Microsoft Copilot readiness assessment",
    desc: "Prepare Microsoft 365, identity, data governance, privacy, and security controls before broad Copilot adoption.",
    pains: ["Overshared files can surface through Copilot", "Permissions and ownership may be unclear", "Security and privacy teams need rollout guardrails"],
    helps: ["Microsoft 365 and Entra readiness review", "Purview and data governance alignment", "Copilot adoption controls and roadmap"],
    outcomes: ["Lower data exposure risk", "More accountable adoption", "Clearer implementation priorities"],
    engagement: "Representative engagement: Copilot governance assessment with data exposure findings, guardrails, and readiness roadmap.",
    cta: "Assess Copilot Readiness",
  },
  "/lp/cmmc-level-2-readiness": {
    title: "CMMC Level 2 readiness consulting",
    desc: "Focused support for CUI scope, NIST SP 800-171 gaps, SSP, POA&M, evidence planning, SPRS, and assessment readiness.",
    pains: ["Evidence is scattered", "SSP and POA&M materials are incomplete", "Teams need readiness clarity before assessment planning"],
    helps: ["Control gap review", "Evidence and documentation plan", "Prioritized remediation roadmap"],
    outcomes: ["Improved readiness visibility", "Reduced assessment friction", "Clearer executive next steps"],
    engagement: "Representative engagement: CMMC Level 2 readiness sprint with findings, roadmap, evidence plan, and executive summary.",
    cta: "Assess CMMC Readiness",
  },
  "/lp/cmmc-evidence-automation": {
    title: "CMMC evidence automation with CMMCLens",
    desc: "Reduce manual evidence collection and improve traceability through CMMCLens and compliance workflow automation.",
    pains: ["Evidence collection is manual", "Control mapping is inconsistent", "Readiness reporting is hard to maintain"],
    helps: ["Evidence source mapping", "Workflow automation design", "CMMCLens fit assessment"],
    outcomes: ["Reduced manual effort", "Improved traceability", "More consistent documentation"],
    engagement: "Representative engagement: compliance evidence automation implementation with dashboards and control mapping.",
    cta: "Explore Evidence Automation",
  },
  "/lp/microsoft-supplier-ai-consulting": {
    title: "Minority-owned AI governance and cybersecurity supplier for Microsoft-centered environments",
    desc: "Supplier-ready AI, cybersecurity, cloud security, Microsoft Copilot, and compliance automation support for enterprise procurement and subcontracting teams.",
    pains: ["Supplier teams need specialized AI/cyber capability", "Programs need minority-owned subcontracting options", "Microsoft-centered environments require credible domain expertise"],
    helps: ["Supplier onboarding support", "Advisory and staff augmentation models", "Microsoft cloud and compliance capability"],
    outcomes: ["Easier procurement evaluation", "Specialized delivery capacity", "Clear supplier identifiers and credentials"],
    engagement: "Representative engagement: supplier capability review for AI governance, cybersecurity, cloud security, or compliance automation support.",
    cta: "Discuss Supplier Opportunities",
  },
  "/lp/azure-cloud-security": {
    title: "Azure cloud security and compliance review",
    desc: "Support for Azure, Azure Government, GCC High patterns, Entra, Defender, Sentinel, Purview, secure architecture, and compliance alignment.",
    pains: ["Cloud controls are fragmented", "Identity and monitoring need review", "Regulated environments require stronger evidence and governance"],
    helps: ["Azure posture review", "Identity and monitoring recommendations", "Security and compliance roadmap"],
    outcomes: ["Stronger cloud security", "Clearer remediation priorities", "Better compliance readiness"],
    engagement: "Representative engagement: Azure security and compliance review with risk-ranked findings and roadmap.",
    cta: "Review Azure Security",
  },
  "/lp/iso-42001-readiness": {
    title: "ISO 42001 readiness consulting",
    desc: "Prepare AI management practices with inventory, policy, oversight, risk review, human accountability, and lifecycle controls.",
    pains: ["AI governance is informal", "Evidence is not organized", "Teams need a practical operating model"],
    helps: ["AI management system readiness review", "Policy and oversight design", "Evidence and control roadmap"],
    outcomes: ["Clearer ISO 42001 readiness", "Stronger accountability", "Improved AI governance evidence"],
    engagement: "Representative engagement: ISO 42001 readiness assessment aligned to AI governance implementation needs.",
    cta: "Discuss ISO 42001 Readiness",
  },
  "/lp/compliance-automation": {
    title: "Compliance automation for evidence, workflows, and readiness reporting",
    desc: "Help compliance teams reduce manual effort through evidence automation, control mapping, documentation support, and readiness dashboards.",
    pains: ["Manual evidence work consumes staff time", "Documentation lacks consistency", "Leaders need better readiness visibility"],
    helps: ["Control and evidence mapping", "Workflow automation planning", "Dashboard and reporting design"],
    outcomes: ["Reduced compliance preparation effort", "Improved evidence traceability", "Stronger audit readiness"],
    engagement: "Representative engagement: compliance automation roadmap with workflow design and CMMCLens fit assessment.",
    cta: "Discuss Compliance Automation",
  },
};

export default function LandingPage() {
  const [location] = useLocation();
  const config = configs[location] ?? configs["/lp/ai-governance-consulting"];
  useSeo(`${config.title} | DefenseEye`, config.desc);

  useEffect(() => {
    if (location.includes("ai-governance")) trackConversion("ai_governance_landing_page_visit", { location });
    if (location.includes("microsoft-supplier")) trackConversion("microsoft_supplier_page_visit", { location });
    if (location.includes("cmmc")) trackConversion("cmmc_readiness_page_visit", { location });
    const id = "landing-page-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: config.title,
        description: config.desc,
        provider: { "@type": "Organization", name: "DefenseEye", url: "https://defenseeye.ai" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How can DefenseEye help?",
            acceptedAnswer: { "@type": "Answer", text: config.helps.join(" ") },
          },
          {
            "@type": "Question",
            name: "What outcome should buyers expect?",
            acceptedAnswer: { "@type": "Answer", text: config.outcomes.join(" ") },
          },
        ],
      },
    ]);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <section className="pt-16 pb-14 px-4 section-navy">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">DefenseEye</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-5">{config.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{config.desc}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("landing_page_cta_click", { location, cta: config.cta })}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">{config.cta} <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href={CAPABILITY_STATEMENT_URL} onClick={() => trackConversion("landing_page_cta_click", { location, cta: "capability_statement" })}>
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">Request Capability Statement</Button>
            </a>
          </div>
        </div>
      </section>
      <LandingSection title="Common Pain Points" items={config.pains} />
      <LandingSection title="How DefenseEye Helps" items={config.helps} gray />
      <LandingSection title="Outcomes" items={config.outcomes} />
      <section className="py-14 px-4 section-gray">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="bg-card/50 border border-border/40 rounded-sm p-6">
            <h2 className="font-heading text-xl font-bold mb-3">Representative Engagement</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{config.engagement}</p>
          </div>
          <div className="bg-card/50 border border-border/40 rounded-sm p-6">
            <h2 className="font-heading text-xl font-bold mb-3">Relevant Credentials</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{CERTIFICATIONS.slice(0, 5).join(" · ")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function LandingSection({ title, items, gray = false }: { title: string; items: string[]; gray?: boolean }) {
  return (
    <section className={`py-14 px-4 ${gray ? "section-gray" : "section-light"}`}>
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-2xl font-bold mb-6">{title}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item} className="bg-card/50 border border-border/40 rounded-sm p-5">
              <CheckCircle2 className="w-5 h-5 text-primary mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
