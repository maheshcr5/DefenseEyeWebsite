import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/NavBar", () => ({ default: () => <nav>DefenseEye navigation</nav> }));
vi.mock("@/lib/tracking", () => ({ trackConversion: vi.fn(), getStoredAttribution: vi.fn(() => ({})) }));
vi.mock("@/lib/openaiAds", () => ({ reportOpenAiAdsLeadCreated: vi.fn() }));

import ContactUs, { validateContactForm, type ContactFormValues } from "./ContactUs";

const complete: ContactFormValues = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  company: "Example Co",
  title: "CISO",
  inquiryType: "CMMC readiness",
  timeline: "Immediate",
  message: "We need help preparing for assessment.",
  phone: "",
};

describe("contact form validation", () => {
  it("accepts a complete form and treats phone as optional", () => {
    expect(validateContactForm(complete)).toEqual({});
  });

  it("returns a specific, plain-language message for every missing required field", () => {
    const errors = validateContactForm({ ...complete, firstName: "", email: " ", inquiryType: "", message: "" });
    expect(errors).toEqual({
      firstName: "Enter your first name.",
      email: "Enter your work email address.",
      inquiryType: "Choose an inquiry type.",
      message: "Tell us briefly what you need.",
    });
  });

  it("explains the expected format for a malformed email", () => {
    expect(validateContactForm({ ...complete, email: "ada@example" }).email).toBe(
      "Enter an email address in the format name@company.com."
    );
  });
});

describe("contact form markup", () => {
  const html = renderToStaticMarkup(<ContactUs />);
  const form = html.slice(html.indexOf("<form"), html.indexOf("</form>"));

  it("associates every visible label with a control that has the same id", () => {
    const controls = Array.from(form.matchAll(/<(input|select|textarea)\b[^>]*\bid="([^"]+)"/g), (match) => match[2]);
    expect(controls).toHaveLength(9);
    for (const id of controls) expect(form, id).toContain(`for="${id}"`);
  });

  it("marks required fields programmatically and leaves phone optional", () => {
    for (const name of ["firstName", "lastName", "email", "company", "title", "inquiryType", "timeline", "message"]) {
      expect(form, name).toMatch(new RegExp(`id="contact-${name}"[^>]*required=""[^>]*aria-required="true"`));
    }
    expect(form).not.toMatch(/id="contact-phone"[^>]*required/);
  });

  it("uses the app's own validation messages instead of browser bubbles", () => {
    // HTML attribute names are case-insensitive; React 19 serializes this one as noValidate.
    expect(form).toMatch(/<form[^>]*novalidate=""/i);
  });
});
