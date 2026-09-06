// Small dedicated CMMCLens analytics helper, shared between the CMMCLens page (hero/closing
// briefing CTAs) and the route-aware NavBar header CTA on /cmmclens, so the consent-gated GA4
// logic exists in exactly one place rather than being duplicated per consumer.

const CONSENT_KEY = "de_cookie_consent";
const CONSENT_VERSION = 2;
const CMMCLENS_PAGE_PATH = "/cmmclens";

declare global {
  interface Window {
    __gaId?: string;
    gtag?: (...args: unknown[]) => void;
  }
}

export function hasCmmcLensAnalyticsConsent() {
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

export type CmmcLensBriefingCtaLocation = "hero" | "closing" | "header";

export function trackCmmcLensBriefingClick(ctaLocation: CmmcLensBriefingCtaLocation) {
  if (!hasCmmcLensAnalyticsConsent()) return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "cmmclens_briefing_click", {
    cta_location: ctaLocation,
    page_path: CMMCLENS_PAGE_PATH,
  });
}

export function trackCmmcLensMarketplaceClick() {
  if (!hasCmmcLensAnalyticsConsent()) return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "cmmclens_marketplace_click", {
    cta_location: "hero",
    page_path: CMMCLENS_PAGE_PATH,
  });
}
