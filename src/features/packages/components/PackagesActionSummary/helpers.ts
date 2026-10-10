import type { PackageChangePlanActionType } from "../../types";

export const getActionSubmitButtonText = (
  actionType: Exclude<PackageChangePlanActionType, "upgrade">,
) => {
  switch (actionType) {
    case "install":
      return "Install";
    case "remove":
      return "Uninstall";
    case "hold":
      return "Hold";
    case "unhold":
      return "Unhold";
    case "change_version":
      return "Change version on";
  }
};

export const getActionSubmitButtonAppearance = (
  actionType: Exclude<PackageChangePlanActionType, "upgrade">,
) => {
  switch (actionType) {
    case "install":
    case "hold":
    case "unhold":
    case "change_version":
      return "positive";

    case "remove":
      return "negative";
  }
};
