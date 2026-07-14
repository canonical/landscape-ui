import fs from "fs";
import { buildReport } from "./contract-coverage/aggregate";
import { MIGRATION_MAP } from "./contract-coverage/migration-map";
import {
  MANIFEST_PATH,
  REGISTRY_PATH,
  REPORT_PATH,
} from "./contract-coverage/paths";
import { createHeuristicSource } from "./contract-coverage/sources/heuristic";
import { createMswHandlerSource } from "./contract-coverage/sources/msw";
import { createOpenApiSource } from "./contract-coverage/sources/openapi";
import { createV1ActionSource } from "./contract-coverage/sources/v1-actions";
import type { Observation } from "./contract-coverage/types";

// The Go debarchive service is mounted under this prefix in front of the
// spec's own /v1beta1 (VITE_API_URL_DEB_ARCHIVE = /debarchive/v1beta1/).
const DEB_ARCHIVE_MOUNT = "/debarchive";

// Both inputs are produced by the test run: the registry by the traffic
// recorder, the manifest by the handler dump (see setup.ts).
const missingInputs = [REGISTRY_PATH, MANIFEST_PATH].filter(
  (file) => !fs.existsSync(file),
);
if (missingInputs.length > 0) {
  for (const file of missingInputs) {
    console.error(`[-] Missing generated input: ${file}`);
  }
  console.error(`    Run the test suite first: pnpm vitest run`);
  process.exit(1);
}

const observations: Observation[] = [];
for (const line of fs.readFileSync(REGISTRY_PATH, "utf-8").split("\n")) {
  if (!line) continue;
  try {
    observations.push(JSON.parse(line) as Observation);
  } catch {
    // Tolerate corrupted/half-written JSONL lines
    continue;
  }
}

// Contract connectors in priority order: the real BE contract wins where it
// exists; mocks are the best-available contract elsewhere; heuristic guesses
// are last and labeled as such. A future specced Python API slots in here.
const sources = [
  createOpenApiSource(DEB_ARCHIVE_MOUNT),
  createV1ActionSource(),
  createMswHandlerSource(),
  createHeuristicSource(),
];

const report = buildReport(observations, sources, MIGRATION_MAP);

fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");

const { summary } = report;
console.warn(`[+] Contract coverage report written to: ${REPORT_PATH}`);
console.warn(
  `    ${summary.totalInteractionsLogged} interactions -> ${summary.routesExercised} routes exercised, ` +
    `${summary.routesDeclared} declared, ${report.unexercised.length} unexercised, ${report.drift.length} drift`,
);
for (const backend of ["v1", "v2", "go"] as const) {
  const { declared, exercised } = summary.byBackend[backend];
  console.warn(`    ${backend}: ${exercised} exercised / ${declared} declared`);
}
for (const warning of report.warnings) {
  console.warn(`[!] ${warning}`);
}