import { useEffect } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { CALENDLY_URL, CAPABILITY_STATEMENT_URL } from "@/data/companyFacts";
import { trackConversion } from "@/lib/tracking";

const matrix = [
  ["Azure", "Cloud security, secure architecture, governance, compliance automation"],
  ["Azure Government", "Regulated and federal environment familiarity"],
  ["GCC High", "CMMC and controlled data environment readiness"],
  ["Microsoft 365", "Copilot readiness, information governance, identity, data protection"],
  ["Microsoft Copilot", "Governance, readiness, privacy, security, and adoption support"],
  ["Microsoft Entra", "Identity, access, Zero Trust, privileged access review"],
  ["Microsoft Defender", "Threat protection, endpoint/cloud security alignment"],
  ["Microsoft Sentinel", "Security monitoring and visibility"],
  ["Microsoft Purview", "Data governance, privacy, compliance, information protection"],
  ["Azure OpenAI", "Secure AI adoption, governance, and AI risk management"],
  ["Security Copilot", "AI-assisted security operations readiness"],
  ["Azure Marketplace", "CMMCLens marketplace presence"],
];

export default function MicrosoftEcosystem() {
  useSeo(
    "Microsoft Ecosystem Experience | DefenseEye AI Governance, Copilot, Azure Security, and Compliance",
    "DefenseEye supports Microsoft-centered environments through AI governance, Copilot readiness, Azure security, Microsoft cloud compliance, CMMC readiness, and compliance automation."
  );

  useEffect(() => {
    const id = "microsoft-ecosystem-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Microsoft ecosystem AI governance, cloud security, and compliance support",
        provider: { "@type": "Organization", name: "DefenseEye", url: "https://defenseeye.ai" },
        areaServed: "United States",
        serviceType: ["Microsoft Copilot readiness", "Azure security consulting", "Microsoft cloud compliance", "AI governance consulting"],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Does DefenseEye support Microsoft Copilot readiness?",
            acceptedAnswer: { "@type": "Answer", text: "Yes. DefenseEye supports Copilot readiness through governance, permissions, privacy, security, data protection, and adoption planning." },
          },
          {
            "@type": "Question",
            name: "Does DefenseEye claim Microsoft supplier approval?",
            acceptedAnswer: { "@type": "Answer", text: "No. DefenseEye describes Microsoft ecosystem experience and CMMCLens marketplace presence without claiming Microsoft supplier approval, endorsement, or partner level." },
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: "Microsoft Ecosystem", item: "https://defenseeye.ai/microsoft-ecosystem" },
        ],
      },
    ]);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <section className="pt-16 pb-14 px-4 section-navy">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Microsoft Ecosystem Experience</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-5">Microsoft Ecosystem Experience</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            DefenseEye is positioned for organizations operating in Microsoft-centered environments, including Azure, Microsoft 365, Microsoft Security, Copilot, Azure Government, and GCC High patterns.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("microsoft_ecosystem_view", { action: "discuss_support" })}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">Discuss Microsoft Ecosystem Support <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href={CAPABILITY_STATEMENT_URL}>
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">Request Capability Statement</Button>
            </a>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matrix.map(([area, relevance]) => (
            <div key={area} className="bg-card/50 border border-border/40 rounded-sm p-5">
              <ShieldCheck className="w-5 h-5 text-primary mb-3" />
              <h2 className="font-heading font-bold text-foreground mb-2">{area}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{relevance}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-14 px-4 section-gray">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold mb-4">Procurement-Safe Positioning</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            DefenseEye does not claim Microsoft supplier approval, preferred supplier status, or Microsoft endorsement unless separately verified.
          </p>
          <h2 className="font-heading text-2xl font-bold mb-4">Enterprise and Multi-Cloud AI Consulting</h2>
          <p className="text-muted-foreground leading-relaxed">
            DefenseEye's governance and security approach is cloud-aware and can support Microsoft-centered, Google-aligned, and multi-cloud enterprise AI programs. AI governance, responsible AI practices, AI risk assessments, vendor risk management, data governance, NIST AI RMF alignment, and secure generative AI adoption apply across enterprise cloud environments.
          </p>
        </div>
      </section>
    </div>
  );
}
