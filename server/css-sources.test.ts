import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const clientSrc = path.resolve(__dirname, "../client/src");
const css = fs.readFileSync(path.join(clientSrc, "index.css"), "utf-8");
const excluded = Array.from(css.matchAll(/@source not "\.\/components\/ui\/([a-z0-9-]+)\.tsx";/g), (match) => match[1]);

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(tsx?|jsx?)$/.test(entry.name) && !/\.test\./.test(entry.name) ? [full] : [];
  });
}

describe("Tailwind source exclusions", () => {
  it("excludes only ui components that no scanned file imports", () => {
    expect(excluded.length).toBeGreaterThan(0);
    const excludedFiles = new Set(excluded.map((name) => path.join(clientSrc, "components", "ui", `${name}.tsx`)));
    const scanned = sourceFiles(clientSrc).filter((file) => !excludedFiles.has(file));
    for (const name of excluded) {
      expect(fs.existsSync(path.join(clientSrc, "components", "ui", `${name}.tsx`)), name).toBe(true);
      const importPattern = new RegExp(`(?:@/components/ui/|\\./)${name}["']`);
      const importers = scanned.filter((file) => importPattern.test(fs.readFileSync(file, "utf-8")));
      expect(importers.map((file) => path.relative(clientSrc, file)), `${name} is imported; remove its @source not line`).toEqual([]);
    }
  });
});
