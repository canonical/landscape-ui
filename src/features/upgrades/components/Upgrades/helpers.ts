import type { TabsProps } from "@canonical/react-components";
import type { InstancePackagesToExclude } from "@/features/packages";
import type { Instance } from "@/types/Instance";
import { TAB_LINKS } from "./constants";
import type { UpgradesFormProps } from "./types";

export const getTabLinks = ({
  activeTabLinkId,
  onTabLinkClick,
  withPackagesTab,
  withUsnsTab,
}: {
  activeTabLinkId: string;
  onTabLinkClick: (id: string) => void;
  withPackagesTab: boolean;
  withUsnsTab: boolean;
}) => {
  return TAB_LINKS.filter(
    ({ id }) =>
      (withPackagesTab || id !== "tab-link-packages") &&
      (withUsnsTab || id !== "tab-link-usns"),
  ).map(({ id, label }): TabsProps["links"][number] => ({
    id,
    label,
    active: id === activeTabLinkId,
    onClick: () => {
      onTabLinkClick(id);
    },
    role: "tab",
  }));
};

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
