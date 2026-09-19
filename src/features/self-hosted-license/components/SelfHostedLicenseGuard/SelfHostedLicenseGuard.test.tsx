import { EnvContext, type EnvContextState } from "@/context/env";
import { API_URL } from "@/constants";
import EnvError from "@/pages/EnvError";
import SelfHostedLicensePage from "@/pages/dashboard/account/self-hosted-license";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
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
      await screen.findByRole("heading", { name: "Legacy license file" }),
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
      screen.queryByRole("heading", { name: "Legacy license file" }),
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
      screen.queryByRole("heading", { name: "Legacy license file" }),
    ).not.toBeInTheDocument();
  });

  it("blocks the page with an error notification when checking entitlement fails", async () => {
    server.use(
      http.get(
        `${API_URL}self-hosted/status`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderWithRoutes(envState);

    expect(
      await screen.findByText("Unable to obtain legacy license entitlement"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Environment Error")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Legacy license file" }),
    ).not.toBeInTheDocument();
  });
});
