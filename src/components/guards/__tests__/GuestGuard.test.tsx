import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import { HOMEPAGE_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";
import type { AuthContextProps } from "@/context/auth";
import { authUser } from "@/tests/mocks/auth";

const navigate = vi.fn();
const safeRedirect = vi.fn();

vi.mock("@/hooks/useAuth");

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

const mockSearchParams = (params: Record<string, string> = {}) => {
  vi.doMock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
      ...actual,
      useNavigate: () => navigate,
      useSearchParams: () => [new URLSearchParams(params)],
    };
  });
};

describe("GuestGuard", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });

  const setup = async (authState: AuthContextProps, params = {}) => {
    mockSearchParams(params);

    // We import the component AFTER mocking modules to apply doMock
    const { GuestGuard: Guard } = await import("../GuestGuard");

    vi.mocked(useAuth).mockReturnValue({
      ...authState,
      safeRedirect,
    });

    renderWithProviders(<Guard>Guest Content</Guard>);
  };

  it("should render loading state", async () => {
    await setup({
      ...authProps,
      authorized: false,
      authLoading: true,
      hasAccounts: false,
    });

    const loadingSpinner = await screen.findByRole("status");
    expect(loadingSpinner).toHaveTextContent("Loading...");
  });

  it("should render children if user is NOT authorized", async () => {
    await setup({
      ...authProps,
      authorized: false,
      authLoading: false,
      hasAccounts: false,
    });

    expect(screen.getByText("Guest Content")).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("should render children if authorized but HAS NO accounts", async () => {
    await setup({
      ...authProps,
      authorized: true,
      authLoading: false,
      hasAccounts: false,
    });

    expect(screen.getByText("Guest Content")).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

  describe("when authorized and has accounts", () => {
    const authorizedState = {
      ...authProps,
      authorized: true,
      authLoading: false,
      hasAccounts: true,
    };

    it("should redirect to HOMEPAGE if no redirect param exists", async () => {
      await setup(authorizedState, {}); // no params

      expect(navigate).toHaveBeenCalledWith(HOMEPAGE_PATH, { replace: true });
      expect(screen.queryByText("Guest Content")).not.toBeInTheDocument();
    });

    it("should redirect to internal 'redirect-to' url", async () => {
      await setup(authorizedState, { "redirect-to": "/dashboard/settings" });

      expect(safeRedirect).toHaveBeenCalledWith("/dashboard/settings", {
        external: false,
        replace: true,
      });
    });

    it("should request external redirect when external param is present", async () => {
      await setup(authorizedState, {
        "redirect-to": "https://google.com",
        external: "true",
      });

      expect(safeRedirect).toHaveBeenCalledWith("https://google.com", {
        external: true,
        replace: true,
      });
    });
  });
});
