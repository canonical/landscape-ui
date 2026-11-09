const MAX_ITEM_COUNT = 10;
export const MAX_ACTIVITY_COUNT = MAX_ITEM_COUNT;
export const MAX_UPGRADE_COUNT = MAX_ITEM_COUNT;
export const MAX_PACKAGE_COUNT = MAX_ITEM_COUNT;
export const MAX_USN_COUNT = MAX_ITEM_COUNT;

export const UPGRADES_TABS = [
  { id: "instances", label: "Instances" },
  { id: "packages", label: "Packages" },
  { id: "usns", label: "USNs" },
] as const;

export const ACTIVITIES_TABS = [
  { id: "unapproved", label: "Requires approval" },
  { id: "inProgress", label: "In progress" },
] as const;
