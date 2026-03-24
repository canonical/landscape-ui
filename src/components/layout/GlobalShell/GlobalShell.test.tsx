import { NotifyContext } from "@/context/notify";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GlobalShell } from "./GlobalShell";

describe("GlobalShell", () => {
  it("renders children", () => {
    renderWithProviders(<GlobalShell>Shell content</GlobalShell>);
    expect(screen.getByText("Shell content")).toBeInTheDocument();
  });

  it("shows a notification when notify has a message", () => {
    const notifyValue = {
      notify: {
        notification: {
          type: "positive" as const,
          message: "Success notification",
          title: "Success",
        },
        success: () => undefined,
        error: () => undefined,
        info: () => undefined,
        clear: () => undefined,
      },
      sidePanel: {
        open: false,
        setOpen: () => undefined,
      },
    };

    renderWithProviders(
      <NotifyContext.Provider value={notifyValue}>
        <GlobalShell>content</GlobalShell>
      </NotifyContext.Provider>,
    );

    expect(screen.getByText("Success notification")).toBeInTheDocument();
  });
});
