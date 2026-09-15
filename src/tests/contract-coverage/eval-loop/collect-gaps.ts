import fs from "fs";
import path from "path";
import ts from "typescript";
import { fileURLToPath } from "url";
import { patternToRegExp } from "../matcher";
import { REPORT_PATH } from "../paths";
import type { CoverageReport, GapEntry, GapsFile } from "./types";
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

const HTTP_METHODS = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "fetch",
]);

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH"]);

/**
 * Backend services reachable through the Vite dev proxy under a mount prefix
 * (see DEB_ARCHIVE_MOUNT in src/tests/aggregate-coverage.ts). A spec calling
 * `/v1beta1/locals` exercises the route declared as `/debarchive/v1beta1/locals`.
 */
const MOUNT_PREFIXES = ["/debarchive"];

/** True when `url` matches the canonical route `pattern` (or a mounted variant). */
export function matchesPattern(url: string, pattern: string): boolean {
  const regex = patternToRegExp(pattern);
  return [url, ...MOUNT_PREFIXES.map((prefix) => `${prefix}${url}`)].some(
    (candidate) => regex.test(candidate),
  );
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

function listSpecFiles(specDir: string): string[] {
  if (!fs.existsSync(specDir)) {
    return [];
  }
  return fs
    .readdirSync(specDir, { recursive: true })
    .map((entry) => entry.toString())
    .filter((entry) => entry.endsWith(".spec.ts"))
    .map((entry) => path.join(specDir, entry))
    .sort();
}

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
export function extractSpecCoverage(specDir: string): ExtractionResult {
  const calls: ExtractedCall[] = [];
  const warnings: string[] = [];

  for (const file of listSpecFiles(specDir)) {
    const sourceFile = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf-8"),
      ts.ScriptTarget.Latest,
      true,
    );

    const locationOf = (node: ts.Node): string => {
      const { line } = sourceFile.getLineAndCharacterOfPosition(
        node.getStart(sourceFile),
      );
      return `${path.basename(file)}:${line + 1}`;
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
            file: path.basename(file),
            line,
          });
        } else if (ts.isTemplateExpression(firstArg)) {
          calls.push({
            method,
            urlPattern: templateToPattern(firstArg),
            file: path.basename(file),
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

export function buildGapsFile(
  report: CoverageReport,
  extraction: ExtractionResult,
  gaps: GapEntry[],
): GapsFile {
  return {
    generatedAt: new Date().toISOString(),
    stats: {
      routesExercised: Object.keys(report.routes).length,
      specCallsExtracted: extraction.calls.length,
      gapsFound: gaps.length,
    },
    gaps,
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
  out: string;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    report: REPORT_PATH,
    specDir: path.resolve(
      import.meta.dirname,
      "../../../../e2e/docker-stack/api",
    ),
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
    else if (flag === "--out") options.out = value;
    else throw new Error(`Unknown flag: ${flag}`);
  }
  return options;
}

function main(): void {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = loadReport(options.report);
    const extraction = extractSpecCoverage(options.specDir);
    const gaps = computeGaps(report, extraction.calls);
    writeGapsFile(buildGapsFile(report, extraction, gaps), options.out);
    console.warn(`[+] Gap report written to: ${options.out}`);
    console.warn(
      `    ${Object.keys(report.routes).length} exercised routes, ` +
        `${extraction.calls.length} spec calls extracted, ${gaps.length} gaps`,
    );
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
