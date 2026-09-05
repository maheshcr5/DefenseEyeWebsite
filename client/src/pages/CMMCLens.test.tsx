import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>DefenseEye footer</footer> }));
vi.mock("@/lib/tracking", () => ({ trackConversion: vi.fn() }));

import CMMCLens from "./CMMCLens";

const OLD_CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";
const BOOKING_URL = "https://cal.com/defenseeye/cmmclens";
const DIRECT_MARKETPLACE_URL =
  "https://marketplace.microsoft.com/en-us/product/cmmc.defenseeye-cmmc-l2-continuous-compliance?tab=Overview";
const GENERIC_SEARCH_URL = "https://marketplace.microsoft.com/en-us/search?search=CMMCLens";
const PRIMARY_CTA_LABEL = "Book a 30-Minute CMMCLens Briefing";
const SECONDARY_CTA_LABEL = "View CMMCLens on Microsoft Marketplace";

describe("CMMCLens page booking and Marketplace CTAs", () => {
  const html = renderToStaticMarkup(<CMMCLens />);

  it("does not reference the outdated Calendly booking URL anywhere on the page", () => {
    expect(html).not.toContain(OLD_CALENDLY_URL);
    expect(html).not.toContain("calendly.com");
  });

  it("links the hero booking CTA to the new Cal.com CMMCLens URL", () => {
    expect(html).toContain(`href="${BOOKING_URL}"`);
  });

  it("uses the exact required primary CTA label", () => {
    expect(html).toContain(PRIMARY_CTA_LABEL);
    expect(html).not.toContain("Request CMMCLens Briefing");
  });

  it("does not reference the generic Marketplace search URL anywhere", () => {
    expect(html).not.toContain(GENERIC_SEARCH_URL);
    expect(html).not.toContain("search=CMMCLens");
  });

  it("keeps the direct Marketplace product URL and label unchanged", () => {
    expect(html).toContain(`href="${DIRECT_MARKETPLACE_URL}"`);
    expect(html).toContain(SECONDARY_CTA_LABEL);
    expect(html).not.toContain("Microsoft Marketplace Listing");
  });

  it("keeps the booking CTA before the Marketplace CTA, in the same hero button group", () => {
    const briefingIndex = html.indexOf(PRIMARY_CTA_LABEL);
    const marketplaceIndex = html.indexOf(SECONDARY_CTA_LABEL);
    expect(briefingIndex).toBeGreaterThan(-1);
    expect(marketplaceIndex).toBeGreaterThan(-1);
    expect(briefingIndex).toBeLessThan(marketplaceIndex);
  });

  it("keeps the booking CTA styled as the primary (filled accent) action and Marketplace as secondary (outline)", () => {
    const briefingAnchorMatch = html.match(
      /<a[^>]*href="[^"]*cal\.com[^"]*"[^>]*>\s*<button[^>]*class="([^"]*)"[^>]*>\s*Book a 30-Minute CMMCLens Briefing/
    );
    const marketplaceAnchorMatch = html.match(
      /<a[^>]*href="[^"]*marketplace\.microsoft\.com[^"]*"[^>]*>\s*<button[^>]*class="([^"]*)"[^>]*>\s*View CMMCLens on Microsoft Marketplace/
    );
    expect(briefingAnchorMatch?.[1]).toContain("bg-accent");
    expect(marketplaceAnchorMatch?.[1]).toContain("border-primary/40");
    expect(marketplaceAnchorMatch?.[1]).not.toContain("bg-accent");
  });

  it("opens the booking link safely in a new tab", () => {
    const bookingLinkMatch = html.match(/<a[^>]*href="(https:\/\/cal\.com[^"]*)"([^>]*)>/);
    expect(bookingLinkMatch).not.toBeNull();
    expect(bookingLinkMatch![1]).toBe(BOOKING_URL);
    expect(bookingLinkMatch![2]).toContain('target="_blank"');
    expect(bookingLinkMatch![2]).toContain('rel="noopener noreferrer"');
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

  it("does not add tracking parameters or customer info to the Cal.com URL", () => {
    expect(html).not.toMatch(/cal\.com\/defenseeye\/cmmclens[^"]*[?&]/);
  });

  it("does not add tracking parameters to the Marketplace URL", () => {
    expect(html).not.toMatch(/marketplace\.microsoft\.com[^"]*[?&](utm_|ref=|source=)/);
  });

  it("uses the new booking URL for every CMMCLens-page booking CTA, including the final section", () => {
    const bookingLinkCount = html.match(/href="https:\/\/cal\.com\/defenseeye\/cmmclens"/g)?.length ?? 0;
    expect(bookingLinkCount).toBe(2);
  });
});

describe("Unrelated Calendly links are untouched", () => {
  it("leaves the general company Calendly booking link intact in shared company data", async () => {
    const { CALENDLY_URL } = await import("@/data/companyFacts");
    expect(CALENDLY_URL).toBe(OLD_CALENDLY_URL);
  });
});
