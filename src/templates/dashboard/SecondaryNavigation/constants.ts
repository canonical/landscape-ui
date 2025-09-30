import { ROUTES } from "@/libs/routes";
import type { MenuItem } from "../Navigation/types";

export const ACCOUNT_SETTINGS: MenuItem = {
  label: "Account settings",
  path: ROUTES.account.root(),
  items: [
    {
      label: "General",
      path: ROUTES.account.general(),
    },
    {
      label: "Alerts",
      path: ROUTES.account.alerts(),
    },
    {
      label: "API credentials",
      path: ROUTES.account.apiCredentials(),
    },
  ],
};
