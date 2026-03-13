import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, it, vi } from "vitest";
import InstanceRemoveFromLandscapeModal from "./InstanceRemoveFromLandscapeModal";

const props = {
  isOpen: true,
  close: vi.fn(),
  instances: [instances[0]],
} as const satisfies ComponentProps<typeof InstanceRemoveFromLandscapeModal>;

describe("InstanceRemoveFromLandscapeModal", () => {
  const user = userEvent.setup();

  it("renders confirmation modal", async () => {
    renderWithProviders(<InstanceRemoveFromLandscapeModal {...props} />);

    const modalTitle = screen.getByText(
      `Remove ${props.instances[0].title} from Landscape`,
    );
    expect(modalTitle).toBeInTheDocument();

    const modalBody = screen.getByText(
      /this will delete all associated data and free up one license slot/i,
    );
    expect(modalBody).toBeInTheDocument();
  });

  it("calls close function on cancel", async () => {
    renderWithProviders(<InstanceRemoveFromLandscapeModal {...props} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(props.close).toHaveBeenCalled();
  });

  it("calls onSuccess on confirm", async () => {
    const onSuccess = vi.fn();

    renderWithProviders(
      <InstanceRemoveFromLandscapeModal {...props} onSuccess={onSuccess} />,
    );

    const confirmationTextInput = screen.getByRole("textbox");
    await user.type(
      confirmationTextInput,
      `remove ${props.instances[0].title}`,
    );

    const confirmButton = screen.getByRole("button", { name: /remove/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(props.close).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
