import type { SnapAction } from "../../types";

export const getActionConfig = (
  action: SnapAction,
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

    case "changeChannel":
      return {
        change_channel_config: { version_changes: [] },
      };
  }
};
