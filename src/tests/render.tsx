import { render, RenderOptions } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import NotifyProvider from "@/context/notify";

interface WrapperProps {
  children: ReactNode;
}

export const renderWithProviders = (ui: ReactNode, options?: RenderOptions) => {
  const Wrapper: FC<WrapperProps> = ({ children }) => (
    <MemoryRouter>
      <NotifyProvider>{children}</NotifyProvider>
    </MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};
