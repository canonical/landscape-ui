import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import DashboardPage from "./DashboardPage";

vi.mock("@/hooks/useAuth");

const mockAuth: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  user: authUser,
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
  isFeatureEnabled: vi.fn().mockReturnValue(false),
  hasAccounts: true,
};

describe("DashboardPage", () => {
  it("renders without crashing", () => {
    vi.mocked(useAuth).mockReturnValue(mockAuth);

    renderWithProviders(<DashboardPage />);

    expect(document.body).toBeInTheDocument();
  });

  it("renders the navigation", async () => {
    vi.mocked(useAuth).mockReturnValue(mockAuth);

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByRole("navigation")).toBeInTheDocument();
  });
});
