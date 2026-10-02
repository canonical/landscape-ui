import {
  createPathBuilder,
  createRoute,
  createRouteWithParams,
} from "./_helpers";

export const SUPER_ADMIN_PATHS = {
  root: "super-admin",
  accounts: "accounts",
  account: "accounts/:name",
  people: "people",
} as const;

const base = `/${SUPER_ADMIN_PATHS.root}`;
const buildPath = createPathBuilder(base);

export const SUPER_ADMIN_ROUTES = {
  root: createRoute(base),
  accounts: createRoute(buildPath(SUPER_ADMIN_PATHS.accounts)),
  account: (name: string) =>
    createRouteWithParams(buildPath(SUPER_ADMIN_PATHS.account))({ name }),
  people: createRoute(buildPath(SUPER_ADMIN_PATHS.people)),
} as const;
