import { createRoute, createPathBuilder } from "./_helpers";

export const PROFILES_PATHS = {
  root: "profiles",
  package: "package",
  reboot: "reboot",
  removal: "removal",
  repository: "repository",
  security: "security",
  upgrade: "upgrade",
  wsl: "wsl",
} as const;

const base = `/${PROFILES_PATHS.root}`;

const buildProfilePath = createPathBuilder(base);

export const PROFILES_ROUTES = {
  root: createRoute(base),
  package: createRoute(buildProfilePath(PROFILES_PATHS.package)),
  reboot: createRoute(buildProfilePath(PROFILES_PATHS.reboot)),
  removal: createRoute(buildProfilePath(PROFILES_PATHS.removal)),
  repository: createRoute(buildProfilePath(PROFILES_PATHS.repository)),
  security: createRoute(buildProfilePath(PROFILES_PATHS.security)),
  upgrade: createRoute(buildProfilePath(PROFILES_PATHS.upgrade)),
  wsl: createRoute(buildProfilePath(PROFILES_PATHS.wsl)),
} as const;
