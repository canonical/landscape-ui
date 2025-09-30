import { createRoute } from "./_helpers";

export const ACTIVITIES_PATHS = {
  root: "activities",
} as const;

export const ACTIVITIES_ROUTES = {
  root: createRoute(`/${ACTIVITIES_PATHS.root}`),
} as const;
