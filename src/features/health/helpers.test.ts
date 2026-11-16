import { describe, expect, it } from "vitest";
import { actionsForFactor, recommendedActionsFor, ruleTitle } from "./helpers";
import type { HealthFactor } from "./types";

const factor = (overrides: Partial<HealthFactor>): HealthFactor => ({
  rule_id: 1,
  rule_key: "usn.high",
  description: "High-severity security notice",
  points: 20,
  ...overrides,
});

describe("actionsForFactor", () => {
  it("offers the mapped action when no fix waits for a reboot", () => {
    expect(actionsForFactor(factor({ count: 2 }))).toEqual([
      "run-security-updates",
    ]);
  });

  it("offers a reboot first when some fixes wait for one", () => {
    expect(
      actionsForFactor(factor({ count: 3, pending_reboot_count: 2 })),
    ).toEqual(["reboot", "run-security-updates"]);
  });

  it("offers only a reboot when every fix is installed", () => {
    expect(
      actionsForFactor(factor({ count: 2, pending_reboot_count: 2 })),
    ).toEqual(["reboot"]);
  });

  it("keeps the mapped action when the total count is unknown", () => {
    expect(actionsForFactor(factor({ pending_reboot_count: 1 }))).toEqual([
      "reboot",
      "run-security-updates",
    ]);
  });

  it("offers nothing for a rule without a mapped action", () => {
    expect(actionsForFactor(factor({ rule_key: "unknown.rule" }))).toEqual([]);
  });
});

describe("ruleTitle", () => {
  it("prefers the title, then the description, then the rule key", () => {
    expect(
      ruleTitle({ rule_key: "usn.high", title: "T", description: "D" }),
    ).toBe("T");
    expect(ruleTitle({ rule_key: "usn.high", description: "D" })).toBe("D");
    expect(ruleTitle({ rule_key: "usn.high" })).toBe("usn.high");
  });
});

describe("recommendedActionsFor", () => {
  it("lists each action once and always ends with the diagnostic script", () => {
    expect(
      recommendedActionsFor([
        factor({ count: 1, pending_reboot_count: 1 }),
        factor({ rule_id: 2, rule_key: "reboot_required" }),
        factor({ rule_id: 3, rule_key: "usn.medium" }),
      ]),
    ).toEqual(["reboot", "run-security-updates", "run-diagnostic-script"]);
  });
});
