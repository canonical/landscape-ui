import { createRoute, createPathBuilder } from "./_helpers";

export const ACCOUNT_PATHS = {
  root: "account",
  general: "general",
  alerts: "alerts",
  apiCredentials: "api-credentials",
  legacyLicenseFile: "legacy-license-file",
  about: "about",
} as const;

const base = `/${ACCOUNT_PATHS.root}`;

const buildAccountPath = createPathBuilder(base);

export const ACCOUNT_ROUTES = {
  root: createRoute(base),
  general: createRoute(buildAccountPath(ACCOUNT_PATHS.general)),
  alerts: createRoute(buildAccountPath(ACCOUNT_PATHS.alerts)),
  apiCredentials: createRoute(buildAccountPath(ACCOUNT_PATHS.apiCredentials)),
  legacyLicenseFile: createRoute(
    buildAccountPath(ACCOUNT_PATHS.legacyLicenseFile),
  ),
  about: createRoute(buildAccountPath(ACCOUNT_PATHS.about)),
} as const;
