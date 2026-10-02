import type {
  ComputerPackageSearchGroupedResult,
  InstancePackage,
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
  if (candidate?.security) {
    return "security";
  }

  if (result.held) {
    return "held";
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
    id: result.installed_id ?? getSyntheticId(),
    name: result.name,
    summary: result.summary ?? "",
    current_version: result.installed_version,
    available_version: candidate?.version ?? null,
    status: resolvePackageStatus(result, candidate),
  };
};
