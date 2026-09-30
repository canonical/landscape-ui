import type { ActionConfig } from "../../api";
import type { PackageActionType } from "../../types";

export const getActionConfig = (
  action: PackageActionType,
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

    case "uninstall":
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

    case "changeVersion":
      return {
        change_version_config: { version_changes: [] },
      };
  }
};
