import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  HASHED_ASSET_CACHE_CONTROL,
  HTML_CACHE_CONTROL,
  LEGACY_REDIRECTS,
  OPERATIONAL_STATIC_CACHE_CONTROL,
  SITEMAP_CACHE_CONTROL,
  getRouteMeta,
  getStaticCacheControl,
  injectRouteMetadataHtml,
  injectRouteSpecificHtml,
  resolveUrlDisposition,
} from "./index";
import {
  buildRouteSchemas,
  canonicalUrl,
  renderRouteFallbackHtml,
  renderSitemapXml,
  SITEMAP_ENTRIES,
  TIER_1_ROUTES,
} from "../shared/seoRoutes";

const baseHtml = `<!doctype html>
<html>
  <head>
    <title>DefenseEye | Secure Agentic AI Implementation</title>
    <meta name="description" content="Homepage description" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://defenseeye.ai/" />
    <meta property="og:title" content="Homepage title" />
    <meta property="og:description" content="Homepage OG" />
    <meta property="og:url" content="https://defenseeye.ai/" />
    <meta name="twitter:title" content="Homepage title" />
    <meta name="twitter:description" content="Homepage Twitter" />
    <!-- Schema.org: ProfessionalService + Organization -->
    <script type="application/ld+json">[{"knowsAbout":["AttackSense","CMMCLens","CMMC"]}]</script>
  </head>
  <body>
    <div id="root"><div class="de-pr"><main><h1>Implement Agentic AI Securely</h1><p>Additional DefenseEye Capabilities: AttackSense CMMCLens CMMC</p></main></div></div>
    <!-- Google Analytics 4 - loads only after cookie consent granted -->
  </body>
</html>`;

const homeH1 = TIER_1_ROUTES.find((route) => route.path === "/")?.h1;

function rootContent(html: string) {
  return html.match(/<div id="root">([\s\S]*?)<\/div>\s*(?=<!-- Google Analytics 4)/)?.[1] ?? "";
}

function htmlEscaped(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function metaEscaped(value: string) {
  return value.replace(/"/g, "&quot;");
}

describe("SEO route registry", () => {
  it("defines unique expected metadata for Tier 1 commercial routes", () => {
    const titles = new Set<string>();

    for (const route of TIER_1_ROUTES) {
      expect(route.path).toMatch(/^\//);
      expect(route.title).toBeTruthy();
      expect(route.description.length).toBeGreaterThan(80);
      expect(route.h1).toBeTruthy();
      expect(route.links.length).toBeGreaterThan(0);
      expect(canonicalUrl(route.path)).toBe(`https://defenseeye.ai${route.path === "/" ? "/" : route.path}`);
      expect(titles.has(route.title)).toBe(false);
      titles.add(route.title);
    }
  });

  it("renders route-specific direct HTML with crawlable links and no stale homepage fallback", () => {
    for (const route of TIER_1_ROUTES) {
      const fallback = renderRouteFallbackHtml(route);

      expect(fallback).toContain(`<h1>${htmlEscaped(route.h1)}</h1>`);
      expect(fallback).toContain(htmlEscaped(route.summary));
      expect(fallback).toContain("<a ");
      expect(fallback).not.toContain("Operationalize Secure AI Adoption and CMMC Readiness");
      expect(fallback).not.toContain("Secure AI Adoption and CMMC Compliance Automation");
      if (route.path !== "/" && route.h1 !== homeH1) {
        expect(fallback).not.toContain(`<h1>${homeH1}</h1>`);
      }
    }
  });

  it("injects route-specific body and structured data into SPA HTML", () => {
    const cmmcHtml = injectRouteSpecificHtml(baseHtml, "/cmmc-level-2-readiness");
    const secureAiHtml = injectRouteSpecificHtml(baseHtml, "/secure-ai-adoption");

    expect(rootContent(cmmcHtml)).toContain("<h1>CMMC Level 2 readiness consulting and automation</h1>");
    expect(rootContent(cmmcHtml)).not.toContain("Additional DefenseEye Capabilities: AttackSense CMMCLens CMMC");
    expect(cmmcHtml).toContain('data-server-route-schema="true"');
    expect(cmmcHtml).toContain('"@type": "Service"');

    expect(rootContent(secureAiHtml)).toContain("<h1>Implement Agentic AI Securely</h1>");
    expect(rootContent(secureAiHtml)).toContain("Secure Agentic AI Readiness");
    expect(rootContent(secureAiHtml)).not.toContain("Target CMMC Level");
  });

  it("injects expected title, description, canonical, and social metadata for every Tier 1 route", () => {
    for (const route of TIER_1_ROUTES) {
      const html = injectRouteMetadataHtml(baseHtml, route.path, route);
      const canonical = canonicalUrl(route.path);

      expect(html).toContain(`<title>${route.title}</title>`);
      expect(html).toContain(`<meta name="description" content="${metaEscaped(route.description)}"`);
      expect(html).toContain(`<link rel="canonical" href="${canonical}"`);
      expect(html).toContain(`<meta property="og:title" content="${metaEscaped(route.title)}"`);
      expect(html).toContain(`<meta property="og:description" content="${metaEscaped(route.description)}"`);
      expect(html).toContain(`<meta property="og:url" content="${canonical}"`);
      expect(html).toContain(`<meta name="twitter:title" content="${metaEscaped(route.title)}"`);
      expect(html).toContain(`<meta name="twitter:description" content="${metaEscaped(route.description)}"`);
      expect(html).not.toContain('<meta name="robots" content="noindex');
    }
  });

  it("generates syntactically valid route-specific JSON-LD", () => {
    for (const route of TIER_1_ROUTES) {
      const schemas = buildRouteSchemas(route);
      expect(() => JSON.parse(JSON.stringify(schemas))).not.toThrow();
      expect(JSON.stringify(schemas)).toContain(canonicalUrl(route.path));
      expect(JSON.stringify(schemas)).not.toContain("FAQPage");
      expect(JSON.stringify(schemas)).not.toContain("aggregateRating");
      expect(JSON.stringify(schemas)).not.toContain('"@type":"Review"');
    }
  });

  it("gives the five newly-promoted routes structured data that matches their visible content, with no unsupported schema types", () => {
    const promotedPaths = ["/privacy-policy", "/support", "/faq", "/capability-statement", "/services/cmmc-scoping"];
    const forbiddenTypes = [
      "SoftwareApplication",
      "FAQPage",
      "Person",
      "Review",
      "Rating",
      "AggregateRating",
      "Certification",
      "GovernmentOrganization",
    ];

    for (const path of promotedPaths) {
      const route = TIER_1_ROUTES.find((r) => r.path === path);
      expect(route, `expected a TIER_1_ROUTES entry for ${path}`).toBeTruthy();

      const schemas = buildRouteSchemas(route!);
      const schemaText = JSON.stringify(schemas);
      const types = schemas.map((s: Record<string, unknown>) => s["@type"]);

      // /services/cmmc-scoping genuinely describes a professional service (CMMC
      // scoping) and is expected to carry a Service schema, matching sibling
      // /services/* and /cmmc* routes. The other four are utility/legal/FAQ
      // pages with no service being sold on the page itself, so they must not
      // receive a Service schema.
      if (path === "/services/cmmc-scoping") {
        expect(types).toContain("Service");
        expect(types).toContain("WebPage");
      } else {
        expect(types).not.toContain("Service");
        expect(types).toContain("WebPage");
      }

      expect(types).toContain("BreadcrumbList");
      for (const forbidden of forbiddenTypes) {
        expect(schemaText).not.toContain(forbidden);
      }

      // Structured data must match visible/direct-render content: the WebPage
      // schema's name/description must be the route's own real h1/description,
      // not fabricated or homepage-derived text.
      const webPageSchema = schemas.find((s: Record<string, unknown>) => s["@type"] === "WebPage") as
        | { name: string; description: string }
        | undefined;
      expect(webPageSchema?.name).toBe(route!.h1);
      expect(webPageSchema?.description).toBe(route!.description);
    }
  });

  it("does not classify /faq as an AboutPage, CollectionPage, or FAQPage", () => {
    const faq = TIER_1_ROUTES.find((r) => r.path === "/faq")!;
    expect(faq.schemaKind).toBe("page");
    const schemaText = JSON.stringify(buildRouteSchemas(faq));
    expect(schemaText).not.toContain("AboutPage");
    expect(schemaText).not.toContain("CollectionPage");
    expect(schemaText).not.toContain("FAQPage");
    expect(schemaText).toContain('"@type":"WebPage"');
  });

  it("defines accurate industry route metadata, direct HTML, and structured data", () => {
    const financial = TIER_1_ROUTES.find((route) => route.path === "/industries/financial-services-credit-unions");
    const dib = TIER_1_ROUTES.find((route) => route.path === "/industries/defense-industrial-base");

    expect(financial).toMatchObject({
      title: "Secure AI for Financial Services and Credit Unions | DefenseEye",
      h1: "Secure AI for Financial Services and Credit Unions",
      schemaKind: "service",
    });
    expect(dib).toMatchObject({
      title: "Cybersecurity and Compliance Support for the Defense Industrial Base | DefenseEye",
      h1: "Cybersecurity and Compliance Support for the Defense Industrial Base",
      schemaKind: "service",
    });

    const financialHtml = renderRouteFallbackHtml(financial!);
    const dibHtml = renderRouteFallbackHtml(dib!);

    [
      "/secure-ai-adoption#secure-ai-consultation",
      "/secure-ai-adoption",
      "/solutions/ai-governance",
      "/solutions/ai-security",
      "/solutions/ai-transformation",
      "/solutions/microsoft-copilot-readiness",
      "/representative-engagements",
    ].forEach((href) => expect(financialHtml).toContain(`href="${href}"`));

    [
      "/contact?inquiry=cmmc",
      "/cmmc",
      "/cmmc-level-2-readiness",
      "/cmmc-compliance-automation",
      "/cmmclens",
      "/supplier-readiness",
      "/capability-statement",
      "/representative-engagements",
    ].forEach((href) => expect(dibHtml).toContain(`href="${href}"`));

    expect(financialHtml).toContain("regulated financial-services teams and credit unions");
    expect(financialHtml).toContain("Why DefenseEye for Secure AI in Financial Services");
    expect(financialHtml).toContain("What a Readiness Conversation Can Clarify");
    expect(financialHtml).toContain("they are not customer case studies");
    expect(dibHtml).toContain("requirements that may apply based on contract scope");
    expect(dibHtml).toContain("Why DefenseEye for Defense Contractors and Suppliers");
    expect(dibHtml).toContain("Multiple CMMC Certified Professionals supporting CMMC and NIST SP 800-171 readiness work");
    expect(dibHtml).toContain("What an Initial Readiness Conversation Can Clarify");
    expect(dibHtml).not.toMatch(/C3PAO|guaranteed|contract award|government representative/i);

    const schemas = [...buildRouteSchemas(financial!), ...buildRouteSchemas(dib!)];
    const schemaText = JSON.stringify(schemas);
    expect(schemaText).toContain('"@type":"WebPage"');
    expect(schemaText).toContain('"@type":"BreadcrumbList"');
    expect(schemaText).not.toContain("FAQPage");
    expect(schemaText).not.toContain("aggregateRating");
    expect(schemaText).not.toContain('"@type":"Review"');
    expect(schemaText).not.toContain("FinancialProduct");
    expect(schemaText).not.toContain("GovernmentOrganization");
  });
});

describe("sitemap and robots", () => {
  it("renders valid XML with unique URLs and all Tier 1 routes", () => {
    const xml = renderSitemapXml();
    const locations = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]);

    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(new Set(locations).size).toBe(locations.length);
    expect(locations).toHaveLength(73);
    for (const route of TIER_1_ROUTES) {
      expect(locations).toContain(canonicalUrl(route.path));
    }
    expect(SITEMAP_ENTRIES.every((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod))).toBe(true);

    const retiredOrRedirectedPaths = [
      "/2025/12/24/the-ultimate-cmmc-2-0-level-2-checklist-for-small-businesses-2025",
      "/saas-landing",
      "/capability-statements",
      "/lp/iso-42001-readiness",
      "/author/siva",
      "/author/mc",
      "/careers-2",
      "/umami",
      "/why-defenseeye/",
      "/faq/",
      "/__defenseeye_missing_route_test__",
    ];
    for (const retiredPath of retiredOrRedirectedPaths) {
      expect(locations.some((loc) => loc.endsWith(retiredPath))).toBe(false);
    }
  });

  it("adds exactly the four newly-registered canonical destinations, and relocates /capability-statement without changing the total by a fifth", () => {
    // Baseline (HEAD a3625c916) had 69 unique sitemap URLs: 19 in TIER_1_ROUTES
    // + 50 in additionalSitemapEntries (including /capability-statement).
    // /privacy-policy, /support, /faq, and /services/cmmc-scoping were not in
    // either list before and are the only four net-new URLs (69 -> 73).
    // /capability-statement already existed in additionalSitemapEntries and was
    // merely relocated into TIER_1_ROUTES (same lastmod "2026-06-26", same URL) —
    // it does not count toward the four newly-added URLs.
    const xml = renderSitemapXml();
    const locations = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]);
    expect(locations).toHaveLength(73);

    for (const newPath of ["/privacy-policy", "/support", "/faq", "/services/cmmc-scoping"]) {
      expect(xml).toContain(`<loc>${canonicalUrl(newPath)}</loc>`);
    }

    const entriesByPath = new Map(SITEMAP_ENTRIES.map((entry) => [entry.path, entry]));
    expect(entriesByPath.get("/capability-statement")?.lastmod).toBe("2026-06-26");
  });

  it("updates only the changed homepage, Secure AI, and new industry sitemap dates", () => {
    const entriesByPath = new Map(SITEMAP_ENTRIES.map((entry) => [entry.path, entry]));

    expect(entriesByPath.get("/")?.lastmod).toBe("2026-09-01");
    expect(entriesByPath.get("/secure-ai-adoption")?.lastmod).toBe("2026-09-01");
    expect(entriesByPath.get("/industries/financial-services-credit-unions")?.lastmod).toBe("2026-09-04");
    expect(entriesByPath.get("/industries/defense-industrial-base")?.lastmod).toBe("2026-09-04");
    expect(entriesByPath.get("/cmmc")?.lastmod).toBe("2026-08-31");
    expect(entriesByPath.get("/cmmclens")?.lastmod).toBe("2026-08-31");
    expect(entriesByPath.get("/representative-engagements")?.lastmod).toBe("2026-06-26");
    expect(entriesByPath.get("/why-defenseeye")?.lastmod).toBe("2026-09-05");
    expect(entriesByPath.get("/capability-statement")?.lastmod).toBe("2026-06-26");
    expect(entriesByPath.get("/supplier-readiness")?.lastmod).toBe("2026-08-31");
    expect(entriesByPath.get("/delivery-model")?.lastmod).toBe("2026-06-26");
  });

  it("keeps robots.txt pointed at the canonical sitemap", () => {
    const robots = fs.readFileSync(path.resolve("client/public/robots.txt"), "utf-8");

    expect(robots).toContain("Sitemap: https://defenseeye.ai/sitemap.xml");
    expect(robots).toMatch(/User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//);
    expect(robots).toMatch(/User-agent:\s*OAI-AdsBot[\s\S]*?Allow:\s*\//);
    expect(robots).toMatch(/User-agent:\s*ChatGPT-User[\s\S]*?Allow:\s*\//);
  });
});

describe("cache-control policy", () => {
  it("serves content-hashed assets with immutable caching", () => {
    expect(getStaticCacheControl("C:/site/dist/public/assets/index-sBAT_9Sr.js")).toBe(HASHED_ASSET_CACHE_CONTROL);
    expect(getStaticCacheControl("C:/site/dist/public/assets/index-C7lM2bJq.css")).toBe(HASHED_ASSET_CACHE_CONTROL);
  });

  it("does not apply immutable caching to HTML, API paths, or unhashed public assets", () => {
    expect(getStaticCacheControl("C:/site/dist/public/index.html")).toBeUndefined();
    expect(getStaticCacheControl("C:/site/dist/public/api/contact")).toBeUndefined();
    expect(getStaticCacheControl("C:/site/dist/public/defenseeye-logo.png")).toBeUndefined();
    expect(getStaticCacheControl("C:/site/dist/public/assets/logo.png")).toBeUndefined();
  });

  it("keeps HTML, sitemap, robots, and API cache policies distinct", () => {
    expect(HTML_CACHE_CONTROL).toBe("no-store, no-cache, must-revalidate");
    expect(SITEMAP_CACHE_CONTROL).toBe("public, max-age=3600");
    expect(getStaticCacheControl("C:/site/dist/public/robots.txt")).toBe(OPERATIONAL_STATIC_CACHE_CONTROL);
    expect(getStaticCacheControl("C:/site/dist/public/sitemap.xml")).toBeUndefined();
    expect(getStaticCacheControl("C:/site/dist/public/api/contact")).toBeUndefined();
  });
});

describe("newly-registered route metadata parity", () => {
  it("serves real metadata (not the 404 fallback) for /faq and /services/cmmc-scoping", () => {
    expect(getRouteMeta("/faq")).toEqual({
      title: "CMMC FAQ — Common Questions Answered | DefenseEye",
      description:
        "Answers to the most common CMMC 2.0 questions from defense contractors: Level 1 vs Level 2, CUI, SPRS scores, C3PAO assessments, timelines, and costs.",
    });
    expect(getRouteMeta("/services/cmmc-scoping")).toEqual({
      title: "CMMC Scoping | Define Your CUI Boundary | DefenseEye",
      description:
        "Professional CMMC scoping for defense contractors. Define your CUI environment boundary, reduce assessment scope, and build assessment-preparation scoping documentation before your gap assessment.",
    });
  });

  it("still returns null (404) for an arbitrary unknown route", () => {
    expect(getRouteMeta("/__defenseeye_missing_route_test__")).toBeNull();
  });
});

describe("historical URL, trailing-slash, and retired-WordPress remediation", () => {
  const isKnownRoute = (candidate: string) => getRouteMeta(candidate) !== null;
  const resolve = (pathname: string) => resolveUrlDisposition(pathname, isKnownRoute);

  it("permanently redirects historical URLs with a genuine current equivalent", () => {
    expect(resolve("/capability-statements")).toEqual({
      kind: "redirect",
      status: 301,
      location: "/capability-statement",
    });
    expect(resolve("/capability-statements/")).toEqual({
      kind: "redirect",
      status: 301,
      location: "/capability-statement",
    });
  });

  it("redirects the historical capability-statement PDF to the actual current buyer destination, taking precedence over the wp-content 410 rule", () => {
    const pdfPath = "/wp-content/uploads/2025/10/DefenseEye-Capability-Statement-Federal.pdf";
    expect(resolve(pdfPath)).toEqual({
      kind: "redirect",
      status: 301,
      location: "/capability-statement",
    });
    // Sibling paths under the same retired namespace, without the exact-match
    // redirect, must still fall through to the WordPress 410 rule.
    expect(resolve("/wp-content/uploads/2025/10/some-other-file.pdf")).toEqual({ kind: "gone" });
  });

  it("does not redirect the historical checklist or SaaS landing URLs to the homepage merely to avoid a 404", () => {
    expect(resolve("/2025/12/24/the-ultimate-cmmc-2-0-level-2-checklist-for-small-businesses-2025/")).not.toMatchObject(
      { kind: "redirect", location: "/" }
    );
    expect(resolve("/saas-landing/")).not.toMatchObject({ kind: "redirect", location: "/" });
  });

  it("returns 410 Gone for the historical checklist URL with no substantially equivalent replacement", () => {
    expect(resolve("/2025/12/24/the-ultimate-cmmc-2-0-level-2-checklist-for-small-businesses-2025/")).toEqual({
      kind: "gone",
    });
    expect(resolve("/2025/12/24/the-ultimate-cmmc-2-0-level-2-checklist-for-small-businesses-2025")).toEqual({
      kind: "gone",
    });
  });

  it("returns 410 Gone for the historical SaaS landing page rather than guessing it belongs to CMMCLens", () => {
    expect(resolve("/saas-landing/")).toEqual({ kind: "gone" });
    expect(resolve("/saas-landing")).toEqual({ kind: "gone" });
  });

  it("returns 410 Gone for retired author archives", () => {
    expect(resolve("/author/siva")).toEqual({ kind: "gone" });
    expect(resolve("/author/siva/")).toEqual({ kind: "gone" });
    expect(resolve("/author/mc")).toEqual({ kind: "gone" });
    expect(resolve("/author/mc/")).toEqual({ kind: "gone" });
  });

  it("returns 410 Gone for the retired careers URL, since no current careers replacement exists", () => {
    expect(isKnownRoute("/careers")).toBe(false);
    expect(resolve("/careers-2")).toEqual({ kind: "gone" });
    expect(resolve("/careers-2/")).toEqual({ kind: "gone" });
  });

  it("returns 410 Gone for /umami because it is not a live analytics endpoint on the apex site", () => {
    // The real Umami integration loads from a separate analytics.* subdomain
    // (VITE_ANALYTICS_ENDPOINT), never from a defenseeye.ai/umami path.
    expect(resolve("/umami")).toEqual({ kind: "gone" });
    expect(resolve("/umami/")).toEqual({ kind: "gone" });
  });

  it("returns 410 Gone for the literal /$ probe path — one unambiguous disposition, never a pass-through 404", () => {
    expect(resolve("/$")).toEqual({ kind: "gone" });
    expect(resolve("/$/")).toEqual({ kind: "gone" });
    expect(resolve("/$")).not.toEqual({ kind: "pass" });
    expect(resolve("/$/")).not.toEqual({ kind: "pass" });
    // A genuinely arbitrary unknown path must remain distinct: pass-through to
    // ordinary 404 handling, never 410.
    expect(resolve("/__defenseeye_missing_route_test__")).toEqual({ kind: "pass" });
  });

  it("does not change the /lp/iso-42001-readiness 410 disposition based on query strings", () => {
    expect(resolve("/lp/iso-42001-readiness")).toEqual({ kind: "gone" });
    expect(resolve("/lp/iso-42001-readiness/")).toEqual({ kind: "gone" });
    // resolveUrlDisposition operates on the pathname only (query strings are
    // stripped by Express's req.path before this function ever sees them), so
    // there is no code path by which a query string could alter this 410.
  });

  it("returns 410 Gone for representative WordPress namespaces and PHP probes", () => {
    expect(resolve("/wp-content")).toEqual({ kind: "gone" });
    expect(resolve("/wp-content/")).toEqual({ kind: "gone" });
    expect(resolve("/wp-content/uploads/2024/01/malware.php")).toEqual({ kind: "gone" });
    expect(resolve("/wp-admin")).toEqual({ kind: "gone" });
    expect(resolve("/wp-admin/")).toEqual({ kind: "gone" });
    expect(resolve("/wp-admin/admin-ajax.php")).toEqual({ kind: "gone" });
    expect(resolve("/wp-includes")).toEqual({ kind: "gone" });
    expect(resolve("/wp-includes/wlwmanifest.xml")).toEqual({ kind: "gone" });
    expect(resolve("/wp-login.php")).toEqual({ kind: "gone" });
    expect(resolve("/wp-cron.php")).toEqual({ kind: "gone" });
    expect(resolve("/wp-settings.php")).toEqual({ kind: "gone" });
  });

  it("normalizes valid trailing-slash requests to their canonical non-trailing-slash URL with a 308", () => {
    const cases = ["/why-defenseeye/", "/privacy-policy/", "/support/", "/faq/", "/cmmclens/", "/secure-ai-adoption/"];
    for (const pathname of cases) {
      expect(resolve(pathname)).toEqual({
        kind: "redirect",
        status: 308,
        location: pathname.slice(0, -1),
      });
    }
  });

  it("normalizes /services/cmmc-scoping/ to the canonical non-trailing-slash route", () => {
    expect(resolve("/services/cmmc-scoping/")).toEqual({
      kind: "redirect",
      status: 308,
      location: "/services/cmmc-scoping",
    });
  });

  it("does not normalize, redirect, or 410 the root path", () => {
    expect(resolve("/")).toEqual({ kind: "pass" });
  });

  it("does not normalize trailing slashes on /api/*, sitemap.xml, or robots.txt", () => {
    expect(resolve("/api/contact/")).toEqual({ kind: "pass" });
    expect(resolve("/sitemap.xml")).toEqual({ kind: "pass" });
    expect(resolve("/robots.txt")).toEqual({ kind: "pass" });
  });

  it("does not treat a trailing slash on an unknown arbitrary path as a redirect target", () => {
    expect(resolve("/__defenseeye_missing_route_test__/")).toEqual({ kind: "pass" });
  });

  it("leaves an ordinary unknown path as a pass-through to normal 404 handling, not 410", () => {
    expect(resolve("/__defenseeye_missing_route_test__")).toEqual({ kind: "pass" });
    expect(isKnownRoute("/__defenseeye_missing_route_test__")).toBe(false);
  });

  it("produces no redirect chains: every redirect destination resolves immediately with no further redirect", () => {
    const allRedirectTargets = [
      ...Object.values(LEGACY_REDIRECTS),
      "/why-defenseeye",
      "/privacy-policy",
      "/support",
      "/faq",
      "/cmmclens",
      "/secure-ai-adoption",
      "/services/cmmc-scoping",
    ];
    for (const target of allRedirectTargets) {
      expect(resolve(target)).toEqual({ kind: "pass" });
    }
  });
});
