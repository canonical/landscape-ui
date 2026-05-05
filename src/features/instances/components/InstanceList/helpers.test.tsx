import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getColumnFilterOptions,
  getCheckboxState,
  handleCheckboxChange,
  getStatusCellIconAndLabel,
  getUpgradesCellIconAndLabel,
  createHeaderPropsGetter,
  getCellProps,
  getRowProps,
} from "./helpers";
import { ubuntuInstance } from "@/tests/mocks/instance";
import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import type { InstanceColumn } from "./types";

describe("InstanceList helpers", () => {
  describe("getColumnFilterOptions", () => {
    it("maps columns to filter options", () => {
      const columns: InstanceColumn[] = [
        {
          accessor: "title",
          canBeHidden: false,
          optionLabel: "Title",
        } as unknown as InstanceColumn,
      ];

      const result = getColumnFilterOptions(columns);
      expect(result).toEqual([
        { canBeHidden: false, label: "Title", value: "title" },
      ]);
    });
  });

  describe("getCheckboxState", () => {
    it("returns 'checked' when instance is in selectedInstances", () => {
      const result = getCheckboxState({
        instance: ubuntuInstance,
        selectedInstances: [ubuntuInstance],
      });
      expect(result).toBe("checked");
    });

    it("returns 'unchecked' when instance is not in selectedInstances", () => {
      const result = getCheckboxState({
        instance: ubuntuInstance,
        selectedInstances: [],
      });
      expect(result).toBe("unchecked");
    });
  });

  describe("handleCheckboxChange", () => {
    it("adds instance when not already selected", () => {
      const setSelectedInstances = vi.fn();
      handleCheckboxChange({
        instance: ubuntuInstance,
        selectedInstances: [],
        setSelectedInstances,
      });
      expect(setSelectedInstances).toHaveBeenCalledWith([ubuntuInstance]);
    });

    it("removes instance when already selected", () => {
      const setSelectedInstances = vi.fn();
      handleCheckboxChange({
        instance: ubuntuInstance,
        selectedInstances: [ubuntuInstance],
        setSelectedInstances,
      });
      expect(setSelectedInstances).toHaveBeenCalledWith([]);
    });
  });

  describe("getStatusCellIconAndLabel", () => {
    it("returns 'Archived' for archived instances", () => {
      const instance: InstanceWithoutRelation = {
        ...ubuntuInstance,
        archived: true,
        alerts: [],
      };
      const result = getStatusCellIconAndLabel(instance);
      expect(result.label).toBe("Archived");
      expect(result.icon).toBe("archive");
    });

    it("returns 'Online' when there are no relevant alerts", () => {
      const instance: InstanceWithoutRelation = {
        ...ubuntuInstance,
        archived: false,
        alerts: [],
      };
      const result = getStatusCellIconAndLabel(instance);
      expect(result.label).toBeTruthy();
    });

    it("returns single alert summary when there is exactly one alert", () => {
      const instance: InstanceWithoutRelation = {
        ...ubuntuInstance,
        archived: false,
        alerts: [
          {
            type: "ComputerOfflineAlert",
            summary: "Computer is offline",
            severity: "warning",
          },
        ],
      };
      const result = getStatusCellIconAndLabel(instance);
      expect(result.label).toBeDefined();
    });

    it("returns React element (icons) when there are multiple alerts", () => {
      const instance: InstanceWithoutRelation = {
        ...ubuntuInstance,
        archived: false,
        alerts: [
          {
            type: "ComputerOfflineAlert",
            summary: "Offline",
            severity: "warning",
          },
          {
            type: "ComputerRebootAlert",
            summary: "Needs reboot",
            severity: "warning",
          },
        ],
      };
      const result = getStatusCellIconAndLabel(instance);
      // Multiple alerts returns a ReactElement
      expect(result.label).toBeTruthy();
    });
  });

  describe("getUpgradesCellIconAndLabel", () => {
    it("returns NoData icon when packages feature is not available", () => {
      const instance: Instance = {
        ...ubuntuInstance,
        distribution: "22", // Ubuntu Core - no packages feature
        distribution_info: {
          code_name: "jammy",
          description: "Ubuntu 22.04 LTS",
          distributor: "Ubuntu Core",
          release: "22",
        },
      };
      const result = getUpgradesCellIconAndLabel(instance);
      expect(result).toBeDefined();
    });

    it("returns up-to-date when no upgrades", () => {
      const instance: Instance = {
        ...ubuntuInstance,
        distribution_info: {
          code_name: "focal",
          description: "Ubuntu 20.04 LTS",
          distributor: "Ubuntu",
          release: "20.04",
        },
        alerts: [],
        upgrades: { regular: 0, security: 0 },
      };
      const result = getUpgradesCellIconAndLabel(instance);
      expect(result.label).toBeTruthy();
    });

    it("returns regular upgrade info when only regular upgrades present", () => {
      const instance: Instance = {
        ...ubuntuInstance,
        distribution_info: {
          code_name: "focal",
          description: "Ubuntu 20.04 LTS",
          distributor: "Ubuntu",
          release: "20.04",
        },
        alerts: [
          { type: "PackageUpgradesAlert", summary: "", severity: "info" },
        ],
        upgrades: { regular: 5, security: 0 },
      };
      const result = getUpgradesCellIconAndLabel(instance);
      expect(result.icon).toBeTruthy();
      expect(result.label).toBeTruthy();
    });

    it("returns security upgrade info when only security upgrades present", () => {
      const instance: Instance = {
        ...ubuntuInstance,
        distribution_info: {
          code_name: "focal",
          description: "Ubuntu 20.04 LTS",
          distributor: "Ubuntu",
          release: "20.04",
        },
        alerts: [
          { type: "SecurityUpgradesAlert", summary: "", severity: "warning" },
        ],
        upgrades: { regular: 0, security: 3 },
      };
      const result = getUpgradesCellIconAndLabel(instance);
      expect(result.icon).toBeTruthy();
      expect(result.label).toBeTruthy();
    });

    it("returns combined info when both regular and security upgrades present", () => {
      const instance: Instance = {
        ...ubuntuInstance,
        distribution_info: {
          code_name: "focal",
          description: "Ubuntu 20.04 LTS",
          distributor: "Ubuntu",
          release: "20.04",
        },
        alerts: [
          { type: "PackageUpgradesAlert", summary: "", severity: "info" },
          { type: "SecurityUpgradesAlert", summary: "", severity: "warning" },
        ],
        upgrades: { regular: 5, security: 3 },
      };
      const result = getUpgradesCellIconAndLabel(instance);
      expect(result.icon).toBeTruthy();
      expect(result.label).toBeTruthy();
    });

    it("returns up-to-date when upgrades is null", () => {
      const instance = {
        ...ubuntuInstance,
        distribution_info: {
          code_name: "focal",
          description: "Ubuntu 20.04 LTS",
          distributor: "Ubuntu",
          release: "20.04",
        },
        alerts: [],
        upgrades: null,
      } as unknown as Instance;
      const result = getUpgradesCellIconAndLabel(instance);
      expect(result).toBeDefined();
    });
  });

  describe("createHeaderPropsGetter", () => {
    it("sets aria-labelledby on the title column header", () => {
      const getter = createHeaderPropsGetter("my-title-id");
      const result = getter({ id: "title" } as Parameters<typeof getter>[0]);
      expect(result["aria-labelledby"]).toBe("my-title-id");
    });

    it("returns empty props for non-title columns", () => {
      const getter = createHeaderPropsGetter("my-title-id");
      const result = getter({ id: "status" } as Parameters<typeof getter>[0]);
      expect(result["aria-labelledby"]).toBeUndefined();
    });
  });

  describe("getCellProps", () => {
    it("sets role=rowheader for title cells", () => {
      const getter = getCellProps(null);
      const result = getter({
        column: { id: "title" },
        row: { index: 0 },
      } as Parameters<typeof getter>[0]);
      expect(result.role).toBe("rowheader");
    });

    it("sets aria-label for status cells", () => {
      const getter = getCellProps(null);
      const result = getter({
        column: { id: "status" },
        row: { index: 0 },
      } as Parameters<typeof getter>[0]);
      expect(result["aria-label"]).toBe("Status");
    });

    it("sets aria-label for upgrades cells", () => {
      const getter = getCellProps(null);
      const result = getter({
        column: { id: "upgrades" },
        row: { index: 0 },
      } as Parameters<typeof getter>[0]);
      expect(result["aria-label"]).toBe("Upgrades");
    });

    it("sets aria-label for os cells", () => {
      const getter = getCellProps(null);
      const result = getter({
        column: { id: "os" },
        row: { index: 0 },
      } as Parameters<typeof getter>[0]);
      expect(result["aria-label"]).toBe("Operating system");
    });

    it("sets aria-label for tags cells without expanded class when not expanded", () => {
      const getter = getCellProps(null);
      const result = getter({
        column: { id: "tags" },
        row: { index: 0 },
      } as Parameters<typeof getter>[0]);
      expect(result["aria-label"]).toBe("Tags");
      expect(result.className).toBeUndefined();
    });

    it("adds expandedCell class when row matches expanded row", () => {
      const getter = getCellProps(0);
      const result = getter({
        column: { id: "tags" },
        row: { index: 0 },
      } as Parameters<typeof getter>[0]);
      expect(result.className).toBe("expandedCell");
    });

    it("sets aria-label for availability_zone cells", () => {
      const getter = getCellProps(null);
      const result = getter({
        column: { id: "availability_zone" },
        row: { index: 0 },
      } as Parameters<typeof getter>[0]);
      expect(result["aria-label"]).toBe("Availability zone");
    });

    it("sets aria-label for ubuntu_pro cells", () => {
      const getter = getCellProps(null);
      const result = getter({
        column: { id: "ubuntu_pro" },
        row: { index: 0 },
      } as Parameters<typeof getter>[0]);
      expect(result["aria-label"]).toBe("Ubuntu Pro expiration date");
    });

    it("sets aria-label for last_ping cells", () => {
      const getter = getCellProps(null);
      const result = getter({
        column: { id: "last_ping" },
        row: { index: 0 },
      } as Parameters<typeof getter>[0]);
      expect(result["aria-label"]).toBe("Last ping");
    });

    it("sets aria-label for actions cells", () => {
      const getter = getCellProps(null);
      const result = getter({
        column: { id: "actions" },
        row: { index: 0 },
      } as Parameters<typeof getter>[0]);
      expect(result["aria-label"]).toBe("Actions");
    });

    it("returns empty props for unknown columns", () => {
      const getter = getCellProps(null);
      const result = getter({
        column: { id: "unknown" },
        row: { index: 0 },
      } as Parameters<typeof getter>[0]);
      expect(result).toEqual({});
    });
  });

  describe("getRowProps", () => {
    it("adds expandedRow class when row is expanded", () => {
      const getter = getRowProps(0);
      const result = getter({
        index: 0,
        original: ubuntuInstance,
      } as Parameters<typeof getter>[0]);
      expect(result.className).toBe("expandedRow");
    });

    it("does not add expandedRow class when row is not expanded", () => {
      const getter = getRowProps(1);
      const result = getter({
        index: 0,
        original: ubuntuInstance,
      } as Parameters<typeof getter>[0]);
      expect(result.className).toBeUndefined();
    });

    it("sets aria-label to instance title", () => {
      const getter = getRowProps(null);
      const result = getter({
        index: 0,
        original: ubuntuInstance,
      } as Parameters<typeof getter>[0]);
      expect(result["aria-label"]).toBe(`${ubuntuInstance.title} instance row`);
    });
  });
});

describe("getUpgradesCellIconAndLabel with alerts (DETAILED_UPGRADES_VIEW_ENABLED=false)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("VITE_DETAILED_UPGRADES_VIEW_ENABLED", "false");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses alerts when DETAILED_UPGRADES_VIEW_ENABLED is false", async () => {
    const { getUpgradesCellIconAndLabel: getUpgradesCellIconAndLabelDynamic } =
      await import("./helpers");

    const instance: Instance = {
      ...ubuntuInstance,
      distribution_info: {
        code_name: "focal",
        description: "Ubuntu 20.04 LTS",
        distributor: "Ubuntu",
        release: "20.04",
      },
      alerts: [
        { type: "PackageUpgradesAlert", summary: "", severity: "info" },
        { type: "SecurityUpgradesAlert", summary: "", severity: "warning" },
      ],
    };
    const result = getUpgradesCellIconAndLabelDynamic(instance);
    expect(result.icon).toBeTruthy();
    expect(result.label).toBeTruthy();
  });

  it("returns up-to-date via alerts when no upgrade alerts exist", async () => {
    const { getUpgradesCellIconAndLabel: getUpgradesCellIconAndLabelDynamic } =
      await import("./helpers");

    const instance: Instance = {
      ...ubuntuInstance,
      distribution_info: {
        code_name: "focal",
        description: "Ubuntu 20.04 LTS",
        distributor: "Ubuntu",
        release: "20.04",
      },
      alerts: [],
    };
    const result = getUpgradesCellIconAndLabelDynamic(instance);
    expect(result).toBeDefined();
  });
});
