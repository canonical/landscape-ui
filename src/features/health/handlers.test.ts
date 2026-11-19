// LA061 — MSW handler tests for the Health endpoints.
//
// Exercises the response shapes and per-status branches (default / empty /
// error / loading) without spinning up React. The handler module is the
// boundary every UI consumer talks to in tests and in the demo path.

import { API_URL } from "@/constants";
import server from "@/tests/server";
import {
  manyFactorsComputer,
  seededRules,
  setHealthFixture,
} from "@/tests/mocks/health";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const HTTP_OK = 200;
const HTTP_NO_CONTENT = 204;
const HTTP_NOT_FOUND = 404;

// Per-account override weight used by the round-trip tests.
const OVERRIDE_WEIGHT_USN_HIGH = 50;

const JSON_HEADERS = { "Content-Type": "application/json" };

beforeEach(() => {
  setHealthFixture("mixedFleet");
  setEndpointStatus("default");
});

afterEach(() => {
  setHealthFixture("mixedFleet");
  setEndpointStatus("default");
  server.resetHandlers();
});

const get = (path: string, init?: RequestInit) =>
  fetch(`${API_URL}${path}`, init);

describe("GET /health/rules", () => {
  it("returns the seeded system defaults with the rules version", async () => {
    const res = await get("health/rules");
    expect(res.status).toBe(HTTP_OK);
    const body = (await res.json()) as {
      rules_version: number;
      results: { rule_key: string }[];
    };
    expect(body.rules_version).toBeGreaterThan(0);
    const keys = new Set(body.results.map((r) => r.rule_key));
    expect(keys).toEqual(
      new Set([
        "usn.critical",
        "usn.high",
        "usn.medium",
        "usn.low",
        "usn.unrated",
        "reboot_required",
        "instance.offline",
        "package.updates_available",
      ]),
    );
  });

  it("returns an empty list under the `empty` endpoint status", async () => {
    setEndpointStatus("empty");
    const res = await get("health/rules");
    const body = (await res.json()) as { results: unknown[] };
    expect(body.results).toEqual([]);
  });

  it("errors under the `error` endpoint status", async () => {
    setEndpointStatus("error");
    const res = await get("health/rules");
    expect(res.ok).toBe(false);
  });
});

describe("PATCH /health/rules/:rule_key (Phase 2 sketch)", () => {
  afterEach(async () => {
    await get("health/rules/usn.high", { method: "DELETE" });
  });

  it("creates an override that the list returns as the effective rule", async () => {
    const patch = await get("health/rules/usn.high", {
      method: "PATCH",
      body: JSON.stringify({ weight: OVERRIDE_WEIGHT_USN_HIGH }),
      headers: JSON_HEADERS,
    });
    expect(patch.status).toBe(HTTP_OK);

    const body = (await (await get("health/rules")).json()) as {
      results: {
        rule_key: string;
        weight: number;
        scope: string;
        overrides_system_default: boolean;
      }[];
    };
    const matches = body.results.filter((r) => r.rule_key === "usn.high");
    // The shadowed default is not returned twice.
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({
      weight: OVERRIDE_WEIGHT_USN_HIGH,
      scope: "account",
      overrides_system_default: true,
    });
  });

  it("hides a disabled rule unless include_disabled is set", async () => {
    await get("health/rules/usn.high", {
      method: "PATCH",
      body: JSON.stringify({ enabled: false }),
      headers: JSON_HEADERS,
    });
    const keysOf = async (path: string) =>
      (
        (await (await get(path)).json()) as { results: { rule_key: string }[] }
      ).results.map((r) => r.rule_key);

    expect(await keysOf("health/rules")).not.toContain("usn.high");
    expect(await keysOf("health/rules?include_disabled=true")).toContain(
      "usn.high",
    );
  });

  it("DELETE removes the override and restores the default", async () => {
    await get("health/rules/usn.high", {
      method: "PATCH",
      body: JSON.stringify({ weight: OVERRIDE_WEIGHT_USN_HIGH }),
      headers: JSON_HEADERS,
    });
    const del = await get("health/rules/usn.high", { method: "DELETE" });
    expect(del.status).toBe(HTTP_NO_CONTENT);

    const body = (await (await get("health/rules")).json()) as {
      results: { rule_key: string; scope: string }[];
    };
    expect(body.results.find((r) => r.rule_key === "usn.high")?.scope).toBe(
      "system",
    );
  });

  it("answers 404 for an unknown rule or a rule without an override", async () => {
    const patch = await get("health/rules/no.such.rule", {
      method: "PATCH",
      body: JSON.stringify({ weight: 1 }),
      headers: JSON_HEADERS,
    });
    expect(patch.status).toBe(HTTP_NOT_FOUND);
    const del = await get("health/rules/usn.low", { method: "DELETE" });
    expect(del.status).toBe(HTTP_NOT_FOUND);
  });
});

describe("GET /computers/:id/health", () => {
  it("returns the manyFactors fixture for the demo id", async () => {
    const res = await get(
      `computers/${manyFactorsComputer.computer_id}/health`,
    );
    const body = await res.json();
    expect(body.factors).toHaveLength(manyFactorsComputer.factors.length);
    expect(body.measurable).toBe(true);
    expect(body.stale_reason).toBeNull();
    const keys = new Set(
      body.factors.map((f: { rule_key: string }) => f.rule_key),
    );
    expect(keys.has("usn.low")).toBe(true);
    expect(keys.has("usn.unrated")).toBe(true);
    expect(keys.has("package.updates_available")).toBe(true);
  });

  it("answers measurable: false and nothing else without a state row", async () => {
    const res = await get("computers/1234567/health");
    expect(await res.json()).toEqual({
      computer_id: 1234567,
      measurable: false,
    });
  });
});

describe("GET /health/summary", () => {
  it("returns the active fixture's summary", async () => {
    setHealthFixture("crisisFleet");
    const res = await get("health/summary");
    const body = await res.json();
    expect(body.bands.critical).toBeGreaterThan(0);
    expect(body.bands.critical + body.bands.warning + body.bands.healthy).toBe(
      body.measured_count,
    );
    expect(body.thresholds).toEqual({ critical_max: 25, warning_max: 60 });
  });

  it("carries the per-rule breakdown as top_issues", async () => {
    const body = await (await get("health/summary")).json();
    expect(body.top_issues.length).toBeGreaterThan(0);
    expect(body.top_issues[0]).toEqual({
      rule_key: expect.any(String),
      title: expect.any(String),
      computer_count: expect.any(Number),
      points_sum: expect.any(Number),
    });
  });

  it("switches when the fixture switches at runtime", async () => {
    setHealthFixture("healthyFleet");
    const before = await (await get("health/summary")).json();
    setHealthFixture("crisisFleet");
    const after = await (await get("health/summary")).json();
    expect(before.bands.critical).toBe(0);
    expect(after.bands.critical).toBeGreaterThan(0);
  });

  it("returns the empty summary when fixture is `emptyFleet`", async () => {
    setHealthFixture("emptyFleet");
    const body = await (await get("health/summary")).json();
    expect(body.total_count).toBe(0);
    expect(body.average_score).toBeNull();
  });

  it("reports a recompute in progress with zero counters", async () => {
    setHealthFixture("recomputingFleet");
    const body = await (await get("health/summary")).json();
    expect(body.recompute_in_progress).toBe(true);
    expect(body.measured_count).toBe(0);
    expect(body.rules_version).toBeNull();
  });

  it("exposes the Livepatch waiver demo fleet", async () => {
    setHealthFixture("livepatchWaiverFleet");
    const summary = await (await get("health/summary")).json();
    expect(summary.total_count).toBe(2);
    expect(summary.bands.critical).toBe(1);
    expect(summary.bands.healthy).toBe(1);
  });
});

describe("GET /computers with health parameters", () => {
  interface Row {
    id: number;
    health?: { measurable: boolean; score?: number; band?: string };
  }
  const list = async (params: string): Promise<Row[]> =>
    (
      (await (await get(`computers?limit=200&${params}`)).json()) as {
        results: Row[];
      }
    ).results;

  it("adds the health state resource to each row with with_health", async () => {
    const rows = await list("with_health=true");
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(typeof row.health?.measurable).toBe("boolean");
    }
    expect((await list(""))[0]?.health).toBeUndefined();
  });

  it("orders worst first with unmeasured last under sort=health", async () => {
    const rows = await list("with_health=true&sort=health");
    const scores = rows.map(({ health }) =>
      health?.measurable ? (health.score ?? 0) : Number.POSITIVE_INFINITY,
    );
    expect(scores).toEqual([...scores].sort((a, b) => a - b));
  });

  it("filters on bands, with unmeasured matching rows without a score", async () => {
    const critical = await list("with_health=true&health_band=critical");
    expect(critical.length).toBeGreaterThan(0);
    expect(critical.every(({ health }) => health?.band === "critical")).toBe(
      true,
    );
    const unmeasured = await list("with_health=true&health_band=unmeasured");
    expect(unmeasured.length).toBeGreaterThan(0);
    expect(unmeasured.every(({ health }) => health?.measurable === false)).toBe(
      true,
    );
  });
});

describe("seededRules cross-check", () => {
  it("every seededRule rule_key appears in the handler list", async () => {
    // The handler's in-memory overrides may carry rows from earlier tests in
    // the same run; we only assert every system-default rule is covered.
    const res = await get("health/rules");
    const body = (await res.json()) as {
      results: { rule_key: string }[];
    };
    const handlerKeys = new Set(body.results.map((r) => r.rule_key));
    for (const r of seededRules) {
      expect(handlerKeys.has(r.rule_key)).toBe(true);
    }
  });
});
