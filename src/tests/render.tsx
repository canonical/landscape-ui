import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { FC, ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProviders } from "@/providers/AppProviders";
import { NotifyContext } from "@/context/notify";
import AppNotification from "@/components/layout/AppNotification";
import AuthProvider from "@/context/auth";

interface WrapperProps {
  readonly children: ReactNode;
}

const testQueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
};

export function renderHookWithProviders() {
  const queryClient = new QueryClient(testQueryClientConfig);

  return function Wrapper({ children }: { readonly children: ReactNode }) {
    return (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
  };
}

export const renderWithProviders = (
  ui: ReactNode,
  options?: RenderOptions,
  routePath?: string,
  routePattern?: string,
) => {
  const Wrapper: FC<WrapperProps> = ({ children }) => {
    const initialEntries = routePath ? [routePath] : undefined;

    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AppProviders>
          <NotifyContext.Consumer>
            {({ notify }) => (
              <>
                <AppNotification notify={notify} />
                {routePattern ? (
                  <Routes>
                    <Route path={routePattern} element={children} />
                  </Routes>
                ) : (
                  children
                )}
              </>
            )}
          </NotifyContext.Consumer>
        </AppProviders>
      </MemoryRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};
