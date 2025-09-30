import { createRoute } from "./_helpers";

export const SCRIPT_PATHS = {
  root: "scripts",
} as const;

export const SCRIPT_ROUTES = {
  root: createRoute(`/${SCRIPT_PATHS.root}`),
} as const;
