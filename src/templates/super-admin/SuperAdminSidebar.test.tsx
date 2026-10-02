import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/libs/routes";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import SuperAdminSidebar from "./SuperAdminSidebar";

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
  isSuperAdmin: true,
  canManageAccounts: false,
};

const RETURN_TO = "/instances?tab=all";

const renderAt = (path: string) =>
  renderWithProviders(<SuperAdminSidebar returnTo={RETURN_TO} />, {}, path);

describe("SuperAdminSidebar", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(mockAuth);
  });

  it("renders the super admin navigation", () => {
    renderAt(ROUTES.superAdmin.accounts());

    expect(
      screen.getByRole("navigation", { name: "Super admin" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Super admin" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Accounts" })).toHaveAttribute(
      "href",
      ROUTES.superAdmin.accounts(),
    );
    expect(screen.getByRole("link", { name: "People" })).toHaveAttribute(
      "href",
      ROUTES.superAdmin.people(),
    );
  });

  it("marks the accounts section current on account pages too", () => {
    renderAt(ROUTES.superAdmin.account("acme"));

    expect(screen.getByRole("link", { name: "Accounts" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "People" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("marks the people page current", () => {
    renderAt(ROUTES.superAdmin.people());

    expect(screen.getByRole("link", { name: "People" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Accounts" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("links back to the route the mode was entered from", () => {
    renderAt(ROUTES.superAdmin.accounts());

    expect(
      screen.getByRole("link", { name: "Back to normal view" }),
    ).toHaveAttribute("href", RETURN_TO);
  });

  it("signs out", async () => {
    const logout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({ ...mockAuth, logout });

    renderAt(ROUTES.superAdmin.accounts());

    await user.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
    });
  });

  it("toggles the menu on mobile", async () => {
    renderAt(ROUTES.superAdmin.accounts());

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("is-collapsed");

    await user.click(screen.getByRole("button", { name: /menu/i }));
    expect(header).not.toHaveClass("is-collapsed");

    await user.click(screen.getByRole("button", { name: /close navigation/i }));
    expect(header).toHaveClass("is-collapsed");
  });
});
