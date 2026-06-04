import { useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight, MessageSquareText, ShieldCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import { CopilotChat } from "@/components/CopilotChat";

export default function Copilot() {
  useEffect(() => {
    document.title = "DefenseEye CMMC Copilot | CMMC, NIST 800-171, DFARS, SPRS Help";
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      "Ask DefenseEye CMMC Copilot questions about CMMC Level 2, NIST SP 800-171, DFARS, SPRS, CUI scoping, FedRAMP, RMF, evidence, SSP, POA&M, and assessment readiness.";
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
