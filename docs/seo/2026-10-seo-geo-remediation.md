# SEO, GEO, internal-linking, and conversion remediation — October 2026

Branch `seo-geo-conversion-remediation`, compared with production `51108e4`. Input: Ahrefs Site Audit export "Orphan page (has no incoming internal links)", crawl of 2026-10-18, 41 URLs. Tables were generated from server output, not typed by hand.

## Final review update (round 3): newsletter, primary-source verification, dates

Two new commits: `669d167` (newsletter) and `bf8c9e9` (regulatory and claims). Each passes type-check and the full suite on its own (268 and 269 tests). **Production was not deployed or changed.**

### F1. Newsletter decision

**No approved newsletter or email-marketing provider exists.** None appears in the code or in the environment-variable names; the only email capability is the SMTP transport for the contact form. The old forms showed "You're subscribed!" and sent the address nowhere.

**Decision: replace the false success with a truthful state routed to the existing contact workflow.** Both the Blog and Knowledge Hub blocks now say "Email updates aren't available yet" and offer two routes:
- **Ask About CMMC Updates** → `/contact?inquiry=cmmc`, the existing lead form, pre-set to CMMC readiness. Fires `newsletter_unavailable_cta_click`.
- A link to the free guides.

No email field is shown, and nothing is stored in files, logs, browser storage, or any database. The visual design is unchanged. A provider-ready, accessible form is already built in `NewsletterSignup` and activates when `NEWSLETTER_PROVIDER` is set.

### F2. Newsletter test results

| Case | Result |
|---|---|
| Empty email | Rejected ("Enter your work email address."); provider not called |
| Invalid email | Rejected ("Enter an email address in the format name@company.com."); provider not called |
| Valid email | Passed to the provider trimmed; success only after the provider resolves |
| Provider success | `role="status"` success, `newsletter_subscribe` event |
| Provider failure | Visible `role="alert"` error linked to the field (`aria-describedby`, `aria-invalid`), `newsletter_subscribe_failed` event; retry allowed |
| Duplicate submission | Ignored while in flight and after success; provider called once |
| No configured provider (current) | `unavailable` result; the rendered block has no form and no "subscribed" text, and routes to contact |
| Analytics | Events carry location and provider name only; a test asserts no email address appears in any event |
| Site-wide guard | A test fails if any page hard-codes "You're subscribed" copy |
| Live browser (390 px) | `/blog` and `/knowledge-hub`: no "subscribed" text, 0 email inputs, CTA → `/contact?inquiry=cmmc`, event fires, no overflow |

15 newsletter tests in `client/src/lib/newsletter.test.ts` and `client/src/components/NewsletterSignup.test.tsx`.

### F3. Provider configuration requirements (business decision)

To enable real signups, choose an approved provider and implement `NewsletterProvider.subscribe` in `client/src/lib/newsletter.ts`, preferably through a small server endpoint so no API key reaches the browser. Also:
- **Credentials:** store them only in the server environment.
- **Consent:** confirm double opt-in and unsubscribe handling. The current consent text ("You can unsubscribe at any time. See our Privacy Policy.") matches the existing Privacy Policy's marketing-opt-out section.
- **Privacy Policy:** confirm the provider is covered as a processor.

### F4. CMMC and regulatory corrections, with primary sources

| Statement | Primary source | Outcome |
|---|---|---|
| **Phase II suspended on 13 July 2026** (knowledge hub: 5 guides, FAQs, timeline) | Not verifiable. The eCFR 32 CFR 170.3(e), current to 22 Oct 2026, has no suspension language. The DoD class-deviation lists ([current](https://www.acq.osd.mil/dpap/dars/class_deviations.html), [2026 archive](https://www.acq.osd.mil/dpap/dars/archive/2026/class_deviations.html)) do not include the cited 2026-O0025. dodcio.defense.gov and defense.gov refused automated access. | **Rewritten.** Phase 1 began 10 Nov 2025, when the DFARS CMMC rule took effect; 32 CFR 170.3(e) schedules Phase 2, which adds Level 2 (C3PAO) requirements, one calendar year later. "DoD can adjust implementation timing through policy, so confirm the current phase with official DoD CIO guidance and the CMMC requirement stated in each solicitation." Removed all "suspended" and "paused in Phase I" claims. |
| Phase 1 start date | [Federal Register 90 FR 43560](https://www.federalregister.gov/documents/2025/09/10/2025-17359/defense-federal-acquisition-regulation-supplement-assessing-contractor-implementation-of) (DFARS Case 2019-D041): "This rule is effective November 10, 2025." [32 CFR 170.3(e)(1)](https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-G/part-170/subpart-A/section-170.3): Phase 1 "Begins on the effective date of the complementary 48 CFR part 204 CMMC Acquisition final rule." | **Verified; kept.** |
| Who publishes the CMMC Assessment Process (CAP) | [cyberab.org/Resources/Downloads](https://cyberab.org/Resources/Downloads) hosts "CMMC Assessment Process (CAP)" (file named v2.0). The publisher could not be confirmed from the document. | **Rewritten** to "available from the Cyber AB's resources page"; no publisher named. |
| Typical assessment phase durations, "6–16 weeks", "3–5 days on-site", "3–5 months", remediation months, SPRS "30–90 days" | No authoritative source | **Removed.** The phase table's duration column is dropped. The text now says timing depends on scope, readiness, and C3PAO availability and is agreed with the C3PAO. |
| Conditional window | [32 CFR 170.17(a)(1)(ii)(B)](https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-G/part-170/subpart-D/section-170.17) and [170.21(b)](https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-G/part-170/subpart-D/section-170.21): closeout by a C3PAO "within 180 days of the CMMC Status Date associated with the Conditional Level 2 (C3PAO)", or the status "will expire" | **Verified; reworded to the rule**, including the 170.21(a)(2) eligibility conditions (score ≥ 80%, eligible requirements only) |
| "Certificate valid for three years" | 32 CFR 170.17(a)(1): "the Level 2 certification assessment must be completed within three years of the CMMC Status Date" | **Reworded**: "a new Level 2 certification assessment is required within three years of the CMMC Status Date", plus annual affirmation in SPRS (170.17(a)(2)) |
| C3PAO definition: "certified by the CMMC Accreditation Body" | 32 CFR 170.9(a) | **Corrected** to "accredited or authorized by the CMMC Accreditation Body (The Cyber AB)", with CCAs certified by the CAICO (170.10) |

Earlier rounds used news and law-firm reporting for the Phase II suspension; that reliance is now removed. Only the primary sources above are relied on. DefenseEye is described throughout as a readiness and consulting provider that does not assess or certify.

### F5. Additional unverified claims removed

Found while verifying the regulatory statements; none has an authoritative source, and several contradicted the site's own published claim boundaries.
- **Pricing and offers:**
  - CMMCLens "$199/month" and "$499/month": the Pricing page states there is no public price list.
  - "14-day free trial, no credit card required": no trial is offered anywhere on the site.
  - "Start Free Trial" and "Book Free Assessment" buttons, which also pointed to a homepage `#contact` anchor that doesn't exist. They now go to `/lp/cmmclens-demo` (the CMMCLens calendar) or the contact form ("Request a Free Consultation", matching the contact page's "Your first call is free").
- **Performance:** "up to 80%" and "60–80%" reductions, "60–90 days with CMMCLens", "4–8 weeks → 3–5 days", "8–24 hours vs 400–800 hours", "under 30 minutes", "one-click", "live SPRS score". All are replaced with the product page's own qualified wording: "Effort savings depend on environment maturity, integrations, available source data, and implementation scope."
- **Cost estimates:** consultant and C3PAO dollar ranges in the knowledge hub and content API. In the small-business guide, the CMMCLens row now reads "quoted to scope" and the year-1 total "varies widely"; the other third-party estimate rows, labelled "Estimated Range", are unchanged.
- **Dead links:** `/#features` and `/#pricing`, plus a "Careers" link with no page. A new test rejects any `/#anchor` the homepage does not define.
- **Content API** (`/api/cmmc-content`, read by AI systems) and **`.well-known/ai-plugin.json`**: same corrections.

### F6. Date validation

| Page | Visible date | Basis |
|---|---|---|
| C3PAO assessment post | Updated 24 Oct 2026 | Revised today (rules, durations, CAP) |
| Small-business guide | Updated 24 Oct 2026 | Revised today (pricing row, total) |
| Checklist and red-flags posts | Updated 23 Oct 2026 | Revised in round 2; not changed today |
| Other blog posts | Unchanged | Only product-name or citation tweaks; not labelled as updated |
| Five knowledge-hub guides | "Last updated: October 2026" (was September 2026) | Phase wording, durations, and product claims revised today |
| Insight pages | No date shown, none in schema | No date recorded |

Schema `dateModified` equals the visible date (knowledge hub `2026-10`; blog ISO dates). Sitemap `lastmod` was updated only for pages revised today. No future, fabricated, or year-only "updates" remain, and a test enforces schema/visible parity.

### F7. Redirect verification (consolidated page)

`/cmmc-readiness-sprint` → **301, single hop** → `/services/cmmc-readiness-sprint`:
- The destination returns **200**, with canonical `https://defenseeye.ai/services/cmmc-readiness-sprint`.
- The destination is **in** the sitemap; the old URL is not, and no internal link points to it.
- The moved FAQ ("What does a readiness sprint produce?") renders on the destination.
- There is no chain or loop (test-enforced and checked over live HTTP).

### F8. Indexing decisions: landing pages

All 10 `/lp/` pages stay **indexable**. Nothing in the repository identifies them as paid-only or campaign-only, and they are not noindexed to hide thin content. Each has a unique title, a substantive description, a self-referencing canonical, a sitemap entry, meaningful CTAs, and a distinct title from its related canonical page:

| Landing page | Title (unique) | Description | Canonical | In sitemap | Primary CTA | Related canonical page (distinct title) |
|---|---|---|---|---|---|---|
| `/lp/secure-ai-adoption` | Secure AI Adoption Consulting for Regulated Teams \| DefenseEye | 142 chars | https://defenseeye.ai/lp/secure-ai-adoption | Yes | Discuss Secure AI Adoption (discovery calendar) + Request Capability Statement | `/secure-ai-adoption`: Secure Agentic AI Readiness & Implementation \| DefenseEye |
| `/lp/ai-governance-consulting` | AI Governance Readiness Assessment \| DefenseEye | 122 chars | https://defenseeye.ai/lp/ai-governance-consulting | Yes | Discuss AI Governance Readiness (discovery calendar) + Request Capability Statement | `/solutions/ai-governance`: AI Governance & NIST AI RMF Consulting \| DefenseEye |
| `/lp/microsoft-copilot-readiness` | Microsoft Copilot Readiness Assessment \| DefenseEye | 137 chars | https://defenseeye.ai/lp/microsoft-copilot-readiness | Yes | Assess Copilot Readiness (discovery calendar) + Request Capability Statement | `/solutions/microsoft-copilot-readiness`: Microsoft Copilot Readiness Consulting \| DefenseEye |
| `/lp/cmmc-level-2-readiness` | CMMC Level 2 Readiness Assessment \| DefenseEye | 133 chars | https://defenseeye.ai/lp/cmmc-level-2-readiness | Yes | Assess CMMC Readiness (discovery calendar) + Request Capability Statement | `/cmmc-level-2-readiness`: CMMC Level 2 Readiness Consulting \| DefenseEye |
| `/lp/cmmc-compliance-automation` | CMMC Compliance Automation Sprint \| DefenseEye | 135 chars | https://defenseeye.ai/lp/cmmc-compliance-automation | Yes | Explore CMMC Automation (discovery calendar) + Request Capability Statement | `/cmmc-compliance-automation`: CMMC Compliance Automation & CCP-Led Readiness \| DefenseEye |
| `/lp/cmmc-evidence-automation` | CMMC Evidence Automation with CMMCLens \| DefenseEye | 135 chars | https://defenseeye.ai/lp/cmmc-evidence-automation | Yes | Explore Evidence Automation (discovery calendar) + Request Capability Statement | `/cmmc-evidence-automation`: CMMC Evidence Automation & Traceability \| DefenseEye |
| `/lp/cmmclens-demo` | Request a CMMCLens Demo \| DefenseEye | 141 chars | https://defenseeye.ai/lp/cmmclens-demo | Yes | Request CMMCLens Demo (CMMCLens calendar) + Request Capability Statement | `/cmmclens`: CMMCLens CMMC & NIST 800-171 Compliance Platform \| DefenseEye |
| `/lp/microsoft-supplier-ai-consulting` | Minority-Owned AI & Cybersecurity Supplier \| DefenseEye | 139 chars | https://defenseeye.ai/lp/microsoft-supplier-ai-consulting | Yes | Discuss Supplier Opportunities (discovery calendar) + Request Capability Statement | `/supplier-readiness`: Supplier Readiness: Minority-Owned AI & Cyber Firm \| DefenseEye |
| `/lp/azure-cloud-security` | Azure Cloud Security & Compliance Review \| DefenseEye | 129 chars | https://defenseeye.ai/lp/azure-cloud-security | Yes | Review Azure Security (discovery calendar) + Request Capability Statement | `/solutions/cloud-security`: Azure & GCC High Cloud Security Consulting \| DefenseEye |
| `/lp/compliance-automation` | Compliance Automation for Evidence & Reporting \| DefenseEye | 131 chars | https://defenseeye.ai/lp/compliance-automation | Yes | Discuss Compliance Automation (discovery calendar) + Request Capability Statement | `/solutions/compliance-automation`: Compliance Evidence Automation Consulting \| DefenseEye |

### F9. Full test results (round 3)

| Check | Result |
|---|---|
| Dependencies (`pnpm install --frozen-lockfile --offline`) | OK; lockfile unchanged |
| Type-check (`pnpm check`) | Pass |
| Unit and integration tests (`npx vitest run --root .`) | **28 files, 269 tests, all pass** (each new commit also passes on its own) |
| Production build (`pnpm build`) | Pass |
| Routes, redirects, sitemap, canonicals, robots (live production build) | 74 sitemap URLs: 200, `index, follow`, self canonical, unique titles, one H1; redirects single-hop; well-formed sitemap; 404 → noindex |
| Structured data (74 pages) | **0 errors** |
| Accessibility and mobile (18+ pages, 390 px and 1440 px) | No overflow, labels and names present, skip link works, focus visible |
| Contact form (browser, API stubbed) | 0 requests while invalid, 1 on valid; `contact_form_submit` fires; success focused |
| Newsletter (unit and browser) | See F2 |
| Internal links (source scan) | All destinations live; no redirected links; no undefined `/#anchors` |
| Secrets | None in the diff; no env, key, deploy, or dependency files changed |
| Lint | **Unavailable**: no lint script in `package.json` (not created) |

### F10. Remaining warnings

- **Schema:** 13 knowledge-hub and insight Articles have no `datePublished` (none recorded or shown).
- **Rich results:**
  - CMMCLens isn't eligible for Google software rich results without public pricing or reviews.
  - Google limits FAQ rich results to government and health sites.
- **Accessibility:** the blog-post template skips one heading level (pre-existing).
- **Product features:** qualitative CMMCLens feature names (for example "score trend chart", "drill-down by domain", "policy templates") remain in the guides and should be confirmed by the product owner.
- **Historical statements** outside this review's scope (for example a "2019 DoD Inspector General audit" figure in "What is CMMC") were not re-verified.

### F11. Business decisions still required

1. **Newsletter provider:** choose and approve one (F3), or keep the contact-routing state.
2. **Phase II status:** if DoD has published an official notice suspending Phase 2, supply its link so the knowledge hub can cite it; until then the content states the verified schedule and points to DoD CIO guidance.
3. **CMMCLens pricing and trial:** if public pricing or a free trial is approved, supply the approved terms; all such claims were removed.
4. **Product-owner check** of the qualitative CMMCLens feature names (F10).
5. **Open items from earlier rounds:**
   - DefyAIRisk Monitor facts
   - industry hubs (not created)
   - whether any `/lp/` page is campaign-only
   - a designed share image

### F12. Production

**No production deployment occurred.** No command was run against the VPS, `main` is unchanged at `51108e4`, and this pull request remains open and unmerged.

### Reviewer checklist (round 3)

- [ ] Newsletter form never claims success unless a real subscription succeeds.
- [ ] Newsletter failures are visible and accessible.
- [ ] Newsletter data is not stored in an unapproved location.
- [ ] Privacy and consent requirements were considered.
- [ ] CMMC terminology is accurate and current.
- [ ] Regulatory claims use authoritative sources.
- [ ] Unverified claims were removed or qualified.
- [ ] DefenseEye is not described as issuing certification unless verified.
- [ ] All 41 Ahrefs URLs have documented outcomes.
- [ ] The one consolidated URL has a valid single redirect.
- [ ] All important pages have relevant internal links.
- [ ] Campaign pages remain intentionally indexable or noindex.
- [ ] Sitemap and canonical behavior are correct.
- [ ] Structured data validates.
- [ ] Forms and analytics work.
- [ ] Mobile and accessibility checks pass.
- [ ] No secrets were committed.
- [ ] No unrelated changes were included.
- [ ] Production was not modified.

---

## Review update (round 2): CMMC accuracy, form accessibility, dates

> Historical record. Superseded by round 3 where they differ, notably the Phase II wording (no longer sourced from news reports) and the newsletter, which is now resolved.

Three new commits: `bf3f0ff`, `7677d92`, `9d873bb`. Each was verified independently (type-check and full test suite pass at each). The sections below this update have been refreshed to match.

### R1. CMMC terminology corrections

Statements were checked against the regulation **before** any text was changed. Only what the sources state was used.

| Article | Statements corrected |
|---|---|
| **What to Expect During a C3PAO Assessment** (`/blog/what-to-expect-c3pao-assessment`) | "CMMC-AB reviews submission; issues CMMC Level 2 certification" → the **C3PAO issues the Certificate of CMMC Status**, and the CMMC Status (Final or Conditional Level 2 (C3PAO)) is stored in SPRS. "Submits to CMMC-AB eMASS" → results go to the **CMMC instantiation of eMASS, a DoD system**. "Authorized by the Cyber AB … CCAs individually credentialed" → C3PAOs are **accredited by the Accreditation Body**; CCAs are certified by the **CAICO**. Removed the "Certified Lead Assessor (CLA)" requirement, which 32 CFR 170 does not define. The contractor step is now "confirm your CMMC Status in SPRS and submit the affirmation in SPRS". Dead `marketplace.cmmcab.org` → `cyberab.org/Catalog`. Added a role note: readiness advisors such as DefenseEye support gap assessment, SSP and documentation, and remediation, but **cannot conduct the certification assessment or issue a Certificate of CMMC Status**, and contract eligibility remains with DoD. |
| **7 Red Flags When Hiring a CMMC Consultant** (`/blog/cmmc-consultant-red-flags`) | "The Cyber AB … certifies individual assessors and organizations" → the **Accreditation Body accredits C3PAOs; the CAICO certifies individual assessors**. Dead marketplace link and unverified `cyberaccreditation.us` → `cyberab.org/Catalog`. "CMMC-AB rules" → CMMC conflict-of-interest rules. Removed unverified "formerly CMMC-AB" assertions. Its existing warning against "guaranteed certification" is kept. |
| Related lines in the **Level 2 Compliance Checklist** (`/blog/cmmc-level-2-compliance-checklist-2025`, the eMASS line flagged in round 1) | eMASS submission wording, marketplace link, Accreditation Body description, and the undefined CLA credential. |
| Source citations in the **Small-Business** and **POA&M** posts, and the AI-ingestion content API `/api/cmmc-content` | Same terminology; unverified domain replaced. |

No guarantees, certification claims, or new regulatory promises were added. Each corrected article now states that DefenseEye does not certify, and the posts keep their search intent and CTAs. The three substantively corrected posts show **23 October 2026** as their updated date (visible label, `dateModified`, and sitemap `lastmod`), because their content changed today.

**Editorial and source note (factual basis):**
- [eCFR 32 CFR Part 170](https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-G/part-170), shown as current to 22 October 2026, read 23 October 2026. Where the rule states each fact:

  | Fact | Section |
  |---|---|
  | The Accreditation Body accredits C3PAOs | §170.8(a), §170.8(b)(3)(ii) |
  | C3PAOs conduct Level 2 certification assessments and issue Certificates of CMMC Status | §170.9(a), §170.9(b)(18) |
  | C3PAOs submit reports and certificates to the CMMC instantiation of eMASS, a government-owned system | §170.9(b)(8), §170.4(b) |
  | The CAICO certifies assessors | §170.10(a) |
  | CMMC Status is stored in SPRS | §170.4(b) |
  | Affirmation is made in SPRS | §170.16(b)(2) |

- [cyberab.org](https://cyberab.org/): the legal name is "Cybersecurity Maturity Model Certification Accreditation Body, Inc."; the "CMMC Marketplace" links to `cyberab.org/Catalog`.
- `marketplace.cmmcab.org` no longer resolves (DNS lookup fails).
- `dodcio.defense.gov/CMMC/` returned 403 to automated access and was not used.
- **Not changed, because they could not be verified:**
  - who publishes the CMMC Assessment Process (CAP)
  - typical phase durations and costs
  - the 180-day conditional window, cited in the POA&M post
- The 2026 rollout statements added to the knowledge hub (Phase I from November 2025; the planned 10 November 2026 Phase II suspended by DoD memos of 13 July 2026) match public reporting: [Federal News Network](https://federalnewsnetwork.com/cybersecurity/2026/07/pentagon-suspends-cmmc-phase-two-requirements-launches-review-of-program/), [National Defense Magazine](https://www.nationaldefensemagazine.org/articles/2026/7/13/breaking-pentagon-suspends-phase-2-of-cmmc-program), [Latham & Watkins](https://www.lw.com/en/insights/what-defense-contractors-should-know-about-dod-suspension-of-cmmc-phase-2), [Greenberg Traurig](https://www.gtlaw.com/en/insights/2026/7/dod-suspends-cmmc-deadlines-and-seeks-to-reassess-requirements). These are secondary sources; an SME should confirm against the DoD memo.

### R2. Accessibility fixes

| Area | Fix |
|---|---|
| **Contact form** (`/contact`) | Labels associated with all 9 controls (`htmlFor`/`id`). The 8 required fields carry `required` and `aria-required`; the asterisk is `aria-hidden`, with a "Fields marked * are required" note. App-level validation (`noValidate`) gives a plain-language message per field, linked by `aria-describedby` and `aria-invalid`, plus an announced summary (`role="alert"`). Focus moves to the first invalid field, and an error clears as soon as its field is fixed. The submission-error message is announced. The success confirmation is `role="status"` and receives focus. Added `autocomplete` tokens and `type="tel"` for phone. |
| **Newsletter forms** (Blog, Knowledge Hub) | Visually hidden labels; the Blog error is linked and announced; success states are announced. Behaviour unchanged (see R7). |
| **Blog search** | `aria-label="Search articles"`. |
| **Skip link** (every page) | "Skip to main content" is the first focusable element. It's hidden until focused, then shown as a high-contrast pill, and moves focus past the header and breadcrumb. |

The Secure AI consultation form already met these requirements. The "unlabeled" control the round-1 audit reported there is Radix's `aria-hidden` native `<select>`, a false positive.

### R3. Contact-form behaviour (verified in a real browser, with `/api/contact` stubbed so no email was sent)

| Scenario | Result |
|---|---|
| Empty submit (390 px viewport) | 8 fields flagged, each error linked, summary "Please correct the 8 highlighted fields." announced, focus on First name, **0 requests** |
| Fix one field | Its `aria-invalid` and error clear immediately |
| Malformed email | "Enter an email address in the format name@company.com.", focus on email, **0 requests** |
| Valid submit | **1 request**; `contact_form_submit` fires once; "Thank you." visible and focused |
| Unit tests | `submitContactInquiry` (13 existing tests: success, failure, timeout, duplicate guard, OpenAI lead event) unchanged and passing; 6 new tests for validation messages, label/id association, required marking, and `noValidate` |
| Server | `POST /api/contact` with an invalid body still returns 400 |

### R4. Date and year validation

| Item | Decision | Basis |
|---|---|---|
| Knowledge-hub H1s "(2026)" / "(2026 Guide)" (from the pre-existing WIP) | **Removed**, so the headings are timeless | The year label adds nothing the "Last updated" line doesn't say, and it goes stale |
| Knowledge-hub "Last updated: September 2026" (WIP) | **Kept** | The content was revised 13–14 September 2026 (file history) with the 2026 rollout statements verified in R1 |
| Knowledge-hub Article `dateModified` | Now `2026-09`, **derived from the visible label** (was a 2026-04-04 sitemap date) | Must match the page |
| Insight pages' Article `dateModified` (2026-06-25) | **Removed** | No date is shown on those pages |
| Checklist title "(2025 Complete Guide)" | Already "(Complete Guide)" | Stale year label (round 1) |
| Three corrected blog posts: `updatedAt` 2026-04-01 → 2026-10-23 | **Updated** | Their content changed in this PR |
| `/terms` sitemap `lastmod` (had been set to 2026-10-23) | **2026-04-01** | Matches the page's visible "Last updated" |
| Blog `datePublished` / `dateModified` | Unchanged; equal to the visible "Published" and "Updated" | Test-enforced |

A new test asserts that every Article/BlogPosting date equals the date the page shows, and that no knowledge-hub H1 carries a year.

### R5. Consolidated page verification (`/cmmc-readiness-sprint`)

- **Redirect:** intentional; a single-hop 301 to `/services/cmmc-readiness-sprint`. There's no chain: the destination returns 200 directly and is not itself redirected.
- **Destination:** canonical is `https://defenseeye.ai/services/cmmc-readiness-sprint`, and it is **in** the sitemap. The old URL is **not**.
- **No content lost:** the moved FAQ ("What does a readiness sprint produce?") and its answer render on the destination (checked in the browser after the redirect).
- **No stale links:** no internal link points to the old URL (test-enforced).

### R6. Campaign landing pages

All 10 `/lp/` pages are **indexable**, in the sitemap, and self-canonical, each with 2 or more contextual links from the solution, insight, or datasheet page whose offer it describes. **No campaign page is noindexed**, because nothing in the repository says any of them is limited to paid, outreach, or private traffic. Their CTAs use the correct booking links and fire `landing_page_cta_click` (verified). If some are campaign-only, set `robots: "noindex, follow"` on those entries in `shared/routeMetadata.ts`; that also removes them from the sitemap.

### R7. Items requiring business approval (new this round, highest priority first)

1. **The newsletter forms don't subscribe anyone.** Blog's "Stay Ahead of CMMC Rule Changes" and Knowledge Hub's "CMMC Updates to Your Inbox" show "You're subscribed!" but send the address nowhere (no request, storage, or analytics event), so visitors are told they're subscribed and the lead is lost. Choose one:
   - connect them to a mailing-list provider
   - route them to `/api/contact`
   - remove them, or reword them as a link to the contact page

   This PR only made them accessible.
2. **SME confirmation** of the Phase II suspension wording against the DoD memo, and of the three unverified CMMC statements listed in R1.

### Reviewer checklist (round 2)

- [ ] CMMC terminology is accurate and current.
- [ ] DefenseEye is not described as issuing certification unless verified.
- [ ] No unsupported compliance or regulatory guarantees were added.
- [ ] All form labels are associated with inputs.
- [ ] Form errors are accessible.
- [ ] Skip-to-content behavior works.
- [ ] Analytics and form submission still work.
- [ ] Date and year changes are factually supported.
- [ ] All 41 orphan URLs have a documented outcome.
- [ ] The consolidated page has a valid redirect with no chain.
- [ ] Campaign noindex decisions are intentional.
- [ ] Sitemap and canonical behavior are correct.
- [ ] Structured data validates.
- [ ] Mobile checks passed.
- [ ] No secrets were committed.
- [ ] No unrelated changes were included.
- [ ] Production was not modified.

---

## 1. Executive summary

Ahrefs reported 41 "orphan" pages. The pages were linked in the browser-rendered React UI, but not in the **HTML the server sends**. Ahrefs crawled without running JavaScript (`Is rendered page = false`), and so do most AI crawlers (GPTBot, ClaudeBot, PerplexityBot). In that HTML, routes outside a small SEO registry received the homepage's static body and almost no links.

This branch fixes the problem at the source and records the outcome for every URL:

- **40 of 41 URLs** are live, indexable, and now have **two or more** incoming links in the server-rendered HTML. Tests enforce this.
- **1 URL** (`/cmmc-readiness-sprint`) was a thin duplicate of the full sprint offer. It is consolidated with a single-hop 301, and its one unique FAQ was moved to the target page.
- Titles, descriptions, and robots directives come from **one shared registry**, so the server, schema, and hydrated client always agree. Before this branch, `/pricing` had three different titles.
- Each page sits under a **hub**, with visible breadcrumbs, matching `BreadcrumbList` schema, curated contextual links, and one shared footer directory.
- The broken **social share image** (third-party URL returning 403) is replaced. Stale product naming and accreditation-body terminology are corrected. Main CSS is **44% smaller**.

Nothing here guarantees rankings, AI citations, traffic, or leads. Measure it with technical health (Ahrefs re-crawl with JS off, Search Console coverage), qualified organic sessions, the `home_path_click` / `consultation_click` / `landing_page_cta_click` events, form submissions, and booked meetings.

**Production was not deployed or changed.** This PR is for review only.

## 2. Business objective

Help search engines and AI answer systems find and describe DefenseEye accurately, and turn qualified visitors into conversations. In practice that means four things:

1. Every valuable page is crawlable and connected.
2. Metadata and structured data are accurate and consistent.
3. Every page answers who DefenseEye serves, what it does, and what stays under human control, using only claims the site already makes.
4. Each buyer type has a clear next step.

## 3. Technical summary

| Item | Detail |
|---|---|
| Stack | React 19 + Vite 7 SPA (Wouter), Express server (`server/index.ts`) bundled with esbuild, Tailwind 4 + shadcn/ui, pnpm |
| Rendering | Client-rendered. The server injects per-route title, description, canonical, OG/Twitter, robots, JSON-LD, and a crawlable HTML fallback inside `#root`, which React replaces on load |
| Single sources of truth (new) | `shared/routeMetadata.ts` (title, description, robots), `shared/siteArchitecture.ts` (hubs, parents, breadcrumb names, footer), `shared/relatedLinks.ts` (contextual links), `shared/*Content.ts` (page text shared by React and the server fallback) |
| Production baseline | `origin/main` = `51108e4`; `deploy/update.sh` pulls `main` |

**Commit structure** (oldest first):

| Commit | Purpose |
|---|---|
| `be1773e` | **Pre-existing uncommitted work** found in the working tree before this pass, committed unchanged and labelled. It moves knowledge-hub article text into `shared/` and server-renders it, adds plain-link header/footer navigation to the server fallback, and also **edits knowledge-hub copy**: H1 years 2025→2026, and the certification-process guide retitled around the C3PAO assessment. Please review this commit on its own. One test fails at this commit and is fixed in the next. |
| `d26963f` | Unify route titles/descriptions in one shared registry; useSeo syncs canonical/OG/Twitter; two duplicate URLs 301'd |
| `befb0f7` | Hub-and-spoke architecture, real server-rendered content for every route, schema fixes |
| `1d81eb0` | Exclude 45 unused shadcn/ui components from Tailwind scanning (CSS 150 kB → 84 kB) |
| `df39507` | Homepage audience paths and "at a glance" Q&A, insight-page secondary CTA and tracking, robots.txt and llms.txt |
| `50570fa` | Remediation report (superseded by the final docs commit) |
| `bd08bf1` | Review fix: CMMCLens naming, Cyber AB terminology, stale year label, unqualified claims in ai-plugin.json |
| `7ab8f17` | Review fix: consolidate the duplicate sprint page; keep `/lp/` pages indexable with contextual links |
| `4a73cc8` | Review fix: self-hosted share image; breadcrumb/WebSite schema consistency; apex domain |
| `db66276` | Test that every internal link and CTA in source resolves to a live, non-redirecting route |
| `991ea77` | Remediation report (round 1) |
| `bf3f0ff` | Round 2: CMMC certification terminology corrected against 32 CFR Part 170 |
| `7677d92` | Round 2: timeless guide headings; schema dates match visible dates |
| `9d873bb` | Round 2: accessible lead forms and a skip-to-content link |
| `9fa18d0` | Round 2 report |
| `669d167` | Round 3: newsletter forms no longer claim subscriptions; truthful contact routing |
| `bf8c9e9` | Round 3: CMMC statements verified against primary sources; unverified durations, costs, pricing, trial, and performance claims removed; dead CTAs fixed |

Each review-fix commit was checked on its own: type-check and the full test suite pass at `bd08bf1`, `7ab8f17`, `4a73cc8`, `bf3f0ff`, `7677d92`, `9d873bb`, `669d167`, `bf8c9e9`, and the head.

**Not included:** the Ahrefs CSV export (diagnostic input, left untracked), `dist/` (gitignored build output), and any environment, deploy, or server configuration.

## 4. Changed files (63, against `51108e4`)

- **Shared SEO, architecture, and content data:** `shared/certificationProcessContent.ts` (added), `shared/cmmcLevelsContent.ts` (added), `shared/datasheetContent.ts` (added), `shared/evidenceMappingContent.ts` (added), `shared/homeContent.ts` (added), `shared/insightsContent.ts` (added), `shared/landingPageContent.ts` (added), `shared/relatedLinks.ts` (added), `shared/routeMetadata.ts` (added), `shared/seoRoutes.ts` (modified), `shared/siteArchitecture.ts` (added), `shared/solutionPageContent.ts` (added), `shared/sprsScoreContent.ts` (added), `shared/whatIsCmmcContent.ts` (added)
- **Server:** `server/copilot.ts` (modified), `server/index.ts` (modified)
- **Client components, hooks, and lib:** `client/src/App.tsx` (modified), `client/src/components/Breadcrumbs.tsx` (added), `client/src/components/Footer.tsx` (modified), `client/src/components/KnowledgeHubLayout.tsx` (modified), `client/src/components/NavBar.tsx` (modified), `client/src/components/NewsletterSignup.tsx` (added), `client/src/components/RelatedResources.tsx` (added), `client/src/hooks/useSeo.ts` (modified), `client/src/index.css` (modified), `client/src/lib/newsletter.ts` (added), `client/src/lib/tracking.ts` (modified)
- **Client pages:** `client/src/pages/Blog.tsx` (modified), `client/src/pages/BlogPost.tsx` (modified), `client/src/pages/CMMCArchitecturePage.tsx` (modified), `client/src/pages/CMMCReadinessSprint.tsx` (modified), `client/src/pages/ContactUs.tsx` (modified), `client/src/pages/Datasheets.tsx` (modified), `client/src/pages/DeliveryModel.tsx` (modified), `client/src/pages/Home.tsx` (modified), `client/src/pages/KnowledgeHub.tsx` (modified), `client/src/pages/LandingPage.tsx` (modified), `client/src/pages/SolutionPage.tsx` (modified), `client/src/pages/SprintGuide.tsx` (modified), `client/src/pages/SupplierReadiness.tsx` (modified), `client/src/pages/ThoughtLeadership.tsx` (modified), `client/src/pages/knowledge-hub/CMMCLevels.tsx` (modified), `client/src/pages/knowledge-hub/CertificationProcess.tsx` (modified), `client/src/pages/knowledge-hub/EvidenceMapping.tsx` (modified), `client/src/pages/knowledge-hub/SPRSScore.tsx` (modified), `client/src/pages/knowledge-hub/WhatIsCMMC.tsx` (modified)
- **Client data:** `client/src/data/blogPosts.ts` (modified), `client/src/data/companyFacts.ts` (modified)
- **Public files:** `client/public/.well-known/ai-plugin.json` (modified), `client/public/llms.txt` (modified), `client/public/og-default.png` (added), `client/public/robots.txt` (modified)
- **Tests:** `client/src/components/NewsletterSignup.test.tsx` (added), `client/src/lib/newsletter.test.ts` (added), `client/src/pages/ContactUs.a11y.test.tsx` (added), `server/css-sources.test.ts` (added), `server/internal-links.test.ts` (added), `server/route-metadata.test.ts` (added), `server/secure-ai-route.test.ts` (modified), `server/seo-routes.test.ts` (modified), `server/site-architecture.test.ts` (added)
- **Docs and root HTML:** `client/index.html` (modified), `docs/seo/2026-10-seo-geo-remediation.md` (added)

## 5. Routes

| Change | Routes |
|---|---|
| **Redirected (301, single hop)** | `/cmmc-readiness-sprint` → `/services/cmmc-readiness-sprint`; `/services` → `/services/cmmc-readiness-sprint`; `/solutions/microsoft-copilot-enablement` → `/solutions/microsoft-copilot-readiness` (each also with a trailing-slash variant). None of the three had internal links; the last two were not in the sitemap |
| **Added to sitemap** | `/contact`, `/terms` |
| **Removed from sitemap** | `/cmmc-readiness-sprint` (now a redirect) |
| **Marked noindex** | None. 404 responses keep `noindex, follow` as before |
| **New routes** | None (no pages created or deleted) |
| **Content or metadata changed** | Every public route has registry metadata and server-rendered content; see §8 for each title change |

The sitemap goes from 73 to 74 URLs (+2, −1).

## 6. Orphan-page outcomes: all 41 Ahrefs URLs

"New incoming links" lists distinct linking pages and their anchor text, taken from the actual server-rendered `<main>` content, plus sitewide header/footer links where present. Every URL had 0 incoming links in the Ahrefs crawl.

| # | Original URL | Current route status | Indexable / noindex | Incoming internal link added | Source page of new link | Anchor text | Redirect destination | Final status | Reason for exclusion, redirect, or noindex |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `/knowledge-hub/sprs-score` | 200 | Indexable | Yes (8 contextual pages) | `/blog/cmmc-poam-guide-what-assessors-want`<br>`/blog/how-to-improve-sprs-score-fast`<br>`/faq`<br>`/knowledge-hub`<br>+4 more pages | "How POA&M items affect your SPRS score"<br>"How SPRS scoring works"<br>"SPRS score guide"<br>"Understanding Your SPRS Score" | — | Fixed: linked in server HTML | — |
| 2 | `/knowledge-hub/certification-process` | 200 | Indexable | Yes (7 contextual pages) | `/blog/what-to-expect-c3pao-assessment`<br>`/cmmc-readiness-sprint-guide`<br>`/knowledge-hub`<br>`/knowledge-hub/cmmc-levels`<br>+3 more pages | "The CMMC certification process step by step"<br>"The CMMC certification process step by step"<br>"CMMC Certification Process"<br>"CMMC Certification Process Step-by-Step" | — | Fixed: linked in server HTML | — |
| 3 | `/blog/cmmc-consultant-red-flags` | 200 | Indexable | Yes (3 contextual pages) | `/blog`<br>`/blog/cmmc-level-2-small-business-guide`<br>`/pricing` | "CMMC Consultant Red Flags"<br>"Red flags when hiring a CMMC consultant"<br>"Red flags when hiring a CMMC consultant" | — | Fixed: linked in server HTML | — |
| 4 | `/blog/cmmc-poam-guide-what-assessors-want` | 200 | Indexable | Yes (6 contextual pages) | `/blog`<br>`/blog/how-to-improve-sprs-score-fast`<br>`/blog/what-to-expect-c3pao-assessment`<br>`/knowledge-hub/certification-process`<br>+2 more pages | "CMMC POA&M: What Assessors Look For"<br>"Writing a POA&M assessors accept"<br>"What assessors look for in a POA&M"<br>"What assessors look for in a POA&M" | — | Fixed: linked in server HTML | — |
| 5 | `/cmmc-readiness-sprint-guide` | 200 | Indexable | Yes (3 contextual pages) | `/blog/what-to-expect-c3pao-assessment`<br>`/knowledge-hub/certification-process`<br>`/services/cmmc-readiness-sprint` | "Prepare with a 4-week readiness sprint"<br>"4-week CMMC readiness sprint guide"<br>"4-Week CMMC Readiness Sprint Guide" | — | Fixed: linked in server HTML | — |
| 6 | `/datasheets` | 200 | Indexable | Yes (7 contextual pages + sitewide nav) | `/capability-statement`<br>`/datasheets/cmmc-compliance-automation`<br>`/datasheets/cmmclens`<br>`/datasheets/microsoft-copilot-readiness`<br>+3 more pages; sitewide header; sitewide footer | "DefenseEye datasheets"<br>"Datasheets"<br>"Datasheets"<br>"Datasheets" | — | Fixed: linked in server HTML | — |
| 7 | `/blog/cmmc-level-2-small-business-guide` | 200 | Indexable | Yes (4 contextual pages) | `/blog`<br>`/blog/cmmc-consultant-red-flags`<br>`/blog/cmmc-level-2-compliance-checklist-2025`<br>`/knowledge-hub/cmmc-levels` | "CMMC Level 2 for Small Businesses"<br>"CMMC Level 2 for small businesses"<br>"CMMC Level 2 for small businesses"<br>"CMMC Level 2 for small businesses" | — | Fixed: linked in server HTML | — |
| 8 | `/blog/what-counts-as-cui-plain-english-guide` | 200 | Indexable | Yes (5 contextual pages) | `/blog`<br>`/blog/gcc-high-vs-m365-commercial-cmmc`<br>`/industries/defense-industrial-base`<br>`/knowledge-hub/what-is-cmmc`<br>+1 more pages | "What Counts as CUI?"<br>"What counts as CUI?"<br>"What counts as CUI?"<br>"What counts as CUI?" | — | Fixed: linked in server HTML | — |
| 9 | `/pricing` | 200 | Indexable | Yes (7 contextual pages + sitewide nav) | `/blog/cmmc-consultant-red-flags`<br>`/blog/cmmc-level-2-small-business-guide`<br>`/cmmc`<br>`/cmmc-compliance-automation`<br>+3 more pages; sitewide footer | "CMMC readiness pricing"<br>"CMMC readiness pricing for small contractors"<br>"CMMC readiness pricing and engagement options"<br>"CMMC Readiness Pricing" | — | Fixed: linked in server HTML | — |
| 10 | `/privacy-policy` | 200 | Indexable | Yes (1 contextual page + sitewide nav) | `/`<br>sitewide header; sitewide footer | "Privacy Policy" | — | Fixed: linked in server HTML | — |
| 11 | `/blog/gcc-high-vs-m365-commercial-cmmc` | 200 | Indexable | Yes (4 contextual pages) | `/blog`<br>`/blog/what-counts-as-cui-plain-english-guide`<br>`/services/cmmc-scoping`<br>`/solutions/cloud-security` | "GCC High vs M365 Commercial for CMMC"<br>"Where CUI can live: GCC High vs M365 Commercial"<br>"Choosing GCC High or M365 Commercial for CUI"<br>"GCC High vs M365 Commercial for CMMC" | — | Fixed: linked in server HTML | — |
| 12 | `/datasheets/microsoft-copilot-readiness` | 200 | Indexable | Yes (3 contextual pages) | `/datasheets`<br>`/microsoft-ecosystem`<br>`/solutions/microsoft-copilot-readiness` | "Microsoft Copilot Readiness Datasheet"<br>"Microsoft Copilot readiness datasheet"<br>"Microsoft Copilot readiness datasheet" | — | Fixed: linked in server HTML | — |
| 13 | `/delivery-model` | 200 | Indexable | Yes (5 contextual pages + sitewide nav) | `/capability-statement`<br>`/pricing`<br>`/representative-engagements`<br>`/supplier-readiness`<br>+1 more pages; sitewide header; sitewide footer | "Engagement formats"<br>"DefenseEye engagement formats"<br>"How engagements are structured"<br>"Delivery Model" | — | Fixed: linked in server HTML | — |
| 14 | `/insights/implement-ai-governance` | 200 | Indexable | Yes (5 contextual pages) | `/industries/financial-services-credit-unions`<br>`/insights/what-is-nist-ai-rmf`<br>`/knowledge-hub`<br>`/secure-ai-adoption`<br>+1 more pages | "How to implement AI governance in practice"<br>"Practical steps to implement AI governance"<br>"How can organizations implement AI governance?"<br>"Practical steps to implement AI governance" | — | Fixed: linked in server HTML | — |
| 15 | `/datasheets/cmmc-compliance-automation` | 200 | Indexable | Yes (2 contextual pages) | `/cmmc-compliance-automation`<br>`/datasheets` | "CMMC & compliance automation datasheet"<br>"CMMC & Compliance Automation Datasheet" | — | Fixed: linked in server HTML | — |
| 16 | `/lp/microsoft-supplier-ai-consulting` | 200 | Indexable | Yes (2 contextual pages) | `/datasheets/supplier-readiness`<br>`/supplier-readiness` | "Supplier capability review for Microsoft-centered environments"<br>"Minority-owned supplier support for Microsoft-centered programs" | — | Fixed: linked in server HTML | — |
| 17 | `/lp/ai-governance-consulting` | 200 | Indexable | Yes (2 contextual pages) | `/insights/implement-ai-governance`<br>`/solutions/ai-governance` | "Start with an AI governance readiness assessment"<br>"AI governance readiness assessment" | — | Fixed: linked in server HTML | — |
| 18 | `/solutions/compliance-automation` | 200 | Indexable | Yes (6 contextual pages + sitewide nav) | `/cmmc-compliance-automation`<br>`/insights/ai-audit-readiness`<br>`/insights/ai-automated-evidence-collection`<br>`/insights/continuous-compliance-monitoring`<br>+2 more pages; sitewide footer | "Compliance Automation Consulting"<br>"Compliance Automation Consulting"<br>"Compliance Automation Consulting"<br>"Compliance Automation Consulting" | — | Fixed: linked in server HTML | — |
| 19 | `/insights/security-copilot-cybersecurity-operations` | 200 | Indexable | Yes (4 contextual pages) | `/microsoft-ecosystem`<br>`/solutions/ai-security`<br>`/solutions/cybersecurity-risk`<br>`/solutions/microsoft-copilot-readiness` | "Security Copilot for cybersecurity operations"<br>"Using Security Copilot in security operations"<br>"Security Copilot for Security Operations"<br>"Security Copilot for cybersecurity operations" | — | Fixed: linked in server HTML | — |
| 20 | `/industries/defense-industrial-base` | 200 | Indexable | Yes (2 contextual pages + sitewide nav) | `/`<br>`/cmmc-compliance-automation`<br>sitewide footer | "Prepare for CMMC"<br>"Defense Industrial Base" | — | Fixed: linked in server HTML | — |
| 21 | `/datasheets/cmmclens` | 200 | Indexable | Yes (3 contextual pages) | `/cmmclens`<br>`/datasheets`<br>`/solutions/cmmclens-platform` | "CMMCLens product sheet"<br>"CMMCLens Product Sheet"<br>"CMMCLens product sheet" | — | Fixed: linked in server HTML | — |
| 22 | `/lp/compliance-automation` | 200 | Indexable | Yes (2 contextual pages) | `/insights/ai-audit-readiness`<br>`/solutions/compliance-automation` | "Plan compliance automation for evidence and reporting"<br>"Compliance automation roadmap and CMMCLens fit assessment" | — | Fixed: linked in server HTML | — |
| 23 | `/solutions/cmmclens-platform` | 200 | Indexable | Yes (3 contextual pages) | `/cmmc-evidence-automation`<br>`/cmmclens`<br>`/datasheets/cmmclens` | "CMMCLens platform overview"<br>"CMMCLens Platform Overview"<br>"CMMCLens platform overview" | — | Fixed: linked in server HTML | — |
| 24 | `/lp/secure-ai-adoption` | 200 | Indexable | Yes (2 contextual pages) | `/secure-ai-adoption`<br>`/solutions/ai-transformation` | "Secure AI adoption readiness review"<br>"Secure AI adoption readiness review" | — | Fixed: linked in server HTML | — |
| 25 | `/solutions/cloud-security` | 200 | Indexable | Yes (5 contextual pages + sitewide nav) | `/attacksense`<br>`/blog/gcc-high-vs-m365-commercial-cmmc`<br>`/lp/azure-cloud-security`<br>`/microsoft-ecosystem`<br>+1 more pages; sitewide footer | "Microsoft cloud security review"<br>"Azure and GCC High cloud security consulting"<br>"Microsoft Cloud Security"<br>"Azure and GCC High cloud security consulting" | — | Fixed: linked in server HTML | — |
| 26 | `/industries/financial-services-credit-unions` | 200 | Indexable | Yes (5 contextual pages + sitewide nav) | `/`<br>`/insights/implement-ai-governance`<br>`/secure-ai-adoption`<br>`/solutions/ai-governance`<br>+1 more pages; sitewide header; sitewide footer | "See the financial services path"<br>"AI governance for financial institutions"<br>"Financial Services & Credit Unions"<br>"AI risk management for financial institutions" | — | Fixed: linked in server HTML | — |
| 27 | `/lp/cmmc-evidence-automation` | 200 | Indexable | Yes (2 contextual pages) | `/cmmc-evidence-automation`<br>`/insights/ai-automated-evidence-collection` | "Evidence automation implementation with CMMCLens"<br>"Put CMMC evidence automation in place" | — | Fixed: linked in server HTML | — |
| 28 | `/cmmc-readiness-sprint` | 301 (single hop) | — (redirect) | No — links point to the destination | — | — | `/services/cmmc-readiness-sprint` (200, self-canonical, in sitemap) | Consolidated | Thin template page with the same intent and booking CTA as the full fixed-scope sprint offer; its one unique FAQ moved to the destination |
| 29 | `/datasheets/supplier-readiness` | 200 | Indexable | Yes (2 contextual pages) | `/datasheets`<br>`/supplier-readiness` | "Supplier Readiness Datasheet"<br>"Supplier readiness datasheet" | — | Fixed: linked in server HTML | — |
| 30 | `/insights/ai-automated-evidence-collection` | 200 | Indexable | Yes (5 contextual pages) | `/cmmc-evidence-automation`<br>`/insights/continuous-compliance-monitoring`<br>`/knowledge-hub`<br>`/knowledge-hub/evidence-mapping`<br>+1 more pages | "How AI can automate evidence collection"<br>"AI-automated evidence collection"<br>"How can AI automate evidence collection?"<br>"How AI can automate evidence collection" | — | Fixed: linked in server HTML | — |
| 31 | `/lp/cmmclens-demo` | 200 | Indexable | Yes (2 contextual pages) | `/cmmclens`<br>`/solutions/cmmclens-platform` | "CMMCLens demo and evidence automation fit review"<br>"Request a CMMCLens demo and fit review" | — | Fixed: linked in server HTML | — |
| 32 | `/insights/continuous-compliance-monitoring` | 200 | Indexable | Yes (4 contextual pages) | `/insights/ai-audit-readiness`<br>`/insights/what-is-rmf-readiness`<br>`/solutions/compliance-automation`<br>`/solutions/cybersecurity-risk` | "Continuous compliance monitoring"<br>"Continuous monitoring for compliance programs"<br>"Continuous Compliance Monitoring"<br>"Continuous compliance monitoring explained" | — | Fixed: linked in server HTML | — |
| 33 | `/lp/cmmc-compliance-automation` | 200 | Indexable | Yes (2 contextual pages) | `/cmmc`<br>`/cmmc-compliance-automation` | "CMMC compliance automation sprint"<br>"CMMC compliance automation sprint" | — | Fixed: linked in server HTML | — |
| 34 | `/lp/azure-cloud-security` | 200 | Indexable | Yes (2 contextual pages) | `/microsoft-ecosystem`<br>`/solutions/cloud-security` | "Azure cloud security and compliance review"<br>"Azure security and compliance review" | — | Fixed: linked in server HTML | — |
| 35 | `/insights/ai-audit-readiness` | 200 | Indexable | Yes (2 contextual pages) | `/insights/ai-automated-evidence-collection`<br>`/solutions/compliance-automation` | "How AI can improve audit readiness"<br>"AI and Audit Readiness" | — | Fixed: linked in server HTML | — |
| 36 | `/lp/microsoft-copilot-readiness` | 200 | Indexable | Yes (2 contextual pages) | `/datasheets/microsoft-copilot-readiness`<br>`/solutions/microsoft-copilot-readiness` | "Microsoft Copilot readiness assessment"<br>"Copilot governance assessment" | — | Fixed: linked in server HTML | — |
| 37 | `/microsoft-ecosystem` | 200 | Indexable | Yes (5 contextual pages + sitewide nav) | `/datasheets/microsoft-copilot-readiness`<br>`/insights/security-copilot-cybersecurity-operations`<br>`/solutions/cloud-security`<br>`/solutions/microsoft-copilot-readiness`<br>+1 more pages; sitewide footer | "Microsoft ecosystem experience"<br>"Microsoft security and cloud experience"<br>"DefenseEye's Microsoft ecosystem experience"<br>"DefenseEye experience in Microsoft-centered environments" | — | Fixed: linked in server HTML | — |
| 38 | `/lp/cmmc-level-2-readiness` | 200 | Indexable | Yes (2 contextual pages) | `/cmmc-level-2-readiness`<br>`/insights/what-is-cmmc-level-2` | "CMMC Level 2 readiness assessment"<br>"Assess your CMMC Level 2 readiness" | — | Fixed: linked in server HTML | — |
| 39 | `/datasheets/secure-ai-adoption` | 200 | Indexable | Yes (3 contextual pages) | `/datasheets`<br>`/secure-ai-adoption`<br>`/solutions/ai-governance` | "Secure AI Adoption Datasheet"<br>"Secure AI adoption one-page datasheet"<br>"Secure AI adoption datasheet" | — | Fixed: linked in server HTML | — |
| 40 | `/services/cmmc-scoping` | 200 | Indexable | Yes (8 contextual pages + sitewide nav) | `/blog/what-counts-as-cui-plain-english-guide`<br>`/cmmc`<br>`/cmmc-compliance-automation`<br>`/cmmc-readiness-sprint-guide`<br>+4 more pages; sitewide footer | "Define your CUI boundary with CMMC scoping"<br>"CMMC scoping service"<br>"CMMC Scoping"<br>"CMMC scoping service" | — | Fixed: linked in server HTML | — |
| 41 | `/insights/what-is-rmf-readiness` | 200 | Indexable | Yes (3 contextual pages) | `/insights/continuous-compliance-monitoring`<br>`/nist-800-171`<br>`/solutions/compliance-automation` | "Continuous monitoring in RMF readiness"<br>"RMF readiness for federal systems"<br>"What Is RMF Readiness?" | — | Fixed: linked in server HTML | — |

**Totals:** 40 fixed and indexable, all with ≥ 2 raw-HTML inlinks. 1 consolidated by 301. 0 excluded via noindex.

## 7. Hub-and-spoke internal-linking map

Each page's parent determines its breadcrumb, its `BreadcrumbList`, and the hub's "In this section" list. Curated cross-links (`shared/relatedLinks.ts`) connect related answers, services, and offers across hubs, for example insight → service → focused offer.

| Hub | Pages in the hub (parent → child) |
|---|---|
| Home (`/`) | `/secure-ai-adoption`, `/solutions/cybersecurity-risk`, `/cmmc-compliance-automation`, `/supplier-readiness`, `/why-defenseeye`, `/contact`, `/support`, `/privacy-policy`, `/terms`, `/knowledge-hub`, `/blog` |
| Secure AI Adoption (`/secure-ai-adoption`) | `/solutions/ai-governance` (→ `/insights/implement-ai-governance`, `/insights/what-is-nist-ai-rmf`, `/lp/ai-governance-consulting`), `/solutions/ai-transformation`, `/solutions/ai-security`, `/solutions/microsoft-copilot-readiness` (→ `/lp/microsoft-copilot-readiness`), `/industries/financial-services-credit-unions`, `/lp/secure-ai-adoption` |
| Cybersecurity Risk (`/solutions/cybersecurity-risk`) | `/attacksense` (→ `/attacksense/docs`), `/solutions/cloud-security` (→ `/lp/azure-cloud-security`), `/insights/security-copilot-cybersecurity-operations` |
| CMMC & Compliance Automation (`/cmmc-compliance-automation`) | `/industries/defense-industrial-base`, `/cmmc`, `/cmmc-level-2-readiness` (→ `/lp/cmmc-level-2-readiness`), `/nist-800-171`, `/services/cmmc-readiness-sprint` (→ `/cmmc-readiness-sprint-guide`), `/services/cmmc-scoping`, `/cmmc-evidence-automation` (→ `/lp/cmmc-evidence-automation`), `/solutions/compliance-automation` (→ `/insights/ai-automated-evidence-collection`, `/insights/continuous-compliance-monitoring`, `/insights/ai-audit-readiness`, `/insights/what-is-rmf-readiness`, `/lp/compliance-automation`), `/cmmclens` (→ `/solutions/cmmclens-platform`, `/lp/cmmclens-demo`), `/pricing`, `/faq`, `/lp/cmmc-compliance-automation` |
| CMMC Knowledge Hub (`/knowledge-hub`) | `/knowledge-hub/what-is-cmmc`, `/knowledge-hub/cmmc-levels`, `/knowledge-hub/evidence-mapping`, `/knowledge-hub/sprs-score`, `/knowledge-hub/certification-process`, `/insights/what-is-cmmc-level-2` |
| CMMC Blog (`/blog`) | `/blog/cmmc-level-2-compliance-checklist-2025`, `/blog/how-to-improve-sprs-score-fast`, `/blog/what-to-expect-c3pao-assessment`, `/blog/what-counts-as-cui-plain-english-guide`, `/blog/cmmc-level-2-small-business-guide`, `/blog/gcc-high-vs-m365-commercial-cmmc`, `/blog/cmmc-poam-guide-what-assessors-want`, `/blog/cmmc-consultant-red-flags` |
| Supplier Readiness (`/supplier-readiness`) | `/capability-statement`, `/delivery-model`, `/representative-engagements`, `/microsoft-ecosystem`, `/datasheets`, `/lp/microsoft-supplier-ai-consulting` |
| Datasheets (`/datasheets`) | `/datasheets/secure-ai-adoption`, `/datasheets/cmmc-compliance-automation`, `/datasheets/cmmclens`, `/datasheets/microsoft-copilot-readiness`, `/datasheets/supplier-readiness` |

Sitewide footer groups (React and server fallback): Secure AI · Cybersecurity & Cloud · CMMC & Compliance · Industries · Resources · Company.

## 8. Title and meta-description changes

"Before" is what production (`51108e4`) serves; client-side titles also diverged on most routes before. Only routes whose title, description length, or sitemap status changed are listed. All titles are now unique and ≤ 66 characters, and all descriptions are 90–165 characters (test-enforced).

| Route | Before title (len) | After title (len) | Desc. len before → after | Sitemap before → after | Robots after |
|---|---|---|---|---|---|
| `/` | DefenseEye \| Secure Agentic AI Implementation (45) | DefenseEye \| Secure Agentic AI for Regulated Organizations (58) | 188 → 165 | Y → Y | index, follow |
| `/attacksense` | AttackSense \| DefenseEye Attack Surface and Remediation Intelligence (68) | AttackSense Attack Surface Intelligence \| DefenseEye (52) | 173 → 160 | Y → Y | index, follow |
| `/attacksense/docs` | AttackSense Guide \| DefenseEye (30) | AttackSense Quick Start Guide \| DefenseEye (42) | 102 → 114 | Y → Y | index, follow |
| `/blog` | CMMC Blog for Defense Contractors \| DefenseEye.ai (49) | CMMC Blog: Practical Guides for Defense Contractors \| DefenseEye (64) | 129 → 149 | Y → Y | index, follow |
| `/blog/cmmc-consultant-red-flags` | 7 Red Flags When Hiring a CMMC Consultant \| DefenseEye.ai (57) | 7 Red Flags When Hiring a CMMC Consultant \| DefenseEye (54) | 123 → 134 | Y → Y | index, follow |
| `/blog/cmmc-level-2-compliance-checklist-2025` | CMMC Level 2 Checklist (2025) \| DefenseEye (42) | CMMC Level 2 Compliance Checklist (110 Controls) \| DefenseEye (61) | 131 → 146 | Y → Y | index, follow |
| `/blog/cmmc-level-2-small-business-guide` | CMMC Level 2 for Small Business \| DefenseEye (44) | CMMC Level 2 for Small Businesses: What You Need \| DefenseEye (61) | 141 → 141 | Y → Y | index, follow |
| `/blog/cmmc-poam-guide-what-assessors-want` | CMMC POA&M: What Assessors Actually Look For \| DefenseEye.ai (60) | CMMC POA&M: What Assessors Actually Look For \| DefenseEye (57) | 136 → 130 | Y → Y | index, follow |
| `/blog/gcc-high-vs-m365-commercial-cmmc` | GCC High vs M365 for CMMC \| DefenseEye (38) | GCC High vs M365 Commercial for CMMC Level 2 \| DefenseEye (57) | 130 → 138 | Y → Y | index, follow |
| `/blog/how-to-improve-sprs-score-fast` | Improve SPRS Score Fast \| DefenseEye (36) | How to Improve Your SPRS Score Fast \| DefenseEye (48) | 139 → 138 | Y → Y | index, follow |
| `/blog/what-counts-as-cui-plain-english-guide` | What Counts as CUI? \| DefenseEye (32) | What Counts as CUI? A Plain-English Guide \| DefenseEye (54) | 129 → 129 | Y → Y | index, follow |
| `/blog/what-to-expect-c3pao-assessment` | C3PAO Assessment Walkthrough \| DefenseEye (41) | What to Expect in a C3PAO Assessment \| DefenseEye (49) | 130 → 144 | Y → Y | index, follow |
| `/capability-statement` | DefenseEye Capability Statement \| AI, Cybersecurity, CMMC, and Compliance Automation (84) | DefenseEye Capability Statement: AI, Cyber & CMMC (49) | 202 → 147 | Y → Y | index, follow |
| `/cmmc` | CMMC Readiness, Evidence Automation, and Advisory Support \| DefenseEye (70) | CMMC Readiness, Evidence & Advisory Support \| DefenseEye (56) | 137 → 137 | Y → Y | index, follow |
| `/cmmc-compliance-automation` | CMMC Compliance Automation \| DefenseEye CCP-Led CMMC Readiness and CMMCLens (75) | CMMC Compliance Automation & CCP-Led Readiness \| DefenseEye (59) | 182 → 139 | Y → Y | index, follow |
| `/cmmc-evidence-automation` | CMMC Evidence Automation \| DefenseEye (37) | CMMC Evidence Automation & Traceability \| DefenseEye (52) | 121 → 130 | Y → Y | index, follow |
| `/cmmc-level-2-readiness` | CMMC Level 2 Readiness Consulting and Automation \| DefenseEye (61) | CMMC Level 2 Readiness Consulting \| DefenseEye (46) | 130 → 132 | Y → Y | index, follow |
| `/cmmc-readiness-sprint` | CMMC Readiness Sprint \| DefenseEye (34) | — (301 redirect) (0) | 119 → 0 | Y → N | — |
| `/cmmc-readiness-sprint-guide` | 4-Week CMMC Readiness Sprint Guide \| DefenseEye.ai (50) | 4-Week CMMC Readiness Sprint Guide \| DefenseEye (47) | 133 → 135 | Y → Y | index, follow |
| `/cmmclens` | CMMCLens Compliance Automation Platform \| DefenseEye (52) | CMMCLens CMMC & NIST 800-171 Compliance Platform \| DefenseEye (61) | 223 → 162 | Y → Y | index, follow |
| `/contact` | Contact DefenseEye \| AI Governance, Cybersecurity, Supplier, and Compliance Inquiries (85) | Contact DefenseEye: AI, Cybersecurity & Compliance Inquiries (60) | 210 → 160 | N → Y | index, follow |
| `/datasheets` | DefenseEye Datasheets \| AI Adoption, CMMC Automation, CMMCLens, Copilot, Supplier Readiness (91) | DefenseEye Datasheets: AI, CMMC, CMMCLens & Copilot (51) | 154 → 145 | Y → Y | index, follow |
| `/datasheets/cmmc-compliance-automation` | CMMC & Compliance Automation Datasheet \| DefenseEye (51) | CMMC & Compliance Automation Datasheet \| DefenseEye (51) | 137 → 125 | Y → Y | index, follow |
| `/datasheets/cmmclens` | CMMCLens Product Sheet \| DefenseEye (35) | CMMCLens Product Sheet \| DefenseEye (35) | 151 → 148 | Y → Y | index, follow |
| `/datasheets/microsoft-copilot-readiness` | Microsoft Copilot Readiness Datasheet \| DefenseEye (50) | Microsoft Copilot Readiness Datasheet \| DefenseEye (50) | 151 → 139 | Y → Y | index, follow |
| `/datasheets/secure-ai-adoption` | Secure AI Adoption Datasheet \| DefenseEye (41) | Secure AI Adoption Datasheet \| DefenseEye (41) | 126 → 143 | Y → Y | index, follow |
| `/datasheets/supplier-readiness` | DefenseEye Supplier Readiness Datasheet (39) | Supplier Readiness Datasheet \| DefenseEye (41) | 155 → 150 | Y → Y | index, follow |
| `/delivery-model` | DefenseEye Delivery Model \| AI, Cybersecurity, CMMC, and Compliance Automation Engagements (90) | Delivery Model & Engagement Formats \| DefenseEye (48) | 214 → 147 | Y → Y | index, follow |
| `/faq` | CMMC FAQ — Common Questions Answered \| DefenseEye (49) | CMMC FAQ: Common Questions Answered \| DefenseEye (48) | 150 → 141 | Y → Y | index, follow |
| `/industries/defense-industrial-base` | Cybersecurity and Compliance Support for the Defense Industrial Base \| DefenseEye (81) | Defense Industrial Base Cybersecurity & CMMC \| DefenseEye (57) | 206 → 155 | Y → Y | index, follow |
| `/industries/financial-services-credit-unions` | Secure AI for Financial Services and Credit Unions \| DefenseEye (63) | Secure AI for Financial Services & Credit Unions \| DefenseEye (61) | 196 → 154 | Y → Y | index, follow |
| `/insights/ai-audit-readiness` | How can AI improve audit readiness? \| DefenseEye (48) | How AI Can Improve Audit Readiness \| DefenseEye (47) | 147 → 144 | Y → Y | index, follow |
| `/insights/ai-automated-evidence-collection` | How can AI automate evidence collection? \| DefenseEye (53) | How AI Can Automate Compliance Evidence Collection \| DefenseEye (63) | 167 → 156 | Y → Y | index, follow |
| `/insights/continuous-compliance-monitoring` | What is continuous compliance monitoring? \| DefenseEye (54) | What Is Continuous Compliance Monitoring? \| DefenseEye (54) | 155 → 143 | Y → Y | index, follow |
| `/insights/implement-ai-governance` | How can organizations implement AI governance? \| DefenseEye (59) | How to Implement AI Governance: Practical Steps \| DefenseEye (60) | 144 → 149 | Y → Y | index, follow |
| `/insights/security-copilot-cybersecurity-operations` | How can Security Copilot improve cybersecurity operations? \| DefenseEye (71) | Security Copilot for Cybersecurity Operations \| DefenseEye (58) | 146 → 151 | Y → Y | index, follow |
| `/insights/what-is-cmmc-level-2` | What is CMMC Level 2? \| DefenseEye (34) | What Is CMMC Level 2? Requirements Explained \| DefenseEye (57) | 150 → 143 | Y → Y | index, follow |
| `/insights/what-is-nist-ai-rmf` | What is NIST AI RMF? \| DefenseEye (33) | What Is the NIST AI RMF? Plain-English Guide \| DefenseEye (57) | 131 → 133 | Y → Y | index, follow |
| `/insights/what-is-rmf-readiness` | What is RMF readiness? \| DefenseEye (35) | What Is RMF Readiness? A Practical Definition \| DefenseEye (58) | 146 → 136 | Y → Y | index, follow |
| `/knowledge-hub` | CMMC Knowledge Hub \| DefenseEye (31) | CMMC Knowledge Hub: Guides for DoD Contractors \| DefenseEye (59) | 122 → 139 | Y → Y | index, follow |
| `/knowledge-hub/certification-process` | CMMC Certification Process Step-by-Step (2025) \| DefenseEye.ai (62) | CMMC Level 2 Certification Process Step by Step \| DefenseEye (60) | 117 → 140 | Y → Y | index, follow |
| `/knowledge-hub/cmmc-levels` | CMMC Level 1 vs Level 2: Which Do You Need? (2025) \| DefenseEye.ai (66) | CMMC Level 1 vs Level 2: Which Do You Need? \| DefenseEye (56) | 118 → 149 | Y → Y | index, follow |
| `/knowledge-hub/evidence-mapping` | Automated NIST 800-171 Evidence Mapping for CMMC \| DefenseEye.ai (64) | NIST 800-171 Evidence Mapping for CMMC \| DefenseEye (51) | 115 → 152 | Y → Y | index, follow |
| `/knowledge-hub/sprs-score` | SPRS Score Guide \| DefenseEye (29) | SPRS Score: How to Calculate & Improve It \| DefenseEye (54) | 128 → 129 | Y → Y | index, follow |
| `/knowledge-hub/what-is-cmmc` | What Is CMMC 2.0? \| DefenseEye (30) | What Is CMMC? A Complete Guide for DoD Contractors \| DefenseEye (63) | 117 → 142 | Y → Y | index, follow |
| `/lp/ai-governance-consulting` | AI Governance Consulting for Regulated Organizations \| DefenseEye (65) | AI Governance Readiness Assessment \| DefenseEye (47) | 122 → 122 | Y → Y | index, follow |
| `/lp/azure-cloud-security` | Azure Cloud Security and Compliance Review \| DefenseEye (55) | Azure Cloud Security & Compliance Review \| DefenseEye (53) | 129 → 129 | Y → Y | index, follow |
| `/lp/cmmc-compliance-automation` | CMMC Compliance Automation for Evidence and Readiness \| DefenseEye (66) | CMMC Compliance Automation Sprint \| DefenseEye (46) | 135 → 135 | Y → Y | index, follow |
| `/lp/cmmc-level-2-readiness` | CMMC Level 2 Readiness Consulting \| DefenseEye (46) | CMMC Level 2 Readiness Assessment \| DefenseEye (46) | 133 → 133 | Y → Y | index, follow |
| `/lp/cmmclens-demo` | CMMCLens Demo for CMMC Evidence Automation \| DefenseEye (55) | Request a CMMCLens Demo \| DefenseEye (36) | 141 → 141 | Y → Y | index, follow |
| `/lp/compliance-automation` | Compliance Automation for Evidence and Readiness Reporting \| DefenseEye (71) | Compliance Automation for Evidence & Reporting \| DefenseEye (59) | 131 → 131 | Y → Y | index, follow |
| `/lp/microsoft-supplier-ai-consulting` | Minority-Owned AI Governance and Cybersecurity Supplier \| DefenseEye (68) | Minority-Owned AI & Cybersecurity Supplier \| DefenseEye (55) | 139 → 139 | Y → Y | index, follow |
| `/lp/secure-ai-adoption` | Secure AI Adoption Consulting for Regulated Teams \| DefenseEye (62) | Secure AI Adoption Consulting for Regulated Teams \| DefenseEye (62) | 154 → 142 | Y → Y | index, follow |
| `/microsoft-ecosystem` | Microsoft Ecosystem Experience \| DefenseEye AI Governance, Copilot, Azure Security, and Compliance (98) | Microsoft Ecosystem: Copilot, Azure & Compliance \| DefenseEye (61) | 180 → 154 | Y → Y | index, follow |
| `/nist-800-171` | NIST SP 800-171 Readiness and Compliance Automation \| DefenseEye (64) | NIST SP 800-171 Readiness & Compliance Automation \| DefenseEye (62) | 133 → 140 | Y → Y | index, follow |
| `/pricing` | CMMC Readiness Cost & Pricing \| DefenseEye.ai (45) | CMMC Readiness Pricing & Engagement Options \| DefenseEye (56) | 143 → 153 | Y → Y | index, follow |
| `/privacy-policy` | Privacy Policy \| DefenseEye (27) | Privacy Policy \| DefenseEye (27) | 115 → 101 | Y → Y | index, follow |
| `/representative-engagements` | Representative Engagements for AI, Cybersecurity, and Compliance \| DefenseEye.ai (80) | Representative AI, Cyber & CMMC Engagements \| DefenseEye (56) | 138 → 153 | Y → Y | index, follow |
| `/secure-ai-adoption` | Secure Agentic AI Consulting \| DefenseEye (41) | Secure Agentic AI Readiness & Implementation \| DefenseEye (57) | 157 → 157 | Y → Y | index, follow |
| `/services` | CMMC Readiness Sprint \| DefenseEye.ai (37) | — (301 redirect) (0) | 122 → 0 | N → N | — |
| `/services/cmmc-readiness-sprint` | CMMC Readiness Sprint \| DefenseEye.ai (37) | Fixed-Scope CMMC Readiness Sprint for DoD Contractors \| DefenseEye (66) | 122 → 142 | Y → Y | index, follow |
| `/services/cmmc-scoping` | CMMC Scoping \| Define Your CUI Boundary \| DefenseEye (52) | CMMC Scoping: Define Your CUI Boundary \| DefenseEye (51) | 196 → 147 | Y → Y | index, follow |
| `/solutions/ai-governance` | AI Governance and NIST AI RMF Consulting \| DefenseEye (53) | AI Governance & NIST AI RMF Consulting \| DefenseEye (51) | 161 → 152 | Y → Y | index, follow |
| `/solutions/ai-security` | AI Security and Generative AI Risk Consulting \| DefenseEye (58) | AI Security & Generative AI Risk Consulting \| DefenseEye (56) | 173 → 157 | Y → Y | index, follow |
| `/solutions/ai-transformation` | AI Transformation Consulting and Adoption Roadmaps \| DefenseEye (63) | Secure AI Transformation & Adoption Roadmaps \| DefenseEye (57) | 182 → 145 | Y → Y | index, follow |
| `/solutions/cloud-security` | Microsoft Cloud Security and Compliance Consulting \| DefenseEye (63) | Azure & GCC High Cloud Security Consulting \| DefenseEye (55) | 177 → 152 | Y → Y | index, follow |
| `/solutions/cmmclens-platform` | CMMCLens Platform \| Compliance Evidence Automation \| DefenseEye (63) | CMMCLens for Compliance Evidence Automation \| DefenseEye (56) | 196 → 147 | Y → Y | index, follow |
| `/solutions/compliance-automation` | Compliance Automation Consulting \| DefenseEye (45) | Compliance Evidence Automation Consulting \| DefenseEye (54) | 180 → 146 | Y → Y | index, follow |
| `/solutions/cybersecurity-risk` | Cybersecurity and Risk Consulting \| DefenseEye (46) | Cybersecurity Risk Consulting for Regulated Teams \| DefenseEye (62) | 173 → 158 | Y → Y | index, follow |
| `/solutions/microsoft-copilot-enablement` | Microsoft Copilot Enablement and Governance \| DefenseEye (56) | — (301 redirect) (0) | 146 → 0 | N → N | — |
| `/solutions/microsoft-copilot-readiness` | Microsoft Copilot Readiness Consulting \| DefenseEye (51) | Microsoft Copilot Readiness Consulting \| DefenseEye (51) | 165 → 145 | Y → Y | index, follow |
| `/supplier-readiness` | DefenseEye Supplier Readiness \| AI, Cybersecurity, CMMC, and Microsoft Cloud Consulting (87) | Supplier Readiness: Minority-Owned AI & Cyber Firm \| DefenseEye (63) | 230 → 151 | Y → Y | index, follow |
| `/support` | Support \| DefenseEye (20) | Customer & Product Support \| DefenseEye (39) | 141 → 155 | Y → Y | index, follow |
| `/terms` | Terms of Service \| DefenseEye (29) | Terms of Service \| DefenseEye (29) | 106 → 106 | N → Y | index, follow |
| `/why-defenseeye` | Why DefenseEye \| Secure AI, Cybersecurity and CMMC Practitioners (64) | Why DefenseEye: Practitioner-Led Secure AI & Compliance (55) | 242 → 159 | Y → Y | index, follow |

## 9. Schema changes

- One `Organization` (`https://defenseeye.ai/#organization`: name, URL, logo; plus Redmond WA address, email, and LinkedIn on the homepage) and one `WebSite` node on every page, so all `@id` references resolve.
- `BreadcrumbList` follows the hub trail; item names match the visible breadcrumb (test-enforced).
- `Article` (knowledge hub, insights) and `BlogPosting` (blog): headline ≤ 110 characters, author, publisher, image (new 1200×630 share card), `datePublished` (blog only) and `dateModified`.
- `FAQPage` only where the Q&A is visible on the page: homepage, solution pages, insights, knowledge-hub articles. A test checks every question appears in the HTML.
- `SoftwareApplication.applicationCategory` uses the schema.org value `SecurityApplication`.
- **No pricing, ratings, or reviews** in any schema; a test enforces this. CMMCLens's client-side `Offer` (Marketplace URL, no price) is pre-existing and is replaced at runtime by the route schema.
- Validation (live server, 74 pages): 0 errors. Per-route types are in `docs/seo/2026-10-seo-geo-remediation.md`.

## 10. Sitemap and robots

- Sitemap: 74 URLs, well-formed XML, each returning 200 with `index, follow` and a self-referencing canonical. A test requires every indexable registered route to be listed and every listed URL to be indexable.
- `robots.txt`: replaced the non-existent `Claude-Bot` user agent with `ClaudeBot`, `Claude-SearchBot`, and `Claude-User`, and referenced `llms.txt`. Nothing is disallowed (unchanged policy).
- `llms.txt` is labelled as a supplementary summary, mirrors the homepage answers, lists only live indexable URLs (test-enforced), and keeps every published claim boundary. It does not replace the sitemap, HTML, metadata, or schema.

## 11. Redirect changes

Three consolidation redirects were added (§5). Live check: all legacy and consolidation redirects resolve in one hop to a 200. There are no chains or loops, and no internal link in source points at a redirecting URL (test-enforced).

## 12. Conversion and CTA changes

| Where | Change | Verified |
|---|---|---|
| Homepage | "Find your starting point": five audience paths (financial services & credit unions; regulated teams adopting AI/Copilot; security & risk leaders; defense suppliers; procurement & partners) | Click fires `home_path_click`; each card links to a live page |
| Homepage | "DefenseEye at a glance" Q&A: what it is, who it serves, problems, engagement model, **what stays under human control**, governance and auditability | Every sentence restates facts already published on the site |
| Insight pages | Secondary next step to the parent service page; the booking button now fires `consultation_click` (it fired nothing before) | Event observed |
| Solution, insight, datasheet, CMMC, sprint guide, delivery model, supplier pages | Related-resources block and the full footer, where these templates previously had none | Links validated |
| `/lp/*` | Primary CTA (booking) and secondary CTA (capability statement) unchanged; CMMCLens demo still uses the CMMCLens calendar | `landing_page_cta_click` fires |
| `/services/cmmc-readiness-sprint` | Gains the FAQ moved from the consolidated page | Visible |
| Contact form | Accessible validation, error, and success states (round 2, see R2/R3); submission and events unchanged | Browser-verified with the API stubbed; no real email sent |
| Every page | Skip-to-content link | Browser-verified |

No new offers or CTAs were invented; all link to existing services, pages, or booking links.

## 13. Mobile and accessibility checks

Device-emulated audit (Chrome DevTools Protocol) of 18 key pages at 390 px and 1440 px:

- **No horizontal overflow** on any page.
- **Exactly one H1** per page.
- **No images missing alt text**, and no links or buttons without an accessible name.
- **Keyboard:** with real Tab presses, every focus stop in the header, main content, breadcrumb, related cards, homepage path cards, and footer has a visible focus indicator.
- **Tap targets:** CTAs are ≥ 36 px tall (WCAG 2.2 AA minimum is 24 px).
- **Breadcrumb** wraps cleanly on mobile; heading order is correct in the new sections (footer headings changed from `h4` to `h2`).

**Fixed in round 2:** contact-form label association, accessible errors, and focus management; newsletter and search labels; the skip-to-content link (see R2).

**Remaining pre-existing issue (not caused by this branch):** the shared blog-post template skips one heading level in a sidebar card heading. It affects all blog posts.

## 14. Performance

| Asset | Before (`51108e4`) | After |
|---|---|---|
| Main CSS | 150.2 kB (22.9 kB gzip) | 84.0 kB (13.8 kB gzip) |
| Main JS | 514.1 kB (158.3 kB gzip) | ≈531 kB (≈161.6 kB gzip). Route metadata and names now needed by the global breadcrumb and `useSeo` |
| Share image | Third-party URL returning 403 | Self-hosted `og-default.png`, 72 kB, 1200×630 |

## 15. Tests and validation run

| Check | Command / method | Result |
|---|---|---|
| Dependencies | `pnpm install --frozen-lockfile --offline` | OK; lockfile unchanged |
| Type check | `pnpm check` (`tsc --noEmit`) | Pass |
| Unit/integration tests | `npx vitest run --root .` | **28 files, 269 tests, all pass** |
| Production build | `pnpm build` (vite build + server bundle) | Pass |
| Route/metadata | `server/route-metadata.test.ts` | Unique titles and descriptions, length budgets, every client route covered or redirected, single-hop redirects |
| Architecture/orphans | `server/site-architecture.test.ts` | All 41 orphans have an outcome; ≥ 2 raw-HTML inlinks; one H1 per page; no links to unknown or redirected URLs; breadcrumb/schema parity; llms.txt URLs valid; no pricing in schema; share image 1200×630 |
| Internal links | `server/internal-links.test.ts` | 597 link occurrences (74 targets) in source all resolve |
| CSS guard | `server/css-sources.test.ts` | Excluded components are not imported |
| Live HTTP | Local production build: all 74 sitemap URLs plus redirects, 404, robots.txt, llms.txt, API | 200 + `index, follow` + self canonical + `og:url` + one H1 + valid JSON-LD + unique titles; redirects single-hop; 404 → noindex |
| Sitemap XML | Parsed with an XML parser | Well-formed, 74 URLs |
| Structured data | Script checking JSON syntax, required properties per Google docs, `@id` resolution, and visible-content consistency | 0 errors (warnings in §17) |
| Mobile/a11y and CTAs | Chrome DevTools Protocol scripts (18+ pages at 390 px and 1440 px) | No overflow, one H1, no missing alt text or unnamed controls; skip link works; focus visible |
| Forms | Browser test with `/api/contact` stubbed; 19 contact unit tests; 15 newsletter tests | See F2 and R3 |
| Dates | `server/site-architecture.test.ts` "article dates" | Every schema date matches the visible date |
| Secrets | Diff scan for keys, tokens, passwords, and private keys; tracked-file check | None found; no `.env`, keys, or `node_modules` tracked (`.env.example` template pre-exists, unchanged) |

## 16. Unavailable tests

- **Lint:** no lint script exists in `package.json`, so none was invented. Type-check, tests, and build are the strongest available validation.
- **External validators** (Google Rich Results Test, Schema.org validator) need a public URL. Validation used the in-repo checks above; run the external tools after a staging or production deploy.
- **Real form submission** was not performed, to avoid sending emails; unit tests cover it.
- **Physical devices:** mobile was checked with device emulation, not real phones.
- **HTTP→HTTPS** redirect behaviour lives in the VPS web-server config, outside this repo; verify it after deploy.

## 17. Remaining warnings

| Warning | Pages | Why it remains |
|---|---|---|
| `Article` without `datePublished` | 13 knowledge-hub and insight pages | Publish dates are not recorded in the repo or shown on the page; not invented |
| `SoftwareApplication` lacks `offers` / `aggregateRating` (not eligible for Google software rich results) | `/cmmclens` | No public pricing or reviews exist |
| `FAQPage` rich results are limited by Google to authoritative government/health sites | 22 pages | Markup stays valid and useful to other parsers and AI systems |
| Qualitative CMMCLens feature names in the guides | Knowledge hub | Product-owner confirmation requested (F10) |
| Blog-post template skips one heading level | All blog posts | Pre-existing template issue |
| Main JS chunk > 500 kB (Vite warning) | Global | Pre-existing; the lazy `CopilotChat` chunk (894 kB) is the bigger opportunity |

## 18. Assumptions and decisions requiring business approval

1. **`/lp/` pages:** kept **indexable**, because nothing confirms they are used only for paid or outbound campaigns. If they are, add `robots: "noindex, follow"` to their entries in `shared/routeMetadata.ts`; that also removes them from the sitemap.
2. **Sprint consolidation** (`/cmmc-readiness-sprint` → `/services/cmmc-readiness-sprint`): implemented. Revert the one redirect line if the pages were meant to differ.
3. **DefyAIRisk Monitor (`defy.defenseeye.ai`):** not added anywhere. Its public page shows only the product name and the repo has no product facts. Before it gets a page, schema, or nav entry, please supply approved facts:
   - what it monitors and its supported data sources
   - which actions are automated and which require human approval
   - its deployment model and security controls
   - integrations, target customers, and any pricing
4. **Industry hubs** for healthcare, SaaS, manufacturing, and professional services were **not created**. The repo has no industry-specific offerings, use cases, or proof for them. Each would need a defined audience, a genuine industry problem, a relevant capability, accurate use cases, and supporting pages.
5. **Share image:** `og-default.png` is a simple card built from the existing logo and tagline. Replace it with a designed asset if preferred (same path).
6. **Newsletter provider:** the false success state is removed (F1); approving a provider is still open (F3).
7. **Phase II status, CMMCLens pricing and trial terms, and product feature names** (F11).

## 19. Rollback

All changes are source-only; no data, environment, or server configuration changed.

- **Before merge:** close the PR.
- **After merge and deploy:** `git revert -m 1 <merge-commit>` on `main`, then run the normal deploy. Alternatively, deploy `51108e4`.
- **Partial rollbacks:**
  - Remove a redirect line in `LEGACY_REDIRECTS` (`server/index.ts`).
  - Add or remove `robots` on a route in `shared/routeMetadata.ts`.
  - Delete `@source not` lines in `client/src/index.css` to restore the full CSS scan.

## 20. Production

**No production deployment was performed.** No command was run against the VPS, and production configuration was not changed. Deploying is a separate, explicit step after approval:

```
ssh hostinger-cmmc 'cd /var/www/defenseeye && ./deploy/update.sh'
```

**After deploying:**

1. Spot-check `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/og-default.png`, and `/cmmc-readiness-sprint` (expect a 301).
2. Resubmit the sitemap in Search Console and Bing Webmaster Tools.
3. Re-run the Ahrefs audit with JS rendering off.
4. Test a share preview with LinkedIn Post Inspector.

## Appendix: structured-data node types by route

| Route | JSON-LD node types |
|---|---|
| `/` | Organization, WebSite, ProfessionalService, FAQPage |
| `/attacksense` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/attacksense/docs` | WebPage, Organization, WebSite, BreadcrumbList |
| `/blog` | CollectionPage, Organization, WebSite, BreadcrumbList |
| `/blog/cmmc-consultant-red-flags` | WebPage, BlogPosting, Organization, WebSite, BreadcrumbList |
| `/blog/cmmc-level-2-compliance-checklist-2025` | WebPage, BlogPosting, Organization, WebSite, BreadcrumbList |
| `/blog/cmmc-level-2-small-business-guide` | WebPage, BlogPosting, Organization, WebSite, BreadcrumbList |
| `/blog/cmmc-poam-guide-what-assessors-want` | WebPage, BlogPosting, Organization, WebSite, BreadcrumbList |
| `/blog/gcc-high-vs-m365-commercial-cmmc` | WebPage, BlogPosting, Organization, WebSite, BreadcrumbList |
| `/blog/how-to-improve-sprs-score-fast` | WebPage, BlogPosting, Organization, WebSite, BreadcrumbList |
| `/blog/what-counts-as-cui-plain-english-guide` | WebPage, BlogPosting, Organization, WebSite, BreadcrumbList |
| `/blog/what-to-expect-c3pao-assessment` | WebPage, BlogPosting, Organization, WebSite, BreadcrumbList |
| `/capability-statement` | WebPage, Organization, WebSite, BreadcrumbList |
| `/cmmc` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/cmmc-compliance-automation` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/cmmc-evidence-automation` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/cmmc-level-2-readiness` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/cmmc-readiness-sprint-guide` | WebPage, Organization, WebSite, BreadcrumbList |
| `/cmmclens` | WebPage, SoftwareApplication, Organization, WebSite, BreadcrumbList |
| `/contact` | WebPage, Organization, WebSite, BreadcrumbList |
| `/datasheets` | WebPage, Organization, WebSite, BreadcrumbList |
| `/datasheets/cmmc-compliance-automation` | WebPage, Organization, WebSite, BreadcrumbList |
| `/datasheets/cmmclens` | WebPage, Organization, WebSite, BreadcrumbList |
| `/datasheets/microsoft-copilot-readiness` | WebPage, Organization, WebSite, BreadcrumbList |
| `/datasheets/secure-ai-adoption` | WebPage, Organization, WebSite, BreadcrumbList |
| `/datasheets/supplier-readiness` | WebPage, Organization, WebSite, BreadcrumbList |
| `/delivery-model` | WebPage, Organization, WebSite, BreadcrumbList |
| `/faq` | WebPage, Organization, WebSite, BreadcrumbList |
| `/industries/defense-industrial-base` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/industries/financial-services-credit-unions` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/insights/ai-audit-readiness` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/insights/ai-automated-evidence-collection` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/insights/continuous-compliance-monitoring` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/insights/implement-ai-governance` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/insights/security-copilot-cybersecurity-operations` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/insights/what-is-cmmc-level-2` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/insights/what-is-nist-ai-rmf` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/insights/what-is-rmf-readiness` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/knowledge-hub` | CollectionPage, Organization, WebSite, BreadcrumbList |
| `/knowledge-hub/certification-process` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/knowledge-hub/cmmc-levels` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/knowledge-hub/evidence-mapping` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/knowledge-hub/sprs-score` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/knowledge-hub/what-is-cmmc` | WebPage, Article, Organization, WebSite, BreadcrumbList, FAQPage |
| `/lp/ai-governance-consulting` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/lp/azure-cloud-security` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/lp/cmmc-compliance-automation` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/lp/cmmc-evidence-automation` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/lp/cmmc-level-2-readiness` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/lp/cmmclens-demo` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/lp/compliance-automation` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/lp/microsoft-copilot-readiness` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/lp/microsoft-supplier-ai-consulting` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/lp/secure-ai-adoption` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/microsoft-ecosystem` | WebPage, Organization, WebSite, BreadcrumbList |
| `/nist-800-171` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/pricing` | WebPage, Organization, WebSite, BreadcrumbList |
| `/privacy-policy` | WebPage, Organization, WebSite, BreadcrumbList |
| `/representative-engagements` | WebPage, Organization, WebSite, BreadcrumbList |
| `/secure-ai-adoption` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/services/cmmc-readiness-sprint` | WebPage, Organization, WebSite, BreadcrumbList |
| `/services/cmmc-scoping` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/solutions/ai-governance` | WebPage, Service, Organization, WebSite, BreadcrumbList, FAQPage |
| `/solutions/ai-security` | WebPage, Service, Organization, WebSite, BreadcrumbList, FAQPage |
| `/solutions/ai-transformation` | WebPage, Service, Organization, WebSite, BreadcrumbList, FAQPage |
| `/solutions/cloud-security` | WebPage, Service, Organization, WebSite, BreadcrumbList, FAQPage |
| `/solutions/cmmclens-platform` | WebPage, Service, Organization, WebSite, BreadcrumbList, FAQPage |
| `/solutions/compliance-automation` | WebPage, Service, Organization, WebSite, BreadcrumbList, FAQPage |
| `/solutions/cybersecurity-risk` | WebPage, Service, Organization, WebSite, BreadcrumbList, FAQPage |
| `/solutions/microsoft-copilot-readiness` | WebPage, Service, Organization, WebSite, BreadcrumbList, FAQPage |
| `/supplier-readiness` | WebPage, Service, Organization, WebSite, BreadcrumbList |
| `/support` | WebPage, Organization, WebSite, BreadcrumbList |
| `/terms` | WebPage, Organization, WebSite, BreadcrumbList |
| `/why-defenseeye` | AboutPage, Organization, WebSite, BreadcrumbList |
