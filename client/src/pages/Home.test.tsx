import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/lib/tracking", () => ({ trackConversion: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>DefenseEye footer</footer> }));
vi.mock("@/components/DefenseEyeLogo", () => ({ default: () => <div>DefenseEye.ai</div> }));

import Home from "./Home";

describe("DefenseEye homepage positioning", () => {
  it("leads with Secure Agentic AI implementation for regulated organizations", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("SECURE AGENTIC AI FOR REGULATED ORGANIZATIONS");
    expect(html).toContain("Implement Agentic AI Securely</h1>");
    expect(html).toContain("DefenseEye helps FinTechs, credit unions, and other regulated organizations implement AI agents");
    expect(html).not.toContain("Operationalize Secure AI Adoption and CMMC Readiness");
    expect(html).not.toContain("Secure AI Adoption and CMMC Compliance Automation");
  });

  it("makes Secure AI the dominant CTA without a competing CMMC hero CTA", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain('href="/secure-ai-adoption#secure-ai-consultation"');
    expect(html).toContain("Request a Secure AI Readiness Consultation");
    expect(html).toContain("Explore Secure AI Services");
    expect(html).toContain("The initial conversation can clarify priority use cases");
    expect(html).not.toContain("Explore CMMC Readiness");
    expect(html).not.toContain("Achieve CMMC Level 2");
  });

  it("adds representative engagements as a contextual secondary path", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain('href="/representative-engagements"');
    expect(html).toContain("View Representative Engagements");
  });

  it("keeps CMMC, CMMCLens, AttackSense, and supplier readiness as secondary portfolio paths", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("Additional DefenseEye Capabilities");
    expect(html).toContain("CMMC and NIST SP 800-171 readiness");
    expect(html).toContain('href="/cmmc-compliance-automation"');
    expect(html).toContain("CMMCLens compliance evidence automation");
    expect(html).toContain('href="/cmmclens"');
    expect(html).toContain("AttackSense cybersecurity visibility");
    expect(html).toContain('href="/attacksense"');
    expect(html).toContain("Supplier and subcontracting support");
    expect(html).toContain('href="/supplier-readiness"');
  });
});
