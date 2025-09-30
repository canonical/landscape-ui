import { createRoute } from "./_helpers";

export const ALERT_PATHS = {
  root: "alerts",
} as const;

export const ALERT_ROUTES = {
  root: createRoute(`/${ALERT_PATHS.root}`),
} as const;
