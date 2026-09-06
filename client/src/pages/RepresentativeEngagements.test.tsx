import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>DefenseEye footer</footer> }));

const tracking = vi.hoisted(() => ({ trackConversion: vi.fn() }));
vi.mock("@/lib/tracking", () => tracking);

import RepresentativeEngagements from "./RepresentativeEngagements";

const OLD_CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";
const GENERAL_DISCOVERY_URL = "https://cal.com/defenseeye/discovery";
const CMMCLENS_BOOKING_URL = "https://cal.com/defenseeye/cmmclens";

describe("Representative Engagements booking CTA", () => {
  beforeEach(() => {
    tracking.trackConversion.mockClear();
  });

  const html = renderToStaticMarkup(<RepresentativeEngagements />);

  it("uses the exact new CTA label", () => {
    expect(html).toContain("Book a 30-Minute Discovery Call");
    expect(html).not.toContain("Discuss a Representative Engagement");
  });

  it("links to the general discovery booking URL, not the old Calendly URL or the CMMCLens URL", () => {
    expect(html).toContain(`href="${GENERAL_DISCOVERY_URL}"`);
    expect(html).not.toContain(OLD_CALENDLY_URL);
    expect(html).not.toContain("calendly.com");
    expect(html).not.toContain(CMMCLENS_BOOKING_URL);
  });

  it("keeps safe external-link attributes on the booking CTA", () => {
    const match = html.match(/<a[^>]*href="https:\/\/cal\.com\/defenseeye\/discovery"([^>]*)>/);
    expect(match).not.toBeNull();
    expect(match![1]).toContain('target="_blank"');
    expect(match![1]).toContain('rel="noopener noreferrer"');
  });

  it("does not fire any conversion event merely from rendering the page", () => {
    expect(tracking.trackConversion).not.toHaveBeenCalled();
  });

  it("does not add query parameters to the Cal.com URL", () => {
    expect(html).not.toMatch(/cal\.com\/defenseeye\/discovery[^"]*[?&]/);
  });
});

describe("Shared booking-URL constants", () => {
  it("has the exact verified public Cal.com discovery URL", async () => {
    const { GENERAL_DISCOVERY_BOOKING_URL } = await import("@/data/companyFacts");
    expect(GENERAL_DISCOVERY_BOOKING_URL).toBe("https://cal.com/defenseeye/discovery");
  });

  it("has the exact verified public Cal.com CMMCLens URL", async () => {
    const { CMMCLENS_BOOKING_URL } = await import("@/data/companyFacts");
    expect(CMMCLENS_BOOKING_URL).toBe("https://cal.com/defenseeye/cmmclens");
  });

  it("no longer exports the obsolete, misleading CALENDLY_URL name", async () => {
    const companyFacts = await import("@/data/companyFacts");
    expect((companyFacts as Record<string, unknown>).CALENDLY_URL).toBeUndefined();
  });
});
