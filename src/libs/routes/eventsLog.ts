import { createRoute } from "./_helpers";

export const EVENTS_LOG_PATHS = {
  root: "events-log",
} as const;

export const EVENTS_LOG_ROUTES = {
  root: createRoute(`/${EVENTS_LOG_PATHS.root}`),
} as const;
