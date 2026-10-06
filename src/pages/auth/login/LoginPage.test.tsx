import { describe, vi, beforeEach, expect, it } from "vitest";
import { API_URL } from "@/constants";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import LoginPage from "./LoginPage";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";
import { expectLoadingState } from "@/tests/helpers";
import useEnv from "@/hooks/useEnv";
import type { EnvContextState } from "@/context/env";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";

vi.mock("@/hooks/useEnv");

const envCommon: Omit<EnvContextState, "displayDisaStigBanner"> = {
  envLoading: false,
  envError: false,
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

  it("shows loading state when self-hosted and no standalone account exists", async () => {
    vi.mocked(useEnv).mockReturnValue({
      ...envCommon,
      isSelfHosted: true,
      isSaas: false,
      displayDisaStigBanner: false,
    });
    server.use(
      http.get(`${API_URL}standalone-account`, () =>
        HttpResponse.json({ message: "Not found" }, { status: 404 }),
      ),
    );

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

  it("does not route to first-admin creation when the standalone-account request fails", async () => {
    vi.mocked(useEnv).mockReturnValue({
      ...envCommon,
      isSelfHosted: true,
      isSaas: false,
      displayDisaStigBanner: false,
    });
    server.use(
      http.get(`${API_URL}standalone-account`, () =>
        HttpResponse.json({ message: "Unavailable" }, { status: 500 }),
      ),
    );

    renderWithProviders(<LoginPage />);

    expect(
      await screen.findByRole("heading", { name: "Sign in to Landscape" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /create.*account/i }),
    ).not.toBeInTheDocument();
  });
});
