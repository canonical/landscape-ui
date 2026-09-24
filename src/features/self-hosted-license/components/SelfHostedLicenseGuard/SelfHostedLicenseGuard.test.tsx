import { EnvContext, type EnvContextState } from "@/context/env";
import EnvError from "@/pages/EnvError";
import SelfHostedLicensePage from "@/pages/dashboard/account/self-hosted-license";
import { ROUTES } from "@/libs/routes";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import SelfHostedLicenseProvider from "@/context/selfHostedLicense";
import SelfHostedLicenseGuard from "./SelfHostedLicenseGuard";

const envState: EnvContextState = {
  envLoading: false,
  isSaas: true,
  isSelfHosted: false,
  packageVersion: "",
  revision: "",
  displayDisaStigBanner: false,
};

const renderWithRoutes = (value: EnvContextState) =>
  renderWithProviders(
    <EnvContext.Provider value={value}>
      <SelfHostedLicenseProvider>
        <Routes>
          <Route
            path="/"
            element={
              <SelfHostedLicenseGuard>
                <SelfHostedLicensePage />
              </SelfHostedLicenseGuard>
            }
          />
          <Route path="/env-error" element={<EnvError />} />
          <Route path="/account/general" element={<p>Account general</p>} />
        </Routes>
      </SelfHostedLicenseProvider>
      <LocationDisplay />
    </EnvContext.Provider>,
    undefined,
    "/",
  );

describe("SelfHostedLicenseGuard", () => {
  it("renders children when SaaS account has self-hosted enabled", async () => {
    renderWithRoutes(envState);

    expect(
      await screen.findByRole("heading", { name: "Legacy license file" }),
    ).toBeInTheDocument();
  });

  it("redirects to account general when the SaaS account is not entitled", async () => {
    setEndpointStatus({
      status: "variant",
      path: "self-hosted/status",
      response: { enabled: false },
    });

    renderWithRoutes(envState);

    expect(
      screen.queryByRole("heading", { name: "Legacy license file" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Environment Error")).not.toBeInTheDocument();
    expect(await screen.findByText("Account general")).toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent(ROUTES.account.general());
  });

  it("redirects when the server is self-hosted", async () => {
    renderWithRoutes({
      ...envState,
      isSaas: false,
      isSelfHosted: true,
    });

    expect(await screen.findByText("Environment Error")).toBeInTheDocument();
    expect(
      screen.getByText("This feature is not available in Self Hosted mode."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Legacy license file" }),
    ).not.toBeInTheDocument();
  });

  it("renders a blank page when checking entitlement fails", async () => {
    setEndpointStatus({ status: "error", path: "self-hosted/status" });

    renderWithRoutes(envState);

    expect(screen.queryByText("Environment Error")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Legacy license file" }),
    ).not.toBeInTheDocument();
    await screen.findByTestId("notification-close-button");
    await waitFor(() => {
      expect(screen.queryByText("Account general")).not.toBeInTheDocument();
    });
    expect(getLocationDisplay()).toHaveTextContent("/");
  });
});
