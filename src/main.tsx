import "./styles/index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/browser";
import { APP_VERSION, IS_DEV_ENV, IS_MSW_ENABLED } from "@/constants";
import AppErrorBoundary from "@/components/layout/AppErrorBoundary/AppErrorBoundary";
import { AppProviders } from "@/providers/AppProviders";
import App from "./App";

Sentry.init({
  dsn: "https://55a60b44ddfd4ca5a94a8a3bac2d5052@sentry.is.canonical.com/85",
  release: APP_VERSION || "local-dev",
  environment: IS_DEV_ENV ? "development" : "production",
  // debug: IS_DEV_ENV,
  debug: false,
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
        <AppProviders>
          <App />
        </AppProviders>
      </AppErrorBoundary>
    </StrictMode>,
  );
};

initApp();
