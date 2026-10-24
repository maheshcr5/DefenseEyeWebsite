import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { LEGACY_REDIRECTS, getRouteMeta, renderSpaDocument } from "./index";
import { isNoindexRoute } from "../shared/routeMetadata";
import { SITEMAP_ENTRIES, buildRouteSchemas, getSeoRoute } from "../shared/seoRoutes";
import {
  FOOTER_NAVIGATION,
  ROUTE_NAMES,
  ROUTE_PARENTS,
  getBreadcrumbTrail,
} from "../shared/siteArchitecture";
import { RELATED_LINKS } from "../shared/relatedLinks";

const template = fs.readFileSync(path.resolve(__dirname, "../client/index.html"), "utf-8");
const pathOf = (href: string) => href.split(/[?#]/)[0];
const isLive = (href: string) => getRouteMeta(pathOf(href)) !== null && !LEGACY_REDIRECTS[pathOf(href)];

// The 41 URLs in the Ahrefs "orphan page (has no incoming internal links)" export
// of 2026-10-18. /cmmc-readiness-sprint was consolidated (301) into
// /services/cmmc-readiness-sprint; every other URL is live and indexable.
const AHREFS_ORPHANS = [
  "/knowledge-hub/sprs-score", "/knowledge-hub/certification-process", "/blog/cmmc-consultant-red-flags",
  "/blog/cmmc-poam-guide-what-assessors-want", "/cmmc-readiness-sprint-guide", "/datasheets",
  "/blog/cmmc-level-2-small-business-guide", "/blog/what-counts-as-cui-plain-english-guide", "/pricing",
  "/privacy-policy", "/blog/gcc-high-vs-m365-commercial-cmmc", "/datasheets/microsoft-copilot-readiness",
  "/delivery-model", "/insights/implement-ai-governance", "/datasheets/cmmc-compliance-automation",
  "/lp/microsoft-supplier-ai-consulting", "/lp/ai-governance-consulting", "/solutions/compliance-automation",
  "/insights/security-copilot-cybersecurity-operations", "/industries/defense-industrial-base", "/datasheets/cmmclens",
  "/lp/compliance-automation", "/solutions/cmmclens-platform", "/lp/secure-ai-adoption", "/solutions/cloud-security",
  "/industries/financial-services-credit-unions", "/lp/cmmc-evidence-automation", "/cmmc-readiness-sprint",
  "/datasheets/supplier-readiness", "/insights/ai-automated-evidence-collection", "/lp/cmmclens-demo",
  "/insights/continuous-compliance-monitoring", "/lp/cmmc-compliance-automation", "/lp/azure-cloud-security",
  "/insights/ai-audit-readiness", "/lp/microsoft-copilot-readiness", "/microsoft-ecosystem",
  "/lp/cmmc-level-2-readiness", "/datasheets/secure-ai-adoption", "/services/cmmc-scoping",
  "/insights/what-is-rmf-readiness",
];
const CONSOLIDATED = new Set(["/cmmc-readiness-sprint"]);

function rootHtml(routePath: string) {
  const { html } = renderSpaDocument(template, routePath);
  return html.slice(html.indexOf('<div id="root">'), html.indexOf("<!-- Google Analytics 4"));
}

function internalLinks(html: string) {
  return Array.from(html.matchAll(/href="([^"]+)"/g), (match) => match[1].replace("https://defenseeye.ai", "") || "/")
    .filter((href) => href.startsWith("/"));
}

describe("site architecture data", () => {
  it("names and parents only live routes, without cycles", () => {
    for (const [child, parent] of Object.entries(ROUTE_PARENTS)) {
      expect(isLive(child), child).toBe(true);
      expect(isLive(parent), `${child} parent ${parent}`).toBe(true);
      const trail = getBreadcrumbTrail(child);
      expect(trail[0].href, child).toBe("/");
      expect(trail.at(-1)!.href, child).toBe(child);
      expect(new Set(trail.map((item) => item.href)).size, child).toBe(trail.length);
    }
    for (const routePath of Object.keys(ROUTE_NAMES)) expect(isLive(routePath), routePath).toBe(true);
  });

  it("links only to live, indexable destinations", () => {
    const links = [
      ...Object.values(RELATED_LINKS).flat(),
      ...FOOTER_NAVIGATION.flatMap((group) => group.links),
    ];
    for (const link of links) {
      expect(isLive(link.href), link.href).toBe(true);
      expect(isNoindexRoute(link.href), link.href).toBe(false);
    }
  });

  it("places every sitemap route in the hierarchy", () => {
    for (const entry of SITEMAP_ENTRIES) {
      if (entry.path === "/") continue;
      expect(ROUTE_PARENTS[entry.path], entry.path).toBeTruthy();
      expect(ROUTE_NAMES[entry.path], entry.path).toBeTruthy();
    }
  });
});

describe("server-rendered fallback HTML", () => {
  it("renders route-specific content with exactly one H1 for every sitemap route", () => {
    for (const entry of SITEMAP_ENTRIES) {
      const html = rootHtml(entry.path);
      expect(html, entry.path).toContain(`data-seo-route="${entry.path}"`);
      expect(html.match(/<h1[\s>]/g)?.length, entry.path).toBe(1);
    }
  });

  it("never links to unknown or redirected internal URLs", () => {
    for (const entry of SITEMAP_ENTRIES) {
      for (const href of internalLinks(rootHtml(entry.path))) {
        if (/\.\w+$/.test(pathOf(href))) continue;
        expect(isLive(href), `${entry.path} -> ${href}`).toBe(true);
      }
    }
  });

  it("gives every live Ahrefs orphan at least two inlinks and redirects the consolidated one", () => {
    expect(AHREFS_ORPHANS).toHaveLength(41);
    const inlinks = new Map<string, Set<string>>();
    for (const entry of SITEMAP_ENTRIES) {
      for (const href of internalLinks(rootHtml(entry.path))) {
        const target = pathOf(href);
        if (target === entry.path) continue;
        if (!inlinks.has(target)) inlinks.set(target, new Set());
        inlinks.get(target)!.add(entry.path);
      }
    }
    for (const orphan of AHREFS_ORPHANS) {
      if (CONSOLIDATED.has(orphan)) {
        expect(LEGACY_REDIRECTS[orphan], orphan).toBeTruthy();
        expect(inlinks.has(orphan), `${orphan} is still linked`).toBe(false);
        continue;
      }
      expect(isNoindexRoute(orphan), orphan).toBe(false);
      expect(inlinks.get(orphan)?.size ?? 0, orphan).toBeGreaterThanOrEqual(2);
    }
  });

  it("puts no pricing in structured data, since no prices are published", () => {
    for (const entry of SITEMAP_ENTRIES) {
      const text = JSON.stringify(buildRouteSchemas(getSeoRoute(entry.path)!));
      expect(text, entry.path).not.toMatch(/"(price|priceRange|priceCurrency|offers|lowPrice|highPrice)"/);
    }
  });

  it("emits valid JSON-LD with a breadcrumb that matches the visible trail", () => {
    for (const entry of SITEMAP_ENTRIES) {
      const route = getSeoRoute(entry.path)!;
      const schemas = buildRouteSchemas(route) as Array<Record<string, unknown>>;
      expect(() => JSON.parse(JSON.stringify(schemas))).not.toThrow();
      const article = schemas.find((schema) => schema["@type"] === "Article" || schema["@type"] === "BlogPosting");
      if (article) expect(String(article.headline).length, entry.path).toBeLessThanOrEqual(110);
      if (entry.path === "/") continue;
      const breadcrumb = schemas.find((schema) => schema["@type"] === "BreadcrumbList") as
        | { itemListElement: Array<{ item: string; name: string }> }
        | undefined;
      expect(breadcrumb?.itemListElement.map((item) => item.name), entry.path).toEqual(getBreadcrumbTrail(entry.path).map((item) => item.label));
      expect(breadcrumb?.itemListElement.map((item) => item.item), entry.path).toEqual(
        getBreadcrumbTrail(entry.path).map((item) => `https://defenseeye.ai${item.href === "/" ? "/" : item.href}`)
      );
    }
  });
});

describe("llms.txt", () => {
  it("lists only live, indexable DefenseEye pages", () => {
    const llms = fs.readFileSync(path.resolve(__dirname, "../client/public/llms.txt"), "utf-8");
    const urls = Array.from(llms.matchAll(/https:\/\/defenseeye\.ai(\/[^\s)]*[^\s).,])?/g), (match) => match[1] ?? "/");
    expect(urls.length).toBeGreaterThan(20);
    for (const url of urls) {
      if (/\.(pdf|xml|txt)$/.test(url)) {
        if (url.endsWith(".pdf")) expect(fs.existsSync(path.resolve(__dirname, "../client/public", url.slice(1))), url).toBe(true);
        continue;
      }
      expect(isLive(url), url).toBe(true);
      expect(isNoindexRoute(url), url).toBe(false);
    }
  });
});

describe("social sharing metadata", () => {
  it("uses a self-hosted 1200x630 share image", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "../client/index.html"), "utf-8");
    for (const tag of ['property="og:image"', 'name="twitter:image"']) {
      const url = html.match(new RegExp(`<meta ${tag} content="([^"]+)"`))?.[1];
      expect(url, tag).toBe("https://defenseeye.ai/og-default.png");
    }
    const png = fs.readFileSync(path.resolve(__dirname, "../client/public/og-default.png"));
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  });
});

describe("article dates", () => {
  it("only states dates that the page itself shows", async () => {
    const { blogPosts } = await import("../client/src/data/blogPosts");
    const { monthYearToIsoMonth } = await import("../shared/seoRoutes");
    const contents = await Promise.all([
      import("../shared/whatIsCmmcContent").then((m) => ["/knowledge-hub/what-is-cmmc", m.WHAT_IS_CMMC_CONTENT.lastUpdated]),
      import("../shared/cmmcLevelsContent").then((m) => ["/knowledge-hub/cmmc-levels", m.CMMC_LEVELS_CONTENT.lastUpdated]),
      import("../shared/evidenceMappingContent").then((m) => ["/knowledge-hub/evidence-mapping", m.EVIDENCE_MAPPING_CONTENT.lastUpdated]),
      import("../shared/sprsScoreContent").then((m) => ["/knowledge-hub/sprs-score", m.SPRS_SCORE_CONTENT.lastUpdated]),
      import("../shared/certificationProcessContent").then((m) => ["/knowledge-hub/certification-process", m.CERTIFICATION_PROCESS_CONTENT.lastUpdated]),
    ]);
    const article = (routePath: string) =>
      (buildRouteSchemas(getSeoRoute(routePath)!) as Array<Record<string, string>>).find((n) => /Article|BlogPosting/.test(n["@type"]))!;

    for (const [routePath, visible] of contents) {
      expect(article(routePath).dateModified, routePath).toBe(monthYearToIsoMonth(visible));
      expect(article(routePath).datePublished, routePath).toBeUndefined();
      expect(getSeoRoute(routePath)!.h1, routePath).not.toMatch(/\(20\d\d/);
    }
    for (const post of blogPosts) {
      const node = article(`/blog/${post.slug}`);
      expect(node.datePublished).toBe(post.publishedAt);
      expect(node.dateModified).toBe(post.updatedAt);
    }
    for (const entry of SITEMAP_ENTRIES.filter((e) => e.path.startsWith("/insights/"))) {
      expect(article(entry.path).dateModified, entry.path).toBeUndefined();
      expect(article(entry.path).datePublished, entry.path).toBeUndefined();
    }
  });
});
