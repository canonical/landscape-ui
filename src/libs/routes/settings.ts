import { createRoute, createPathBuilder } from "./_helpers";

export const SETTINGS_PATHS = {
  root: "settings",
  accessGroups: "access-groups",
  administrators: "administrators",
  employees: "employees",
  general: "general",
  identityProviders: "identity-providers",
  roles: "roles",
} as const;

const base = `/${SETTINGS_PATHS.root}`;

const buildSettingsPath = createPathBuilder(base);

export const SETTINGS_ROUTES = {
  root: createRoute(base),
  accessGroups: createRoute(buildSettingsPath(SETTINGS_PATHS.accessGroups)),
  administrators: createRoute(buildSettingsPath(SETTINGS_PATHS.administrators)),
  employees: createRoute(buildSettingsPath(SETTINGS_PATHS.employees)),
  general: createRoute(buildSettingsPath(SETTINGS_PATHS.general)),
  identityProviders: createRoute(
    buildSettingsPath(SETTINGS_PATHS.identityProviders),
  ),
  roles: createRoute(buildSettingsPath(SETTINGS_PATHS.roles)),
};
