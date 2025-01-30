import { ROOT_PATH } from "@/constants";
import type { MenuItem } from "../Navigation/types";

export const ACCOUNT_SETTINGS: MenuItem = {
  label: "Account settings",
  path: `${ROOT_PATH}account`,
  items: [
    {
      label: "General",
      path: `${ROOT_PATH}account/general`,
    },
    {
      label: "Alerts",
      path: `${ROOT_PATH}account/alerts`,
    },
    {
      label: "API credentials",
      path: `${ROOT_PATH}account/api-credentials`,
    },
  ],
};
