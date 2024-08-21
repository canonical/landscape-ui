import { OldPackage, UpgradeInstancePackagesParams } from "@/features/packages";

export const isInstanceNeedToUpdatePackage = (
  excludedPackages: UpgradeInstancePackagesParams[],
  instanceId: number,
  packageName: string,
) => {
  return !excludedPackages
    .find(({ id }) => id === instanceId)
    ?.exclude_packages.includes(packageName);
};

export const areAllInstancesNeedToUpdate = (
  excludedPackages: UpgradeInstancePackagesParams[],
  pkg: OldPackage,
) => {
  return !pkg.computers.upgrades.some((instanceId) =>
    excludedPackages
      .find(({ id }) => id === instanceId)
      ?.exclude_packages.includes(pkg.name),
  );
};

export const checkIsUpdateRequired = (
  pkg: OldPackage,
  excludedPackages: UpgradeInstancePackagesParams[],
) => {
  return excludedPackages
    .filter(({ id }) => pkg.computers.upgrades.includes(id))
    .some(({ exclude_packages }) => !exclude_packages.includes(pkg.name));
};
