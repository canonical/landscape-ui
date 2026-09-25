import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  buildGapsFile,
  computeGaps,
  computeOrphans,
  extractSpecCoverage,
  loadReport,
  writeGapsFile,
} from "./collect-gaps";
import type { LlmClient } from "./llm-client";
import { createLlmClientFromEnv, createMockClient } from "./llm-client";
import { buildSuggestionPrompt } from "./prompt";
import {
  parseSuggestions,
  renderStepSummary,
  renderSuggestions,
} from "./render";
import { REPORT_PATH } from "../paths";

/**
 * Orchestrates the eval loop: deterministic collection first (gaps.json is
 * always written before any LLM call), then one minimal inference, then
 * rendering. Collection errors fail fast; LLM errors never lose the gap data.
 */

export interface RunOptions {
  reportPath: string;
  specDir: string;
  /** Relative roots inside specDir to scan for spec calls. Defaults to ["api", "helpers"]. */
  scanRoots?: string[];
  outDir: string;
  exemplarPath: string;
  client?: LlmClient;
  env?: Partial<Record<string, string>>;
  /** When true, build a mock LLM response from the computed gaps. */
  mockFromGaps?: boolean;
}

export interface RunResult {
  status: "ok" | "no-gaps" | "llm-failure";
  outDir: string;
  gapsFound: number;
  orphansFound: number;
  suggestionsWritten: string[];
  rawFallbackPath?: string;
}

const EXEMPLAR_MAX_LINES = 200;
const RAW_FALLBACK_NAME = "00-raw-llm-output.md";

function buildMockResponseFromRoutes(routes: string[]): string {
  const suggestions = routes.map((routeId) => ({
    route: routeId,
    title: `Cover ${routeId} (mock)`,
    rationale: "Mock suggestion for dry-runs.",
    spec: "// mock spec",
    notes: "Generated with LLM_MOCK=1 — not a real proposal.",
  }));
  return JSON.stringify({ suggestions });
}

function areSameRoutes(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  const setB = new Set(b);
  // Guard against duplicates on either side: with matching lengths, a
  // duplicate on one side implies a missing route on the other, so a
  // straight `.every()` membership check alone would falsely accept it.
  if (setA.size !== a.length || setB.size !== b.length) return false;
  return a.every((route) => setB.has(route));
}

function writeRawFallback(
  outDir: string,
  title: string,
  model: string,
  body: string,
): string {
  const suggestionsDir = path.join(outDir, "suggestions");
  fs.mkdirSync(suggestionsDir, { recursive: true });
  const rawFallbackPath = path.join(suggestionsDir, RAW_FALLBACK_NAME);
  const fence = "`".repeat(
    Math.max(3, ...(body.match(/`+/g) ?? []).map((m) => m.length + 1)),
  );
  fs.writeFileSync(
    rawFallbackPath,
    `# ${title}\n\nModel: ${model}\n\n${fence}\n${body}\n${fence}\n`,
    "utf-8",
  );
  return rawFallbackPath;
}

export async function run(options: RunOptions): Promise<RunResult> {
  const report = loadReport(options.reportPath);
  const extraction = extractSpecCoverage(options.specDir, options.scanRoots);
  const gaps = computeGaps(report, extraction.calls);
  const orphans = computeOrphans(report, extraction.calls);
  writeGapsFile(
    buildGapsFile(report, extraction, gaps, orphans),
    path.join(options.outDir, "gaps.json"),
  );
  fs.rmSync(path.join(options.outDir, "suggestions"), {
    recursive: true,
    force: true,
  });

  if (orphans.length > 0) {
    // Orphans indicate a matcher/spec limitation (e.g. multi-segment
    // template-literal spans), not a hard failure — log and carry on so the
    // scheduled run still reaches the LLM and produces suggestions.
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

  if (gaps.length === 0) {
    return {
      status: "no-gaps",
      outDir: options.outDir,
      gapsFound: 0,
      orphansFound: orphans.length,
      suggestionsWritten: [],
    };
  }

  const exemplar = fs
    .readFileSync(options.exemplarPath, "utf-8")
    .split("\n")
    .slice(0, EXEMPLAR_MAX_LINES)
    .join("\n");

  let prompt: ReturnType<typeof buildSuggestionPrompt>;
  try {
    prompt = buildSuggestionPrompt(gaps, exemplar);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const rawFallbackPath = writeRawFallback(
      options.outDir,
      "Prompt too large",
      "n/a",
      message,
    );
    return {
      status: "llm-failure",
      outDir: options.outDir,
      gapsFound: gaps.length,
      orphansFound: orphans.length,
      suggestionsWritten: [],
      rawFallbackPath,
    };
  }

  const client =
    options.mockFromGaps && !options.client
      ? createMockClient(buildMockResponseFromRoutes(prompt.includedRoutes))
      : (options.client ?? createLlmClientFromEnv(options.env));

  const completion = await client.complete(prompt);

  const parsed = parseSuggestions(completion.text);
  const parsedRoutes = parsed?.suggestions.map(({ route }) => route);
  if (
    !parsed ||
    !parsedRoutes ||
    !areSameRoutes(parsedRoutes, prompt.includedRoutes)
  ) {
    const rawFallbackPath = writeRawFallback(
      options.outDir,
      "Unparseable LLM response",
      completion.model,
      completion.text,
    );
    return {
      status: "llm-failure",
      outDir: options.outDir,
      gapsFound: gaps.length,
      orphansFound: orphans.length,
      suggestionsWritten: [],
      rawFallbackPath,
    };
  }

  const written = renderSuggestions(parsed, gaps, options.outDir);
  renderStepSummary(parsed, gaps);
  return {
    status: "ok",
    outDir: options.outDir,
    gapsFound: gaps.length,
    orphansFound: orphans.length,
    suggestionsWritten: written,
  };
}

interface CliOptions {
  reportPath: string;
  specDir: string;
  scanRoots: string[];
  outDir: string;
  exemplarPath: string;
}

function parseArgs(argv: string[]): CliOptions {
  const evalLoopDir = import.meta.dirname;
  const dockerStackDir = path.resolve(
    evalLoopDir,
    "../../../../e2e/docker-stack",
  );
  const apiDir = path.join(dockerStackDir, "api");
  const options: CliOptions = {
    reportPath: REPORT_PATH,
    specDir: dockerStackDir,
    scanRoots: ["api", "helpers"],
    outDir: path.join(evalLoopDir, "out"),
    exemplarPath: path.join(apiDir, "local-repositories.spec.ts"),
  };
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (value === undefined) {
      throw new Error(`Missing value for ${flag}`);
    }
    if (flag === "--report") options.reportPath = value;
    else if (flag === "--spec-dir") options.specDir = value;
    else if (flag === "--scan-roots")
      options.scanRoots = value.split(",").map((s) => s.trim());
    else if (flag === "--out-dir") options.outDir = value;
    else if (flag === "--exemplar") options.exemplarPath = value;
    else throw new Error(`Unknown flag: ${flag}`);
  }
  return options;
}

async function main(): Promise<void> {
  try {
    const options = parseArgs(process.argv.slice(2));
    const mockFromGaps = process.env.LLM_MOCK === "1";
    const result = await run({ ...options, mockFromGaps });
    if (result.status === "no-gaps") {
      console.warn("[+] No gaps — nothing to evaluate");
      return;
    }
    if (result.status === "llm-failure") {
      console.error(
        `[-] LLM suggestion generation failed; details saved to ${result.rawFallbackPath}`,
      );
      process.exit(1);
    }
    console.warn(
      `[+] ${result.suggestionsWritten.length} suggestions written to ${path.join(result.outDir, "suggestions")}`,
    );
    console.warn(`    ${result.gapsFound} gaps evaluated from gaps.json`);
  } catch (error) {
    console.error(`[-] ${(error as Error).message}`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  void main();
}
