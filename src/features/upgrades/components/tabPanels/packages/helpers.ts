import { Package, UpgradeInstancePackagesParams } from "@/features/packages";

export const checkIsUpdateRequired = (
  excludedPackages: UpgradeInstancePackagesParams[],
  packages: Package[],
) => {
  return packages.some(({ computers, name }) =>
    excludedPackages
      .filter(({ id }) => computers.some((instance) => instance.id === id))
      .some(({ exclude_packages }) => !exclude_packages.includes(name)),
  );
};

export const toggleCurrentPackage = (
  excludedPackages: UpgradeInstancePackagesParams[],
  pkg: Package,
  isUpdateRequired: boolean,
) => {
  return excludedPackages.map(({ id, exclude_packages }) => {
    if (pkg.computers.every((instance) => instance.id !== id)) {
      return { id, exclude_packages };
    }

    const filteredPackages = exclude_packages.filter(
      (name) => name !== pkg.name,
    );

    return {
      id,
      exclude_packages: isUpdateRequired
        ? [...filteredPackages, pkg.name]
        : filteredPackages,
    };
  });
};

export const getToggledPackage = (
  excludedPackages: UpgradeInstancePackagesParams[],
  pkg: Package,
) => {
  return toggleCurrentPackage(
    excludedPackages,
    pkg,
    checkIsUpdateRequired(excludedPackages, [pkg]),
  );
};
