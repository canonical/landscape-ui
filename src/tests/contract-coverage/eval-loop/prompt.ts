/**
 * Prompt builder for the eval loop. Keeps LLM context minimal by
 * construction: only the top-5 ranked gaps (with their observed contract
 * payloads as inert JSON data) plus one exemplar spec.
 */

export interface GapEntryLike {
  routeId: string;
  method: string;
  pattern: string;
  backend: string;
  totalHits: number;
  statuses: Record<string, number>;
  contracts?: unknown[];
  rank: number;
}

export interface SuggestionPrompt {
  system: string;
  user: string;
}

const MAX_GAPS = 5;
const MAX_USER_CHARS = 12_000;

const SYSTEM = `You are a senior QA engineer writing backend API-contract tests for the Landscape web UI.

OUTPUT CONTRACT — follow exactly:
- Respond with STRICT JSON only: {"suggestions":[{"route","title","rationale","spec","notes"}]}
- At most 5 suggestions. No prose, no markdown fences, no commentary outside the JSON.
- Each "spec" must be a COMPLETE runnable Playwright API-contract spec file: it imports { test, expect } from "@playwright/test", uses the request fixture, and mirrors the exemplar's describe/test structure and assertion style.
- "route" is the exact route id from the input. "rationale" explains the coverage risk in one or two sentences. "notes" lists anything a human must adjust (seed data, auth, cleanup).`;

export function buildSuggestionPrompt(
  gaps: GapEntryLike[],
  exemplarSpec: string,
): SuggestionPrompt {
  if (gaps.length < 1) {
    throw new Error("no gaps to prompt on");
  }
  const topGaps = [...gaps]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, MAX_GAPS);

  const user =
    `API usage gaps (endpoints the frontend exercises but no API-contract test covers), as JSON data:\n` +
    `${JSON.stringify(topGaps, null, 2)}\n\n` +
    `Existing API-contract test pattern (exemplar — match its style):\n` +
    `${exemplarSpec}\n\n` +
    `Given the following API usage map and the current API-contract test pattern, ` +
    `propose one integration test per endpoint following our standard Playwright API-contract pattern.`;

  if (user.length > MAX_USER_CHARS) {
    throw new Error(
      `prompt too large: ${user.length} chars exceeds ${MAX_USER_CHARS}`,
    );
  }
  return { system: SYSTEM, user };
}
