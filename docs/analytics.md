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

### Other third-party scripts

- **Ahrefs Web Analytics** uses the same analytics consent purpose as GA4; no new consent category was added. The inline block in `client/index.html` defines `window.loadAhrefs`, which injects `analytics.ahrefs.com/analytics.js` at most once per page. `window.loadOptionalAnalytics` calls `loadGA4` and `loadAhrefs`. It is the only entry point, and runs on "Accept All" (`CookieConsent.tsx`) or on page load for a visitor who already accepted.
  - Ahrefs is cookieless, and it does not receive the site's GA4 events.
  - It records its own page views, including the page URL with any UTM parameters, the referrer, screen size, and language. These are separate from GA4 `page_view`, so there are no duplicates within GA4.
  - Before consent, nothing is loaded.
- **OpenAI Ads Measurement Pixel** (`client/src/lib/openaiAds.ts`, added in `4bb14b7`) measures whether DefenseEye's OpenAI ads lead to consultation requests. It is an intentional, advertising-measurement integration, and it is not needed for any site feature.
  - **When it loads:** only with current consent ("Accept All" sets `purposes.openaiAdsMeasurement: true`). `loadOpenAiAdsPixelIfConsented` then loads `bzrcdn.openai.com/sdk/oaiq.min.js` at most once. Before consent, and after "Essential Only" or dismissing the banner, there are no requests and no cookies (browser test 2026-10-25; unit tests in `client/src/lib/openaiAds.test.ts`).
  - **Cookies, set by OpenAI's SDK after consent:** `__oaiq_consent` and `__obref` on defenseeye.ai.
  - **What it sends:** to `bzr.openai.com/v1/sdk/events`. Every page load sends SDK `openai::sdk_init` and `oai::diagnostic` events, with fields `id`, `type`, `timestamp_ms`, `source_url` (the page URL, including UTM parameters), `test_session_id`, and `data`. After a successful contact or Secure AI submission, it sends one `lead_created` with only `{ type: "customer_action" }`.
  - **Personal data:** none of the form's name, email, company, phone, or message text was found in its requests. The site never passes user data to the SDK, so no hashed matching is enabled.
- **Instantly / RB2B visitor identification** (`r2.leadsy.ai/tag.js`, which injected a `cloudfront.net` tracker) was removed on 2026-10-24. Do not add visitor-identification tools without a separate consent purpose and privacy-policy update.
- **Umami** has a loader in `client/index.html` that runs without consent. It is dormant: production's `VITE_ANALYTICS_WEBSITE_ID` is the `.env.example` placeholder, so the loader exits. Before configuring Umami, decide whether it needs consent and update the privacy policy.

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

## Lead events: who sends what

- **`form_start` is application-controlled.** The site sends it once per form instance, on the first edit (`trackFormStartOnce` in `client/src/lib/analytics.ts`). It always carries `form_name`.
- **`form_submit` fires only after a successful submission.** It is sent only after `/api/contact` returns OK. Validation errors, 4xx/5xx responses, and network failures send nothing.
- **`form_start` is not a lead key event.** It measures intent to fill in a form.
- **`form_submit` is the intended lead key event.**
- GA4's own automatic form events (Enhanced Measurement → Form interactions) duplicate these names. They must be off; see step 1 below. Automatic events can be recognised by `form_id` / `form_destination` with no `form_name`.

## Manual GA4 Admin steps

These steps can't be done from the codebase. As of 2026-10-25 they have **not been verified**: the available Google login has no Analytics scope (`ACCESS_TOKEN_SCOPE_INSUFFICIENT`), so the setting couldn't be read or changed.

1. **Turn off only Enhanced Measurement → Form interactions** in the active web stream for **Measurement ID `G-H22Q6LRNWC`**. Path: Admin → Data collection and modification → Data streams → the web stream with Measurement ID `G-H22Q6LRNWC` → Enhanced measurement → gear icon → switch off **Form interactions** → Save.
   - **Do not turn off Enhanced measurement as a whole.** Keep **Page views, Scrolls, Outbound clicks, Site search, Video engagement, and File downloads** on.
   - **Why:** with Form interactions on, gtag.js sends its own `form_start` and `form_submit`. A browser test on 2026-10-25 recorded GA's automatic `form_start` next to the site's on every form. Its automatic `form_submit` would be counted as a lead once `form_submit` is a key event.
   - **Confirm:** in Realtime or DebugView, start typing in the /contact form after accepting cookies. Only one `form_start` should appear, and it should carry `form_name`.
2. **Mark `form_submit` as a key event.** Path: Admin → Data display → Key events → New key event → `form_submit`. Do this after step 1. Do not mark `cta_click`, `form_start`, `newsletter_fallback_click`, `page_view`, or `scroll`. Do not create custom or duplicate events for leads; the site already sends `form_submit`.
3. **Optional: register custom dimensions** (Admin → Custom definitions, event scope) for reporting: `cta_name`, `cta_location`, `intent`, `form_name`, `form_intent`, `lead_source`, `lead_medium`, `lead_campaign`.
4. **Leave the Internal Traffic filter in Testing** unless someone decides otherwise. This codebase does not change it.

## Verifying after a deployment

1. **Tag and ID.** View source on https://defenseeye.ai/: there should be one `window.__gaId = "G-H22Q6LRNWC"` and one gtag.js loader. After accepting cookies, DevTools → Network should show one `gtag/js?id=G-H22Q6LRNWC` request.
2. **Realtime.** GA4 → Reports → Realtime (property for `G-H22Q6LRNWC`). Accept cookies, open the homepage with `?utm_source=qa&utm_medium=qa&utm_campaign=qa`, and click "Request a Secure AI Readiness Consultation". `cta_click` should appear.
3. **Form events.** Start typing in the /contact form. `form_start` should appear. `form_submit` should appear only after a successful submission. A genuine test inquiry sends an email to the team.
