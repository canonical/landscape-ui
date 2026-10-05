import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PATHS } from "@/libs/routes";
import InvitationRegistrationForm from "./InvitationRegistrationForm";

const invitationId = "test-secure-id";

const renderRegistrationForm = (
  overrides: Partial<ComponentProps<typeof InvitationRegistrationForm>> = {},
) => {
  const props: ComponentProps<typeof InvitationRegistrationForm> = {
    accountTitle: "Test Account",
    isPamEnabled: false,
    isPasswordEnabled: true,
    isAcceptingInvitation: false,
    acceptInvitation: vi.fn(),
    onSignIn: vi.fn(),
    ...overrides,
  };

  renderWithProviders(
    <InvitationRegistrationForm {...props} />,
    {},
    `/accept-invitation/${invitationId}`,
    PATHS.auth.invitation,
  );

  return props;
};

describe("InvitationRegistrationForm", () => {
  it("renders the password registration form when enabled", () => {
    renderRegistrationForm();

    expect(
      screen.getByText("Create a user to join Test Account"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.queryByLabelText("PAM identity")).not.toBeInTheDocument();
  });

  it("accepts a locally registered user with the invitation", async () => {
    const user = userEvent.setup();
    const { acceptInvitation } = renderRegistrationForm();

    await user.type(screen.getByLabelText("Full name"), "  Mickey Mouse  ");
    await user.type(
      screen.getByLabelText("Email address"),
      "mouse@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "Password1234");
    await user.click(screen.getByRole("button", { name: "Create user" }));

    expect(acceptInvitation).toHaveBeenCalledWith({
      name: "Mickey Mouse",
      email: "mouse@example.com",
      password: "Password1234",
      invitation_id: invitationId,
    });
  });

  it("renders and submits the PAM registration form when enabled", async () => {
    const user = userEvent.setup();
    const { acceptInvitation } = renderRegistrationForm({
      isPamEnabled: true,
      isPasswordEnabled: false,
    });

    expect(screen.getByLabelText("PAM identity")).toBeInTheDocument();
    expect(screen.getByLabelText("PAM password")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Full name"), "  Mickey Mouse  ");
    await user.type(
      screen.getByLabelText("Email address"),
      "mouse@example.com",
    );
    await user.type(screen.getByLabelText("PAM identity"), "  mickey mouse  ");
    await user.type(screen.getByLabelText("PAM password"), "PAMPassword!");
    await user.click(screen.getByRole("button", { name: "Create user" }));

    expect(acceptInvitation).toHaveBeenCalledWith({
      name: "Mickey Mouse",
      email: "mouse@example.com",
      identity: "  mickey mouse  ",
      password: "PAMPassword!",
      invitation_id: invitationId,
    });
  });

  it("does not render the local form when password registration is disabled", () => {
    renderRegistrationForm({ isPasswordEnabled: false });

    expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
  });
});
