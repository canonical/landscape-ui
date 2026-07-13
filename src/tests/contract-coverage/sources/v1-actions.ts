import fs from "fs";
import path from "path";
import { HANDLERS_DIR } from "../paths";
import type { ContractSource, RouteDefinition } from "../types";

/**
 * Connector for the legacy Python v1 RPC API. Requests all share the /api/
 * path — the route identity is the `action` query parameter, so path-pattern
 * matching cannot apply. The declared universe comes from scanning the MSW
 * handler sources for `isAction(request, "...")` dispatches, paired with the
 * enclosing `http.<method>(API_URL_OLD, ...)` call.
 */
export function createV1ActionSource(): ContractSource {
  const declared = new Map<string, RouteDefinition>();

  const defineAction = (method: string, action: string): RouteDefinition => ({
    id: `${method} /api/?action=${action}`,
    method,
    pattern: `/api/?action=${action}`,
    backend: "v1",
    source: "msw-actions",
  });

  for (const file of fs.readdirSync(HANDLERS_DIR)) {
    if (!file.endsWith(".ts")) continue;
    const content = fs.readFileSync(path.join(HANDLERS_DIR, file), "utf-8");

    // Each chunk after a split starts with the handler's method name and
    // spans until the next `http.` call, so an `isAction` found in a chunk
    // belongs to that handler. No "(" in the split — handlers may carry
    // type generics between the method name and the call parenthesis.
    const chunks = content.split(/http\.(get|post|put|patch|delete|all)\b/);
    for (let i = 1; i < chunks.length - 1; i += 2) {
      const method = chunks[i]?.toUpperCase();
      const body = chunks[i + 1];
      if (!method || !body || !body.includes("API_URL_OLD")) continue;

      // Both dispatch forms: isAction(request, "X") and isAction(request, ["X", "Y"])
      const calls = body.matchAll(
        /isAction\(\s*\w+\s*,\s*(?:"([A-Za-z0-9]+)"|\[([^\]]*)\])/g,
      );
      for (const call of calls) {
        const actions = call[1]
          ? [call[1]]
          : [...(call[2] ?? "").matchAll(/"([A-Za-z0-9]+)"/g)].map((m) => m[1]);
        for (const action of actions) {
          if (!action) continue;
          declared.set(`${method} ${action}`, defineAction(method, action));
        }
      }
    }
  }

  return {
    name: "v1-actions",
    listRoutes: () => [...declared.values()],
    match: (method, url) => {
      const pathname = url.pathname.replace(/\/$/, "");
      if (pathname !== "/api") return null;
      const action = url.searchParams.get("action");
      if (!action) return null;

      // Undeclared actions are still claimed (they are unambiguously v1
      // traffic) but labeled so they show up in the drift report.
      return (
        declared.get(`${method} ${action}`) ?? {
          ...defineAction(method, action),
          source: "observed-only",
        }
      );
    },
  };
}