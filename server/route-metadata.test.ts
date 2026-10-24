import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { LEGACY_REDIRECTS, getRouteMeta, renderSpaDocument, resolveUrlDisposition } from "./index";
import { ROUTE_METADATA, isNoindexRoute } from "../shared/routeMetadata";
import { SITEMAP_ENTRIES, getSeoRoute } from "../shared/seoRoutes";

const template = fs.readFileSync(path.resolve(__dirname, "../client/index.html"), "utf-8");
const appSource = fs.readFileSync(path.resolve(__dirname, "../client/src/App.tsx"), "utf-8");
const clientRoutes = Array.from(appSource.matchAll(/<Route path="([^"]+)"/g), (match) => match[1]);
const isKnownRoute = (candidate: string) => getRouteMeta(candidate) !== null;

describe("shared route metadata registry", () => {
  const entries = Object.entries(ROUTE_METADATA);

  it("gives every route a unique title and description", () => {
    const titles = entries.map(([, meta]) => meta.title);
    const descriptions = entries.map(([, meta]) => meta.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("keeps titles and descriptions within search-display budgets", () => {
    for (const [routePath, meta] of entries) {
      expect(meta.title.length, `${routePath} title`).toBeLessThanOrEqual(66);
      expect(meta.description.length, `${routePath} description`).toBeGreaterThanOrEqual(90);
      expect(meta.description.length, `${routePath} description`).toBeLessThanOrEqual(165);
    }
  });

  it("is what the SEO route registry uses for title and description", () => {
    for (const [routePath, meta] of entries) {
      const route = getSeoRoute(routePath);
      if (!route) continue;
      expect(route.title).toBe(meta.title);
      expect(route.description).toBe(meta.description);
    }
  });
});

describe("sitemap and indexability", () => {
  it("lists only routes that have metadata and are indexable", () => {
    for (const entry of SITEMAP_ENTRIES) {
      expect(getRouteMeta(entry.path), entry.path).not.toBeNull();
      expect(isNoindexRoute(entry.path), entry.path).toBe(false);
    }
  });

  it("includes every indexable registered route", () => {
    const sitemapPaths = new Set(SITEMAP_ENTRIES.map((entry) => entry.path));
    for (const [routePath, meta] of Object.entries(ROUTE_METADATA)) {
      if (meta.robots) continue;
      expect(sitemapPaths.has(routePath), routePath).toBe(true);
    }
  });

  it("serves noindex, follow for campaign landing pages and keeps other routes indexable", () => {
    const landing = renderSpaDocument(template, "/lp/cmmclens-demo");
    expect(landing.status).toBe(200);
    expect(landing.html).toContain('<meta name="robots" content="noindex, follow"');

    for (const entry of SITEMAP_ENTRIES) {
      const page = renderSpaDocument(template, entry.path);
      expect(page.status, entry.path).toBe(200);
      expect(page.html, entry.path).toContain('<meta name="robots" content="index, follow"');
      expect(page.html, entry.path).toContain(`<title>${getRouteMeta(entry.path)!.title}</title>`);
    }
  });

  it("returns 404 with noindex for unknown routes", () => {
    const page = renderSpaDocument(template, "/__not_a_real_page__");
    expect(page.status).toBe(404);
    expect(page.html).toContain('<meta name="robots" content="noindex, follow"');
  });
});

describe("client routes and redirects", () => {
  it("covers every concrete client route with metadata or a permanent redirect", () => {
    const concrete = clientRoutes.filter((route) => !route.includes(":") && route !== "/404");
    for (const route of concrete) {
      const redirected = LEGACY_REDIRECTS[route] !== undefined;
      expect(redirected || isKnownRoute(route), route).toBe(true);
    }
  });

  it("redirects consolidated duplicates in a single hop to a live route", () => {
    for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
      const disposition = resolveUrlDisposition(from, isKnownRoute);
      expect(disposition).toEqual({ kind: "redirect", status: 301, location: to });
      expect(LEGACY_REDIRECTS[to], `${from} -> ${to} chains`).toBeUndefined();
      expect(isKnownRoute(to), `${from} -> ${to} target`).toBe(true);
    }
    expect(LEGACY_REDIRECTS["/services"]).toBe("/services/cmmc-readiness-sprint");
    expect(LEGACY_REDIRECTS["/solutions/microsoft-copilot-enablement"]).toBe("/solutions/microsoft-copilot-readiness");
  });
});
