import { ACCOUNT_ROUTES } from "./account";
import { ACTIVITIES_ROUTES } from "./activities";
import { ALERT_ROUTES } from "./alerts";
import { ERROR_ROUTES } from "./errors";
import { EVENTS_LOG_ROUTES } from "./eventsLog";
import { EXTERNAL_ROUTES } from "./external";
import { HELP_ROUTES } from "./help";
import { INSTANCES_ROUTES } from "./instances";
import { OVERVIEW_ROUTES } from "./overview";
import { PROFILES_ROUTES } from "./profiles";
import { REPOSITORIES_ROUTES } from "./repositories";
import { ROOT_ROUTES } from "./root";
import { SCRIPT_ROUTES } from "./scripts";
import { SETTINGS_ROUTES } from "./settings";

export const ROUTES = {
  ...ACCOUNT_ROUTES,
  ...ACTIVITIES_ROUTES,
  ...ALERT_ROUTES,
  ...ERROR_ROUTES,
  ...EVENTS_LOG_ROUTES,
  ...EXTERNAL_ROUTES,
  ...HELP_ROUTES,
  ...INSTANCES_ROUTES,
  ...OVERVIEW_ROUTES,
  ...PROFILES_ROUTES,
  ...REPOSITORIES_ROUTES,
  ...ROOT_ROUTES,
  ...SCRIPT_ROUTES,
  ...SETTINGS_ROUTES,
};
