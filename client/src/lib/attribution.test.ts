import { afterEach, describe, expect, it, vi } from "vitest";
import { captureUtmParameters, getStoredAttribution } from "./tracking";

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => void values.set(key, value)),
  };
}

function visit(url: string, referrer: string, storage = { session: createStorage(), local: createStorage() }) {
  const { pathname, search, hostname } = new URL(url);
  vi.stubGlobal("window", { location: { pathname, search, hostname }, sessionStorage: storage.session, localStorage: storage.local });
  vi.stubGlobal("document", { referrer });
  vi.stubGlobal("sessionStorage", storage.session);
  vi.stubGlobal("localStorage", storage.local);
  captureUtmParameters();
  return storage;
}

describe("campaign attribution across page loads", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("keeps landing attribution when an internal link (such as the newsletter fallback) reloads the app", () => {
    const storage = visit("https://defenseeye.ai/blog?utm_source=linkedin&utm_campaign=q4&gclid=g1", "https://www.linkedin.com/");
    visit("https://defenseeye.ai/contact?inquiry=newsletter", "https://defenseeye.ai/blog", storage);

    expect(getStoredAttribution()).toMatchObject({
      utm_source: "linkedin",
      utm_campaign: "q4",
      gclid: "g1",
      landing_pathname: "/blog",
      referrer_domain: "linkedin.com",
    });
  });

  it("keeps landing page and external referrer when the fallback carries the same campaign parameters forward", () => {
    const storage = visit("https://defenseeye.ai/blog?utm_source=linkedin&utm_campaign=q4", "https://www.linkedin.com/");
    visit("https://defenseeye.ai/contact?utm_source=linkedin&utm_campaign=q4&inquiry=newsletter", "https://defenseeye.ai/blog?utm_source=linkedin", storage);

    expect(getStoredAttribution()).toEqual({
      utm_source: "linkedin",
      utm_campaign: "q4",
      landing_pathname: "/blog",
      referrer_domain: "linkedin.com",
    });
  });

  it("merges new campaign values from an internal page load without losing the landing record", () => {
    const storage = visit("https://defenseeye.ai/blog?utm_source=linkedin", "https://www.linkedin.com/");
    visit("https://defenseeye.ai/contact?utm_content=footer", "https://defenseeye.ai/blog", storage);

    expect(getStoredAttribution()).toMatchObject({ utm_source: "linkedin", utm_content: "footer", landing_pathname: "/blog", referrer_domain: "linkedin.com" });
  });

  it("still records a fresh arrival from another site", () => {
    const storage = visit("https://defenseeye.ai/blog?utm_source=linkedin", "https://www.linkedin.com/");
    visit("https://defenseeye.ai/pricing", "https://www.google.com/", storage);

    expect(getStoredAttribution()).toMatchObject({ landing_pathname: "/pricing", referrer_domain: "google.com" });
    expect(getStoredAttribution().utm_source).toBeUndefined();
  });

  it("records the first landing even without campaign parameters", () => {
    visit("https://defenseeye.ai/knowledge-hub", "");
    expect(getStoredAttribution()).toMatchObject({ landing_pathname: "/knowledge-hub" });
  });
});
