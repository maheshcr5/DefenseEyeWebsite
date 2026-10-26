import fs from "fs";
import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("wouter", () => ({
  useLocation: () => ["/"],
  Link: React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>((props, ref) => <a ref={ref} {...props} />),
}));

import NavBar from "./NavBar";
import Home from "@/pages/Home";
import BankingAiAgentRisk from "@/pages/BankingAiAgentRisk";
import CMMCLens from "@/pages/CMMCLens";
import Pricing from "@/pages/Pricing";
import FAQ from "@/pages/FAQ";
import Support from "@/pages/Support";
import WhyDefenseEye from "@/pages/WhyDefenseEye";
import { BANKING_DISCOVERY_HREF, DEFY_AI_RISK_URL } from "@shared/bankingAiRiskContent";

// CTAs are links styled as buttons with <Button asChild><a|Link>…</a|Link></Button>, so each CTA is one
// element and one tab stop. Wrapping a <Button> in a link nests interactive controls and adds a second tab stop.

type Tag = { start: number; name: string; close: boolean; self: boolean; text: string };

function scanJsxTags(source: string): Tag[] {
  const tags: Tag[] = [];
  let i = 0;
  while (i < source.length) {
    if (source[i] === "<" && /[A-Za-z/]/.test(source[i + 1] ?? "")) {
      let j = i + 1;
      let depth = 0;
      let quote: string | null = null;
      for (; j < source.length; j++) {
        const c = source[j];
        if (quote) {
          if (c === quote && source[j - 1] !== "\\") quote = null;
          continue;
        }
        // Skip comments inside JSX expressions, so an apostrophe in "// the page's ..." is not read as a string.
        if (depth > 0 && c === "/" && source[j + 1] === "/") {
          j = source.indexOf("\n", j);
          continue;
        }
        if (depth > 0 && c === "/" && source[j + 1] === "*") {
          j = source.indexOf("*/", j) + 1;
          continue;
        }
        if (c === '"' || c === "'" || (depth > 0 && c === "`")) quote = c;
        else if (c === "{") depth++;
        else if (c === "}") depth--;
        else if (c === ">" && depth === 0) break;
      }
      const text = source.slice(i, j + 1);
      const match = text.match(/^<(\/?)([A-Za-z][\w.]*)/);
      if (match) tags.push({ start: i, name: match[2], close: match[1] === "/", self: text.endsWith("/>"), text });
      i = j + 1;
    } else i++;
  }
  return tags;
}

function clientSourceFiles(dir = path.resolve(__dirname, "..")): string[] {
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) return clientSourceFiles(full);
    return full.endsWith(".tsx") && !full.includes(".test.") ? [full] : [];
  });
}

/** Elements whose nearest JSX parent matches `parent`, e.g. a Button inside a link. */
function nestedElements(isChild: (tag: Tag) => boolean, isParent: (tag: Tag) => boolean) {
  const found: string[] = [];
  for (const file of clientSourceFiles()) {
    const source = fs.readFileSync(file, "utf8");
    const stack: Tag[] = [];
    for (const tag of scanJsxTags(source)) {
      if (tag.close) {
        const k = stack.map((t) => t.name).lastIndexOf(tag.name);
        if (k >= 0) stack.length = k;
        continue;
      }
      const parent = stack[stack.length - 1];
      if (parent && isChild(tag) && isParent(parent)) found.push(`${path.relative(process.cwd(), file)}:${source.slice(0, tag.start).split("\n").length}`);
      if (!tag.self) stack.push(tag);
    }
  }
  return found;
}

const isLink = (tag: Tag) => tag.name === "a" || tag.name === "Link";
const isPlainButton = (tag: Tag) => tag.name === "button" || (tag.name === "Button" && !/\basChild\b/.test(tag.text));

describe("CTA links styled as buttons (source)", () => {
  it("never wraps a Button in a link", () => {
    expect(nestedElements((tag) => tag.name === "Button" || tag.name === "button", isLink)).toEqual([]);
  });

  it("never puts a link inside a real button", () => {
    expect(nestedElements(isLink, isPlainButton)).toEqual([]);
  });

  it("keeps click handlers on the link only, so each CTA fires its cta_click once", () => {
    const asChildWithHandler = clientSourceFiles().flatMap((file) =>
      scanJsxTags(fs.readFileSync(file, "utf8"))
        .filter((tag) => tag.name === "Button" && /\basChild\b/.test(tag.text) && /\bon(Click|KeyDown|KeyUp)=/.test(tag.text))
        .map(() => file)
    );
    expect(asChildWithHandler).toEqual([]);
  });

  it("uses no positive tabIndex", () => {
    const positive = clientSourceFiles().filter((file) => /tabIndex=\{?\s*["']?[1-9]/.test(fs.readFileSync(file, "utf8")));
    expect(positive).toEqual([]);
  });
});

const PAGES: Array<[string, React.ReactElement]> = [
  ["NavBar (mobile menu open)", <NavBar pathOverride="/" initialMobileOpen />],
  ["Home", <Home />],
  ["Banking AI-agent risk", <BankingAiAgentRisk />],
  ["CMMCLens", <CMMCLens />],
  ["Pricing", <Pricing />],
  ["FAQ", <FAQ />],
  ["Support", <Support />],
  ["Why DefenseEye", <WhyDefenseEye />],
];

const ctaAnchors = (html: string) =>
  [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].filter((match) => /data-slot="button"/.test(match[1])).map((match) => ({ attrs: match[1], inner: match[2] }));

describe("CTA links styled as buttons (rendered)", () => {
  it.each(PAGES)("%s: each CTA is one focusable link with a visible focus style and an accessible name", (_name, element) => {
    const html = renderToStaticMarkup(element);
    expect(html).not.toMatch(/<a\b[^>]*>\s*<button/);
    for (const [, inner] of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)) expect(inner).not.toMatch(/<a\b/);
    const ctas = ctaAnchors(html);
    expect(ctas.length).toBeGreaterThan(0);
    for (const cta of ctas) {
      expect(cta.attrs).toMatch(/\shref="[^"]+"/);
      expect(cta.attrs).toContain("focus-visible:ring-[3px]");
      expect(cta.attrs).not.toMatch(/tabindex="[1-9]/);
      expect(cta.inner).not.toMatch(/<(button|a|input|select|textarea)\b|tabindex=/);
      expect(cta.inner.replace(/<[^>]+>/g, "").trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps the banking CTAs' destinations, new-tab behaviour, and count", () => {
    const ctas = ctaAnchors(renderToStaticMarkup(<BankingAiAgentRisk />));
    const discovery = ctas.filter((cta) => cta.attrs.includes(`href="${BANKING_DISCOVERY_HREF}"`));
    const defy = ctas.filter((cta) => cta.attrs.includes(`href="${DEFY_AI_RISK_URL}"`));
    expect(discovery).toHaveLength(3);
    expect(defy).toHaveLength(2);
    for (const cta of defy) {
      expect(cta.attrs).toContain('target="_blank"');
      expect(cta.attrs).toContain('rel="noopener noreferrer"');
      expect(cta.inner).toContain("(opens in a new tab)");
    }
  });
});
