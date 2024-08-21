import { lazy } from "react";

export const TAB_LINKS = [
  {
    id: "tab-link-instances",
    label: "Instances",
  },
  {
    id: "tab-link-packages",
    label: "Packages",
  },
  {
    id: "tab-link-usns",
    label: "USNs",
  },
];

export const TAB_PANELS = {
  instances: lazy(() => import("../tabPanels/instances")),
  packages: lazy(() => import("../tabPanels/packages")),
  usns: lazy(() => import("../tabPanels/usns")),
};
