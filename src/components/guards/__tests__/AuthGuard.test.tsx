import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import { AuthGuard } from "../AuthGuard";
import { ROUTES } from "@/libs/routes";
import useAuth from "@/hooks/useAuth";
import type { AuthContextProps } from "@/context/auth";
import { authUser } from "@/tests/mocks/auth";

const navigate = vi.fn();
const removeQueries = vi.fn();

const authProps: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setAuthLoading: vi.fn(),
  setUser: vi.fn(),
  user: authUser,
  redirectToExternalUrl: vi.fn(),
  isFeatureEnabled: vi.fn(),
  hasAccounts: true,
};

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({
      removeQueries,
    }),
  };
});

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigate,
    useLocation: () => ({
      pathname: "/dashboard/protected",
      search: "?sort=desc",
    }),
  };
});

vi.mock("@/hooks/useAuth");

describe("AuthGuard", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state while auth is loading", async () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authProps,
      authorized: false,
      authLoading: true,
      hasAccounts: false,
    });

    renderWithProviders(<AuthGuard>Protected Content</AuthGuard>);

    const loadingSpinner = await screen.findByRole("status");
    expect(loadingSpinner).toHaveTextContent("Loading...");
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should redirect to login if not authorized", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authProps,
      authorized: false,
      authLoading: false,
      hasAccounts: false,
    });

    renderWithProviders(<AuthGuard>Protected Content</AuthGuard>);

    // 1. Should NOT render children
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();

    // 2. Should clean sensitive data
    expect(removeQueries).toHaveBeenCalledWith(
      expect.objectContaining({ predicate: expect.any(Function) }),
    );

    // 3. Should redirect to login with correct return URL
    // expected redirect: /login?redirect-to=/dashboard/protected?sort=desc
    const expectedRedirect = ROUTES.auth.login({
      "redirect-to": "/dashboard/protected?sort=desc",
    });

    expect(navigate).toHaveBeenCalledWith(expectedRedirect, { replace: true });
  });

  it("should redirect to create-account if authorized but has no accounts", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authProps,
      authorized: true,
      authLoading: false,
      hasAccounts: false,
    });

    renderWithProviders(<AuthGuard>Protected Content</AuthGuard>);

    expect(navigate).toHaveBeenCalledWith(ROUTES.auth.createAccount(), {
      replace: true,
    });
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should render children if authorized and has accounts", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authProps,
      authorized: true,
      authLoading: false,
      hasAccounts: true,
    });

    renderWithProviders(<AuthGuard>Protected Content</AuthGuard>);

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });
});
