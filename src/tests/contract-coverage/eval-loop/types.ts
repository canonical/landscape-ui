import type { Backend } from "../types";

/**
 * Shared shapes for the agentic evaluation loop. Validation is hand-rolled
 * (no zod — see plan Scope) via assert* functions that throw an Error naming
 * the offending field path. Unknown extra fields are tolerated everywhere.
 */

export interface ContractExample {
  status: number;
  requestPayload: unknown;
  responsePayload: unknown;
}

/** Subset of aggregate.ts RouteMetrics the eval loop consumes. */
export interface RouteMetricsSubset {
  method: string;
  pattern: string;
  backend: Backend;
  source: string;
  totalHits: number;
  statuses: Record<string, number>;
  contracts?: ContractExample[];
}

/** Mirrors contract-coverage/aggregate.ts CoverageReport (all six fields). */
export interface CoverageReport {
  generatedAt: string;
  summary: {
    totalInteractionsLogged: number;
    routesExercised: number;
    routesDeclared: number;
    byBackend: Record<string, { declared: number; exercised: number }>;
  };
  routes: Record<string, RouteMetricsSubset>;
  unexercised: { id: string; backend: Backend; source: string }[];
  drift: { id: string; backend: Backend; source: string; totalHits: number }[];
  migration: unknown[];
  warnings: string[];
}

export interface GapEntry {
  /** Key of CoverageReport.routes, e.g. "POST /api/v2/mirrors". */
  routeId: string;
  method: string;
  pattern: string;
  backend: Backend;
  totalHits: number;
  statuses: Record<string, number>;
  contracts?: ContractExample[];
  rank: number;
}

export interface GapsFile {
  generatedAt: string;
  stats: {
    routesExercised: number;
    specCallsExtracted: number;
    gapsFound: number;
  };
  gaps: GapEntry[];
  /** report.unexercised verbatim — informational only, NEVER sent to the LLM. */
  unexercisedInfo: CoverageReport["unexercised"];
  extractionWarnings: string[];
}

export interface Suggestion {
  route: string;
  title: string;
  rationale: string;
  spec: string;
  notes: string;
}

export interface SuggestionsResponse {
  suggestions: Suggestion[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expectRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`${path}: expected an object`);
  }
  return value;
}

function expectString(value: unknown, path: string): void {
  if (typeof value !== "string") {
    throw new Error(`${path}: expected a string`);
  }
}

function expectNumber(value: unknown, path: string): void {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${path}: expected a number`);
  }
}

function expectArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${path}: expected an array`);
  }
  return value;
}

const BACKENDS = new Set(["v1", "v2", "go", "unknown"]);

function expectBackend(value: unknown, path: string): void {
  if (typeof value !== "string" || !BACKENDS.has(value)) {
    throw new Error(`${path}: expected one of v1|v2|go|unknown`);
  }
}

function expectStatuses(value: unknown, path: string): void {
  const record = expectRecord(value, path);
  for (const [status, count] of Object.entries(record)) {
    expectNumber(count, `${path}.${status}`);
  }
}

function expectRouteMetrics(value: unknown, routeId: string): void {
  const route = expectRecord(value, `routes["${routeId}"]`);
  expectString(route.method, `routes["${routeId}"].method`);
  expectString(route.pattern, `routes["${routeId}"].pattern`);
  expectBackend(route.backend, `routes["${routeId}"].backend`);
  expectString(route.source, `routes["${routeId}"].source`);
  expectNumber(route.totalHits, `routes["${routeId}"].totalHits`);
  expectStatuses(route.statuses, `routes["${routeId}"].statuses`);
  if (route.contracts !== undefined) {
    for (const [index, contract] of expectArray(
      route.contracts,
      `routes["${routeId}"].contracts`,
    ).entries()) {
      const entry = expectRecord(
        contract,
        `routes["${routeId}"].contracts[${index}]`,
      );
      expectNumber(
        entry.status,
        `routes["${routeId}"].contracts[${index}].status`,
      );
    }
  }
}

export function assertCoverageReport(
  value: unknown,
): asserts value is CoverageReport {
  const report = expectRecord(value, "report");
  expectString(report.generatedAt, "report.generatedAt");
  const summary = expectRecord(report.summary, "report.summary");
  expectNumber(summary.totalInteractionsLogged, "report.summary.totalInteractionsLogged");
  expectNumber(summary.routesExercised, "report.summary.routesExercised");
  expectNumber(summary.routesDeclared, "report.summary.routesDeclared");
  expectRecord(summary.byBackend, "report.summary.byBackend");
  const routes = expectRecord(report.routes, "report.routes");
  for (const [routeId, route] of Object.entries(routes)) {
    expectRouteMetrics(route, routeId);
  }
  expectArray(report.unexercised, "report.unexercised");
  expectArray(report.drift, "report.drift");
  expectArray(report.migration, "report.migration");
  expectArray(report.warnings, "report.warnings");
}

export function assertGapsFile(value: unknown): asserts value is GapsFile {
  const file = expectRecord(value, "gapsFile");
  expectString(file.generatedAt, "gapsFile.generatedAt");
  const stats = expectRecord(file.stats, "gapsFile.stats");
  expectNumber(stats.routesExercised, "gapsFile.stats.routesExercised");
  expectNumber(stats.specCallsExtracted, "gapsFile.stats.specCallsExtracted");
  expectNumber(stats.gapsFound, "gapsFile.stats.gapsFound");
  for (const [index, gap] of expectArray(file.gaps, "gapsFile.gaps").entries()) {
    const entry = expectRecord(gap, `gapsFile.gaps[${index}]`);
    expectString(entry.routeId, `gapsFile.gaps[${index}].routeId`);
    expectString(entry.method, `gapsFile.gaps[${index}].method`);
    expectString(entry.pattern, `gapsFile.gaps[${index}].pattern`);
    expectBackend(entry.backend, `gapsFile.gaps[${index}].backend`);
    expectNumber(entry.totalHits, `gapsFile.gaps[${index}].totalHits`);
    expectStatuses(entry.statuses, `gapsFile.gaps[${index}].statuses`);
    expectNumber(entry.rank, `gapsFile.gaps[${index}].rank`);
  }
  expectArray(file.unexercisedInfo, "gapsFile.unexercisedInfo");
  expectArray(file.extractionWarnings, "gapsFile.extractionWarnings");
}

export function assertSuggestionsResponse(
  value: unknown,
): asserts value is SuggestionsResponse {
  const response = expectRecord(value, "suggestionsResponse");
  const suggestions = expectArray(
    response.suggestions,
    "suggestionsResponse.suggestions",
  );
  if (suggestions.length > 5) {
    throw new Error("suggestionsResponse.suggestions: expected at most 5 items");
  }
  for (const [index, suggestion] of suggestions.entries()) {
    const entry = expectRecord(
      suggestion,
      `suggestionsResponse.suggestions[${index}]`,
    );
    for (const field of ["route", "title", "rationale", "spec", "notes"]) {
      expectString(
        entry[field],
        `suggestionsResponse.suggestions[${index}].${field}`,
      );
    }
  }
}
