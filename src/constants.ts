export const IS_DEV_ENV = import.meta.env.DEV;
export const IS_SELF_HOSTED_ENV = import.meta.env.VITE_SELF_HOSTED_ENV;
export const API_URL = import.meta.env.VITE_API_URL;
export const API_URL_OLD = import.meta.env.VITE_API_URL_OLD;
export const ROOT_PATH = import.meta.env.VITE_ROOT_PATH;
export const API_VERSION = "2011-08-01";
export const APP_TITLE = import.meta.env.VITE_APP_TITLE;
export const INPUT_DATE_FORMAT = "YYYY-MM-DD";
export const DISPLAY_DATE_FORMAT = "MMM D, YYYY";
export const DISPLAY_DATE_TIME_FORMAT = "MMM D, YYYY, HH:mm";
export const NOT_AVAILABLE = "N/A";
export const APP_VERSION = __APP_VERSION__;
export const FEEDBACK_LINK =
  "https://discourse.ubuntu.com/t/feedback-on-the-new-web-portal/50528";
export const REPORT_VIEW_ENABLED =
  import.meta.env.VITE_REPORT_VIEW_ENABLED === "true";
export const CONTACT_SUPPORT_TEAM_MESSAGE =
  "Something went wrong. Please try again or contact our support team.";
export const DETAILED_UPGRADES_VIEW_ENABLED =
  import.meta.env.VITE_DETAILED_UPGRADES_VIEW_ENABLED === "true";
export const IS_MSW_ENABLED = import.meta.env.VITE_MSW_ENABLED === "true";
export const MSW_ENDPOINTS_TO_INTERCEPT =
  import.meta.env.VITE_MSW_ENDPOINTS_TO_INTERCEPT.split(",").filter(Boolean) ??
  [];
export const COMMON_NUMBERS = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
};
