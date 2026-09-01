import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("wouter", () => ({ useLocation: () => ["/"] }));

import NavBar, { getHeaderCta, PRIMARY_NAV_LINK } from "./NavBar";

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
});
