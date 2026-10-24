import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { GA4_ENV_KEY, checkBuiltIndexHtml, checkGa4MeasurementId } from "./shared/ga4Config";

// Production builds stop with a clear error instead of silently shipping without GA4.
// GA4_ALLOW_MISSING=true downgrades the errors to warnings for local, non-deployed builds.
export function ga4ConfigGuard(): Plugin {
  let enforce = false;
  let measurementId = "";
  const allowMissing = process.env.GA4_ALLOW_MISSING === "true";
  const fail = (message: string) => {
    if (!allowMissing) throw new Error(`[ga4-config] ${message} Set ${GA4_ENV_KEY} in .env (see .env.example), or set GA4_ALLOW_MISSING=true for a local build that will not be deployed.`);
    console.warn(`[ga4-config] WARNING (GA4_ALLOW_MISSING=true): ${message}`);
  };

  return {
    name: "defenseeye-ga4-config-guard",
    apply: "build",
    configResolved(config) {
      enforce = config.mode === "production";
      if (!enforce) return;
      const check = checkGa4MeasurementId(config.env[GA4_ENV_KEY]);
      if (check.ok) measurementId = check.id;
      else fail(check.reason);
    },
    writeBundle(_options, bundle) {
      if (!enforce || !measurementId) return;
      const index = bundle["index.html"];
      if (!index || index.type !== "asset") return fail("Built index.html was not found.");
      const { errors, warnings } = checkBuiltIndexHtml(String(index.source), measurementId);
      warnings.forEach((warning) => console.warn(`[ga4-config] ${warning}`));
      if (errors.length) fail(errors.join(" "));
      else console.log(`[ga4-config] GA4 Measurement ID ${measurementId} verified in built index.html.`);
    },
  };
}

const plugins = [react(), tailwindcss(), jsxLocPlugin(), ga4ConfigGuard()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
