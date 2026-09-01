import type { PackageAction } from "./types";

export const mapActionToQueryParams = (action: PackageAction) => {
  switch (action) {
    case "install":
      return {
        available: true,
        installed: false,
        held: false,
        upgrade: false,
      };

    case "uninstall":
    case "changeVersion":
      return {
        installed: true,
        held: false,
        upgrade: false,
      };

    case "hold":
      return { held: false };

    case "unhold":
      return { held: true };
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
