import { useEffect } from "react";

const DEFAULT_DESCRIPTION =
  "DefenseEye helps organizations adopt AI responsibly, improve AI governance, strengthen cybersecurity, automate compliance evidence, and increase audit readiness. CMMCLens is DefenseEye's flagship compliance intelligence platform.";

/**
 * Sets document.title and injects/updates <meta name="description">.
 * Reverts to site defaults on unmount so navigating between pages
 * never leaves stale values in <head>.
 */
export function useSeo(title: string, description: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = meta?.content ?? DEFAULT_DESCRIPTION;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.content = description;

    return () => {
      document.title = prev;
      const m = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (m) m.content = prevDesc;
    };
  }, [title, description]);
}
