import type {
  ComputerPackageSearchGroupedResult,
  InstancePackage,
  PackageChangePlanActionType,
  PackageInstallationCandidate,
} from "./types";

const SYNTHETIC_ID_PREFIX = -900000;

let syntheticIdCounter = 0;

const getSyntheticId = (): number => {
  syntheticIdCounter -= 1;

  return SYNTHETIC_ID_PREFIX + syntheticIdCounter;
};

const pickAvailableCandidate = (
  candidates: PackageInstallationCandidate[],
): PackageInstallationCandidate | undefined => {
  const securityCandidate = candidates.find(({ security }) => security);

  if (securityCandidate) {
    return securityCandidate;
  }

  const upgradeCandidate = candidates.find(({ upgrade }) => upgrade);

  if (upgradeCandidate) {
    return upgradeCandidate;
  }

  return candidates[0];
};

const resolvePackageStatus = (
  result: ComputerPackageSearchGroupedResult,
  candidate?: PackageInstallationCandidate,
): "available" | "installed" | "held" | "security" => {
  if (result.held) {
    return "held";
  }

  if (result.security || candidate?.security) {
    return "security";
  }

  if (result.installed_version) {
    return "installed";
  }

  if (candidate) {
    return "available";
  }

  return "installed";
};

export const mapGroupedResultToInstancePackage = (
  result: ComputerPackageSearchGroupedResult,
): InstancePackage => {
  const candidate = pickAvailableCandidate(result.installation_candidates);

  return {
    id: result.installed_id ?? candidate?.id ?? getSyntheticId(),
    name: result.name,
    summary: result.summary ?? "",
    current_version: result.installed_version,
    available_version: candidate?.version ?? null,
    status: resolvePackageStatus(result, candidate),
  };
};

export const mapActionTypeToQueryParams = (
  actionType: Exclude<PackageChangePlanActionType, "upgrade">,
) => {
  switch (actionType) {
    case "install":
      return {
        available: "true",
        installed: "false",
        held: "false",
        upgrade: "false",
      } as const;

    case "remove":
    case "change_version":
      return {
        installed: "true",
        held: "false",
      } as const;

    case "hold":
      return { installed: "true", held: "false" } as const;

    case "unhold":
      return { held: "true" } as const;
  }
};

export const mapActionTypeToPast = (
  actionType: Exclude<PackageChangePlanActionType, "upgrade">,
) => {
  switch (actionType) {
    case "install":
      return "installed";
    case "remove":
      return "uninstalled";
    case "hold":
      return "held";
    case "unhold":
      return "unheld";
    case "change_version":
      return "changed to a different version";
  }
};

export const mapActionTypeToSearch = (
  actionType: Exclude<PackageChangePlanActionType, "upgrade">,
) => {
  switch (actionType) {
    case "change_version":
    case "hold":
    case "remove":
      return "installed";
    case "install":
      return "available";
    case "unhold":
      return "held";
  }
};

export const mapSummaryToTitle = (
  packageName: string,
  actionType: Exclude<PackageChangePlanActionType, "upgrade">,
  summaryVersion?: string,
) => {
  if (summaryVersion) {
    if (actionType == "change_version") {
      return `Instances downgradable to ${packageName} ${summaryVersion}`;
    }
    const status =
      actionType == "hold" ? "installed" : mapActionTypeToSearch(actionType);
    return `Instances with ${packageName} ${summaryVersion} ${status}`;
  } else if (summaryVersion == "") {
    return `Instances with ${packageName} not installed`;
  }
  return `Instances that won't ${actionType} ${packageName}`;
};

export const getActionFormTitle = (
  actionType: Exclude<PackageChangePlanActionType, "upgrade">,
) => {
  switch (actionType) {
    case "install":
      return "Install packages";
    case "remove":
      return "Uninstall packages";
    case "hold":
      return "Hold packages";
    case "unhold":
      return "Unhold packages";
    case "change_version":
      return "Change package version";
  }
};
