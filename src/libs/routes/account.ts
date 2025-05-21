import { createRoute } from "./_helpers";

export const ACCOUNT_PATHS = {
  account: "/account",
  accountGeneral: "/account/general",
  accountAlerts: "/account/alerts",
  accountApiCredentials: "/account/api-credentials",
} as const;

export const ACCOUNT_ROUTES = {
  account: createRoute(ACCOUNT_PATHS.account),
  accountGeneral: createRoute(ACCOUNT_PATHS.accountGeneral),
  accountAlerts: createRoute(ACCOUNT_PATHS.accountAlerts),
  accountApiCredentials: createRoute(ACCOUNT_PATHS.accountApiCredentials),
} as const;
