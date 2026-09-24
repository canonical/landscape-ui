import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import { SuperAdminGuard } from "../SuperAdminGuard";

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
  isSuperAdmin: false,
  canManageAccounts: false,
};

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => {
      navigate(to);
      return null;
    },
  };
});

vi.mock("@/hooks/useAuth");

describe("SuperAdminGuard", () => {
  beforeEach(() => {
    navigate.mockReset();
  });

  it("renders children for Canonical staff", () => {
    vi.mocked(useAuth).mockReturnValue({ ...authProps, isSuperAdmin: true });

    renderWithProviders(
      <SuperAdminGuard>
        <p>Staff only</p>
      </SuperAdminGuard>,
    );

    expect(screen.getByText("Staff only")).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("redirects everyone else to /", () => {
    vi.mocked(useAuth).mockReturnValue(authProps);

    renderWithProviders(
      <SuperAdminGuard>
        <p>Staff only</p>
      </SuperAdminGuard>,
    );

    expect(screen.queryByText("Staff only")).not.toBeInTheDocument();
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("waits for auth to load before deciding", () => {
    vi.mocked(useAuth).mockReturnValue({ ...authProps, authLoading: true });

    renderWithProviders(
      <SuperAdminGuard>
        <p>Staff only</p>
      </SuperAdminGuard>,
    );

    expect(screen.queryByText("Staff only")).not.toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });
});
