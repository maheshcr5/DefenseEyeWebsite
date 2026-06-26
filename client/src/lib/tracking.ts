const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "msclkid", "li_fat_id"];

export type ConversionName =
  | "capability_statement_download"
  | "supplier_readiness_view"
  | "contact_form_submit"
  | "consultation_click"
  | "cmmclens_click"
  | "advisor_opened"
  | "advisor_topic_selected"
  | "landing_page_cta_click"
  | "email_click"
  | "phone_click"
  | "microsoft_ecosystem_view"
  | "cmmc_readiness_view"
  | "ai_governance_view";

export function captureUtmParameters() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const captured: Record<string, string> = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) captured[key] = value;
  }

  const referrer = document.referrer;
  if (referrer && !captured.referrer) captured.referrer = referrer;

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

export function trackConversion(name: ConversionName, detail: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const payload = {
    event: name,
    event_name: name,
    ...detail,
    attribution: getStoredAttribution(),
    path: window.location.pathname,
  };

  window.dispatchEvent(new CustomEvent("defenseeye:conversion", { detail: payload }));
  (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push(payload);
}
