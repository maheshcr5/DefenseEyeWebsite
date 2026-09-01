import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  HASHED_ASSET_CACHE_CONTROL,
  HTML_CACHE_CONTROL,
  OPERATIONAL_STATIC_CACHE_CONTROL,
  SITEMAP_CACHE_CONTROL,
  getStaticCacheControl,
  injectRouteMetadataHtml,
  injectRouteSpecificHtml,
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
});

describe("sitemap and robots", () => {
  it("renders valid XML with unique URLs and all Tier 1 routes", () => {
    const xml = renderSitemapXml();
    const locations = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]);

    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(new Set(locations).size).toBe(locations.length);
    for (const route of TIER_1_ROUTES) {
      expect(locations).toContain(canonicalUrl(route.path));
    }
    expect(SITEMAP_ENTRIES.every((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod))).toBe(true);
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
