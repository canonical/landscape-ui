import { createRoute } from "./_helpers";

export const SCRIPT_PATHS = {
  scripts: "/scripts",
} as const;

export const SCRIPT_ROUTES = {
  scripts: createRoute(SCRIPT_PATHS.scripts),
} as const;
