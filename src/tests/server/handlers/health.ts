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
  type HealthRule,
  getHealthFixture,
  manyFactorsComputer,
  seededRules,
} from "@/tests/mocks/health";
import { http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";

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
  http.put<{ id: string }, UpdateRuleBody, HealthRule>(
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
        return HttpResponse.json(manyFactorsComputer);
      }
      const found = computers.find((c) => c.computer_id === id);
      if (found) {
        return HttpResponse.json(found);
      }
      // No state yet — server returns the 100-score placeholder per the spec.
      return HttpResponse.json({
        computer_id: id,
        account_id: 1,
        score: 100,
        band: "healthy" as const,
        critical_factor_count: 0,
        factors: [],
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
];
