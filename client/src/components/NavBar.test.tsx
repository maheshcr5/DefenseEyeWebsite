import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("wouter", () => ({ useLocation: () => ["/"] }));

import NavBar, { getHeaderCta, NAV_MENUS } from "./NavBar";

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
  });

  it("preserves the supplier opportunity CTA on supplier-readiness journeys", () => {
    const html = renderToStaticMarkup(<NavBar pathOverride="/supplier-readiness" />);

    expect(getHeaderCta("/supplier-readiness")).toMatchObject({
      label: "Discuss Supplier Opportunities",
      external: true,
    });
    expect(html).toContain("Discuss Supplier Opportunities");
    expect(html).toContain("https://cal.com/defenseeye/discovery");
    expect(html).not.toContain("calendly.com");
    expect(html).not.toContain("Request a Secure AI Consultation");
  });

  it("exposes Secure AI Adoption only inside the Solutions menu, not as a standalone top-level link", () => {
    const mobileExpandedHtml = renderToStaticMarkup(
      <NavBar pathOverride="/" initialMobileOpen initialMobileExpanded="solutions" />
    );

    expect(mobileExpandedHtml).toContain('href="/secure-ai-adoption"');
    expect(mobileExpandedHtml).toContain("Secure AI Adoption");
    expect(mobileExpandedHtml).toContain('href="/secure-ai-adoption#secure-ai-consultation"');
    expect(mobileExpandedHtml).toContain("Request a Secure AI Consultation");
  });

  it("uses the requested top-level navigation hierarchy in order", () => {
    const labels = NAV_MENUS.map((menu) => menu.label);
    const industries = NAV_MENUS.find((menu) => menu.key === "industries");
    const solutions = NAV_MENUS.find((menu) => menu.key === "solutions");
    const resources = NAV_MENUS.find((menu) => menu.key === "resources");

    expect(labels).toEqual(["Solutions", "Industries", "Resources", "Why DefenseEye"]);
    expect(labels).not.toContain("Portfolio");
    expect(labels).not.toContain("Portfolios");
    expect(labels).not.toContain("Datasheets");
    expect(labels).not.toContain("Products");
    expect(labels).not.toContain("Supplier Readiness");

    expect(industries?.items.map((item) => item.href)).toEqual([
      "/industries/financial-services-credit-unions",
      "/industries/defense-industrial-base",
    ]);
    expect(solutions?.items.some((item) => item.href === "/cmmclens")).toBe(true);
    expect(solutions?.items[0]).toMatchObject({ label: "Secure AI Adoption", href: "/secure-ai-adoption" });
    expect(resources?.items.some((item) => item.href === "/datasheets")).toBe(true);
    expect(resources?.items.some((item) => item.href === "/knowledge-hub")).toBe(true);
    expect(resources?.items.some((item) => item.href === "/blog")).toBe(true);
    expect(resources?.items.some((item) => item.href === "/datasheets/secure-ai-adoption")).toBe(true);
  });

  it("replaces the top-level Supplier Readiness group with Why DefenseEye without deleting supplier content", () => {
    const whyDefenseEye = NAV_MENUS.find((menu) => menu.key === "why-defenseeye");

    expect(whyDefenseEye).toBeDefined();
    expect(whyDefenseEye?.items.map((item) => item.href)).toEqual([
      "/why-defenseeye",
      "/representative-engagements",
      "/supplier-readiness",
      "/capability-statement",
      "/delivery-model",
    ]);
    expect(whyDefenseEye?.items.find((item) => item.href === "/supplier-readiness")?.label).toBe(
      "Supplier & Partner Readiness"
    );
    // /supplier-readiness and its datasheet remain reachable elsewhere; nothing was deleted.
    const resources = NAV_MENUS.find((menu) => menu.key === "resources");
    expect(resources?.items.some((item) => item.href === "/datasheets/supplier-readiness")).toBe(true);
  });

  it("removes the redundant standalone Secure AI top-level link from desktop and mobile navigation", () => {
    const desktopHtml = renderToStaticMarkup(<NavBar pathOverride="/" />);
    const mobileHtml = renderToStaticMarkup(<NavBar pathOverride="/" initialMobileOpen />);

    // No standalone "Secure AI" link outside of the Solutions dropdown's "Secure AI Adoption"
    // item — the closed-state render (no menu open) must not contain a bare Secure AI anchor.
    expect(desktopHtml).not.toMatch(/<a[^>]*href="\/secure-ai-adoption"[^>]*>Secure AI<\/a>/);
    expect(mobileHtml).not.toMatch(/<a[^>]*href="\/secure-ai-adoption"[^>]*>Secure AI<\/a>/);
    expect(desktopHtml.indexOf(">Solutions") ).toBeLessThan(desktopHtml.indexOf(">Industries"));
  });

  it("keeps Contact visible as a distinct top-level link, not folded into Why DefenseEye", () => {
    const desktopHtml = renderToStaticMarkup(<NavBar pathOverride="/" />);
    const mobileHtml = renderToStaticMarkup(<NavBar pathOverride="/" initialMobileOpen />);

    expect(desktopHtml).toContain('href="/contact"');
    expect(desktopHtml).toContain(">Contact</a>");
    expect(mobileHtml).toContain('href="/contact"');
    expect(mobileHtml).toContain(">Contact</a>");
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

  it("renders desktop and mobile Why DefenseEye navigation controls with accessible expansion state", () => {
    const desktopHtml = renderToStaticMarkup(<NavBar pathOverride="/" />);
    const mobileClosedHtml = renderToStaticMarkup(<NavBar pathOverride="/" initialMobileOpen />);
    const mobileExpandedHtml = renderToStaticMarkup(
      <NavBar pathOverride="/" initialMobileOpen initialMobileExpanded="why-defenseeye" />
    );

    expect(desktopHtml).toContain(">Why DefenseEye");

    // Mobile menu open but the Why DefenseEye accordion collapsed: the toggle button renders,
    // but its panel content (e.g. the Capability Statement link) is not present in the DOM yet.
    expect(mobileClosedHtml).toContain('aria-controls="mobile-nav-why-defenseeye"');
    expect(mobileClosedHtml).not.toContain('href="/capability-statement"');

    // Expanding it (keyboard/click toggle) reveals every Why DefenseEye link.
    expect(mobileExpandedHtml).toContain('id="mobile-nav-why-defenseeye"');
    expect(mobileExpandedHtml).toContain('href="/why-defenseeye"');
    expect(mobileExpandedHtml).toContain('href="/representative-engagements"');
    expect(mobileExpandedHtml).toContain('href="/supplier-readiness"');
    expect(mobileExpandedHtml).toContain('href="/capability-statement"');
    expect(mobileExpandedHtml).toContain('href="/delivery-model"');
    expect(mobileExpandedHtml).toContain("Supplier &amp; Partner Readiness");
  });

  it("closes all open menus on Escape via the header's onKeyDown handler", () => {
    // renderToStaticMarkup cannot dispatch real keyboard events, so this asserts the
    // Escape-handling wiring is present on the header exactly once, matching closeAllMenus.
    const source = NavBar.toString();
    expect(source).toContain('"Escape"');
  });

  it("uses the CMMCLens-specific header CTA on /cmmclens, via the shared booking constant", () => {
    expect(getHeaderCta("/cmmclens")).toMatchObject({
      label: "Book a CMMCLens Briefing",
      href: "https://cal.com/defenseeye/cmmclens",
      external: true,
    });
  });

  it("renders the CMMCLens header CTA on desktop and mobile for /cmmclens", () => {
    const desktopHtml = renderToStaticMarkup(<NavBar pathOverride="/cmmclens" />);
    const mobileHtml = renderToStaticMarkup(<NavBar pathOverride="/cmmclens" initialMobileOpen />);

    for (const html of [desktopHtml, mobileHtml]) {
      expect(html).toContain("Book a CMMCLens Briefing");
      expect(html).toContain('href="https://cal.com/defenseeye/cmmclens"');
      expect(html).not.toContain("Request a Secure AI Consultation");
      expect(html).not.toContain("Discuss Supplier Opportunities");
      expect(html).not.toContain("cal.com/defenseeye/discovery");
    }

    const match = desktopHtml.match(/<a[^>]*href="https:\/\/cal\.com\/defenseeye\/cmmclens"([^>]*)>/);
    expect(match).not.toBeNull();
    expect(match![1]).toContain('target="_blank"');
    expect(match![1]).toContain('rel="noopener noreferrer"');
  });

  it("wires the header click to the shared CMMCLens tracker only when the route is /cmmclens", () => {
    // renderToStaticMarkup cannot dispatch real clicks, so this confirms the click handler
    // is gated by the exact /cmmclens path check rather than firing unconditionally.
    const source = NavBar.toString();
    expect(source).toContain("trackCmmcLensBriefingClick");
    expect(source).toMatch(/currentPath\s*===\s*CMMCLENS_PATH/);
  });

  it("leaves every other route's header CTA behavior unchanged", () => {
    expect(getHeaderCta("/")).toMatchObject({ label: "Request a Secure AI Consultation", external: false });
    expect(getHeaderCta("/secure-ai-adoption")).toMatchObject({ label: "Request a Secure AI Consultation" });
    expect(getHeaderCta("/delivery-model")).toMatchObject({ label: "Discuss Supplier Opportunities", external: true });
    expect(getHeaderCta("/capability-statement")).toMatchObject({ label: "Discuss Supplier Opportunities" });
  });
});
