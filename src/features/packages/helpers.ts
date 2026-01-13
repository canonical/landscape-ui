import type { PackageAction } from "./types";

export const  mapActionToQueryParams = (action: PackageAction) => {
  switch (action) {
    case "install":
      return { available: true, installed: false, held: false, upgrade: false };
    case "uninstall":
      return { installed: true, held: false, upgrade: false };
    case "hold":
      return { held: false };
    case "unhold":
      return { held: true };
  }
};

export const mapActionToPast = (action: PackageAction) => {
  switch (action) {
    case "hold": return "held";
    case "unhold": return "unheld";
    default: return action + "ed";
  }
};

export const mapActionToSearch = (action: PackageAction) => {
  switch (action) {
    case "uninstall": return "installed";
    case "unhold": return "held";
    default: return "available";
  }
};
export const mapSummaryToTitle = (
  packageName:string,
  action: PackageAction,
  summaryVersion?: string,
) => {
  const actionSearch = mapActionToSearch(action);
  if (summaryVersion) {
    return `Instances with ${packageName} ${summaryVersion} ${actionSearch}`;
  } else if (summaryVersion == "") {
    return `Instances with ${packageName} not installed`;
  } else {
    return `Instances that can't ${action} ${packageName}`;
  }
};
