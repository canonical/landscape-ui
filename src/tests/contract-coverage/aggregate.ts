import crypto from "crypto";
import { structuralSignature } from "./matcher";
import type { MigrationMapEntry } from "./migration-map";
import type {
  Backend,
  ContractSource,
  Observation,
  RouteDefinition,
} from "./types";

interface ContractExample {
  status: number;
  requestHash?: string;
  responseHash?: string;
  requestPayload: unknown;
  responsePayload: unknown;
}

export interface RouteMetrics {
  method: string;
  pattern: string;
  backend: Backend;
  source: string;
  totalHits: number;
  statuses: Record<number, number>;
  // Only populated for state-mutating requests (POST, PUT, PATCH)
  contracts?: ContractExample[];
}

type MigrationLayer = "v1" | "v2" | "go";

interface MigrationLayerStatus {
  routeId: string;
  declared: boolean;
  totalHits: number;
}

export interface CoverageReport {
  generatedAt: string;
  summary: {
    totalInteractionsLogged: number;
    routesExercised: number;
    routesDeclared: number;
    byBackend: Record<Backend, { declared: number; exercised: number }>;
  };
  /** Exercised routes keyed by canonical route id. */
  routes: Record<string, RouteMetrics>;
  /** Declared in a contract, zero traffic — the coverage gaps. */
  unexercised: { id: string; backend: Backend; source: string }[];
  /** Observed traffic no contract declares — guesses and undeclared actions. */
  drift: { id: string; backend: Backend; source: string; totalHits: number }[];
  /** Hand-maintained cross-generation equivalences with live traffic status. */
  migration: {
    name: string;
    notes?: string;
    layers: Partial<Record<MigrationLayer, MigrationLayerStatus>>;
  }[];
  warnings: string[];
}

function hashPayload(payload: unknown): string {
  if (!payload) return "empty";
  const str = typeof payload === "string" ? payload : JSON.stringify(payload);
  return crypto.createHash("sha1").update(str).digest("hex");
}

const MUTATING_METHODS = ["POST", "PUT", "PATCH"];
const BACKENDS: Backend[] = ["v1", "v2", "go", "unknown"];

/**
 * Pure aggregation: resolves every observation against the connectors in
 * priority order and derives the covered / unexercised / drift triad plus
 * migration-map status. Knows nothing about where contracts come from.
 */
export function buildReport(
  observations: Observation[],
  sources: ContractSource[],
  migrationMap: MigrationMapEntry[],
): CoverageReport {
  const warnings: string[] = [];

  // Declared universe, deduplicated structurally across connectors so e.g.
  // OpenAPI's {name_1} and MSW's {mirrorId} count as one route (the
  // higher-priority connector wins).
  const declared = new Map<string, RouteDefinition>();
  const signatureToId = new Map<string, string>();
  for (const source of sources) {
    for (const route of source.listRoutes()) {
      const signature = structuralSignature(route.method, route.pattern);
      if (signatureToId.has(signature)) continue;
      signatureToId.set(signature, route.id);
      declared.set(route.id, route);
    }
  }

  const routes: Record<string, RouteMetrics> = {};

  const resolve = (observation: Observation): RouteDefinition | null => {
    const url = new URL(observation.url);
    const method = observation.method.toUpperCase();
    for (const source of sources) {
      const route = source.match(method, url);
      if (route) return route;
    }
    return null;
  };

  for (const observation of observations) {
    const matched = resolve(observation);
    if (!matched) continue;

    // Map structurally-equal matches from lower-priority connectors onto the
    // canonical (winning) route id.
    const signature = structuralSignature(matched.method, matched.pattern);
    const canonicalId = signatureToId.get(signature) ?? matched.id;
    const route = declared.get(canonicalId) ?? matched;

    const metric = (routes[route.id] ??= {
      method: route.method,
      pattern: route.pattern,
      backend: route.backend,
      source: route.source,
      totalHits: 0,
      statuses: {},
      ...(MUTATING_METHODS.includes(route.method) ? { contracts: [] } : {}),
    });

    metric.totalHits++;
    metric.statuses[observation.status] =
      (metric.statuses[observation.status] ?? 0) + 1;

    if (metric.contracts) {
      const requestHash = hashPayload(observation.requestPayload);
      const responseHash = hashPayload(observation.responsePayload);
      const exists = metric.contracts.some(
        (contract) =>
          contract.status === observation.status &&
          contract.requestHash === requestHash &&
          contract.responseHash === responseHash,
      );
      if (!exists) {
        metric.contracts.push({
          status: observation.status,
          requestHash,
          responseHash,
          requestPayload: observation.requestPayload,
          responsePayload: observation.responsePayload,
        });
      }
    }
  }

  // Strip the tracking hashes before writing to keep the report compact.
  for (const metric of Object.values(routes)) {
    metric.contracts = metric.contracts?.map(
      ({ requestHash: _requestHash, responseHash: _responseHash, ...rest }) =>
        rest,
    );
  }

  const unexercised = [...declared.values()]
    .filter((route) => !routes[route.id])
    .map((route) => ({
      id: route.id,
      backend: route.backend,
      source: route.source,
    }));

  const drift = Object.entries(routes)
    .filter(
      ([, metric]) =>
        metric.source === "heuristic" || metric.source === "observed-only",
    )
    .map(([id, metric]) => ({
      id,
      backend: metric.backend,
      source: metric.source,
      totalHits: metric.totalHits,
    }));

  const migration = migrationMap.map((entry) => {
    const layers: Partial<Record<MigrationLayer, MigrationLayerStatus>> = {};
    for (const layer of ["v1", "v2", "go"] as const) {
      const routeId = entry[layer];
      if (!routeId) continue;
      const isDeclared = declared.has(routeId);
      const totalHits = routes[routeId]?.totalHits ?? 0;
      if (!isDeclared && totalHits === 0) {
        warnings.push(
          `Migration map entry "${entry.name}": route id "${routeId}" (${layer}) matches no declared or observed route — possible typo.`,
        );
      }
      layers[layer] = { routeId, declared: isDeclared, totalHits };
    }
    return { name: entry.name, notes: entry.notes, layers };
  });

  const byBackend = Object.fromEntries(
    BACKENDS.map((backend) => [
      backend,
      {
        declared: [...declared.values()].filter((r) => r.backend === backend)
          .length,
        exercised: Object.values(routes).filter((m) => m.backend === backend)
          .length,
      },
    ]),
  ) as Record<Backend, { declared: number; exercised: number }>;

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalInteractionsLogged: observations.length,
      routesExercised: Object.keys(routes).length,
      routesDeclared: declared.size,
      byBackend,
    },
    routes,
    unexercised,
    drift,
    migration,
    warnings,
  };
}
