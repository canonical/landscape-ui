import { CONTACT_SUPPORT_TEAM_MESSAGE, HOMEPAGE_PATH } from "@/constants";
import type { AuthContextProps } from "@/context/auth";
import type { EnvContextState } from "@/context/env";
import type { AuthStateResponse } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OidcAuthPage from "./OidcAuthPage";

const safeRedirect = vi.fn();
const navigate = vi.fn();
const setUser = vi.fn();
const setSearchParams = vi.fn();
let searchParams = "";

vi.mock("@/hooks/useEnv");
vi.mock("@/hooks/useAuth");
vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: () => navigate,
  useSearchParams: () => [new URLSearchParams(searchParams), setSearchParams],
}));

const mockSelfHosted: EnvContextState = {
  envLoading: false,
  isSaas: false,
  isSelfHosted: true,
  packageVersion: "",
  revision: "",
  displayDisaStigBanner: false,
};

const mockSaas: EnvContextState = {
  envLoading: false,
  isSaas: true,
  isSelfHosted: false,
  packageVersion: "",
  revision: "",
  displayDisaStigBanner: false,
};

type CallbackAuthState = Extract<AuthStateResponse, { token: string }>;

const authStateBase: CallbackAuthState = {
  ...authUser,
  return_to: null,
  self_hosted: false,
  identity_source: "",
  attach_code: null,
  invitation_id: null,
};

const buildAuthState = (overrides: Partial<typeof authStateBase> = {}) => ({
  ...authStateBase,
  ...overrides,
});

const mockAuthContext: AuthContextProps = {
  authLoading: false,
  authorized: true,
  hasAccounts: true,
  logout: vi.fn(),
  redirectToExternalUrl: vi.fn(),
  safeRedirect,
  setUser,
  user: authUser,
  isFeatureEnabled: () => false,
};

describe("OidcAuthPage", () => {
  beforeEach(() => {
    setEndpointStatus("default");
    searchParams = "code=mock-code&state=mock-state";
    vi.clearAllMocks();
    vi.mocked(useEnv).mockReturnValue(mockSaas);
    vi.mocked(useAuth).mockReturnValue(mockAuthContext);
  });

  it("renders the fallback state when there are no search params", async () => {
    searchParams = "";
    renderWithProviders(<OidcAuthPage />);

    expect(
      await screen.findByText(CONTACT_SUPPORT_TEAM_MESSAGE),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to login" }),
    ).toBeInTheDocument();
  });

  it("renders the fallback state when the auth request fails", async () => {
    setEndpointStatus({ status: "error", path: "auth/handle-code" });

    renderWithProviders(<OidcAuthPage />);

    expect(
      await screen.findByText(CONTACT_SUPPORT_TEAM_MESSAGE),
    ).toBeInTheDocument();
  });

  it("requests an external redirect when return_to is external", async () => {
    setEndpointStatus({
      status: "variant",
      path: "auth/handle-code",
      response: buildAuthState({
        return_to: {
          external: true,
          url: "https://example.com",
        },
      }),
    });

    renderWithProviders(<OidcAuthPage />);

    await waitFor(() => {
      expect(safeRedirect).toHaveBeenCalledWith("https://example.com", {
        external: true,
        replace: true,
      });
    });
  });

  it("redirects to the internal return_to URL", async () => {
    setEndpointStatus({
      status: "variant",
      path: "auth/handle-code",
      response: buildAuthState({
        return_to: {
          external: false,
          url: "/dashboard",
        },
      }),
    });

    renderWithProviders(<OidcAuthPage />);

    await waitFor(() => {
      expect(safeRedirect).toHaveBeenCalledWith("/dashboard", {
        external: false,
        replace: true,
      });
    });
  });

  it("redirects to the homepage when return_to is not provided", async () => {
    setEndpointStatus({
      status: "variant",
      path: "auth/handle-code",
      response: buildAuthState(),
    });

    renderWithProviders(<OidcAuthPage />);

    await waitFor(() => {
      expect(safeRedirect).toHaveBeenCalledWith(HOMEPAGE_PATH, {
        external: false,
        replace: true,
      });
    });
  });

  it("redirects to the invitation page when invitation_id is present", async () => {
    setEndpointStatus({
      status: "variant",
      path: "auth/handle-code",
      response: buildAuthState({
        invitation_id: "test-secure-id",
      }),
    });

    renderWithProviders(<OidcAuthPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        "/accept-invitation/test-secure-id",
        {
          replace: true,
        },
      );
    });
  });

  it("redirects to the attach page when attach_code is present", async () => {
    setEndpointStatus({
      status: "variant",
      path: "auth/handle-code",
      response: buildAuthState({
        attach_code: "123123",
      }),
    });

    renderWithProviders(<OidcAuthPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/attach", {
        replace: true,
        state: { success: true },
      });
    });
  });

  it("redirects SaaS users with no accounts to no-access by default", async () => {
    setEndpointStatus({
      status: "variant",
      path: "auth/handle-code",
      response: buildAuthState({
        accounts: [],
        current_account: "",
      }),
    });

    renderWithProviders(<OidcAuthPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/no-access", { replace: true });
    });
  });

  it("redirects public SaaS users with no accounts to create-account", async () => {
    const currentLocation = window.location;

    vi.spyOn(window, "location", "get").mockReturnValue({
      ...currentLocation,
      hostname: "landscape.canonical.com",
    } as Location);

    setEndpointStatus({
      status: "variant",
      path: "auth/handle-code",
      response: buildAuthState({
        accounts: [],
        current_account: "",
      }),
    });

    renderWithProviders(<OidcAuthPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/create-account", {
        replace: true,
      });
    });
  });

  it("redirects self-hosted users with no accounts to create-account when no standalone account exists", async () => {
    vi.mocked(useEnv).mockReturnValue(mockSelfHosted);

    setEndpointStatus([
      {
        status: "variant",
        path: "auth/handle-code",
        response: buildAuthState({
          accounts: [],
          current_account: "",
        }),
      },
      {
        status: "variant",
        path: "standalone-account",
        response: { exists: false },
      },
    ]);

    renderWithProviders(<OidcAuthPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/create-account", {
        replace: true,
      });
    });
  });

  it("redirects self-hosted users with no accounts to no-access when a standalone account exists", async () => {
    vi.mocked(useEnv).mockReturnValue(mockSelfHosted);

    setEndpointStatus({
      status: "variant",
      path: "auth/handle-code",
      response: buildAuthState({
        accounts: [],
        current_account: "",
      }),
    });

    renderWithProviders(<OidcAuthPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/no-access", {
        replace: true,
      });
    });
  });
});
