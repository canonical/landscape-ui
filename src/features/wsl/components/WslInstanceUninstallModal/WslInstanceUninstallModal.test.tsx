import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import WslInstanceUninstallModal from "./WslInstanceUninstallModal";
import { compliantInstanceChild } from "@/tests/mocks/wsl";
import { windowsInstance } from "@/tests/mocks/instance";

describe("WslInstanceUninstallModal", () => {
  const user = userEvent.setup();

  it("renders modal when open", () => {
    renderWithProviders(
      <WslInstanceUninstallModal
        close={vi.fn()}
        instances={[compliantInstanceChild]}
        isOpen={true}
        parentId={windowsInstance.id}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    renderWithProviders(
      <WslInstanceUninstallModal
        close={vi.fn()}
        instances={[compliantInstanceChild]}
        isOpen={false}
        parentId={windowsInstance.id}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("enables confirm button after typing the confirmation text", async () => {
    renderWithProviders(
      <WslInstanceUninstallModal
        close={vi.fn()}
        instances={[compliantInstanceChild]}
        isOpen={true}
        parentId={windowsInstance.id}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: /uninstall/i });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");

    const input = screen.getByRole("textbox");
    await user.type(input, `uninstall ${compliantInstanceChild.name}`);

    expect(
      screen.getByRole("button", { name: /uninstall/i }),
    ).not.toHaveAttribute("aria-disabled", "true");
  });
});
