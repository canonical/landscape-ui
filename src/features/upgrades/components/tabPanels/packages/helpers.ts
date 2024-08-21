import { OldPackage, UpgradeInstancePackagesParams } from "@/features/packages";

export const checkIsUpdateRequired = (
  excludedPackages: UpgradeInstancePackagesParams[],
  packages: OldPackage[],
) => {
  return packages.some(({ computers: { upgrades }, name }) =>
    excludedPackages
      .filter(({ id }) => upgrades.includes(id))
      .some(({ exclude_packages }) => !exclude_packages.includes(name)),
  );
};

export const toggleCurrentPackage = (
  excludedPackages: UpgradeInstancePackagesParams[],
  pkg: OldPackage,
  isUpdateRequired: boolean,
) => {
  return excludedPackages.map(({ id, exclude_packages }) => {
    if (!pkg.computers.upgrades.includes(id)) {
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
  pkg: OldPackage,
) => {
  return toggleCurrentPackage(
    excludedPackages,
    pkg,
    checkIsUpdateRequired(excludedPackages, [pkg]),
  );
};
