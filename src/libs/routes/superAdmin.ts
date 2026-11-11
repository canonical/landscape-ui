import type { PageParams } from "../pageParamsManager";
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
  /** The support session: an account's dashboard, entered by staff. */
  session: "accounts/:name/session",
  sessionInstances: "instances",
  sessionInstance: "instances/:instanceId",
  sessionInstanceChild: "instances/:instanceId/:childInstanceId",
  sessionEventsLog: "events-log",
  sessionProfiles: "profiles",
  sessionProfile: "profiles/:profileType",
  sessionSettings: "settings",
  sessionSetting: "settings/:setting",
} as const;

const base = `/${SUPER_ADMIN_PATHS.root}`;
const buildPath = createPathBuilder(base);

const sessionBase = buildPath(SUPER_ADMIN_PATHS.session);
const buildSessionPath = createPathBuilder(sessionBase);

const sessionRoute = (path: string) => (name: string) =>
  createRouteWithParams(path)({ name });

export const SUPER_ADMIN_ROUTES = {
  root: createRoute(base),
  accounts: createRoute(buildPath(SUPER_ADMIN_PATHS.accounts)),
  account: (name: string, queryParams?: Partial<PageParams>) =>
    createRouteWithParams(buildPath(SUPER_ADMIN_PATHS.account))(
      { name },
      queryParams,
    ),
  people: createRoute(buildPath(SUPER_ADMIN_PATHS.people)),
  session: sessionRoute(sessionBase),
  sessionInstances: sessionRoute(
    buildSessionPath(SUPER_ADMIN_PATHS.sessionInstances),
  ),
  sessionInstance: (
    name: string,
    instanceId: string | number,
    queryParams?: Partial<PageParams>,
  ) =>
    createRouteWithParams(buildSessionPath(SUPER_ADMIN_PATHS.sessionInstance))(
      { name, instanceId },
      queryParams,
    ),
  sessionInstanceChild: (
    name: string,
    instanceId: string | number,
    childInstanceId: string | number,
    queryParams?: Partial<PageParams>,
  ) =>
    createRouteWithParams(
      buildSessionPath(SUPER_ADMIN_PATHS.sessionInstanceChild),
    )({ name, instanceId, childInstanceId }, queryParams),
  sessionEventsLog: sessionRoute(
    buildSessionPath(SUPER_ADMIN_PATHS.sessionEventsLog),
  ),
  sessionProfiles: sessionRoute(
    buildSessionPath(SUPER_ADMIN_PATHS.sessionProfiles),
  ),
  sessionProfile: (name: string, profileType: string) =>
    createRouteWithParams(buildSessionPath(SUPER_ADMIN_PATHS.sessionProfile))({
      name,
      profileType,
    }),
  sessionSettings: sessionRoute(
    buildSessionPath(SUPER_ADMIN_PATHS.sessionSettings),
  ),
  sessionSetting: (name: string, setting: string) =>
    createRouteWithParams(buildSessionPath(SUPER_ADMIN_PATHS.sessionSetting))({
      name,
      setting,
    }),
} as const;
