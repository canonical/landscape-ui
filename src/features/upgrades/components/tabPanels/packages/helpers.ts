import type { InstancePackagesToExclude, Package } from "@/features/packages";

export const checkIsPackageUpdateRequired = (
  excludedPackages: InstancePackagesToExclude[],
  pkg: Package,
) => {
  return excludedPackages.some(
    ({ exclude_packages }) =>
      pkg.computers.count > 0 && !exclude_packages.includes(pkg.id),
  );
};

export const toggleCurrentPackage = (
  excludedPackages: InstancePackagesToExclude[],
  pkg: Package,
  isUpdateRequired: boolean,
) => {
  return excludedPackages.map(({ id, exclude_packages }) => {
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
