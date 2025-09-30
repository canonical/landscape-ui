import { createRoute } from "./_helpers";

export const EXTERNAL_PATHS = {
  documentation: "https://ubuntu.com/landscape/docs",
  support: "https://support-portal.canonical.com/",
} as const;

export const EXTERNAL_ROUTES = {
  documentation: createRoute(EXTERNAL_PATHS.documentation),
  support: createRoute(EXTERNAL_PATHS.support),
} as const;
