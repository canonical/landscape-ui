import fs from "fs";
import {
  canonicalizeMswPath,
  classifyBackend,
  patternToRegExp,
} from "../matcher";
import { MANIFEST_PATH } from "../paths";
import type { ContractSource, RouteDefinition } from "../types";

interface ManifestEntry {
  method: string;
  path: string;
  isRegExpPath: boolean;
}

/**
 * Connector for the MSW handler manifest dumped during the test run. For the
 * unspecced Python v2 API this is the best machine-readable contract that
 * exists; for the Go API it is the mocks' view (the OpenAPI connector
 * out-prioritizes it in the composite).
 *
 * The v1 catch-all handlers (path === "/api/") are skipped here — v1 routes
 * are identified by RPC action, handled by the v1-actions connector.
 */
export function createMswHandlerSource(
  manifestPath: string = MANIFEST_PATH,
): ContractSource {
  const routes: { definition: RouteDefinition; regExp: RegExp }[] = [];

  // Existence is guarded by the aggregator CLI before any source is built.
  const entries = JSON.parse(
    fs.readFileSync(manifestPath, "utf-8"),
  ) as ManifestEntry[];

  const seen = new Set<string>();
  for (const entry of entries) {
    if (entry.isRegExpPath) continue;

    const pathname = entry.path.replace(/\/$/, "");
    if (pathname === "/api") continue;

    const pattern = canonicalizeMswPath(pathname);
    const method = entry.method.toUpperCase();
    const id = `${method} ${pattern}`;
    if (seen.has(id)) continue;
    seen.add(id);

    routes.push({
      definition: {
        id,
        method,
        pattern,
        backend: classifyBackend(pattern),
        source: "msw-handlers",
      },
      regExp: patternToRegExp(pattern),
    });
  }

  return {
    name: "msw-handlers",
    listRoutes: () => routes.map((route) => route.definition),
    match: (method, url) => {
      const pathname = url.pathname.replace(/\/$/, "");
      for (const route of routes) {
        if (route.definition.method !== method) continue;
        if (route.regExp.test(pathname)) return route.definition;
      }
      return null;
    },
  };
}