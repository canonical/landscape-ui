import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  buildGapsFile,
  computeGaps,
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
  outDir: string;
  exemplarPath: string;
  client?: LlmClient;
  env?: Partial<Record<string, string>>;
}

export interface RunResult {
  status: "ok" | "no-gaps" | "llm-failure";
  outDir: string;
  gapsFound: number;
  suggestionsWritten: string[];
  rawFallbackPath?: string;
}

const EXEMPLAR_MAX_LINES = 200;
const RAW_FALLBACK_NAME = "00-raw-llm-output.md";

const MOCK_LLM_RESPONSE = JSON.stringify({
  suggestions: [
    {
      route: "POST /api/v2/mirrors",
      title: "Cover mirror creation (mock)",
      rationale: "Mock suggestion for dry-runs.",
      spec: "// mock spec",
      notes: "Generated with LLM_MOCK=1 — not a real proposal.",
    },
    {
      route: "GET /debarchive/v1beta1/mirrors/{mirrorId}",
      title: "Cover mirror fetch (mock)",
      rationale: "Mock suggestion for dry-runs.",
      spec: "// mock spec",
      notes: "Generated with LLM_MOCK=1 — not a real proposal.",
    },
  ],
});

export async function run(options: RunOptions): Promise<RunResult> {
  const report = loadReport(options.reportPath);
  const extraction = extractSpecCoverage(options.specDir);
  const gaps = computeGaps(report, extraction.calls);
  writeGapsFile(
    buildGapsFile(report, extraction, gaps),
    path.join(options.outDir, "gaps.json"),
  );

  if (gaps.length === 0) {
    return {
      status: "no-gaps",
      outDir: options.outDir,
      gapsFound: 0,
      suggestionsWritten: [],
    };
  }

  const client = options.client ?? createLlmClientFromEnv(options.env);
  const exemplar = fs
    .readFileSync(options.exemplarPath, "utf-8")
    .split("\n")
    .slice(0, EXEMPLAR_MAX_LINES)
    .join("\n");
  const prompt = buildSuggestionPrompt(gaps, exemplar);
  const completion = await client.complete(prompt);

  const parsed = parseSuggestions(completion.text);
  if (!parsed) {
    const suggestionsDir = path.join(options.outDir, "suggestions");
    fs.mkdirSync(suggestionsDir, { recursive: true });
    const rawFallbackPath = path.join(suggestionsDir, RAW_FALLBACK_NAME);
    fs.writeFileSync(
      rawFallbackPath,
      `# Unparseable LLM response\n\nModel: ${completion.model}\n\n\`\`\`\n${completion.text}\n\`\`\`\n`,
      "utf-8",
    );
    return {
      status: "llm-failure",
      outDir: options.outDir,
      gapsFound: gaps.length,
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
  const apiDir = path.resolve(evalLoopDir, "../../../../e2e/docker-stack/api");
  const options: CliOptions = {
    reportPath: REPORT_PATH,
    specDir: apiDir,
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
    const client =
      process.env.LLM_MOCK === "1"
        ? createMockClient(MOCK_LLM_RESPONSE)
        : undefined;
    const result = await run({ ...options, client });
    if (result.status === "no-gaps") {
      console.warn("[+] No gaps — nothing to evaluate");
      return;
    }
    if (result.status === "llm-failure") {
      console.error(
        `[-] LLM response was not valid suggestion JSON; raw output saved to ${result.rawFallbackPath}`,
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
