import AppErrorBoundary from "@/components/layout/AppErrorBoundary/AppErrorBoundary";
import { API_URL } from "@/constants";
import { mapGroupedResultToInstancePackage } from "@/features/packages";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { instances } from "@/tests/mocks/instance";
import { getComputerPackageSearchResults } from "@/tests/mocks/packages";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import type { Instance } from "@/types/Instance";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SupportInstancePackages from "./SupportInstancePackages";

const ACME = "acme";
/** A regular instance with installed, security and held packages. */
const INSTANCE_ID = 1;
/** An instance the backend knows no packages for. */
const EMPTY_INSTANCE_ID = 100;

const HELD_PACKAGE = "base-files";
const SECURITY_PACKAGE = "binutils-common";
const INSTALLED_PACKAGE = "libthai0";

/** Every package the account's own tab lists for the instance, All filter. */
const instancePackageNames = getComputerPackageSearchResults(INSTANCE_ID)
  .map(mapGroupedResultToInstancePackage)
  .map((pkg) => pkg.name);

const renderTab = (instanceId = INSTANCE_ID, routePath = "/packages") =>
  renderWithProviders(
    <SupportInstancePackages
      name={ACME}
      instance={{ ...instances[0], id: instanceId }}
    />,
    undefined,
    routePath,
    "/packages",
  );

const renderTabInErrorBoundary = () =>
  renderWithProviders(
    <AppErrorBoundary>
      <SupportInstancePackages
        name={ACME}
        instance={{ ...instances[0], id: INSTANCE_ID }}
      />
    </AppErrorBoundary>,
    undefined,
    "/packages",
    "/packages",
  );

const setUbuntuProPackage = () => {
  setEndpointStatus({
    status: "variant",
    path: "computers-packages",
    response: {
      count: 1,
      results: [
        {
          name: "pro-pkg",
          summary: "summary",
          installed_version: "1.0.0",
          installed_id: 1,
          held: false,
          security: false,
          installation_candidates: [
            {
              id: 2,
              version: "1.0.1+ubuntu-pro",
              upgrade: true,
              security: false,
            },
          ],
        },
      ],
    },
  });
};

// No route pattern, so the tab stays mounted after navigating to the session route.
const renderWithLocation = (instance: Instance) =>
  renderWithProviders(
    <>
      <SupportInstancePackages name={ACME} instance={instance} />
      <LocationDisplay />
    </>,
    undefined,
    "/packages",
  );

describe("SupportInstancePackages (integration)", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setStaffGlobalRoles(["SupportProvider"]);
  });

  afterEach(() => {
    setEndpointStatus("default");
  });

  it("shows the same packages the account's tab shows for the instance", async () => {
    renderTab();

    // Every column the main tab lists.
    for (const column of [
      "Name",
      "Status",
      "Current version",
      "Available version",
      "Details",
    ]) {
      expect(
        await screen.findByRole("columnheader", { name: column }),
      ).toBeInTheDocument();
    }

    for (const name of instancePackageNames) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }

    // The server's count drives the pagination summary.
    expect(
      screen.getByText(`Showing ${instancePackageNames.length} of`, {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it("narrows the list by the search term", async () => {
    renderTab();

    await screen.findByRole("button", { name: INSTALLED_PACKAGE });

    await user.type(screen.getByRole("searchbox"), `${HELD_PACKAGE}{enter}`);

    expect(
      await screen.findByRole("button", { name: HELD_PACKAGE }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: INSTALLED_PACKAGE }),
    ).not.toBeInTheDocument();
  });

  it("narrows the list by the status filter", async () => {
    renderTab();

    await screen.findByRole("button", { name: INSTALLED_PACKAGE });

    await user.click(screen.getByRole("button", { name: "Status" }));
    await user.click(screen.getByRole("button", { name: "Held" }));

    expect(await screen.findByText("Status: Held")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: HELD_PACKAGE }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: INSTALLED_PACKAGE }),
    ).not.toBeInTheDocument();
  });

  it("shows the empty message for a filter that matches nothing", async () => {
    renderTab(INSTANCE_ID, "/packages?status=held");

    // Only one package is held, so searching for another name empties the list.
    await screen.findByRole("button", { name: HELD_PACKAGE });

    await user.type(
      screen.getByRole("searchbox"),
      `${INSTALLED_PACKAGE}{enter}`,
    );

    expect(
      await screen.findByText(
        `No held packages found with the search "${INSTALLED_PACKAGE}".`,
      ),
    ).toBeInTheDocument();
  });

  it("requests the next page when pagination advances", async () => {
    const requestedOffsets: number[] = [];

    server.use(
      http.get(
        `${API_URL}accounts/:name/computers/:id/packages/search`,
        ({ request }) => {
          const url = new URL(request.url);
          const offset = Number(url.searchParams.get("offset")) || 0;
          requestedOffsets.push(offset);

          return HttpResponse.json({
            count: DEFAULT_PAGE_SIZE * 2,
            results: Array.from({ length: DEFAULT_PAGE_SIZE }, (_, i) => ({
              name: `pkg-${offset + i}`,
              summary: "summary",
              installed_version: "1.0.0",
              installed_id: offset + i + 1,
              held: false,
              security: false,
              installation_candidates: [],
            })),
          });
        },
      ),
    );

    renderTab();

    expect(
      await screen.findByRole("button", { name: "pkg-0" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Showing", { exact: false })).toHaveTextContent(
      `${DEFAULT_PAGE_SIZE * 2}`,
    );

    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(
      await screen.findByRole("button", { name: `pkg-${DEFAULT_PAGE_SIZE}` }),
    ).toBeInTheDocument();
    expect(requestedOffsets).toContain(DEFAULT_PAGE_SIZE);
  });

  it("opens a read-only details panel without actions", async () => {
    renderTab();

    await user.click(
      await screen.findByRole("button", { name: INSTALLED_PACKAGE }),
    );

    expect(await screen.findByText("Package details")).toBeInTheDocument();

    const panel = screen.getByText("Package details").closest("aside");
    assert(panel);
    const sidePanel = within(panel);

    // The details are lazy-loaded behind a Suspense fallback.
    expect(await sidePanel.findByText("Name")).toBeInTheDocument();
    expect(sidePanel.getByText("Summary")).toBeInTheDocument();
    expect(sidePanel.getByText("Current version")).toBeInTheDocument();

    const panelButton = sidePanel.getByRole("button");
    expect(panelButton).toHaveAccessibleName("Close side panel");
  });

  it("renders no action control and no selection in the list", async () => {
    renderTab();

    await screen.findByRole("button", { name: INSTALLED_PACKAGE });

    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);

    const [, ...bodyRows] = screen.getAllByRole("row");
    expect(bodyRows).toHaveLength(instancePackageNames.length);
    for (const [index, row] of bodyRows.entries()) {
      const rowButton = within(row).getByRole("button");
      expect(rowButton).toHaveAccessibleName(instancePackageNames[index]);
    }
  });

  it("shows a dismissible notification when an upgrade requires Ubuntu Pro", async () => {
    setUbuntuProPackage();

    renderTab();

    expect(
      await screen.findByText(/some upgrades require ubuntu pro/i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Close notification" }),
    );

    expect(
      screen.queryByText(/some upgrades require ubuntu pro/i),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "pro-pkg" })).toBeInTheDocument();
  });

  it("keeps the Ubuntu Pro learn more link inside the support session", async () => {
    setUbuntuProPackage();

    renderWithLocation({ ...instances[0], id: INSTANCE_ID });

    await user.click(await screen.findByRole("button", { name: "Learn more" }));

    expect(getLocationDisplay()).toHaveTextContent(
      ROUTES.superAdmin.sessionInstance(ACME, INSTANCE_ID, {
        tab: "ubuntu-pro",
      }),
    );
  });

  it("links a child instance's Ubuntu Pro learn more to its session route", async () => {
    const child = instances.find((instance) => instance.parent);
    assert(child?.parent);
    setUbuntuProPackage();

    renderWithLocation(child);

    await user.click(await screen.findByRole("button", { name: "Learn more" }));

    expect(getLocationDisplay()).toHaveTextContent(
      ROUTES.superAdmin.sessionInstanceChild(ACME, child.parent.id, child.id, {
        tab: "ubuntu-pro",
      }),
    );
  });

  it("shows the plain empty state, without an install call to action", async () => {
    renderTab(EMPTY_INSTANCE_ID);

    const title = await screen.findByText("No packages have been found yet.");
    const emptyState = title.parentElement;
    assert(emptyState);

    expect(within(emptyState).queryAllByRole("button")).toHaveLength(0);
  });

  it("narrows the list to security upgrades", async () => {
    renderTab(INSTANCE_ID, "/packages?status=security");

    expect(
      await screen.findByRole("button", { name: SECURITY_PACKAGE }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: HELD_PACKAGE }),
    ).not.toBeInTheDocument();
  });

  it("keeps the header while the packages load", async () => {
    setEndpointStatus({ status: "loading", path: "computers-packages" });

    renderTab();

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("fails into the error boundary when the packages fail to load", async () => {
    vi.spyOn(console, "error").mockReturnValue(undefined);
    setEndpointStatus({ status: "error", path: "computers-packages" });

    renderTabInErrorBoundary();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Something went wrong",
    );
  });

  it("fails into the error boundary when the caller lacks staff read access", async () => {
    vi.spyOn(console, "error").mockReturnValue(undefined);
    setStaffGlobalRoles([]);

    renderTabInErrorBoundary();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Something went wrong",
    );
    expect(
      screen.queryByText("No packages have been found yet."),
    ).not.toBeInTheDocument();
  });
});
