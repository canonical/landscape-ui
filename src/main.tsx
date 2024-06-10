import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "@/context/auth";
import ConfirmProvider from "@/context/confirm";
import EnvProvider from "@/context/env";
import NotifyProvider from "@/context/notify";
import ReactQueryProvider from "@/context/reactQuery";
import App from "./App";
import "./styles/index.scss";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <EnvProvider>
        <NotifyProvider>
          <ReactQueryProvider>
            <ConfirmProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ConfirmProvider>
          </ReactQueryProvider>
        </NotifyProvider>
      </EnvProvider>
    </BrowserRouter>
  </StrictMode>,
);
