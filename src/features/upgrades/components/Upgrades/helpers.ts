import { TabLink } from "@canonical/react-components/dist/components/Tabs/Tabs";
import { TAB_LINKS } from "./constants";

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
      onClick: () => onTabLinkClick(id),
      role: "tab",
    }),
  );
};
