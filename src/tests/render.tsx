import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { FC, ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProviders } from "@/providers/AppProviders";
import { NotifyContext } from "@/context/notify";
import AppNotification from "@/components/layout/AppNotification";
import AuthProvider from "@/context/auth";
import SidePanelProvider from "@/context/sidePanel";

export interface TestProviderProps {
  readonly children: ReactNode;
}

export type AdditionalProviders = FC<TestProviderProps>;

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
          <AuthProvider>
            {children}
          </AuthProvider>
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
  additionalProviders?: AdditionalProviders,
) => {
  const Wrapper: FC<TestProviderProps> = ({ children }) => {
    const initialEntries = routePath ? [routePath] : undefined;
    const AdditionalProviders = additionalProviders;
    const renderedChildren = routePattern ? (
      <Routes>
        <Route path={routePattern} element={children} />
      </Routes>
    ) : (
      children
    );
    const wrappedChildren = AdditionalProviders ? (
      <AdditionalProviders>{renderedChildren}</AdditionalProviders>
    ) : (
      renderedChildren
    );

    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AppProviders>
          <SidePanelProvider>
            <NotifyContext.Consumer>
              {({ notify }) => (
                <>
                  <AppNotification notify={notify} />
                  {wrappedChildren}
                </>
              )}
            </NotifyContext.Consumer>
          </SidePanelProvider>
        </AppProviders>
      </MemoryRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};
