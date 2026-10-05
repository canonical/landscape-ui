import { screen, waitFor } from "@testing-library/react";
import { Navigate, Route, Routes } from "react-router";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL } from "@/constants";
import { ROUTES } from "@/libs/routes";
import { authResponse, authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import SuperAdminPage from "./SuperAdminPage";

const ENTRY = "/enter";

// Enters super admin mode the way the sidebar entry does: a navigation that
// carries `returnTo` in the location state.
const renderEnteringWith = (state: unknown) =>
  renderWithProviders(
    <Routes>
      <Route
        path={ENTRY}
        element={<Navigate to={ROUTES.superAdmin.root()} state={state} />}
      />
      <Route
        path={`${ROUTES.superAdmin.root()}/*`}
        element={<SuperAdminPage />}
      >
        <Route index element={<p>Child page</p>} />
      </Route>
    </Routes>,
    undefined,
    ENTRY,
  );

const findBackLink = async () =>
  screen.findByRole("link", { name: "Back to main view" });

/** Signs in as staff whose session is in `currentAccount`. */
const signInAs = (currentAccount: string, accounts = authUser.accounts) => {
  setStaffGlobalRoles(["SupportProvider"]);
  server.use(
    http.get(`${API_URL}me`, () =>
      HttpResponse.json({
        ...authResponse,
        accounts,
        current_account: currentAccount,
        global_roles: ["SupportProvider"],
      }),
    ),
  );
};

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

describe("SuperAdminPage", () => {
  it("renders the super admin layout around the child page", async () => {
    renderEnteringWith(null);

    expect(
      await screen.findByRole("navigation", { name: "Super admin" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Child page")).toBeInTheDocument();
  });

  it("returns to the route the mode was entered from", async () => {
    renderEnteringWith({ returnTo: "/instances?tab=all" });

    expect(await findBackLink()).toHaveAttribute("href", "/instances?tab=all");
  });

  it("returns to / without an origin", async () => {
    renderEnteringWith(null);

    expect(await findBackLink()).toHaveAttribute("href", ROUTES.root.root());
  });

  it("returns to / when the origin is not a string", async () => {
    renderEnteringWith({ returnTo: { path: "/instances" } });

    expect(await findBackLink()).toHaveAttribute("href", ROUTES.root.root());
  });

  it("returns to / when the origin is on another host", async () => {
    renderEnteringWith({ returnTo: "https://example.com/instances" });

    expect(await findBackLink()).toHaveAttribute("href", ROUTES.root.root());
  });

  it("returns to / when the origin is inside super admin mode", async () => {
    renderEnteringWith({ returnTo: ROUTES.superAdmin.people() });

    expect(await findBackLink()).toHaveAttribute("href", ROUTES.root.root());
  });

  it("keeps an origin that only shares the super admin prefix", async () => {
    renderEnteringWith({ returnTo: "/super-adminx" });

    expect(await findBackLink()).toHaveAttribute("href", "/super-adminx");
  });

  describe("after a support session", () => {
    it("returns the session to the person's own account", async () => {
      signInAs("acme");

      const switches = recordSwitches();

      renderEnteringWith(null);

      await waitFor(() => {
        expect(switches).toEqual([{ account_name: authUser.current_account }]);
      });
    });

    it("leaves the session alone when it is in one of the person's accounts", async () => {
      signInAs(authUser.current_account);

      const switches = recordSwitches();

      renderEnteringWith(null);

      expect(await screen.findByText("Child page")).toBeInTheDocument();
      expect(switches).toEqual([]);
    });

    it("leaves the session alone for staff without accounts of their own", async () => {
      signInAs("acme", []);

      const switches = recordSwitches();

      renderEnteringWith(null);

      expect(await screen.findByText("Child page")).toBeInTheDocument();
      expect(switches).toEqual([]);
    });
  });
});
