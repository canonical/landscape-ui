import { render, renderHook, RenderOptions } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import NotifyProvider from "@/context/notify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/context/auth";
import FetchProvider from "@/context/fetch";
import FetchOldProvider from "@/context/fetchOld";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

interface WrapperProps {
  children: ReactNode;
}

export const renderWithProviders = (ui: ReactNode, options?: RenderOptions) => {
  const Wrapper: FC<WrapperProps> = ({ children }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <NotifyProvider>
          <AuthProvider>
            <FetchOldProvider>
              <FetchProvider>{children}</FetchProvider>
            </FetchOldProvider>
          </AuthProvider>
        </NotifyProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export const renderHookWithProviders = (
  hook: () => unknown,
  options?: RenderOptions,
) => {
  const Wrapper: FC<WrapperProps> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(hook, { wrapper: Wrapper, ...options });
};
