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
  description?: string;
  definition?: Record<string, unknown>;
  enabled?: boolean;
}

interface UpdateRuleBody {
  weight?: number;
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
  http.get<never, never, FleetHealthSummary>(`${API_URL}health/summary`, () => {
    const endpointStatus = getEndpointStatus();
    if (endpointStatus.status === "error") {
      throw createEndpointStatusError();
    }
    if (endpointStatus.status === "loading") {
      // Never resolves — exercises the loading state.
      return new Promise<never>(() => {
        /* intentionally never resolves */
      });
    }
    return HttpResponse.json(getHealthFixture().summary);
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
];
