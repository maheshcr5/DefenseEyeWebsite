import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("wouter", () => ({ useLocation: () => ["/"] }));

import NavBar, { getHeaderCta, NAV_MENUS, PRIMARY_NAV_LINK } from "./NavBar";

describe("DefenseEye navigation CTA alignment", () => {
  it("uses the Secure AI consultation CTA on general customer-facing routes", () => {
    const html = renderToStaticMarkup(<NavBar pathOverride="/" />);

    expect(getHeaderCta("/")).toMatchObject({
      label: "Request a Secure AI Consultation",
      href: "/secure-ai-adoption#secure-ai-consultation",
      external: false,
    });
    expect(html).toContain('href="/secure-ai-adoption#secure-ai-consultation"');
    expect(html).toContain("Request a Secure AI Consultation");
    expect(html).toContain(`href="${PRIMARY_NAV_LINK.href}"`);
    expect(html).toContain(`>${PRIMARY_NAV_LINK.label}</a>`);
  });

  it("preserves the supplier opportunity CTA on supplier-readiness journeys", () => {
    const html = renderToStaticMarkup(<NavBar pathOverride="/supplier-readiness" />);

    expect(getHeaderCta("/supplier-readiness")).toMatchObject({
      label: "Discuss Supplier Opportunities",
      external: true,
    });
    expect(html).toContain("Discuss Supplier Opportunities");
    expect(html).toContain("https://calendly.com/maheshcoimbatore/60-minute-meeting");
    expect(html).not.toContain("Request a Secure AI Consultation");
  });

  it("exposes Secure AI in the mobile menu when opened", () => {
    const html = renderToStaticMarkup(<NavBar pathOverride="/" initialMobileOpen />);

    expect(html).toContain(`href="${PRIMARY_NAV_LINK.href}"`);
    expect(html).toContain(`>${PRIMARY_NAV_LINK.label}</a>`);
    expect(html).toContain('href="/secure-ai-adoption#secure-ai-consultation"');
    expect(html).toContain("Request a Secure AI Consultation");
  });

  it("uses the requested top-level navigation hierarchy", () => {
    const labels = NAV_MENUS.map((menu) => menu.label);
    const industries = NAV_MENUS.find((menu) => menu.key === "industries");
    const solutions = NAV_MENUS.find((menu) => menu.key === "solutions");
    const resources = NAV_MENUS.find((menu) => menu.key === "resources");

    expect(labels).toContain("Industries");
    expect(labels).toContain("Solutions");
    expect(labels).toContain("Resources");
    expect(labels).not.toContain("Portfolio");
    expect(labels).not.toContain("Portfolios");
    expect(labels).not.toContain("Datasheets");
    expect(labels).not.toContain("Products");

    expect(industries?.items.map((item) => item.href)).toEqual([
      "/industries/financial-services-credit-unions",
      "/industries/defense-industrial-base",
    ]);
    expect(solutions?.items.some((item) => item.href === "/cmmclens")).toBe(true);
    expect(resources?.items.some((item) => item.href === "/datasheets")).toBe(true);
    expect(resources?.items.some((item) => item.href === "/knowledge-hub")).toBe(true);
    expect(resources?.items.some((item) => item.href === "/blog")).toBe(true);
    expect(resources?.items.some((item) => item.href === "/datasheets/secure-ai-adoption")).toBe(true);
  });

  it("renders desktop and mobile industry navigation controls with accessible expansion state", () => {
    const desktopHtml = renderToStaticMarkup(<NavBar pathOverride="/" />);
    const mobileHtml = renderToStaticMarkup(<NavBar pathOverride="/" initialMobileOpen initialMobileExpanded="industries" />);

    expect(desktopHtml).toContain(">Industries");
    expect(desktopHtml).toContain('aria-haspopup="true"');
    expect(desktopHtml).toContain('aria-expanded="false"');
    expect(mobileHtml).toContain('aria-controls="mobile-nav-industries"');
    expect(mobileHtml).toContain('id="mobile-nav-industries"');
    expect(mobileHtml).toContain('href="/industries/financial-services-credit-unions"');
    expect(mobileHtml).toContain('href="/industries/defense-industrial-base"');
  });
});
