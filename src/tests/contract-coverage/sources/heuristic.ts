import { classifyBackend } from "../matcher";
import type { ContractSource } from "../types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Last-resort connector for traffic no declared contract matched. It guesses
 * a route pattern from the URL shape (UUID and numeric segments -> {id}),
 * and everything it emits is labeled source: "heuristic" so guesses are never
 * mistaken for contract-backed routes. It declares no universe of its own.
 */
export function createHeuristicSource(): ContractSource {
  return {
    name: "heuristic",
    listRoutes: () => [],
    match: (method, url) => {
      let { pathname } = url;
      if (pathname.endsWith("/") && pathname.length > 1) {
        pathname = pathname.slice(0, -1);
      }

      // Preserve gRPC-style custom verbs (/publications/{id}:publish)
      let verb = "";
      const colonIndex = pathname.lastIndexOf(":");
      if (colonIndex > pathname.lastIndexOf("/")) {
        verb = pathname.slice(colonIndex);
        pathname = pathname.slice(0, colonIndex);
      }

      const segments = pathname.split("/");
      const pattern =
        segments
          .map((segment) => {
            if (UUID_RE.test(segment)) return "{id}";
            if (/^\d+$/.test(segment)) return "{id}";
            return segment;
          })
          .join("/") + verb;

      return {
        id: `${method} ${pattern}`,
        method,
        pattern,
        backend: classifyBackend(url.pathname),
        source: "heuristic",
      };
    },
  };
}
