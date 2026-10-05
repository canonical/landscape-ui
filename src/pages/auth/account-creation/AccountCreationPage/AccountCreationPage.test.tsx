import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthContextProps } from "@/context/auth";
import type { EnvContextState } from "@/context/env";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import { HOMEPAGE_PATH } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import AccountCreationPage from "./AccountCreationPage";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useEnv");
const navigateMock = vi.hoisted(() => vi.fn());

vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: () => navigateMock,
}));

const mockAuth: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  user: authUser,
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
  isFeatureEnabled: vi.fn().mockReturnValue(false),
  hasAccounts: false,
  isSuperAdmin: false,
  canManageAccounts: false,
};

const mockEnv: EnvContextState = {
  envLoading: false,
  isSaas: false,
  isSelfHosted: false,
  packageVersion: "",
  revision: "",
  displayDisaStigBanner: false,
};

describe("AccountCreationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state while authLoading", () => {
    vi.mocked(useAuth).mockReturnValue({ ...mockAuth, authLoading: true });
    vi.mocked(useEnv).mockReturnValue(mockEnv);

    renderWithProviders(<AccountCreationPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows loading state while envLoading", () => {
    vi.mocked(useAuth).mockReturnValue(mockAuth);
    vi.mocked(useEnv).mockReturnValue({ ...mockEnv, envLoading: true });

    renderWithProviders(<AccountCreationPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows AccountCreationSelfHostedForm when isSelfHosted is true", async () => {
    setEndpointStatus({
      status: "variant",
      path: "standalone-account",
      response: { exists: false },
    });
    vi.mocked(useAuth).mockReturnValue({ ...mockAuth, authorized: false });
    vi.mocked(useEnv).mockReturnValue({ ...mockEnv, isSelfHosted: true });

    renderWithProviders(<AccountCreationPage />);

    expect(
      await screen.findByRole("heading", { name: /create.*account/i }),
    ).toBeInTheDocument();
  });

  it("shows AccountCreationSaaSForm when authorized and not self-hosted", async () => {
    vi.mocked(useAuth).mockReturnValue({ ...mockAuth, authorized: true });
    vi.mocked(useEnv).mockReturnValue({ ...mockEnv, isSelfHosted: false });

    renderWithProviders(<AccountCreationPage />);

    expect(
      await screen.findByRole("heading", { name: /create.*account/i }),
    ).toBeInTheDocument();
  });

  it("shows Redirecting when not authorized and not self-hosted", () => {
    vi.mocked(useAuth).mockReturnValue({ ...mockAuth, authorized: false });
    vi.mocked(useEnv).mockReturnValue({ ...mockEnv, isSelfHosted: false });

    renderWithProviders(<AccountCreationPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("redirects a user with accounts to the homepage", async () => {
    setEndpointStatus({
      status: "variant",
      path: "standalone-account",
      response: { exists: false },
    });
    vi.mocked(useAuth).mockReturnValue({ ...mockAuth, hasAccounts: true });
    vi.mocked(useEnv).mockReturnValue({ ...mockEnv, isSelfHosted: true });

    renderWithProviders(<AccountCreationPage />);

    await vi.waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(HOMEPAGE_PATH, {
        replace: true,
      });
    });
  });

  it("redirects to login when the self-hosted account already exists", async () => {
    setEndpointStatus({
      status: "variant",
      path: "standalone-account",
      response: { exists: true },
    });
    vi.mocked(useAuth).mockReturnValue({ ...mockAuth, authorized: false });
    vi.mocked(useEnv).mockReturnValue({ ...mockEnv, isSelfHosted: true });

    renderWithProviders(<AccountCreationPage />);

    await vi.waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login", { replace: true });
    });
  });

  it("redirects authenticated self-hosted users with accounts to the homepage when the standalone account exists", async () => {
    setEndpointStatus({
      status: "variant",
      path: "standalone-account",
      response: { exists: true },
    });
    vi.mocked(useAuth).mockReturnValue({
      ...mockAuth,
      authorized: true,
      hasAccounts: true,
    });
    vi.mocked(useEnv).mockReturnValue({ ...mockEnv, isSelfHosted: true });

    renderWithProviders(<AccountCreationPage />);

    await vi.waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(HOMEPAGE_PATH, {
        replace: true,
      });
    });
    expect(navigateMock).not.toHaveBeenCalledWith("/login", {
      replace: true,
    });
  });
});
