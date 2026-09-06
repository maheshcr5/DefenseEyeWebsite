import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));

const tracking = vi.hoisted(() => ({ trackConversion: vi.fn() }));
vi.mock("@/lib/tracking", () => tracking);

import DeliveryModel from "./DeliveryModel";

const OLD_CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";
const GENERAL_DISCOVERY_URL = "https://cal.com/defenseeye/discovery";
const CMMCLENS_BOOKING_URL = "https://cal.com/defenseeye/cmmclens";

describe("Delivery Model booking CTA", () => {
  beforeEach(() => {
    tracking.trackConversion.mockClear();
  });

  const html = renderToStaticMarkup(<DeliveryModel />);

  it("uses the general discovery booking URL for its genuinely general engagement-model CTA", () => {
    // "Discuss an Engagement Model" is a general, product-agnostic discussion about how
    // DefenseEye structures work — not tied to CMMCLens or any specific product — so it is
    // an accurate match for the general discovery call.
    expect(html).toContain(`href="${GENERAL_DISCOVERY_URL}"`);
    expect(html).toContain("Discuss an Engagement Model");
  });

  it("no longer references the old Calendly URL or the CMMCLens-specific booking URL", () => {
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

  it("does not change unrelated page copy", () => {
    expect(html).toContain("DefenseEye Delivery Model");
    expect(html).toContain("Engagement Formats");
  });
});
