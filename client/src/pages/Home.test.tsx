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
    expect(html).toContain("Adopt AI securely. Govern risk confidently.</h1>");
    expect(html).toContain("DefenseEye helps regulated organizations assess AI and cybersecurity risk, implement practical governance controls, and move toward secure, accountable AI adoption.");
    expect(html).not.toContain("Operationalize Secure AI Adoption and CMMC Readiness");
    expect(html).not.toContain("Secure AI Adoption and CMMC Compliance Automation");
  });

  it("makes Secure AI the dominant CTA without a competing CMMC hero CTA", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain('href="/secure-ai-adoption#secure-ai-consultation"');
    // Hero and mid-page ("Start with the use case, data, and controls") CTAs use the same assessment label.
    expect(html.match(/Request an AI Risk &amp; Governance Assessment/g)).toHaveLength(2);
    expect(html).not.toContain("Request a Secure AI Readiness Consultation");
    expect(html).toContain("See How DefenseEye Helps");
    expect(html).toContain("The initial conversation can clarify priority use cases");
    expect(html).not.toContain("Explore CMMC Readiness");
    expect(html).not.toContain("Achieve CMMC Level 2");
  });

  it("adds representative engagements as a contextual secondary path", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain('href="/representative-engagements"');
    expect(html).toContain("View Representative Engagements");
  });

  it("adds a small contextual Why DefenseEye trust link without a new section or tracking", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain(
      "See how DefenseEye combines practitioner-led consulting, secure AI expertise, and compliance automation."
    );
    const match = html.match(/<a[^>]*href="\/why-defenseeye"([^>]*)>Why DefenseEye<\/a>/);
    expect(match).not.toBeNull();
    expect(match![1]).not.toContain("onclick");
  });

  it("removes the duplicate hero logo while keeping the Navbar and Footer logos", () => {
    const html = renderToStaticMarkup(<Home />);

    // NavBar/Footer are mocked to plain text in this test file; the real DefenseEyeLogo mock
    // renders "DefenseEye.ai" — it must not appear anywhere since Home no longer renders it.
    expect(html).not.toContain("DefenseEye.ai");
    expect(html).toContain("DefenseEye navigation");
    expect(html).toContain("DefenseEye footer");
  });

  it("keeps exactly one H1 and the hero visually unaffected by the logo removal", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html.match(/<h1[^>]*>/g)).toHaveLength(1);
    expect(html).toContain(">Adopt AI securely. Govern risk confidently.</h1>");
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
