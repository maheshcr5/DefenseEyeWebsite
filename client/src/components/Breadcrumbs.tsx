/*
 * Breadcrumbs — visible trail from Home to the current page, following the hub
 * structure in shared/siteArchitecture.ts. The same trail is emitted as
 * BreadcrumbList structured data by shared/seoRoutes.ts.
 */

import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { getBreadcrumbTrail, getRouteName } from "@shared/siteArchitecture";

// These pages render their own breadcrumb.
function hasOwnBreadcrumb(path: string) {
  return path === "/" || path.startsWith("/knowledge-hub") || path.startsWith("/blog");
}

export default function Breadcrumbs() {
  const [location] = useLocation();
  const path = location.replace(/\/+$/, "") || "/";
  if (hasOwnBreadcrumb(path) || !getRouteName(path)) return null;

  const trail = getBreadcrumbTrail(path);
  return (
    <nav aria-label="Breadcrumb" className="section-light bg-white border-b border-gray-200">
      <ol className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-600">
        {trail.map((item, index) => {
          const isCurrent = index === trail.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400" aria-hidden="true" />}
              {isCurrent ? (
                <span aria-current="page" className="text-gray-900 font-medium">{item.label}</span>
              ) : (
                <a href={item.href} className="hover:text-primary hover:underline">{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
