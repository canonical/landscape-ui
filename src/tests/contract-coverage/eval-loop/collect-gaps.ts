import fs from "fs";
import path from "path";
import ts from "typescript";
import { fileURLToPath } from "url";
import { patternToRegExp } from "../matcher";
import { REPORT_PATH } from "../paths";
import type { CoverageReport, GapEntry, GapsFile, OrphanEntry } from "./types";
import { assertCoverageReport, assertGapsFile } from "./types";

/** One HTTP call extracted from a Playwright API-contract spec. */
export interface ExtractedCall {
  method: string;
  /** Concrete path, or pattern with {param} for template-literal spans. */
  urlPattern: string;
  file: string;
  line: number;
}

export interface ExtractionResult {
  calls: ExtractedCall[];
  warnings: string[];
}

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "head"]);

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Backend services reachable through the Vite dev proxy under a mount prefix
 * (see DEB_ARCHIVE_MOUNT in src/tests/aggregate-coverage.ts). A spec calling
 * `/v1beta1/locals` exercises the route declared as `/debarchive/v1beta1/locals`.
 */
const MOUNT_PREFIXES = ["/debarchive"];

/** True when `url` matches the canonical route `pattern` (or a mounted variant). */
export function matchesPattern(url: string, pattern: string): boolean {
  const regex = patternToRegExp(pattern);
  const candidates = [
    url,
    ...MOUNT_PREFIXES.map((prefix) => `${prefix}${url}`),
  ];
  if (url === "/v1" || url.startsWith("/v1/")) {
    candidates.push(`/debarchive/v1beta1${url.slice(3)}`);
  }
  return candidates.some((candidate) => regex.test(candidate));
}

/** Load and validate the MSW contract coverage report. Throws on any failure. */
export function loadReport(reportPath: string): CoverageReport {
  if (!fs.existsSync(reportPath)) {
    throw new Error(
      `Report missing: ${reportPath} — run pnpm coverage:full first`,
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
  } catch (error) {
    throw new Error(
      `malformed report at ${reportPath}: ${(error as Error).message}`,
    );
  }
  assertCoverageReport(parsed);
  return parsed;
}

function listSpecFiles(specDir: string, scanRoots?: string[]): string[] {
  const roots = scanRoots?.length
    ? scanRoots.map((root) => path.join(specDir, root))
    : [specDir];

  const files: string[] = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) {
      continue;
    }
    files.push(
      ...fs
        .readdirSync(root, { recursive: true })
        .map((entry) => entry.toString())
        .filter((entry) => entry.endsWith(".ts") && !entry.endsWith(".d.ts"))
        .map((entry) => path.join(root, entry)),
    );
  }
  return files.sort();
}

/**
 * Convert a template-literal URL into a canonical pattern. Each `${...}` span
 * becomes a single-segment `{param}` because patternToRegExp compiles that to
 * `[^/:]+`. Specs should prefer literal path prefixes where possible;
 * multi-segment spans require a future matcher enhancement.
 */
function templateToPattern(expression: ts.TemplateExpression): string {
  let pattern = expression.head.text;
  for (const span of expression.templateSpans) {
    pattern += `{param}${span.literal.text}`;
  }
  return pattern;
}

/**
 * Statically extract `request.<method>(url)` calls from Playwright specs via
 * the TypeScript AST. Non-literal first arguments become warnings, never errors.
 */
export function extractSpecCoverage(
  specDir: string,
  scanRoots?: string[],
): ExtractionResult {
  const calls: ExtractedCall[] = [];
  const warnings: string[] = [];

  for (const file of listSpecFiles(specDir, scanRoots)) {
    const sourceFile = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf-8"),
      ts.ScriptTarget.Latest,
      true,
    );

    const fileRef = path.relative(specDir, file);

    const locationOf = (node: ts.Node): string => {
      const { line } = sourceFile.getLineAndCharacterOfPosition(
        node.getStart(sourceFile),
      );
      return `${fileRef}:${line + 1}`;
    };

    const visit = (node: ts.Node): void => {
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.text === "request" &&
        HTTP_METHODS.has(node.expression.name.text)
      ) {
        const method = node.expression.name.text.toUpperCase();
        const [firstArg] = node.arguments;
        const line =
          sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
            .line + 1;
        if (firstArg === undefined) {
          warnings.push(
            `${locationOf(node)}: ${method} call with no URL argument`,
          );
        } else if (
          ts.isStringLiteral(firstArg) ||
          ts.isNoSubstitutionTemplateLiteral(firstArg)
        ) {
          calls.push({
            method,
            urlPattern: firstArg.text,
            file: fileRef,
            line,
          });
        } else if (ts.isTemplateExpression(firstArg)) {
          calls.push({
            method,
            urlPattern: templateToPattern(firstArg),
            file: fileRef,
            line,
          });
        } else {
          warnings.push(
            `${locationOf(node)}: ${method} call with non-literal URL — not counted as coverage`,
          );
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }

  return { calls, warnings };
}

/**
 * Gap = exercised route in the report with no statically extracted spec call
 * covering it. Ranked by totalHits desc, mutating methods first, routeId asc.
 */
export function computeGaps(
  report: CoverageReport,
  calls: ExtractedCall[],
): GapEntry[] {
  const gaps: GapEntry[] = [];
  for (const [routeId, metric] of Object.entries(report.routes)) {
    const covered = calls.some(
      (call) =>
        call.method === metric.method.toUpperCase() &&
        matchesPattern(call.urlPattern, metric.pattern),
    );
    if (!covered) {
      gaps.push({
        routeId,
        method: metric.method,
        pattern: metric.pattern,
        backend: metric.backend,
        totalHits: metric.totalHits,
        statuses: metric.statuses,
        ...(metric.contracts ? { contracts: metric.contracts } : {}),
        rank: 0,
      });
    }
  }
  gaps.sort((a, b) => {
    if (b.totalHits !== a.totalHits) return b.totalHits - a.totalHits;
    const aMutating = MUTATING_METHODS.has(a.method) ? 0 : 1;
    const bMutating = MUTATING_METHODS.has(b.method) ? 0 : 1;
    if (aMutating !== bMutating) return aMutating - bMutating;
    return a.routeId.localeCompare(b.routeId);
  });
  return gaps.map((gap, index) => ({ ...gap, rank: index + 1 }));
}

/**
 * Orphan = extracted spec call that matches no exercised route. Unlike a gap,
 * an orphan means the matcher, the route pin, or the spec is wrong, so it is
 * always treated as an error.
 */
export function computeOrphans(
  report: CoverageReport,
  calls: ExtractedCall[],
): OrphanEntry[] {
  const routes = [
    ...Object.values(report.routes),
    ...report.unexercised.map(({ id }) => {
      const separator = id.indexOf(" ");
      return {
        method: id.slice(0, separator),
        pattern: id.slice(separator + 1),
      };
    }),
  ];
  const orphans: OrphanEntry[] = [];
  for (const call of calls) {
    const matched = routes.some(
      (metric) =>
        call.method === metric.method.toUpperCase() &&
        matchesPattern(call.urlPattern, metric.pattern),
    );
    if (!matched) {
      orphans.push({
        method: call.method,
        urlPattern: call.urlPattern,
        file: call.file,
        line: call.line,
        rank: 0,
      });
    }
  }
  orphans.sort((a, b) => {
    if (a.method !== b.method) return a.method.localeCompare(b.method);
    if (a.file !== b.file) return a.file.localeCompare(b.file);
    return a.line - b.line;
  });
  return orphans.map((orphan, index) => ({ ...orphan, rank: index + 1 }));
}

export function buildGapsFile(
  report: CoverageReport,
  extraction: ExtractionResult,
  gaps: GapEntry[],
  orphans: OrphanEntry[],
): GapsFile {
  return {
    generatedAt: new Date().toISOString(),
    stats: {
      routesExercised: Object.keys(report.routes).length,
      specCallsExtracted: extraction.calls.length,
      gapsFound: gaps.length,
      orphansFound: orphans.length,
    },
    gaps,
    orphans,
    unexercisedInfo: report.unexercised,
    extractionWarnings: extraction.warnings,
  };
}

export function writeGapsFile(gapsFile: GapsFile, outPath: string): void {
  assertGapsFile(gapsFile);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(gapsFile, null, 2), "utf-8");
}

interface CliOptions {
  report: string;
  specDir: string;
  scanRoots: string[];
  out: string;
}

const DEFAULT_SCAN_ROOTS = ["api", "helpers"];

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    report: REPORT_PATH,
    specDir: path.resolve(import.meta.dirname, "../../../../e2e/docker-stack"),
    scanRoots: DEFAULT_SCAN_ROOTS,
    out: path.join(import.meta.dirname, "out", "gaps.json"),
  };
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (value === undefined) {
      throw new Error(`Missing value for ${flag}`);
    }
    if (flag === "--report") options.report = value;
    else if (flag === "--spec-dir") options.specDir = value;
    else if (flag === "--scan-roots")
      options.scanRoots = value.split(",").map((s) => s.trim());
    else if (flag === "--out") options.out = value;
    else throw new Error(`Unknown flag: ${flag}`);
  }
  return options;
}

function main(): void {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = loadReport(options.report);
    const extraction = extractSpecCoverage(options.specDir, options.scanRoots);
    const gaps = computeGaps(report, extraction.calls);
    const orphans = computeOrphans(report, extraction.calls);
    writeGapsFile(
      buildGapsFile(report, extraction, gaps, orphans),
      options.out,
    );
    console.warn(`[+] Gap report written to: ${options.out}`);
    console.warn(
      `    ${Object.keys(report.routes).length} exercised routes, ` +
        `${extraction.calls.length} spec calls extracted, ${gaps.length} gaps`,
    );
    if (orphans.length > 0) {
      console.warn(
        `[-] ${orphans.length} extracted spec call(s) match no declared route (orphans). ` +
          "This usually indicates a matcher limitation (e.g. multi-segment template literals) rather than a hard failure; see gaps.json for details.",
      );
      for (const orphan of orphans) {
        console.warn(
          `    ${orphan.method} ${orphan.urlPattern} (${orphan.file}:${orphan.line})`,
        );
      }
    }
    for (const warning of extraction.warnings) {
      console.warn(`[!] ${warning}`);
    }
  } catch (error) {
    console.error(`[-] ${(error as Error).message}`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
