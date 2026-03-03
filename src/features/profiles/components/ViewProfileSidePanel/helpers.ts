import type { ProfileType } from "../../types";

export type TabTypes = 
  | "info"
  | "activity-history"
  | "package-constraints"
  | "pockets"
  | "apt-sources"

export const getTabs = (type: ProfileType) => {
  const tabs: { label: string; id: TabTypes }[] = [{
    label: "Info",
    id: "info",
  }];

  if (type === "script") {
    tabs.push({
      label: "Activity history",
      id: "activity-history",
    });
  } else if (type === "package") {
    tabs.push({
      label: "Package constraints",
      id: "package-constraints",
    });
  } else if (type === "repository") {
    tabs.push(
      {
        label: "Pockets",
        id: "pockets",
      },
      {
        label: "APT sources",
        id: "apt-sources",
      }
    );
  }
  return tabs;
};
