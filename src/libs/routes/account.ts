import { createRoute, createPathBuilder } from "./_helpers";

export const ACCOUNT_PATHS = {
  root: "account",
  general: "general",
  alerts: "alerts",
  apiCredentials: "api-credentials",
  selfHostedLicense: "self-hosted-license",
} as const;

const base = `/${ACCOUNT_PATHS.root}`;

const buildAccountPath = createPathBuilder(base);

export const ACCOUNT_ROUTES = {
  root: createRoute(base),
  general: createRoute(buildAccountPath(ACCOUNT_PATHS.general)),
  alerts: createRoute(buildAccountPath(ACCOUNT_PATHS.alerts)),
  apiCredentials: createRoute(buildAccountPath(ACCOUNT_PATHS.apiCredentials)),
  selfHostedLicense: createRoute(
    buildAccountPath(ACCOUNT_PATHS.selfHostedLicense),
  ),
} as const;
