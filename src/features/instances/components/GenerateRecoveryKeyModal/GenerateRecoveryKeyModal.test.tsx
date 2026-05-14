import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import GenerateRecoveryKeyModal from "./GenerateRecoveryKeyModal";
import { instanceNoActivityNoKey } from "@/tests/mocks/instance";
import type { ComponentProps } from "react";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectErrorNotification } from "@/tests/helpers";

describe("GenerateRecoveryKeyModal", () => {
  const mockOnClose = vi.fn();
  const user = userEvent.setup();

  const props: ComponentProps<typeof GenerateRecoveryKeyModal> = {
    instance: instanceNoActivityNoKey,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with instance title and description", () => {
    renderWithProviders(<GenerateRecoveryKeyModal {...props} />);

    expect(
      screen.getByText(`Generate recovery key for "${props.instance.title}"`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /This key allows you to unlock and access encrypted data/i,
      ),
    ).toBeInTheDocument();
  });

  it("calls onClose when the modal is closed without confirming", async () => {
    renderWithProviders(<GenerateRecoveryKeyModal {...props} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles the success path: generates key, notifies, and closes", async () => {
    renderWithProviders(<GenerateRecoveryKeyModal {...props} />);

    const confirmButton = screen.getByRole("button", {
      name: /Generate recovery key/i,
    });
    await user.click(confirmButton);

    const notificationMessage = await screen.findByText(
      /Recovery key generation has been queued in Activities/i,
    );
    expect(notificationMessage).toBeInTheDocument();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles the error path: logs to debug and still closes", async () => {
    setEndpointStatus("error");
    renderWithProviders(<GenerateRecoveryKeyModal {...props} />);

    const confirmButton = screen.getByRole("button", {
      name: /Generate recovery key/i,
    });
    await user.click(confirmButton);

    expectErrorNotification();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
