// GA4 lead-measurement events. Every event goes through sendGa4Event, which:
// - sends nothing without current analytics consent (the cookie banner's "Accept All"),
// - sends nothing until the consent-gated loader in client/index.html has created gtag,
// - forwards only allowlisted, non-personal parameters (no names, emails, phone numbers,
//   companies, job titles, or message text).
//
// Key event (lead): form_submit, sent only after /api/contact confirms success.
// cta_click, form_start, and newsletter_fallback_click measure the funnel; they are not leads.

const CONSENT_KEY = "de_cookie_consent";
const CONSENT_VERSION = 2;
const GA4_ID_PATTERN = /^G-[A-Z0-9]{6,12}$/;

declare global {
  interface Window {
    __gaId?: string;
    gtag?: (...args: unknown[]) => void;
  }
}

export type Ga4EventName =
  | "cta_click"
  | "form_start"
  | "form_submit"
  | "newsletter_fallback_click"
  | "secure_ai_primary_cta_click"
  | "secure_ai_pilot_cta_click"
  | "secure_ai_form_start"
  | "secure_ai_form_submit_success"
  | "cmmclens_briefing_click"
  | "cmmclens_marketplace_click";

/** Coarse visitor intent, set only by CTAs and forms that are specific to that topic. */
export type LeadIntent = "secure_ai" | "ai_governance" | "cmmc" | "supplier" | "attacksense" | "microsoft" | "contact";

const ALLOWED_PARAMS = new Set([
  "cta_name",
  "cta_location",
  "page_path",
  "intent",
  "audience",
  "product",
  "form_name",
  "form_intent",
  "lead_source",
  "lead_medium",
  "lead_campaign",
  "event_category",
  "funnel_step",
]);

const EMAIL_LIKE = /[^\s@]+@[^\s@]+/;
const PHONE_LIKE = /\d[\d\s().-]{6,}\d/;
const MAX_VALUE_LENGTH = 100;

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CONSENT_KEY) || "{}") as {
      status?: string;
      version?: number;
      purposes?: { analytics?: boolean };
    };
    return parsed.status === "accepted" && parsed.version === CONSENT_VERSION && parsed.purposes?.analytics === true;
  } catch {
    return false;
  }
}

/** Keeps allowlisted keys with short, non-personal string, number, or boolean values. */
export function sanitizeGa4Params(params: Record<string, unknown>): Record<string, string | number | boolean> {
  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (!ALLOWED_PARAMS.has(key) || value === undefined || value === null || value === "") continue;
    if (typeof value === "number" || typeof value === "boolean") {
      clean[key] = value;
    } else if (typeof value === "string") {
      const text = value.trim().slice(0, MAX_VALUE_LENGTH);
      if (text && !EMAIL_LIKE.test(text) && !PHONE_LIKE.test(text)) clean[key] = text;
    }
  }
  return clean;
}

export function sendGa4Event(name: Ga4EventName, params: Record<string, unknown> = {}): boolean {
  if (!hasAnalyticsConsent()) return false;
  if (typeof window.gtag !== "function" || !window.__gaId || !GA4_ID_PATTERN.test(window.__gaId)) return false;
  window.gtag("event", name, { ...sanitizeGa4Params(params), send_to: window.__gaId });
  return true;
}

function currentPath() {
  return typeof window === "undefined" ? "" : window.location?.pathname ?? "";
}

export type CtaClick = {
  name: string;
  location: string;
  intent?: LeadIntent;
  audience?: string;
  product?: string;
};

export function trackCtaClick({ name, location, intent, audience, product }: CtaClick) {
  return sendGa4Event("cta_click", { cta_name: name, cta_location: location, page_path: currentPath(), intent, audience, product });
}

export type LeadFormName = "contact_page" | "secure_ai_adoption";

/** Fires form_start the first time a visitor edits a given form instance. */
export function trackFormStartOnce(startedRef: { current: boolean }, form: LeadFormName, formIntent?: string) {
  if (startedRef.current) return;
  startedRef.current = true;
  sendGa4Event("form_start", { form_name: form, form_intent: formIntent || "unspecified", page_path: currentPath() });
}

/** Campaign source for a lead, from the session's first-touch attribution (no identifiers). */
export function leadSourceFromAttribution(attribution: Record<string, string | undefined>) {
  if (attribution.utm_source) {
    return { lead_source: attribution.utm_source, lead_medium: attribution.utm_medium || "unspecified", lead_campaign: attribution.utm_campaign };
  }
  if (attribution.gclid) return { lead_source: "google", lead_medium: "cpc", lead_campaign: undefined };
  if (attribution.msclkid) return { lead_source: "bing", lead_medium: "cpc", lead_campaign: undefined };
  if (attribution.li_fat_id) return { lead_source: "linkedin", lead_medium: "paid_social", lead_campaign: undefined };
  if (attribution.referrer_domain) return { lead_source: attribution.referrer_domain, lead_medium: "referral", lead_campaign: undefined };
  return { lead_source: "direct", lead_medium: "none", lead_campaign: undefined };
}

/** Call only after the contact API has accepted the submission. */
export function trackLeadFormSubmit(form: LeadFormName, formIntent: string | undefined, attribution: Record<string, string | undefined>) {
  return sendGa4Event("form_submit", {
    form_name: form,
    form_intent: formIntent || "unspecified",
    page_path: currentPath(),
    ...leadSourceFromAttribution(attribution),
  });
}

/** The newsletter fallback opens the contact form; it never implies a subscription. */
export function trackNewsletterFallback(location: string) {
  return sendGa4Event("newsletter_fallback_click", { cta_name: "newsletter_fallback_contact", cta_location: location, page_path: currentPath() });
}

/** Maps one of the form's fixed Inquiry Type options to a form_intent value; anything else is "unspecified". */
export function formIntentFromInquiryType(inquiryType: string, options: readonly string[]): string {
  return options.includes(inquiryType)
    ? inquiryType.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")
    : "unspecified";
}
