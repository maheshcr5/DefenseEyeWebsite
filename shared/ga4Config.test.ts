import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GA4_MEASUREMENT_ID_PATTERN, checkBuiltIndexHtml, checkGa4MeasurementId, findUnresolvedEnvPlaceholders } from "./ga4Config";

const PRODUCTION_ID = "G-H22Q6LRNWC";
const RETIRED_ID = ["G", "KTK7M073CH"].join("-");
const root = path.resolve(__dirname, "..");
const sourceHtml = readFileSync(path.join(root, "client/index.html"), "utf8");
const builtFrom = (id: string) => sourceHtml.replace("%VITE_GA4_MEASUREMENT_ID%", id).replace(/%VITE_ANALYTICS_[A-Z_]+%/g, "configured");

describe("GA4 Measurement ID validation", () => {
  it("accepts the approved production Measurement ID", () => {
    expect(checkGa4MeasurementId(PRODUCTION_ID)).toEqual({ ok: true, id: PRODUCTION_ID });
    expect(checkGa4MeasurementId(`  ${PRODUCTION_ID}\n`)).toEqual({ ok: true, id: PRODUCTION_ID });
  });

  it("rejects a missing or blank ID", () => {
    for (const value of [undefined, "", "   "]) {
      expect(checkGa4MeasurementId(value)).toMatchObject({ ok: false, reason: expect.stringContaining("is not set") });
    }
  });

  it("rejects the .env.example placeholder", () => {
    expect(checkGa4MeasurementId("G-XXXXXXXXXX")).toMatchObject({ ok: false, reason: expect.stringContaining("placeholder") });
  });

  it("rejects values that are not in GA4 format", () => {
    for (const value of ["UA-12345-1", "g-h22q6lrnwc", "G-123", "G-H22Q6LRNWC extra", "%VITE_GA4_MEASUREMENT_ID%", "AW-123456789"]) {
      expect(checkGa4MeasurementId(value)).toMatchObject({ ok: false, reason: expect.stringContaining("not a GA4 Measurement ID") });
    }
  });

  it("rejects the retired Measurement ID", () => {
    expect(checkGa4MeasurementId(RETIRED_ID)).toMatchObject({ ok: false, reason: expect.stringContaining("retired") });
  });

  it("uses the same ID pattern as the inline loader in client/index.html", () => {
    expect(sourceHtml).toContain(`!${GA4_MEASUREMENT_ID_PATTERN.toString()}.test(window.__gaId || '')`);
  });
});

describe("built index.html checks", () => {
  it("passes for a correctly built page: one assignment, one loader, configured ID", () => {
    expect(checkBuiltIndexHtml(builtFrom(PRODUCTION_ID), PRODUCTION_ID)).toEqual({ errors: [], warnings: [] });
  });

  it("fails when the GA4 placeholder was not resolved", () => {
    const { errors } = checkBuiltIndexHtml(sourceHtml, PRODUCTION_ID);
    expect(errors.join(" ")).toContain("unresolved %VITE_GA4_MEASUREMENT_ID% placeholder");
  });

  it("only warns about optional unresolved placeholders such as Umami", () => {
    const html = sourceHtml.replace("%VITE_GA4_MEASUREMENT_ID%", PRODUCTION_ID);
    const result = checkBuiltIndexHtml(html, PRODUCTION_ID);
    expect(result.errors).toEqual([]);
    expect(result.warnings.join(" ")).toContain("%VITE_ANALYTICS_ENDPOINT%");
    expect(findUnresolvedEnvPlaceholders(html)).not.toContain("%VITE_GA4_MEASUREMENT_ID%");
  });

  it("fails on a duplicate GA4 tag or a different ID", () => {
    const html = builtFrom(PRODUCTION_ID);
    const duplicated = html.replace("</head>", `<script async src="https://www.googletagmanager.com/gtag/js?id=${PRODUCTION_ID}"></script></head>`);
    expect(checkBuiltIndexHtml(duplicated, PRODUCTION_ID).errors.join(" ")).toContain("gtag.js loader exactly once");
    expect(checkBuiltIndexHtml(html.replace('window.__gaLoaded = false;', 'window.__gaId = "G-OTHER12345"; window.__gaLoaded = false;'), PRODUCTION_ID).errors.join(" ")).toContain("exactly once");
    expect(checkBuiltIndexHtml(builtFrom("G-ABCDEF1234"), PRODUCTION_ID).errors.join(" ")).toContain(`does not use the configured Measurement ID ${PRODUCTION_ID}`);
    expect(checkBuiltIndexHtml(`${builtFrom(PRODUCTION_ID)}<!-- ${RETIRED_ID} -->`, PRODUCTION_ID).errors.join(" ")).toContain("retired");
  });

  it.skipIf(!existsSync(path.join(root, "dist/public/index.html")))("the current production build uses the approved ID exactly once", () => {
    const built = readFileSync(path.join(root, "dist/public/index.html"), "utf8");
    expect(checkBuiltIndexHtml(built, PRODUCTION_ID).errors).toEqual([]);
  });
});

describe("production build guard (vite plugin)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  async function guard() {
    const { ga4ConfigGuard } = await import("../vite.config");
    return ga4ConfigGuard() as unknown as {
      configResolved: (config: { mode: string; env: Record<string, string> }) => void;
      writeBundle: (options: unknown, bundle: Record<string, { type: string; source: string }>) => void;
    };
  }

  it("fails a production build without a Measurement ID, with a clear message", async () => {
    const plugin = await guard();
    expect(() => plugin.configResolved({ mode: "production", env: {} })).toThrow(/\[ga4-config\] VITE_GA4_MEASUREMENT_ID is not set\..*\.env\.example/);
  });

  it("fails a production build with an invalid or retired ID", async () => {
    const plugin = await guard();
    expect(() => plugin.configResolved({ mode: "production", env: { VITE_GA4_MEASUREMENT_ID: "UA-1-1" } })).toThrow(/not a GA4 Measurement ID/);
    expect(() => plugin.configResolved({ mode: "production", env: { VITE_GA4_MEASUREMENT_ID: RETIRED_ID } })).toThrow(/retired/);
  });

  it("fails when the written index.html still has the placeholder, and passes for a correct build", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const plugin = await guard();
    plugin.configResolved({ mode: "production", env: { VITE_GA4_MEASUREMENT_ID: PRODUCTION_ID } });
    expect(() => plugin.writeBundle({}, { "index.html": { type: "asset", source: sourceHtml } })).toThrow(/unresolved %VITE_GA4_MEASUREMENT_ID%/);
    expect(() => plugin.writeBundle({}, { "index.html": { type: "asset", source: builtFrom(PRODUCTION_ID) } })).not.toThrow();
  });

  it("does not enforce in non-production modes, and GA4_ALLOW_MISSING downgrades errors to warnings", async () => {
    const development = await guard();
    expect(() => development.configResolved({ mode: "development", env: {} })).not.toThrow();
    vi.stubEnv("GA4_ALLOW_MISSING", "true");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const plugin = await guard();
    expect(() => plugin.configResolved({ mode: "production", env: {} })).not.toThrow();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("WARNING (GA4_ALLOW_MISSING=true)"));
  });
});
