import { Tabs } from "@canonical/react-components";
import type { FC } from "react";

interface RepositoryProfileFormTabsProps {
  readonly currentTab: number;
  readonly onCurrentTabChange: (tab: number) => void;
}

const RepositoryProfileFormTabs: FC<RepositoryProfileFormTabsProps> = ({
  currentTab,
  onCurrentTabChange,
}) => {
  return (
    <Tabs
      links={[
        {
          label: "Details",
          role: "tab",
          active: 0 === currentTab,
          onClick: () => {
            onCurrentTabChange(0);
          },
        },
        {
          label: "Pockets",
          role: "tab",
          active: 1 === currentTab,
          onClick: () => {
            onCurrentTabChange(1);
          },
        },
        {
          label: "APT sources",
          role: "tab",
          active: 2 === currentTab,
          onClick: () => {
            onCurrentTabChange(2);
          },
        },
      ]}
    />
  );
};

export default RepositoryProfileFormTabs;
