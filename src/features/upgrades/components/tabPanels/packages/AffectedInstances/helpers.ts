import { Package, UpgradeInstancePackagesParams } from "@/features/packages";

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
  pkg: Package,
) => {
  return !pkg.computers.some((instance) =>
    excludedPackages
      .find(({ id }) => id === instance.id)
      ?.exclude_packages.includes(pkg.name),
  );
};

export const checkIsUpdateRequired = (
  pkg: Package,
  excludedPackages: UpgradeInstancePackagesParams[],
) => {
  return excludedPackages
    .filter(({ id }) => pkg.computers.some((instance) => id === instance.id))
    .some(({ exclude_packages }) => !exclude_packages.includes(pkg.name));
};
