import {
  createCustomRoute,
  createRoute,
  createRouteWithParams,
} from "./_helpers";

export const AUTH_PATHS = {
  login: "/login",
  supportLogin: "/support/login",
  attach: "/attach",
  handleOidc: "/handle-auth/oidc",
  handleUbuntuOne: "/handle-auth/ubuntu-one",
  invitation: "/accept-invitation/:secureId",
  createAccount: "/create-account",
  noAccess: "/no-access",
} as const;

export const AUTH_ROUTES = {
  login: createCustomRoute(AUTH_PATHS.login),
  attach: createRoute(AUTH_PATHS.attach),
  invitation: createRouteWithParams<{ secureId: string }>(
    AUTH_PATHS.invitation,
  ),
  createAccount: createRoute(AUTH_PATHS.createAccount),
  noAccess: createRoute(AUTH_PATHS.noAccess),
} as const;
