import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));
vi.mock("@/components/DefenseEyeLogo", () => ({ default: () => <span>DefenseEye</span> }));

import TermsOfService from "./TermsOfService";

describe("Terms of Service dead-code cleanup", () => {
  it("never rendered a Calendly booking link, confirming the removed CALENDLY_URL constant was unused dead code", () => {
    const html = renderToStaticMarkup(<TermsOfService />);

    expect(html).not.toContain("calendly.com");
    expect(html).not.toContain("cal.com");
  });
});
