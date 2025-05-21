import { createRoute } from "./_helpers";

export const ERROR_PATHS = {
  envError: "/env-error",
} as const;

export const ERROR_ROUTES = {
  envError: createRoute(ERROR_PATHS.envError),
} as const;
