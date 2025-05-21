import { createRoute } from "./_helpers";

export const ALERT_PATHS = {
  alerts: "/alerts",
} as const;

export const ALERT_ROUTES = {
  alerts: createRoute(ALERT_PATHS.alerts),
} as const;
