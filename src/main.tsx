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

Sentry.init({
  dsn: "https://774322e0f66e6944afb57769632eca62@o4510662863749120.ingest.de.sentry.io/4510674271338576",
  release: APP_VERSION || "local-dev",
  environment: IS_DEV_ENV ? "development" : "production",
  enabled: !IS_DEV_ENV,
});

const initApp = async () => {
  if (IS_DEV_ENV && IS_MSW_ENABLED) {
    const { worker } = await import("@/tests/browser");
    await worker.start();
  }

  const container = document.getElementById("root") as HTMLElement;
  const root = createRoot(container);

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

initApp();
