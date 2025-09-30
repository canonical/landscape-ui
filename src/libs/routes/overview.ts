import { createRoute } from "./_helpers";

export const OVERVIEW_PATHS = {
  root: "overview",
} as const;

export const OVERVIEW_ROUTES = {
  root: createRoute(`/${OVERVIEW_PATHS.root}`),
} as const;
