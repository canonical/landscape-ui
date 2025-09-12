import type { TabLink } from "@canonical/react-components/dist/components/Tabs/Tabs";
import type { Instance } from "@/types/Instance";
import { TAB_LINKS } from "./constants";
import type { UpgradesFormProps } from "./types";

export const getTabLinks = ({
  activeTabLinkId,
  onTabLinkClick,
  withUsnsTab,
}: {
  activeTabLinkId: string;
  onTabLinkClick: (id: string) => void;
  withUsnsTab: boolean;
}) => {
  return TAB_LINKS.filter(
    ({ id }) => withUsnsTab || id !== "tab-link-usns",
  ).map(
    ({ id, label }): TabLink => ({
      id,
      label,
      active: id === activeTabLinkId,
      onClick: () => {
        onTabLinkClick(id);
      },
      role: "tab",
    }),
  );
};

export const getInitialValues = (instances: Instance[]): UpgradesFormProps => {
  return {
    excludedPackages: instances.map(({ id }) => ({ id, exclude_packages: [] })),
    excludedUsns: [],
  };
};
