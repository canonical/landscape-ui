import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import type { ListFilter } from "@/types/Filters";
import type { USGProfile } from "../usg-profiles";
import { FILTERS } from "./constants";
import type { RecoveryKeyActivityStatus } from "./types/RecoveryKey";

export const isRecoveryKeyActivityFailedOrCanceled = (
  activityStatus?: RecoveryKeyActivityStatus | null,
): boolean => {
  return Boolean(
    activityStatus && ["failed", "canceled"].includes(activityStatus),
  );
};

export const isRecoveryKeyActivityInProgress = (
  activityStatus?: RecoveryKeyActivityStatus | null,
): boolean => {
  return Boolean(
    activityStatus && !isRecoveryKeyActivityFailedOrCanceled(activityStatus),
  );
};

export const shouldShowRecoveryKeyActivityStatus = (
  activityStatus?: RecoveryKeyActivityStatus | null,
): boolean => {
  return Boolean(
    activityStatus && !isRecoveryKeyActivityFailedOrCanceled(activityStatus),
  );
};

export const getRecoveryKeyRegenerationAttemptMessage = (
  recoveryKey: string | null = null,
  activityStatus: RecoveryKeyActivityStatus,
): string | null => {
  const shouldShowRecoveryKeyRegenerationAttemptMessage = Boolean(
    recoveryKey && isRecoveryKeyActivityFailedOrCanceled(activityStatus),
  );

  if (!shouldShowRecoveryKeyRegenerationAttemptMessage || !activityStatus) {
    return null;
  }

  return `The last attempt to regenerate this key ${activityStatus === "failed" ? "failed" : "was canceled"}.`;
};

export function getFeatures(instance: InstanceWithoutRelation) {
  const isUbuntu = instance.distribution_info?.distributor === "Ubuntu";
  const isUbuntuCore =
    instance.distribution_info?.distributor === "Ubuntu Core";
  const isWindows = instance.distribution_info?.distributor === "Microsoft";
  const isLinux = !isWindows && !!instance.distribution_info?.distributor;
  const isNonUbuntuLinux = isLinux && !isUbuntu && !isUbuntuCore;

  return {
    employees: isUbuntu,
    hardware: isLinux,
    packages: isUbuntu,
    power: isLinux,
    pro: !isNonUbuntuLinux,
    processes: isLinux,
    recoveryKey: isLinux,
    sanitization: isLinux && !isUbuntuCore && !instance.is_wsl_instance,
    scripts: isLinux,
    snaps: isLinux,
    users: isLinux && !isUbuntuCore,
    uninstallation: instance.is_wsl_instance,
    usg: isUbuntu,
    wsl: isWindows,
  };
}

export const hasRegularUpgrades = (
  alerts: InstanceWithoutRelation["alerts"],
): boolean => {
  return !!alerts?.some(({ type }) => type === "PackageUpgradesAlert");
};

export const hasSecurityUpgrades = (
  alerts: InstanceWithoutRelation["alerts"],
): boolean => {
  return !!alerts?.some(({ type }) => type === "SecurityUpgradesAlert");
};

export const hasUpgrades = (
  alerts: InstanceWithoutRelation["alerts"],
): boolean => {
  return hasRegularUpgrades(alerts) || hasSecurityUpgrades(alerts);
};

export const instancesToAssignCount = (
  profile: USGProfile,
  instances: Instance[],
) =>
  instances.filter((instance) =>
    profile.tags.every((tag) => !instance.tags.includes(tag)),
  ).length;

export const getProfileTypes = (featureFlags: {
  isScriptProfilesEnabled: boolean;
  isUsgProfilesEnabled: boolean;
  isWslProfilesEnabled: boolean;
}): readonly string[] => {
  const profileTypes = ["package", "reboot", "removal", "repository"];

  if (featureFlags.isScriptProfilesEnabled) {
    profileTypes.push("script");
  }

  if (featureFlags.isUsgProfilesEnabled) {
    profileTypes.push("usg");
  }

  profileTypes.push("upgrade");

  if (featureFlags.isWslProfilesEnabled) {
    profileTypes.push("wsl");
  }

  return profileTypes;
};

export const getOptionQuery = (filter: ListFilter, optionValue: string) => {
  return filter.type === "select"
    ? (filter.options.find((option) => option.value === optionValue)?.query ??
        "")
    : "";
};

export interface GetInstanceQueryProps {
  accessGroups: string[];
  availabilityZones: string[];
  contractExpiryDays: string;
  os: string;
  query: string;
  status: string;
  tags: string[];
  upgrades: string[];
}

export interface InstanceListParams {
  archived_only?: boolean;
  query?: string;
  wsl_children?: boolean;
  wsl_parents?: boolean;
}

export const getQuery = ({
  accessGroups,
  availabilityZones,
  contractExpiryDays,
  os,
  query,
  status,
  tags,
  upgrades,
}: GetInstanceQueryProps) => {
  const queryParts: string[] = [];
  const osQuery = os ? getOptionQuery(FILTERS.os, os) : "";
  const statusQuery = status ? getOptionQuery(FILTERS.status, status) : "";
  const contractExpiryQuery = contractExpiryDays
    ? getOptionQuery(FILTERS.contractExpiryDays, contractExpiryDays)
    : "";

  if (osQuery) {
    queryParts.push(osQuery);
  }

  if (statusQuery) {
    queryParts.push(statusQuery);
  }

  if (contractExpiryQuery) {
    queryParts.push(contractExpiryQuery);
  }

  if (query) {
    queryParts.push(...query.split(","));
  }

  if (tags.length) {
    queryParts.push(`tag:${tags.join(" OR tag:")}`);
  }

  if (upgrades.length) {
    queryParts.push(upgrades.map((upgrade) => `alert:${upgrade}`).join(" OR "));
  }

  if (accessGroups.length) {
    queryParts.push(`access-group:${accessGroups.join(" OR access-group:")}`);
  }

  if (availabilityZones.length) {
    queryParts.push(
      availabilityZones.includes("none")
        ? "availability-zone:null"
        : `availability-zone:${availabilityZones.join(" OR availability-zone:")}`,
    );
  }

  return queryParts.join(" ") || undefined;
};

export const getInstanceListParams = ({
  filters,
  wsl,
}: {
  filters: GetInstanceQueryProps;
  wsl: string[];
}): InstanceListParams => ({
  query: getQuery(filters),
  archived_only: filters.status === "archived",
  wsl_children: wsl.includes("child"),
  wsl_parents: wsl.includes("parent"),
});
