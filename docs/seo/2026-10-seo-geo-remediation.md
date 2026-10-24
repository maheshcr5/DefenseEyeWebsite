# SEO, GEO, internal-linking, and conversion remediation — October 2026

Branch `seo-geo-conversion-remediation`, compared with production `51108e4`. Input: Ahrefs Site Audit export "Orphan page (has no incoming internal links)", crawl of 2026-10-18, 41 URLs. Tables were generated from server output, not typed by hand.

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

Each review-fix commit was checked on its own (type-check and full test suite pass at `bd08bf1`, `7ab8f17`, `4a73cc8`, and the head).

**Not included:** the Ahrefs CSV export (diagnostic input, left untracked), `dist/` (gitignored build output), and any environment, deploy, or server configuration.

## 4. Changed files (57, against `51108e4`)

- **Shared SEO, architecture, and content data:** `shared/certificationProcessContent.ts` (added), `shared/cmmcLevelsContent.ts` (added), `shared/datasheetContent.ts` (added), `shared/evidenceMappingContent.ts` (added), `shared/homeContent.ts` (added), `shared/insightsContent.ts` (added), `shared/landingPageContent.ts` (added), `shared/relatedLinks.ts` (added), `shared/routeMetadata.ts` (added), `shared/seoRoutes.ts` (modified), `shared/siteArchitecture.ts` (added), `shared/solutionPageContent.ts` (added), `shared/sprsScoreContent.ts` (added), `shared/whatIsCmmcContent.ts` (added)
- **Server:** `server/copilot.ts` (modified), `server/index.ts` (modified)
- **Client components, hooks, and lib:** `client/src/App.tsx` (modified), `client/src/components/Breadcrumbs.tsx` (added), `client/src/components/Footer.tsx` (modified), `client/src/components/KnowledgeHubLayout.tsx` (modified), `client/src/components/NavBar.tsx` (modified), `client/src/components/RelatedResources.tsx` (added), `client/src/hooks/useSeo.ts` (modified), `client/src/index.css` (modified), `client/src/lib/tracking.ts` (modified)
- **Client pages:** `client/src/pages/Blog.tsx` (modified), `client/src/pages/BlogPost.tsx` (modified), `client/src/pages/CMMCArchitecturePage.tsx` (modified), `client/src/pages/CMMCReadinessSprint.tsx` (modified), `client/src/pages/Datasheets.tsx` (modified), `client/src/pages/DeliveryModel.tsx` (modified), `client/src/pages/Home.tsx` (modified), `client/src/pages/KnowledgeHub.tsx` (modified), `client/src/pages/LandingPage.tsx` (modified), `client/src/pages/SolutionPage.tsx` (modified), `client/src/pages/SprintGuide.tsx` (modified), `client/src/pages/SupplierReadiness.tsx` (modified), `client/src/pages/ThoughtLeadership.tsx` (modified), `client/src/pages/knowledge-hub/CMMCLevels.tsx` (modified), `client/src/pages/knowledge-hub/CertificationProcess.tsx` (modified), `client/src/pages/knowledge-hub/EvidenceMapping.tsx` (modified), `client/src/pages/knowledge-hub/SPRSScore.tsx` (modified), `client/src/pages/knowledge-hub/WhatIsCMMC.tsx` (modified)
- **Client data:** `client/src/data/blogPosts.ts` (modified), `client/src/data/companyFacts.ts` (modified)
- **Public files:** `client/public/.well-known/ai-plugin.json` (modified), `client/public/llms.txt` (modified), `client/public/og-default.png` (added), `client/public/robots.txt` (modified)
- **Tests:** `server/css-sources.test.ts` (added), `server/internal-links.test.ts` (added), `server/route-metadata.test.ts` (added), `server/secure-ai-route.test.ts` (modified), `server/seo-routes.test.ts` (modified), `server/site-architecture.test.ts` (added)
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

| # | URL | Status | Indexable | Page type | Hub | New incoming links (linking page → anchor text) | Action taken | Reason / note |
|---|---|---|---|---|---|---|---|---|
| 1 | `/knowledge-hub/sprs-score` | 200 | Yes | Knowledge Hub guide | CMMC Knowledge Hub | `/blog/cmmc-poam-guide-what-assessors-want` → "How POA&M items affect your SPRS score"; `/blog/how-to-improve-sprs-score-fast` → "How SPRS scoring works"; `/faq` → "SPRS score guide"; +5 more | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 2 | `/knowledge-hub/certification-process` | 200 | Yes | Knowledge Hub guide | CMMC Knowledge Hub | `/blog/what-to-expect-c3pao-assessment` → "The CMMC certification process step by step"; `/cmmc-readiness-sprint-guide` → "The CMMC certification process step by step"; `/knowledge-hub` → "CMMC Certification Process"; +4 more | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 3 | `/blog/cmmc-consultant-red-flags` | 200 | Yes | Blog article | CMMC Blog | `/blog` → "CMMC Consultant Red Flags"; `/blog/cmmc-level-2-small-business-guide` → "Red flags when hiring a CMMC consultant"; `/pricing` → "Red flags when hiring a CMMC consultant" | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 4 | `/blog/cmmc-poam-guide-what-assessors-want` | 200 | Yes | Blog article | CMMC Blog | `/blog` → "CMMC POA&M: What Assessors Look For"; `/blog/how-to-improve-sprs-score-fast` → "Writing a POA&M assessors accept"; `/blog/what-to-expect-c3pao-assessment` → "What assessors look for in a POA&M"; +3 more | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 5 | `/cmmc-readiness-sprint-guide` | 200 | Yes | Commercial / company page | CMMC & Compliance Automation | `/blog/what-to-expect-c3pao-assessment` → "Prepare with a 4-week readiness sprint"; `/knowledge-hub/certification-process` → "4-week CMMC readiness sprint guide"; `/services/cmmc-readiness-sprint` → "4-Week CMMC Readiness Sprint Guide" | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 6 | `/datasheets` | 200 | Yes | Datasheet index | Supplier Readiness | `/capability-statement` → "DefenseEye datasheets"; `/datasheets/cmmc-compliance-automation` → "Datasheets"; `/datasheets/cmmclens` → "Datasheets"; +4 more; sitewide header + sitewide footer | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 7 | `/blog/cmmc-level-2-small-business-guide` | 200 | Yes | Blog article | CMMC Blog | `/blog` → "CMMC Level 2 for Small Businesses"; `/blog/cmmc-consultant-red-flags` → "CMMC Level 2 for small businesses"; `/blog/cmmc-level-2-compliance-checklist-2025` → "CMMC Level 2 for small businesses"; +1 more | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 8 | `/blog/what-counts-as-cui-plain-english-guide` | 200 | Yes | Blog article | CMMC Blog | `/blog` → "What Counts as CUI?"; `/blog/gcc-high-vs-m365-commercial-cmmc` → "What counts as CUI?"; `/industries/defense-industrial-base` → "What counts as CUI?"; +2 more | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 9 | `/pricing` | 200 | Yes | Commercial / company page | CMMC & Compliance Automation | `/blog/cmmc-consultant-red-flags` → "CMMC readiness pricing"; `/blog/cmmc-level-2-small-business-guide` → "CMMC readiness pricing for small contractors"; `/cmmc` → "CMMC readiness pricing and engagement options"; +4 more; sitewide footer | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 10 | `/privacy-policy` | 200 | Yes | Legal | Privacy Policy | `/` → "Privacy Policy"; sitewide header + sitewide footer | Sitewide footer link (legal) | Legal page; footer is the appropriate level of linking |
| 11 | `/blog/gcc-high-vs-m365-commercial-cmmc` | 200 | Yes | Blog article | CMMC Blog | `/blog` → "GCC High vs M365 Commercial for CMMC"; `/blog/what-counts-as-cui-plain-english-guide` → "Where CUI can live: GCC High vs M365 Commercial"; `/services/cmmc-scoping` → "Choosing GCC High or M365 Commercial for CUI"; +1 more | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 12 | `/datasheets/microsoft-copilot-readiness` | 200 | Yes | Datasheet | Supplier Readiness | `/datasheets` → "Microsoft Copilot Readiness Datasheet"; `/microsoft-ecosystem` → "Microsoft Copilot readiness datasheet"; `/solutions/microsoft-copilot-readiness` → "Microsoft Copilot readiness datasheet" | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 13 | `/delivery-model` | 200 | Yes | Commercial / company page | Supplier Readiness | `/capability-statement` → "Engagement formats"; `/pricing` → "DefenseEye engagement formats"; `/representative-engagements` → "How engagements are structured"; +2 more; sitewide header + sitewide footer | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 14 | `/insights/implement-ai-governance` | 200 | Yes | Answer page (insight) | Secure AI Adoption | `/industries/financial-services-credit-unions` → "How to implement AI governance in practice"; `/insights/what-is-nist-ai-rmf` → "Practical steps to implement AI governance"; `/knowledge-hub` → "How can organizations implement AI governance?"; +2 more | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 15 | `/datasheets/cmmc-compliance-automation` | 200 | Yes | Datasheet | Supplier Readiness | `/cmmc-compliance-automation` → "CMMC & compliance automation datasheet"; `/datasheets` → "CMMC & Compliance Automation Datasheet" | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 16 | `/lp/microsoft-supplier-ai-consulting` | 200 | Yes | Focused offer / campaign landing page | Supplier Readiness | `/datasheets/supplier-readiness` → "Supplier capability review for Microsoft-centered environments"; `/supplier-readiness` → "Minority-owned supplier support for Microsoft-centered programs" | Kept indexable; unique title and server-rendered content; contextual links from the related solution/insight/datasheet pages; breadcrumb | Campaign-only intent not confirmed in the repository, so not noindexed (see business decisions) |
| 17 | `/lp/ai-governance-consulting` | 200 | Yes | Focused offer / campaign landing page | Secure AI Adoption | `/insights/implement-ai-governance` → "Start with an AI governance readiness assessment"; `/solutions/ai-governance` → "AI governance readiness assessment" | Kept indexable; unique title and server-rendered content; contextual links from the related solution/insight/datasheet pages; breadcrumb | Campaign-only intent not confirmed in the repository, so not noindexed (see business decisions) |
| 18 | `/solutions/compliance-automation` | 200 | Yes | Solution / service page | CMMC & Compliance Automation | `/cmmc-compliance-automation` → "Compliance Automation Consulting"; `/insights/ai-audit-readiness` → "Compliance Automation Consulting"; `/insights/ai-automated-evidence-collection` → "Compliance Automation Consulting"; +3 more; sitewide footer | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 19 | `/insights/security-copilot-cybersecurity-operations` | 200 | Yes | Answer page (insight) | Cybersecurity Risk | `/microsoft-ecosystem` → "Security Copilot for cybersecurity operations"; `/solutions/ai-security` → "Using Security Copilot in security operations"; `/solutions/cybersecurity-risk` → "Security Copilot for Security Operations"; +1 more | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 20 | `/industries/defense-industrial-base` | 200 | Yes | Industry page | CMMC & Compliance Automation | `/` → "Prepare for CMMC"; `/cmmc-compliance-automation` → "Defense Industrial Base"; sitewide footer | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 21 | `/datasheets/cmmclens` | 200 | Yes | Datasheet | Supplier Readiness | `/cmmclens` → "CMMCLens product sheet"; `/datasheets` → "CMMCLens Product Sheet"; `/solutions/cmmclens-platform` → "CMMCLens product sheet" | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 22 | `/lp/compliance-automation` | 200 | Yes | Focused offer / campaign landing page | CMMC & Compliance Automation | `/insights/ai-audit-readiness` → "Plan compliance automation for evidence and reporting"; `/solutions/compliance-automation` → "Compliance automation roadmap and CMMCLens fit assessment" | Kept indexable; unique title and server-rendered content; contextual links from the related solution/insight/datasheet pages; breadcrumb | Campaign-only intent not confirmed in the repository, so not noindexed (see business decisions) |
| 23 | `/solutions/cmmclens-platform` | 200 | Yes | Solution / service page | CMMC & Compliance Automation | `/cmmc-evidence-automation` → "CMMCLens platform overview"; `/cmmclens` → "CMMCLens Platform Overview"; `/datasheets/cmmclens` → "CMMCLens platform overview" | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 24 | `/lp/secure-ai-adoption` | 200 | Yes | Focused offer / campaign landing page | Secure AI Adoption | `/secure-ai-adoption` → "Secure AI adoption readiness review"; `/solutions/ai-transformation` → "Secure AI adoption readiness review" | Kept indexable; unique title and server-rendered content; contextual links from the related solution/insight/datasheet pages; breadcrumb | Campaign-only intent not confirmed in the repository, so not noindexed (see business decisions) |
| 25 | `/solutions/cloud-security` | 200 | Yes | Solution / service page | Cybersecurity Risk | `/attacksense` → "Microsoft cloud security review"; `/blog/gcc-high-vs-m365-commercial-cmmc` → "Azure and GCC High cloud security consulting"; `/lp/azure-cloud-security` → "Microsoft Cloud Security"; +2 more; sitewide footer | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 26 | `/industries/financial-services-credit-unions` | 200 | Yes | Industry page | Secure AI Adoption | `/` → "See the financial services path"; `/insights/implement-ai-governance` → "AI governance for financial institutions"; `/secure-ai-adoption` → "Financial Services & Credit Unions"; +2 more; sitewide header + sitewide footer | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 27 | `/lp/cmmc-evidence-automation` | 200 | Yes | Focused offer / campaign landing page | CMMC & Compliance Automation | `/cmmc-evidence-automation` → "Evidence automation implementation with CMMCLens"; `/insights/ai-automated-evidence-collection` → "Put CMMC evidence automation in place" | Kept indexable; unique title and server-rendered content; contextual links from the related solution/insight/datasheet pages; breadcrumb | Campaign-only intent not confirmed in the repository, so not noindexed (see business decisions) |
| 28 | `/cmmc-readiness-sprint` | 301 → `/services/cmmc-readiness-sprint` | No (redirected) | Duplicate service page | CMMC & Compliance Automation | None — links point to the target instead | Consolidated into `/services/cmmc-readiness-sprint`; unique FAQ moved; removed from sitemap | Thin page with the same intent and CTA as the full fixed-scope sprint offer |
| 29 | `/datasheets/supplier-readiness` | 200 | Yes | Datasheet | Supplier Readiness | `/datasheets` → "Supplier Readiness Datasheet"; `/supplier-readiness` → "Supplier readiness datasheet" | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 30 | `/insights/ai-automated-evidence-collection` | 200 | Yes | Answer page (insight) | CMMC & Compliance Automation | `/cmmc-evidence-automation` → "How AI can automate evidence collection"; `/insights/continuous-compliance-monitoring` → "AI-automated evidence collection"; `/knowledge-hub` → "How can AI automate evidence collection?"; +2 more | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 31 | `/lp/cmmclens-demo` | 200 | Yes | Focused offer / campaign landing page | CMMC & Compliance Automation | `/cmmclens` → "CMMCLens demo and evidence automation fit review"; `/solutions/cmmclens-platform` → "Request a CMMCLens demo and fit review" | Kept indexable; unique title and server-rendered content; contextual links from the related solution/insight/datasheet pages; breadcrumb | Campaign-only intent not confirmed in the repository, so not noindexed (see business decisions) |
| 32 | `/insights/continuous-compliance-monitoring` | 200 | Yes | Answer page (insight) | CMMC & Compliance Automation | `/insights/ai-audit-readiness` → "Continuous compliance monitoring"; `/insights/what-is-rmf-readiness` → "Continuous monitoring for compliance programs"; `/solutions/compliance-automation` → "Continuous Compliance Monitoring"; +1 more | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 33 | `/lp/cmmc-compliance-automation` | 200 | Yes | Focused offer / campaign landing page | CMMC & Compliance Automation | `/cmmc` → "CMMC compliance automation sprint"; `/cmmc-compliance-automation` → "CMMC compliance automation sprint" | Kept indexable; unique title and server-rendered content; contextual links from the related solution/insight/datasheet pages; breadcrumb | Campaign-only intent not confirmed in the repository, so not noindexed (see business decisions) |
| 34 | `/lp/azure-cloud-security` | 200 | Yes | Focused offer / campaign landing page | Cybersecurity Risk | `/microsoft-ecosystem` → "Azure cloud security and compliance review"; `/solutions/cloud-security` → "Azure security and compliance review" | Kept indexable; unique title and server-rendered content; contextual links from the related solution/insight/datasheet pages; breadcrumb | Campaign-only intent not confirmed in the repository, so not noindexed (see business decisions) |
| 35 | `/insights/ai-audit-readiness` | 200 | Yes | Answer page (insight) | CMMC & Compliance Automation | `/insights/ai-automated-evidence-collection` → "How AI can improve audit readiness"; `/solutions/compliance-automation` → "AI and Audit Readiness" | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 36 | `/lp/microsoft-copilot-readiness` | 200 | Yes | Focused offer / campaign landing page | Secure AI Adoption | `/datasheets/microsoft-copilot-readiness` → "Microsoft Copilot readiness assessment"; `/solutions/microsoft-copilot-readiness` → "Copilot governance assessment" | Kept indexable; unique title and server-rendered content; contextual links from the related solution/insight/datasheet pages; breadcrumb | Campaign-only intent not confirmed in the repository, so not noindexed (see business decisions) |
| 37 | `/microsoft-ecosystem` | 200 | Yes | Commercial / company page | Supplier Readiness | `/datasheets/microsoft-copilot-readiness` → "Microsoft ecosystem experience"; `/insights/security-copilot-cybersecurity-operations` → "Microsoft security and cloud experience"; `/solutions/cloud-security` → "DefenseEye's Microsoft ecosystem experience"; +2 more; sitewide footer | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 38 | `/lp/cmmc-level-2-readiness` | 200 | Yes | Focused offer / campaign landing page | CMMC & Compliance Automation | `/cmmc-level-2-readiness` → "CMMC Level 2 readiness assessment"; `/insights/what-is-cmmc-level-2` → "Assess your CMMC Level 2 readiness" | Kept indexable; unique title and server-rendered content; contextual links from the related solution/insight/datasheet pages; breadcrumb | Campaign-only intent not confirmed in the repository, so not noindexed (see business decisions) |
| 39 | `/datasheets/secure-ai-adoption` | 200 | Yes | Datasheet | Supplier Readiness | `/datasheets` → "Secure AI Adoption Datasheet"; `/secure-ai-adoption` → "Secure AI adoption one-page datasheet"; `/solutions/ai-governance` → "Secure AI adoption datasheet" | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 40 | `/services/cmmc-scoping` | 200 | Yes | Solution / service page | CMMC & Compliance Automation | `/blog/what-counts-as-cui-plain-english-guide` → "Define your CUI boundary with CMMC scoping"; `/cmmc` → "CMMC scoping service"; `/cmmc-compliance-automation` → "CMMC Scoping"; +5 more; sitewide footer | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |
| 41 | `/insights/what-is-rmf-readiness` | 200 | Yes | Answer page (insight) | CMMC & Compliance Automation | `/insights/continuous-compliance-monitoring` → "Continuous monitoring in RMF readiness"; `/nist-800-171` → "RMF readiness for federal systems"; `/solutions/compliance-automation` → "What Is RMF Readiness?" | Kept indexable; server-rendered content, breadcrumb, hub section listing, contextual links | Linked only from client-rendered React before; invisible to non-JS crawlers |

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
| `/blog/what-to-expect-c3pao-assessment` | C3PAO Assessment Walkthrough \| DefenseEye (41) | What to Expect in a C3PAO Assessment \| DefenseEye (49) | 130 → 140 | Y → Y | index, follow |
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
| Contact form | Unchanged. Empty submit is blocked and the 8 required fields are flagged; nothing is posted. Server returns 400 on an invalid body. Unit tests cover success and error states (32 contact tests) | A live submission was **not** sent, to avoid real emails |

No new offers or CTAs were invented; all link to existing services, pages, or booking links.

## 13. Mobile and accessibility checks

Device-emulated audit (Chrome DevTools Protocol) of 18 key pages at 390 px and 1440 px:

- **No horizontal overflow** on any page.
- **Exactly one H1** per page.
- **No images missing alt text**, and no links or buttons without an accessible name.
- **Keyboard:** with real Tab presses, every focus stop in the header, main content, breadcrumb, related cards, homepage path cards, and footer has a visible focus indicator.
- **Tap targets:** CTAs are ≥ 36 px tall (WCAG 2.2 AA minimum is 24 px).
- **Breadcrumb** wraps cleanly on mobile; heading order is correct in the new sections (footer headings changed from `h4` to `h2`).

**Pre-existing issues not caused by this branch (documented, not fixed):**

1. **Contact form labels** are not programmatically associated with inputs (no `htmlFor`/`id`), so screen readers do not announce them. The same applies to one field on `/secure-ai-adoption`. High priority.
2. **No skip-to-content link**: keyboard users tab through about 60 header stops first.
3. **Blog post template** skips one heading level.

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
| Unit/integration tests | `npx vitest run --root .` | **25 files, 246 tests, all pass** |
| Production build | `pnpm build` (vite build + server bundle) | Pass |
| Route/metadata | `server/route-metadata.test.ts` | Unique titles and descriptions, length budgets, every client route covered or redirected, single-hop redirects |
| Architecture/orphans | `server/site-architecture.test.ts` | All 41 orphans have an outcome; ≥ 2 raw-HTML inlinks; one H1 per page; no links to unknown or redirected URLs; breadcrumb/schema parity; llms.txt URLs valid; no pricing in schema; share image 1200×630 |
| Internal links | `server/internal-links.test.ts` | 597 link occurrences (74 targets) in source all resolve |
| CSS guard | `server/css-sources.test.ts` | Excluded components are not imported |
| Live HTTP | Local production build: all 74 sitemap URLs plus redirects, 404, robots.txt, llms.txt, API | 200 + `index, follow` + self canonical + `og:url` + one H1 + valid JSON-LD + unique titles; redirects single-hop; 404 → noindex |
| Sitemap XML | Parsed with an XML parser | Well-formed, 74 URLs |
| Structured data | Script checking JSON syntax, required properties per Google docs, `@id` resolution, and visible-content consistency | 0 errors (warnings in §17) |
| Mobile/a11y and CTAs | Chrome DevTools Protocol scripts | See §12 and §13 |
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
| `Article` has `dateModified` but no `datePublished` | 13 knowledge-hub / insight pages | Publish dates are not recorded in the repo; not invented |
| `SoftwareApplication` lacks `offers` / `aggregateRating` (not eligible for Google software rich results) | `/cmmclens` | No public pricing or reviews exist |
| `FAQPage` rich results are limited by Google to authoritative government/health sites | 22 pages | Markup stays valid and useful to other parsers and AI systems |
| Blog posts still contain CMMC-AB **process statements** (who issues certification, eMASS submission) and the `marketplace.cmmcab.org` URL | 2 posts | Needs SME confirmation before rewriting regulatory process claims |
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
6. **Knowledge-hub copy in `be1773e`:** confirm that the "(2026)" H1 labels and the retitled certification-process guide reflect a real content review.
7. **Content SME review** of the CMMC-AB process statements in §17.

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
