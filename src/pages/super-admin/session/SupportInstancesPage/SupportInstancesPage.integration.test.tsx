import { AuthGuard } from "@/components/guards/AuthGuard";
import { SuperAdminGuard } from "@/components/guards/SuperAdminGuard";
import { API_URL } from "@/constants";
import { PATHS, ROUTES } from "@/libs/routes";
import SupportSessionPage from "@/pages/super-admin/accounts/SupportSessionPage";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { authResponse } from "@/tests/mocks/auth";
import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { ErrorBoundary } from "@sentry/react";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { Outlet, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import SupportInstancesPage from "./SupportInstancesPage";

// Super admin mode only exists on SaaS deployments.
vi.mock("@/hooks/useEnv", () => import("@/tests/mocks/env"));

const ACME = "acme";
/** An account with no instances. */
const INITECH = "initech";

const [instance] = instances;
const taggedInstance = instances.find(({ tags }) => tags.length > 0);

/** Signs in as staff whose session is already in `account`. */
const signIn = (account: string) => {
  setStaffGlobalRoles(["SupportProvider"]);
  server.use(
    http.get(`${API_URL}me`, () =>
      HttpResponse.json({
        ...authResponse,
        current_account: account,
        global_roles: ["SupportProvider"],
      }),
    ),
  );
};

const renderInstances = (account = ACME, search = "") => {
  signIn(account);

  return renderWithProviders(
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Routes>
        {/* The guards mount the session once the user is known, as the app does. */}
        <Route
          element={
            <AuthGuard requireAccount={false}>
              <SuperAdminGuard>
                <Outlet />
              </SuperAdminGuard>
            </AuthGuard>
          }
        >
          <Route
            path={`/${PATHS.superAdmin.root}/${PATHS.superAdmin.session}`}
            element={<SupportSessionPage />}
          >
            <Route
              path={PATHS.superAdmin.sessionInstances}
              element={<SupportInstancesPage />}
            />
          </Route>
        </Route>
      </Routes>
      <LocationDisplay />
    </ErrorBoundary>,
    undefined,
    `${ROUTES.superAdmin.sessionInstances(account)}${search}`,
  );
};

const findRow = async (title: string) =>
  within(await screen.findByRole("row", { name: `${title} instance row` }));

describe("SupportInstancesPage (integration)", () => {
  const user = userEvent.setup();

  assert(instance);
  assert(taggedInstance);

  it("lists the account's instances", async () => {
    renderInstances();

    expect(
      await screen.findByRole("heading", { name: "Instances" }),
    ).toBeInTheDocument();

    const row = await findRow(instance.title);

    expect(row.getByRole("rowheader")).toHaveTextContent(instance.hostname);
  });

  it("offers nothing that changes the account", async () => {
    renderInstances();

    await findRow(instance.title);

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: instance.title }),
    ).not.toBeInTheDocument();
    for (const action of [
      "Restart",
      "Shut down",
      "Remove",
      "Assign",
      "Export",
    ]) {
      expect(
        screen.queryByRole("button", { name: new RegExp(action, "i") }),
      ).not.toBeInTheDocument();
    }
  });

  it("reads the account named in the address, not the session's own", async () => {
    const requested: string[] = [];

    server.use(
      http.get(`${API_URL}*`, ({ request }) => {
        requested.push(new URL(request.url).pathname);
      }),
    );
    setStaffGlobalRoles(["SupportProvider"]);

    // Outside the session shell, so the session stays in its own account.
    renderWithProviders(
      <Routes>
        <Route
          path={`/${PATHS.superAdmin.root}/${PATHS.superAdmin.session}/${PATHS.superAdmin.sessionInstances}`}
          element={<SupportInstancesPage />}
        />
      </Routes>,
      undefined,
      ROUTES.superAdmin.sessionInstances(ACME),
    );

    await findRow(instance.title);

    const prefix = new URL(API_URL, "http://localhost").pathname;

    expect(requested).toContain(`${prefix}accounts/${ACME}/computers`);
    expect(requested).not.toContain(`${prefix}computers`);
    expect(requested).not.toContain(`${prefix}tags`);
  });

  it("links to the list from the session navigation", async () => {
    renderInstances();

    expect(
      await screen.findByRole("link", { name: "Instances" }),
    ).toHaveAttribute("href", ROUTES.superAdmin.sessionInstances(ACME));
  });

  it("says so when the account has no instances", async () => {
    renderInstances(INITECH);

    expect(
      await screen.findByText("This account has no instances."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("keeps the filters when a search finds nothing", async () => {
    setEndpointStatus({ status: "empty", path: "computers" });

    renderInstances(ACME, "?query=nothing");

    expect(
      await screen.findByText(
        "No instances found according to your search parameters.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveValue("nothing");
  });

  it("searches by the text entered", async () => {
    renderInstances();

    await findRow(instance.title);

    await user.type(screen.getByRole("searchbox"), "alert:offline{Enter}");

    await waitFor(() => {
      expect(getLocationDisplay()).toHaveTextContent("query=alert%3Aoffline");
    });
  });

  it("filters by a tag clicked in the list", async () => {
    renderInstances();

    const row = await findRow(taggedInstance.title);
    const [tag] = taggedInstance.tags;

    assert(tag);

    await user.click(row.getByRole("button", { name: new RegExp(tag) }));

    await waitFor(() => {
      expect(getLocationDisplay()).toHaveTextContent(`tags=${tag}`);
    });
  });

  it("keeps the search when the list request fails", async () => {
    setEndpointStatus({ status: "error", path: "computers" });

    renderInstances(ACME, "?query=alert:bogus");

    expect(
      await screen.findByText("Could not load the instances"),
    ).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveValue("alert:bogus");
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("explains the search without saved searches", async () => {
    renderInstances();

    await findRow(instance.title);
    await user.click(screen.getByRole("button", { name: "Help" }));

    expect(await screen.findByText("tag:<keyword>")).toBeInTheDocument();
    expect(screen.queryByText("search:<name>")).not.toBeInTheDocument();
  });
});
