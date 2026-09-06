import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const OBSOLETE_CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

function listSourceFiles(dir: string, out: string[] = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listSourceFiles(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.endsWith(".test.tsx") && !entry.name.endsWith(".test.ts")) {
      out.push(full);
    }
  }
  return out;
}

describe("Booking-link remediation audit", () => {
  it("has no rendered production component referencing the obsolete Calendly URL", () => {
    const files = listSourceFiles(path.resolve("client/src"));
    const offenders = files.filter((file) => fs.readFileSync(file, "utf-8").includes(OBSOLETE_CALENDLY_URL));

    expect(offenders).toEqual([]);
  });

  it("has no rendered production component referencing calendly.com at all", () => {
    const files = listSourceFiles(path.resolve("client/src"));
    const offenders = files.filter((file) => fs.readFileSync(file, "utf-8").toLowerCase().includes("calendly.com"));

    expect(offenders).toEqual([]);
  });

  it("no CMMCLens-specific booking CTA points to the general discovery URL", () => {
    const cmmcLensSource = fs.readFileSync(path.resolve("client/src/pages/CMMCLens.tsx"), "utf-8");
    expect(cmmcLensSource).not.toContain("cal.com/defenseeye/discovery");
    expect(cmmcLensSource).toContain("CMMCLENS_BOOKING_URL");
  });

  it("companyFacts no longer exports the misleadingly named CALENDLY_URL", () => {
    const companyFactsSource = fs.readFileSync(path.resolve("client/src/data/companyFacts.ts"), "utf-8");
    expect(companyFactsSource).not.toMatch(/export const CALENDLY_URL/);
    expect(companyFactsSource).toContain("export const GENERAL_DISCOVERY_BOOKING_URL");
    expect(companyFactsSource).toContain("export const CMMCLENS_BOOKING_URL");
  });
});
