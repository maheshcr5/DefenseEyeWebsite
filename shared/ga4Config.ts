// GA4 configuration checks shared by the production build (vite.config.ts) and tests.
// VITE_GA4_MEASUREMENT_ID in the deployment .env is the single source of the ID; this
// module only decides whether a value is usable. It never supplies a default ID.

export const GA4_ENV_KEY = "VITE_GA4_MEASUREMENT_ID";

/** Same pattern as the inline loader in client/index.html (kept in sync by a test). */
export const GA4_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{6,12}$/;

/** IDs that must never be built into the site again (retired or wrong property). */
export const RETIRED_GA4_MEASUREMENT_IDS: readonly string[] = [["G", "KTK7M073CH"].join("-")];

/** Template value from .env.example; treated the same as a missing ID. */
const EXAMPLE_PLACEHOLDER = "G-XXXXXXXXXX";

export type Ga4IdCheck = { ok: true; id: string } | { ok: false; reason: string };

export function checkGa4MeasurementId(raw: string | undefined): Ga4IdCheck {
  const id = (raw ?? "").trim();
  if (!id) return { ok: false, reason: `${GA4_ENV_KEY} is not set.` };
  if (id === EXAMPLE_PLACEHOLDER) return { ok: false, reason: `${GA4_ENV_KEY} is still the .env.example placeholder (${EXAMPLE_PLACEHOLDER}).` };
  if (!GA4_MEASUREMENT_ID_PATTERN.test(id)) {
    return { ok: false, reason: `${GA4_ENV_KEY} "${id}" is not a GA4 Measurement ID (expected G- followed by 6-12 uppercase letters or digits).` };
  }
  if (RETIRED_GA4_MEASUREMENT_IDS.includes(id)) return { ok: false, reason: `${GA4_ENV_KEY} "${id}" is a retired Measurement ID and must not be used.` };
  return { ok: true, id };
}

/** Vite leaves %VITE_*% untouched in index.html when the variable is undefined. */
export function findUnresolvedEnvPlaceholders(html: string): string[] {
  return Array.from(new Set(html.match(/%VITE_[A-Z0-9_]+%/g) ?? []));
}

/**
 * Checks a built index.html. The GA4 placeholder must be resolved to the configured ID,
 * which must appear in exactly one loader assignment. Other unresolved placeholders are
 * returned as warnings because those integrations (for example Umami) are optional.
 */
export function checkBuiltIndexHtml(html: string, expectedId: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const unresolved = findUnresolvedEnvPlaceholders(html);
  if (unresolved.includes(`%${GA4_ENV_KEY}%`)) errors.push(`Built index.html still contains the unresolved %${GA4_ENV_KEY}% placeholder.`);

  const assignments = html.match(/window\.__gaId\s*=\s*"([^"]*)"/g) ?? [];
  if (assignments.length !== 1) errors.push(`Built index.html must assign window.__gaId exactly once (found ${assignments.length}).`);
  else if (!assignments[0].includes(`"${expectedId}"`)) errors.push(`Built index.html does not use the configured Measurement ID ${expectedId}.`);

  for (const retired of RETIRED_GA4_MEASUREMENT_IDS) {
    if (html.includes(retired)) errors.push(`Built index.html contains the retired Measurement ID ${retired}.`);
  }

  const loaders = html.match(/googletagmanager\.com\/gtag\/js/g) ?? [];
  if (loaders.length !== 1) errors.push(`Built index.html must reference the gtag.js loader exactly once (found ${loaders.length}).`);

  const warnings = unresolved.filter((placeholder) => placeholder !== `%${GA4_ENV_KEY}%`).map((placeholder) => `Unresolved optional placeholder ${placeholder} in built index.html.`);
  return { errors, warnings };
}
