import { build } from "esbuild";
import fs from "fs";
import path from "path";

await build({
  entryPoints: ["server/index.ts"],
  platform: "node",
  packages: "external",
  bundle: true,
  format: "esm",
  outdir: "dist",
});

// Symlink node_modules into dist/ so ESM external imports resolve correctly
// (ESM resolves relative to the file's location, not CWD)
const link = path.resolve("dist", "node_modules");
const target = path.resolve("node_modules");
if (!fs.existsSync(link)) {
  fs.symlinkSync(target, link, process.platform === "win32" ? "junction" : "dir");
}

console.log("  dist/index.js  (server built)");
