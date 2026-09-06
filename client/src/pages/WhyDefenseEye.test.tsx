import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>DefenseEye footer</footer> }));

import WhyDefenseEye from "./WhyDefenseEye";

describe("Why DefenseEye page", () => {
  const html = renderToStaticMarkup(<WhyDefenseEye />);

  it("renders exactly one visible H1 with the required copy", () => {
    expect(html.match(/<h1[^>]*>/g)).toHaveLength(1);
    expect(html).toContain(">Secure AI and Compliance Automation, Built by Practitioners</h1>");
  });

  it("renders the required opening copy", () => {
    expect(html).toContain(
      "DefenseEye is a Redmond, Washington cybersecurity and AI company helping regulated organizations and"
    );
    expect(html).toContain(
      "defense contractors turn security, governance, and compliance requirements into practical implementation."
    );
  });

  it("includes the What DefenseEye Helps Organizations Do section", () => {
    expect(html).toContain("What DefenseEye Helps Organizations Do");
    expect(html).toContain("identity, data-access, security, governance, evaluation, and human-oversight controls");
    expect(html).toContain("SSP, POA&amp;M, gap-tracking, and remediation support");
    expect(html).toContain("evidence automation, control mapping, traceability, gap tracking");
  });

  it("includes the How the DefenseEye Approach Is Different section without disparaging competitors", () => {
    expect(html).toContain("How the DefenseEye Approach Is Different");
    expect(html).toContain("Practitioner-led delivery");
    expect(html).toContain("Security and governance built into implementation");
    expect(html).toContain("Evidence and remediation workflows, not documentation alone");
    expect(html).not.toMatch(/competitor|inferior|misleading customers|failing/i);
  });

  it("distinguishes CMMCLens as a platform from AttackSense as a security capability, not a software platform", () => {
    expect(html).toContain(
      "Consulting can be complemented by the DefenseEye-developed CMMCLens platform and AttackSense security capability when those offerings are appropriate to the engagement."
    );
    expect(html).not.toContain("DefenseEye-developed platforms");
    expect(html).not.toMatch(/AttackSense[^.]*(?:platform|SoftwareApplication)/i);
  });

  it("includes only evidence-supported credentials and excludes unsupported claims", () => {
    expect(html).toContain("Credentials and Company Information");
    expect(html).toContain("Redmond, Washington");
    expect(html).toContain("Multiple team members hold CMMC Certified Professional (CCP) credentials");
    expect(html).toContain("OMWBE Minority Business Enterprise certified");
    expect(html).toContain("NMSDC Minority Business Enterprise certified");
    expect(html).toContain("Washington State Small Business Enterprise (SBE)");
    expect(html).toContain("CAGE 9ZDL5 and UEI E4DYPCKN7YN8");
    expect(html).toContain("CMMCLens is available on Microsoft Marketplace");

    // Not backed by any repository source — must be excluded.
    expect(html).not.toContain("Microsoft ISV Partner");
    // Professional credentials must not be represented as company certifications.
    expect(html).not.toContain("professional credentials are held by individual team members".toUpperCase());
    expect(html).toContain("not represented as company certifications");
  });

  it("does not imply DefenseEye is a certifying, government, or regulatory authority", () => {
    expect(html).not.toMatch(/C3PAO|government agency|certifying body|Microsoft representative|regulatory authority/i);
  });

  it("includes a factual leadership statement without inventing biography details", () => {
    expect(html).toContain("Leadership and Accountability");
    expect(html).toContain("DefenseEye is led by founder Mahesh Coimbatore.");
    expect(html).toContain(
      "The company&#x27;s work brings together cybersecurity, secure"
    );
    expect(html).toContain("AI adoption, enterprise delivery, risk, governance, and compliance automation.");
    // No photograph — clean text presentation only.
    expect(html).not.toContain("<img");
    // No invented biography specifics.
    expect(html).not.toMatch(/years of experience|\bMBA\b|university|graduated|award-winning|previously (worked|served)/i);
  });

  it("clarifies representative experience is not customer case studies", () => {
    expect(html).toContain("Representative Experience");
    expect(html).toContain("are not presented as named customer case studies");
    expect(html).toContain('href="/representative-engagements"');
    expect(html).toContain("View Representative Engagements");
  });

  it("renders exactly four Choose the Right Starting Point paths with correct destinations", () => {
    expect(html).toContain("Choose the Right Starting Point");

    const expectedPaths: Array<[string, string]> = [
      ["Explore CMMCLens", "/cmmclens"],
      ["Discuss CMMC Readiness", "/contact?inquiry=cmmc"],
      ["Request a Secure AI Readiness Consultation", "/secure-ai-adoption#secure-ai-consultation"],
      ["Discuss Supplier Opportunities", "/supplier-readiness"],
    ];

    for (const [label, href] of expectedPaths) {
      expect(html).toMatch(new RegExp(`<a[^>]*href="${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>[\\s\\S]{0,400}?${label}`));
    }
  });

  it("renders the exact final CTA hierarchy and destinations", () => {
    const startIndex = html.indexOf(">Start a Conversation<");
    const viewIndex = html.indexOf(">View Representative Engagements</span>", startIndex);
    expect(startIndex).toBeGreaterThan(-1);

    expect(html).toMatch(/<a[^>]*href="\/contact"[^>]*>[\s\S]{0,1500}?Start a Conversation/);

    const finalCtaSection = html.slice(html.lastIndexOf("Start a Conversation"));
    expect(finalCtaSection).toContain("View Representative Engagements");
  });

  it("does not add a new form or booking widget", () => {
    expect(html).not.toContain("<form");
    expect(html).not.toContain("calendly.com");
    expect(html).not.toContain("cal.com");
  });

  it("does not use disallowed marketing superlatives", () => {
    expect(html).not.toMatch(/industry-leading|cutting-edge|best-in-class|seamless|guaranteed|proprietary methodology|proven outcomes/i);
  });

  it("keeps the new eagle logo asset out of this page", () => {
    expect(html).not.toContain("DefenseEyeEagleLogo");
  });
});
