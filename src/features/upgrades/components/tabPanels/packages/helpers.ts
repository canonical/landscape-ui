import { InstancePackagesToExclude, Package } from "@/features/packages";

export const checkIsPackageUpdateRequired = (
  excludedPackages: InstancePackagesToExclude[],
  pkg: Package,
) => {
  const instancesIdSet = new Set(pkg.computers.map((instance) => instance.id));

  return excludedPackages.some(
    ({ exclude_packages, id }) =>
      instancesIdSet.has(id) && !exclude_packages.includes(pkg.id),
  );
};

export const toggleCurrentPackage = (
  excludedPackages: InstancePackagesToExclude[],
  pkg: Package,
  isUpdateRequired: boolean,
) => {
  const instanceIdSet = new Set(pkg.computers.map(({ id }) => id));

  return excludedPackages.map(({ id, exclude_packages }) => {
    if (!instanceIdSet.has(id)) {
      return { id, exclude_packages };
    }

    const filteredPackages = exclude_packages.filter(
      (packageId) => packageId !== pkg.id,
    );

    return {
      id,
      exclude_packages: isUpdateRequired
        ? [...filteredPackages, pkg.id]
        : filteredPackages,
    };
  });
};

export const getToggledPackage = (
  excludedPackages: InstancePackagesToExclude[],
  pkg: Package,
) => {
  return toggleCurrentPackage(
    excludedPackages,
    pkg,
    checkIsPackageUpdateRequired(excludedPackages, pkg),
  );
};

export const checkIsPackageUpdateRequiredForAllInstances = (
  excludedPackages: InstancePackagesToExclude[],
  pkg: Package,
) => {
  const instancesIdSet = new Set(pkg.computers.map(({ id }) => id));

  return excludedPackages.every(
    ({ exclude_packages, id }) =>
      !instancesIdSet.has(id) || !exclude_packages.includes(pkg.id),
  );
};
