import type { PackageAction } from "./types";

export const mapActionToQueryParams = (action: PackageAction) => {
  switch (action) {
    case "install":
      return { available: true, installed: false, held: false, upgrade: false };
    case "hold":
      return { held: false };
    case "unhold":
      return { held: true };
    default:
      return { installed: true, held: false, upgrade: false };
  }
};

export const mapActionToPast = (action: PackageAction) => {
  switch (action) {
    case "hold":
      return "held";
    case "unhold":
      return "unheld";
    case "downgrade":
      return "downgraded";
    default:
      return action + "ed";
  }
};

export const mapActionToSearch = (action: PackageAction) => {
  switch (action) {
    case "downgrade":
    case "hold":
    case "uninstall":
      return "installed";
    case "install":
      return "available";
    case "unhold":
      return "held";
  }
};

export const mapSummaryToTitle = (
  packageName: string,
  action: PackageAction,
  summaryVersion?: string,
) => {
  if (summaryVersion) {
    if (action == "downgrade") {
      return `Instances downgradable to ${packageName} ${summaryVersion}`;
    }
    const status = action == "hold" ? "installed" : mapActionToSearch(action);
    return `Instances with ${packageName} ${summaryVersion} ${status}`;
  } else if (summaryVersion == "") {
    return `Instances with ${packageName} not installed`;
  }
  return `Instances that won't ${action} ${packageName}`;
};
