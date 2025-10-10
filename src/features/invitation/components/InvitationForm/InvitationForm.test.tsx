import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe } from "vitest";
import { vi } from "vitest";
import InvitationForm from "./InvitationForm";
import useAuth from "@/hooks/useAuth";
import { PATHS } from "@/libs/routes";
import type { AuthContextProps } from "@/context/auth";
import { authUser } from "@/tests/mocks/auth";
import { invitationsSummary } from "@/tests/mocks/invitations";

vi.mock("@/hooks/useAuth");

const authProps: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setAuthLoading: vi.fn(),
  setUser: vi.fn(),
  user: { ...authUser, invitation_id: "1" },
  redirectToExternalUrl: vi.fn(),
  isFeatureEnabled: vi.fn(),
  hasAccounts: true,
};

const props: ComponentProps<typeof InvitationForm> = {
  accountTitle: "Test Account",
  onReject: vi.fn(),
};

const inviteId = invitationsSummary[0].secure_id;

describe("InvitationForm", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(authProps);
  });

  it("should render the invitation form with account title", () => {
    renderWithProviders(
      <InvitationForm {...props} />,
      {},
      `/accept-invitation/${inviteId}`,
      PATHS.auth.invitation,
    );

    expect(
      screen.getByText(
        "You have been invited as an administrator for Test Account",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Accepting this invitation will make you an administrator for the Test Account organization.",
      ),
    ).toBeInTheDocument();
  });

  it("should render accept and reject buttons", () => {
    renderWithProviders(
      <InvitationForm {...props} />,
      {},
      `/accept-invitation/${inviteId}`,
      PATHS.auth.invitation,
    );

    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
  });

  it("should call onReject when reject button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InvitationForm {...props} />,
      {},
      `/accept-invitation/${inviteId}`,
      PATHS.auth.invitation,
    );

    const rejectButton = screen.getByRole("button", { name: "Reject" });
    await user.click(rejectButton);

    expect(props.onReject).toHaveBeenCalled();
  });
});
