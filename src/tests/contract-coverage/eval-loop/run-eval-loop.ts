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
import type { GapEntry } from "./types";

/**
 * Orchestrates the eval loop: deterministic collection first (gaps.json is
 * always written before any LLM call), then one minimal inference, then
 * rendering. Collection errors fail fast; LLM errors never lose the gap data.
 */

export interface RunOptions {
  reportPath: string;
  specDir: string;
  outDir: string;
  exemplarPath: string;
  client?: LlmClient;
  env?: Partial<Record<string, string>>;
  /** When true, build a mock LLM response from the computed gaps. */
  mockFromGaps?: boolean;
}

export interface RunResult {
  status: "ok" | "no-gaps" | "llm-failure" | "orphans";
  outDir: string;
  gapsFound: number;
  orphansFound: number;
  suggestionsWritten: string[];
  rawFallbackPath?: string;
}

const EXEMPLAR_MAX_LINES = 200;
const RAW_FALLBACK_NAME = "00-raw-llm-output.md";

function buildMockResponseFromGaps(gaps: GapEntry[]): string {
  const suggestions = gaps.slice(0, 5).map(({ routeId }) => ({
    route: routeId,
    title: `Cover ${routeId} (mock)`,
    rationale: "Mock suggestion for dry-runs.",
    spec: "// mock spec",
    notes: "Generated with LLM_MOCK=1 — not a real proposal.",
  }));
  return JSON.stringify({ suggestions });
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
  const extraction = extractSpecCoverage(options.specDir);
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
    return {
      status: "orphans",
      outDir: options.outDir,
      gapsFound: gaps.length,
      orphansFound: orphans.length,
      suggestionsWritten: [],
    };
  }

  if (gaps.length === 0) {
    return {
      status: "no-gaps",
      outDir: options.outDir,
      gapsFound: 0,
      orphansFound: 0,
      suggestionsWritten: [],
    };
  }

  const client =
    options.mockFromGaps && !options.client
      ? createMockClient(buildMockResponseFromGaps(gaps))
      : (options.client ?? createLlmClientFromEnv(options.env));
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

  const completion = await client.complete(prompt);

  const parsed = parseSuggestions(completion.text);
  const eligibleRoutes = new Set(
    gaps.slice(0, 5).map(({ routeId }) => routeId),
  );
  if (
    !parsed ||
    parsed.suggestions.some(({ route }) => !eligibleRoutes.has(route)) ||
    new Set(parsed.suggestions.map(({ route }) => route)).size !==
      parsed.suggestions.length
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
    if (result.status === "orphans") {
      console.error(
        `[-] ${result.orphansFound} extracted spec call(s) match no exercised route (orphans). ` +
          "Fix the matcher, route pin, or spec before running suggestions.",
      );
      process.exit(1);
    }
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
