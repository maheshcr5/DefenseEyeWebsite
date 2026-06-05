import { useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight, MessageSquareText, ShieldCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import { CopilotChat } from "@/components/CopilotChat";

export default function Copilot() {
  useEffect(() => {
    const title = "DefenseEye CMMC Copilot | CMMC, NIST 800-171, DFARS, SPRS Help";
    const description =
      "Ask DefenseEye CMMC Copilot questions about CMMC Level 2, NIST SP 800-171, DFARS, SPRS, CUI scoping, FedRAMP, RMF, evidence, SSP, POA&M, CMMCLens automation, and assessment readiness.";
    const canonical = "https://defenseeye.ai/copilot";

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertCanonical(canonical);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-page-schema", "copilot");
    script.textContent = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "DefenseEye CMMC Copilot",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: canonical,
        provider: {
          "@type": "Organization",
          name: "DefenseEye",
          url: "https://defenseeye.ai",
        },
        description,
        featureList: [
          "CMMC Level 2 question answering",
          "NIST SP 800-171 control explanations",
          "DFARS and SPRS guidance",
          "CUI scoping support",
          "SSP, POA&M, and evidence readiness guidance",
          "KnowledgeHub retrieval and source citations",
          "CMMCLens automation recommendations when relevant",
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What can DefenseEye CMMC Copilot answer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "DefenseEye CMMC Copilot answers questions about CMMC Level 2, NIST SP 800-171, DFARS clauses, SPRS scoring, CUI scoping, FedRAMP, RMF, SSPs, POA&Ms, evidence collection, and C3PAO assessment readiness.",
            },
          },
          {
            "@type": "Question",
            name: "Does DefenseEye CMMC Copilot cite sources?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Copilot prioritizes DefenseEye KnowledgeHub content and authoritative compliance guidance, then returns source citations when retrieval results are available.",
            },
          },
          {
            "@type": "Question",
            name: "When does DefenseEye recommend CMMCLens?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "CMMCLens is recommended when a question involves CMMC automation, evidence collection, SSP and POA&M management, SPRS tracking, Microsoft cloud evidence, continuous monitoring, remediation tracking, or assessment readiness workflows that the platform can directly support.",
            },
          },
        ],
      },
    ]);
    document.head.appendChild(script);

    return () => {
      document.querySelector('script[data-page-schema="copilot"]')?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="container py-8 lg:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-primary">CMMC Copilot</span>
        </nav>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-primary">
              <ShieldCheck className="size-3.5" />
              DefenseEye KnowledgeHub RAG
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">
              CMMC Copilot for assessment-ready answers
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              Ask control, evidence, scoping, DFARS, SPRS, CUI, FedRAMP, and RMF questions. Responses prioritize
              DefenseEye KnowledgeHub content, cite available sources, and separate requirements from recommended
              practices and assessor expectations.
            </p>
          </div>

          <div className="border border-border/40 bg-card/50 p-4">
            <div className="mb-2 flex items-center gap-2 font-heading font-semibold">
              <MessageSquareText className="size-4 text-primary" />
              Built for CMMC Level 2 teams
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Use it to clarify evidence, prepare SSP and POA&M language, understand SPRS impacts, and reduce surprises
              before a C3PAO assessment.
            </p>
          </div>
        </section>

        <section className="h-[min(760px,calc(100vh-13rem))] min-h-[620px]">
          <CopilotChat />
        </section>
      </main>
    </div>
  );
}

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function upsertCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}
