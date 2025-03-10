import "./styles/index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AuthProvider from "@/context/auth";
import EnvProvider from "@/context/env";
import NotifyProvider from "@/context/notify";
import ReactQueryProvider from "@/context/reactQuery";
import App from "./App";
import { IS_DEV_ENV, IS_MSW_ENABLED, ROOT_PATH } from "@/constants";
import * as Sentry from "@sentry/browser";
import AppErrorBoundary from "./components/layout/AppErrorBoundary/AppErrorBoundary";
import AccountsProvider from "@/context/accounts";

if (!IS_DEV_ENV) {
  Sentry.init({
    dsn: "https://55a60b44ddfd4ca5a94a8a3bac2d5052@sentry.is.canonical.com//85",
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

if (IS_DEV_ENV && IS_MSW_ENABLED) {
  const { worker } = await import("@/tests/browser");

  await worker.start();
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter basename={ROOT_PATH}>
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
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
);
