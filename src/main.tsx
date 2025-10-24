import "./styles/index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AuthProvider from "@/context/auth";
import EnvProvider from "@/context/env";
import NotifyProvider from "@/context/notify";
import ReactQueryProvider from "@/context/reactQuery";
import App from "./App";
import {
  APP_VERSION,
  IS_DEV_ENV,
  IS_MSW_ENABLED,
  ROOT_PATH,
} from "@/constants";
import AppErrorBoundary from "./components/layout/AppErrorBoundary/AppErrorBoundary";
import AccountsProvider from "@/context/accounts";
import * as Sentry from "@sentry/browser";
import ThemeProvider from "@/context/theme";

Sentry.init({
  dsn: "https://55a60b44ddfd4ca5a94a8a3bac2d5052@sentry.is.canonical.com/85",
  release: APP_VERSION || "local-dev",
  environment: IS_DEV_ENV ? "development" : "production",
  debug: IS_DEV_ENV,
});

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
        <ThemeProvider>
          <EnvProvider>
            <NotifyProvider>
              <ReactQueryProvider>
                <AuthProvider>
                  <AccountsProvider>
                    <App />
                  </AccountsProvider>
                </AuthProvider>
              </ReactQueryProvider>
            </NotifyProvider>
          </EnvProvider>
        </ThemeProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
);
