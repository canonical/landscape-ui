import { setEndpointStatus } from "@/tests/controllers/controller";
import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import EditScriptConfirmationModal from "./EditScriptConfirmationModal";

const [scriptWithProfiles] = scripts;

type Props = ComponentProps<typeof EditScriptConfirmationModal>;

const defaultProps: Props = {
  script: scriptWithProfiles,
  confirmButtonLabel: "Submit new version",
  isConfirming: false,
  onConfirm: vi.fn(),
  onClose: vi.fn(),
};

describe("EditScriptConfirmationModal", () => {
  const user = userEvent.setup();

  it("should display the modal title with the script name", async () => {
    renderWithProviders(<EditScriptConfirmationModal {...defaultProps} />);

    expect(
      await screen.findByText(
        `Submit new version of "${scriptWithProfiles.title}"`,
      ),
    ).toBeInTheDocument();
  });

  it("should show the confirm button with the provided label", async () => {
    renderWithProviders(
      <EditScriptConfirmationModal
        {...defaultProps}
        confirmButtonLabel="Submit and run"
      />,
    );

    expect(
      await screen.findByRole("button", { name: "Submit and run" }),
    ).toBeInTheDocument();
  });

  it("should show a generic message when there are no associated profiles", async () => {
    setEndpointStatus({ status: "empty", path: "script-profiles" });

    renderWithProviders(<EditScriptConfirmationModal {...defaultProps} />);

    expect(
      await screen.findByText(
        /All future script runs will be done using the latest version of the code\./i,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should show the affected profiles table when there are associated profiles", async () => {
    renderWithProviders(<EditScriptConfirmationModal {...defaultProps} />);

    expect(
      await screen.findByText(
        /Submitting these changes will affect the following profiles/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByText(scriptWithProfiles.script_profiles[0].title),
    ).toBeInTheDocument();
  });

  it("should call onConfirm when the confirm button is clicked", async () => {
    const onConfirm = vi.fn();

    renderWithProviders(
      <EditScriptConfirmationModal {...defaultProps} onConfirm={onConfirm} />,
    );

    await user.click(
      await screen.findByRole("button", { name: /submit new version/i }),
    );

    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("should call onClose when the cancel button is clicked", async () => {
    const onClose = vi.fn();

    renderWithProviders(
      <EditScriptConfirmationModal {...defaultProps} onClose={onClose} />,
    );

    await user.click(await screen.findByRole("button", { name: /cancel/i }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("should disable the confirm button when isConfirming is true", async () => {
    renderWithProviders(
      <EditScriptConfirmationModal {...defaultProps} isConfirming={true} />,
    );

    const confirmButton = await screen.findByRole("button", {
      name: /waiting for action to complete/i,
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
  });
});
