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

// Mirrors checkIsUpdateRequiredForAllVisiblePackages, scoped to a single
// package, so the row checkbox can show indeterminate instead of falsely
// reporting a package as fully selected when only some selected instances
// (set via the Instances tab) have excluded it.
export const checkIsPackageFullyIncluded = (
  excludedPackages: InstancePackagesToExclude[],
  pkg: Package,
) => {
  return excludedPackages.every(
    ({ exclude_packages }) => !exclude_packages.includes(pkg.id),
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
