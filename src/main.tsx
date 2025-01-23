import "./styles/index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AuthProvider from "@/context/auth";
import EnvProvider from "@/context/env";
import NotifyProvider from "@/context/notify";
import ReactQueryProvider from "@/context/reactQuery";
import App from "./App";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
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
  </StrictMode>,
);
