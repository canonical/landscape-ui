import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import type { SecurityProfile } from "../security-profiles";

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
  profile: SecurityProfile,
  instances: Instance[],
) =>
  instances.filter((instance) =>
    profile.tags.every((tag) => !instance.tags.includes(tag)),
  ).length;
