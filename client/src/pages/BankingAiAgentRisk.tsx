import { Activity, ArrowRight, ExternalLink, Eye, KeyRound, Search, ShieldCheck, Timer, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import RelatedResources from "@/components/RelatedResources";
import { useSeo } from "@/hooks/useSeo";
import { trackCtaClick } from "@/lib/analytics";
import { getRouteMetadata } from "@shared/routeMetadata";
import { BANKING_AI_RISK_CONTENT as content, BANKING_AI_RISK_PATH, BANKING_DISCOVERY_HREF, DEFY_AI_RISK_URL } from "@shared/bankingAiRiskContent";

export type BankingCtaLocation = "banking_hero" | "banking_product" | "banking_offer";

/** One cta_click per CTA interaction; banking intent is set only by this page's CTAs. */
export function trackBankingCta(target: "discovery" | "platform", location: BankingCtaLocation) {
  trackCtaClick(
    target === "discovery"
      ? { name: "banking_ai_risk_discovery_call", location, intent: "banking" }
      : { name: "defyairisk_platform", location, intent: "banking", product: "defyairisk" }
  );
}

const PAIN_ICONS = [Eye, KeyRound, Users, Timer];
const CAPABILITY_ICONS = [Search, Activity, ShieldCheck, Wrench];

function DiscoveryCta({ location, className = "" }: { location: BankingCtaLocation; className?: string }) {
  return (
    <a href={BANKING_DISCOVERY_HREF} onClick={() => trackBankingCta("discovery", location)} className={className}>
      <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold sm:w-auto">
        {content.primaryCta} <ArrowRight className="ml-2 size-4" aria-hidden="true" />
      </Button>
    </a>
  );
}

function PlatformCta({ location }: { location: BankingCtaLocation }) {
  return (
    <a href={DEFY_AI_RISK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBankingCta("platform", location)}>
      <Button size="lg" variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/10 sm:w-auto">
        {content.secondaryCta} <ExternalLink className="ml-2 size-4" aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </Button>
    </a>
  );
}

export default function BankingAiAgentRisk() {
  const metadata = getRouteMetadata(BANKING_AI_RISK_PATH);
  useSeo(metadata?.title ?? content.h1, metadata?.description ?? content.intro);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="px-4">
        <section className="mx-auto max-w-6xl pt-16 pb-12" aria-labelledby="banking-ai-risk-heading">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide text-primary">{content.eyebrow}</span>
          </div>
          <h1 id="banking-ai-risk-heading" className="mb-5 max-w-4xl font-heading text-4xl font-bold leading-tight md:text-5xl">
            {content.h1}
          </h1>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">{content.intro}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <DiscoveryCta location="banking_hero" />
            <PlatformCta location="banking_hero" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl border-t border-border/30 py-14" aria-labelledby="banking-pain-heading">
          <h2 id="banking-pain-heading" className="mb-3 font-heading text-2xl font-bold text-foreground">{content.painHeading}</h2>
          <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">{content.painIntro}</p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {content.pains.map((pain, index) => {
              const Icon = PAIN_ICONS[index];
              return (
                <li key={pain.title} className="rounded-sm border border-border/40 bg-card/50 p-5">
                  <Icon className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">{pain.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{pain.text}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mx-auto max-w-6xl border-t border-border/30 py-14" aria-labelledby="banking-solution-heading">
          <h2 id="banking-solution-heading" className="mb-8 font-heading text-2xl font-bold text-foreground">{content.solutionHeading}</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.capabilities.map((capability, index) => {
              const Icon = CAPABILITY_ICONS[index];
              return (
                <li key={capability.title} className="rounded-sm border border-border/40 bg-card/50 p-5">
                  <Icon className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">{capability.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{capability.text}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mx-auto max-w-6xl border-t border-border/30 py-14" aria-labelledby="banking-product-heading">
          <div className="rounded-sm border border-primary/20 bg-primary/5 p-6 md:p-8">
            <h2 id="banking-product-heading" className="mb-3 font-heading text-2xl font-bold text-foreground">{content.productHeading}</h2>
            <p className="mb-6 max-w-3xl leading-relaxed text-foreground">{content.productText}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <PlatformCta location="banking_product" />
              <DiscoveryCta location="banking_product" />
            </div>
          </div>
        </section>

        <section className="section-navy -mx-4 px-4 py-16" aria-labelledby="banking-offer-heading">
          <div className="mx-auto max-w-4xl text-center">
            <h2 id="banking-offer-heading" className="font-heading text-3xl font-bold md:text-4xl">{content.offerHeading}</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">{content.offerText}</p>
            <DiscoveryCta location="banking_offer" className="mt-8 inline-block" />
          </div>
        </section>

        <RelatedResources className="mx-auto max-w-6xl py-14" />
      </main>
      <Footer />
    </div>
  );
}
