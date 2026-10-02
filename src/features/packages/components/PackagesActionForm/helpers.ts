import type { ActionConfig } from "../../api";
import type {
  PackageChangePlanActionType,
  PackageWithVersions,
} from "../../types";

export const getActionConfig = (
  action: Exclude<PackageChangePlanActionType, "upgrade">,
  selectedPackages: PackageWithVersions[],
): ActionConfig => {
  switch (action) {
    case "install":
      return {
        install_config: {
          by_ids: {
            package_ids: selectedPackages.map(([{ id }]) => id),
          },
        },
      };

    case "remove":
      return {
        remove_config: {
          by_ids: {
            package_ids: selectedPackages.map(([{ id }]) => id),
          },
        },
      };

    case "hold":
      return {
        hold_config: {
          package_ids: selectedPackages.map(([{ id }]) => id),
        },
      };

    case "unhold":
      return {
        unhold_config: {
          package_ids: selectedPackages.map(([{ id }]) => id),
        },
      };

    case "change_version":
      return {
        change_version_config: {
          version_changes: selectedPackages.flatMap(([{ id }, versions]) =>
            versions.map((version) => ({
              from_package_id: id,
              to_package_id: version,
            })),
          ),
        },
      };
  }
};
