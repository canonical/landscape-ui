import type { ActionConfig } from "../../api";
import type { PackageChangePlanActionType } from "../../types";

export const getActionConfig = (
  action: Exclude<PackageChangePlanActionType, "upgrade">,
  package_ids: number[],
): ActionConfig => {
  switch (action) {
    case "install":
      return {
        install_config: {
          by_ids: {
            package_ids,
          },
        },
      };

    case "remove":
      return {
        remove_config: {
          by_ids: {
            package_ids,
          },
        },
      };

    case "hold":
      return {
        hold_config: {
          package_ids,
        },
      };

    case "unhold":
      return {
        unhold_config: {
          package_ids,
        },
      };

    case "change_version":
      return {
        change_version_config: { version_changes: [] },
      };
  }
};
