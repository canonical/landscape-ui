import type { Instance } from "@landscape/types";
import { TAB_LINKS } from "./constants";

interface GetTabLinksProps {
  activeTabId: string;
  instance: Instance;
  onActiveTabChange: (tabId: string) => void;
}

export const getTabLinks = ({
  activeTabId,
  instance,
  onActiveTabChange,
}: GetTabLinksProps) => {
  return TAB_LINKS.filter((link) => link.condition(instance)).map(
    ({ label, id }) => ({
      label: label,
      id,
      role: "tab",
      active: id === activeTabId,
      onClick: () => {
        onActiveTabChange(id);
      },
    }),
  );
};
