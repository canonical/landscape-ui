import { render, RenderOptions } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import NotifyProvider, { NotifyContext } from "@/context/notify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/context/auth";
import FetchProvider from "@/context/fetch";
import FetchOldProvider from "@/context/fetchOld";
import SidePanelProvider from "@/context/sidePanel";
import AppNotification from "@/components/layout/AppNotification";

interface WrapperProps {
  children: ReactNode;
}

export const renderWithProviders = (
  ui: ReactNode,
  options?: RenderOptions,
  routePath?: string,
  routePattern?: string,
) => {
  const Wrapper: FC<WrapperProps> = ({ children }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

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
