import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import RegenerateRecoveryKeyModal from "./RegenerateRecoveryKeyModal";
import {
  instanceNoActivityWithKey,
  instanceActivityWithKey,
} from "@/tests/mocks/instance";
import type { ComponentProps } from "react";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectErrorNotification } from "@/tests/helpers";

describe("RegenerateRecoveryKeyModal", () => {
  const mockOnClose = vi.fn();
  const user = userEvent.setup();

  const props: ComponentProps<typeof RegenerateRecoveryKeyModal> = {
    instance: instanceNoActivityWithKey,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with standard description when no activity is in progress", () => {
    renderWithProviders(<RegenerateRecoveryKeyModal {...props} />);

    expect(
      screen.getByText(`Regenerate recovery key for "${props.instance.title}"`),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Regenerating the recovery key will make the existing key unavailable/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders correctly with a warning and link when an activity is in progress", async () => {
    renderWithProviders(
      <RegenerateRecoveryKeyModal
        {...props}
        instance={instanceActivityWithKey}
      />,
    );

    expect(
      await screen.findByText(
        /A recovery key generation activity is currently in progress/i,
      ),
    ).toBeInTheDocument();
  });

  it("calls onClose when the modal is closed without confirming", async () => {
    renderWithProviders(<RegenerateRecoveryKeyModal {...props} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles the success path: types confirmation, generates key, notifies, and closes", async () => {
    renderWithProviders(<RegenerateRecoveryKeyModal {...props} />);

    const confirmationInput = screen.getByRole("textbox");
    await user.type(confirmationInput, "regenerate recovery key");

    const confirmButton = screen.getByRole("button", {
      name: /Regenerate recovery key/i,
    });

    expect(confirmButton).not.toBeDisabled();
    await user.click(confirmButton);

    const notificationMessage = await screen.findByText(
      /Recovery key generation has been queued in Activities/i,
    );
    expect(notificationMessage).toBeInTheDocument();

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("handles the error path: types confirmation, logs to debug and still closes", async () => {
    setEndpointStatus("error");
    renderWithProviders(<RegenerateRecoveryKeyModal {...props} />);

    const confirmationInput = screen.getByRole("textbox");
    await user.type(confirmationInput, "regenerate recovery key");

    const confirmButton = screen.getByRole("button", {
      name: /Regenerate recovery key/i,
    });
    await user.click(confirmButton);

    expectErrorNotification();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
