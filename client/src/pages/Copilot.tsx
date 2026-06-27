import { useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight, MessageSquareText, ShieldCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import { CopilotChat } from "@/components/CopilotChat";

export default function Copilot() {
  useEffect(() => {
    const title = "DefenseEye Advisor | AI Governance, Cybersecurity, Cloud Security, and Compliance Guidance";
    const description =
      "Ask DefenseEye Advisor practical questions about secure AI adoption, AI governance, Microsoft Copilot readiness, Azure security, CMMC, NIST SP 800-171, compliance automation, and supplier readiness.";
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
        name: "DefenseEye Advisor",
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
          "Secure AI adoption guidance",
          "AI governance and NIST AI RMF guidance",
          "Microsoft Copilot readiness support",
          "Azure and Microsoft cloud security guidance",
          "CMMC and NIST SP 800-171 readiness guidance",
          "Compliance evidence automation guidance",
          "Supplier readiness orientation",
          "KnowledgeHub retrieval and source citations",
          "CMMCLens recommendations when compliance automation is relevant",
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
          <span className="text-primary">DefenseEye Advisor</span>
        </nav>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-primary">
              <ShieldCheck className="size-3.5" />
              DefenseEye Advisor
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Practical guidance for secure AI, cybersecurity, and compliance readiness
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              Ask about secure AI adoption, AI governance, Microsoft Copilot readiness, Azure security, CMMC,
              NIST SP 800-171, evidence automation, supplier readiness, FedRAMP, and RMF. Responses prioritize
              practical guidance, cite available sources, and separate requirements from recommendations.
            </p>
          </div>

          <div className="border border-border/40 bg-card/50 p-4">
            <div className="mb-2 flex items-center gap-2 font-heading font-semibold">
              <MessageSquareText className="size-4 text-primary" />
              Built for regulated AI and cybersecurity teams
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Use it to clarify risk, governance, security, evidence, and readiness questions before scoping a
              supplier, advisory, implementation, or compliance automation engagement.
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
