import { createRoute } from "./_helpers";

export const PROFILES_PATHS = {
  profiles: "/profiles",
  profilesPackage: "/profiles/package",
  profilesReboot: "/profiles/reboot",
  profilesRemoval: "/profiles/removal",
  profilesRepository: "/profiles/repositories",
  profilesSecurity: "/profiles/security",
  profilesUpgrade: "/profiles/upgrade",
  profilesWsl: "/profiles/wsl",
} as const;

export const PROFILES_ROUTES = {
  profiles: createRoute(PROFILES_PATHS.profiles),
  profilesPackage: createRoute(PROFILES_PATHS.profilesPackage),
  profilesReboot: createRoute(PROFILES_PATHS.profilesReboot),
  profilesRemoval: createRoute(PROFILES_PATHS.profilesRemoval),
  profilesRepository: createRoute(PROFILES_PATHS.profilesRepository),
  profilesSecurity: createRoute(PROFILES_PATHS.profilesSecurity),
  profilesUpgrade: createRoute(PROFILES_PATHS.profilesUpgrade),
  profilesWsl: createRoute(PROFILES_PATHS.profilesWsl),
} as const;
