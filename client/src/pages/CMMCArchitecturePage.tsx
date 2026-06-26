import { useLocation } from "wouter";
import { useEffect } from "react";
import { ArrowRight, FileCheck, ShieldCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { CALENDLY_URL } from "@/data/companyFacts";
import { trackConversion } from "@/lib/tracking";

const pages: Record<string, { title: string; desc: string; points: string[]; faqs: Array<[string, string]> }> = {
  "/cmmc": {
    title: "CMMC readiness, evidence automation, and advisory support",
    desc: "DefenseEye supports defense contractors with CMMC readiness planning, NIST SP 800-171 alignment, SSP and POA&M support, evidence automation, and CMMCLens-enabled readiness workflows.",
    points: ["CMMC Level 2 readiness consulting", "NIST SP 800-171 control alignment", "SSP and POA&M support", "Evidence automation and traceability", "CMMCLens platform fit assessment"],
    faqs: [["What is the practical path to CMMC readiness?", "Start with CUI scope, assess NIST SP 800-171 gaps, prioritize remediation, update SSP and POA&M materials, and organize evidence before assessment planning."]],
  },
  "/cmmc-level-2-readiness": {
    title: "CMMC Level 2 readiness consulting and automation",
    desc: "DefenseEye helps organizations prepare for CMMC Level 2 expectations through scope review, control gap analysis, readiness roadmap, evidence planning, and documentation support.",
    points: ["CUI boundary review", "110-control readiness assessment", "SPRS and remediation prioritization", "C3PAO assessment readiness planning", "Executive readiness summary"],
    faqs: [["How quickly can a readiness assessment start?", "Many readiness assessments can begin with a short discovery session, access to current documentation, and a focused review of scope, controls, evidence, and remediation priorities."]],
  },
  "/cmmc-readiness-sprint": {
    title: "CMMC readiness sprint for focused assessment preparation",
    desc: "A focused readiness sprint helps teams identify gaps, organize evidence, clarify SSP and POA&M needs, and create a practical action plan.",
    points: ["2-4 week readiness sprint format", "Gap assessment", "SSP and POA&M review", "Evidence plan", "Prioritized remediation roadmap"],
    faqs: [["What does a readiness sprint produce?", "A sprint typically produces findings, prioritized remediation actions, evidence planning, SSP/POA&M recommendations, and leadership-ready next steps."]],
  },
  "/cmmc-evidence-automation": {
    title: "CMMC evidence automation and compliance traceability",
    desc: "DefenseEye uses automation and CMMCLens to support evidence collection, control mapping, documentation workflows, dashboards, and continuous readiness monitoring.",
    points: ["Automated evidence collection", "Control mapping", "Evidence traceability", "Readiness dashboards", "SSP and POA&M workflow support"],
    faqs: [["Can CMMCLens reduce manual evidence work?", "CMMCLens may reduce manual evidence collection effort depending on environment maturity, integrations, source systems, and scope."]],
  },
  "/nist-800-171": {
    title: "NIST SP 800-171 readiness and compliance automation",
    desc: "DefenseEye supports NIST SP 800-171 alignment through control review, evidence planning, documentation support, remediation prioritization, and automation workflows.",
    points: ["NIST SP 800-171 control readiness", "SSP support", "POA&M support", "Evidence mapping", "SPRS score improvement planning"],
    faqs: [["How does NIST SP 800-171 relate to CMMC?", "CMMC Level 2 is based on the 110 security requirements in NIST SP 800-171 for organizations handling controlled unclassified information."]],
  },
};

export default function CMMCArchitecturePage() {
  const [location] = useLocation();
  const page = pages[location] ?? pages["/cmmc"];
  useSeo(`${page.title} | DefenseEye`, page.desc);

  useEffect(() => {
    const id = "cmmc-architecture-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: page.title,
        description: page.desc,
        provider: { "@type": "Organization", name: "DefenseEye", url: "https://defenseeye.ai" },
        serviceType: page.points,
        areaServed: { "@type": "Country", name: "United States" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: page.title, item: `https://defenseeye.ai${location}` },
        ],
      },
    ]);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, [location, page]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <section className="pt-16 pb-14 px-4 section-navy">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">CMMC / NIST SP 800-171</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-5">{page.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{page.desc}</p>
        </div>
      </section>
      <section className="py-16 px-4 section-light">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {page.points.map((point) => (
            <div key={point} className="bg-card/50 border border-border/40 rounded-sm p-5">
              <FileCheck className="w-5 h-5 text-primary mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-14 px-4 section-gray">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
          {page.faqs.map(([q, a]) => (
            <div key={q} className="bg-card/40 border border-border/40 rounded-sm p-5">
              <ShieldCheck className="w-5 h-5 text-primary mb-3" />
              <h2 className="font-heading font-bold mb-2">{q}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
          <div className="bg-card/40 border border-border/40 rounded-sm p-5">
            <h2 className="font-heading font-bold mb-2">CMMCLens fit</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">CMMCLens is DefenseEye's flagship compliance automation platform supporting CMMC and NIST SP 800-171 readiness through evidence automation, control mapping, readiness monitoring, SSP/POA&M support, policy generation, and remediation workflows.</p>
          </div>
        </div>
        <div className="text-center mt-10">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("consultation_click", { location })}>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">Assess Readiness <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </a>
        </div>
      </section>
    </div>
  );
}
