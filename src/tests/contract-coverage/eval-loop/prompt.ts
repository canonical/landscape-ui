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
const MAX_PAYLOAD_CHARS = 500;

const SYSTEM = `You are a senior QA engineer writing backend API-contract tests for the Landscape web UI.

OUTPUT CONTRACT — follow exactly:
- Respond with STRICT JSON only: {"suggestions":[{"route","title","rationale","spec","notes"}]}
- At most 5 suggestions. No prose, no markdown fences, no commentary outside the JSON.
- Each "spec" must be a COMPLETE runnable Playwright API-contract spec file: it imports { test, expect } from "@playwright/test", uses the request fixture, and mirrors the exemplar's describe/test structure and assertion style.
- "route" is the exact route id from the input. "rationale" explains the coverage risk in one or two sentences. "notes" lists anything a human must adjust (seed data, auth, cleanup).`;

function truncatePayload(payload: unknown): unknown {
  if (payload === null || payload === undefined) {
    return payload;
  }
  const serialized = JSON.stringify(payload);
  if (serialized.length <= MAX_PAYLOAD_CHARS) {
    return payload;
  }
  return { __truncated: true, originalChars: serialized.length };
}

interface ContractShape {
  status?: number;
  requestPayload?: unknown;
  responsePayload?: unknown;
}

function summarizeContracts(
  contracts: unknown[] | undefined,
): unknown[] | undefined {
  if (!contracts) {
    return undefined;
  }
  const seen = new Set<number>();
  const summarized: unknown[] = [];
  for (const contract of contracts) {
    const { status, requestPayload, responsePayload } =
      contract as ContractShape;
    if (status === undefined || seen.has(status)) {
      continue;
    }
    seen.add(status);
    summarized.push({
      status,
      requestPayload: truncatePayload(requestPayload),
      responsePayload: truncatePayload(responsePayload),
    });
  }
  return summarized;
}

function gapsToPromptUser(
  gaps: GapEntryLike[],
  exemplarSpec: string,
): string {
  const topGaps = [...gaps].sort((a, b) => a.rank - b.rank).slice(0, MAX_GAPS);

  return (
    `API usage gaps (endpoints the frontend exercises but no API-contract test covers), as JSON data:\n` +
    `${JSON.stringify(topGaps, null, 2)}\n\n` +
    `Existing API-contract test pattern (exemplar — match its style):\n` +
    `${exemplarSpec}\n\n` +
    `Given the API usage map above and the current API-contract test pattern, ` +
    `propose one integration test per endpoint following our standard Playwright API-contract pattern.`
  );
}

export function buildSuggestionPrompt(
  gaps: GapEntryLike[],
  exemplarSpec: string,
): SuggestionPrompt {
  if (gaps.length < 1) {
    throw new Error("no gaps to prompt on");
  }

  // Try full payloads first.
  const fullUser = gapsToPromptUser(gaps, exemplarSpec);
  if (fullUser.length <= MAX_USER_CHARS) {
    return { system: SYSTEM, user: fullUser };
  }

  // Degrade by summarizing contract payloads to one exemplar per status.
  const summarizedGaps = gaps.map((gapEntry) => ({
    ...gapEntry,
    contracts: summarizeContracts(gapEntry.contracts),
  }));
  const summarizedUser = gapsToPromptUser(summarizedGaps, exemplarSpec);
  if (summarizedUser.length <= MAX_USER_CHARS) {
    return { system: SYSTEM, user: summarizedUser };
  }

  // Further degrade by dropping the lowest-ranked gaps until it fits.
  const sortedSummarized = [...summarizedGaps].sort(
    (a, b) => a.rank - b.rank,
  );
  for (let count = MAX_GAPS - 1; count >= 1; count--) {
    const reducedUser = gapsToPromptUser(
      sortedSummarized.slice(0, count),
      exemplarSpec,
    );
    if (reducedUser.length <= MAX_USER_CHARS) {
      return { system: SYSTEM, user: reducedUser };
    }
  }

  throw new Error(
    `prompt too large: unable to fit any gap within ${MAX_USER_CHARS} chars`,
  );
}
