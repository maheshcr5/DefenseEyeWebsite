import { ROUTE_SCHEMA_SCRIPT_ID, buildRouteSchemas, getSeoRoute } from "@shared/seoRoutes";
export { ROUTE_SCHEMA_SCRIPT_ID };

export function upsertRouteStructuredData(routePath: string, doc: Document = document) {
  const route = getSeoRoute(routePath);
  if (!route) return null;

  doc.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    if (script.id !== ROUTE_SCHEMA_SCRIPT_ID) {
      script.remove();
    }
  });

  let script = doc.getElementById(ROUTE_SCHEMA_SCRIPT_ID) as HTMLScriptElement | null;
  if (!script) {
    script = doc.createElement("script");
    script.id = ROUTE_SCHEMA_SCRIPT_ID;
    script.type = "application/ld+json";
    doc.head.appendChild(script);
  }

  script.dataset.routePath = route.path;
  script.text = JSON.stringify(buildRouteSchemas(route));
  return script;
}

export function installRouteStructuredData(routePath: string, doc: Document = document) {
  const route = getSeoRoute(routePath);
  if (!route) return () => undefined;

  let disposed = false;
  let pendingSync: number | undefined;
  const scheduledSyncs: number[] = [];

  const sync = () => {
    if (disposed) return;
    upsertRouteStructuredData(route.path, doc);
  };

  sync();

  const scheduleSync = () => {
    if (disposed || typeof window === "undefined") return;
    if (pendingSync) window.clearTimeout(pendingSync);
    pendingSync = window.setTimeout(() => {
      pendingSync = undefined;
      sync();
    }, 0);
  };

  const observer = typeof MutationObserver !== "undefined" ? new MutationObserver(scheduleSync) : null;
  observer?.observe(doc.head, { childList: true });

  if (typeof window !== "undefined") {
    [50, 250, 1000].forEach((delay) => {
      scheduledSyncs.push(window.setTimeout(sync, delay));
    });
  }

  return () => {
    disposed = true;
    observer?.disconnect();
    if (pendingSync) window.clearTimeout(pendingSync);
    scheduledSyncs.forEach((timer) => window.clearTimeout(timer));
  };
}
