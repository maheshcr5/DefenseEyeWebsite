import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
// @ts-expect-error -- plain ESM script without type declarations
import { collectSecretValues, isForbiddenFileName, parseEnv, scanBuild, scanRepo, scanText } from "./check-secrets.mjs";

// Fake credentials are assembled at runtime so this file never contains a matching string.
const repeat = (char: string, count: number) => char.repeat(count);
const FAKE = {
  google: "AI" + "za" + repeat("B", 35),
  openai: "sk-" + "proj-" + repeat("c", 30),
  anthropic: "sk-" + "ant-" + repeat("d", 30),
  github: "gh" + "p_" + repeat("E", 36),
  aws: "AK" + "IA" + repeat("F", 16),
  privateKey: "-----BEGIN " + "PRIVATE KEY-----",
};
const GEMINI_VALUE = "gemini-test-value-" + repeat("x", 20);

const temps: string[] = [];
function tempProject() {
  const dir = mkdtempSync(path.join(os.tmpdir(), "check-secrets-"));
  temps.push(dir);
  mkdirSync(path.join(dir, "dist", "public", "assets"), { recursive: true });
  return dir;
}
afterEach(() => {
  while (temps.length) rmSync(temps.pop()!, { recursive: true, force: true });
});

describe("credential patterns", () => {
  it("detects each high-confidence credential format and reports only a label", () => {
    for (const value of Object.values(FAKE)) {
      const findings = scanText(`const x = "${value}";`);
      expect(findings).toHaveLength(1);
      expect(findings.join(" ")).not.toContain(value);
    }
  });

  it("does not flag minified code that merely resembles key prefixes", () => {
    expect(scanText('"files--ask-user-about-supersession-threat" "mask-image-linear-gradient" sk-learn')).toEqual([]);
  });
});

describe("secret values from the environment", () => {
  it("collects secret-named server variables, never VITE_ (public) or short values", () => {
    const secrets = collectSecretValues(
      { GOOGLE_GENERATIVE_AI_API_KEY: GEMINI_VALUE, SMTP_PASS: "long-enough-pass", VITE_GA4_MEASUREMENT_ID: "G-H22Q6LRNWC", VITE_FRONTEND_FORGE_API_KEY: "public-browser-key", PORT: "3000", SHORT_TOKEN: "abc" },
      {}
    );
    expect([...secrets.keys()].sort()).toEqual(["GOOGLE_GENERATIVE_AI_API_KEY", "SMTP_PASS"]);
  });

  it("reports which variable leaked without the value", () => {
    const findings = scanText(`fetch("x?key=${GEMINI_VALUE}")`, { secretValues: new Map([["GOOGLE_GENERATIVE_AI_API_KEY", GEMINI_VALUE]]) });
    expect(findings).toEqual(["value of GOOGLE_GENERATIVE_AI_API_KEY"]);
  });

  it("parses .env lines including quotes and export", () => {
    expect(parseEnv(`# c\nexport A_KEY="${GEMINI_VALUE}"\nB_TOKEN='quoted-token-value'\nPLAIN=1\n`)).toEqual({ A_KEY: GEMINI_VALUE, B_TOKEN: "quoted-token-value", PLAIN: "1" });
  });
});

describe("file names", () => {
  it("forbids env, key, and credential files but allows .env.example", () => {
    for (const name of [".env", ".env.production", ".env.backup.20260904183103", "deploy/prod.env", ".npmrc", "server.key", "certs/site.pem", "id_rsa", "credentials.json", "gcp-service-account.json"]) {
      expect(isForbiddenFileName(name), name).toBe(true);
    }
    for (const name of [".env.example", "client/src/lib/env.ts", "keys.ts", "docs/environment.md"]) {
      expect(isForbiddenFileName(name), name).toBe(false);
    }
  });
});

describe("build output scan", () => {
  it("passes a clean build", () => {
    const root = tempProject();
    writeFileSync(path.join(root, "dist", "public", "assets", "index-abc.js"), "console.log('ok')");
    writeFileSync(path.join(root, "dist", "index.js"), "const k = process.env.GOOGLE_GENERATIVE_AI_API_KEY;");
    expect(scanBuild(path.join(root, "dist"), new Map([["GOOGLE_GENERATIVE_AI_API_KEY", GEMINI_VALUE]]))).toEqual([]);
  });

  it("fails on a secret value in the client bundle or the server bundle", () => {
    const root = tempProject();
    writeFileSync(path.join(root, "dist", "public", "assets", "index-abc.js"), `const k="${GEMINI_VALUE}"`);
    writeFileSync(path.join(root, "dist", "index.js"), `const k="${GEMINI_VALUE}"`);
    const findings = scanBuild(path.join(root, "dist"), new Map([["GOOGLE_GENERATIVE_AI_API_KEY", GEMINI_VALUE]]));
    expect(findings.map((f: { finding: string }) => f.finding)).toEqual(["value of GOOGLE_GENERATIVE_AI_API_KEY", "value of GOOGLE_GENERATIVE_AI_API_KEY"]);
  });

  it("fails on a server-only variable name or credential pattern in public files", () => {
    const root = tempProject();
    writeFileSync(path.join(root, "dist", "public", "assets", "a.js"), "import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY");
    writeFileSync(path.join(root, "dist", "public", "b.json"), JSON.stringify({ k: FAKE.google }));
    const findings = scanBuild(path.join(root, "dist"), new Map());
    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ finding: "server-only variable name GOOGLE_GENERATIVE_AI_API_KEY" }),
        expect.objectContaining({ finding: "Google API key" }),
      ])
    );
  });

  it("fails when an environment file is copied into the build output", () => {
    const root = tempProject();
    writeFileSync(path.join(root, "dist", "public", ".env"), "X=1");
    writeFileSync(path.join(root, "dist", ".env.production"), "X=1");
    expect(scanBuild(path.join(root, "dist"), new Map()).filter((f: { finding: string }) => f.finding.startsWith("environment"))).toHaveLength(2);
  });

  it("does not follow the dist/node_modules link", () => {
    const root = tempProject();
    mkdirSync(path.join(root, "deps"));
    writeFileSync(path.join(root, "deps", "lib.js"), FAKE.google);
    symlinkSync(path.join(root, "deps"), path.join(root, "dist", "node_modules"), process.platform === "win32" ? "junction" : "dir");
    expect(scanBuild(path.join(root, "dist"), new Map())).toEqual([]);
  });
});

describe("repository scan", () => {
  it("fails on a tracked env file or a credential in tracked content", () => {
    const files: Record<string, string> = { ".env": "X=1", ".env.example": "GOOGLE_GENERATIVE_AI_API_KEY=", "docs/setup.md": `key: ${FAKE.github}`, "server/ok.ts": "process.env.GOOGLE_GENERATIVE_AI_API_KEY" };
    const findings = scanRepo(Object.keys(files), (file: string) => files[file]);
    expect(findings).toEqual([
      { file: ".env", finding: "secret or environment file is tracked by git" },
      { file: "docs/setup.md", finding: "GitHub token" },
    ]);
  });
});

describe("command line", () => {
  it("exits non-zero on a leak and never prints the secret value", () => {
    const root = tempProject();
    writeFileSync(path.join(root, "dist", "public", "assets", "index-abc.js"), `const k="${GEMINI_VALUE}"`);
    writeFileSync(path.join(root, ".env"), `GOOGLE_GENERATIVE_AI_API_KEY=${GEMINI_VALUE}\n`);
    const result = spawnSync(process.execPath, [path.resolve(__dirname, "check-secrets.mjs"), "--build"], {
      env: { ...process.env, CHECK_SECRETS_ROOT: root },
      encoding: "utf8",
    });
    expect(result.status).toBe(1);
    const output = result.stdout + result.stderr;
    expect(output).toContain("value of GOOGLE_GENERATIVE_AI_API_KEY");
    expect(output).not.toContain(GEMINI_VALUE);
  });

  it("exits zero for a clean build", () => {
    const root = tempProject();
    writeFileSync(path.join(root, "dist", "public", "index.html"), "<html></html>");
    const result = spawnSync(process.execPath, [path.resolve(__dirname, "check-secrets.mjs"), "--build"], { env: { ...process.env, CHECK_SECRETS_ROOT: root }, encoding: "utf8" });
    expect(result.status).toBe(0);
  });
});
