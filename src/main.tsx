import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.scss";
import { BrowserRouter } from "react-router-dom";
import ConfirmProvider from "./context/confirm";
import AuthProvider from "./context/auth";
import NotifyProvider from "./context/notify";
import { StrictMode } from "react";
import ReactQueryProvider from "@/context/reactQuery";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <NotifyProvider>
        <ReactQueryProvider>
          <ConfirmProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ConfirmProvider>
        </ReactQueryProvider>
      </NotifyProvider>
    </BrowserRouter>
  </StrictMode>,
);
