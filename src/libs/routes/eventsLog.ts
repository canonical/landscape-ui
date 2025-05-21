import { createRoute } from "./_helpers";

export const EVENTS_LOG_PATHS = {
  eventsLog: "/events-log",
} as const;

export const EVENTS_LOG_ROUTES = {
  eventsLog: createRoute(EVENTS_LOG_PATHS.eventsLog),
} as const;
