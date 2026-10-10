import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, vi, it, expect, beforeEach } from "vitest";
import InvitationForm from "./InvitationForm";
import useAuth from "@/hooks/useAuth";
import { HOMEPAGE_PATH } from "@/constants";
import { PATHS } from "@/libs/routes";
import type { AuthContextProps } from "@/context/auth";
import { authUser } from "@/tests/mocks/auth";
import { invitationsSummary } from "@/tests/mocks/invitations";
import { setEndpointStatus } from "@/tests/controllers/controller";

const routerState = vi.hoisted(() => ({ search: "" }));

vi.mock("@/hooks/useAuth");
vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useSearchParams: () => [new URLSearchParams(routerState.search), vi.fn()],
}));

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
  isSuperAdmin: false,
  canManageAccounts: false,
};

const props: ComponentProps<typeof InvitationForm> = {
  accountTitle: "Test Account",
  onReject: vi.fn(),
};

const inviteId = invitationsSummary[0].secure_id;

describe("InvitationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerState.search = "";
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
      expect(authProps.safeRedirect).toHaveBeenCalledWith(HOMEPAGE_PATH, {
        replace: true,
        external: false,
      });
    });
  });

  it("should redirect to redirect-to after accepting", async () => {
    routerState.search = "redirect-to=%2Faccount%2Facme&external";
    const user = userEvent.setup();
    renderWithProviders(
      <InvitationForm {...props} />,
      {},
      `/accept-invitation/${inviteId}`,
      PATHS.auth.invitation,
    );

    await user.click(screen.getByRole("button", { name: "Accept" }));

    await waitFor(() => {
      expect(authProps.safeRedirect).toHaveBeenCalledWith("/account/acme", {
        replace: true,
        external: true,
      });
    });
  });

  it("should not redirect when accepting fails", async () => {
    setEndpointStatus({ status: "error", path: "accept-invitation" });
    const user = userEvent.setup();
    renderWithProviders(
      <InvitationForm {...props} />,
      {},
      `/accept-invitation/${inviteId}`,
      PATHS.auth.invitation,
    );

    await user.click(screen.getByRole("button", { name: "Accept" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Accept" })).not.toBeDisabled();
    });
    expect(authProps.safeRedirect).not.toHaveBeenCalled();
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
