import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));

const tracking = vi.hoisted(() => ({ trackConversion: vi.fn() }));
vi.mock("@/lib/tracking", () => tracking);

function renderLandingPage(path: string) {
  vi.resetModules();
  vi.doMock("wouter", () => ({ useLocation: () => [path] }));
  return import("./LandingPage").then(({ default: LandingPage }) => renderToStaticMarkup(<LandingPage />));
}

const GENERAL_DISCOVERY_URL = "https://cal.com/defenseeye/discovery";
const CMMCLENS_BOOKING_URL = "https://cal.com/defenseeye/cmmclens";

describe("LandingPage multiplexed booking destinations", () => {
  beforeEach(() => {
    tracking.trackConversion.mockClear();
  });

  it("routes the CMMCLens demo landing page to the CMMCLens-specific booking URL only", async () => {
    const html = await renderLandingPage("/lp/cmmclens-demo");
    expect(html).toContain(`href="${CMMCLENS_BOOKING_URL}"`);
    expect(html).not.toContain(GENERAL_DISCOVERY_URL);
    expect(html).toContain("Request CMMCLens Demo");
  });

  it("routes non-CMMCLens landing pages to the general discovery URL", async () => {
    for (const path of [
      "/lp/secure-ai-adoption",
      "/lp/ai-governance-consulting",
      "/lp/microsoft-copilot-readiness",
      "/lp/cmmc-level-2-readiness",
      "/lp/cmmc-compliance-automation",
      "/lp/cmmc-evidence-automation",
      "/lp/microsoft-supplier-ai-consulting",
      "/lp/azure-cloud-security",
      "/lp/compliance-automation",
    ]) {
      const html = await renderLandingPage(path);
      expect(html).toContain(`href="${GENERAL_DISCOVERY_URL}"`);
      expect(html).not.toContain(CMMCLENS_BOOKING_URL);
    }
  });

  it("preserves the supplier-specific label for the supplier landing page while using the general discovery URL", async () => {
    const html = await renderLandingPage("/lp/microsoft-supplier-ai-consulting");
    expect(html).toContain("Discuss Supplier Opportunities");
    expect(html).toContain(`href="${GENERAL_DISCOVERY_URL}"`);
  });

  it("does not reference the obsolete Calendly URL on any configuration", async () => {
    const html = await renderLandingPage("/lp/azure-cloud-security");
    expect(html).not.toContain("calendly.com");
  });
});
