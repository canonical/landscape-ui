import "./styles/index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AuthProvider from "@/context/auth";
import EnvProvider from "@/context/env";
import NotifyProvider from "@/context/notify";
import ReactQueryProvider from "@/context/reactQuery";
import App from "./App";
import { ROOT_PATH } from "@/constants";
import * as Sentry from "@sentry/browser";
import AppErrorBoundary from "./components/layout/AppErrorBoundary/AppErrorBoundary";

Sentry.init({
  dsn: "https://55a60b44ddfd4ca5a94a8a3bac2d5052@sentry.is.canonical.com//85",
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter basename={ROOT_PATH}>
        <EnvProvider>
          <NotifyProvider>
            <ReactQueryProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ReactQueryProvider>
          </NotifyProvider>
        </EnvProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
);
