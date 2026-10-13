import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { FC } from "react";
import { Route, Routes } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { API_URL } from "@/constants";
import { ROUTES } from "@/libs/routes";
import UserInfo from "@/templates/dashboard/UserInfo";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { authResponse } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { SuperAdminRoutes } from "./SuperAdminRoutes";

// A stand-in for the normal layout: the sidebar footer with the Super admin
// entry.
const NormalView: FC = () => (
  <>
    <p>Normal view</p>
    <UserInfo />
  </>
);

const LoginPage: FC = () => <p>Login page</p>;

// The mock "acme" account: the signed-in user is not a member of it.
const ACME = "acme";
const ACME_TITLE = "ACME Corp";

/** Signs in with `globalRoles`, for the app and for the mock API. */
const serveMe = (globalRoles: string[]) => {
  setStaffGlobalRoles(globalRoles);
  server.use(
    http.get(`${API_URL}me`, () =>
      HttpResponse.json({ ...authResponse, global_roles: globalRoles }),
    ),
  );
};

/** Renders the routes at `path`, with the current path so redirects and Back can be asserted. */
const renderAt = (path: string) =>
  renderWithProviders(
    <>
      <Routes>
        {SuperAdminRoutes}
        <Route path={ROUTES.auth.login()} element={<LoginPage />} />
        <Route path="*" element={<NormalView />} />
      </Routes>
      <LocationDisplay />
    </>,
    undefined,
    path,
  );

/** Records the body of every account switch, then lets the mock API handle it. */
const recordSwitches = (): unknown[] => {
  const bodies: unknown[] = [];

  server.use(
    http.post(`${API_URL}switch-account`, async ({ request }) => {
      bodies.push(await request.clone().json());
    }),
  );

  return bodies;
};

const findSuperAdminNav = async () =>
  screen.findByRole("navigation", { name: "Super admin" });

describe("super admin routes (integration)", () => {
  beforeEach(() => {
    serveMe(["SupportProvider"]);
  });

  it("renders /super-admin in its own layout for Canonical staff", async () => {
    renderAt(ROUTES.superAdmin.root());

    expect(await findSuperAdminNav()).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Accounts" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Normal view")).not.toBeInTheDocument();
  });

  it("serves the account detail page", async () => {
    renderAt(ROUTES.superAdmin.account("acme"));

    expect(
      await screen.findByRole("heading", { name: "acme" }),
    ).toBeInTheDocument();
  });

  it("serves a support session in its own shell, opening on the events log", async () => {
    const switches = recordSwitches();

    renderAt(ROUTES.superAdmin.session(ACME));

    const bar = within(
      await screen.findByRole("region", { name: "Support session" }),
    );

    expect(bar.getByText(ACME_TITLE)).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Events log" }),
    ).toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent(
      ROUTES.superAdmin.sessionEventsLog(ACME),
    );
    expect(switches).toEqual([{ account_name: ACME }]);
    expect(
      screen.queryByRole("navigation", { name: "Super admin" }),
    ).not.toBeInTheDocument();
  });

  it("sends an account manager without the support role to the account's page", async () => {
    serveMe(["AccountManager"]);
    const switches = recordSwitches();

    renderAt(ROUTES.superAdmin.session(ACME));

    expect(
      await screen.findByRole("heading", { name: ACME }),
    ).toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent(
      ROUTES.superAdmin.account(ACME),
    );
    expect(
      screen.queryByRole("region", { name: "Support session" }),
    ).not.toBeInTheDocument();
    expect(switches).toEqual([]);
  });

  it("serves the people page", async () => {
    renderAt(ROUTES.superAdmin.people());

    expect(
      await screen.findByRole("heading", { name: "People" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "People" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("redirects everyone else to / on direct navigation", async () => {
    serveMe([]);

    renderAt(ROUTES.superAdmin.root());

    expect(await screen.findByText("Normal view")).toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent(/^\/$/);
    expect(
      screen.queryByRole("navigation", { name: "Super admin" }),
    ).not.toBeInTheDocument();
  });

  it("sends unauthenticated users to the login page", async () => {
    server.use(http.get(`${API_URL}me`, () => HttpResponse.json({})));

    renderAt(ROUTES.superAdmin.root());

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    // Only the path: the test providers' side panel strips the unknown
    // `redirect-to` param, which the real login page never sees.
    expect(getLocationDisplay()).toHaveTextContent(/^\/login/);
    expect(
      screen.queryByRole("navigation", { name: "Super admin" }),
    ).not.toBeInTheDocument();
  });

  it("shows the Super admin entry in the normal view only when the gating holds", async () => {
    renderAt(ROUTES.overview.root());

    expect(
      await screen.findByRole("link", { name: "Super admin" }),
    ).toBeInTheDocument();
  });

  it("hides the Super admin entry from everyone else", async () => {
    serveMe([]);

    renderAt(ROUTES.overview.root());

    expect(await screen.findByText("Normal view")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /sign out/i })).toBeVisible();
    });
    expect(
      screen.queryByRole("link", { name: "Super admin" }),
    ).not.toBeInTheDocument();
  });

  it("returns to the normal-view route the mode was entered from", async () => {
    renderAt(ROUTES.overview.root());

    await userEvent.click(
      await screen.findByRole("link", { name: "Super admin" }),
    );
    expect(await findSuperAdminNav()).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("link", { name: "Back to main view" }),
    );

    expect(await screen.findByText("Normal view")).toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent(/^\/overview$/);
  });

  it("returns to / after a direct visit", async () => {
    renderAt(ROUTES.superAdmin.root());

    await findSuperAdminNav();
    await userEvent.click(
      screen.getByRole("link", { name: "Back to main view" }),
    );

    expect(await screen.findByText("Normal view")).toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent(/^\/$/);
  });
});
