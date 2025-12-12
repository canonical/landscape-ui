import type { FC, ReactNode } from "react";
import { BrowserRouter } from "react-router";
import ThemeProvider from "@/context/theme";
import EnvProvider from "@/context/env";
import NotifyProvider from "@/context/notify";
import ReactQueryProvider from "@/context/reactQuery";
import AuthProvider from "@/context/auth";
import AccountsProvider from "@/context/accounts";
import FetchProvider from "@/api/fetch";
import FetchOldProvider from "@/api/fetchOld";
import { ROOT_PATH } from "@/constants";

interface Props {
  readonly children: ReactNode;
}

export const AppProviders: FC<Props> = ({ children }) => {
  return (
    <BrowserRouter basename={ROOT_PATH}>
      <ThemeProvider>
        <EnvProvider>
          <NotifyProvider>
            <ReactQueryProvider>
              <AuthProvider>
                <AccountsProvider>
                  <FetchOldProvider>
                    <FetchProvider>{children}</FetchProvider>
                  </FetchOldProvider>
                </AccountsProvider>
              </AuthProvider>
            </ReactQueryProvider>
          </NotifyProvider>
        </EnvProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
