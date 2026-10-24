#!/usr/bin/env node
// Fails when secrets could leak through the build or the repository. It never prints a
// secret value: findings name the file and the kind of match only.
//
//   node scripts/check-secrets.mjs --build   scan dist/ after `pnpm build` (runs as part of the build)
//   node scripts/check-secrets.mjs --repo    scan files tracked by git (CI)
//
// Value checks use secret-named variables from the environment and from .env when present
// (the VPS build); CI has no .env, so there only the pattern and file-name checks apply.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// CHECK_SECRETS_ROOT points the CLI at another project directory (used by the tests).
const ROOT = process.env.CHECK_SECRETS_ROOT ? path.resolve(process.env.CHECK_SECRETS_ROOT) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Server-only variables whose names must never reach the browser bundle. */
export const SERVER_SECRET_NAMES = ["GOOGLE_GENERATIVE_AI_API_KEY", "SMTP_PASS"];

/** High-confidence credential formats; generic shapes are avoided to keep minified code from matching. */
export const SECRET_PATTERNS = [
  { label: "Google API key", regex: /AIza[0-9A-Za-z_-]{35}/ },
  { label: "OpenAI key", regex: /\bsk-(?:proj|svcacct|admin)-[A-Za-z0-9_-]{20,}|\bsk-[A-Za-z0-9]{48}\b/ },
  { label: "Anthropic key", regex: /\bsk-ant-[A-Za-z0-9_-]{20,}/ },
  { label: "GitHub token", regex: /\bgh[pousr]_[A-Za-z0-9]{36,}/ },
  { label: "Slack token", regex: /\bxox[abprs]-[A-Za-z0-9-]{10,}/ },
  { label: "AWS access key", regex: /\bAKIA[0-9A-Z]{16}\b/ },
  { label: "Private key", regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/ },
];

const SECRET_NAME = /(KEY|SECRET|TOKEN|PASS|PASSWORD|PRIVATE|CREDENTIAL)/;
const MIN_VALUE_LENGTH = 8;
const TEXT_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".css", ".html", ".json", ".txt", ".xml", ".map", ".svg", ".webmanifest", ".md", ".ts", ".tsx", ".yml", ".yaml", ".sh", ".conf", ".example", ""]);

/** Tracked file names that must never be committed. .env.example is the only allowed env file. */
export function isForbiddenFileName(file) {
  const base = path.posix.basename(file.replace(/\\/g, "/"));
  if (base === ".env.example") return false;
  return (
    /^\.env(\..+)?$/.test(base) ||
    /\.env$/.test(base) ||
    /^(\.npmrc|\.netrc|\.envrc)$/.test(base) ||
    /\.(pem|key|p12|pfx|jks|keystore)$/i.test(base) ||
    /^id_(rsa|ed25519|ecdsa|dsa)(\.pub)?$/.test(base) ||
    /^(credentials.*|.*service-account.*)\.json$/i.test(base)
  );
}

/** Minimal .env parser; values are kept in memory only. */
export function parseEnv(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    values[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2").trim();
  }
  return values;
}

/** Secret-named, non-public (non-VITE_) variables with a value long enough to search for. */
export function collectSecretValues(...sources) {
  const secrets = new Map();
  for (const source of sources) {
    for (const [name, value] of Object.entries(source)) {
      if (name.startsWith("VITE_") || !SECRET_NAME.test(name)) continue;
      if (typeof value === "string" && value.length >= MIN_VALUE_LENGTH) secrets.set(name, value);
    }
  }
  return secrets;
}

/** Returns finding labels for one file's text. Labels never include the matched text. */
export function scanText(text, { secretValues = new Map(), forbiddenNames = [] } = {}) {
  const findings = [];
  for (const { label, regex } of SECRET_PATTERNS) if (regex.test(text)) findings.push(label);
  for (const [name, value] of secretValues) if (text.includes(value)) findings.push(`value of ${name}`);
  for (const name of forbiddenNames) if (text.includes(name)) findings.push(`server-only variable name ${name}`);
  return findings;
}

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

const hasTextExtension = (file) => TEXT_EXTENSIONS.has(path.extname(file).toLowerCase());

function isText(file) {
  try {
    return hasTextExtension(file) && statSync(file).size < 20 * 1024 * 1024;
  } catch {
    return false;
  }
}

/**
 * dist/ checks: no env-like files anywhere; no secret values anywhere (server bundle included);
 * in dist/public (served to browsers) also no credential patterns and no server-only variable names.
 */
export function scanBuild(distDir, secretValues) {
  const findings = [];
  if (!existsSync(distDir)) return [{ file: path.relative(ROOT, distDir), finding: "build output not found (run pnpm build first)" }];
  const publicDir = path.join(distDir, "public");
  for (const file of walk(distDir)) {
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    if (rel.split("/").includes("node_modules")) continue;
    if (isForbiddenFileName(file)) findings.push({ file: rel, finding: "environment or key file in build output" });
    if (!isText(file)) continue;
    const isPublic = file.startsWith(publicDir + path.sep);
    const text = readFileSync(file, "utf8");
    const labels = isPublic ? scanText(text, { secretValues, forbiddenNames: SERVER_SECRET_NAMES }) : scanText(text, { secretValues });
    for (const label of labels) findings.push({ file: rel, finding: label });
  }
  return findings;
}

/** Tracked-file checks: forbidden secret file names and credential patterns in content. */
export function scanRepo(trackedFiles, readFile = (file) => readFileSync(path.join(ROOT, file), "utf8")) {
  const findings = [];
  for (const file of trackedFiles) {
    if (isForbiddenFileName(file)) findings.push({ file, finding: "secret or environment file is tracked by git" });
    if (file === "pnpm-lock.yaml" || !hasTextExtension(file)) continue;
    let text;
    try {
      text = readFile(file);
    } catch {
      continue;
    }
    for (const label of scanText(text)) findings.push({ file, finding: label });
  }
  return findings;
}

function main(argv) {
  const modes = new Set(argv.filter((arg) => arg.startsWith("--")));
  if (!modes.has("--build") && !modes.has("--repo")) modes.add("--build");
  const envFile = path.join(ROOT, ".env");
  const secretValues = collectSecretValues(existsSync(envFile) ? parseEnv(readFileSync(envFile, "utf8")) : {}, process.env);
  const findings = [];

  if (modes.has("--repo")) {
    const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: ROOT, encoding: "utf8" }).split("\0").filter(Boolean);
    findings.push(...scanRepo(tracked));
    console.log(`[check-secrets] repo: scanned ${tracked.length} tracked files`);
  }
  if (modes.has("--build")) {
    findings.push(...scanBuild(path.join(ROOT, "dist"), secretValues));
    console.log(`[check-secrets] build: scanned dist/ (${secretValues.size} secret value(s) from the environment compared, none printed)`);
  }

  if (findings.length) {
    console.error(`[check-secrets] FAILED: ${findings.length} finding(s). Values are not shown.`);
    for (const { file, finding } of findings) console.error(`  - ${file}: ${finding}`);
    process.exit(1);
  }
  console.log("[check-secrets] passed: no secret values, credential patterns, server-only variable names, or environment files found");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main(process.argv.slice(2));
