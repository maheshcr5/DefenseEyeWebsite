import { describe, expect, it } from "vitest";
import { canonicalUrl, getSeoRoute } from "@shared/seoRoutes";
import { ROUTE_SCHEMA_SCRIPT_ID, upsertRouteStructuredData } from "./routeStructuredData";

type FakeScript = {
  id: string;
  type: string;
  text: string;
  dataset: Record<string, string>;
  remove: () => void;
};

function createFakeDocument(initialScripts: FakeScript[] = []) {
  const scripts = [...initialScripts];
  scripts.forEach((script) => {
    script.remove = () => {
      const index = scripts.indexOf(script);
      if (index >= 0) scripts.splice(index, 1);
    };
  });
  const doc = {
    head: {
      appendChild(script: FakeScript) {
        scripts.push(script);
      },
    },
    createElement() {
      return {
        id: "",
        type: "",
        text: "",
        dataset: {},
        remove() {
          const index = scripts.indexOf(this as FakeScript);
          if (index >= 0) scripts.splice(index, 1);
        },
      } as FakeScript;
    },
    getElementById(id: string) {
      return scripts.find((script) => script.id === id) ?? null;
    },
    querySelectorAll(selector: string) {
      if (selector === 'script[type="application/ld+json"]') {
        return scripts.filter((script) => script.type === "application/ld+json");
      }
      return [];
    },
    scripts,
  };
  return doc as unknown as Document & { scripts: FakeScript[] };
}

function graphTypes(script: FakeScript) {
  const graph = JSON.parse(script.text);
  return Array.isArray(graph) ? graph.map((entry) => entry["@type"]) : [graph["@type"]];
}

const schemaRoutes = [
  "/",
  "/secure-ai-adoption",
  "/solutions/ai-governance",
  "/industries/financial-services-credit-unions",
  "/industries/defense-industrial-base",
  "/cmmc-level-2-readiness",
  "/cmmclens",
  "/attacksense",
  "/supplier-readiness",
  "/knowledge-hub",
  "/blog",
];

describe("route structured data updater", () => {
  it("keeps exactly one route-specific JSON-LD graph after hydration", () => {
    for (const routePath of schemaRoutes) {
      const route = getSeoRoute(routePath);
      expect(route).toBeTruthy();
      const serverScript = {
        id: "",
        type: "application/ld+json",
        text: JSON.stringify([{ "@type": "Organization", url: "https://defenseeye.ai/" }]),
        dataset: { serverRouteSchema: "true" },
        remove() {},
      };
      const doc = createFakeDocument([serverScript]);

      const script = upsertRouteStructuredData(routePath, doc) as unknown as FakeScript;

      expect(doc.scripts).toHaveLength(1);
      expect(script.id).toBe(ROUTE_SCHEMA_SCRIPT_ID);
      expect(script.dataset.routePath).toBe(routePath);
      expect(script.text).toContain(canonicalUrl(routePath));
      expect(script.text).toContain(route?.description);
    }
  });

  it("replaces schema on SPA navigation and back/forward route restoration", () => {
    const doc = createFakeDocument();

    const homeScript = upsertRouteStructuredData("/", doc) as unknown as FakeScript;
    expect(doc.scripts).toHaveLength(1);
    expect(homeScript.dataset.routePath).toBe("/");
    expect(graphTypes(homeScript)).toContain("ProfessionalService");

    const cmmcLensScript = upsertRouteStructuredData("/cmmclens", doc) as unknown as FakeScript;
    expect(doc.scripts).toHaveLength(1);
    expect(cmmcLensScript.dataset.routePath).toBe("/cmmclens");
    expect(graphTypes(cmmcLensScript)).toContain("SoftwareApplication");

    const attackSenseScript = upsertRouteStructuredData("/attacksense", doc) as unknown as FakeScript;
    expect(doc.scripts).toHaveLength(1);
    expect(attackSenseScript.dataset.routePath).toBe("/attacksense");
    expect(graphTypes(attackSenseScript)).toContain("Service");
    expect(graphTypes(attackSenseScript)).not.toContain("SoftwareApplication");

    const restoredScript = upsertRouteStructuredData("/cmmclens", doc) as unknown as FakeScript;
    expect(doc.scripts).toHaveLength(1);
    expect(restoredScript.dataset.routePath).toBe("/cmmclens");
    expect(graphTypes(restoredScript)).toContain("SoftwareApplication");
  });
});
