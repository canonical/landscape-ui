import { createRoute } from "./_helpers";

export const EXTERNAL_PATHS = {
  legal: "https://ubuntu.com/legal",
  documentation: "https://ubuntu.com/landscape/docs",
  support: "https://support-portal.canonical.com/",
} as const;

export const EXTERNAL_ROUTES = {
  legal: createRoute(EXTERNAL_PATHS.legal),
  documentation: createRoute(EXTERNAL_PATHS.documentation),
  support: createRoute(EXTERNAL_PATHS.support),
} as const;
