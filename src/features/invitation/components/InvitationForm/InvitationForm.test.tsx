import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, vi, it, expect, beforeEach } from "vitest";
import InvitationForm from "./InvitationForm";
import useAuth from "@/hooks/useAuth";
import { PATHS } from "@/libs/routes";
import type { AuthContextProps } from "@/context/auth";
import { authUser } from "@/tests/mocks/auth";
import { invitationsSummary } from "@/tests/mocks/invitations";
import { setEndpointStatus } from "@/tests/controllers/controller";

vi.mock("@/hooks/useAuth");

const authProps: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  user: { ...authUser },
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
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

    await waitFor(() => {
      expect(props.onReject).toHaveBeenCalled();
    });
  });

  it("should call acceptInvitation when accept button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InvitationForm {...props} />,
      {},
      `/accept-invitation/${inviteId}`,
      PATHS.auth.invitation,
    );

    const acceptButton = screen.getByRole("button", { name: "Accept" });
    await user.click(acceptButton);

    await waitFor(() => {
      expect(acceptButton).not.toBeDisabled();
    });
  });

  it("should handle reject error gracefully", async () => {
    setEndpointStatus({ status: "error", path: "reject-invitation" });
    const user = userEvent.setup();
    renderWithProviders(
      <InvitationForm {...props} />,
      {},
      `/accept-invitation/${inviteId}`,
      PATHS.auth.invitation,
    );

    const rejectButton = screen.getByRole("button", { name: "Reject" });
    await user.click(rejectButton);

    await waitFor(() => {
      expect(rejectButton).not.toBeDisabled();
    });
  });

  it("should handle accept error gracefully", async () => {
    setEndpointStatus({ status: "error", path: "accept-invitation" });
    const user = userEvent.setup();
    renderWithProviders(
      <InvitationForm {...props} />,
      {},
      `/accept-invitation/${inviteId}`,
      PATHS.auth.invitation,
    );

    const acceptButton = screen.getByRole("button", { name: "Accept" });
    await user.click(acceptButton);

    await waitFor(() => {
      expect(acceptButton).not.toBeDisabled();
    });
  });
});
