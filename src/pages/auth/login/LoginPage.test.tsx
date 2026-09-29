import { describe, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import LoginPage from "./LoginPage";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";
import { expectLoadingState } from "@/tests/helpers";
import useEnv from "@/hooks/useEnv";
import type { EnvContextState } from "@/context/env";
import { standaloneAccountState } from "@/tests/server/handlers/standaloneAccount";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { pamLoginMethods, ubuntuOneOnlyLoginMethods } from "@/tests/mocks/loginMethods";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router";
import { AccountCreationAlternative } from "@/features/account-creation";

vi.mock("@/hooks/useEnv");

const envCommon: Omit<EnvContextState, "displayDisaStigBanner"> = {
  envLoading: false,
  packageVersion: "",
  revision: "",
  isSaas: true,
  isSelfHosted: false,
};

describe("LoginPage", () => {
  beforeEach(() => {
    vi.mocked(useEnv).mockReturnValue({
      ...envCommon,
      displayDisaStigBanner: false,
    });
    standaloneAccountState.exists = true;
  });

  afterEach(() => {
    standaloneAccountState.exists = true;
  });

  it("should render", async () => {
    renderWithProviders(<LoginPage />);

    await expectLoadingState();

    expect(screen.getByText("Sign in to Landscape")).toBeInTheDocument();

    await waitFor(() => {
      const errorMessage = screen.queryByText(CONTACT_SUPPORT_TEAM_MESSAGE);

      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  it("should render contact support message in case of error", async () => {
    setEndpointStatus("error");

    renderWithProviders(<LoginPage />);

    await expectLoadingState();

    await waitFor(() => {
      expect(screen.getByText(CONTACT_SUPPORT_TEAM_MESSAGE)).toBeVisible();
    });
  });

  it("should render consent banner modal when set to true", async () => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      ...envCommon,
      displayDisaStigBanner: true,
    });

    renderWithProviders(<LoginPage />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", {
        name: /proceed after acknowledging consent/i,
      }),
    ).toBeInTheDocument();
  });

  it("should not render consent banner modal when set to false", async () => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      ...envCommon,
      displayDisaStigBanner: false,
    });

    renderWithProviders(<LoginPage />);

    await expectLoadingState();

    expect(
      screen.queryByRole("heading", {
        name: /proceed after acknowledging consent/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("redirects to account creation on initial login when Ubuntu One is enabled", async () => {
    standaloneAccountState.exists = false;
    setEndpointStatus({
      status: "variant",
      path: "login/methods",
      response: ubuntuOneOnlyLoginMethods,
    });
    vi.mocked(useEnv).mockReturnValue({
      ...envCommon,
      isSelfHosted: true,
      isSaas: false,
      displayDisaStigBanner: false,
    });

    renderWithProviders(
      <>
        <LoginPage />
        <LocationDisplay />
      </>,
    );

    await waitFor(() => {
      expect(getLocationDisplay()).toHaveTextContent("create-account");
    });
  });

  it("shows login methods when federated login is explicitly requested", async () => {
    standaloneAccountState.exists = false;
    setEndpointStatus({
      status: "variant",
      path: "login/methods",
      response: ubuntuOneOnlyLoginMethods,
    });
    vi.mocked(useEnv).mockReturnValue({
      ...envCommon,
      isSelfHosted: true,
      isSaas: false,
      displayDisaStigBanner: false,
    });

    renderWithProviders(
      <Routes>
        <Route
          path="/create-account"
          element={
            <AccountCreationAlternative
              oidcEnabled={false}
              ubuntuOneEnabled
            />
          }
        />
        <Route
          path="/login"
          element={
            <>
              <LoginPage />
              <LocationDisplay />
            </>
          }
        />
      </Routes>,
      {},
      "/create-account",
    );

    await userEvent.click(
      screen.getByRole("link", { name: "Sign in with Ubuntu One instead" }),
    );

    expect(screen.getByText("Sign in to Landscape")).toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent("/login");
    expect(
      screen.getByRole("button", { name: /sign in with ubuntu one/i }),
    ).toBeInTheDocument();
  });

  it("redirects to account creation when no standalone account exists and only PAM is enabled", async () => {
    standaloneAccountState.exists = false;
    setEndpointStatus({
      status: "variant",
      path: "login/methods",
      response: pamLoginMethods,
    });
    vi.mocked(useEnv).mockReturnValue({
      ...envCommon,
      isSelfHosted: true,
      isSaas: false,
      displayDisaStigBanner: false,
    });

    renderWithProviders(
      <>
        <LoginPage />
        <LocationDisplay />
      </>,
    );

    // Loading state is shown while checking the standalone account
    expect(await screen.findByRole("status")).toBeInTheDocument();

    // After queries complete, navigate to /create-account is triggered
    await waitFor(() => {
      expect(getLocationDisplay()).toHaveTextContent("create-account");
    });
  });

  it("shows login form when self-hosted with existing standalone account", async () => {
    vi.mocked(useEnv).mockReturnValue({
      ...envCommon,
      isSelfHosted: true,
      isSaas: false,
      displayDisaStigBanner: false,
    });

    renderWithProviders(<LoginPage />);

    await expectLoadingState();

    expect(screen.getByText("Sign in to Landscape")).toBeInTheDocument();
  });
});
