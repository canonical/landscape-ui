import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import TextConfirmationModal from "./TextConfirmationModal";

const defaultProps = {
  close: vi.fn(),
  onConfirm: vi.fn(),
  confirmationText: "delete",
  confirmButtonLabel: "Confirm",
  title: "Confirm deletion",
};

describe("TextConfirmationModal", () => {
  const user = userEvent.setup();

  it("does not render when isOpen is false", () => {
    renderWithProviders(
      <TextConfirmationModal {...defaultProps} isOpen={false}>
        Are you sure?
      </TextConfirmationModal>,
    );

    expect(screen.queryByText("Confirm deletion")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true", () => {
    renderWithProviders(
      <TextConfirmationModal {...defaultProps} isOpen={true}>
        Are you sure?
      </TextConfirmationModal>,
    );

    expect(screen.getByText("Confirm deletion")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("shows the confirmation text hint", () => {
    renderWithProviders(
      <TextConfirmationModal {...defaultProps} isOpen={true}>
        Are you sure?
      </TextConfirmationModal>,
    );

    expect(screen.getByText("delete")).toBeInTheDocument();
  });

  it("disables confirm button when input is empty", () => {
    renderWithProviders(
      <TextConfirmationModal {...defaultProps} isOpen={true}>
        Are you sure?
      </TextConfirmationModal>,
    );

    expect(screen.getByRole("button", { name: "Confirm" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("disables confirm button when input does not match", async () => {
    renderWithProviders(
      <TextConfirmationModal {...defaultProps} isOpen={true}>
        Are you sure?
      </TextConfirmationModal>,
    );

    await user.type(screen.getByPlaceholderText("delete"), "wrong text");

    expect(screen.getByRole("button", { name: "Confirm" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("enables confirm button when input matches (case-insensitive)", async () => {
    renderWithProviders(
      <TextConfirmationModal {...defaultProps} isOpen={true}>
        Are you sure?
      </TextConfirmationModal>,
    );

    await user.type(screen.getByPlaceholderText("delete"), "DELETE");

    expect(screen.getByRole("button", { name: "Confirm" })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("calls onConfirm when confirmed with matching text", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <TextConfirmationModal
        {...defaultProps}
        isOpen={true}
        onConfirm={onConfirm}
      >
        Are you sure?
      </TextConfirmationModal>,
    );

    await user.type(screen.getByPlaceholderText("delete"), "delete");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls close when cancel button is clicked", async () => {
    const close = vi.fn();

    renderWithProviders(
      <TextConfirmationModal {...defaultProps} isOpen={true} close={close}>
        Are you sure?
      </TextConfirmationModal>,
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(close).toHaveBeenCalledTimes(1);
  });
});
