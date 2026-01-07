import type { FC, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/context/auth";
import FetchProvider from "@/api/fetch";
import FetchOldProvider from "@/api/fetchOld";
import NotifyProvider from "@/context/notify";
import SidePanelProvider from "@/context/sidePanel";
import EnvProvider from "@/context/env";
import ThemeProvider from "@/context/theme";
import AccountsProvider from "@/context/accounts";

interface AppProvidersProps {
  readonly children: ReactNode;
  readonly queryClient?: QueryClient;
}

const defaultClient = new QueryClient();

export const AppProviders: FC<AppProvidersProps> = ({
  children,
  queryClient = defaultClient,
}) => {
  return (
    <ThemeProvider>
      <EnvProvider>
        <NotifyProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AccountsProvider>
                <FetchOldProvider>
                  <FetchProvider>
                    <SidePanelProvider>{children}</SidePanelProvider>
                  </FetchProvider>
                </FetchOldProvider>
              </AccountsProvider>
            </AuthProvider>
          </QueryClientProvider>
        </NotifyProvider>
      </EnvProvider>
    </ThemeProvider>
  );
};
