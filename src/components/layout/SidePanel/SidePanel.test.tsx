import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { use, type FC } from "react";
import { describe, expect } from "vitest";
import SidePanel from "./SidePanel";

const ErrorComponent: FC = () => {
  throw new Error();
};

const SlowComponent: FC<{ readonly promise: Promise<ReactNode> }> = ({
  promise,
}) => {
  const children = use<ReactNode>(promise);
  return children;
};

describe("SidePanel", () => {
  it("renders", async () => {
    const children = "Content";
    const close = vi.fn();

    renderWithProviders(
      <SidePanel onClose={close}>
        <SidePanel.Header />
        <SidePanel.Content>{children}</SidePanel.Content>
      </SidePanel>,
    );

    expect(screen.getByText(children)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button"));
    expect(close).toHaveBeenCalledOnce();
  });

  it("renders a fallback on error", () => {
    const children = "Content";
    const close = vi.fn();

    renderWithProviders(
      <SidePanel onClose={close}>
        <ErrorComponent />
        {children}
      </SidePanel>,
    );

    expect(screen.queryByText(children)).not.toBeInTheDocument();
    expect(screen.getByText("Unexpected error occurred")).toBeInTheDocument();
  });

  it("renders a loading fallback with suspense", async () => {
    const children = "Content";
    const close = vi.fn();

    renderWithProviders(
      <SidePanel onClose={close}>
        <SidePanel.Suspense>
          <SlowComponent
            promise={
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve(children);
                }, 500);
              })
            }
          />
        </SidePanel.Suspense>
      </SidePanel>,
    );

    expect(screen.queryByText(children)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button"));
    expect(close).toHaveBeenCalledOnce();
  });
});
