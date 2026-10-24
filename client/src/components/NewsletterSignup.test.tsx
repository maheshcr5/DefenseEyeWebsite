import React from "react";
import fs from "fs";
import path from "path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/tracking", () => ({ trackConversion: vi.fn() }));

import NewsletterSignup, { NEWSLETTER_CONTACT_HREF, NEWSLETTER_UNAVAILABLE_HEADING } from "./NewsletterSignup";
import { NEWSLETTER_MESSAGES, type NewsletterProvider } from "@/lib/newsletter";

const provider: NewsletterProvider = { name: "test-provider", subscribe: async () => undefined };
const base = {
  location: "blog" as const,
  heading: "Stay Ahead of CMMC Rule Changes",
  intro: "Get practical guidance.",
  resourcesLink: { label: "Browse the CMMC Knowledge Hub", href: "/knowledge-hub" },
};

describe("NewsletterSignup without a configured provider (current site state)", () => {
  const html = renderToStaticMarkup(<NewsletterSignup {...base} />);

  it("never says the visitor is subscribed and collects no email address", () => {
    expect(html).not.toMatch(/subscribed/i);
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<form");
    expect(html).toContain(NEWSLETTER_UNAVAILABLE_HEADING);
    expect(html).toContain("Email updates aren&#x27;t available yet.");
  });

  it("routes visitors to the existing contact workflow and free guides", () => {
    expect(html).toContain(`href="${NEWSLETTER_CONTACT_HREF.replace("&", "&amp;")}"`);
    expect(html).toContain('href="/knowledge-hub"');
  });
});

describe("NewsletterSignup with a provider", () => {
  it("renders a labelled, required email field with consent language and a privacy link", () => {
    const html = renderToStaticMarkup(<NewsletterSignup {...base} provider={provider} />);
    expect(html).toMatch(/<label[^>]*for="blog-newsletter-email"/);
    expect(html).toMatch(/id="blog-newsletter-email"[^>]*required=""[^>]*aria-required="true"/);
    expect(html).toContain("By subscribing, you agree to receive CMMC update emails from DefenseEye");
    expect(html).toContain('href="/privacy-policy"');
  });

  it("announces success with role=status only for an accepted subscription", () => {
    const html = renderToStaticMarkup(
      <NewsletterSignup {...base} provider={provider} initialResult={{ status: "success", message: NEWSLETTER_MESSAGES.success }} />
    );
    expect(html).toMatch(/role="status"[^>]*>[\s\S]*you&#x27;re subscribed/i);
    expect(html).not.toContain("<form");
  });

  it("announces errors with role=alert and links them to the field", () => {
    const html = renderToStaticMarkup(
      <NewsletterSignup {...base} provider={provider} initialResult={{ status: "error", message: NEWSLETTER_MESSAGES.error }} />
    );
    expect(html).toMatch(/aria-invalid="true"[^>]*aria-describedby="blog-newsletter-message"/);
    expect(html).toMatch(/id="blog-newsletter-message" role="alert"/);
    expect(html).not.toMatch(/role="status"/);
  });
});

describe("site-wide guard against false subscription messages", () => {
  it("has no hard-coded 'subscribed' success copy outside the provider-gated component", () => {
    const pagesDir = path.resolve(__dirname, "../pages");
    for (const file of fs.readdirSync(pagesDir).filter((name) => name.endsWith(".tsx") && !name.includes(".test."))) {
      const text = fs.readFileSync(path.join(pagesDir, file), "utf-8");
      expect(text, file).not.toMatch(/You're subscribed|You&apos;re subscribed|you are subscribed/i);
    }
  });
});
