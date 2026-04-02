import { useEffect } from "react";

const DEFAULT_DESCRIPTION =
  "DefenseEye.ai's CMMC Lens automates CMMC 2.0 compliance readiness for DoD contractors. AI-driven evidence collection, NIST 800-171 assessment mapping, SPRS score improvement, and continuous monitoring. Reduce documentation time by 80%.";

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
