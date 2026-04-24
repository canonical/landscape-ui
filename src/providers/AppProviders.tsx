import type { FC, ReactNode } from "react";
import AuthProvider from "@/context/auth";
import FetchProvider from "@/api/fetch";
import FetchDebArchiveProvider from "@/api/fetchDebArchive";
import FetchOldProvider from "@/api/fetchOld";
import NotifyProvider from "@/context/notify";
import EnvProvider from "@/context/env";
import ThemeProvider from "@/context/theme";
import AccountsProvider from "@/context/accounts";
import ReactQueryProvider from "@/context/reactQuery";

interface AppProvidersProps {
  readonly children: ReactNode;
}

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <EnvProvider>
        <NotifyProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <AccountsProvider>
                <FetchOldProvider>
                  <FetchDebArchiveProvider>
                    <FetchProvider>{children}</FetchProvider>
                  </FetchDebArchiveProvider>
                </FetchOldProvider>
              </AccountsProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </NotifyProvider>
      </EnvProvider>
    </ThemeProvider>
  );
};
