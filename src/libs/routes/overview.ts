import { createRoute } from "./_helpers";

export const OVERVIEW_PATHS = {
  overview: "/overview",
} as const;

export const OVERVIEW_ROUTES = {
  overview: createRoute(OVERVIEW_PATHS.overview),
} as const;
