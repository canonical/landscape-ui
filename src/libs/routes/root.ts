import { createCustomRoute, createRoute } from "./_helpers";

export const ROOT_PATHS = {
  root: "/",
  login: "/login",
  handleAuthOidc: "/handle-auth/oidc",
  handleAuthUbuntuOne: "/handle-auth/ubuntu-one",
  notFound: "/*",
} as const;

export const ROOT_ROUTES = {
  default: createRoute(ROOT_PATHS.root),
  login: createCustomRoute(ROOT_PATHS.login),
  handleAuthOidc: createCustomRoute(ROOT_PATHS.handleAuthOidc),
  handleAuthUbuntuOne: createCustomRoute(ROOT_PATHS.handleAuthUbuntuOne),
  notFound: createRoute(ROOT_PATHS.notFound),
} as const;
