import { FilterState, type PackageAction } from "./types";

export const mapActionToQueryParams = (action: PackageAction) => {
  switch (action) {
    case "install":
      return {
        available: FilterState.TRUE,
        installed: FilterState.FALSE,
        held: FilterState.FALSE,
        upgrade: FilterState.FALSE,
      };

    case "uninstall":
    case "changeVersion":
      return {
        installed: FilterState.TRUE,
        held: FilterState.FALSE,
        upgrade: FilterState.FALSE,
      };

    case "hold":
      return { held: FilterState.FALSE };

    case "unhold":
      return { held: FilterState.TRUE };
  }
};

export const mapActionToPast = (action: PackageAction) => {
  switch (action) {
    case "install":
      return "installed";
    case "uninstall":
      return "uninstalled";
    case "hold":
      return "held";
    case "unhold":
      return "unheld";
    case "changeVersion":
      return "changed to a different version";
  }
};

export const mapActionToSearch = (action: PackageAction) => {
  switch (action) {
    case "changeVersion":
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
    if (action == "changeVersion") {
      return `Instances downgradable to ${packageName} ${summaryVersion}`;
    }
    const status = action == "hold" ? "installed" : mapActionToSearch(action);
    return `Instances with ${packageName} ${summaryVersion} ${status}`;
  } else if (summaryVersion == "") {
    return `Instances with ${packageName} not installed`;
  }
  return `Instances that won't ${action} ${packageName}`;
};

export const getActionFormTitle = (action: PackageAction) => {
  switch (action) {
    case "install":
      return "Install packages";
    case "uninstall":
      return "Uninstall packages";
    case "hold":
      return "Hold packages";
    case "unhold":
      return "Unhold packages";
    case "changeVersion":
      return "Change package version";
  }
};
