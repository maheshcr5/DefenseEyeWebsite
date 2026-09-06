import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));
vi.mock("@/components/DefenseEyeLogo", () => ({ default: () => <span>DefenseEye</span> }));

import Support from "./Support";

describe("Support page destinations", () => {
  const html = renderToStaticMarkup(<Support />);

  it("does not reference the obsolete Calendly URL", () => {
    expect(html).not.toContain("calendly.com");
    expect(html).not.toContain("cal.com");
  });

  it("routes the urgent-issues CTA to the established support email channel", () => {
    expect(html).toContain('href="mailto:support@defenseeye.ai?subject=Urgent Support Request"');
    expect(html).toContain("Email Urgent Support");
    expect(html).not.toContain("Schedule Support Discussion");
  });

  it("does not use target=_blank on the mailto CTA", () => {
    const match = html.match(/<a[^>]*href="mailto:support@defenseeye\.ai\?subject=Urgent Support Request"([^>]*)>/);
    expect(match).not.toBeNull();
    expect(match![1]).not.toContain("target=");
  });

  it("keeps the existing general support email CTA unchanged", () => {
    expect(html).toContain('href="mailto:support@defenseeye.ai"');
  });
});
