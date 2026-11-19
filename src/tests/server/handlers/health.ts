// LA061 — MSW handlers for the Health endpoints.
//
// Mirror the convention of the rest of the handler files: import from
// `@/constants`, branch on `getEndpointStatus()` for empty/error/loading paths,
// and read fixture data from `@/tests/mocks/health` so demos can flip shapes
// at runtime via `setHealthFixture('crisisFleet')`.

import { API_URL } from "@/constants";
import type { HealthGroupSummary } from "@/features/health";
import { getEndpointStatus } from "@/tests/controllers/controller";
import {
  type ComputerHealth,
  type FleetHealthSummary,
  type HealthActionKind,
  type HealthRule,
  type MeasuredComputerHealth,
  RULES_VERSION,
  getComputerHealth,
  getHealthFixture,
  seededRules,
} from "@/tests/mocks/health";
import { http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";

// Phase 2, mocks only: a `recommended_actions` list derived from the factor
// list. The mapping is duplicated from `ACTION_BY_RULE_KEY` in
// `src/features/health/helpers.ts`, which handlers cannot import (deep
// feature imports are restricted). Keep the two in sync.
const ACTION_BY_RULE_KEY: Record<string, HealthActionKind> = {
  "usn.critical": "run-security-updates",
  "usn.high": "run-security-updates",
  "usn.medium": "run-security-updates",
  "usn.low": "run-security-updates",
  "usn.unrated": "run-security-updates",
  reboot_required: "reboot",
  "instance.offline": "refresh-facts",
  "package.updates_available": "run-security-updates",
};

export const enrichWithRecommendedActions = (
  health: ComputerHealth,
): ComputerHealth => {
  if (!health.measurable) {
    return health;
  }
  const seen = new Set<HealthActionKind>();
  for (const factor of health.factors) {
    const action = ACTION_BY_RULE_KEY[factor.rule_key];
    const pending = factor.pending_reboot_count ?? 0;
    if (pending > 0) {
      seen.add("reboot");
    }
    // With every fix installed, an update would change nothing.
    const isAllPending = pending >= factor.count;
    if (action && !isAllPending) {
      seen.add(action);
    }
  }
  return { ...health, recommended_actions: Array.from(seen) };
};

// LA061 Phase 1.8: synthesise the grouped breakdown the real server would
// return for `?group_by=...`. Fixtures don't carry tag / distribution
// metadata, so we use a deterministic synthetic split:
//   - tag: chunk computers into rotating buckets (web/db/cache) so the UI
//     can render multi-row stacked bars.
//   - distribution: split into jammy/noble/focal by computer_id parity.
//   - account: every computer rolls up to the single mock account.
// Top-10 + "other" rollup mirrors the server-side cap. This is enough to
// drive the widget's empty / single / multi-row states from MSW.
type GroupSummaryRow = HealthGroupSummary;
const TAG_BUCKETS = ["web", "db", "cache", "edge", "monitoring"];
const DISTRO_BUCKETS = ["noble", "jammy", "focal"];
const TOP_N = 10;
const synthesiseGroups = (
  computers: MeasuredComputerHealth[],
  groupBy: "tag" | "distribution" | "account",
): GroupSummaryRow[] => {
  if (computers.length === 0) return [];
  const buckets: Record<string, GroupSummaryRow> = {};
  for (const c of computers) {
    let label: string;
    if (groupBy === "tag") {
      label = TAG_BUCKETS[c.computer_id % TAG_BUCKETS.length]!;
    } else if (groupBy === "distribution") {
      label = DISTRO_BUCKETS[c.computer_id % DISTRO_BUCKETS.length]!;
    } else {
      label = "Account 1";
    }
    if (!buckets[label]) {
      buckets[label] = {
        group: label,
        band_critical_count: 0,
        band_warning_count: 0,
        band_healthy_count: 0,
        total_count: 0,
      };
    }
    const row = buckets[label]!;
    row.total_count += 1;
    if (c.band === "critical") row.band_critical_count += 1;
    else if (c.band === "warning") row.band_warning_count += 1;
    else row.band_healthy_count += 1;
  }
  const sorted = Object.values(buckets).sort(
    (a, b) => b.total_count - a.total_count || a.group.localeCompare(b.group),
  );
  if (sorted.length <= TOP_N) return sorted;
  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N);
  const other: GroupSummaryRow = {
    group: "other",
    band_critical_count: rest.reduce((s, r) => s + r.band_critical_count, 0),
    band_warning_count: rest.reduce((s, r) => s + r.band_warning_count, 0),
    band_healthy_count: rest.reduce((s, r) => s + r.band_healthy_count, 0),
    total_count: rest.reduce((s, r) => s + r.total_count, 0),
  };
  return [...top, other];
};

// LA061 Phase 1.8 bulk-action types
interface BulkActionBody {
  action: HealthActionKind;
  computer_ids: number[];
}
interface BulkActionOutcome {
  computer_id: number;
  status:
    | "enqueued"
    | "forbidden"
    | "conflict"
    | "not_implemented"
    | "unknown_computer"
    | "error";
  activity_id?: number | null;
  error_code?: string | null;
  message?: string | null;
}
interface BulkActionResponse {
  action: HealthActionKind;
  enqueued_at: string;
  results: BulkActionOutcome[];
  success_count: number;
  failure_count: number;
}

// Stub action endpoint payload — matches `HealthActionResult` in the
// frontend types. The action kinds the UI dispatches are a fixed
// enumeration; we accept anything to keep the mock forgiving but echo
// the dispatched value back in the response.
interface HealthActionBody {
  action: string;
}
interface HealthActionResponse {
  action: string;
  computer_id: number;
  // LA061 Phase 1.7: null for `refresh-facts` (no agent-side activity is
  // enqueued — the action just marks the computer dirty server-side).
  activity_id: number | null;
  enqueued_at: string;
}

let nextActivityId = 90_000;

// Phase 2, mocks only: per-account overrides keyed by rule, so PATCH and
// DELETE round-trip within a session. Reset on page reload.
let overrides: HealthRule[] = [];

interface PatchRuleBody {
  weight?: number;
  cap?: number | null;
  enabled?: boolean;
  params?: Record<string, unknown>;
}

const NOW = () => new Date().toISOString();

// Account overrides merged over the system defaults.
const effectiveRules = (): HealthRule[] => {
  const byKey = new Map<string, HealthRule>();
  for (const r of seededRules) byKey.set(r.rule_key, r);
  for (const r of overrides) byKey.set(r.rule_key, r);
  return Array.from(byKey.values());
};

const unknownRule = (ruleKey: string) =>
  HttpResponse.json<{ error: string; message: string }>(
    { error: "HealthRuleNotFoundError", message: `Unknown rule ${ruleKey}` },
    { status: 404 },
  );

export default [
  // GET /api/v2/health/rules — effective rule set, read-only in Phase 1.
  http.get<never, never, { rules_version: number; results: HealthRule[] }>(
    `${API_URL}health/rules`,
    ({ request }) => {
      const endpointStatus = getEndpointStatus();
      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
      if (endpointStatus.status === "empty") {
        return HttpResponse.json({ rules_version: RULES_VERSION, results: [] });
      }
      const includeDisabled =
        new URL(request.url).searchParams.get("include_disabled") === "true";
      return HttpResponse.json({
        rules_version: RULES_VERSION,
        results: effectiveRules().filter(
          ({ enabled }) => includeDisabled || enabled,
        ),
      });
    },
  ),

  // PATCH /api/v2/health/rules/:rule_key — Phase 2 sketch: creates or updates
  // the account override of a system rule.
  http.patch<
    { rule_key: string },
    PatchRuleBody,
    HealthRule | { error: string; message: string }
  >(`${API_URL}health/rules/:rule_key`, async ({ params, request }) => {
    const base = effectiveRules().find((r) => r.rule_key === params.rule_key);
    if (!base) {
      return unknownRule(params.rule_key);
    }
    const body = (await request.json()) as PatchRuleBody;
    const updated: HealthRule = {
      ...base,
      ...body,
      scope: "account",
      overrides_system_default: true,
    };
    overrides = [
      ...overrides.filter((r) => r.rule_key !== updated.rule_key),
      updated,
    ];
    return HttpResponse.json(updated);
  }),

  // DELETE /api/v2/health/rules/:rule_key — Phase 2 sketch: removes the
  // account override, never the system default.
  http.delete<{ rule_key: string }>(
    `${API_URL}health/rules/:rule_key`,
    ({ params }) => {
      if (!overrides.some((r) => r.rule_key === params.rule_key)) {
        return unknownRule(params.rule_key);
      }
      overrides = overrides.filter((r) => r.rule_key !== params.rule_key);
      return new HttpResponse(null, { status: 204 });
    },
  ),

  // GET /api/v2/computers/:computer_id/health — a computer without a state
  // row answers `{computer_id, measurable: false}`.
  http.get<{ computer_id: string }, never, ComputerHealth>(
    `${API_URL}computers/:computer_id/health`,
    ({ params }) => {
      const endpointStatus = getEndpointStatus();
      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
      return HttpResponse.json(
        enrichWithRecommendedActions(
          getComputerHealth(Number(params.computer_id)),
        ),
      );
    },
  ),

  // GET /api/v2/health/summary
  // Phase 2, mocks only: with `?group_by=tag|distribution|account` the
  // response also carries a `groups` array (top 10 plus an "other" rollup),
  // synthesised from the active fixture for the HealthByGroup widget.
  http.get<never, never, FleetHealthSummary>(
    `${API_URL}health/summary`,
    ({ request }) => {
      const endpointStatus = getEndpointStatus();
      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
      if (endpointStatus.status === "loading") {
        return new Promise<never>(() => {
          /* intentionally never resolves */
        });
      }
      const url = new URL(request.url);
      const groupBy = url.searchParams.get("group_by");
      const fixture = getHealthFixture();
      if (
        groupBy === "tag" ||
        groupBy === "distribution" ||
        groupBy === "account"
      ) {
        return HttpResponse.json({
          ...fixture.summary,
          groups: synthesiseGroups(fixture.computers, groupBy),
          kernel_usns_waived_count:
            fixture.summary.kernel_usns_waived_count ?? 0,
        });
      }
      return HttpResponse.json(fixture.summary);
    },
  ),

  // POST /api/v2/computers/:computer_id/health/actions — LA061 Phase 1.7
  // mirrors the real server: 202 for the three wired actions (reboot,
  // run-security-updates, refresh-facts); 501 for the two deferred ones
  // (attach-ubuntu-pro, run-diagnostic-script); refresh-facts returns
  // `activity_id: null` because it marks dirty server-side without
  // touching the agent.
  http.post<
    { computer_id: string },
    HealthActionBody,
    HealthActionResponse | { error: string; message: string }
  >(
    `${API_URL}computers/:computer_id/health/actions`,
    async ({ params, request }) => {
      const endpointStatus = getEndpointStatus();
      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
      const computerId = Number(params.computer_id);
      const body = (await request.json()) as HealthActionBody;
      if (
        body.action === "attach-ubuntu-pro" ||
        body.action === "run-diagnostic-script"
      ) {
        return HttpResponse.json(
          {
            error: "HealthActionNotImplementedError",
            message: `Health action '${body.action}' is not implemented yet.`,
          },
          { status: 501 },
        );
      }
      return HttpResponse.json(
        {
          action: body.action,
          computer_id: computerId,
          activity_id:
            body.action === "refresh-facts" ? null : nextActivityId++,
          enqueued_at: NOW(),
        },
        { status: 202 },
      );
    },
  ),

  // POST /api/v2/health/actions/bulk — LA061 Phase 1.8
  // Returns **HTTP 207 Multi-Status** with a per-computer outcome list. The
  // mock synthesises a believable mix: 501 for the two deferred kinds (one
  // outcome per id), `enqueued` for the wired three. A small deterministic
  // sprinkle of `conflict` / `forbidden` outcomes lets the UI tests exercise
  // the partial-failure path without coordinating with fixture data.
  http.post<never, BulkActionBody, BulkActionResponse>(
    `${API_URL}health/actions/bulk`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();
      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
      const body = (await request.json()) as BulkActionBody;
      const results: BulkActionOutcome[] = [];
      let success = 0;
      let failure = 0;
      const isStub =
        body.action === "attach-ubuntu-pro" ||
        body.action === "run-diagnostic-script";
      for (const id of body.computer_ids ?? []) {
        if (isStub) {
          results.push({
            computer_id: id,
            status: "not_implemented",
            error_code: "HealthActionNotImplementedError",
            message: `Health action '${body.action}' is not implemented yet.`,
          });
          failure += 1;
          continue;
        }
        // Sprinkle a deterministic conflict / forbidden so partial-failure
        // toasts are testable without fixture coordination. The triggering
        // ids (multiples of 11 / 13) are chosen to be rare in the existing
        // fleet fixtures.
        if (id % 11 === 0) {
          results.push({
            computer_id: id,
            status: "conflict",
            error_code: "HealthActionConflictError",
            message: "No matching work to apply for this computer.",
          });
          failure += 1;
          continue;
        }
        if (id % 13 === 0) {
          results.push({
            computer_id: id,
            status: "forbidden",
            error_code: "HealthActionForbiddenError",
            message: `Caller lacks permission for '${body.action}' on this computer.`,
          });
          failure += 1;
          continue;
        }
        results.push({
          computer_id: id,
          status: "enqueued",
          activity_id:
            body.action === "refresh-facts" ? null : nextActivityId++,
        });
        success += 1;
      }
      return HttpResponse.json(
        {
          action: body.action,
          enqueued_at: NOW(),
          results,
          success_count: success,
          failure_count: failure,
        },
        { status: 207 },
      );
    },
  ),
];
