import path from "path";

const TESTS_DIR = path.resolve(import.meta.dirname, "..");

/** Raw traffic log, appended by every vitest worker (see setup.ts). */
export const REGISTRY_PATH = path.join(TESTS_DIR, "msw-api-registry.jsonl");

/**
 * Declared MSW handler patterns, dumped during the test run (see setup.ts).
 * Needed because the handler modules read import.meta.env and therefore cannot
 * be imported by the aggregator CLI outside of Vite/Vitest.
 */
export const MANIFEST_PATH = path.join(TESTS_DIR, "msw-handlers-manifest.json");

/** Aggregated coverage report produced by aggregate-coverage.ts. */
export const REPORT_PATH = path.join(TESTS_DIR, "msw-contract-coverage.json");

/** Handler sources, scanned for v1 RPC action names. */
export const HANDLERS_DIR = path.join(TESTS_DIR, "server", "handlers");
