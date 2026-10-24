/*
 * RelatedResources — contextual links for the current page from
 * shared/relatedLinks.ts, so visitors (and crawlers that render JavaScript)
 * see the same related pages as the server-rendered fallback.
 */

import { useLocation } from "wouter";
import { getRelatedLinks } from "@shared/relatedLinks";
import type { ArchitectureLink } from "@shared/siteArchitecture";

type RelatedResourcesProps = {
  /** Links the page already shows; they are listed first and not repeated. */
  extraLinks?: ArchitectureLink[];
  title?: string;
  className?: string;
};

export default function RelatedResources({ extraLinks = [], title = "Related DefenseEye resources", className = "" }: RelatedResourcesProps) {
  const [location] = useLocation();
  const seen = new Set<string>();
  const links = [...extraLinks, ...getRelatedLinks(location)].filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
  if (links.length === 0) return null;

  return (
    <section className={className} aria-labelledby="related-resources-heading">
      <h2 id="related-resources-heading" className="font-heading text-2xl font-bold text-foreground mb-5">{title}</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group bg-card/50 border border-border/40 rounded-sm p-4 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          >
            <span className="text-sm font-semibold text-primary group-hover:text-primary/80">{link.label}</span>
            {link.description && <p className="text-sm text-muted-foreground leading-relaxed mt-2">{link.description}</p>}
          </a>
        ))}
      </div>
    </section>
  );
}
