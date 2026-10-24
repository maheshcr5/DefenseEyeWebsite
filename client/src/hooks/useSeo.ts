import { useEffect } from "react";
import { getRouteMetadata } from "@shared/routeMetadata";

const SITE_ORIGIN = "https://defenseeye.ai";
const DEFAULT_DESCRIPTION =
  "DefenseEye helps organizations adopt AI responsibly, improve AI governance, strengthen cybersecurity, automate compliance evidence, and increase audit readiness. CMMCLens is DefenseEye's flagship compliance intelligence platform.";

function setMetaContent(selector: string, attribute: "name" | "property", key: string, value: string) {
  let meta = document.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  const previous = meta.content;
  meta.content = value;
  return previous;
}

/**
 * Sets document.title, the meta description, the canonical URL, and Open Graph /
 * Twitter title, description, and URL.
 *
 * When the current path is listed in shared/routeMetadata.ts, that registry wins over
 * the title/description passed in, so the hydrated page matches the server-rendered
 * HTML exactly. The arguments remain the fallback for routes not in the registry.
 * Reverts to the previous values on unmount so navigating between pages never leaves
 * stale values in <head>.
 */
export function useSeo(title: string, description: string) {
  useEffect(() => {
    const path = window.location.pathname;
    const registered = getRouteMetadata(path);
    const finalTitle = registered?.title ?? title;
    const finalDescription = registered?.description ?? description;
    const canonical = SITE_ORIGIN + (path === "/" ? "/" : path.replace(/\/+$/, ""));

    const prevTitle = document.title;
    document.title = finalTitle;

    const prevDesc = setMetaContent('meta[name="description"]', "name", "description", finalDescription) || DEFAULT_DESCRIPTION;
    const prevOgTitle = setMetaContent('meta[property="og:title"]', "property", "og:title", finalTitle);
    const prevOgDesc = setMetaContent('meta[property="og:description"]', "property", "og:description", finalDescription);
    const prevOgUrl = setMetaContent('meta[property="og:url"]', "property", "og:url", canonical);
    const prevTwTitle = setMetaContent('meta[name="twitter:title"]', "name", "twitter:title", finalTitle);
    const prevTwDesc = setMetaContent('meta[name="twitter:description"]', "name", "twitter:description", finalDescription);

    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevCanonical = canonicalLink?.href;
    if (canonicalLink) canonicalLink.href = canonical;

    return () => {
      document.title = prevTitle;
      setMetaContent('meta[name="description"]', "name", "description", prevDesc);
      setMetaContent('meta[property="og:title"]', "property", "og:title", prevOgTitle);
      setMetaContent('meta[property="og:description"]', "property", "og:description", prevOgDesc);
      setMetaContent('meta[property="og:url"]', "property", "og:url", prevOgUrl);
      setMetaContent('meta[name="twitter:title"]', "name", "twitter:title", prevTwTitle);
      setMetaContent('meta[name="twitter:description"]', "name", "twitter:description", prevTwDesc);
      if (canonicalLink && prevCanonical) canonicalLink.href = prevCanonical;
    };
  }, [title, description]);
}
