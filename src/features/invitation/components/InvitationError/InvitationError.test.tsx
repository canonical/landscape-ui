import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe } from "vitest";
import { vi } from "vitest";
import InvitationError from "./InvitationError";

const props: ComponentProps<typeof InvitationError> = {
  onBackToLogin: vi.fn(),
};

describe("InvitationError", () => {
  const user = userEvent.setup();

  it("should render the invitation error message", () => {
    renderWithProviders(<InvitationError {...props} />);

    expect(screen.getByText("Invitation not found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Unable to load invitation details. Please check your invitation link.",
      ),
    ).toBeInTheDocument();
  });

  it("should render the back to login button", () => {
    renderWithProviders(<InvitationError {...props} />);

    expect(
      screen.getByRole("button", { name: "Back to login" }),
    ).toBeInTheDocument();
  });

  it("should call onBackToLogin when button is clicked", async () => {
    renderWithProviders(<InvitationError {...props} />);

    const backButton = screen.getByRole("button", { name: "Back to login" });
    await user.click(backButton);

    expect(props.onBackToLogin).toHaveBeenCalled();
  });
});
