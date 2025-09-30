import { createCustomRoute, createRoute } from "./_helpers";

export const AUTH_PATHS = {
  login: "/login",
  supportLogin: "/support/login",
  attach: "/attach",
  handleOidc: "/handle-auth/oidc",
  handleUbuntuOne: "/handle-auth/ubuntu-one",
} as const;

export const AUTH_ROUTES = {
  login: createCustomRoute(AUTH_PATHS.login),
  attach: createRoute(AUTH_PATHS.attach),
} as const;
