// Small dedicated CMMCLens analytics helper, shared between the CMMCLens page (hero/closing
// briefing CTAs) and the route-aware NavBar header CTA on /cmmclens. Consent and the GA4
// send itself live in lib/analytics.ts.

import { hasAnalyticsConsent, sendGa4Event } from "@/lib/analytics";

const CMMCLENS_PAGE_PATH = "/cmmclens";

export function hasCmmcLensAnalyticsConsent() {
  return hasAnalyticsConsent();
}

export type CmmcLensBriefingCtaLocation = "hero" | "closing" | "header";

export function trackCmmcLensBriefingClick(ctaLocation: CmmcLensBriefingCtaLocation) {
  sendGa4Event("cmmclens_briefing_click", {
    cta_location: ctaLocation,
    page_path: CMMCLENS_PAGE_PATH,
  });
}

export function trackCmmcLensMarketplaceClick() {
  sendGa4Event("cmmclens_marketplace_click", {
    cta_location: "hero",
    page_path: CMMCLENS_PAGE_PATH,
  });
}
