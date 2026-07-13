import type { Backend } from "./types";

/**
 * Classifies a pathname into an API generation by prefix. Order matters:
 * /api/v2 must be tested before the /api catch-all.
 */
export function classifyBackend(pathname: string): Backend {
  if (pathname.startsWith("/debarchive/")) return "go";
  if (pathname === "/api/v2" || pathname.startsWith("/api/v2/")) return "v2";
  if (pathname === "/api" || pathname.startsWith("/api/")) return "v1";
  return "unknown";
}

function escapeRegExp(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Compiles a canonical pattern into a matching RegExp.
 * - "{param}" matches one path segment (never crosses "/" or ":")
 * - "{param...}" matches across segments (gRPC resource names like
 *   "operations/mirror-abc/123") but still stops at a ":verb" suffix
 * - everything else, including ":verb" custom-method suffixes, is literal
 */
export function patternToRegExp(pattern: string): RegExp {
  let compiled = "";
  let lastIndex = 0;
  const params = /\{([^}]+)\}/g;
  let match = params.exec(pattern);
  while (match !== null) {
    compiled += escapeRegExp(pattern.slice(lastIndex, match.index));
    compiled += match[1]?.endsWith("...") ? "[^:]+" : "[^/:]+";
    lastIndex = match.index + match[0].length;
    match = params.exec(pattern);
  }
  compiled += escapeRegExp(pattern.slice(lastIndex));
  return new RegExp(`^${compiled}$`);
}

/**
 * Erases parameter names so structurally identical routes declared by
 * different connectors (e.g. MSW's "{mirrorId}" vs OpenAPI's "{name_1}")
 * deduplicate to the same signature.
 */
export function structuralSignature(method: string, pattern: string): string {
  return `${method} ${pattern.replace(/\{[^}]*\.\.\.\}/g, "{...}").replace(/\{[^}]+\}/g, "{}")}`;
}

/**
 * Converts an MSW handler path (path-to-regexp dialect) into the canonical
 * form: ":param" (only valid right after "/") becomes "{param}", and "\:verb"
 * escapes become literal ":verb" custom-method suffixes.
 */
export function canonicalizeMswPath(mswPath: string): string {
  return mswPath
    .split("\\:")
    .map((part) => part.replace(/(?<=\/):([A-Za-z0-9_]+)/g, "{$1}"))
    .join(":");
}