/// <reference types="vite/client" />

// Pragma ships a CSS-only entrypoint under a bare package subpath, which the
// `*.css` ambient glob does not match. Declare it so the side-effect import in
// main.tsx type-checks.
declare module "@canonical/styles/fonts";

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_URL_OLD: string;
  readonly VITE_API_URL_DEB_ARCHIVE: string;
  readonly VITE_ROOT_PATH: string;
  readonly VITE_SELF_HOSTED_ENV: string | undefined;
  readonly VITE_TSV_EXPORTS_ENABLED: string;
  readonly VITE_DETAILED_UPGRADES_VIEW_ENABLED: string;
  readonly VITE_MSW_ENABLED: string;
  readonly VITE_MSW_ENDPOINTS_TO_INTERCEPT: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_COMMIT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
