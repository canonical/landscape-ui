import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import ScriptsPage from "./ScriptsPage";

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

describe("ScriptsPage", () => {
  it("renders Scripts heading", () => {
    vi.mocked(useAuth).mockReturnValue(mockAuth);

    renderWithProviders(<ScriptsPage />);

    expect(
      screen.getByRole("heading", { name: "Scripts" }),
    ).toBeInTheDocument();
  });

  it("shows notification about v2 scripts", () => {
    vi.mocked(useAuth).mockReturnValue(mockAuth);

    renderWithProviders(<ScriptsPage />);

    expect(
      screen.getByText(/this page only displays v2 scripts/i),
    ).toBeInTheDocument();
  });
});
