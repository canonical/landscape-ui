import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import type { AuthContextProps } from "@/context/auth";
import { hasUpgrades } from "@/features/instances";
import useAuth from "@/hooks/useAuth";
import { activities } from "@/tests/mocks/activity";
import { instances } from "@/tests/mocks/instance";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectErrorNotification } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import Upgrades from "./Upgrades";

vi.mock("@/hooks/useAuth");

const authContextValues: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  user: null,
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
  isFeatureEnabled: () => true,
  hasAccounts: true,
  isSuperAdmin: false,
  canManageAccounts: false,
  canEnterAccounts: false,
};

describe("Upgrades", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(authContextValues);
    setEndpointStatus("default");
  });

  it("should render tabs", async () => {
    renderWithProviders(<Upgrades selectedInstances={instances} />);

    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tab", { name: /instances/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: /packages/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tab", { name: /usns/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "tab-link-instances",
    );
    expect(
      await screen.findByText(/Showing \d of \d+ instances/i),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: /packages/i }));

    expect(screen.getByRole("tab", { name: /packages/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "tab-link-packages",
    );
    expect(
      await screen.findByText(/Showing \d of \d+ packages/i),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: /usns/i }));

    expect(screen.getByRole("tab", { name: /usns/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "tab-link-usns",
    );
    expect(
      await screen.findByText(/Showing \d of \d+ security issues/i),
    ).toBeInTheDocument();
  });

  it("submits package upgrades from default tab", async () => {
    const user = userEvent.setup();

    renderWithProviders(<Upgrades selectedInstances={instances} />);

    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText("You queued packages to be upgraded"),
    ).toBeInTheDocument();
  });

  it("submits USN upgrades when USNs tab is selected", async () => {
    const user = userEvent.setup();

    renderWithProviders(<Upgrades selectedInstances={instances} />);

    await user.click(screen.getByRole("tab", { name: /usns/i }));
    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText("You queued packages to be upgraded"),
    ).toBeInTheDocument();
  });

  it("hides the packages tab when the package-search-rest-api feature flag is disabled", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authContextValues,
      isFeatureEnabled: () => false,
    });

    renderWithProviders(<Upgrades selectedInstances={instances} />);

    expect(
      screen.queryByRole("tab", { name: /packages/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /instances/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /usns/i })).toBeInTheDocument();
  });

  it("renders only instances and packages tabs when no security upgrades exist", () => {
    const noSecurityUpgradeInstances = instances.map((instance) => ({
      ...instance,
      alerts: (instance.alerts ?? []).filter(
        ({ type }) => type !== "SecurityUpgradesAlert",
      ),
    }));

    renderWithProviders(
      <Upgrades selectedInstances={noSecurityUpgradeInstances} />,
    );

    expect(screen.getByRole("tab", { name: /instances/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /packages/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: /usns/i }),
    ).not.toBeInTheDocument();
  });

  it("shows singular success message when upgrading one instance", async () => {
    const user = userEvent.setup();
    const [singleInstance] = instances;
    assert(singleInstance);

    renderWithProviders(<Upgrades selectedInstances={[singleInstance]} />);

    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText(/Packages on 1 instance will be upgraded/i),
    ).toBeInTheDocument();
  });

  it("handles package-upgrade submission errors", async () => {
    const user = userEvent.setup();

    renderWithProviders(<Upgrades selectedInstances={instances} />);

    setEndpointStatus("error");
    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    await expectErrorNotification();
  });

  it("handles usn-upgrade submission errors", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Upgrades selectedInstances={instances} />);

    await user.click(screen.getByRole("tab", { name: /usns/i }));
    setEndpointStatus("error");
    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    await expectErrorNotification();
  });

  it("updates excluded package list from packages tab interaction", async () => {
    const user = userEvent.setup();

    renderWithProviders(<Upgrades selectedInstances={instances} />);

    await user.click(screen.getByRole("tab", { name: /packages/i }));
    await user.click(
      screen.getByRole("checkbox", { name: /toggle all packages/i }),
    );
    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText("You queued packages to be upgraded"),
    ).toBeInTheDocument();
  });

  it("excludes packages from the packages tab by their installed package ids", async () => {
    const user = userEvent.setup();
    const upgradeCandidate = {
      id: 9001,
      name: "foo",
      summary: "Foo",
      version: "2.0.0",
      computers: { count: instances.length },
    };
    const installedPackage = { ...upgradeCandidate, id: 101, version: "1.0.0" };
    let installedSearchBody: unknown;
    let upgradeBody: unknown;

    server.use(
      http.post(`${API_URL}packages\\:search-upgrades`, () =>
        HttpResponse.json({
          packages: [upgradeCandidate],
          count: 1,
          next: null,
          prev: null,
        }),
      ),
      http.post(`${API_URL}packages\\:search`, async ({ request }) => {
        installedSearchBody = await request.json();
        return HttpResponse.json({
          packages: [installedPackage],
          count: 1,
          next: null,
          prev: null,
        });
      }),
      http.post(`${API_URL}computers/upgrade-packages`, async ({ request }) => {
        upgradeBody = await request.json();
        return HttpResponse.json(activities[0]);
      }),
    );

    renderWithProviders(<Upgrades selectedInstances={instances} />);

    await user.click(screen.getByRole("tab", { name: /packages/i }));
    await user.click(
      await screen.findByRole("checkbox", { name: /toggle foo package/i }),
    );
    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText("You queued packages to be upgraded"),
    ).toBeInTheDocument();
    expect(installedSearchBody).toMatchObject({
      names: "foo",
      installed: "true",
    });
    const { computers } = upgradeBody as { computers: object[] };
    expect(computers.length).toBeGreaterThan(0);
    for (const computer of computers) {
      expect(Object.keys(computer).sort()).toEqual(["exclude_packages", "id"]);
      expect(computer).toMatchObject({
        exclude_packages: [installedPackage.id],
      });
    }
  });

  it("passes instances tab exclusions through without resolving package names", async () => {
    const user = userEvent.setup();
    const instance = instances.find(({ alerts }) => hasUpgrades(alerts));
    assert(instance);
    const installedId = 777;
    let installedSearchCalled = false;
    let upgradeBody: unknown;

    server.use(
      http.get(`${API_URL}computers/:id/packages/search`, () =>
        HttpResponse.json({
          count: 1,
          results: [
            {
              name: "bar",
              summary: "Bar",
              installed_version: "1.0.0",
              installed_id: installedId,
              held: false,
              security: false,
              installation_candidates: [
                { id: 778, version: "2.0.0", upgrade: true, security: false },
              ],
            },
          ],
        }),
      ),
      http.post(`${API_URL}packages\\:search`, () => {
        installedSearchCalled = true;
        return HttpResponse.json({
          packages: [],
          count: 0,
          next: null,
          prev: null,
        });
      }),
      http.post(`${API_URL}computers/upgrade-packages`, async ({ request }) => {
        upgradeBody = await request.json();
        return HttpResponse.json(activities[0]);
      }),
    );

    renderWithProviders(<Upgrades selectedInstances={[instance]} />);

    const instanceRow = (await screen.findAllByRole("row")).find(
      ({ firstChild }) => firstChild?.textContent === instance.title,
    );
    assert(instanceRow);
    await user.click(within(instanceRow).getByRole("button"));
    await user.click(
      await screen.findByRole("checkbox", { name: /toggle bar package/i }),
    );
    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText("You queued packages to be upgraded"),
    ).toBeInTheDocument();
    expect(installedSearchCalled).toBe(false);
    expect(upgradeBody).toEqual({
      computers: [{ id: instance.id, exclude_packages: [installedId] }],
    });
  });

  it("updates excluded usn list from usns tab interaction", async () => {
    const user = userEvent.setup();

    renderWithProviders(<Upgrades selectedInstances={instances} />);

    await user.click(screen.getByRole("tab", { name: /usns/i }));
    await user.click(
      screen.getByRole("checkbox", { name: /toggle all security issues/i }),
    );
    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText("You queued packages to be upgraded"),
    ).toBeInTheDocument();
  });
});
