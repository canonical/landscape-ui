import "./styles/index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import {
  APP_VERSION,
  IS_DEV_ENV,
  IS_MSW_ENABLED,
  ROOT_PATH,
} from "@/constants";
import AppErrorBoundary from "@/components/layout/AppErrorBoundary/AppErrorBoundary";
import { AppProviders } from "@/providers/AppProviders";
import App from "./App";
import { BrowserRouter } from "react-router";

export const getSentryConfig = (
  appVersion = APP_VERSION,
  isDevEnv = IS_DEV_ENV,
) => ({
  dsn: "https://774322e0f66e6944afb57769632eca62@o4510662863749120.ingest.de.sentry.io/4510674271338576",
  release: appVersion || "local-dev",
  environment: isDevEnv ? "development" : "production",
  enabled: !isDevEnv,
});

Sentry.init(getSentryConfig());

type WorkerLoader = () => Promise<{
  worker: {
    start: () => Promise<unknown> | unknown;
  };
}>;

const defaultLoadWorker: WorkerLoader = () => import("@/tests/browser");

export const renderApp = (
  createAppRoot: typeof createRoot = createRoot,
  container = document.getElementById("root") as HTMLElement,
) => {
  const root = createAppRoot(container);

  root.render(
    <StrictMode>
      <AppErrorBoundary>
        <BrowserRouter basename={ROOT_PATH}>
          <AppProviders>
            <App />
          </AppProviders>
        </BrowserRouter>
      </AppErrorBoundary>
    </StrictMode>,
  );
};

interface StartAppOptions {
  mode?: string;
  isDevEnv?: boolean;
  isMswEnabled?: boolean;
  loadWorker?: WorkerLoader;
  render?: () => void;
}

export const startApp = async ({
  mode = import.meta.env.MODE,
  isDevEnv = IS_DEV_ENV,
  isMswEnabled = IS_MSW_ENABLED,
  loadWorker = defaultLoadWorker,
  render = () => {
    renderApp();
  },
}: StartAppOptions = {}) => {
  if (mode === "test") {
    return;
  }

  if (isDevEnv && isMswEnabled) {
    const { worker } = await loadWorker();
    await worker.start();
  }

  render();
};

void startApp();
