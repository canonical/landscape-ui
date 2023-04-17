/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_ACCESS_KEY: string;
  readonly VITE_API_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
