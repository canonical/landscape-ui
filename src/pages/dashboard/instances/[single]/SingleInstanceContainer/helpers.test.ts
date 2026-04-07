import { ROUTES } from "@/libs/routes";
import {
  instances,
  ubuntuCoreInstance,
  ubuntuInstance,
  windowsInstance,
} from "@/tests/mocks/instance";
import { describe, expect, it } from "vitest";
import {
  getBreadcrumbs,
  getInstanceRequestId,
  getInstanceTitle,
  getKernelCount,
  getPackageCount,
  getQueryComputerIdsParam,
  getQueryInstanceIdParam,
  getUsnCount,
  isInstanceFound,
  isInstancePackagesQueryEnabled,
  isInstanceQueryEnabled,
  isLivepatchInfoQueryEnabled,
  isUsnQueryEnabled,
} from "./helpers";

const INSTANCE_ID = 11;
const CHILD_INSTANCE_ID = 22;
const childWithParent = instances.find(
  (instance) => instance.parent?.id === windowsInstance.id,
);

assert(childWithParent);
assert(childWithParent.parent);
const parentInstance = childWithParent.parent;

describe("SingleInstanceContainer helpers", () => {
  it("returns false for package-like query enablement on ubuntu core instances", () => {
    expect(
      isInstancePackagesQueryEnabled(ubuntuCoreInstance, undefined, undefined),
    ).toBe(false);
    expect(
      isLivepatchInfoQueryEnabled(ubuntuCoreInstance, undefined, undefined),
    ).toBe(false);
    expect(isUsnQueryEnabled(ubuntuCoreInstance, undefined, undefined)).toBe(
      false,
    );
  });

  it("returns child instance id when child id is provided", () => {
    expect(
      getInstanceRequestId(String(INSTANCE_ID), String(CHILD_INSTANCE_ID)),
    ).toBe(CHILD_INSTANCE_ID);
  });

  it("returns parent instance id when child id is not provided", () => {
    expect(getInstanceRequestId(String(INSTANCE_ID), undefined)).toBe(
      INSTANCE_ID,
    );
  });

  it("returns empty title when instance is undefined", () => {
    expect(getInstanceTitle(undefined)).toBe("");
  });

  it("returns breadcrumbs for a top-level instance", () => {
    expect(getBreadcrumbs(ubuntuInstance)).toEqual([
      { label: "Instances", path: ROUTES.instances.root() },
      { label: ubuntuInstance.title, current: true },
    ]);
  });

  it("returns breadcrumbs for a child instance", () => {
    expect(getBreadcrumbs(childWithParent)).toEqual([
      { label: "Instances", path: ROUTES.instances.root() },
      {
        label: parentInstance.title,
        path: ROUTES.instances.details.single(parentInstance.id),
      },
      { label: childWithParent.title, current: true },
    ]);
  });

  it("returns undefined breadcrumbs when instance is missing", () => {
    expect(getBreadcrumbs(undefined)).toBeUndefined();
  });

  it("returns kernel count when livepatch fixes are available", () => {
    expect(
      getKernelCount([
        {
          Livepatch: {
            Fixes: [{}, {}],
          },
        },
      ] as never),
    ).toBe(2);
  });

  it("returns undefined kernel count for missing livepatch data", () => {
    expect(getKernelCount(undefined)).toBeUndefined();
    expect(getKernelCount([])).toBeUndefined();
    expect(
      getKernelCount([
        {
          Livepatch: {},
        },
      ] as never),
    ).toBeUndefined();
  });

  it("returns request package and usn counts only when instance has a distribution", () => {
    const noDistributionInstance = { ...ubuntuInstance, distribution: "" };

    expect(getPackageCount(ubuntuInstance, 7)).toBe(7);
    expect(getUsnCount(ubuntuInstance, 5)).toBe(5);
    expect(getPackageCount(noDistributionInstance, 7)).toBe(0);
    expect(getUsnCount(noDistributionInstance, 5)).toBe(0);
  });

  it("evaluates instance-query enablement based on account consistency", () => {
    expect(isInstanceQueryEnabled(undefined, undefined, undefined)).toBe(false);
    expect(isInstanceQueryEnabled("11", undefined, "account-a")).toBe(true);
    expect(isInstanceQueryEnabled("11", "account-a", "account-a")).toBe(true);
    expect(isInstanceQueryEnabled("11", "account-a", "account-b")).toBe(false);
  });

  it("returns query params derived from instance", () => {
    expect(getQueryComputerIdsParam(ubuntuInstance)).toEqual([
      ubuntuInstance.id,
    ]);
    expect(getQueryComputerIdsParam(undefined)).toEqual([]);
    expect(getQueryInstanceIdParam(ubuntuInstance)).toBe(ubuntuInstance.id);
    expect(getQueryInstanceIdParam(undefined)).toBe(0);
  });

  it("enables package-like queries only when child-parent relation matches", () => {
    expect(isInstancePackagesQueryEnabled(ubuntuInstance, "1", undefined)).toBe(
      true,
    );
    expect(isLivepatchInfoQueryEnabled(ubuntuInstance, "1", undefined)).toBe(
      true,
    );
    expect(isUsnQueryEnabled(ubuntuInstance, "1", undefined)).toBe(true);
    expect(
      isInstancePackagesQueryEnabled(
        childWithParent,
        String(windowsInstance.id),
        "22",
      ),
    ).toBe(false);
    expect(
      isInstancePackagesQueryEnabled(
        childWithParent,
        String(ubuntuInstance.id),
        "22",
      ),
    ).toBe(false);
    expect(
      isLivepatchInfoQueryEnabled(
        childWithParent,
        String(windowsInstance.id),
        "22",
      ),
    ).toBe(false);
    expect(
      isUsnQueryEnabled(childWithParent, String(windowsInstance.id), "22"),
    ).toBe(false);
  });

  it("returns null when child instance id is provided but instance has no parent", () => {
    expect(isInstanceFound(ubuntuInstance, String(INSTANCE_ID), "22")).toBe(
      null,
    );
  });

  it("returns true when child belongs to parent instance", () => {
    expect(
      isInstanceFound(
        childWithParent,
        String(windowsInstance.id),
        String(INSTANCE_ID),
      ),
    ).toBe(true);
  });

  it("returns false when child does not belong to parent instance", () => {
    expect(
      isInstanceFound(
        childWithParent,
        String(ubuntuInstance.id),
        String(INSTANCE_ID),
      ),
    ).toBe(false);
  });

  it("returns instance itself when there is no child constraint", () => {
    expect(
      isInstanceFound(ubuntuInstance, String(ubuntuInstance.id), undefined),
    ).toBe(true);
    expect(
      isInstanceFound(undefined, String(ubuntuInstance.id), undefined),
    ).toBe(undefined);
  });
});
