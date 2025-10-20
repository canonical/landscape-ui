import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import DetachTokenModal from "./DetachTokenModal";

describe("DetachTokenModal", () => {
  const props: ComponentProps<typeof DetachTokenModal> = {
    isOpen: true,
    onClose: vi.fn(),
    computerIds: [1],
  };

  it("does not render when isOpen is false", () => {
    renderWithProviders(<DetachTokenModal {...props} isOpen={false} />);

    expect(
      screen.queryByText("Detach Ubuntu Pro token"),
    ).not.toBeInTheDocument();
  });

  it("renders modal when isOpen is true", () => {
    renderWithProviders(<DetachTokenModal {...props} />);

    expect(screen.getByText("Detach Ubuntu Pro token")).toBeInTheDocument();
    expect(
      screen.getByText(/Detaching the Ubuntu Pro token will disconnect/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /detach/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("displays singular message for single instance", () => {
    renderWithProviders(<DetachTokenModal {...props} />);

    expect(
      screen.getByText(/disconnect this instance from its subscription/i),
    ).toBeInTheDocument();
  });

  it("displays plural message for multiple instances", () => {
    const computerIds = [1, 2, 3];

    renderWithProviders(
      <DetachTokenModal {...props} computerIds={computerIds} />,
    );

    expect(
      screen.getByText(
        new RegExp(
          `disconnect ${computerIds.length} instances from their subscription`,
          "i",
        ),
      ),
    ).toBeInTheDocument();
  });

  it("displays custom instance title when provided", () => {
    renderWithProviders(
      <DetachTokenModal {...props} instanceTitle="Test Server" />,
    );

    expect(screen.getByText("Detach Ubuntu Pro token")).toBeInTheDocument();
  });

  it("uses instanceCount when provided instead of computerIds length", () => {
    renderWithProviders(
      <DetachTokenModal {...props} computerIds={[1, 2]} instanceCount={5} />,
    );

    expect(
      screen.getByText(/disconnect 5 instances from their subscription/i),
    ).toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", async () => {
    const onClose = vi.fn();

    renderWithProviders(<DetachTokenModal {...props} onClose={onClose} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it("renders detach button with negative appearance", () => {
    renderWithProviders(<DetachTokenModal {...props} />);

    const detachButton = screen.getByRole("button", { name: /detach/i });
    expect(detachButton).toBeInTheDocument();
    expect(detachButton).toHaveClass("p-button--negative");
  });
});
