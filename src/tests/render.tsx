import { render, RenderOptions } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import NotifyProvider from "@/context/notify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/context/auth";
import FetchProvider from "@/context/fetch";
import FetchOldProvider from "@/context/fetchOld";
import SidePanelProvider from "@/context/sidePanel";

interface WrapperProps {
  children: ReactNode;
}

export const renderWithProviders = (ui: ReactNode, options?: RenderOptions) => {
  const Wrapper: FC<WrapperProps> = ({ children }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });
    return (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <NotifyProvider>
            <AuthProvider>
              <FetchOldProvider>
                <FetchProvider>
                  <SidePanelProvider>{children}</SidePanelProvider>
                </FetchProvider>
              </FetchOldProvider>
            </AuthProvider>
          </NotifyProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};
