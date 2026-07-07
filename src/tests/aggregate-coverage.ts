import fs from "fs";
import path from "path";
import crypto from "crypto";

const INPUT_PATH = path.resolve(import.meta.dirname, "msw-api-registry.jsonl");
const OUTPUT_PATH = path.resolve(
  import.meta.dirname,
  "msw-contract-coverage.json",
);

interface TrafficMetrics {
  totalHits: number;
  statuses: Record<number, number>;
  // Only populated for state-mutating requests (POST, PUT, PATCH)
  contracts?: {
    status: number;
    requestHash?: string;
    responseHash?: string;
    requestPayload: unknown;
    responsePayload: unknown;
  }[];
}

interface ContractCoverageReport {
  generatedAt: string;
  summary: {
    totalInteractionsLogged: number;
    uniqueRoutesFound: number;
  };
  routes: Record<string, Record<string, TrafficMetrics>>;
}

/**
 * Heuristically converts raw execution URLs into normalized route patterns
 * Strips query params, collapses UUIDs, hex values, and dynamic path slugs.
 */
function normalizeRoute(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    let { pathname } = url;

    // 1. Standardize trailing slashes
    if (pathname.endsWith("/") && pathname.length > 1) {
      pathname = pathname.slice(0, -1);
    }

    // 2. Normalize standard UUIDs -> :id
    pathname = pathname.replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      "/:id",
    );

    // 3. Normalize known dynamic REST subpaths (e.g., /mirrors/third-party-mirror -> /mirrors/:id)
    const dynamicParents = [
      "mirrors",
      "operations",
      "computers",
      "instances",
      "users",
      "repository",
    ];
    dynamicParents.forEach((parent) => {
      const regex = new RegExp(`(?<=\\/${parent}\\/)[^\\/]+`, "g");
      pathname = pathname.replace(regex, ":id");
    });

    // 4. Clean up trailing alphanumeric hashes/slugs with hyphens (e.g., mirror-ffff-llll-dddd)
    pathname = pathname.replace(/\/[a-z0-9]+-[a-z0-9-]+/gi, "/:id");

    return pathname;
  } catch {
    // Fixed: Handled potential undefined element accessor under strict noUncheckedIndexedAccess rule
    return rawUrl.split("?")[0] ?? rawUrl;
  }
}

/**
 * Generates a deterministic hash of payload structures to detect true mutations
 */
// Fixed: Swapped explicit 'any' out for 'unknown'
function hashPayload(payload: unknown): string {
  if (!payload) return "empty";
  const str = typeof payload === "string" ? payload : JSON.stringify(payload);
  return crypto.createHash("sha1").update(str).digest("hex");
}

function generateReport() {
  if (!fs.existsSync(INPUT_PATH)) {
    console.error(
      `[-] No registry file found at ${INPUT_PATH}. Ensure tests ran successfully.`,
    );
    process.exit(1);
  }

  const fileContent = fs.readFileSync(INPUT_PATH, "utf-8");
  const lines = fileContent.split("\n").filter(Boolean);

  const report: ContractCoverageReport = {
    generatedAt: new Date().toISOString(),
    summary: { totalInteractionsLogged: lines.length, uniqueRoutesFound: 0 },
    routes: {},
  };

  for (const line of lines) {
    try {
      const log = JSON.parse(line) as {
        url: string;
        method: string;
        type: string;
        status: number;
        requestPayload: unknown;
        responsePayload: unknown;
      };

      const route = normalizeRoute(log.url);
      const method = log.method.toUpperCase();

      // Initialize route map block safely for Record styles
      if (!report.routes[route]) {
        report.routes[route] = {};
      }

      const routeMethods = report.routes[route];
      if (!routeMethods) continue;

      if (!routeMethods[method]) {
        const baseMetric: TrafficMetrics = {
          totalHits: 0,
          statuses: {},
        };
        // Initialize dynamic payload tracking for writing endpoints
        if (["POST", "PUT", "PATCH"].includes(method)) {
          baseMetric.contracts = [];
        }
        routeMethods[method] = baseMetric;
      }

      const metric = routeMethods[method];
      if (!metric) continue;

      // Update counters
      metric.totalHits++;
      metric.statuses[log.status] = (metric.statuses[log.status] ?? 0) + 1;

      // Handle contract payload deduplication for mutations
      if (metric.contracts) {
        const reqHash = hashPayload(log.requestPayload);
        const resHash = hashPayload(log.responsePayload);

        const structureExists = metric.contracts.some(
          (c) =>
            c.status === log.status &&
            c.requestHash === reqHash &&
            c.responseHash === resHash,
        );

        if (!structureExists) {
          metric.contracts.push({
            status: log.status,
            requestHash: reqHash,
            responseHash: resHash,
            requestPayload: log.requestPayload,
            responsePayload: log.responsePayload,
          });
        }
      }
    } catch {
      // Gracefully handle potentially corrupted/half-written JSONL lines
      continue;
    }
  }

  // Before writing to disk, strip the tracking hashes to optimize file size
  Object.values(report.routes).forEach((methods) => {
    Object.values(methods).forEach((metric) => {
      if (metric.contracts) {
        metric.contracts = metric.contracts.map((contract) => {
          const cleanContract = { ...contract };
          delete cleanContract.requestHash;
          delete cleanContract.responseHash;
          return cleanContract;
        });
      }
    });
  });

  report.summary.uniqueRoutesFound = Object.keys(report.routes).length;

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.warn(
    `[+] Token-optimized contract report compiled successfully to: ${OUTPUT_PATH}`,
  );
}

generateReport();
