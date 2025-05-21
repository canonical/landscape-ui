import { createRoute } from "./_helpers";

export const SETTINGS_PATHS = {
  settings: "/settings",
  settingsAccessGroups: "/settings/access-groups",
  settingsAdministrators: "/settings/administrators",
  settingsEmployees: "/settings/employees",
  settingsGeneral: "/settings/general",
  settingsIdentityProviders: "/settings/identity-providers",
  settingsRoles: "/settings/roles",
} as const;

export const SETTINGS_ROUTES = {
  settings: createRoute(SETTINGS_PATHS.settings),
  settingsAccessGroups: createRoute(SETTINGS_PATHS.settingsAccessGroups),
  settingsAdministrators: createRoute(SETTINGS_PATHS.settingsAdministrators),
  settingsEmployees: createRoute(SETTINGS_PATHS.settingsEmployees),
  settingsGeneral: createRoute(SETTINGS_PATHS.settingsGeneral),
  settingsIdentityProviders: createRoute(
    SETTINGS_PATHS.settingsIdentityProviders,
  ),
  settingsRoles: createRoute(SETTINGS_PATHS.settingsRoles),
};
