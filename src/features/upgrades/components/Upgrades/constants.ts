import { lazy } from "react";
import * as Yup from "yup";

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

export const VALIDATION_SCHEMA = Yup.object().shape({
  excludedPackages: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required(),
      exclude_packages: Yup.array().of(Yup.string()),
    }),
  ),
  excludedUsns: Yup.array().of(Yup.string()),
});
