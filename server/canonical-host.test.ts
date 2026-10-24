import fs from "fs";
import path from "path";
import { describe, expect, it, vi } from "vitest";
import {
  CANONICAL_HOST,
  LEGACY_REDIRECTS,
  canonicalHostMiddleware,
  getRouteMeta,
  resolveCanonicalRedirect,
  resolveUrlDisposition,
} from "./index";

const isKnownRoute = (candidate: string) => getRouteMeta(candidate) !== null;
const resolve = (host: string | undefined, forwardedProto: string | undefined, url: string) => {
  const [pathname, query] = url.split("?");
  return resolveCanonicalRedirect({ host, forwardedProto, path: pathname, search: query ? `?${query}` : "" }, isKnownRoute);
};

describe("preferred hostname and protocol", () => {
  it("serves the preferred https://defenseeye.ai host without redirecting (no loop)", () => {
    expect(resolve("defenseeye.ai", "https", "/")).toBeNull();
    expect(resolve("defenseeye.ai", "https", "/pricing?utm_source=x")).toBeNull();
  });

  it("redirects HTTPS www to the preferred host in one hop", () => {
    expect(resolve("www.defenseeye.ai", "https", "/")).toBe("https://defenseeye.ai/");
    expect(resolve("www.defenseeye.ai", "https", "/pricing")).toBe("https://defenseeye.ai/pricing");
  });

  it("redirects plain HTTP on both hosts to the preferred HTTPS host in one hop", () => {
    expect(resolve("defenseeye.ai", "http", "/")).toBe("https://defenseeye.ai/");
    expect(resolve("www.defenseeye.ai", "http", "/contact")).toBe("https://defenseeye.ai/contact");
  });

  it("sends the retired CMMC route straight to its final page from every host and protocol", () => {
    const final = "https://defenseeye.ai/services/cmmc-readiness-sprint";
    expect(resolve("defenseeye.ai", "http", "/cmmc-readiness-sprint")).toBe(final);
    expect(resolve("www.defenseeye.ai", "http", "/cmmc-readiness-sprint")).toBe(final);
    expect(resolve("www.defenseeye.ai", "https", "/cmmc-readiness-sprint")).toBe(final);
    expect(resolve("www.defenseeye.ai", "https", "/cmmc-readiness-sprint/")).toBe(final);
    // On the preferred host the app's own single 301 applies (see seo/route tests).
    expect(resolveUrlDisposition("/cmmc-readiness-sprint", isKnownRoute)).toEqual({
      kind: "redirect",
      status: 301,
      location: "/services/cmmc-readiness-sprint",
    });
  });

  it("folds trailing-slash normalization into the same hop", () => {
    expect(resolve("defenseeye.ai", "http", "/pricing/")).toBe("https://defenseeye.ai/pricing");
  });

  it("preserves the query string so UTM and click-id attribution survive", () => {
    expect(resolve("www.defenseeye.ai", "https", "/blog?utm_source=linkedin&gclid=g1")).toBe(
      "https://defenseeye.ai/blog?utm_source=linkedin&gclid=g1"
    );
    expect(resolve("defenseeye.ai", "http", "/cmmc-readiness-sprint?utm_campaign=q4")).toBe(
      "https://defenseeye.ai/services/cmmc-readiness-sprint?utm_campaign=q4"
    );
  });

  it("never redirects other hosts, such as local health checks", () => {
    expect(resolve("127.0.0.1:3000", undefined, "/")).toBeNull();
    expect(resolve("localhost:4173", "http", "/")).toBeNull();
    expect(resolve(undefined, undefined, "/")).toBeNull();
  });

  it("ignores ports, case, and proxy-chain lists, and never reflects the Host header", () => {
    expect(resolve("WWW.DefenseEye.ai:443", "https", "/")).toBe("https://defenseeye.ai/");
    expect(resolve("defenseeye.ai", "http, https", "/")).toBe("https://defenseeye.ai/");
    expect(resolve("evil.example", "http", "/")).toBeNull();
  });

  it("never points at a URL that would redirect again (no chains)", () => {
    const paths = ["/", "/pricing", "/pricing/", ...Object.keys(LEGACY_REDIRECTS)];
    for (const [host, proto] of [["www.defenseeye.ai", "https"], ["defenseeye.ai", "http"], ["www.defenseeye.ai", "http"]]) {
      for (const pathname of paths) {
        const target = resolve(host, proto, pathname);
        expect(target, `${host} ${proto} ${pathname}`).toBeTruthy();
        const next = new URL(target!);
        expect(next.host).toBe(CANONICAL_HOST);
        expect(resolve(next.host, "https", next.pathname + next.search), target!).toBeNull();
        expect(resolveUrlDisposition(next.pathname, isKnownRoute).kind, target!).not.toBe("redirect");
      }
    }
  });
});

describe("canonicalHostMiddleware", () => {
  function run(method: string, host: string, proto: string, originalUrl: string) {
    const [pathname] = originalUrl.split("?");
    const req = { method, headers: { host, "x-forwarded-proto": proto }, path: pathname, originalUrl };
    const res = { redirect: vi.fn() };
    const next = vi.fn();
    canonicalHostMiddleware(isKnownRoute)(req as never, res as never, next);
    return { res, next };
  }

  it("uses 301 for GET and HEAD", () => {
    expect(run("GET", "www.defenseeye.ai", "https", "/blog").res.redirect).toHaveBeenCalledWith(301, "https://defenseeye.ai/blog");
    expect(run("HEAD", "defenseeye.ai", "http", "/").res.redirect).toHaveBeenCalledWith(301, "https://defenseeye.ai/");
  });

  it("uses 308 for other methods so form posts keep their method and body", () => {
    expect(run("POST", "www.defenseeye.ai", "https", "/api/contact").res.redirect).toHaveBeenCalledWith(308, "https://defenseeye.ai/api/contact");
  });

  it("passes preferred-host HTTPS requests through untouched, including the contact API", () => {
    const { res, next } = run("POST", "defenseeye.ai", "https", "/api/contact");
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("nginx template", () => {
  it("lets the app perform hostname and protocol redirects instead of adding its own hop", () => {
    const conf = fs.readFileSync(path.resolve(__dirname, "../deploy/nginx/defenseeye.conf"), "utf-8");
    expect(conf).not.toMatch(/^\s*return\s+301/m);
    const blocks = conf.split(/\nserver\s*\{/).slice(1);
    for (const block of blocks) {
      if (/listen 80;|server_name www\.defenseeye\.ai;/.test(block)) {
        expect(block).toContain("proxy_set_header   X-Forwarded-Proto $scheme;");
        expect(block).toContain("proxy_set_header   Host              $host;");
      }
    }
  });
});
