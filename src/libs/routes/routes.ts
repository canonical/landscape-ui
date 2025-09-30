import { ACCOUNT_ROUTES } from "./account";
import { ACTIVITIES_ROUTES } from "./activities";
import { ALERT_ROUTES } from "./alerts";
import { AUTH_ROUTES } from "./auth";
import { ERROR_ROUTES } from "./errors";
import { EVENTS_LOG_ROUTES } from "./eventsLog";
import { EXTERNAL_ROUTES } from "./external";
import { INSTANCES_ROUTES } from "./instances";
import { OVERVIEW_ROUTES } from "./overview";
import { PROFILES_ROUTES } from "./profiles";
import { REPOSITORIES_ROUTES } from "./repositories";
import { ROOT_ROUTES } from "./root";
import { SCRIPT_ROUTES } from "./scripts";
import { SETTINGS_ROUTES } from "./settings";

export const ROUTES = {
  account: ACCOUNT_ROUTES,
  auth: AUTH_ROUTES,
  activities: ACTIVITIES_ROUTES,
  alerts: ALERT_ROUTES,
  errors: ERROR_ROUTES,
  eventsLog: EVENTS_LOG_ROUTES,
  external: EXTERNAL_ROUTES,
  instances: INSTANCES_ROUTES,
  overview: OVERVIEW_ROUTES,
  profiles: PROFILES_ROUTES,
  repositories: REPOSITORIES_ROUTES,
  root: ROOT_ROUTES,
  scripts: SCRIPT_ROUTES,
  settings: SETTINGS_ROUTES,
};
