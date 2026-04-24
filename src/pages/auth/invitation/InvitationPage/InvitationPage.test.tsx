import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import InvitationPage from "./InvitationPage";
import { expectLoadingState } from "@/tests/helpers";

vi.mock("@/hooks/useAuth");

let mockSecureId = "1";
const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: () => ({ secureId: mockSecureId }),
    useSearchParams: () => [new URLSearchParams()],
    useNavigate: () => mockNavigate,
  };
});

const mockAuth: AuthContextProps = {
  logout: vi.fn(),
  authorized: false,
  authLoading: false,
  setUser: vi.fn(),
  user: null,
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
  isFeatureEnabled: vi.fn().mockReturnValue(false),
  hasAccounts: false,
};

describe("InvitationPage", () => {
  beforeEach(() => {
    mockSecureId = "1";
    mockNavigate.mockReset();
    vi.mocked(useAuth).mockReturnValue(mockAuth);
  });

  it("shows loading state while isLoading", async () => {
    renderWithProviders(<InvitationPage />);

    await expectLoadingState();
  });

  it("shows InvitationWelcome when not authorized and invitation exists", async () => {
    renderWithProviders(<InvitationPage />);

    expect(
      await screen.findByText(/You have been invited to/),
    ).toBeInTheDocument();
  });

  it("shows InvitationForm when authorized", async () => {
    vi.mocked(useAuth).mockReturnValue({
      ...mockAuth,
      authorized: true,
      user: authUser,
    });

    renderWithProviders(<InvitationPage />);

    expect(
      await screen.findByRole("button", { name: /accept/i }),
    ).toBeInTheDocument();
  });

  it("navigates to login when invitationId is not present", async () => {
    mockSecureId = "";

    renderWithProviders(<InvitationPage />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining("login"),
        { replace: true },
      );
    });
  });

  it("shows InvitationError when invitation summary is not found", async () => {
    mockSecureId = "not-found-id";

    renderWithProviders(<InvitationPage />);

    expect(
      await screen.findByText(/Invitation not found/i),
    ).toBeInTheDocument();

    const backButton = screen.getByRole("button", { name: /back to login/i });
    await userEvent.click(backButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it("shows InvitationRejected after rejecting when authorized", async () => {
    vi.mocked(useAuth).mockReturnValue({
      ...mockAuth,
      authorized: true,
      user: authUser,
    });

    renderWithProviders(<InvitationPage />);

    const rejectButton = await screen.findByRole("button", { name: /reject/i });
    await userEvent.click(rejectButton);

    await waitFor(() => {
      expect(
        screen.getByText(/you have rejected the invitation/i),
      ).toBeInTheDocument();
    });
  });
});
