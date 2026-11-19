// LA061 — fixture sanity tests. Keeps the demo fixtures honest (sums match
// summary counters, seeded rules match the data model document, runtime
// switcher round-trips).

import { describe, expect, it } from "vitest";
import {
  crisisFleet,
  emptyFleet,
  fixtures,
  getComputerHealth,
  getHealthFixture,
  healthyFleet,
  livepatchWaiverFleet,
  manyFactorsComputer,
  mixedFleet,
  recomputingFleet,
  seededRules,
  setHealthFixture,
} from "@/tests/mocks/health";

const RULE_KEYS = [
  "usn.critical",
  "usn.high",
  "usn.medium",
  "usn.low",
  "usn.unrated",
  "reboot_required",
  "instance.offline",
  "package.updates_available",
] as const;

// Weights from the data model document's seeded rules table.
const W_USN_HIGH = 20;
const W_OFFLINE = 20;

// Default band thresholds.
const CRITICAL_MAX = 25;
const WARNING_MAX = 60;

describe("seededRules", () => {
  it("holds the eight seeded system rules", () => {
    const keys = seededRules.map((r) => r.rule_key);
    expect(new Set(keys)).toEqual(new Set(RULE_KEYS));
    expect(seededRules).toHaveLength(RULE_KEYS.length);
  });

  it("uses the spec weights", () => {
    const byKey = Object.fromEntries(seededRules.map((r) => [r.rule_key, r]));
    expect(byKey["usn.critical"]!.weight).toBe(100);
    expect(byKey["usn.high"]!.weight).toBe(W_USN_HIGH);
    expect(byKey["usn.medium"]!.weight).toBe(5);
    expect(byKey["usn.low"]!.weight).toBe(1);
    expect(byKey["usn.unrated"]!.weight).toBe(5);
    expect(byKey.reboot_required!.weight).toBe(10);
    expect(byKey["instance.offline"]!.weight).toBe(W_OFFLINE);
    expect(byKey["package.updates_available"]!.weight).toBe(1);
  });

  it("flags every seed row as a system default", () => {
    for (const r of seededRules) {
      expect(r.scope).toBe("system");
      expect(r.overrides_system_default).toBe(false);
    }
  });
});

describe.each([
  ["healthyFleet", healthyFleet],
  ["mixedFleet", mixedFleet],
  ["crisisFleet", crisisFleet],
  ["emptyFleet", emptyFleet],
  ["recomputingFleet", recomputingFleet],
  ["livepatchWaiverFleet", livepatchWaiverFleet],
])("%s consistency", (_name, fleet) => {
  it("measured bands sum to measured_count, and with unmeasured to total_count", () => {
    const { bands, measured_count, total_count } = fleet.summary;
    expect(bands.critical + bands.warning + bands.healthy).toBe(measured_count);
    expect(measured_count + bands.unmeasured).toBe(total_count);
  });

  it("computer count matches summary.measured_count", () => {
    expect(fleet.computers).toHaveLength(fleet.summary.measured_count);
  });

  it("top_issues counts each rule's instances, most instances first", () => {
    const { top_issues } = fleet.summary;
    for (const issue of top_issues) {
      expect(issue.computer_count).toBe(
        fleet.computers.filter((c) =>
          c.factors.some((f) => f.rule_key === issue.rule_key),
        ).length,
      );
    }
    const counts = top_issues.map((issue) => issue.computer_count);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
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
    expect(nonPro.factors.some((f) => f.rule_key === "usn.critical")).toBe(
      true,
    );
    expect(nonPro.critical_factor_count).toBeGreaterThanOrEqual(1);
  });
});

describe("recomputingFleet", () => {
  it("reads as the window after the feature is enabled", () => {
    const { summary } = recomputingFleet;
    expect(summary.recompute_in_progress).toBe(true);
    expect(summary.rules_version).toBeNull();
    expect(summary.average_score).toBeNull();
    expect(summary.measured_count).toBe(0);
  });
});

describe("getComputerHealth", () => {
  it("answers measurable: false for a computer without a state row", () => {
    const unknownId = 1234567;
    expect(getComputerHealth(unknownId)).toEqual({
      computer_id: unknownId,
      measurable: false,
    });
  });

  it("returns the full state resource for a scored computer", () => {
    const health = getComputerHealth(manyFactorsComputer.computer_id);
    expect(health).toMatchObject({
      measurable: true,
      stale: false,
      stale_reason: null,
    });
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
        "recomputingFleet",
        "livepatchWaiverFleet",
      ]),
    );
  });
});
