import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import IdentityProvidersContainer from "./IdentityProvidersContainer";
import { useGetLoginMethods } from "@/features/auth";
import { AxiosError } from "axios";

vi.mock("@/features/auth", async () => {
  const actual = await vi.importActual("@/features/auth");
  return {
    ...actual,
    useGetLoginMethods: vi.fn(),
    ProviderList: () => <div data-testid="provider-list">Provider List</div>,
    ProvidersEmptyState: () => (
      <div data-testid="empty-state">No Providers Found</div>
    ),
  };
});

describe("IdentityProvidersContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state", async () => {
    vi.mocked(useGetLoginMethods).mockReturnValue({
      loginMethods: null,
      loginMethodsLoading: true,
      isLoginMethodsError: false,
      error: null,
    });

    renderWithProviders(<IdentityProvidersContainer />);

    const loadingSpinner = await screen.findByRole("status");
    expect(loadingSpinner).toHaveTextContent("Loading...");
  });

  it("should render empty state when methods are undefined (api error)", () => {
    vi.mocked(useGetLoginMethods).mockReturnValue({
      loginMethods: null,
      loginMethodsLoading: false,
      isLoginMethodsError: true,
      error: new AxiosError("Failed"),
    });

    renderWithProviders(<IdentityProvidersContainer />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.queryByTestId("provider-list")).not.toBeInTheDocument();
  });

  it("should render empty state when no providers are available", () => {
    vi.mocked(useGetLoginMethods).mockReturnValue({
      loginMethods: {
        ubuntu_one: { available: false, enabled: false },
        oidc: { available: false, configurations: [] },
        pam: { available: false, enabled: false },
        password: { available: true, enabled: true },
        standalone_oidc: { available: false, enabled: false },
      },
      loginMethodsLoading: false,
      isLoginMethodsError: false,
      error: null,
    });

    renderWithProviders(<IdentityProvidersContainer />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("should render provider list when Ubuntu One is available", () => {
    vi.mocked(useGetLoginMethods).mockReturnValue({
      loginMethods: {
        ubuntu_one: { available: true, enabled: true },
        oidc: { available: false, configurations: [] },
        pam: { available: false, enabled: false },
        password: { available: true, enabled: true },
        standalone_oidc: { available: false, enabled: false },
      },
      loginMethodsLoading: false,
      isLoginMethodsError: false,
      error: null,
    });

    renderWithProviders(<IdentityProvidersContainer />);

    expect(screen.getByTestId("provider-list")).toBeInTheDocument();
    expect(screen.queryByTestId("empty-state")).not.toBeInTheDocument();
  });

  it("should render provider list when OIDC is available and has configurations", () => {
    vi.mocked(useGetLoginMethods).mockReturnValue({
      loginMethods: {
        ubuntu_one: { available: false, enabled: false },
        oidc: {
          available: true,
          configurations: [
            { id: 1, name: "Okta", provider: "okta", enabled: true },
          ],
        },
        pam: { available: false, enabled: false },
        password: { available: true, enabled: true },
        standalone_oidc: { available: false, enabled: false },
      },
      loginMethodsLoading: false,
      isLoginMethodsError: false,
      error: null,
    });

    renderWithProviders(<IdentityProvidersContainer />);

    expect(screen.getByTestId("provider-list")).toBeInTheDocument();
  });
});
