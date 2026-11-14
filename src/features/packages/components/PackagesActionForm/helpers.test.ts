import { packages } from "@/tests/mocks/packages";
import { describe, expect, it } from "vitest";
import type { PackageWithVersions } from "../../types";
import { getActionConfig } from "./helpers";

const [firstPackage, secondPackage, thirdPackage] = packages;
const firstVersionId = 101;
const secondVersionId = 102;
const thirdVersionId = 301;
const selectedPackages: PackageWithVersions[] = [
  [firstPackage, [firstVersionId, secondVersionId]],
  [secondPackage, []],
  [thirdPackage, [thirdVersionId]],
];
const packageIds = [firstPackage.id, secondPackage.id, thirdPackage.id];

describe("getActionConfig", () => {
  it.each([
    {
      action: "install",
      expected: { install_config: { by_ids: { package_ids: packageIds } } },
    },
    {
      action: "remove",
      expected: { remove_config: { by_ids: { package_ids: packageIds } } },
    },
    {
      action: "hold",
      expected: { hold_config: { package_ids: packageIds } },
    },
    {
      action: "unhold",
      expected: { unhold_config: { package_ids: packageIds } },
    },
  ] as const)(
    "builds the $action config from package IDs, not version IDs",
    ({ action, expected }) => {
      expect(getActionConfig(action, selectedPackages)).toEqual(expected);
    },
  );

  it("flattens selected versions into changes and skips packages without versions", () => {
    expect(getActionConfig("change_version", selectedPackages)).toEqual({
      change_version_config: {
        version_changes: [
          { from_package_id: firstPackage.id, to_package_id: firstVersionId },
          { from_package_id: firstPackage.id, to_package_id: secondVersionId },
          { from_package_id: thirdPackage.id, to_package_id: thirdVersionId },
        ],
      },
    });
  });
});
