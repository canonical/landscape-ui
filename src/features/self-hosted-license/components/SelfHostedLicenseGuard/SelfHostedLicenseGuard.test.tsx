import { EnvContext, type EnvContextState } from "@/context/env";
import EnvError from "@/pages/EnvError";
import SelfHostedLicensePage from "@/pages/dashboard/account/self-hosted-license";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
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
      </Routes>
    </EnvContext.Provider>,
    undefined,
    "/",
  );

describe("SelfHostedLicenseGuard", () => {
  it("renders children when SaaS account has self-hosted enabled", async () => {
    renderWithRoutes(envState);

    expect(
      await screen.findByRole("heading", { name: "Self hosted license" }),
    ).toBeInTheDocument();
  });

  it("redirects when the SaaS account is not self-hosted enabled", async () => {
    setEndpointStatus({
      status: "variant",
      path: "self-hosted/status",
      response: { enabled: false },
    });

    renderWithRoutes(envState);

    expect(await screen.findByText("Environment Error")).toBeInTheDocument();
    expect(
      screen.getByText("This feature is not available in SaaS mode."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Self hosted license" }),
    ).not.toBeInTheDocument();
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
      screen.queryByRole("heading", { name: "Self hosted license" }),
    ).not.toBeInTheDocument();
  });
});
