import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import InvitationPage from "./InvitationPage";
import { expectLoadingState } from "@/tests/helpers";

vi.mock("@/hooks/useAuth");

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: () => ({ secureId: "1" }),
    useSearchParams: () => [new URLSearchParams()],
    useNavigate: () => vi.fn(),
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
  it("shows loading state while isLoading", async () => {
    vi.mocked(useAuth).mockReturnValue(mockAuth);

    renderWithProviders(<InvitationPage />);

    await expectLoadingState();
  });

  it("shows InvitationWelcome when not authorized and invitation exists", async () => {
    vi.mocked(useAuth).mockReturnValue(mockAuth);

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
});
