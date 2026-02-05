import { ROUTES } from "./libs/routes";

export const IS_DEV_ENV = import.meta.env.DEV;
export const IS_SELF_HOSTED_ENV = import.meta.env.VITE_SELF_HOSTED_ENV;
export const API_URL = import.meta.env.VITE_API_URL;
export const API_URL_OLD = import.meta.env.VITE_API_URL_OLD;
export const ROOT_PATH = import.meta.env.VITE_ROOT_PATH;
export const API_VERSION = "2011-08-01";
export const APP_TITLE = import.meta.env.VITE_APP_TITLE;
export const INPUT_DATE_FORMAT = "YYYY-MM-DD";
export const INPUT_DATE_TIME_FORMAT = `${INPUT_DATE_FORMAT}THH:mm:ss`;
export const DISPLAY_DATE_FORMAT = "MMM D, YYYY";
export const DISPLAY_DATE_TIME_FORMAT = "MMM DD, YYYY, HH:mm";
export const NOT_AVAILABLE = "N/A";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION;
export const APP_COMMIT = import.meta.env.VITE_APP_COMMIT;
export const FEEDBACK_LINK = "https://bugs.launchpad.net/landscape";
export const REPORT_VIEW_ENABLED =
  import.meta.env.VITE_REPORT_VIEW_ENABLED === "true";
export const CONTACT_SUPPORT_TEAM_MESSAGE =
  "Something went wrong. Please try again or contact our support team.";
export const DETAILED_UPGRADES_VIEW_ENABLED =
  import.meta.env.VITE_DETAILED_UPGRADES_VIEW_ENABLED === "true";
export const SELECT_ALL_INSTANCES_ENABLED =
  import.meta.env.VITE_SELECT_ALL_INSTANCES_ENABLED === "true";
export const IS_MSW_ENABLED = import.meta.env.VITE_MSW_ENABLED === "true";
export const MSW_ENDPOINTS_TO_INTERCEPT =
  (import.meta.env.VITE_MSW_ENDPOINTS_TO_INTERCEPT ?? "")
    .split(",")
    .filter(Boolean) ?? [];
export const HOMEPAGE_PATH = ROUTES.overview.root();
export const DEFAULT_ACCESS_GROUP_NAME = "global";
export const BREAKPOINT_PX = {
  xs: 460,
  sm: 620,
  md: 768,
  lg: 1036,
  xl: 1280,
  xxl: 1400,
};
export const MAX_DELIVERY_DELAY_WINDOW = 43200; // 30 days in minutes
export const MAX_MINUTES_IN_HOUR = 59;
export const MAX_HOURS_IN_DAY = 23;
export const MAX_PASSWORD_LENGTH = 50;
export const DEFAULT_MODAL_PAGE_SIZE = 10;
export const GENERIC_DOMAIN = "landscape.canonical.com";
