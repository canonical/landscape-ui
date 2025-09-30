import { createRoute } from "./_helpers";

export const ROOT_PATHS = {
  root: "/",
  notFound: "/*",
} as const;

export const ROOT_ROUTES = {
  root: createRoute(ROOT_PATHS.root),
  notFound: createRoute(ROOT_PATHS.notFound),
} as const;
