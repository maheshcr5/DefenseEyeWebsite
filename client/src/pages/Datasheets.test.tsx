import fs from "fs";
import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>DefenseEye footer</footer> }));
vi.mock("@/lib/tracking", () => ({ trackConversion: vi.fn() }));

function renderDatasheet(path: string) {
  vi.resetModules();
  vi.doMock("wouter", () => ({ useLocation: () => [path] }));
  return import("./Datasheets").then(({ default: Datasheets }) => renderToStaticMarkup(<Datasheets />));
}

const GENERAL_DISCOVERY_URL = "https://cal.com/defenseeye/discovery";
const CMMCLENS_BOOKING_URL = "https://cal.com/defenseeye/cmmclens";

describe("Datasheets multiplexed booking destinations", () => {
  it("routes the CMMCLens datasheet to the CMMCLens-specific booking URL only", async () => {
    const html = await renderDatasheet("/datasheets/cmmclens");
    expect(html).toContain(`href="${CMMCLENS_BOOKING_URL}"`);
    expect(html).not.toContain(GENERAL_DISCOVERY_URL);
    expect(html).not.toContain("calendly.com");
  });

  it("routes every non-CMMCLens datasheet to the general discovery URL, including the supplier-readiness sheet", async () => {
    for (const slug of ["secure-ai-adoption", "cmmc-compliance-automation", "microsoft-copilot-readiness", "supplier-readiness"]) {
      const html = await renderDatasheet(`/datasheets/${slug}`);
      expect(html).toContain(`href="${GENERAL_DISCOVERY_URL}"`);
      expect(html).not.toContain(CMMCLENS_BOOKING_URL);
      expect(html).not.toContain("calendly.com");
    }
  });

  it("preserves the supplier-specific CTA label on the supplier-readiness datasheet", async () => {
    const html = await renderDatasheet("/datasheets/supplier-readiness");
    expect(html).toContain("Discuss Supplier Opportunities");
  });

  it("keeps the existing cmmclens_demo_click analytics differentiation intact for the CMMCLens sheet", () => {
    // The click handler already branches on slug === "cmmclens" vs "consultation_click" —
    // this must remain true regardless of the underlying href value.
    const source = fs.readFileSync(path.resolve(__dirname, "Datasheets.tsx"), "utf-8");
    expect(source).toContain("cmmclens_demo_click");
  });
});
