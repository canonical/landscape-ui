import type { PackageActionType } from "../../types";

export const getActionSubmitButtonText = (action: PackageActionType) => {
  switch (action) {
    case "install":
      return "Install";
    case "uninstall":
      return "Uninstall";
    case "hold":
      return "Hold";
    case "unhold":
      return "Unhold";
    case "changeVersion":
      return "Change version on";
  }
};

export const getActionSubmitButtonAppearance = (action: PackageActionType) => {
  switch (action) {
    case "install":
    case "hold":
    case "unhold":
    case "changeVersion":
      return "positive";

    case "uninstall":
      return "negative";
  }
};
