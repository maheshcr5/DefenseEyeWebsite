/*
 * NewsletterSignup — CMMC email updates block used on the Blog and Knowledge Hub.
 *
 * Without a configured provider (the current state; see lib/newsletter.ts) it shows
 * a truthful "not available yet" message and routes visitors to the contact form.
 * It never reports a subscription that a provider did not accept.
 */

import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NEWSLETTER_PROVIDER,
  createNewsletterGuard,
  submitNewsletterSignup,
  type NewsletterLocation,
  type NewsletterProvider,
  type NewsletterResult,
} from "@/lib/newsletter";
import { trackConversion } from "@/lib/tracking";

type NewsletterSignupProps = {
  location: NewsletterLocation;
  /** Heading shown when signups are available. */
  heading: string;
  /** Intro shown when signups are available. */
  intro: string;
  /** Link to related free resources, shown when signups are unavailable. */
  resourcesLink: { label: string; href: string };
  headingClassName?: string;
  introClassName?: string;
  provider?: NewsletterProvider | null;
  /** Initial result, for rendering a given state in tests. */
  initialResult?: NewsletterResult | null;
};

export const NEWSLETTER_UNAVAILABLE_HEADING = "Want to Hear From DefenseEye?";
export const NEWSLETTER_CONTACT_PATH = "/contact";
/** Neutral contact intent: maps to "General inquiry", not to any specific topic. */
export const NEWSLETTER_INQUIRY = "newsletter";

/**
 * Contact link for the fallback. Keeps every query parameter already on the page
 * (UTM tags, ad and campaign identifiers, referral codes) and only sets the
 * neutral inquiry value, so attribution survives the navigation.
 */
export function buildNewsletterContactHref(currentSearch = ""): string {
  const params = new URLSearchParams(currentSearch);
  params.set("inquiry", NEWSLETTER_INQUIRY);
  return `${NEWSLETTER_CONTACT_PATH}?${params.toString()}`;
}

/** Separate analytics event for the fallback; carries no personal data. */
export function trackNewsletterFallbackClick(location: NewsletterLocation) {
  trackConversion("newsletter_unavailable_cta_click", { location, intent: NEWSLETTER_INQUIRY });
}

export default function NewsletterSignup({
  location,
  heading,
  intro,
  resourcesLink,
  headingClassName = "font-heading text-2xl font-bold mb-2",
  introClassName = "text-muted-foreground text-sm mb-6",
  provider = NEWSLETTER_PROVIDER,
  initialResult = null,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<NewsletterResult | null>(initialResult);
  const guardRef = useRef(createNewsletterGuard());
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `${location}-newsletter-email`;
  const messageId = `${location}-newsletter-message`;

  if (!provider) {
    return (
      <div>
        <h2 className={headingClassName}>{NEWSLETTER_UNAVAILABLE_HEADING}</h2>
        <p className={introClassName}>
          Email updates aren't available yet. To ask a question or talk about your goals, contact our team, or keep reading our free guides.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={buildNewsletterContactHref()}
            onClick={(event) => {
              // Carry the current page's query parameters (campaign attribution) forward.
              event.currentTarget.href = buildNewsletterContactHref(window.location.search);
              trackNewsletterFallbackClick(location);
            }}
          >
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Contact Our Team <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
            </Button>
          </a>
          <a href={resourcesLink.href} className="text-sm font-semibold text-primary hover:underline">
            {resourcesLink.label}
          </a>
        </div>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    const next = await submitNewsletterSignup(email, provider, guardRef.current, location);
    setSubmitting(false);
    if (next.status === "duplicate") return;
    setResult(next);
    if (next.status === "invalid" || next.status === "error") inputRef.current?.focus();
  }

  const isError = result?.status === "invalid" || result?.status === "error";

  return (
    <div>
      <h2 className={headingClassName}>{heading}</h2>
      <p className={introClassName}>{intro}</p>
      {result?.status === "success" ? (
        <div role="status" className="flex items-center justify-center gap-2 text-primary font-medium">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          {result.message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <label htmlFor={inputId} className="sr-only">Work email address</label>
          <input
            ref={inputRef}
            id={inputId}
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={isError ? true : undefined}
            aria-describedby={isError ? messageId : undefined}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (isError) setResult(null);
            }}
            placeholder="your@company.com"
            className={`flex-1 bg-background border text-foreground text-sm px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50 ${
              isError ? "border-destructive" : "border-border/60"
            }`}
          />
          <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shrink-0">
            {submitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      )}
      {isError && (
        <p id={messageId} role="alert" className="text-sm text-destructive mt-2">
          {result.message}
        </p>
      )}
      {result?.status !== "success" && (
        <p className="text-muted-foreground/70 text-xs mt-4">
          By subscribing, you agree to receive email updates from DefenseEye. You can unsubscribe at any time. See our{" "}
          <a href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</a>.
        </p>
      )}
    </div>
  );
}
