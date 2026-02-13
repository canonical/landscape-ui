import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import { FeatureGuard } from "../FeatureGuard";
import { HOMEPAGE_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";
import type { FeatureKey } from "@/types/FeatureKey";
import type { AuthContextProps } from "@/context/auth";
import { authUser } from "@/tests/mocks/auth";

const navigate = vi.fn();

const authProps: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  user: authUser,
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
  isFeatureEnabled: vi.fn(),
  hasAccounts: true,
};

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => {
      navigate(to); // Mock <Navigate> component behavior
      return null;
    },
  };
});

vi.mock("@/hooks/useAuth");

describe("FeatureGuard", () => {
  it("should render children if feature is enabled", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authProps,
      isFeatureEnabled: (key: string) => key === "cool-feature",
    });

    renderWithProviders(
      <FeatureGuard feature={"cool-feature" as FeatureKey}>
        Feature Content
      </FeatureGuard>,
    );

    expect(screen.getByText("Feature Content")).toBeInTheDocument();
  });

  it("should redirect to homepage if feature is disabled", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authProps,
      isFeatureEnabled: () => false,
    });

    renderWithProviders(
      <FeatureGuard feature={"unknown-feature" as FeatureKey}>
        Feature Content
      </FeatureGuard>,
    );

    expect(screen.queryByText("Feature Content")).not.toBeInTheDocument();
    expect(navigate).toHaveBeenCalledWith(HOMEPAGE_PATH);
  });
});
