import {
  API_URL,
  CONTACT_SUPPORT_TEAM_MESSAGE,
  HOMEPAGE_PATH,
} from "@/constants";
import type { AuthContextProps } from "@/context/auth";
import type { EnvContextState } from "@/context/env";
import type { AuthStateResponse } from "@/features/auth";
import { useGetUbuntuOneCompletion } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { screen, waitFor } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { useNavigate } from "react-router";
import type * as ReactRouter from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UbuntuOneAuthPage from "./UbuntuOneAuthPage";

const safeRedirect = vi.fn();
const navigate = vi.fn();
const setUser = vi.fn();
const setSearchParams = vi.fn();
const STANDALONE_ACCOUNT_CHECK_DELAY_MS = 250;
let searchParams = "";

vi.mock("@/hooks/useEnv");
vi.mock("@/hooks/useAuth");
vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: vi.fn(() => navigate),
  useSearchParams: () => [new URLSearchParams(searchParams), setSearchParams],
}));

const mockSelfHosted: EnvContextState = {
  envLoading: false,
  envError: false,
  isSaas: false,
  isSelfHosted: true,
  packageVersion: "",
  revision: "",
  displayDisaStigBanner: false,
};

const mockSaas: EnvContextState = {
  envLoading: false,
  envError: false,
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
  isSuperAdmin: false,
  canManageAccounts: false,
  logout: vi.fn(),
  redirectToExternalUrl: vi.fn(),
  safeRedirect,
  setUser,
  user: authUser,
  isFeatureEnabled: () => false,
};

const CallbackResult = () => {
  const { authData } = useGetUbuntuOneCompletion(
    window.location.toString(),
    true,
  );
  return authData ? <span>Authentication completed</span> : null;
};

describe("UbuntuOneAuthPage", () => {
  beforeEach(() => {
    setEndpointStatus("default");
    searchParams = "enabled=true";
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    vi.mocked(useEnv).mockReturnValue(mockSaas);
    vi.mocked(useAuth).mockReturnValue(mockAuthContext);
  });

  it("shows an environment failure without routing a user with no accounts to no-access", async () => {
    const router = await vi.importActual<typeof ReactRouter>("react-router");
    vi.mocked(useNavigate).mockImplementation(router.useNavigate);
    vi.mocked(useEnv).mockReturnValue({
      ...mockSaas,
      envError: true,
      isSaas: false,
    });
    setEndpointStatus({
      status: "variant",
      path: "auth/ubuntu-one/complete",
      response: buildAuthState({ accounts: [], current_account: "" }),
    });

    renderWithProviders(
      <>
        <UbuntuOneAuthPage />
        <CallbackResult />
        <LocationDisplay />
      </>,
      undefined,
      "/handle-ubuntu-one",
    );

    await screen.findByText("Authentication completed");
    expect(
      screen.getByText("Unable to load environment information."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent(/^\/handle-ubuntu-one$/);
  });

  it("completes existing-account sign-in when environment discovery fails", async () => {
    vi.mocked(useEnv).mockReturnValue({ ...mockSaas, envError: true });
    setEndpointStatus({
      status: "variant",
      path: "auth/ubuntu-one/complete",
      response: buildAuthState(),
    });

    renderWithProviders(<UbuntuOneAuthPage />);

    await waitFor(() => {
      expect(safeRedirect).toHaveBeenCalledWith(HOMEPAGE_PATH, {
        external: false,
        replace: true,
      });
    });
  });

  it("routes invitations when environment discovery fails", async () => {
    vi.mocked(useEnv).mockReturnValue({ ...mockSaas, envError: true });
    setEndpointStatus({
      status: "variant",
      path: "auth/ubuntu-one/complete",
      response: buildAuthState({ invitation_id: "invite-id" }),
    });

    renderWithProviders(<UbuntuOneAuthPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/accept-invitation/invite-id", {
        replace: true,
      });
    });
  });

  it("waits for the standalone-account check before choosing a first-admin route", async () => {
    vi.mocked(useEnv).mockReturnValue(mockSelfHosted);
    setEndpointStatus({
      status: "variant",
      path: "auth/ubuntu-one/complete",
      response: buildAuthState({ accounts: [], current_account: "" }),
    });
    server.use(
      http.get(`${API_URL}standalone-account`, async () => {
        await delay(STANDALONE_ACCOUNT_CHECK_DELAY_MS);
        return HttpResponse.json({ exists: true });
      }),
    );

    renderWithProviders(
      <>
        <UbuntuOneAuthPage />
        <CallbackResult />
      </>,
    );

    await screen.findByText("Authentication completed");
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalledWith("/create-account", {
      replace: true,
    });
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/no-access", { replace: true });
    });
  });

  it("does not route to account creation when standalone-account checking fails", async () => {
    vi.mocked(useEnv).mockReturnValue(mockSelfHosted);
    setEndpointStatus({
      status: "variant",
      path: "auth/ubuntu-one/complete",
      response: buildAuthState({ accounts: [], current_account: "" }),
    });
    server.use(
      http.get(`${API_URL}standalone-account`, () =>
        HttpResponse.json({ message: "Unavailable" }, { status: 500 }),
      ),
    );

    renderWithProviders(
      <>
        <UbuntuOneAuthPage />
        <CallbackResult />
      </>,
    );

    await screen.findByText("Authentication completed");
    expect(
      await screen.findByText(CONTACT_SUPPORT_TEAM_MESSAGE),
    ).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalledWith("/create-account", {
      replace: true,
    });
    expect(navigate).not.toHaveBeenCalledWith("/no-access", { replace: true });
  });

  it("waits for environment loading before routing a first-account user", async () => {
    const router = await vi.importActual<typeof ReactRouter>("react-router");
    vi.mocked(useNavigate).mockImplementation(router.useNavigate);
    vi.mocked(useEnv).mockReturnValue({
      ...mockSaas,
      envLoading: true,
      isSaas: false,
    });
    setEndpointStatus([
      {
        status: "variant",
        path: "auth/ubuntu-one/complete",
        response: buildAuthState({ accounts: [], current_account: "" }),
      },
      {
        status: "variant",
        path: "standalone-account",
        response: { exists: false },
      },
    ]);

    const { rerender } = renderWithProviders(
      <>
        <UbuntuOneAuthPage />
        <CallbackResult />
        <LocationDisplay />
      </>,
      undefined,
      "/handle-ubuntu-one",
    );

    await screen.findByText("Authentication completed");
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent(/^\/handle-ubuntu-one$/);

    vi.mocked(useEnv).mockReturnValue(mockSelfHosted);
    rerender(
      <>
        <UbuntuOneAuthPage />
        <CallbackResult />
        <LocationDisplay />
      </>,
    );

    await waitFor(() => {
      expect(getLocationDisplay()).toHaveTextContent(/^\/create-account$/);
    });
  });

  it("renders the fallback state when there are no search params", async () => {
    searchParams = "";
    renderWithProviders(<UbuntuOneAuthPage />);

    expect(
      await screen.findByText(CONTACT_SUPPORT_TEAM_MESSAGE),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to login" }),
    ).toBeInTheDocument();
  });

  it("renders the fallback state when the completion request fails", async () => {
    setEndpointStatus({ status: "error", path: "auth/ubuntu-one/complete" });

    renderWithProviders(<UbuntuOneAuthPage />);

    expect(
      await screen.findByText(CONTACT_SUPPORT_TEAM_MESSAGE),
    ).toBeInTheDocument();
  });

  it("requests an external redirect when return_to is external", async () => {
    setEndpointStatus({
      status: "variant",
      path: "auth/ubuntu-one/complete",
      response: buildAuthState({
        return_to: {
          external: true,
          url: "https://example.com",
        },
      }),
    });

    renderWithProviders(<UbuntuOneAuthPage />);

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
      path: "auth/ubuntu-one/complete",
      response: buildAuthState({
        return_to: {
          external: false,
          url: "/dashboard",
        },
      }),
    });

    renderWithProviders(<UbuntuOneAuthPage />);

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
      path: "auth/ubuntu-one/complete",
      response: buildAuthState(),
    });

    renderWithProviders(<UbuntuOneAuthPage />);

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
      path: "auth/ubuntu-one/complete",
      response: buildAuthState({
        invitation_id: "test-secure-id",
      }),
    });

    renderWithProviders(<UbuntuOneAuthPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        "/accept-invitation/test-secure-id",
        {
          replace: true,
        },
      );
    });
  });

  it("redirects SaaS users with no accounts to no-access by default", async () => {
    setEndpointStatus({
      status: "variant",
      path: "auth/ubuntu-one/complete",
      response: buildAuthState({
        accounts: [],
        current_account: "",
      }),
    });

    renderWithProviders(<UbuntuOneAuthPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/no-access", { replace: true });
    });
  });

  it("redirects public SaaS users with no accounts to create-account", async () => {
    const currentLocation = window.location;

    vi.spyOn(window, "location", "get").mockReturnValue({
      ...currentLocation,
      hostname: "landscape.canonical.com",
      toString: () => currentLocation.toString(),
    } as Location);

    setEndpointStatus({
      status: "variant",
      path: "auth/ubuntu-one/complete",
      response: buildAuthState({
        accounts: [],
        current_account: "",
      }),
    });

    renderWithProviders(<UbuntuOneAuthPage />);

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
        path: "auth/ubuntu-one/complete",
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

    renderWithProviders(<UbuntuOneAuthPage />);

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
      path: "auth/ubuntu-one/complete",
      response: buildAuthState({
        accounts: [],
        current_account: "",
      }),
    });

    renderWithProviders(<UbuntuOneAuthPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/no-access", { replace: true });
    });
  });
});
