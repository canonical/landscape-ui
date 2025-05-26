import { createRoute } from "./_helpers";

export const ACTIVITIES_PATHS = {
  activities: "/activities",
} as const;

export const ACTIVITIES_ROUTES = {
  activities: createRoute(ACTIVITIES_PATHS.activities),
} as const;
