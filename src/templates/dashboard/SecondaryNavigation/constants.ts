import type { MenuItem } from "../Navigation/types";

export const ACCOUNT_SETTINGS: MenuItem = {
  label: "Account settings",
  path: "/account",
  items: [
    {
      label: "General",
      path: "/account/general",
    },
    {
      label: "Alerts",
      path: "/account/alerts",
    },
    {
      label: "API credentials",
      path: "/account/api-credentials",
    },
  ],
};
