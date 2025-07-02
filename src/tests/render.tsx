import AppNotification from "@/components/layout/AppNotification";
import AuthProvider from "@/context/auth";
import FetchProvider from "@/context/fetch";
import FetchOldProvider from "@/context/fetchOld";
import LocalSidePanelProvider from "@/context/localSidePanel";
import NotifyProvider, { NotifyContext } from "@/context/notify";
import SidePanelProvider from "@/context/sidePanel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { FC, ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router";

interface WrapperProps {
  readonly children: ReactNode;
}

const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
};

export function renderHookWithProviders() {
  const queryClient = new QueryClient(queryClientConfig);

  return function Wrapper({ children }: { readonly children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

export const renderWithProviders = (
  ui: ReactNode,
  options?: RenderOptions,
  routePath?: string,
  routePattern?: string,
) => {
  const queryClient = new QueryClient(queryClientConfig);

  const Wrapper: FC<WrapperProps> = ({ children }) => {
    const initialEntries = routePath ? [routePath] : undefined;

    return (
      <MemoryRouter initialEntries={initialEntries}>
        <QueryClientProvider client={queryClient}>
          <NotifyProvider>
            <NotifyContext.Consumer>
              {({ notify }) => (
                <AuthProvider>
                  <FetchOldProvider>
                    <FetchProvider>
                      <AppNotification notify={notify} />
                      <SidePanelProvider>
                        <LocalSidePanelProvider>
                          {routePattern ? (
                            <Routes>
                              <Route path={routePattern} element={children} />
                            </Routes>
                          ) : (
                            children
                          )}
                        </LocalSidePanelProvider>
                      </SidePanelProvider>
                    </FetchProvider>
                  </FetchOldProvider>
                </AuthProvider>
              )}
            </NotifyContext.Consumer>
          </NotifyProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};
