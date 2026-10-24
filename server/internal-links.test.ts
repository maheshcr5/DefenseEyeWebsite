import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { LEGACY_REDIRECTS, getRouteMeta } from "./index";

const roots = [path.resolve(__dirname, "../client/src"), path.resolve(__dirname, "../shared")];
const publicDir = path.resolve(__dirname, "../client/public");

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "ui" ? [] : sourceFiles(full);
    return /\.(tsx?)$/.test(entry.name) && !/\.test\./.test(entry.name) ? [full] : [];
  });
}

// href="/x", href: "/x", href={"/x"}, link("/x", ...), [label, "/x"] tuples in data arrays.
const LINK_PATTERNS = [
  /href=["{]+"?(\/[^"'#?}\s]*)/g,
  /href:\s*["'`](\/[^"'`#?\s]*)/g,
  /link\(\s*"(\/[^"#?]*)"/g,
  /\[\s*"[^"]+",\s*"(\/[a-z0-9/-]*)"/g,
];

describe("internal links in source", () => {
  it("point only at live routes or real public files, never at redirects", () => {
    const problems: string[] = [];
    for (const file of roots.flatMap(sourceFiles)) {
      const text = fs.readFileSync(file, "utf-8");
      for (const pattern of LINK_PATTERNS) {
        for (const match of text.matchAll(pattern)) {
          const target = match[1].replace(/\/+$/, "") || "/";
          if (target.startsWith("/api/") || target.startsWith("//")) continue;
          if (/\.[a-z0-9]+$/i.test(target)) {
            if (!fs.existsSync(path.join(publicDir, target))) problems.push(`${path.relative(process.cwd(), file)} -> ${target} (missing file)`);
            continue;
          }
          if (LEGACY_REDIRECTS[target]) problems.push(`${path.relative(process.cwd(), file)} -> ${target} (redirects to ${LEGACY_REDIRECTS[target]})`);
          else if (!getRouteMeta(target)) problems.push(`${path.relative(process.cwd(), file)} -> ${target} (no route)`);
        }
      }
    }
    expect([...new Set(problems)]).toEqual([]);
  });
});

describe("homepage anchor links", () => {
  it("only link to /#anchor when the homepage defines that id", () => {
    const home = fs.readFileSync(path.resolve(__dirname, "../client/src/pages/Home.tsx"), "utf-8");
    const problems: string[] = [];
    for (const file of roots.flatMap(sourceFiles)) {
      for (const match of fs.readFileSync(file, "utf-8").matchAll(/["'`]\/#([\w-]+)["'`]/g)) {
        if (!home.includes(`id="${match[1]}"`)) problems.push(`${path.relative(process.cwd(), file)} -> /#${match[1]}`);
      }
    }
    expect(problems).toEqual([]);
  });
});
