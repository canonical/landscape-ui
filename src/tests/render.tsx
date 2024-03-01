import { render, RenderOptions } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import NotifyProvider from "@/context/notify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface WrapperProps {
  children: ReactNode;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const renderWithProviders = (ui: ReactNode, options?: RenderOptions) => {
  const Wrapper: FC<WrapperProps> = ({ children }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <NotifyProvider>{children}</NotifyProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};
