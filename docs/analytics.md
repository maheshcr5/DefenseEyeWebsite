# GA4 analytics and lead measurement

## Configuration

- **Measurement ID:** `G-H22Q6LRNWC` (production property). Do not use `G-KTK7M073CH`; the build rejects it.
- **Single source:** `VITE_GA4_MEASUREMENT_ID` in the deployment `.env` (`/var/www/defenseeye/.env` on the VPS). Vite writes it into `client/index.html` at build time. No other file sets the ID.
- **Build guard:** `pnpm build` in production mode fails when the ID is missing, still the `.env.example` placeholder, not in `G-XXXXXXXXXX` format, or retired. It also fails when the built `index.html` still holds the placeholder, assigns the ID more than once, or references gtag.js more than once. See `vite.config.ts` and `shared/ga4Config.ts`.
- **Local builds:** for a build that will not be deployed, `GA4_ALLOW_MISSING=true` turns these errors into warnings.

## Loading and consent

- gtag.js loads only after the visitor chooses **Accept All** in the cookie banner (consent version 2 with `purposes.analytics: true`). "Essential Only", no choice, or an older consent record means no GA4 script and no events.
- `window.loadGA4` loads gtag.js at most once per page load. Client-side route changes send one `page_view` through `trackGA4PageView`, which skips repeat calls for the same path. The app uses `createRoot`, not hydration, so there is no hydration double-fire.
- Every event goes through `sendGa4Event` in `client/src/lib/analytics.ts`. That function checks consent, gtag, and the ID, and forwards only allowlisted parameters. It drops any value that looks like an email address or phone number.

## Events

| Event | When | Parameters | Lead? |
|---|---|---|---|
| `cta_click` | A visitor clicks a tracked CTA | `cta_name`, `cta_location`, `page_path`, and when known `intent`, `audience`, `product` | No |
| `form_start` | First edit of a lead form, once per form instance | `form_name`, `form_intent`, `page_path` | No |
| `form_submit` | Only after `/api/contact` returns success | `form_name`, `form_intent`, `page_path`, `lead_source`, `lead_medium`, `lead_campaign` | **Yes (key event)** |
| `newsletter_fallback_click` | The "email updates aren't available yet" block sends the visitor to the contact form. It is not a subscription. | `cta_name`, `cta_location`, `page_path` | No |

Existing funnel events stay unchanged alongside these: `secure_ai_primary_cta_click`, `secure_ai_pilot_cta_click`, `secure_ai_form_start`, `secure_ai_form_submit_success`, `cmmclens_briefing_click`, and `cmmclens_marketplace_click`.

**Lead forms** (`form_name`):
- `contact_page`: `form_intent` comes from the Inquiry Type option, for example `cmmc_readiness`, `general_inquiry`, or `ai_governance_consulting`.
- `secure_ai_adoption`: `form_intent` is `secure_ai`.

**CTA `intent`** values are `secure_ai`, `ai_governance`, `cmmc`, `supplier`, `attacksense`, `microsoft`, and `contact`. Intent is set only when the CTA itself is topic-specific, or when its location or destination is. For example:
- **`cmmc`:** "Assess CMMC Readiness", CMMCLens CTAs, the homepage CMMC path card, and CTAs on CMMC landing pages.
- **No intent:** visiting a CMMC page alone sets no intent.

Page-view style conversions (`*_view`) are not sent to GA4, because GA4 already records `page_view`.

**Lead source** in `form_submit` comes from the session's first-touch attribution. The order is:
1. `utm_source`, `utm_medium`, and `utm_campaign`
2. Otherwise a click ID: `gclid` is google/cpc, `msclkid` is bing/cpc, and `li_fat_id` is linkedin/paid_social
3. Otherwise the referring domain, as referral
4. Otherwise `direct`

Click IDs, landing page, and referrer are not sent as event parameters. They go with the inquiry to `/api/contact`.

## Attribution

`captureUtmParameters` (`client/src/lib/tracking.ts`) stores the first-touch record (UTM values, click IDs, landing path, referring domain) for the session:
- **Kept:** internal navigation (same-site referrer) and direct loads with no campaign (typed URL, bookmark, reload). New campaign values on an internal page are merged in.
- **Replaced:** an arrival from another site or a new campaign link starts a fresh record.

## Personal data

GA4 never receives names, email addresses, phone numbers, organizations, job titles, or message text. Tests enforce this in `client/src/lib/analytics.test.ts` and `client/src/pages/leadEvents.test.tsx`.

## Manual GA4 Admin steps

These steps can't be configured from the codebase.

1. **Turn off Enhanced Measurement → Form interactions.** Path: Admin → Data streams → (web stream) → Enhanced measurement → gear icon. With it on, gtag.js sends its own automatic `form_start` and `form_submit`, which share names with the site's events. Those automatic events carry `form_id` and `form_destination` and no `form_name`. A local test on 2026-10-24 recorded an automatic `form_start` next to the site's. Leave Page views, Scrolls, and the other options as they are. A browser test showed one `page_view` per route with the current settings.
2. **Mark `form_submit` as a key event.** Path: Admin → Data display → Events (or Key events). Do this after step 1. The event appears in the list after its first occurrence; you can also add it by name under Key events. Do not mark `cta_click`, `form_start`, `newsletter_fallback_click`, `page_view`, or `scroll`.
3. **Optional: register custom dimensions** (Admin → Custom definitions, event scope) for reporting: `cta_name`, `cta_location`, `intent`, `form_name`, `form_intent`, `lead_source`, `lead_medium`, `lead_campaign`.

## Verifying after a deployment

1. **Tag and ID.** View source on https://defenseeye.ai/: there should be one `window.__gaId = "G-H22Q6LRNWC"` and one gtag.js loader. After accepting cookies, DevTools → Network should show one `gtag/js?id=G-H22Q6LRNWC` request.
2. **Realtime.** GA4 → Reports → Realtime (property for `G-H22Q6LRNWC`). Accept cookies, open the homepage with `?utm_source=qa&utm_medium=qa&utm_campaign=qa`, and click "Request a Secure AI Readiness Consultation". `cta_click` should appear.
3. **Form events.** Start typing in the /contact form. `form_start` should appear. `form_submit` should appear only after a successful submission. A genuine test inquiry sends an email to the team.
