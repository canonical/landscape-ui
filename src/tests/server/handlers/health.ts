// LA061 — MSW handlers for the Health endpoints.
//
// Mirror the convention of the rest of the handler files: import from
// `@/constants`, branch on `getEndpointStatus()` for empty/error/loading paths,
// and read fixture data from `@/tests/mocks/health` so demos can flip shapes
// at runtime via `setHealthFixture('crisisFleet')`.

import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import {
  type ComputerHealth,
  type FleetHealthSummary,
  type FleetTopDetractor,
  type HealthActionKind,
  type HealthRule,
  getFleetTopDetractors,
  getHealthFixture,
  manyFactorsComputer,
  seededRules,
} from "@/tests/mocks/health";
import { http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";

// LA061 Phase 1.7: the production server returns a `recommended_actions`
// list per `ComputerHealth`, derived from the factor list. The MSW handler
// does the same derivation here so dev demos behave like prod. The mapping
// is duplicated from `src/features/health/helpers.ts:ACTION_BY_RULE_KEY` —
// `src/tests/server/handlers/` is forbidden from importing `src/features/*`
// by the project's lint rules, so the duplication is deliberate.
// Keep this map in sync if rule keys change.
const ACTION_BY_RULE_KEY: Record<string, HealthActionKind> = {
  "usn.critical": "run-security-updates",
  "usn.high": "run-security-updates",
  "usn.medium": "run-security-updates",
  "usn.low": "run-security-updates",
  reboot_required: "reboot",
  "instance.offline": "refresh-facts",
  "package.updates_available": "run-security-updates",
};

const enrichWithRecommendedActions = (
  health: ComputerHealth,
): ComputerHealth => {
  const seen = new Set<HealthActionKind>();
  for (const factor of health.factors) {
    const action = ACTION_BY_RULE_KEY[factor.rule_key];
    if (action) {
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
interface GroupSummaryRow {
  group: string;
  band_critical_count: number;
  band_warning_count: number;
  band_healthy_count: number;
  total_count: number;
}
const TAG_BUCKETS = ["web", "db", "cache", "edge", "monitoring"];
const DISTRO_BUCKETS = ["noble", "jammy", "focal"];
const TOP_N = 10;
const synthesiseGroups = (
  computers: ComputerHealth[],
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
      label = `Account ${c.account_id}`;
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

// Mutable in-memory store of per-account overrides, so POST/PUT/DELETE
// round-trip correctly within a session. Reset on page reload.
let overrides: HealthRule[] = [];
let nextOverrideId = 1000;

interface CreateRuleBody {
  rule_key: string;
  weight: number;
  title?: string;
  description?: string;
  definition?: Record<string, unknown>;
  enabled?: boolean;
}

interface UpdateRuleBody {
  weight?: number;
  title?: string;
  description?: string;
  definition?: Record<string, unknown>;
  enabled?: boolean;
}

const NOW = () => new Date().toISOString();

const effectiveRules = (): HealthRule[] => {
  const byKey = new Map<string, HealthRule>();
  for (const r of seededRules) byKey.set(r.rule_key, r);
  for (const r of overrides) byKey.set(r.rule_key, r);
  return Array.from(byKey.values());
};

export default [
  // GET /api/v2/health/rules
  http.get<never, never, { results: HealthRule[] }>(
    `${API_URL}health/rules`,
    () => {
      const endpointStatus = getEndpointStatus();
      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
      if (endpointStatus.status === "empty") {
        return HttpResponse.json({ results: [] });
      }
      return HttpResponse.json({ results: effectiveRules() });
    },
  ),

  // POST /api/v2/health/rules — create per-account override
  http.post<never, CreateRuleBody, HealthRule>(
    `${API_URL}health/rules`,
    async ({ request }) => {
      const body = (await request.json()) as CreateRuleBody;
      const rule: HealthRule = {
        id: nextOverrideId++,
        account_id: 1,
        rule_key: body.rule_key,
        title: body.title ?? "",
        description: body.description ?? "",
        definition: body.definition ?? {},
        weight: body.weight,
        enabled: body.enabled ?? true,
        created_at: NOW(),
        updated_at: NOW(),
        is_system_default: false,
      };
      overrides = [...overrides.filter((r) => r.rule_key !== rule.rule_key), rule];
      return HttpResponse.json(rule, { status: 201 });
    },
  ),

  // PUT /api/v2/health/rules/:id
  http.put<
    { id: string },
    UpdateRuleBody,
    HealthRule | { error: string; message: string }
  >(
    `${API_URL}health/rules/:id`,
    async ({ params, request }) => {
      const id = Number(params.id);
      const body = (await request.json()) as UpdateRuleBody;
      const existing = overrides.find((r) => r.id === id);
      if (!existing) {
        return HttpResponse.json(
          { error: "HealthRuleNotFoundError", message: `Unknown id ${id}` },
          { status: 404 },
        );
      }
      const updated: HealthRule = {
        ...existing,
        weight: body.weight ?? existing.weight,
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        definition: body.definition ?? existing.definition,
        enabled: body.enabled ?? existing.enabled,
        updated_at: NOW(),
      };
      overrides = overrides.map((r) => (r.id === id ? updated : r));
      return HttpResponse.json(updated);
    },
  ),

  // DELETE /api/v2/health/rules/:id
  http.delete<{ id: string }, never, undefined>(
    `${API_URL}health/rules/:id`,
    ({ params }) => {
      const id = Number(params.id);
      const existed = overrides.some((r) => r.id === id);
      if (!existed) {
        return HttpResponse.json(
          { error: "HealthRuleNotFoundError", message: `Unknown id ${id}` },
          { status: 404 },
        );
      }
      overrides = overrides.filter((r) => r.id !== id);
      return new HttpResponse(null, { status: 204 });
    },
  ),

  // GET /api/v2/computers/:computer_id/health
  http.get<{ computer_id: string }, never, ComputerHealth>(
    `${API_URL}computers/:computer_id/health`,
    ({ params }) => {
      const endpointStatus = getEndpointStatus();
      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
      const id = Number(params.computer_id);
      const { computers } = getHealthFixture();
      if (id === manyFactorsComputer.computer_id) {
        return HttpResponse.json(
          enrichWithRecommendedActions(manyFactorsComputer),
        );
      }
      const found = computers.find((c) => c.computer_id === id);
      if (found) {
        return HttpResponse.json(enrichWithRecommendedActions(found));
      }
      // No state yet — server returns the 100-score placeholder per the spec.
      return HttpResponse.json({
        computer_id: id,
        account_id: 1,
        score: 100,
        band: "healthy" as const,
        critical_factor_count: 0,
        factors: [],
        recommended_actions: [],
        updated_at: null,
      });
    },
  ),

  // GET /api/v2/health/summary
  // LA061 Phase 1.8: when `?group_by=tag|distribution|account` is set, the
  // server returns the flat summary PLUS a `groups` array (top-10 + "other"
  // rollup). We synthesise the grouped breakdown from the active fleet
  // fixture so MSW reflects the real shape for the HealthByGroup widget.
  http.get<never, never, FleetHealthSummary>(`${API_URL}health/summary`, ({ request }) => {
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
    if (groupBy === "tag" || groupBy === "distribution" || groupBy === "account") {
      return HttpResponse.json({
        ...fixture.summary,
        groups: synthesiseGroups(fixture.computers, groupBy),
        kernel_usns_waived_count: fixture.summary.kernel_usns_waived_count ?? 0,
      });
    }
    return HttpResponse.json(fixture.summary);
  }),

  // GET /api/v2/health/top-detractors?limit=N — derived from the active
  // fleet fixture so the Overview's "Top issues" panel stays in sync with
  // the per-row breakdowns operators see in the table.
  http.get<never, never, { results: FleetTopDetractor[] }>(
    `${API_URL}health/top-detractors`,
    ({ request }) => {
      const endpointStatus = getEndpointStatus();
      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
      const url = new URL(request.url);
      const limitRaw = url.searchParams.get("limit");
      const limit = limitRaw ? Math.max(1, Number(limitRaw)) : 3;
      const { computers } = getHealthFixture();
      return HttpResponse.json({
        results: getFleetTopDetractors(computers, limit),
      });
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
  >(`${API_URL}computers/:computer_id/health/actions`, async ({ params, request }) => {
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
  }),

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
          activity_id: body.action === "refresh-facts" ? null : nextActivityId++,
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
