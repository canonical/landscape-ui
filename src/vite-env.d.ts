/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_URL_OLD: string;
  readonly VITE_ROOT_PATH: string;
  readonly VITE_SELF_HOSTED_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
