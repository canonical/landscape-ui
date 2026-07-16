import { createRoute } from "./_helpers";

export const EXPORTS_PATHS = {
  root: "exports",
} as const;

export const EXPORTS_ROUTES = {
  root: createRoute(`/${EXPORTS_PATHS.root}`),
} as const;
