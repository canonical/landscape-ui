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
import {
  setEndpointStatus,
} from "@/tests/controllers/controller";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_NOT_FOUND = 404;

// Per-account override weights used by the CRUD round-trip tests.
const OVERRIDE_WEIGHT_USN_HIGH = 50;
const PUT_UPDATED_WEIGHT = 12;

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
  it("returns the Phase 1.5 seven seeded system defaults", async () => {
    const res = await get("health/rules");
    expect(res.status).toBe(HTTP_OK);
    const body = (await res.json()) as { results: { rule_key: string }[] };
    const keys = new Set(body.results.map((r) => r.rule_key));
    expect(keys).toEqual(
      new Set([
        "usn.critical",
        "usn.high",
        "usn.medium",
        "usn.low",
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

describe("POST /health/rules — per-account override CRUD", () => {
  it("creates an override and reads it back via GET", async () => {
    const post = await get("health/rules", {
      method: "POST",
      body: JSON.stringify({
        rule_key: "usn.high",
        weight: OVERRIDE_WEIGHT_USN_HIGH,
        description: "Override for usn.high",
      }),
      headers: { "Content-Type": "application/json" },
    });
    expect(post.status).toBe(HTTP_CREATED);
    const created = (await post.json()) as { id: number; rule_key: string };
    expect(created.rule_key).toBe("usn.high");

    const list = await get("health/rules");
    const body = (await list.json()) as { results: { rule_key: string; weight: number; is_system_default: boolean }[] };
    const usnHigh = body.results.find((r) => r.rule_key === "usn.high");
    // Override wins over the system default.
    expect(usnHigh?.weight).toBe(OVERRIDE_WEIGHT_USN_HIGH);
    expect(usnHigh?.is_system_default).toBe(false);
  });

  it("PUT updates an existing override", async () => {
    const post = await get("health/rules", {
      method: "POST",
      body: JSON.stringify({ rule_key: "usn.medium", weight: 7 }),
      headers: { "Content-Type": "application/json" },
    });
    const { id } = (await post.json()) as { id: number };

    const put = await get(`health/rules/${id}`, {
      method: "PUT",
      body: JSON.stringify({ weight: PUT_UPDATED_WEIGHT }),
      headers: { "Content-Type": "application/json" },
    });
    const updated = (await put.json()) as { weight: number };
    expect(updated.weight).toBe(PUT_UPDATED_WEIGHT);
  });

  it("DELETE removes the override", async () => {
    const post = await get("health/rules", {
      method: "POST",
      body: JSON.stringify({ rule_key: "usn.low", weight: 2 }),
      headers: { "Content-Type": "application/json" },
    });
    const { id } = (await post.json()) as { id: number };

    const del = await get(`health/rules/${id}`, { method: "DELETE" });
    expect(del.status).toBe(HTTP_NO_CONTENT);
  });

  it("DELETE of unknown id returns 404", async () => {
    const res = await get("health/rules/99999", { method: "DELETE" });
    expect(res.status).toBe(HTTP_NOT_FOUND);
  });
});

describe("GET /computers/:id/health", () => {
  it("returns the manyFactors fixture for the demo id", async () => {
    const res = await get(`computers/${manyFactorsComputer.computer_id}/health`);
    const body = await res.json();
    expect(body.factors).toHaveLength(manyFactorsComputer.factors.length);
    // Phase 1.5 — the wide breakdown must include the new rule keys.
    const keys = new Set(body.factors.map((f: { rule_key: string }) => f.rule_key));
    expect(keys.has("usn.low")).toBe(true);
    expect(keys.has("package.updates_available")).toBe(true);
  });

  it("falls back to a 100-score placeholder for an unknown computer", async () => {
    const res = await get("computers/1234567/health");
    const body = await res.json();
    expect(body.score).toBe(100);
    expect(body.band).toBe("healthy");
    expect(body.factors).toEqual([]);
  });
});

describe("GET /health/summary", () => {
  it("returns the active fixture's summary", async () => {
    setHealthFixture("crisisFleet");
    const res = await get("health/summary");
    const body = await res.json();
    expect(body.band_critical_count).toBeGreaterThan(0);
    expect(
      body.band_critical_count
        + body.band_warning_count
        + body.band_healthy_count,
    ).toBe(body.total_count);
  });

  it("switches when the fixture switches at runtime", async () => {
    setHealthFixture("healthyFleet");
    const before = await (await get("health/summary")).json();
    setHealthFixture("crisisFleet");
    const after = await (await get("health/summary")).json();
    expect(before.band_critical_count).toBe(0);
    expect(after.band_critical_count).toBeGreaterThan(0);
  });

  it("returns the empty summary when fixture is `emptyFleet`", async () => {
    setHealthFixture("emptyFleet");
    const body = await (await get("health/summary")).json();
    expect(body.total_count).toBe(0);
  });

  it("exposes the Livepatch waiver demo fleet", async () => {
    setHealthFixture("livepatchWaiverFleet");
    const summary = await (await get("health/summary")).json();
    expect(summary.total_count).toBe(2);
    expect(summary.band_critical_count).toBe(1);
    expect(summary.band_healthy_count).toBe(1);
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
