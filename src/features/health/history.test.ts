import { describe, expect, it } from "vitest";
import {
  addDays,
  daysBetween,
  factorChanges,
  historyWindow,
  measurementChanges,
  ruleCountChanges,
  scoreChange,
} from "./history";
import type { FleetHealthHistoryRow, HealthRuleHistoryRow } from "./types";

const THIRTY_DAYS = 30;

const fleetRow = (
  row: Pick<FleetHealthHistoryRow, "date" | "average_score"> &
    Partial<FleetHealthHistoryRow>,
): FleetHealthHistoryRow => ({
  bands: { critical: 0, warning: 0, healthy: 10, unmeasured: 0 },
  measured_count: 10,
  rules_version: 7,
  engine_version: 1,
  ...row,
});

const ruleRow = (
  row: Pick<HealthRuleHistoryRow, "date" | "rule_key" | "computer_count">,
): HealthRuleHistoryRow => ({ points_sum: 0, weight: 10, ...row });

describe("history dates", () => {
  it("moves a day across a month boundary", () => {
    expect(addDays("2026-08-31", 1)).toBe("2026-09-01");
    expect(daysBetween("2026-08-31", "2026-09-02")).toBe(2);
  });

  it("builds an inclusive window that ends today in UTC", () => {
    expect(
      historyWindow(THIRTY_DAYS, new Date("2026-09-10T23:30:00Z")),
    ).toEqual({
      from: "2026-08-11",
      to: "2026-09-10",
    });
  });
});

describe("scoreChange", () => {
  it("compares the latest day with the day a week before it", () => {
    const rows = [
      fleetRow({ date: "2026-09-01", average_score: 70 }),
      fleetRow({ date: "2026-09-03", average_score: 74 }),
      fleetRow({ date: "2026-09-10", average_score: 80 }),
    ];
    expect(scoreChange(rows)).toEqual({
      delta: 6,
      since: "2026-09-03",
      comparable: true,
    });
  });

  it("falls back to the nearest earlier day when that day is missing", () => {
    const rows = [
      fleetRow({ date: "2026-09-01", average_score: 70 }),
      fleetRow({ date: "2026-09-10", average_score: 80 }),
    ];
    expect(scoreChange(rows)?.since).toBe("2026-09-01");
  });

  it("flags a comparison that spans a rules change", () => {
    const rows = [
      fleetRow({ date: "2026-09-03", average_score: 74, rules_version: 6 }),
      fleetRow({ date: "2026-09-10", average_score: 80, rules_version: 7 }),
    ];
    expect(scoreChange(rows)?.comparable).toBe(false);
  });

  it("returns null without a week of history", () => {
    expect(scoreChange([])).toBeNull();
    expect(
      scoreChange([fleetRow({ date: "2026-09-10", average_score: 80 })]),
    ).toBeNull();
  });
});

describe("ruleCountChanges", () => {
  const fleet = [
    fleetRow({ date: "2026-09-03", average_score: 74 }),
    fleetRow({ date: "2026-09-10", average_score: 80 }),
  ];

  it("returns the change in matching instances per rule", () => {
    const rules = [
      ruleRow({
        date: "2026-09-03",
        rule_key: "reboot_required",
        computer_count: 50,
      }),
      ruleRow({
        date: "2026-09-10",
        rule_key: "reboot_required",
        computer_count: 57,
      }),
    ];
    expect(ruleCountChanges(fleet, rules)).toEqual({ reboot_required: 7 });
  });

  it("treats a rule without a row on a recorded day as zero", () => {
    const rules = [
      ruleRow({ date: "2026-09-03", rule_key: "usn.high", computer_count: 4 }),
      ruleRow({ date: "2026-09-10", rule_key: "usn.low", computer_count: 2 }),
    ];
    expect(ruleCountChanges(fleet, rules)).toEqual({
      "usn.high": -4,
      "usn.low": 2,
    });
  });

  it("returns null when there is no day to compare with", () => {
    expect(
      ruleCountChanges(
        [fleetRow({ date: "2026-09-10", average_score: 80 })],
        [],
      ),
    ).toBeNull();
  });
});

describe("measurementChanges", () => {
  it("marks the day the rules version differs from the previous row", () => {
    const rows = [
      fleetRow({ date: "2026-09-01", average_score: 70, rules_version: 6 }),
      fleetRow({ date: "2026-09-02", average_score: 73, rules_version: 7 }),
      fleetRow({ date: "2026-09-03", average_score: 73, rules_version: 7 }),
    ];
    expect(measurementChanges(rows)).toEqual([
      { date: "2026-09-02", label: "Rules changed" },
    ]);
  });

  it("marks an engine version change", () => {
    const rows = [
      fleetRow({ date: "2026-09-01", average_score: 70 }),
      {
        ...fleetRow({ date: "2026-09-02", average_score: 70 }),
        engine_version: 2,
      },
    ];
    expect(measurementChanges(rows)).toEqual([
      { date: "2026-09-02", label: "Scoring updated" },
    ]);
  });
});

describe("factorChanges", () => {
  it("lists rules that appeared, cleared and changed", () => {
    const previous = {
      factors: [
        { rule_key: "reboot_required", count: 1, points: 10 },
        { rule_key: "usn.high", count: 1, points: 20 },
      ],
    };
    const next = {
      factors: [
        { rule_key: "usn.high", count: 2, points: 40 },
        { rule_key: "usn.low", count: 1, points: 1 },
      ],
    };
    expect(factorChanges(previous, next)).toEqual([
      { rule_key: "usn.high", kind: "changed", from: 20, to: 40 },
      { rule_key: "usn.low", kind: "added", from: 0, to: 1 },
      { rule_key: "reboot_required", kind: "removed", from: 10, to: 0 },
    ]);
  });

  it("treats every factor as new when there is no previous row", () => {
    expect(
      factorChanges(null, {
        factors: [{ rule_key: "usn.low", count: 1, points: 1 }],
      }),
    ).toEqual([{ rule_key: "usn.low", kind: "added", from: 0, to: 1 }]);
  });
});
