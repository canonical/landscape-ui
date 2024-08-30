import { InstancePackagesToExclude } from "@/features/packages";

export const checkIsPackageUpdateRequiredForInstance = (
  excludedPackages: InstancePackagesToExclude[],
  instanceId: number,
  packageId: number,
) => {
  return !excludedPackages
    .find(({ id }) => id === instanceId)
    ?.exclude_packages.includes(packageId);
};

export const getToggledInstance = (
  excludedPackages: InstancePackagesToExclude[],
  instanceId: number,
  packageId: number,
) => {
  return excludedPackages.map(({ id, exclude_packages }) => {
    if (id !== instanceId) {
      return { id, exclude_packages };
    }

    return {
      id,
      exclude_packages: exclude_packages.includes(packageId)
        ? exclude_packages.filter((packageId) => packageId !== packageId)
        : [...exclude_packages, packageId],
    };
  });
};
