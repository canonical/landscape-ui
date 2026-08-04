import fs from "fs";
import path from "path";
import type { GapEntry, Suggestion, SuggestionsResponse } from "./types";
import { assertSuggestionsResponse } from "./types";

/**
 * Renders LLM suggestion JSON into markdown artifacts. The LLM's spec text is
 * written verbatim into a fenced block — never evaluated or interpolated.
 */

const MAX_SUGGESTIONS = 5;
const SLUG_MAX_LENGTH = 60;

export function slugifyRoute(route: string): string {
  return route
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH);
}

/** Parse the LLM's strict-JSON response. Returns null on any failure. */
export function parseSuggestions(raw: string): SuggestionsResponse | null {
  const fenced = /^```(?:json)?\s*\n([\s\S]*?)\n```\s*$/.exec(raw.trim());
  const candidate = fenced?.[1] ?? raw;
  let parsed: unknown;
  try {
    parsed = JSON.parse(candidate);
  } catch {
    return null;
  }
  try {
    assertSuggestionsResponse(parsed);
  } catch {
    return null;
  }
  return parsed;
}

function metadataFor(
  suggestion: Suggestion,
  gaps: GapEntry[],
): { backend: string; totalHits: string; statuses: string } {
  const gap = gaps.find((entry) => entry.routeId === suggestion.route);
  if (!gap) {
    return { backend: "unknown", totalHits: "n/a", statuses: "n/a" };
  }
  const statuses = Object.entries(gap.statuses)
    .map(([status, count]) => `${status} ×${count}`)
    .join(", ");
  return {
    backend: gap.backend,
    totalHits: String(gap.totalHits),
    statuses,
  };
}

function renderSuggestionMarkdown(
  suggestion: Suggestion,
  gaps: GapEntry[],
): string {
  const metadata = metadataFor(suggestion, gaps);
  const lines = [
    `# ${suggestion.title}`,
    "",
    "| Field | Value |",
    "| --- | --- |",
    `| Route | \`${suggestion.route}\` |`,
    `| Backend | ${metadata.backend} |`,
    `| Frontend hits | ${metadata.totalHits} |`,
    `| Observed statuses | ${metadata.statuses} |`,
    "",
    "## Why this matters",
    "",
    suggestion.rationale,
    "",
    "## Proposed spec",
    "",
    ...(() => {
      const fence = "`".repeat(
        Math.max(
          3,
          ...(suggestion.spec.match(/`+/g) ?? []).map((m) => m.length + 1),
        ),
      );
      return [`${fence}ts`, suggestion.spec, fence];
    })(),
    "",
    "## How to apply",
    "",
    `- [ ] Create the spec file under \`e2e/docker-stack/api/\``,
    `- [ ] Run \`pnpm exec playwright test --config e2e/docker-stack/playwright.api-contract.config.ts\``,
    "- [ ] See the suite README (`e2e/docker-stack/README.md`) for conventions",
  ];
  if (suggestion.notes) {
    lines.push(`- [ ] Notes: ${suggestion.notes}`);
  }
  lines.push("");
  return lines.join("\n");
}

/** Write one `NN-<slug>.md` artifact per suggestion. Returns written paths. */
export function renderSuggestions(
  response: SuggestionsResponse,
  gaps: GapEntry[],
  outDir: string,
): string[] {
  const suggestionsDir = path.join(outDir, "suggestions");
  fs.mkdirSync(suggestionsDir, { recursive: true });
  return response.suggestions
    .slice(0, MAX_SUGGESTIONS)
    .map((suggestion, index) => {
      const number = String(index + 1).padStart(2, "0");
      const filePath = path.join(
        suggestionsDir,
        `${number}-${slugifyRoute(suggestion.route)}.md`,
      );
      fs.writeFileSync(
        filePath,
        renderSuggestionMarkdown(suggestion, gaps),
        "utf-8",
      );
      return filePath;
    });
}

/** Markdown summary; appended to $GITHUB_STEP_SUMMARY when that env var is set. */
export function renderStepSummary(
  response: SuggestionsResponse,
  gaps: GapEntry[],
): string {
  const escapeCell = (value: string): string =>
    value
      .replace(/\\/g, "\\\\")
      .replace(/\|/g, "\\|")
      .replace(/`/g, "\\`")
      .replace(/\r?\n/g, " ");

  const lines = [
    "## API contract eval — top suggestions",
    "",
    "| # | Route | Suggestion | Frontend hits |",
    "| --- | --- | --- | --- |",
    ...response.suggestions.map((suggestion, index) => {
      const gap = gaps.find((entry) => entry.routeId === suggestion.route);
      const route = escapeCell(suggestion.route);
      const title = escapeCell(suggestion.title);
      return `| ${index + 1} | \`${route}\` | ${title} | ${gap?.totalHits ?? "n/a"} |`;
    }),
    "",
    "Full details in the `api-contract-eval-report` workflow artifact.",
    "",
  ];
  const markdown = lines.join("\n");
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    fs.appendFileSync(summaryPath, markdown, "utf-8");
  }
  return markdown;
}
