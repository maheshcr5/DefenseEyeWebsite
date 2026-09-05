import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>DefenseEye footer</footer> }));

import { INDUSTRY_PAGES } from "./IndustryPage";

function renderIndustryPage(path: string) {
  vi.resetModules();
  vi.doMock("wouter", () => ({ useLocation: () => [path] }));
  return import("./IndustryPage").then(({ default: IndustryPage }) => renderToStaticMarkup(<IndustryPage />));
}

describe("DefenseEye industry pages", () => {
  it("renders the Financial Services & Credit Unions page with the required content and CTA", async () => {
    const html = await renderIndustryPage("/industries/financial-services-credit-unions");

    expect(html).toContain("<h1");
    expect(html).toContain("Secure AI for Financial Services and Credit Unions</h1>");
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("regulated financial-services teams and credit unions");
    expect(html).toContain("data-access controls");
    expect(html).toContain("traceability");
    expect(html).toContain("human oversight");
    expect(html).toContain('href="/secure-ai-adoption#secure-ai-consultation"');
    expect(html).toContain("Request a Secure AI Readiness Consultation");

    [
      "/secure-ai-adoption",
      "/solutions/ai-governance",
      "/solutions/ai-security",
      "/solutions/ai-transformation",
      "/solutions/microsoft-copilot-readiness",
      "/representative-engagements",
    ].forEach((href) => expect(html).toContain(`href="${href}"`));

    expect(html).not.toMatch(/guaranteed compliance|regulatory approval|certified financial institution|testimonial|fixed price/i);
  });

  it("renders the Defense Industrial Base page with CMMCLens context and existing contact CTA", async () => {
    const html = await renderIndustryPage("/industries/defense-industrial-base");

    expect(html).toContain("Cybersecurity and Compliance Support for the Defense Industrial Base</h1>");
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("defense contractors, subcontractors, suppliers");
    expect(html).toContain("requirements that may apply based on contract scope");
    expect(html).toContain("CMMCLens fits the evidence");
    expect(html).toContain('href="/contact?inquiry=cmmc"');
    expect(html).toContain("Discuss CMMC Readiness");

    [
      "/cmmc",
      "/cmmc-level-2-readiness",
      "/cmmc-compliance-automation",
      "/cmmclens",
      "/supplier-readiness",
      "/capability-statement",
      "/representative-engagements",
    ].forEach((href) => expect(html).toContain(`href="${href}"`));

    expect(html).not.toMatch(/guaranteed|\bcertified\b|contract award|savings|assessment status/i);
    expect(html).not.toContain("CMMC applies to every government agency");
  });

  it("keeps exact industry metadata available to the page and SEO registry", () => {
    expect(INDUSTRY_PAGES["/industries/financial-services-credit-unions"]).toMatchObject({
      h1: "Secure AI for Financial Services and Credit Unions",
      title: "Secure AI for Financial Services and Credit Unions | DefenseEye",
    });
    expect(INDUSTRY_PAGES["/industries/defense-industrial-base"]).toMatchObject({
      h1: "Cybersecurity and Compliance Support for the Defense Industrial Base",
      title: "Cybersecurity and Compliance Support for the Defense Industrial Base | DefenseEye",
    });
  });
});
