import { trackCtaClick, trackNewsletterFallback, type LeadIntent } from "@/lib/analytics";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "msclkid",
  "li_fat_id",
  "campaign_id",
  "ad_group_id",
  "ad_id",
  "ad_account_id",
  "openai_campaign_id",
  "openai_ad_group_id",
  "oppref",
];

export type ConversionName =
  | "home_path_click"
  | "newsletter_subscribe"
  | "newsletter_subscribe_failed"
  | "newsletter_unavailable_cta_click"
  | "capability_statement_download"
  | "capability_statement_view"
  | "supplier_readiness_view"
  | "contact_form_submit"
  | "consultation_click"
  | "cmmclens_click"
  | "cmmclens_demo_click"
  | "cmmclens_product_sheet_view"
  | "datasheet_view"
  | "datasheet_download"
  | "portfolio_ai_click"
  | "portfolio_cmmc_click"
  | "supplier_datasheet_view"
  | "supplier_inquiry_click"
  | "advisor_opened"
  | "advisor_topic_selected"
  | "landing_page_cta_click"
  | "email_click"
  | "phone_click"
  | "microsoft_ecosystem_view"
  | "cmmc_readiness_view"
  | "ai_governance_view"
  | "attacksense_view"
  | "attacksense_click"
  | "supplier_readiness_click"
  | "attacksense_docs_view"
  | "attacksense_docs_click"
  | "attacksense_guide_open"
  | "attacksense_guide_download"
  | "support_email_click"
  | "partners_email_click"
  | "enterprise_email_click";

function isSameSiteReferrer(referrer: string) {
  if (!referrer || !window.location.hostname) return false;
  try {
    const host = (value: string) => value.replace(/^www\./, "");
    return host(new URL(referrer).hostname) === host(window.location.hostname);
  } catch {
    return false;
  }
}

export function captureUtmParameters() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const captured: Record<string, string> = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) captured[key] = value;
  }

  // A full page load from another page on this site (for example following a plain
  // link to /contact) keeps the session's landing page and external referrer.
  // Campaign values on the new URL are merged in. A direct load with no referrer and
  // no campaign values (typed URL, bookmark, reload) also keeps the record, as GA4
  // does for direct traffic. Only an arrival from another site, a new campaign link,
  // or a first visit starts a fresh record.
  const referrer = document.referrer;
  const stored = sessionStorage.getItem("defenseeye_utm");
  const directWithoutCampaign = !referrer && Object.keys(captured).length === 0;
  if (stored && (isSameSiteReferrer(referrer) || directWithoutCampaign)) {
    if (Object.keys(captured).length === 0) return;
    let previous: Record<string, string> = {};
    try {
      previous = JSON.parse(stored);
    } catch {
      // Unreadable stored attribution is replaced below.
    }
    const merged = { ...previous, ...captured };
    sessionStorage.setItem("defenseeye_utm", JSON.stringify(merged));
    localStorage.setItem("defenseeye_utm_last", JSON.stringify(merged));
    return;
  }

  captured.landing_pathname = window.location.pathname;

  if (referrer && !captured.referrer_domain) {
    try {
      captured.referrer_domain = new URL(referrer).hostname.replace(/^www\./, "");
    } catch {
      // Ignore invalid referrers rather than forwarding arbitrary strings.
    }
  }

  if (Object.keys(captured).length > 0) {
    sessionStorage.setItem("defenseeye_utm", JSON.stringify(captured));
    localStorage.setItem("defenseeye_utm_last", JSON.stringify(captured));
  }
}

export function getStoredAttribution() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("defenseeye_utm") || localStorage.getItem("defenseeye_utm_last") || "{}");
  } catch {
    return {};
  }
}

// Conversions that are deliberate CTA clicks, forwarded to GA4 as cta_click. A fixed
// intent applies only where the CTA itself is topic-specific; generic CTAs (consultation,
// landing page, home path, datasheet) take their intent from where they sit or lead.
// Page-view style conversions are not forwarded: GA4 already records page_view.
const CTA_CONVERSIONS: Partial<Record<ConversionName, { intent?: LeadIntent; product?: string }>> = {
  home_path_click: {},
  consultation_click: {},
  landing_page_cta_click: {},
  datasheet_download: {},
  portfolio_ai_click: { intent: "secure_ai" },
  portfolio_cmmc_click: { intent: "cmmc" },
  cmmclens_click: { intent: "cmmc", product: "cmmclens" },
  cmmclens_demo_click: { intent: "cmmc", product: "cmmclens" },
  attacksense_click: { intent: "attacksense", product: "attacksense" },
  attacksense_docs_click: { intent: "attacksense", product: "attacksense" },
  attacksense_guide_open: { intent: "attacksense", product: "attacksense" },
  attacksense_guide_download: { intent: "attacksense", product: "attacksense" },
  supplier_readiness_click: { intent: "supplier" },
  supplier_inquiry_click: { intent: "supplier" },
  partners_email_click: { intent: "supplier" },
  capability_statement_download: { intent: "supplier" },
  enterprise_email_click: { intent: "contact" },
  email_click: { intent: "contact" },
  phone_click: { intent: "contact" },
  support_email_click: {},
};

/** Intent implied by a CTA's location or destination, for CTAs that are not topic-specific themselves. */
export function intentFromCtaContext(...hints: unknown[]): LeadIntent | undefined {
  const text = hints.filter((hint): hint is string => typeof hint === "string").join(" ").toLowerCase();
  if (/cmmc/.test(text)) return "cmmc";
  if (/secure[-_]ai/.test(text)) return "secure_ai";
  if (/ai[-_]governance/.test(text)) return "ai_governance";
  if (/attacksense/.test(text)) return "attacksense";
  if (/supplier/.test(text)) return "supplier";
  if (/microsoft/.test(text)) return "microsoft";
  return undefined;
}

function forwardToGa4(name: ConversionName, detail: Record<string, unknown>) {
  if (name === "newsletter_unavailable_cta_click") {
    trackNewsletterFallback(typeof detail.location === "string" ? detail.location : "unspecified");
    return;
  }
  const cta = CTA_CONVERSIONS[name];
  if (!cta) return;
  const datasheet = typeof detail.datasheet === "string" ? detail.datasheet : undefined;
  const location = typeof detail.location === "string" ? detail.location : datasheet ? `datasheet_${datasheet}` : "unspecified";
  trackCtaClick({
    name: typeof detail.cta === "string" ? detail.cta : name.replace(/_click$/, ""),
    location,
    intent: (detail.intent as LeadIntent | undefined) ?? cta.intent ?? intentFromCtaContext(detail.path, location, datasheet),
    audience: typeof detail.audience === "string" ? detail.audience : undefined,
    product: cta.product ?? (datasheet === "cmmclens" ? "cmmclens" : undefined),
  });
}

export function trackConversion(name: ConversionName, detail: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const payload = {
    event: name,
    event_name: name,
    ...detail,
    attribution: getStoredAttribution(),
    path: window.location.pathname,
  };

  // In-page hook for integrations. It is not pushed to the GA4 dataLayer: gtag.js ignores
  // plain dataLayer objects, so GA4 receives only the explicit events sent below.
  window.dispatchEvent(new CustomEvent("defenseeye:conversion", { detail: payload }));
  forwardToGa4(name, detail);
}
