import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe } from "vitest";
import { setEndpointStatus } from "@/tests/controllers/controller";
import InvitationWelcome from "./InvitationWelcome";
import { expectLoadingState } from "@/tests/helpers";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";

describe("InvitationWelcome", () => {
  const defaultProps: ComponentProps<typeof InvitationWelcome> = {
    accountTitle: "Test Account",
  };

  it("should render the welcome message", async () => {
    renderWithProviders(<InvitationWelcome {...defaultProps} />);
    await expectLoadingState();

    expect(
      screen.getByText("You have been invited to Test Account"),
    ).toBeInTheDocument();
  });

  it("should show login methods when loaded successfully", async () => {
    renderWithProviders(<InvitationWelcome {...defaultProps} />);
    await expectLoadingState();

    expect(screen.getByText("Sign in with Ubuntu One")).toBeInTheDocument();
  });

  it("should show error message when login methods fail to load", async () => {
    setEndpointStatus("error");

    renderWithProviders(<InvitationWelcome {...defaultProps} />);
    await expectLoadingState();

    expect(screen.getByText(CONTACT_SUPPORT_TEAM_MESSAGE)).toBeInTheDocument();
  });
});
