import type { PackageAction } from "../../../../types";

export const mapSummaryActionToPast = (action: PackageAction) => {
  if (action == "downgrade" || action == "upgrade" || action == "remove") {
    return action + "d";
  }
  if (action == "hold") {
    return "held";
  }
  if (action == "unhold") {
    return "unheld";
  }
  if (action == "install" || action == "uninstall") {
    return action + "ed";
  }
};
