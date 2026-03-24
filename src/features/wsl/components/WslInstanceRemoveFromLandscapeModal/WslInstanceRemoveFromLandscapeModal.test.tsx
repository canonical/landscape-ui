import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import WslInstanceRemoveFromLandscapeModal from "./WslInstanceRemoveFromLandscapeModal";
import { compliantInstanceChild } from "@/tests/mocks/wsl";

describe("WslInstanceRemoveFromLandscapeModal", () => {
  const user = userEvent.setup();

  it("renders modal when open", () => {
    renderWithProviders(
      <WslInstanceRemoveFromLandscapeModal
        close={vi.fn()}
        instances={[compliantInstanceChild]}
        isOpen={true}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    renderWithProviders(
      <WslInstanceRemoveFromLandscapeModal
        close={vi.fn()}
        instances={[compliantInstanceChild]}
        isOpen={false}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("enables confirm button after typing the confirmation text", async () => {
    renderWithProviders(
      <WslInstanceRemoveFromLandscapeModal
        close={vi.fn()}
        instances={[compliantInstanceChild]}
        isOpen={true}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: /remove/i });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");

    const input = screen.getByRole("textbox");
    await user.type(input, `remove ${compliantInstanceChild.name}`);

    expect(screen.getByRole("button", { name: /remove/i })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
