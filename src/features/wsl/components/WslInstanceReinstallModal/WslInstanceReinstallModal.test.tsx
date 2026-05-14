import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import WslInstanceReinstallModal from "./WslInstanceReinstallModal";
import { noncompliantInstanceChild } from "@/tests/mocks/wsl";
import { windowsInstance } from "@/tests/mocks/instance";

describe("WslInstanceReinstallModal", () => {
  const user = userEvent.setup();

  it("renders modal title when open", () => {
    renderWithProviders(
      <WslInstanceReinstallModal
        close={vi.fn()}
        instances={[noncompliantInstanceChild]}
        isOpen={true}
        windowsInstance={windowsInstance}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: new RegExp(noncompliantInstanceChild.name, "i"),
      }),
    ).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    renderWithProviders(
      <WslInstanceReinstallModal
        close={vi.fn()}
        instances={[noncompliantInstanceChild]}
        isOpen={false}
        windowsInstance={windowsInstance}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("enables confirm button only after typing confirmation text", async () => {
    renderWithProviders(
      <WslInstanceReinstallModal
        close={vi.fn()}
        instances={[noncompliantInstanceChild]}
        isOpen={true}
        windowsInstance={windowsInstance}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: /reinstall/i });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");

    const input = screen.getByRole("textbox");
    await user.type(input, `reinstall ${noncompliantInstanceChild.name}`);

    expect(
      screen.getByRole("button", { name: /reinstall/i }),
    ).not.toHaveAttribute("aria-disabled", "true");
  });
});
