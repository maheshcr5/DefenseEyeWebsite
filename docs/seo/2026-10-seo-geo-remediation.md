# SEO, GEO, and conversion remediation — October 2026

Branch: `seo-geo-conversion-remediation` (not deployed). Input: Ahrefs Site Audit export "Orphan page (has no incoming internal links)", crawl of 2026-10-18, 41 URLs.

## 1. Executive summary

The 41 "orphan" pages were not missing from the site's navigation. They were missing from the **HTML the server sends**. Ahrefs crawled without running JavaScript (`Is rendered page = false`), and so do most AI crawlers (GPTBot, ClaudeBot, PerplexityBot). In that HTML, routes outside a small SEO registry received the homepage's static body, which is duplicate content, and almost no links.

This branch fixes that at the source:

- **One metadata registry** (`shared/routeMetadata.ts`) now supplies title, description, and robots to the server, the schema, and the React client. Before, the three disagreed on most routes; `/pricing` alone had three different titles.
- **Hub-and-spoke architecture** (`shared/siteArchitecture.ts`, `shared/relatedLinks.ts`) puts every public page under a hub. That drives visible breadcrumbs, `BreadcrumbList` schema, hub "In this section" lists, curated contextual links, and one footer directory shared by React and the server fallback.
- **Real server-rendered content** for every registered route, built from the same data the React pages use. It replaces the placeholders that repeated one sentence under every heading.
- **Outcome, measured on server HTML:**
  - All 31 indexable orphans now have inlinks; 30 have two or more.
  - The 10 `/lp/` campaign pages are deliberately `noindex, follow` and out of the sitemap. This needs your approval.
  - Main CSS dropped from 150 kB to 84 kB.

Nothing here guarantees rankings, AI citations, traffic, or leads. Measure it with technical health (Ahrefs re-crawl, Search Console coverage), qualified organic sessions, `home_path_click` and `consultation_click` events, form submissions, and booked meetings.

## 2. Repository and framework

| Item | Finding |
|---|---|
| Framework | React 19 + Vite 7 SPA, Wouter routing, Tailwind 4 + shadcn/ui |
| Server | Express (`server/index.ts`), bundled by esbuild into `dist/index.js` |
| Package manager | pnpm 10 (`pnpm-lock.yaml`) |
| Commands | `pnpm build` (vite build + server bundle), `pnpm check` (tsc), `vitest run --root .` |
| Rendering | Client-rendered. The server injects per-route `<title>`, description, canonical, OG/Twitter, robots, JSON-LD, and a crawlable HTML fallback inside `#root`, which React replaces on load |
| Content model | TypeScript data modules: `client/src/data/blogPosts.ts`, plus `shared/*Content.ts` (now shared by client and server) |
| Sitemap | Generated at request time from `shared/seoRoutes.ts` (`/sitemap.xml`) |
| Output | `dist/public` (static) + `dist/index.js` (server). `dist/` is gitignored and was not edited by hand |

## 3. Information architecture

| Hub | Hub URL | Main audience | Primary intent | Primary conversion |
|---|---|---|---|---|
| Secure AI | `/secure-ai-adoption` | CIO/CISO/risk leaders in regulated orgs; FS and credit unions | Adopt AI and agents safely | Secure AI readiness consultation |
| Cybersecurity & Cloud | `/solutions/cybersecurity-risk` | Security and risk leaders | Prioritize exposures and remediation | Consultation; AttackSense |
| CMMC & Compliance | `/cmmc-compliance-automation` | Defense suppliers, compliance owners | CMMC Level 2 readiness and evidence | Readiness sprint; CMMCLens demo |
| CMMC Knowledge Hub | `/knowledge-hub` | Defense suppliers researching CMMC | Learn: levels, SPRS, certification | Move to CMMC hub or sprint |
| CMMC Blog | `/blog` | Same | Practical how-to | Same |
| Supplier / Company | `/supplier-readiness` | Procurement teams and partners | Evaluate DefenseEye as a supplier | Capability statement; partners@ |
| Datasheets | `/datasheets` (under Supplier) | Buyers and procurement | One-page summaries | Booking from each sheet |

Hubs were chosen from existing content only. Healthcare, SaaS, manufacturing, and professional-services hubs, and "agentic AI risk detection" or "automated remediation" product hubs, were **not** created: the repository has no content or verified capability to support them (see §16).

Every page's parent and curated links live in `shared/siteArchitecture.ts` and `shared/relatedLinks.ts`. The generated tables in §6 show, for each orphan, its hub, its parent, and which pages now link to it.

## 4. Changed routes

| Route(s) | Change |
|---|---|
| `/services` | 301 → `/services/cmmc-readiness-sprint` (duplicate, no internal links, not in sitemap) |
| `/solutions/microsoft-copilot-enablement` | 301 → `/solutions/microsoft-copilot-readiness` (near-duplicate, no internal links, not in sitemap) |
| 10 × `/lp/*` | Still served (200) for campaigns; now `noindex, follow` and removed from the sitemap |
| `/contact`, `/terms` | Added to the sitemap; now server-render their own content instead of the homepage body |
| All other public routes | New titles and descriptions where needed; breadcrumbs; server-rendered content; schema changes |

No routes, pages, or assets were deleted.

## 5. Ahrefs issue remediation

Only the orphan-page export was supplied. The other issue types named in the brief were checked against the code; their exact Ahrefs URL lists were not available.

| Issue | Status | What was done / evidence |
|---|---|---|
| Orphan pages (41) | Fixed / excluded | 31 indexable: linked in server HTML (tests enforce ≥2, or ≥1 for the consolidation candidate). 10 `/lp/`: noindexed (approval item). See §6 |
| Pages with one dofollow inlink | Addressed | Hub "In this section" lists, related links, and the 25-link footer directory on every server-rendered page |
| Non-indexable orphan pages | Intentional | The 10 `/lp/` pages are now noindex by design; they are linked from nothing indexable |
| 3XX redirects / chains | Verified | All redirects resolve in one hop to a live 200 (test + live HTTP check). The new `/services` and enablement redirects target live pages |
| HTTP→HTTPS redirect | Not in this repo | Handled by the web server/proxy on the VPS. Verify there that `http://` 301s once to `https://defenseeye.ai/` (no `www` hop) |
| Titles too long | Fixed | All registry titles ≤ 66 characters (previously up to 105), enforced by test |
| Meta descriptions too long | Fixed | All 90–165 characters (previously up to 331), enforced by test |
| Page title vs SERP title mismatch | Root cause fixed | Server, schema, and hydrated client titles now come from one registry, and the H1 aligns with the title |
| Indexable pages missing from sitemap | Fixed | `/contact` and `/terms` added; a test requires every indexable registered route to be in the sitemap and every sitemap URL to be indexable |
| Schema.org validation errors | Addressed | Consistent Organization `@id` with logo on every page (fixes unresolved publisher/provider refs); Article/BlogPosting with dates and author; FAQPage only with visible FAQs; `SoftwareApplication.applicationCategory` uses a schema.org value; static fallback drops a self `sameAs`. Google's rich-result check will still want `offers` on SoftwareApplication (see §16) |
| Oversized CSS | Fixed | 150 kB → 84 kB by excluding 45 unused shadcn/ui components from Tailwind scanning (no files deleted; test-guarded) |

## 7. Schema changes

- One `Organization` entity (`https://defenseeye.ai/#organization`) with logo, plus Redmond WA address, enterprise email, and LinkedIn on the homepage. Referenced from every page's `WebPage`, `Service`, `Article`, and `SoftwareApplication`.
- `BreadcrumbList` follows the hub trail and matches the visible breadcrumb (test-enforced).
- `Article` (knowledge hub, insights) and `BlogPosting` (blog) include headline (≤110 characters), author, publisher, `datePublished` (blog) and `dateModified`.
- `FAQPage` on the homepage, solution pages, insights, and knowledge-hub articles, only where the Q&A is visible on the page (test-enforced).
- No ratings, reviews, prices, or certifications were added to schema.

## 8. Sitemap and robots

- Sitemap: 73 → 65 URLs (−10 noindexed `/lp/`, +`/contact`, +`/terms`). Every URL returns 200 with `index, follow` and a self-referencing canonical (live HTTP check).
- `robots.txt`: replaced the non-existent `Claude-Bot` user agent with `ClaudeBot`, `Claude-SearchBot`, and `Claude-User`; added a pointer to `llms.txt`. Nothing is disallowed (unchanged policy).

## 9. Conversion and CTA changes

- **Homepage "Find your starting point":** five audience paths (financial services and credit unions, regulated teams adopting AI or Copilot, security and risk leaders, defense suppliers, procurement and partners). Each card has a specific next step and fires a new `home_path_click` event.
- **Insight pages:** the booking button now fires `consultation_click` (it fired nothing before), and there is a secondary next step to the parent service page for readers not ready to book.
- **Solution, insight, datasheet, and CMMC pages:** a related-resources block and the full footer give every visitor a next step that isn't a meeting request. Previously several templates had no footer at all.
- Existing primary CTAs, forms, booking URLs, and analytics events are unchanged.

## 10. GEO and AI-discoverability changes

- "DefenseEye at a glance" Q&A on the homepage covers what DefenseEye is, who it serves, the problems it addresses, how engagements work, **what stays under human control**, and how governance and auditability are handled. It is visible, server-rendered, and in FAQPage schema. Every sentence restates facts already published on the site.
- Every registered page's real content is in the server HTML, readable without JavaScript.
- `llms.txt` is labelled supplementary, mirrors the at-a-glance answers, covers all hubs, and lists only live, indexable URLs (test-enforced). All claim boundaries are kept.

## 11. Performance

| Asset | Before | After |
|---|---|---|
| Main CSS | 150.2 kB (22.9 kB gzip) | 84.0 kB (13.8 kB gzip) |
| Main JS | 514.1 kB (158.3 kB gzip) | 530.9 kB (161.6 kB gzip) — route names and metadata now needed by the global breadcrumb and `useSeo` |

Not changed (recommendations): the `CopilotChat` chunk (894 kB, includes syntax-highlighting grammars) loads lazily but could be trimmed; the Google Fonts stylesheet is render-blocking; the OG image is hosted on a third-party CloudFront URL.

## 12. Test results

- `tsc --noEmit`: pass.
- `vitest run --root .`: 24 files, 243 tests, all passing. The four new test files are `route-metadata`, `site-architecture`, and `css-sources`, plus new cases in `seo-routes`.
- `pnpm build`: pass.
- Live HTTP check against the local production build:
  - All 65 sitemap URLs return 200 with `index, follow`, a self canonical and `og:url`, exactly one H1, valid JSON-LD, route-specific content, and unique titles.
  - Redirects resolve in a single hop.
  - `/lp/*` returns 200 with noindex; unknown URLs return 404 with noindex.
  - `/api/contact` still validates input (400 on an empty body); `/api/cmmc-content` returns 200.
- There is no lint script in `package.json`, so no lint was run.

## 13. Remaining risks

- **Visual change across the site:** a thin breadcrumb bar under the nav on inner pages, a wider seven-column footer, and two new homepage sections. Desktop screenshots were reviewed. True phone-width rendering was not verified (headless Chrome enforces a minimum width), so check on a real phone.
- Route-level schema replaces page-level JSON-LD on client navigation (pre-existing behaviour, now covering more routes). Rich results now depend on the registry schema, which is server-rendered.
- If someone later imports one of the 45 excluded ui components, its styles would be missing. `server/css-sources.test.ts` fails in that case.
- Older blog content still refers to "CMMC-AB" and has "(2025)" in some H1s. This was not rewritten (§16).

## 14. Deployment

Do not deploy without approval. When approved:

```
git push origin seo-geo-conversion-remediation   # open a PR and review
# after merge to main:
ssh hostinger-cmmc 'cd /var/www/defenseeye && ./deploy/update.sh'
```

After deploying:

1. Fetch `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/services` (expect a 301), and one `/lp/` page (expect noindex).
2. Resubmit the sitemap in Search Console and Bing Webmaster Tools.
3. Re-run the Ahrefs audit with JavaScript rendering off.

## 15. Rollback

Every change is in source; no data or server configuration changed. Either `git revert` the remediation commits (`d26963f..df39507`, plus `be1773e` for the pre-existing WIP) and redeploy, or redeploy the previous commit `51108e4`. To restore the `/lp/` pages to the index only, delete the `CAMPAIGN_LANDING_PAGE` spreads in `shared/routeMetadata.ts`.

## 16. Items requiring business approval

1. **Noindex the 10 `/lp/` campaign pages** (implemented, easily reversible). The alternative is to keep them indexed and rewrite each as a distinct, deeper page.
2. **Consolidate `/cmmc-readiness-sprint` into `/services/cmmc-readiness-sprint`** (two competing sprint pages). Not implemented.
3. **Positioning of DefyAIRisk Monitor (`defy.defenseeye.ai`).** Its public page shows only the product name, and the repository never mentions it. No capability, audience, or "agentic AI risk detection / automated remediation" claims were written. Please supply approved product facts before it gets a page, schema, or nav entry.
4. **New industry hubs** (healthcare, SaaS, manufacturing, professional services). These need real offerings, use cases, and proof points; creating them now would mean thin or doorway pages.
5. **SoftwareApplication pricing.** Google's rich-result validator expects `offers` for CMMCLens and AttackSense. Add pricing or a Marketplace offer only if you want it public.
6. **Content refresh:** update "CMMC-AB" references to "Cyber AB" and "(2025)" year labels in blog and knowledge-hub H1s; confirm the 2026 dates.
7. **OG image:** host a branded share image on defenseeye.ai instead of the third-party CloudFront hero.

## 6. Generated tables

The tables below were generated from the server output at `51108e4` (before) and this branch (after), not typed by hand.

## Orphan-page remediation (all 41 URLs from the Ahrefs export)

Inlinks are counted in the server-rendered HTML (what Ahrefs crawled with `Is rendered page = false`), from distinct sitemap pages, after this branch. "Before" is the Ahrefs value (0 for every URL).

| # | URL | Before title (Ahrefs) | H1 (after) | Hub | Parent | Contextual links from | Inlinks before → after | Indexable | Action | Priority | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `/knowledge-hub/sprs-score` | SPRS Score Guide \| DefenseEye | SPRS Score Explained: How to Calculate, Submit, and Improve Your Score | CMMC Knowledge Hub | `/knowledge-hub` | `/nist-800-171`, `/faq`, `/blog/how-to-improve-sprs-score-fast`, `/blog/cmmc-poam-guide-what-assessors-want` | 0 → 8 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P1 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 2 | `/knowledge-hub/certification-process` | CMMC Certification Process Step-by-Step (2025) \| DefenseEye.ai | CMMC Level 2 C3PAO Assessment Process Step-by-Step (2026) | CMMC Knowledge Hub | `/knowledge-hub` | `/cmmc-readiness-sprint-guide`, `/knowledge-hub/sprs-score`, `/blog/what-to-expect-c3pao-assessment` | 0 → 7 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P1 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 3 | `/blog/cmmc-consultant-red-flags` | 7 Red Flags When Hiring a CMMC Consultant \| DefenseEye.ai | 7 Red Flags When Hiring a CMMC Consultant (How to Avoid Getting Burned) | CMMC Blog | `/blog` | `/pricing`, `/blog/cmmc-level-2-small-business-guide` | 0 → 3 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P1 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 4 | `/blog/cmmc-poam-guide-what-assessors-want` | CMMC POA&M: What Assessors Actually Look For \| DefenseEye.ai | CMMC POA&M: What Assessors Actually Look For (And What Gets You Failed) | CMMC Blog | `/blog` | `/services/cmmc-readiness-sprint`, `/knowledge-hub/sprs-score`, `/knowledge-hub/certification-process`, `/blog/how-to-improve-sprs-score-fast` +1 | 0 → 6 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P1 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 5 | `/cmmc-readiness-sprint-guide` | 4-Week CMMC Readiness Sprint Guide \| DefenseEye.ai | The 4-Week CMMC Readiness Sprint | CMMC & Compliance Automation | `/services/cmmc-readiness-sprint` | `/cmmc-readiness-sprint`, `/services/cmmc-readiness-sprint`, `/knowledge-hub/certification-process`, `/blog/what-to-expect-c3pao-assessment` | 0 → 4 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P1 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 6 | `/datasheets` | DefenseEye Datasheets \| AI Adoption, CMMC Automation, CMMCLens, Copilot, Supplier Readiness | DefenseEye Datasheets | Supplier Readiness | `/supplier-readiness` | `/capability-statement` | 0 → 74 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P1 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 7 | `/blog/cmmc-level-2-small-business-guide` | CMMC Level 2 for Small Business \| DefenseEye | CMMC Level 2 for Small Businesses: What You Actually Need (and What You Don't) | CMMC Blog | `/blog` | `/knowledge-hub/cmmc-levels`, `/blog/cmmc-level-2-compliance-checklist-2025`, `/blog/cmmc-consultant-red-flags` | 0 → 4 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P1 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 8 | `/blog/what-counts-as-cui-plain-english-guide` | What Counts as CUI? \| DefenseEye | What Counts as CUI? A Plain-English Guide for Defense Contractors | CMMC Blog | `/blog` | `/industries/defense-industrial-base`, `/services/cmmc-scoping`, `/knowledge-hub/what-is-cmmc`, `/blog/gcc-high-vs-m365-commercial-cmmc` | 0 → 5 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P1 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 9 | `/pricing` | CMMC Readiness Cost & Pricing \| DefenseEye.ai | Flexible, Transparent Pricing for Urgent CMMC Readiness | CMMC & Compliance Automation | `/cmmc-compliance-automation` | `/cmmc`, `/cmmc-readiness-sprint`, `/services/cmmc-readiness-sprint`, `/faq` +3 | 0 → 74 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P1 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 10 | `/privacy-policy` | Privacy Policy \| DefenseEye | Privacy Policy | Privacy Policy | `/` | — | 0 → 74 | Yes | Keep; footer link | P3 | Legal page; footer link is the right level of linking. |
| 11 | `/blog/gcc-high-vs-m365-commercial-cmmc` | GCC High vs M365 for CMMC \| DefenseEye | GCC High vs M365 Commercial: Which Do You Need for CMMC Level 2? | CMMC Blog | `/blog` | `/solutions/cloud-security`, `/services/cmmc-scoping`, `/blog/what-counts-as-cui-plain-english-guide` | 0 → 4 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P1 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 12 | `/datasheets/microsoft-copilot-readiness` | Microsoft Copilot Readiness Datasheet \| DefenseEye | Microsoft Copilot Readiness Datasheet | Supplier Readiness | `/datasheets` | `/solutions/microsoft-copilot-readiness`, `/microsoft-ecosystem` | 0 → 3 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 13 | `/delivery-model` | DefenseEye Delivery Model \| AI, Cybersecurity, CMMC, and Compliance Automation Engagements | DefenseEye Delivery Model | Supplier Readiness | `/supplier-readiness` | `/pricing`, `/why-defenseeye`, `/capability-statement`, `/representative-engagements` | 0 → 74 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 14 | `/insights/implement-ai-governance` | How can organizations implement AI governance? \| DefenseEye | How can organizations implement AI governance? | Secure AI Adoption | `/solutions/ai-governance` | `/secure-ai-adoption`, `/solutions/ai-governance`, `/industries/financial-services-credit-unions`, `/insights/what-is-nist-ai-rmf` | 0 → 5 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 15 | `/datasheets/cmmc-compliance-automation` | CMMC & Compliance Automation Datasheet \| DefenseEye | CMMC & Compliance Automation Datasheet | Supplier Readiness | `/datasheets` | `/cmmc-compliance-automation` | 0 → 2 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 16 | `/lp/microsoft-supplier-ai-consulting` | Minority-Owned AI Governance and Cybersecurity Supplier \| DefenseEye | Minority-owned AI governance and cybersecurity supplier for Microsoft-centered environments | Supplier Readiness | `/supplier-readiness` | — | 0 → 0 | No (noindex) | Noindex, follow; removed from sitemap; content now server-rendered | P2 | Paid-campaign page duplicating an indexable solution page's intent with thinner content; 0 organic traffic. Needs business approval. |
| 17 | `/lp/ai-governance-consulting` | AI Governance Consulting for Regulated Organizations \| DefenseEye | AI governance consulting for regulated organizations | Secure AI Adoption | `/solutions/ai-governance` | — | 0 → 0 | No (noindex) | Noindex, follow; removed from sitemap; content now server-rendered | P2 | Paid-campaign page duplicating an indexable solution page's intent with thinner content; 0 organic traffic. Needs business approval. |
| 18 | `/solutions/compliance-automation` | Compliance Automation Consulting \| DefenseEye | Compliance Automation Consulting | CMMC & Compliance Automation | `/cmmc-compliance-automation` | `/insights/ai-automated-evidence-collection`, `/insights/continuous-compliance-monitoring`, `/insights/ai-audit-readiness`, `/insights/what-is-rmf-readiness` | 0 → 74 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 19 | `/insights/security-copilot-cybersecurity-operations` | How can Security Copilot improve cybersecurity operations? \| DefenseEye | How can Security Copilot improve cybersecurity operations? | Cybersecurity Risk | `/solutions/cybersecurity-risk` | `/solutions/ai-security`, `/solutions/microsoft-copilot-readiness`, `/solutions/cybersecurity-risk`, `/microsoft-ecosystem` | 0 → 4 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 20 | `/industries/defense-industrial-base` | Cybersecurity and Compliance Support for the Defense Industrial Base \| DefenseEye | Cybersecurity and Compliance Support for the Defense Industrial Base | CMMC & Compliance Automation | `/cmmc-compliance-automation` | `/` | 0 → 74 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 21 | `/datasheets/cmmclens` | CMMCLens Product Sheet \| DefenseEye | CMMCLens Product Sheet | Supplier Readiness | `/datasheets` | `/cmmclens`, `/solutions/cmmclens-platform` | 0 → 3 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 22 | `/lp/compliance-automation` | Compliance Automation for Evidence and Readiness Reporting \| DefenseEye | Compliance automation for evidence, workflows, and readiness reporting | CMMC & Compliance Automation | `/solutions/compliance-automation` | — | 0 → 0 | No (noindex) | Noindex, follow; removed from sitemap; content now server-rendered | P2 | Paid-campaign page duplicating an indexable solution page's intent with thinner content; 0 organic traffic. Needs business approval. |
| 23 | `/solutions/cmmclens-platform` | CMMCLens Platform \| Compliance Evidence Automation \| DefenseEye | CMMCLens evidence automation for compliance readiness | CMMC & Compliance Automation | `/cmmclens` | `/cmmc-evidence-automation`, `/cmmclens`, `/datasheets/cmmclens` | 0 → 3 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 24 | `/lp/secure-ai-adoption` | Secure AI Adoption Consulting for Regulated Teams \| DefenseEye | Secure AI adoption consulting for regulated teams | Secure AI Adoption | `/secure-ai-adoption` | — | 0 → 0 | No (noindex) | Noindex, follow; removed from sitemap; content now server-rendered | P2 | Paid-campaign page duplicating an indexable solution page's intent with thinner content; 0 organic traffic. Needs business approval. |
| 25 | `/solutions/cloud-security` | Microsoft Cloud Security and Compliance Consulting \| DefenseEye | Microsoft Cloud Security and Compliance Consulting | Cybersecurity Risk | `/solutions/cybersecurity-risk` | `/attacksense`, `/microsoft-ecosystem`, `/blog/gcc-high-vs-m365-commercial-cmmc` | 0 → 74 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 26 | `/industries/financial-services-credit-unions` | Secure AI for Financial Services and Credit Unions \| DefenseEye | Secure AI for Financial Services and Credit Unions | Secure AI Adoption | `/secure-ai-adoption` | `/`, `/solutions/ai-governance`, `/solutions/ai-transformation`, `/insights/implement-ai-governance` | 0 → 74 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 27 | `/lp/cmmc-evidence-automation` | CMMC Evidence Automation with CMMCLens \| DefenseEye | CMMC evidence automation with CMMCLens | CMMC & Compliance Automation | `/cmmc-evidence-automation` | — | 0 → 0 | No (noindex) | Noindex, follow; removed from sitemap; content now server-rendered | P2 | Paid-campaign page duplicating an indexable solution page's intent with thinner content; 0 organic traffic. Needs business approval. |
| 28 | `/cmmc-readiness-sprint` | CMMC Readiness Sprint \| DefenseEye | CMMC readiness sprint for focused assessment preparation | CMMC & Compliance Automation | `/cmmc-compliance-automation` | — | 0 → 1 | Yes | Keep; hub link + unique title; recommend consolidation | P2 | Near-duplicate of /services/cmmc-readiness-sprint; links not added beyond the hub until consolidation is decided. |
| 29 | `/datasheets/supplier-readiness` | DefenseEye Supplier Readiness Datasheet | DefenseEye Supplier Readiness Datasheet | Supplier Readiness | `/datasheets` | `/supplier-readiness` | 0 → 2 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 30 | `/insights/ai-automated-evidence-collection` | How can AI automate evidence collection? \| DefenseEye | How can AI automate evidence collection? | CMMC & Compliance Automation | `/solutions/compliance-automation` | `/cmmc-evidence-automation`, `/solutions/compliance-automation`, `/insights/continuous-compliance-monitoring`, `/knowledge-hub/evidence-mapping` | 0 → 5 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 31 | `/lp/cmmclens-demo` | CMMCLens Demo for CMMC Evidence Automation \| DefenseEye | CMMCLens demo for CMMC evidence automation | CMMC & Compliance Automation | `/cmmclens` | — | 0 → 0 | No (noindex) | Noindex, follow; removed from sitemap; content now server-rendered | P2 | Paid-campaign page duplicating an indexable solution page's intent with thinner content; 0 organic traffic. Needs business approval. |
| 32 | `/insights/continuous-compliance-monitoring` | What is continuous compliance monitoring? \| DefenseEye | What is continuous compliance monitoring? | CMMC & Compliance Automation | `/solutions/compliance-automation` | `/solutions/cybersecurity-risk`, `/solutions/compliance-automation`, `/insights/ai-audit-readiness`, `/insights/what-is-rmf-readiness` | 0 → 4 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 33 | `/lp/cmmc-compliance-automation` | CMMC Compliance Automation for Evidence and Readiness \| DefenseEye | CMMC compliance automation for evidence and readiness workflows | CMMC & Compliance Automation | `/cmmc-compliance-automation` | — | 0 → 0 | No (noindex) | Noindex, follow; removed from sitemap; content now server-rendered | P2 | Paid-campaign page duplicating an indexable solution page's intent with thinner content; 0 organic traffic. Needs business approval. |
| 34 | `/lp/azure-cloud-security` | Azure Cloud Security and Compliance Review \| DefenseEye | Azure cloud security and compliance review | Cybersecurity Risk | `/solutions/cloud-security` | — | 0 → 0 | No (noindex) | Noindex, follow; removed from sitemap; content now server-rendered | P2 | Paid-campaign page duplicating an indexable solution page's intent with thinner content; 0 organic traffic. Needs business approval. |
| 35 | `/insights/ai-audit-readiness` | How can AI improve audit readiness? \| DefenseEye | How can AI improve audit readiness? | CMMC & Compliance Automation | `/solutions/compliance-automation` | `/solutions/compliance-automation`, `/insights/ai-automated-evidence-collection` | 0 → 2 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 36 | `/lp/microsoft-copilot-readiness` | Microsoft Copilot Readiness Assessment \| DefenseEye | Microsoft Copilot readiness assessment | Secure AI Adoption | `/solutions/microsoft-copilot-readiness` | — | 0 → 0 | No (noindex) | Noindex, follow; removed from sitemap; content now server-rendered | P2 | Paid-campaign page duplicating an indexable solution page's intent with thinner content; 0 organic traffic. Needs business approval. |
| 37 | `/microsoft-ecosystem` | Microsoft Ecosystem Experience \| DefenseEye AI Governance, Copilot, Azure Security, and Compliance | Microsoft Ecosystem Experience | Supplier Readiness | `/supplier-readiness` | `/solutions/microsoft-copilot-readiness`, `/solutions/cloud-security`, `/insights/security-copilot-cybersecurity-operations`, `/supplier-readiness` +1 | 0 → 74 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 38 | `/lp/cmmc-level-2-readiness` | CMMC Level 2 Readiness Consulting \| DefenseEye | CMMC Level 2 readiness consulting | CMMC & Compliance Automation | `/cmmc-level-2-readiness` | — | 0 → 0 | No (noindex) | Noindex, follow; removed from sitemap; content now server-rendered | P2 | Paid-campaign page duplicating an indexable solution page's intent with thinner content; 0 organic traffic. Needs business approval. |
| 39 | `/datasheets/secure-ai-adoption` | Secure AI Adoption Datasheet \| DefenseEye | Secure AI Adoption Datasheet | Supplier Readiness | `/datasheets` | `/secure-ai-adoption`, `/solutions/ai-governance` | 0 → 3 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 40 | `/services/cmmc-scoping` | CMMC Scoping \| Define Your CUI Boundary \| DefenseEye | Know Exactly What You're Defending Before Assessors Arrive | CMMC & Compliance Automation | `/cmmc-compliance-automation` | `/industries/defense-industrial-base`, `/cmmc`, `/services/cmmc-readiness-sprint`, `/cmmc-readiness-sprint-guide` +3 | 0 → 74 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |
| 41 | `/insights/what-is-rmf-readiness` | What is RMF readiness? \| DefenseEye | What is RMF readiness? | CMMC & Compliance Automation | `/solutions/compliance-automation` | `/nist-800-171`, `/solutions/compliance-automation`, `/insights/continuous-compliance-monitoring` | 0 → 3 | Yes | Keep indexable; add server-rendered content, breadcrumb, hub listing, contextual links | P2 | Valuable answer/commercial page; was unreachable in raw HTML. |

## Before-and-after titles and meta descriptions

"Before" is what the server sent at `51108e4` (current production). Client-side titles also differed on most routes before; after this branch the client uses the same registry. Lengths in characters.

| Route | Before title | After title | Before desc. len | After desc. len | Sitemap before → after |
|---|---|---|---|---|---|
| `/` | DefenseEye \| Secure Agentic AI Implementation (45) | DefenseEye \| Secure Agentic AI for Regulated Organizations (58) | 188 | 165 | Y → Y |
| `/attacksense` | AttackSense \| DefenseEye Attack Surface and Remediation Intelligence (68) | AttackSense Attack Surface Intelligence \| DefenseEye (52) | 173 | 160 | Y → Y |
| `/attacksense/docs` | AttackSense Guide \| DefenseEye (30) | AttackSense Quick Start Guide \| DefenseEye (42) | 102 | 114 | Y → Y |
| `/blog` | CMMC Blog for Defense Contractors \| DefenseEye.ai (49) | CMMC Blog: Practical Guides for Defense Contractors \| DefenseEye (64) | 129 | 149 | Y → Y |
| `/blog/cmmc-consultant-red-flags` | 7 Red Flags When Hiring a CMMC Consultant \| DefenseEye.ai (57) | 7 Red Flags When Hiring a CMMC Consultant \| DefenseEye (54) | 123 | 134 | Y → Y |
| `/blog/cmmc-level-2-compliance-checklist-2025` | CMMC Level 2 Checklist (2025) \| DefenseEye (42) | CMMC Level 2 Compliance Checklist (110 Controls) \| DefenseEye (61) | 131 | 146 | Y → Y |
| `/blog/cmmc-level-2-small-business-guide` | CMMC Level 2 for Small Business \| DefenseEye (44) | CMMC Level 2 for Small Businesses: What You Need \| DefenseEye (61) | 141 | 141 | Y → Y |
| `/blog/cmmc-poam-guide-what-assessors-want` | CMMC POA&M: What Assessors Actually Look For \| DefenseEye.ai (60) | CMMC POA&M: What Assessors Actually Look For \| DefenseEye (57) | 136 | 130 | Y → Y |
| `/blog/gcc-high-vs-m365-commercial-cmmc` | GCC High vs M365 for CMMC \| DefenseEye (38) | GCC High vs M365 Commercial for CMMC Level 2 \| DefenseEye (57) | 130 | 138 | Y → Y |
| `/blog/how-to-improve-sprs-score-fast` | Improve SPRS Score Fast \| DefenseEye (36) | How to Improve Your SPRS Score Fast \| DefenseEye (48) | 139 | 138 | Y → Y |
| `/blog/what-counts-as-cui-plain-english-guide` | What Counts as CUI? \| DefenseEye (32) | What Counts as CUI? A Plain-English Guide \| DefenseEye (54) | 129 | 129 | Y → Y |
| `/blog/what-to-expect-c3pao-assessment` | C3PAO Assessment Walkthrough \| DefenseEye (41) | What to Expect in a C3PAO Assessment \| DefenseEye (49) | 130 | 140 | Y → Y |
| `/capability-statement` | DefenseEye Capability Statement \| AI, Cybersecurity, CMMC, and Compliance Automation (84) | DefenseEye Capability Statement: AI, Cyber & CMMC (49) | 202 | 147 | Y → Y |
| `/cmmc` | CMMC Readiness, Evidence Automation, and Advisory Support \| DefenseEye (70) | CMMC Readiness, Evidence & Advisory Support \| DefenseEye (56) | 137 | 137 | Y → Y |
| `/cmmc-compliance-automation` | CMMC Compliance Automation \| DefenseEye CCP-Led CMMC Readiness and CMMCLens (75) | CMMC Compliance Automation & CCP-Led Readiness \| DefenseEye (59) | 182 | 139 | Y → Y |
| `/cmmc-evidence-automation` | CMMC Evidence Automation \| DefenseEye (37) | CMMC Evidence Automation & Traceability \| DefenseEye (52) | 121 | 130 | Y → Y |
| `/cmmc-level-2-readiness` | CMMC Level 2 Readiness Consulting and Automation \| DefenseEye (61) | CMMC Level 2 Readiness Consulting \| DefenseEye (46) | 130 | 132 | Y → Y |
| `/cmmc-readiness-sprint` | CMMC Readiness Sprint \| DefenseEye (34) | CMMC Readiness Sprint for Assessment Preparation \| DefenseEye (61) | 119 | 144 | Y → Y |
| `/cmmc-readiness-sprint-guide` | 4-Week CMMC Readiness Sprint Guide \| DefenseEye.ai (50) | 4-Week CMMC Readiness Sprint Guide \| DefenseEye (47) | 133 | 135 | Y → Y |
| `/cmmclens` | CMMCLens Compliance Automation Platform \| DefenseEye (52) | CMMCLens CMMC & NIST 800-171 Compliance Platform \| DefenseEye (61) | 223 | 162 | Y → Y |
| `/contact` | Contact DefenseEye \| AI Governance, Cybersecurity, Supplier, and Compliance Inquiries (85) | Contact DefenseEye: AI, Cybersecurity & Compliance Inquiries (60) | 210 | 160 | N → Y |
| `/datasheets` | DefenseEye Datasheets \| AI Adoption, CMMC Automation, CMMCLens, Copilot, Supplier Readiness (91) | DefenseEye Datasheets: AI, CMMC, CMMCLens & Copilot (51) | 154 | 145 | Y → Y |
| `/datasheets/cmmc-compliance-automation` | CMMC & Compliance Automation Datasheet \| DefenseEye (51) | CMMC & Compliance Automation Datasheet \| DefenseEye (51) | 137 | 125 | Y → Y |
| `/datasheets/cmmclens` | CMMCLens Product Sheet \| DefenseEye (35) | CMMCLens Product Sheet \| DefenseEye (35) | 151 | 148 | Y → Y |
| `/datasheets/microsoft-copilot-readiness` | Microsoft Copilot Readiness Datasheet \| DefenseEye (50) | Microsoft Copilot Readiness Datasheet \| DefenseEye (50) | 151 | 139 | Y → Y |
| `/datasheets/secure-ai-adoption` | Secure AI Adoption Datasheet \| DefenseEye (41) | Secure AI Adoption Datasheet \| DefenseEye (41) | 126 | 143 | Y → Y |
| `/datasheets/supplier-readiness` | DefenseEye Supplier Readiness Datasheet (39) | Supplier Readiness Datasheet \| DefenseEye (41) | 155 | 150 | Y → Y |
| `/delivery-model` | DefenseEye Delivery Model \| AI, Cybersecurity, CMMC, and Compliance Automation Engagements (90) | Delivery Model & Engagement Formats \| DefenseEye (48) | 214 | 147 | Y → Y |
| `/faq` | CMMC FAQ — Common Questions Answered \| DefenseEye (49) | CMMC FAQ: Common Questions Answered \| DefenseEye (48) | 150 | 141 | Y → Y |
| `/industries/defense-industrial-base` | Cybersecurity and Compliance Support for the Defense Industrial Base \| DefenseEye (81) | Defense Industrial Base Cybersecurity & CMMC \| DefenseEye (57) | 206 | 155 | Y → Y |
| `/industries/financial-services-credit-unions` | Secure AI for Financial Services and Credit Unions \| DefenseEye (63) | Secure AI for Financial Services & Credit Unions \| DefenseEye (61) | 196 | 154 | Y → Y |
| `/insights/ai-audit-readiness` | How can AI improve audit readiness? \| DefenseEye (48) | How AI Can Improve Audit Readiness \| DefenseEye (47) | 147 | 144 | Y → Y |
| `/insights/ai-automated-evidence-collection` | How can AI automate evidence collection? \| DefenseEye (53) | How AI Can Automate Compliance Evidence Collection \| DefenseEye (63) | 167 | 156 | Y → Y |
| `/insights/continuous-compliance-monitoring` | What is continuous compliance monitoring? \| DefenseEye (54) | What Is Continuous Compliance Monitoring? \| DefenseEye (54) | 155 | 143 | Y → Y |
| `/insights/implement-ai-governance` | How can organizations implement AI governance? \| DefenseEye (59) | How to Implement AI Governance: Practical Steps \| DefenseEye (60) | 144 | 149 | Y → Y |
| `/insights/security-copilot-cybersecurity-operations` | How can Security Copilot improve cybersecurity operations? \| DefenseEye (71) | Security Copilot for Cybersecurity Operations \| DefenseEye (58) | 146 | 151 | Y → Y |
| `/insights/what-is-cmmc-level-2` | What is CMMC Level 2? \| DefenseEye (34) | What Is CMMC Level 2? Requirements Explained \| DefenseEye (57) | 150 | 143 | Y → Y |
| `/insights/what-is-nist-ai-rmf` | What is NIST AI RMF? \| DefenseEye (33) | What Is the NIST AI RMF? Plain-English Guide \| DefenseEye (57) | 131 | 133 | Y → Y |
| `/insights/what-is-rmf-readiness` | What is RMF readiness? \| DefenseEye (35) | What Is RMF Readiness? A Practical Definition \| DefenseEye (58) | 146 | 136 | Y → Y |
| `/knowledge-hub` | CMMC Knowledge Hub \| DefenseEye (31) | CMMC Knowledge Hub: Guides for DoD Contractors \| DefenseEye (59) | 122 | 139 | Y → Y |
| `/knowledge-hub/certification-process` | CMMC Certification Process Step-by-Step (2025) \| DefenseEye.ai (62) | CMMC Level 2 Certification Process Step by Step \| DefenseEye (60) | 117 | 140 | Y → Y |
| `/knowledge-hub/cmmc-levels` | CMMC Level 1 vs Level 2: Which Do You Need? (2025) \| DefenseEye.ai (66) | CMMC Level 1 vs Level 2: Which Do You Need? \| DefenseEye (56) | 118 | 149 | Y → Y |
| `/knowledge-hub/evidence-mapping` | Automated NIST 800-171 Evidence Mapping for CMMC \| DefenseEye.ai (64) | NIST 800-171 Evidence Mapping for CMMC \| DefenseEye (51) | 115 | 152 | Y → Y |
| `/knowledge-hub/sprs-score` | SPRS Score Guide \| DefenseEye (29) | SPRS Score: How to Calculate & Improve It \| DefenseEye (54) | 128 | 129 | Y → Y |
| `/knowledge-hub/what-is-cmmc` | What Is CMMC 2.0? \| DefenseEye (30) | What Is CMMC? A Complete Guide for DoD Contractors \| DefenseEye (63) | 117 | 142 | Y → Y |
| `/lp/ai-governance-consulting` | AI Governance Consulting for Regulated Organizations \| DefenseEye (65) | AI Governance Readiness Assessment \| DefenseEye (47) | 122 | 122 | Y → N |
| `/lp/azure-cloud-security` | Azure Cloud Security and Compliance Review \| DefenseEye (55) | Azure Cloud Security & Compliance Review \| DefenseEye (53) | 129 | 129 | Y → N |
| `/lp/cmmc-compliance-automation` | CMMC Compliance Automation for Evidence and Readiness \| DefenseEye (66) | CMMC Compliance Automation Sprint \| DefenseEye (46) | 135 | 135 | Y → N |
| `/lp/cmmc-evidence-automation` | CMMC Evidence Automation with CMMCLens \| DefenseEye (51) | CMMC Evidence Automation with CMMCLens \| DefenseEye (51) | 135 | 135 | Y → N |
| `/lp/cmmc-level-2-readiness` | CMMC Level 2 Readiness Consulting \| DefenseEye (46) | CMMC Level 2 Readiness Assessment \| DefenseEye (46) | 133 | 133 | Y → N |
| `/lp/cmmclens-demo` | CMMCLens Demo for CMMC Evidence Automation \| DefenseEye (55) | Request a CMMCLens Demo \| DefenseEye (36) | 141 | 141 | Y → N |
| `/lp/compliance-automation` | Compliance Automation for Evidence and Readiness Reporting \| DefenseEye (71) | Compliance Automation for Evidence & Reporting \| DefenseEye (59) | 131 | 131 | Y → N |
| `/lp/microsoft-copilot-readiness` | Microsoft Copilot Readiness Assessment \| DefenseEye (51) | Microsoft Copilot Readiness Assessment \| DefenseEye (51) | 137 | 137 | Y → N |
| `/lp/microsoft-supplier-ai-consulting` | Minority-Owned AI Governance and Cybersecurity Supplier \| DefenseEye (68) | Minority-Owned AI & Cybersecurity Supplier \| DefenseEye (55) | 139 | 139 | Y → N |
| `/lp/secure-ai-adoption` | Secure AI Adoption Consulting for Regulated Teams \| DefenseEye (62) | Secure AI Adoption Consulting for Regulated Teams \| DefenseEye (62) | 154 | 142 | Y → N |
| `/microsoft-ecosystem` | Microsoft Ecosystem Experience \| DefenseEye AI Governance, Copilot, Azure Security, and Compliance (98) | Microsoft Ecosystem: Copilot, Azure & Compliance \| DefenseEye (61) | 180 | 154 | Y → Y |
| `/nist-800-171` | NIST SP 800-171 Readiness and Compliance Automation \| DefenseEye (64) | NIST SP 800-171 Readiness & Compliance Automation \| DefenseEye (62) | 133 | 140 | Y → Y |
| `/pricing` | CMMC Readiness Cost & Pricing \| DefenseEye.ai (45) | CMMC Readiness Pricing & Engagement Options \| DefenseEye (56) | 143 | 153 | Y → Y |
| `/privacy-policy` | Privacy Policy \| DefenseEye (27) | Privacy Policy \| DefenseEye (27) | 115 | 101 | Y → Y |
| `/representative-engagements` | Representative Engagements for AI, Cybersecurity, and Compliance \| DefenseEye.ai (80) | Representative AI, Cyber & CMMC Engagements \| DefenseEye (56) | 138 | 153 | Y → Y |
| `/secure-ai-adoption` | Secure Agentic AI Consulting \| DefenseEye (41) | Secure Agentic AI Readiness & Implementation \| DefenseEye (57) | 157 | 157 | Y → Y |
| `/services` | CMMC Readiness Sprint \| DefenseEye.ai (37) | — (301 redirect) (0) | 122 | 0 | N → N |
| `/services/cmmc-readiness-sprint` | CMMC Readiness Sprint \| DefenseEye.ai (37) | Fixed-Scope CMMC Readiness Sprint for DoD Contractors \| DefenseEye (66) | 122 | 142 | Y → Y |
| `/services/cmmc-scoping` | CMMC Scoping \| Define Your CUI Boundary \| DefenseEye (52) | CMMC Scoping: Define Your CUI Boundary \| DefenseEye (51) | 196 | 147 | Y → Y |
| `/solutions/ai-governance` | AI Governance and NIST AI RMF Consulting \| DefenseEye (53) | AI Governance & NIST AI RMF Consulting \| DefenseEye (51) | 161 | 152 | Y → Y |
| `/solutions/ai-security` | AI Security and Generative AI Risk Consulting \| DefenseEye (58) | AI Security & Generative AI Risk Consulting \| DefenseEye (56) | 173 | 157 | Y → Y |
| `/solutions/ai-transformation` | AI Transformation Consulting and Adoption Roadmaps \| DefenseEye (63) | Secure AI Transformation & Adoption Roadmaps \| DefenseEye (57) | 182 | 145 | Y → Y |
| `/solutions/cloud-security` | Microsoft Cloud Security and Compliance Consulting \| DefenseEye (63) | Azure & GCC High Cloud Security Consulting \| DefenseEye (55) | 177 | 152 | Y → Y |
| `/solutions/cmmclens-platform` | CMMCLens Platform \| Compliance Evidence Automation \| DefenseEye (63) | CMMCLens for Compliance Evidence Automation \| DefenseEye (56) | 196 | 147 | Y → Y |
| `/solutions/compliance-automation` | Compliance Automation Consulting \| DefenseEye (45) | Compliance Evidence Automation Consulting \| DefenseEye (54) | 180 | 146 | Y → Y |
| `/solutions/cybersecurity-risk` | Cybersecurity and Risk Consulting \| DefenseEye (46) | Cybersecurity Risk Consulting for Regulated Teams \| DefenseEye (62) | 173 | 158 | Y → Y |
| `/solutions/microsoft-copilot-enablement` | Microsoft Copilot Enablement and Governance \| DefenseEye (56) | — (301 redirect) (0) | 146 | 0 | N → N |
| `/solutions/microsoft-copilot-readiness` | Microsoft Copilot Readiness Consulting \| DefenseEye (51) | Microsoft Copilot Readiness Consulting \| DefenseEye (51) | 165 | 145 | Y → Y |
| `/supplier-readiness` | DefenseEye Supplier Readiness \| AI, Cybersecurity, CMMC, and Microsoft Cloud Consulting (87) | Supplier Readiness: Minority-Owned AI & Cyber Firm \| DefenseEye (63) | 230 | 151 | Y → Y |
| `/support` | Support \| DefenseEye (20) | Customer & Product Support \| DefenseEye (39) | 141 | 155 | Y → Y |
| `/terms` | Terms of Service \| DefenseEye (29) | Terms of Service \| DefenseEye (29) | 106 | 106 | N → Y |
| `/why-defenseeye` | Why DefenseEye \| Secure AI, Cybersecurity and CMMC Practitioners (64) | Why DefenseEye: Practitioner-Led Secure AI & Compliance (55) | 242 | 159 | Y → Y |

## Structured data by route (after)

| Route | JSON-LD types |
|---|---|
| `/` | Organization, WebSite, ProfessionalService, FAQPage |
| `/attacksense` | WebPage, Service, Organization, BreadcrumbList |
| `/attacksense/docs` | WebPage, Organization, BreadcrumbList |
| `/blog` | CollectionPage, Organization, BreadcrumbList |
| `/blog/cmmc-consultant-red-flags` | WebPage, BlogPosting, Organization, BreadcrumbList |
| `/blog/cmmc-level-2-compliance-checklist-2025` | WebPage, BlogPosting, Organization, BreadcrumbList |
| `/blog/cmmc-level-2-small-business-guide` | WebPage, BlogPosting, Organization, BreadcrumbList |
| `/blog/cmmc-poam-guide-what-assessors-want` | WebPage, BlogPosting, Organization, BreadcrumbList |
| `/blog/gcc-high-vs-m365-commercial-cmmc` | WebPage, BlogPosting, Organization, BreadcrumbList |
| `/blog/how-to-improve-sprs-score-fast` | WebPage, BlogPosting, Organization, BreadcrumbList |
| `/blog/what-counts-as-cui-plain-english-guide` | WebPage, BlogPosting, Organization, BreadcrumbList |
| `/blog/what-to-expect-c3pao-assessment` | WebPage, BlogPosting, Organization, BreadcrumbList |
| `/capability-statement` | WebPage, Organization, BreadcrumbList |
| `/cmmc` | WebPage, Service, Organization, BreadcrumbList |
| `/cmmc-compliance-automation` | WebPage, Service, Organization, BreadcrumbList |
| `/cmmc-evidence-automation` | WebPage, Service, Organization, BreadcrumbList |
| `/cmmc-level-2-readiness` | WebPage, Service, Organization, BreadcrumbList |
| `/cmmc-readiness-sprint` | WebPage, Organization, BreadcrumbList |
| `/cmmc-readiness-sprint-guide` | WebPage, Organization, BreadcrumbList |
| `/cmmclens` | WebPage, SoftwareApplication, Organization, BreadcrumbList |
| `/contact` | WebPage, Organization, BreadcrumbList |
| `/datasheets` | WebPage, Organization, BreadcrumbList |
| `/datasheets/cmmc-compliance-automation` | WebPage, Organization, BreadcrumbList |
| `/datasheets/cmmclens` | WebPage, Organization, BreadcrumbList |
| `/datasheets/microsoft-copilot-readiness` | WebPage, Organization, BreadcrumbList |
| `/datasheets/secure-ai-adoption` | WebPage, Organization, BreadcrumbList |
| `/datasheets/supplier-readiness` | WebPage, Organization, BreadcrumbList |
| `/delivery-model` | WebPage, Organization, BreadcrumbList |
| `/faq` | WebPage, Organization, BreadcrumbList |
| `/industries/defense-industrial-base` | WebPage, Service, Organization, BreadcrumbList |
| `/industries/financial-services-credit-unions` | WebPage, Service, Organization, BreadcrumbList |
| `/insights/ai-audit-readiness` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/insights/ai-automated-evidence-collection` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/insights/continuous-compliance-monitoring` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/insights/implement-ai-governance` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/insights/security-copilot-cybersecurity-operations` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/insights/what-is-cmmc-level-2` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/insights/what-is-nist-ai-rmf` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/insights/what-is-rmf-readiness` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/knowledge-hub` | CollectionPage, Organization, BreadcrumbList |
| `/knowledge-hub/certification-process` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/knowledge-hub/cmmc-levels` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/knowledge-hub/evidence-mapping` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/knowledge-hub/sprs-score` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/knowledge-hub/what-is-cmmc` | WebPage, Article, Organization, BreadcrumbList, FAQPage |
| `/lp/ai-governance-consulting` | WebPage, Service, Organization, BreadcrumbList |
| `/lp/azure-cloud-security` | WebPage, Service, Organization, BreadcrumbList |
| `/lp/cmmc-compliance-automation` | WebPage, Service, Organization, BreadcrumbList |
| `/lp/cmmc-evidence-automation` | WebPage, Service, Organization, BreadcrumbList |
| `/lp/cmmc-level-2-readiness` | WebPage, Service, Organization, BreadcrumbList |
| `/lp/cmmclens-demo` | WebPage, Service, Organization, BreadcrumbList |
| `/lp/compliance-automation` | WebPage, Service, Organization, BreadcrumbList |
| `/lp/microsoft-copilot-readiness` | WebPage, Service, Organization, BreadcrumbList |
| `/lp/microsoft-supplier-ai-consulting` | WebPage, Service, Organization, BreadcrumbList |
| `/lp/secure-ai-adoption` | WebPage, Service, Organization, BreadcrumbList |
| `/microsoft-ecosystem` | WebPage, Organization, BreadcrumbList |
| `/nist-800-171` | WebPage, Service, Organization, BreadcrumbList |
| `/pricing` | WebPage, Organization, BreadcrumbList |
| `/privacy-policy` | WebPage, Organization, BreadcrumbList |
| `/representative-engagements` | WebPage, Organization, BreadcrumbList |
| `/secure-ai-adoption` | WebPage, Service, Organization, BreadcrumbList |
| `/services/cmmc-readiness-sprint` | WebPage, Organization, BreadcrumbList |
| `/services/cmmc-scoping` | WebPage, Service, Organization, BreadcrumbList |
| `/solutions/ai-governance` | WebPage, Service, Organization, BreadcrumbList, FAQPage |
| `/solutions/ai-security` | WebPage, Service, Organization, BreadcrumbList, FAQPage |
| `/solutions/ai-transformation` | WebPage, Service, Organization, BreadcrumbList, FAQPage |
| `/solutions/cloud-security` | WebPage, Service, Organization, BreadcrumbList, FAQPage |
| `/solutions/cmmclens-platform` | WebPage, Service, Organization, BreadcrumbList, FAQPage |
| `/solutions/compliance-automation` | WebPage, Service, Organization, BreadcrumbList, FAQPage |
| `/solutions/cybersecurity-risk` | WebPage, Service, Organization, BreadcrumbList, FAQPage |
| `/solutions/microsoft-copilot-readiness` | WebPage, Service, Organization, BreadcrumbList, FAQPage |
| `/supplier-readiness` | WebPage, Service, Organization, BreadcrumbList |
| `/support` | WebPage, Organization, BreadcrumbList |
| `/terms` | WebPage, Organization, BreadcrumbList |
| `/why-defenseeye` | AboutPage, Organization, BreadcrumbList |
