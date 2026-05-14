import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import WslInstanceRemoveFromLandscapeModal from "./WslInstanceRemoveFromLandscapeModal";
import { compliantInstanceChild } from "@/tests/mocks/wsl";
import type { InstanceChild } from "@/types/Instance";

const secondInstance: InstanceChild = {
  ...compliantInstanceChild,
  name: "second-instance",
  computer_id: 7,
};

describe("WslInstanceRemoveFromLandscapeModal", () => {
  const user = userEvent.setup();

  it("renders nothing when instances array is empty", () => {
    renderWithProviders(
      <WslInstanceRemoveFromLandscapeModal
        close={vi.fn()}
        instances={[]}
        isOpen={true}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

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

  it("calls onSuccess and shows success notification on confirm", async () => {
    const onSuccess = vi.fn();
    renderWithProviders(
      <WslInstanceRemoveFromLandscapeModal
        close={vi.fn()}
        instances={[compliantInstanceChild]}
        isOpen={true}
        onSuccess={onSuccess}
      />,
    );

    const input = screen.getByRole("textbox");
    await user.type(input, `remove ${compliantInstanceChild.name}`);
    await user.click(screen.getByRole("button", { name: /^remove$/i }));

    expect(
      await screen.findByText(
        `You have successfully removed ${compliantInstanceChild.name} from Landscape.`,
      ),
    ).toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it("shows plural text for multiple instances", async () => {
    renderWithProviders(
      <WslInstanceRemoveFromLandscapeModal
        close={vi.fn()}
        instances={[compliantInstanceChild, secondInstance]}
        isOpen={true}
      />,
    );

    expect(
      screen.getByText(/they will remain on the parent machine/i),
    ).toBeInTheDocument();
  });

  it("does not remove when computer_id is null", async () => {
    const nullComputerInstance: InstanceChild = {
      ...compliantInstanceChild,
      computer_id: null,
    };

    const closeFn = vi.fn();
    renderWithProviders(
      <WslInstanceRemoveFromLandscapeModal
        close={closeFn}
        instances={[nullComputerInstance]}
        isOpen={true}
      />,
    );

    const input = screen.getByRole("textbox");
    await user.type(input, `remove ${nullComputerInstance.name}`);
    await user.click(screen.getByRole("button", { name: /^remove$/i }));

    expect(closeFn).toHaveBeenCalled();
    expect(screen.queryByText(/successfully removed/i)).not.toBeInTheDocument();
  });
});
