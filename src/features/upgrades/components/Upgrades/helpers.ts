import type { AppTabItem } from "@/components/AppTabs";
import type { InstancePackagesToExclude } from "@/features/packages";
import type { Instance } from "@/types/Instance";
import { TAB_ITEMS } from "./constants";
import type { UpgradesFormProps, UpgradesTabId } from "./types";

export const getTabItems = ({
  withPackagesTab,
  withUsnsTab,
}: {
  withPackagesTab: boolean;
  withUsnsTab: boolean;
}): AppTabItem<UpgradesTabId>[] =>
  TAB_ITEMS.filter(
    ({ id }) =>
      (withPackagesTab || id !== "packages") && (withUsnsTab || id !== "usns"),
  ).map(({ id, label }) => ({ id, label }));

export const getInitialValues = (instances: Instance[]): UpgradesFormProps => {
  return {
    excludedPackages: instances.map(({ id }) => ({ id, exclude_packages: [] })),
    excludedUsns: [],
  };
};

export const getExcludedPackagesWithNames = (
  excludedPackages: InstancePackagesToExclude[],
  packageNamesById: ReadonlyMap<number, string>,
) => {
  return excludedPackages.map(({ id, exclude_packages }) => ({
    id,
    exclude_packages: exclude_packages.filter(
      (packageId) => !packageNamesById.has(packageId),
    ),
    excludePackageNames: exclude_packages.flatMap(
      (packageId) => packageNamesById.get(packageId) ?? [],
    ),
  }));
};
