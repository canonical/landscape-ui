import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { FC, ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import NotifyProvider, { NotifyContext } from "@/context/notify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/context/auth";
import FetchProvider from "@/api/fetch";
import FetchOldProvider from "@/api/fetchOld";
import SidePanelProvider from "@/context/sidePanel";
import AppNotification from "@/components/layout/AppNotification";

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
                        {routePattern ? (
                          <Routes>
                            <Route path={routePattern} element={children} />
                          </Routes>
                        ) : (
                          children
                        )}
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
