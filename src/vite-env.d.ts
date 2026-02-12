/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_URL_OLD: string;
  readonly VITE_ROOT_PATH: string;
  readonly VITE_SELF_HOSTED_ENV: string | undefined;
  readonly VITE_REPORT_VIEW_ENABLED: string;
  readonly VITE_DETAILED_UPGRADES_VIEW_ENABLED: string;
  readonly VITE_MSW_ENABLED: string;
  readonly VITE_MSW_ENDPOINTS_TO_INTERCEPT: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_COMMIT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
