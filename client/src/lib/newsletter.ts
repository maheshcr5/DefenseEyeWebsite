import { trackConversion } from "@/lib/tracking";

/**
 * Newsletter subscription.
 *
 * No email-marketing provider is approved or configured for this site, so
 * NEWSLETTER_PROVIDER is null and the signup component shows a truthful
 * "updates by email are not available yet" state that routes visitors to the
 * contact form instead. A visitor is never told they are subscribed unless a
 * configured provider has accepted the address.
 *
 * To enable signups, implement NewsletterProvider against an approved provider
 * (typically via a server endpoint so no API key reaches the browser) and assign
 * it here. Email addresses must not be written to analytics, logs, or browser
 * storage.
 */
export type NewsletterProvider = {
  /** Short provider name, used only in analytics detail. */
  name: string;
  /** Resolves when the provider has accepted the address; rejects otherwise. */
  subscribe: (email: string) => Promise<void>;
};

export const NEWSLETTER_PROVIDER: NewsletterProvider | null = null;

export type NewsletterLocation = "blog" | "knowledge_hub";

export type NewsletterResult =
  | { status: "success"; message: string }
  | { status: "invalid"; message: string }
  | { status: "error"; message: string }
  | { status: "unavailable"; message: string }
  | { status: "duplicate"; message: string };

export const NEWSLETTER_MESSAGES = {
  empty: "Enter your work email address.",
  invalid: "Enter an email address in the format name@company.com.",
  success: "Thanks — you're subscribed. Check your inbox to confirm if the provider asks you to.",
  error: "We couldn't complete your subscription. Please try again, or contact us instead.",
  unavailable: "Email updates aren't available yet.",
  duplicate: "Your subscription is already being processed.",
} as const;

export function validateNewsletterEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return NEWSLETTER_MESSAGES.empty;
  if (!/^\S+@\S+\.\S+$/.test(value)) return NEWSLETTER_MESSAGES.invalid;
  return null;
}

export type NewsletterGuard = { inFlight: boolean; completed: boolean };

export function createNewsletterGuard(): NewsletterGuard {
  return { inFlight: false, completed: false };
}

/**
 * Validates, guards against duplicate submissions, and calls the provider.
 * Analytics events carry the page location and provider name only, never the address.
 */
export async function submitNewsletterSignup(
  email: string,
  provider: NewsletterProvider | null,
  guard: NewsletterGuard,
  location: NewsletterLocation
): Promise<NewsletterResult> {
  if (!provider) return { status: "unavailable", message: NEWSLETTER_MESSAGES.unavailable };

  const invalid = validateNewsletterEmail(email);
  if (invalid) return { status: "invalid", message: invalid };

  if (guard.inFlight || guard.completed) return { status: "duplicate", message: NEWSLETTER_MESSAGES.duplicate };
  guard.inFlight = true;
  try {
    await provider.subscribe(email.trim());
    guard.completed = true;
    trackConversion("newsletter_subscribe", { location, provider: provider.name });
    return { status: "success", message: NEWSLETTER_MESSAGES.success };
  } catch {
    trackConversion("newsletter_subscribe_failed", { location, provider: provider.name });
    return { status: "error", message: NEWSLETTER_MESSAGES.error };
  } finally {
    guard.inFlight = false;
  }
}
