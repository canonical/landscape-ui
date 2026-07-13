/**
 * The three API generations the frontend talks to:
 * - v1: legacy Python RPC API (`/api/?action=...`), route identity = action name
 * - v2: current Python REST API (`/api/v2/...`)
 * - go: new Go services (`/debarchive/v1beta1/...`), specced by
 *   `@canonical/landscape-openapi`
 */
export type Backend = "v1" | "v2" | "go" | "unknown";

/** One intercepted request/response pair from the JSONL registry. */
export interface Observation {
  method: string;
  url: string;
  status: number;
  requestPayload: unknown;
  responsePayload: unknown;
}

export interface RouteDefinition {
  /** Canonical identity, e.g. "GET /debarchive/v1beta1/mirrors/{mirrorId}". */
  id: string;
  method: string;
  /** Canonical path pattern using {param} placeholders; {param...} may span segments. */
  pattern: string;
  backend: Backend;
  /** Which connector declared/resolved this route. */
  source: string;
}

/**
 * A pluggable contract connector. Implementations exist for the MSW handler
 * manifest, the Go OpenAPI spec, and v1 RPC actions; a heuristic fallback
 * catches everything else. A future real-BE contract (e.g. a specced Python
 * API) only needs to implement this interface to join the composite.
 */
export interface ContractSource {
  name: string;
  /** The declared route universe (used for unexercised-route detection). */
  listRoutes(): RouteDefinition[];
  /** Resolve observed traffic to a declared route, or null if not ours. */
  match(method: string, url: URL): RouteDefinition | null;
}