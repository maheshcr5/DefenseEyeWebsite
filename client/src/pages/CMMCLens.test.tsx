import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>DefenseEye footer</footer> }));
vi.mock("@/lib/tracking", () => ({ trackConversion: vi.fn() }));

import CMMCLens from "./CMMCLens";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";
const DIRECT_MARKETPLACE_URL =
  "https://marketplace.microsoft.com/en-us/product/cmmc.defenseeye-cmmc-l2-continuous-compliance?tab=Overview";
const GENERIC_SEARCH_URL = "https://marketplace.microsoft.com/en-us/search?search=CMMCLens";

describe("CMMCLens page Marketplace CTA", () => {
  const html = renderToStaticMarkup(<CMMCLens />);

  it("does not reference the generic Marketplace search URL anywhere", () => {
    expect(html).not.toContain(GENERIC_SEARCH_URL);
    expect(html).not.toContain("search=CMMCLens");
  });

  it("links to the direct Marketplace product URL", () => {
    expect(html).toContain(`href="${DIRECT_MARKETPLACE_URL}"`);
  });

  it("uses the new buyer-facing Marketplace label and drops the old generic label", () => {
    expect(html).toContain("View CMMCLens on Microsoft Marketplace");
    expect(html).not.toContain("Microsoft Marketplace Listing");
  });

  it("keeps the CMMCLens briefing CTA before the Marketplace CTA, in the same hero button group", () => {
    const briefingIndex = html.indexOf("Request CMMCLens Briefing");
    const marketplaceIndex = html.indexOf("View CMMCLens on Microsoft Marketplace");
    expect(briefingIndex).toBeGreaterThan(-1);
    expect(marketplaceIndex).toBeGreaterThan(-1);
    expect(briefingIndex).toBeLessThan(marketplaceIndex);
  });

  it("keeps the briefing CTA styled as the primary (filled accent) action and Marketplace as secondary (outline)", () => {
    const briefingAnchorMatch = html.match(
      /<a[^>]*href="[^"]*calendly[^"]*"[^>]*>\s*<button[^>]*class="([^"]*)"[^>]*>\s*Request CMMCLens Briefing/
    );
    const marketplaceAnchorMatch = html.match(
      /<a[^>]*href="[^"]*marketplace\.microsoft\.com[^"]*"[^>]*>\s*<button[^>]*class="([^"]*)"[^>]*>\s*View CMMCLens on Microsoft Marketplace/
    );
    expect(briefingAnchorMatch?.[1]).toContain("bg-accent");
    expect(marketplaceAnchorMatch?.[1]).toContain("border-primary/40");
    expect(marketplaceAnchorMatch?.[1]).not.toContain("bg-accent");
  });

  it("does not change the existing Calendly briefing destination", () => {
    expect(html).toContain(`href="${CALENDLY_URL}"`);
  });

  it("opens the Marketplace link safely in a new tab", () => {
    const marketplaceLinkMatch = html.match(
      /<a[^>]*href="(https:\/\/marketplace\.microsoft\.com[^"]*)"([^>]*)>/
    );
    expect(marketplaceLinkMatch).not.toBeNull();
    expect(marketplaceLinkMatch![1]).toBe(DIRECT_MARKETPLACE_URL);
    expect(marketplaceLinkMatch![2]).toContain('target="_blank"');
    expect(marketplaceLinkMatch![2]).toContain('rel="noopener noreferrer"');
  });

  it("does not add tracking parameters to the Marketplace URL", () => {
    expect(html).not.toMatch(/marketplace\.microsoft\.com[^"]*[?&](utm_|ref=|source=)/);
  });
});
