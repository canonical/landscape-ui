// LA061 Phase 1.5 — fixture sanity tests. Keeps the demo fixtures honest
// (sums match summary counters, seeded rule shape matches the server
// SEEDED_RULES table, runtime switcher round-trips).

import { describe, expect, it } from "vitest";
import {
  crisisFleet,
  emptyFleet,
  fixtures,
  getHealthFixture,
  healthyFleet,
  livepatchWaiverFleet,
  manyFactorsComputer,
  mixedFleet,
  seededRules,
  setHealthFixture,
} from "@/tests/mocks/health";

const RULE_KEYS = [
  "usn.critical",
  "usn.high",
  "usn.medium",
  "usn.low",
  "reboot_required",
  "instance.offline",
  "package.updates_available",
] as const;

// Spec weights (mirrors `canonical.landscape.health.seed.SEEDED_RULES`).
const W_USN_HIGH = 20;
const W_OFFLINE = 20;

// Band thresholds (mirror `canonical/landscape/health/bands.py`).
const CRITICAL_MAX = 25;
const WARNING_MAX = 60;

describe("seededRules", () => {
  it("matches the Phase 1.5 server-side SEEDED_RULES set", () => {
    const keys = seededRules.map((r) => r.rule_key);
    expect(new Set(keys)).toEqual(new Set(RULE_KEYS));
    expect(seededRules).toHaveLength(7);
  });

  it("uses the spec weights", () => {
    const byKey = Object.fromEntries(seededRules.map((r) => [r.rule_key, r]));
    expect(byKey["usn.critical"]!.weight).toBe(100);
    expect(byKey["usn.high"]!.weight).toBe(W_USN_HIGH);
    expect(byKey["usn.medium"]!.weight).toBe(5);
    expect(byKey["usn.low"]!.weight).toBe(1);
    expect(byKey.reboot_required!.weight).toBe(10);
    expect(byKey["instance.offline"]!.weight).toBe(W_OFFLINE);
    expect(byKey["package.updates_available"]!.weight).toBe(1);
  });

  it("flags every seed row as a system default", () => {
    for (const r of seededRules) {
      expect(r.is_system_default).toBe(true);
      expect(r.account_id).toBeNull();
    }
  });
});

describe.each([
  ["healthyFleet", healthyFleet],
  ["mixedFleet", mixedFleet],
  ["crisisFleet", crisisFleet],
  ["emptyFleet", emptyFleet],
  ["livepatchWaiverFleet", livepatchWaiverFleet],
])("%s consistency", (_name, fleet) => {
  it("summary band counts sum to total_count", () => {
    const { summary } = fleet;
    expect(
      summary.band_critical_count
        + summary.band_warning_count
        + summary.band_healthy_count,
    ).toBe(summary.total_count);
  });

  it("computer count matches summary.total_count", () => {
    expect(fleet.computers).toHaveLength(fleet.summary.total_count);
  });

  it("each computer's band matches its score band", () => {
    for (const c of fleet.computers) {
      if (c.score <= CRITICAL_MAX) {
        expect(c.band).toBe("critical");
      } else if (c.score <= WARNING_MAX) {
        expect(c.band).toBe("warning");
      } else {
        expect(c.band).toBe("healthy");
      }
    }
  });
});

describe("manyFactorsComputer", () => {
  it("carries every seeded rule_key once", () => {
    const keys = manyFactorsComputer.factors.map((f) => f.rule_key);
    expect(new Set(keys)).toEqual(new Set(RULE_KEYS));
  });
});

describe("livepatchWaiverFleet", () => {
  it("includes one Pro/Livepatched and one non-Pro computer", () => {
    expect(livepatchWaiverFleet.computers).toHaveLength(2);
    const [pro, nonPro] = livepatchWaiverFleet.computers as [
      (typeof livepatchWaiverFleet.computers)[number],
      (typeof livepatchWaiverFleet.computers)[number],
    ];
    // Pro: kernel USN waived, only reboot remains → stays healthy.
    expect(pro.band).toBe("healthy");
    expect(pro.factors.some((f) => f.rule_key === "usn.critical")).toBe(false);
    // Non-Pro: full critical penalty applies.
    expect(nonPro.band).toBe("critical");
    expect(nonPro.factors.some((f) => f.rule_key === "usn.critical")).toBe(true);
    expect(nonPro.critical_factor_count).toBeGreaterThanOrEqual(1);
  });
});

describe("setHealthFixture", () => {
  it("switches the active fixture in place", () => {
    setHealthFixture("crisisFleet");
    expect(getHealthFixture()).toBe(crisisFleet);
    setHealthFixture("healthyFleet");
    expect(getHealthFixture()).toBe(healthyFleet);
    setHealthFixture("livepatchWaiverFleet");
    expect(getHealthFixture()).toBe(livepatchWaiverFleet);
    // Reset to default so other tests start from a known state.
    setHealthFixture("mixedFleet");
  });

  it("exposes every fixture", () => {
    expect(new Set(Object.keys(fixtures))).toEqual(
      new Set([
        "healthyFleet",
        "mixedFleet",
        "crisisFleet",
        "emptyFleet",
        "livepatchWaiverFleet",
      ]),
    );
  });
});
