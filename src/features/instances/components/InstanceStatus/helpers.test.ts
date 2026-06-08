import { ubuntuCoreInstance, ubuntuInstance } from "@/tests/mocks/instance";
import type { Instance } from "@/types/Instance";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import {
  getInstanceStatuses,
  getUpgradeStatuses,
  splitStatuses,
} from "./helpers";

describe("getInstanceStatuses", () => {
  it("returns a neutral 'Archived' status for archived instances", () => {
    const result = getInstanceStatuses({ ...ubuntuInstance, archived: true });
    expect(result).toEqual([
      {
        key: "archived",
        label: "Archived",
        icon: "archive",
        severity: "neutral",
        filterValue: "archived",
      },
    ]);
  });

  it("returns a single 'Online' status when there are no relevant alerts", () => {
    const result = getInstanceStatuses({
      ...ubuntuInstance,
      archived: false,
      alerts: [],
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.label).toBe("Online");
    expect(result[0]?.severity).toBe("info");
  });

  it("ignores upgrade alerts, which belong to the Upgrades column", () => {
    const result = getInstanceStatuses({
      ...ubuntuInstance,
      archived: false,
      alerts: [
        { type: "PackageUpgradesAlert", summary: "Regular", severity: "info" },
        {
          type: "SecurityUpgradesAlert",
          summary: "Security",
          severity: "warning",
        },
      ],
    } as Instance);
    // No remaining alerts -> falls back to Online.
    expect(result).toHaveLength(1);
    expect(result[0]?.label).toBe("Online");
  });

  it("derives severity from the icon colour and sorts danger first", () => {
    const result = getInstanceStatuses({
      ...ubuntuInstance,
      archived: false,
      alerts: [
        {
          type: "PackageProfilesAlert",
          summary: "Profiles",
          severity: "warning",
        },
        {
          type: "ComputerOfflineAlert",
          summary: "Offline",
          severity: "danger",
        },
      ],
    } as Instance);

    expect(result.map((status) => status.severity)).toEqual([
      "danger",
      "warning",
    ]);
    expect(result[0]?.label).toBe("Offline");
  });
});

describe("splitStatuses", () => {
  it("keeps every danger status visible and collapses the rest", () => {
    const { visible, hidden } = splitStatuses([
      {
        key: "a",
        label: "Offline",
        icon: "disconnect-color",
        severity: "danger",
      },
      {
        key: "b",
        label: "Reporter",
        icon: "package-reporter-alert",
        severity: "danger",
      },
      {
        key: "c",
        label: "Profiles",
        icon: "package-profiles-alert",
        severity: "warning",
      },
    ]);

    expect(visible.map((status) => status.key)).toEqual(["a", "b"]);
    expect(hidden.map((status) => status.key)).toEqual(["c"]);
  });

  it("shows the single most severe status when there are no danger statuses", () => {
    const { visible, hidden } = splitStatuses([
      {
        key: "a",
        label: "Profiles",
        icon: "package-profiles-alert",
        severity: "warning",
      },
      { key: "b", label: "Online", icon: "connected-color", severity: "info" },
    ]);

    expect(visible.map((status) => status.key)).toEqual(["a"]);
    expect(hidden.map((status) => status.key)).toEqual(["b"]);
  });

  it("hides nothing for a single status", () => {
    const { visible, hidden } = splitStatuses([
      { key: "a", label: "Online", icon: "connected-color", severity: "info" },
    ]);

    expect(visible).toHaveLength(1);
    expect(hidden).toHaveLength(0);
  });
});

describe("getUpgradeStatuses", () => {
  it("returns no statuses when the instance has no packages feature", () => {
    expect(getUpgradeStatuses(ubuntuCoreInstance)).toEqual([]);
  });

  it("returns a positive 'Up to date' status when there are no upgrades", () => {
    const result = getUpgradeStatuses({
      ...ubuntuInstance,
      alerts: [],
      upgrades: { regular: 0, security: 0 },
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.severity).toBe("positive");
    expect(result[0]?.label).toBe("Up to date");
  });

  it("returns a warning status for regular upgrades only", () => {
    const result = getUpgradeStatuses({
      ...ubuntuInstance,
      alerts: [{ type: "PackageUpgradesAlert", summary: "", severity: "info" }],
      upgrades: { regular: 5, security: 0 },
    } as Instance);

    expect(result).toHaveLength(1);
    expect(result[0]?.severity).toBe("warning");
  });

  it("returns a danger status for security upgrades only", () => {
    const result = getUpgradeStatuses({
      ...ubuntuInstance,
      alerts: [
        { type: "SecurityUpgradesAlert", summary: "", severity: "warning" },
      ],
      upgrades: { regular: 0, security: 3 },
    } as Instance);

    expect(result).toHaveLength(1);
    expect(result[0]?.severity).toBe("danger");
  });

  it("returns separate danger and warning pills, security first", () => {
    const result = getUpgradeStatuses({
      ...ubuntuInstance,
      alerts: [
        { type: "PackageUpgradesAlert", summary: "", severity: "info" },
        { type: "SecurityUpgradesAlert", summary: "", severity: "warning" },
      ],
      upgrades: { regular: 5, security: 3 },
    } as Instance);

    expect(result.map((status) => status.severity)).toEqual([
      "danger",
      "warning",
    ]);
  });
});

describe("getUpgradeStatuses with the detailed upgrades view enabled", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("VITE_DETAILED_UPGRADES_VIEW_ENABLED", "true");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("derives pills from the upgrades counts with pluralised labels", async () => {
    const { getUpgradeStatuses: getUpgradeStatusesDynamic } =
      await import("./helpers");

    const result = getUpgradeStatusesDynamic({
      ...ubuntuInstance,
      alerts: [],
      upgrades: { regular: 5, security: 1 },
    });

    expect(result.map((status) => status.severity)).toEqual([
      "danger",
      "warning",
    ]);
    expect(result.map((status) => status.label)).toEqual([
      "1 security upgrade",
      "5 regular upgrades",
    ]);
  });
});
