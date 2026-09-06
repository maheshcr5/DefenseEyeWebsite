import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));
vi.mock("@/lib/tracking", () => ({ trackConversion: vi.fn() }));

function renderPortfolioPage(path: string) {
  vi.resetModules();
  vi.doMock("wouter", () => ({ useLocation: () => [path] }));
  return import("./PortfolioPage").then(({ default: PortfolioPage }) => renderToStaticMarkup(<PortfolioPage />));
}

const GENERAL_DISCOVERY_URL = "https://cal.com/defenseeye/discovery";

describe("PortfolioPage booking destinations", () => {
  it("routes the AI portfolio to the general discovery URL (no CMMCLens-only demo exists for this portfolio)", async () => {
    const html = await renderPortfolioPage("/secure-ai-adoption");
    expect(html).toContain(`href="${GENERAL_DISCOVERY_URL}"`);
    expect(html).not.toContain("cal.com/defenseeye/cmmclens");
    expect(html).not.toContain("calendly.com");
  });

  it("routes the CMMC compliance automation portfolio to the general discovery URL", async () => {
    // This portfolio discusses the broader CMMC compliance service (of which CMMCLens is one
    // deliverable among several), not a dedicated CMMCLens-only briefing, so the general
    // discovery call is the accurate destination rather than the CMMCLens-specific one.
    const html = await renderPortfolioPage("/cmmc-compliance-automation");
    expect(html).toContain(`href="${GENERAL_DISCOVERY_URL}"`);
    expect(html).not.toContain("cal.com/defenseeye/cmmclens");
    expect(html).not.toContain("calendly.com");
  });
});
