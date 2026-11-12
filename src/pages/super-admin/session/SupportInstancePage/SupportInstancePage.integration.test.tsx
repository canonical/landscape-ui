import { AuthGuard } from "@/components/guards/AuthGuard";
import { SuperAdminGuard } from "@/components/guards/SuperAdminGuard";
import { API_URL } from "@/constants";
import { PATHS, ROUTES } from "@/libs/routes";
import SupportSessionPage from "@/pages/super-admin/accounts/SupportSessionPage";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { authResponse } from "@/tests/mocks/auth";
import {
  debianInstance,
  instances,
  ubuntuInstance,
  windowsInstance,
} from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { ErrorBoundary } from "@sentry/react";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { Outlet, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import SupportInstancePage from "./SupportInstancePage";

// Super admin mode only exists on SaaS deployments.
vi.mock("@/hooks/useEnv", () => import("@/tests/mocks/env"));

const ACME = "acme";
const UNKNOWN_ID = 999999;

const childInstance = instances.find(
  (candidate): candidate is typeof candidate & { parent: { id: number } } =>
    !!candidate.parent,
);

const UBUNTU_TABS = [
  "Info",
  "Activities",
  "Kernel",
  "Security issues",
  "Packages",
  "Snaps",
  "Processes",
  "Ubuntu Pro",
  "Users",
  "Hardware",
];

/** Signs in as staff whose session is already in the account. */
const signIn = () => {
  setStaffGlobalRoles(["SupportProvider"]);
  server.use(
    http.get(`${API_URL}me`, () =>
      HttpResponse.json({
        ...authResponse,
        current_account: ACME,
        global_roles: ["SupportProvider"],
      }),
    ),
  );
};

const renderInstance = (path: string) => {
  signIn();

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
              path={PATHS.superAdmin.sessionInstance}
              element={<SupportInstancePage />}
            />
            <Route
              path={PATHS.superAdmin.sessionInstanceChild}
              element={<SupportInstancePage />}
            />
          </Route>
        </Route>
      </Routes>
      <LocationDisplay />
    </ErrorBoundary>,
    undefined,
    path,
  );
};

/** Resolves once the Info tab, which is the last to load, shows the instance. */
const findInstanceHeading = async (title: string) =>
  screen.findByRole("heading", { name: title, level: 2 });

const getTabNames = () =>
  screen.getAllByRole("tab").map(({ textContent }) => textContent);

describe("SupportInstancePage (integration)", () => {
  const user = userEvent.setup();

  assert(childInstance);

  it("shows the instance on its Info tab", async () => {
    renderInstance(ROUTES.superAdmin.sessionInstance(ACME, ubuntuInstance.id));

    expect(await findInstanceHeading(ubuntuInstance.title)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Info" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    const panel = within(screen.getByRole("tabpanel"));
    const accessGroup = accessGroups.find(
      ({ name }) => name === ubuntuInstance.access_group,
    );

    expect(panel.getByText(ubuntuInstance.hostname ?? "")).toBeInTheDocument();
    expect(
      panel.getByText(accessGroup?.title ?? ubuntuInstance.access_group),
    ).toBeInTheDocument();
    expect(panel.getByText(ubuntuInstance.comment)).toBeInTheDocument();
  });

  it("leads back to the account's instances", async () => {
    renderInstance(ROUTES.superAdmin.sessionInstance(ACME, ubuntuInstance.id));

    await findInstanceHeading(ubuntuInstance.title);

    const breadcrumbs = within(
      screen.getByRole("navigation", { name: /breadcrumb/i }),
    );

    expect(
      breadcrumbs.getByRole("link", { name: "Instances" }),
    ).toHaveAttribute("href", ROUTES.superAdmin.sessionInstances(ACME));
  });

  it("offers nothing that changes the instance", async () => {
    renderInstance(ROUTES.superAdmin.sessionInstance(ACME, ubuntuInstance.id));

    await findInstanceHeading(ubuntuInstance.title);

    for (const action of [
      "Edit",
      "Restart",
      "Shut down",
      "Run script",
      "Remove",
      "Sanitize",
      "recovery key",
    ]) {
      expect(
        screen.queryByRole("button", { name: new RegExp(action, "i") }),
      ).not.toBeInTheDocument();
    }
  });

  it("reads the account named in the address, not the session's own", async () => {
    const requested: string[] = [];

    server.events.on("request:start", ({ request }) => {
      requested.push(new URL(request.url).pathname);
    });

    renderInstance(ROUTES.superAdmin.sessionInstance(ACME, ubuntuInstance.id));

    await findInstanceHeading(ubuntuInstance.title);

    const prefix = new URL(API_URL, "http://localhost").pathname;

    expect(requested).toContain(
      `${prefix}accounts/${ACME}/computers/${ubuntuInstance.id}`,
    );
    expect(requested).toContain(`${prefix}accounts/${ACME}/access-groups`);
    expect(requested).not.toContain(`${prefix}computers/${ubuntuInstance.id}`);

    server.events.removeAllListeners("request:start");
  });

  it("has the tabs of an Ubuntu instance", async () => {
    renderInstance(ROUTES.superAdmin.sessionInstance(ACME, ubuntuInstance.id));

    await findInstanceHeading(ubuntuInstance.title);

    expect(getTabNames()).toEqual(UBUNTU_TABS);
  });

  it("has the tabs a Windows instance supports", async () => {
    renderInstance(ROUTES.superAdmin.sessionInstance(ACME, windowsInstance.id));

    await findInstanceHeading(windowsInstance.title);

    expect(getTabNames()).toEqual(["Info", "WSL", "Activities", "Ubuntu Pro"]);
  });

  it("leaves out the Ubuntu-only tabs for another Linux", async () => {
    // Not among the instances the list handler knows.
    server.use(
      http.get(
        `${API_URL}accounts/${ACME}/computers/${debianInstance.id}`,
        () => HttpResponse.json(debianInstance),
      ),
    );

    renderInstance(ROUTES.superAdmin.sessionInstance(ACME, debianInstance.id));

    await findInstanceHeading(debianInstance.title);

    expect(getTabNames()).toEqual([
      "Info",
      "Activities",
      "Snaps",
      "Processes",
      "Users",
      "Hardware",
    ]);
  });

  it.each(UBUNTU_TABS.filter((tab) => !["Info", "Kernel"].includes(tab)))(
    "holds a place for the %s tab",
    async (tab) => {
      renderInstance(
        ROUTES.superAdmin.sessionInstance(ACME, ubuntuInstance.id),
      );

      await user.click(await screen.findByRole("tab", { name: tab }));

      expect(
        await screen.findByText(`${tab} is not available yet`),
      ).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: tab })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    },
  );

  it("keeps the open tab in the address", async () => {
    renderInstance(ROUTES.superAdmin.sessionInstance(ACME, ubuntuInstance.id));

    await user.click(await screen.findByRole("tab", { name: "Activities" }));

    await waitFor(() => {
      expect(getLocationDisplay()).toHaveTextContent("tab=activities");
    });
  });

  it("shows Info for a tab the instance does not have", async () => {
    renderInstance(
      ROUTES.superAdmin.sessionInstance(ACME, windowsInstance.id, {
        tab: "packages",
      }),
    );

    await findInstanceHeading(windowsInstance.title);

    expect(screen.getByRole("tab", { name: "Info" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("shows a WSL child under its parent", async () => {
    renderInstance(
      ROUTES.superAdmin.sessionInstanceChild(
        ACME,
        childInstance.parent.id,
        childInstance.id,
      ),
    );

    expect(await findInstanceHeading(childInstance.title)).toBeInTheDocument();
    expect(screen.getByText("WSL instance")).toBeInTheDocument();

    const breadcrumbs = within(
      screen.getByRole("navigation", { name: /breadcrumb/i }),
    );

    expect(
      breadcrumbs.getByRole("link", { name: windowsInstance.title }),
    ).toHaveAttribute(
      "href",
      ROUTES.superAdmin.sessionInstance(ACME, childInstance.parent.id),
    );
  });

  it("does not show a child under a parent that is not its own", async () => {
    renderInstance(
      ROUTES.superAdmin.sessionInstanceChild(
        ACME,
        ubuntuInstance.id,
        childInstance.id,
      ),
    );

    expect(await screen.findByText("Instance not found")).toBeInTheDocument();
  });

  it("says so when the account has no such instance", async () => {
    renderInstance(ROUTES.superAdmin.sessionInstance(ACME, UNKNOWN_ID));

    expect(await screen.findByText("Instance not found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to instances" }),
    ).toHaveAttribute("href", ROUTES.superAdmin.sessionInstances(ACME));
  });

  it("says so when the address names no instance id", async () => {
    renderInstance(ROUTES.superAdmin.sessionInstance(ACME, "not-a-number"));

    expect(await screen.findByText("Instance not found")).toBeInTheDocument();
  });

  it("surfaces a failed instance request", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    setEndpointStatus({ status: "error", path: "computers/:computerId" });

    renderInstance(ROUTES.superAdmin.sessionInstance(ACME, ubuntuInstance.id));

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });
});
