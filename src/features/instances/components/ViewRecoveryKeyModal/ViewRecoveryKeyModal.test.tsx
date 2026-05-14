import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import ViewRecoveryKeyModal from "./ViewRecoveryKeyModal";
import { expectLoadingState } from "@/tests/helpers";
import {
  instanceCanceledActivityWithKey,
  instanceActivityWithKey,
  instanceFailedActivityWithKey,
  instanceNoActivityWithKey,
} from "@/tests/mocks/instance";
import userEvent from "@testing-library/user-event";

describe("ViewRecoveryKeyModal", () => {
  const mockOnClose = vi.fn();
  const user = userEvent.setup();

  it("displays recovery key when fetched", async () => {
    renderWithProviders(
      <ViewRecoveryKeyModal
        instance={instanceNoActivityWithKey}
        onClose={mockOnClose}
      />,
    );

    expectLoadingState();

    expect(
      screen.getByText(
        `View recovery key for "${instanceNoActivityWithKey.title}"`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This key allows you to unlock/i),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/activity is in progress/i),
    ).not.toBeInTheDocument();
    expect(await screen.findByLabelText("Recovery key")).toBeInTheDocument();
  });

  it("shows activity message when recovery key generation is in progress", async () => {
    renderWithProviders(
      <ViewRecoveryKeyModal
        instance={instanceActivityWithKey}
        onClose={mockOnClose}
      />,
    );

    expectLoadingState();

    expect(
      screen.getByText(
        `View recovery key for "${instanceActivityWithKey.title}"`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This key allows you to unlock/i),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/activity is in progress/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Recovery key")).toBeInTheDocument();
  });

  it.each([
    [
      "failed",
      instanceFailedActivityWithKey,
      "The last attempt to regenerate this key failed.",
    ],
    [
      "canceled",
      instanceCanceledActivityWithKey,
      "The last attempt to regenerate this key was canceled.",
    ],
  ])(
    "shows warning information when last regeneration attempt was %s and key exists",
    async (_status, instance, expectedWarningMessage) => {
      renderWithProviders(
        <ViewRecoveryKeyModal instance={instance} onClose={mockOnClose} />,
      );

      await expectLoadingState();

      expect(
        await screen.findByText(expectedWarningMessage),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Recovery key")).toBeInTheDocument();
      expect(
        screen.queryByText(/activity is in progress/i),
      ).not.toBeInTheDocument();
    },
  );

  it("does not show warning information when there is no failed/canceled activity", async () => {
    renderWithProviders(
      <ViewRecoveryKeyModal
        instance={instanceNoActivityWithKey}
        onClose={mockOnClose}
      />,
    );

    await expectLoadingState();

    expect(
      screen.queryByText(/The last attempt to regenerate this key was/i),
    ).not.toBeInTheDocument();
  });

  it("calls onClose when the 'Done' button is clicked", async () => {
    renderWithProviders(
      <ViewRecoveryKeyModal
        instance={instanceNoActivityWithKey}
        onClose={mockOnClose}
      />,
    );

    expectLoadingState();

    const doneButton = await screen.findByRole("button", { name: /done/i });
    await user.click(doneButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
