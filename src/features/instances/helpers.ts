import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import type { USGProfile } from "../usg-profiles";
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
