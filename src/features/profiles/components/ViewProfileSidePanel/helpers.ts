import { ProfileTypes } from "../../helpers";

export type TabTypes =
  | "info"
  | "activity-history"
  | "package-constraints"
  | "pockets"
  | "apt-sources";

export const getTabs = (type: ProfileTypes) => {
  const tabs: { label: string; id: TabTypes }[] = [
    {
      label: "Info",
      id: "info",
    },
  ];

  if (type === ProfileTypes.script) {
    tabs.push({
      label: "Activity history",
      id: "activity-history",
    });
  } else if (type === ProfileTypes.package) {
    tabs.push({
      label: "Package constraints",
      id: "package-constraints",
    });
  } else if (type === ProfileTypes.repository) {
    tabs.push({
      label: "APT sources",
      id: "apt-sources",
    });
  }

  return tabs;
};
