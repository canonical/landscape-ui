/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_OLD_DASHBOARD_URL: string;
  readonly VITE_ROOT_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
