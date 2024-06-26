import { FC } from "react";
import { Tabs } from "@canonical/react-components";

interface RepositoryProfileFormTabsProps {
  currentTab: number;
  onCurrentTabChange: (tab: number) => void;
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
          onClick: () => onCurrentTabChange(0),
        },
        {
          label: "Pockets",
          role: "tab",
          active: 1 === currentTab,
          onClick: () => onCurrentTabChange(1),
        },
        {
          label: "APT Sources",
          role: "tab",
          active: 2 === currentTab,
          onClick: () => onCurrentTabChange(2),
        },
      ]}
    />
  );
};

export default RepositoryProfileFormTabs;
