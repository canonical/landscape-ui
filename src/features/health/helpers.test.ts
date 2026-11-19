import { describe, expect, it } from "vitest";
import {
  actionsForFactor,
  recommendedActionsFor,
  ruleTitle,
  staleReasonText,
} from "./helpers";
import type { HealthFactor } from "./types";

const factor = (overrides: Partial<HealthFactor>): HealthFactor => ({
  rule_key: "usn.high",
  kind: "usn.severity_band",
  title: "High-severity security notice",
  count: 1,
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

  it("maps an unrated security notice to security updates", () => {
    expect(actionsForFactor(factor({ rule_key: "usn.unrated" }))).toEqual([
      "run-security-updates",
    ]);
  });

  it("offers nothing for a rule without a mapped action", () => {
    expect(actionsForFactor(factor({ rule_key: "unknown.rule" }))).toEqual([]);
  });
});

describe("ruleTitle", () => {
  it("prefers the title and falls back to the rule key", () => {
    expect(ruleTitle({ rule_key: "usn.high", title: "T" })).toBe("T");
    expect(ruleTitle({ rule_key: "usn.high" })).toBe("usn.high");
  });
});

describe("staleReasonText", () => {
  it("explains each reason and stays silent for a current score", () => {
    expect(staleReasonText({ stale_reason: null })).toBeNull();
    expect(staleReasonText({ stale_reason: "inputs" })).toMatch(
      /not reported recently/,
    );
    expect(staleReasonText({ stale_reason: "rules" })).toMatch(/rules changed/);
    expect(staleReasonText({ stale_reason: "engine" })).toMatch(
      /Scoring was updated/,
    );
  });
});

describe("recommendedActionsFor", () => {
  it("lists each action once and always ends with the diagnostic script", () => {
    expect(
      recommendedActionsFor([
        factor({ count: 1, pending_reboot_count: 1 }),
        factor({ rule_key: "reboot_required" }),
        factor({ rule_key: "usn.medium" }),
      ]),
    ).toEqual(["reboot", "run-security-updates", "run-diagnostic-script"]);
  });
});
