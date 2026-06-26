import { useEffect } from "react";
import { ArrowRight, Target } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { CALENDLY_URL, ENGAGEMENT_MODELS } from "@/data/companyFacts";
import { trackConversion } from "@/lib/tracking";

const phases = [
  ["Discover", "Understand business objectives, AI use cases, regulatory obligations, cloud environment, data sensitivity, and current operating model."],
  ["Assess", "Evaluate cybersecurity posture, AI governance gaps, compliance readiness, cloud risks, identity controls, and automation opportunities."],
  ["Prioritize", "Develop a risk-based roadmap based on business impact, security urgency, supplier/customer requirements, and implementation effort."],
  ["Implement", "Support governance processes, automation workflows, dashboards, security improvements, policies, documentation, and platform configuration."],
  ["Operationalize", "Enable ownership, reporting, training, continuous monitoring, readiness tracking, and leadership visibility."],
  ["Improve", "Measure outcomes, reduce manual effort, refine controls, and maintain readiness as requirements evolve."],
];

const formats = ["2-4 week readiness sprint", "30/60/90-day roadmap engagement", "Project-based implementation", "Advisory retainer", "Staff augmentation", "Subcontracting support", "CMMCLens-enabled automation engagement"];

export default function DeliveryModel() {
  useSeo(
    "Delivery Model | DefenseEye",
    "How DefenseEye works with enterprise, government, regulated, and supplier teams through discover, assess, prioritize, implement, operationalize, and improve phases."
  );

  useEffect(() => {
    const id = "delivery-model-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "DefenseEye delivery model",
        provider: { "@type": "Organization", name: "DefenseEye", url: "https://defenseeye.ai" },
        serviceType: formats,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How does DefenseEye structure engagements?",
            acceptedAnswer: { "@type": "Answer", text: "DefenseEye structures engagements through discover, assess, prioritize, implement, operationalize, and improve phases." },
          },
          {
            "@type": "Question",
            name: "What engagement formats does DefenseEye support?",
            acceptedAnswer: { "@type": "Answer", text: "DefenseEye supports readiness sprints, roadmap engagements, project-based implementation, advisory retainers, staff augmentation, subcontracting support, and CMMCLens-enabled automation engagements." },
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: "Delivery Model", item: "https://defenseeye.ai/delivery-model" },
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
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Delivery Model</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-5">DefenseEye Delivery Model</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            DefenseEye structures engagements so enterprise buyers can understand scope, deliverables, ownership, and operating outcomes before work begins.
          </p>
        </div>
      </section>
      <section className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {phases.map(([phase, body]) => (
            <div key={phase} className="bg-card/50 border border-border/40 rounded-sm p-6">
              <Target className="w-5 h-5 text-primary mb-4" />
              <h2 className="font-heading text-xl font-bold mb-3">{phase}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-16 px-4 section-gray">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl font-bold mb-6 text-center">Engagement Formats</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[...formats, ...ENGAGEMENT_MODELS].map((item) => (
              <span key={item} className="text-sm px-3 py-2 border border-border/50 bg-card/40 rounded-sm text-muted-foreground">{item}</span>
            ))}
          </div>
          <div className="text-center">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("consultation_click", { location: "delivery_model" })}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Discuss Delivery Fit <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
