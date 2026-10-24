import React from "react";
import fs from "fs";
import path from "path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const tracking = vi.hoisted(() => ({ trackConversion: vi.fn() }));
vi.mock("@/lib/tracking", () => tracking);

import NewsletterSignup, {
  NEWSLETTER_UNAVAILABLE_HEADING,
  buildNewsletterContactHref,
  trackNewsletterFallbackClick,
} from "./NewsletterSignup";
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

  it("uses neutral copy that does not assume a CMMC (or any other) interest", () => {
    // Heading, message, and contact CTA (the secondary free-guides link is a content pointer, not an intent).
    const start = html.indexOf(NEWSLETTER_UNAVAILABLE_HEADING);
    const fallback = html.slice(start, html.indexOf("Contact Our Team", start) + "Contact Our Team".length);
    expect(fallback).not.toMatch(/CMMC/);
    expect(fallback).toContain("Email updates aren&#x27;t available yet.");
  });

  it("routes to the general contact flow with a neutral inquiry, not CMMC", () => {
    expect(html).toContain('href="/contact?inquiry=newsletter"');
    expect(html).not.toContain("inquiry=cmmc");
    expect(html).toContain('href="/knowledge-hub"');
  });

  it("renders the CTA as a real link with an accessible name for keyboard and screen-reader users", () => {
    expect(html).toMatch(/<a[^>]*href="\/contact\?inquiry=newsletter"[^>]*>[\s\S]*?Contact Our Team[\s\S]*?<\/a>/);
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
  });
});

describe("newsletter fallback contact link", () => {
  it("sets only the neutral inquiry when the page has no query string", () => {
    expect(buildNewsletterContactHref("")).toBe("/contact?inquiry=newsletter");
  });

  it("preserves existing campaign, referral, and click-id parameters", () => {
    const href = buildNewsletterContactHref("?utm_source=linkedin&utm_campaign=cmmc-q4&gclid=abc123&oppref=opp_9");
    const params = new URL(href, "https://defenseeye.ai").searchParams;
    expect(params.get("utm_source")).toBe("linkedin");
    expect(params.get("utm_campaign")).toBe("cmmc-q4");
    expect(params.get("gclid")).toBe("abc123");
    expect(params.get("oppref")).toBe("opp_9");
    expect(params.get("inquiry")).toBe("newsletter");
  });

  it("replaces a stale inquiry value instead of duplicating it", () => {
    const href = buildNewsletterContactHref("?inquiry=cmmc&utm_source=x");
    const params = new URL(href, "https://defenseeye.ai").searchParams;
    expect(params.getAll("inquiry")).toEqual(["newsletter"]);
    expect(params.get("utm_source")).toBe("x");
  });
});

describe("newsletter fallback analytics", () => {
  it("fires its own event with location and neutral intent, and no personal data", () => {
    tracking.trackConversion.mockClear();
    trackNewsletterFallbackClick("knowledge_hub");
    expect(tracking.trackConversion).toHaveBeenCalledTimes(1);
    expect(tracking.trackConversion).toHaveBeenCalledWith("newsletter_unavailable_cta_click", { location: "knowledge_hub", intent: "newsletter" });
  });
});

describe("NewsletterSignup with a provider", () => {
  it("renders a labelled, required email field with consent language and a privacy link", () => {
    const html = renderToStaticMarkup(<NewsletterSignup {...base} provider={provider} />);
    expect(html).toMatch(/<label[^>]*for="blog-newsletter-email"/);
    expect(html).toMatch(/id="blog-newsletter-email"[^>]*required=""[^>]*aria-required="true"/);
    expect(html).toContain("By subscribing, you agree to receive email updates from DefenseEye");
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
