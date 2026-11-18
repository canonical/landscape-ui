import { API_URL } from "@/constants";
import { EnvContext, type EnvContextState } from "@/context/env";
import EnvError from "@/pages/EnvError";
import SelfHostedLicensePage from "@/pages/dashboard/account/self-hosted-license";
import { ROUTES } from "@/libs/routes";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { SecondaryNavigation } from "@/templates/dashboard/SecondaryNavigation/SecondaryNavigation";
import { ACCOUNT_SETTINGS } from "@/templates/dashboard/SecondaryNavigation/constants";
import { onlineManager } from "@tanstack/react-query";
import { act, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import SelfHostedLicenseProvider from "@/context/selfHostedLicense";
import { LEGACY_LICENSE_ENTITLEMENT_WAIT_MS } from "../../api/constants";
import SelfHostedLicenseGuard from "./SelfHostedLicenseGuard";

const TIMEOUT_ASSERTION_GRACE_MS = 2_000;

vi.mock("usehooks-ts", async () => ({
  ...(await vi.importActual("usehooks-ts")),
  useMediaQuery: () => true,
}));

const envState: EnvContextState = {
  envLoading: false,
  isSaas: true,
  isSelfHosted: false,
  packageVersion: "",
  revision: "",
  displayDisaStigBanner: false,
};

const renderWithRoutes = (value: EnvContextState, initialPath = "/") =>
  renderWithProviders(
    <EnvContext.Provider value={value}>
      <SelfHostedLicenseProvider>
        <SecondaryNavigation
          title={ACCOUNT_SETTINGS.label}
          items={ACCOUNT_SETTINGS.items}
        />
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
    initialPath,
  );

const mockEntitlementFailure = () => {
  server.use(
    http.get(`${API_URL}self-hosted/status`, () =>
      HttpResponse.json(
        { message: "Failed to fetch entitlement" },
        { status: 500 },
      ),
    ),
  );
};

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

  it("redirects to account general on entitlement failure", async () => {
    mockEntitlementFailure();

    renderWithRoutes(envState);

    expect(await screen.findByText("Account general")).toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent(ROUTES.account.general());
    expect(
      screen.queryByRole("heading", { name: "Legacy license file" }),
    ).not.toBeInTheDocument();
  });

  it("falls back to account general when entitlement cannot be obtained and reveals the tab after it is obtained", async () => {
    onlineManager.setOnline(false);
    const { unmount } = renderWithRoutes(envState);

    try {
      expect(await screen.findByText("Account general")).toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "Legacy license file" }),
      ).not.toBeInTheDocument();

      act(() => {
        onlineManager.setOnline(true);
      });

      expect(
        await screen.findByRole("link", { name: "Legacy license file" }),
      ).toBeInTheDocument();
      expect(getLocationDisplay()).toHaveTextContent(ROUTES.account.general());
    } finally {
      unmount();
      onlineManager.setOnline(true);
    }
  });

  it("shows entitlement error toast when there is no redirect", async () => {
    mockEntitlementFailure();

    renderWithRoutes(envState, ROUTES.account.general());

    expect(
      await screen.findByText("Could not check legacy license access."),
    ).toBeInTheDocument();
  });

  it("stops waiting for a slow entitlement check and shows the link on late success", async () => {
    let releaseRequest: (() => void) | undefined;
    const request = new Promise<void>((resolve) => {
      releaseRequest = resolve;
    });
    server.use(
      http.get(`${API_URL}self-hosted/status`, async () => {
        await request;
        return HttpResponse.json({ enabled: true });
      }),
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    try {
      renderWithRoutes(envState);

      const menu = screen.getByRole("navigation", {
        name: ACCOUNT_SETTINGS.label,
      });
      expect(menu).toHaveAttribute("aria-busy", "true");
      expect(
        await screen.findByText("Account general", undefined, {
          timeout:
            LEGACY_LICENSE_ENTITLEMENT_WAIT_MS + TIMEOUT_ASSERTION_GRACE_MS,
        }),
      ).toBeInTheDocument();
      expect(menu).toHaveAttribute("aria-busy", "false");
      expect(
        screen.queryByRole("link", { name: "Legacy license file" }),
      ).not.toBeInTheDocument();

      await act(async () => {
        releaseRequest?.();
      });
      expect(
        await screen.findByRole("link", { name: "Legacy license file" }),
      ).toBeInTheDocument();
      expect(getLocationDisplay()).toHaveTextContent(ROUTES.account.general());
    } finally {
      releaseRequest?.();
      warn.mockRestore();
    }
  });
});
