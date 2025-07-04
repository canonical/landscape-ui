import "./styles/index.scss";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { AppErrorBoundary } from "@landscape/ui";
import {
  AccountsProvider,
  AuthProvider,
  EnvProvider,
  NotifyProvider,
  ReactQueryProvider,
} from "@landscape/context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter basename={"/"}>
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
