import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AuthContextProps } from "@/context/auth";
import type { EnvContextState } from "@/context/env";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import AccountCreationPage from "./AccountCreationPage";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useEnv");

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
});
