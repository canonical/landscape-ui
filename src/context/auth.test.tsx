import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useFeatures from "@/hooks/useFeatures";
import {
  getSameOriginPath,
  getSameOriginUrl,
  redirectToExternalUrl,
  useGetAuthState,
} from "@/features/auth";
import { authUser } from "@/tests/mocks/auth";
import { HOMEPAGE_PATH } from "@/constants";
import { ROUTES } from "@/libs/routes";
import AuthProvider, { AuthContext } from "./auth";

const navigate = vi.hoisted(() => vi.fn());
const mockUseLocation = vi.hoisted(() => vi.fn());

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");

  return {
    ...actual,
    useNavigate: () => navigate,
    useLocation: () => mockUseLocation(),
  };
});

vi.mock("@/hooks/useFeatures");
vi.mock("@/features/auth");

describe("AuthProvider", () => {
  const wrapperWithProvider = (queryClient: QueryClient) => {
    return function Wrapper({ children }: { readonly children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      );
    };
  };

  const renderAuthContext = (queryClient: QueryClient) => {
    return renderHook(() => useContext(AuthContext), {
      wrapper: wrapperWithProvider(queryClient),
    });
  };

  beforeEach(() => {
    navigate.mockReset();

    mockUseLocation.mockReturnValue({ pathname: "/dashboard" });

    vi.mocked(useGetAuthState).mockReturnValue({
      user: authUser,
      isLoading: false,
      isFetched: true,
    });

    vi.mocked(useFeatures).mockReturnValue({
      isFeatureEnabled: vi.fn(() => true),
      isFeaturesLoading: false,
    });

    vi.mocked(getSameOriginUrl).mockReturnValue(
      new URL("/dashboard", window.location.origin),
    );
    vi.mocked(getSameOriginPath).mockReturnValue("/dashboard");
    vi.mocked(redirectToExternalUrl).mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("disables auth-state query when handling auth callbacks", () => {
    mockUseLocation.mockReturnValue({ pathname: "/auth/handle-auth" });

    const queryClient = new QueryClient();
    renderAuthContext(queryClient);

    expect(useGetAuthState).toHaveBeenCalledWith({ enabled: false });
  });

  it("exposes computed auth flags and feature checks", () => {
    const isFeatureEnabled = vi.fn(() => true);
    vi.mocked(useFeatures).mockReturnValue({
      isFeatureEnabled,
      isFeaturesLoading: false,
    });

    const queryClient = new QueryClient();
    const { result } = renderAuthContext(queryClient);

    expect(result.current.authorized).toBe(true);
    expect(result.current.hasAccounts).toBe(true);
    expect(result.current.authLoading).toBe(false);
    expect(result.current.isFeatureEnabled("spa-dashboard")).toBe(true);
  });

  it("sets auth user and clears non-auth queries on logout", () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(["authUser"], authUser);
    queryClient.setQueryData(["features", authUser.email], [{ key: "x" }]);

    const { result } = renderAuthContext(queryClient);

    act(() => {
      result.current.setUser(authUser);
    });

    expect(queryClient.getQueryData(["authUser"])).toEqual(authUser);

    act(() => {
      result.current.logout();
    });

    expect(queryClient.getQueryData(["authUser"])).toBeNull();
    expect(
      queryClient.getQueryData(["features", authUser.email]),
    ).toBeUndefined();
    expect(navigate).toHaveBeenCalledWith(ROUTES.auth.login(), {
      replace: true,
    });
  });

  it("navigates to homepage for unsafe redirect targets", () => {
    vi.mocked(getSameOriginUrl).mockReturnValue(null);

    const queryClient = new QueryClient();
    const { result } = renderAuthContext(queryClient);

    act(() => {
      result.current.safeRedirect("https://google.com");
    });

    expect(navigate).toHaveBeenCalledWith(HOMEPAGE_PATH, { replace: true });
  });

  it("navigates internally with same-origin safe path", () => {
    vi.mocked(getSameOriginUrl).mockReturnValue(
      new URL("/dashboard/settings", window.location.origin),
    );
    vi.mocked(getSameOriginPath).mockReturnValue("/dashboard/settings");

    const queryClient = new QueryClient();
    const { result } = renderAuthContext(queryClient);

    act(() => {
      result.current.safeRedirect("/dashboard/settings", { replace: false });
    });

    expect(navigate).toHaveBeenCalledWith("/dashboard/settings", {
      replace: false,
    });
  });

  it("uses external redirect helper when external option is requested", () => {
    const safeUrl = new URL("/dashboard/settings", window.location.origin);
    vi.mocked(getSameOriginUrl).mockReturnValue(safeUrl);

    const queryClient = new QueryClient();
    const { result } = renderAuthContext(queryClient);

    act(() => {
      result.current.safeRedirect("/dashboard/settings", {
        external: true,
        replace: false,
      });
    });

    expect(redirectToExternalUrl).toHaveBeenCalledWith(safeUrl.toString(), {
      replace: false,
    });
  });

  it("redirects to safe path fallback when same-origin URL has no path", () => {
    vi.mocked(getSameOriginUrl).mockReturnValue(
      new URL(window.location.origin),
    );
    vi.mocked(getSameOriginPath).mockReturnValue(null);

    const queryClient = new QueryClient();
    const { result } = renderAuthContext(queryClient);

    act(() => {
      result.current.safeRedirect(window.location.origin, { replace: false });
    });

    expect(navigate).toHaveBeenCalledWith(HOMEPAGE_PATH, { replace: false });
  });

  it("exposes hasAccounts false when user has no accounts", () => {
    vi.mocked(useGetAuthState).mockReturnValue({
      user: { ...authUser, accounts: [], current_account: "" },
      isLoading: false,
      isFetched: true,
    });

    const queryClient = new QueryClient();
    const { result } = renderAuthContext(queryClient);

    expect(result.current.authorized).toBe(true);
    expect(result.current.hasAccounts).toBe(false);
  });

  it("renders redirecting state while external redirect is in progress", async () => {
    const user = userEvent.setup();

    const TriggerExternalRedirect = () => {
      const { safeRedirect } = useContext(AuthContext);

      return (
        <button
          type="button"
          onClick={() => {
            safeRedirect("/dashboard", { external: true });
          }}
        >
          Trigger redirect
        </button>
      );
    };

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TriggerExternalRedirect />
        </AuthProvider>
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Trigger redirect" }));

    expect(screen.getAllByText("Redirecting...").length).toBeGreaterThan(0);
  });

  it("provides initial auth context defaults", () => {
    const { result } = renderHook(() => useContext(AuthContext));

    expect(result.current.authLoading).toBe(false);
    expect(result.current.authorized).toBe(false);
    expect(result.current.hasAccounts).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isFeatureEnabled("spa-dashboard")).toBe(false);
    expect(result.current.logout()).toBeUndefined();
    expect(result.current.setUser(authUser)).toBeUndefined();
    expect(result.current.safeRedirect()).toBeUndefined();
    expect(result.current.redirectToExternalUrl("/dashboard")).toBeUndefined();
  });
});
