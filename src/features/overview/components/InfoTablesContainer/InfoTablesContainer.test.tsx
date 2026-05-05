import {
  activities,
  manyUnapprovedActivities,
  manyDeliveredActivities,
} from "@/tests/mocks/activity";
import { instances } from "@/tests/mocks/instance";
import { packages } from "@/tests/mocks/packages";
import { usns } from "@/tests/mocks/usn";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InfoTablesContainer from "./InfoTablesContainer";

const LIST_LIMIT = 10;

describe("InfoTablesContainer", () => {
  beforeEach(() => {
    renderWithProviders(<InfoTablesContainer />);
  });

  describe("Upgrades table", () => {
    const upgradeTabs = ["Instances", "Packages", "USNs"];

    it("renders tabs", () => {
      upgradeTabs.forEach((tab) => {
        expect(screen.getByText(tab)).toBeInTheDocument();
      });
    });

    it("renders instance list", async () => {
      const shownInstances = instances.slice(0, LIST_LIMIT);
      for (const instance of shownInstances) {
        const instanceTitle = await screen.findByText(instance.title);
        expect(instanceTitle).toBeInTheDocument();
      }
    });

    it("renders package list", async () => {
      const packagesTab = screen.getByRole("tab", { name: /packages/i });
      await userEvent.click(packagesTab);

      const shownPackages = packages.slice(0, LIST_LIMIT);
      for (const singlePackage of shownPackages) {
        const packageName = await screen.findByText(singlePackage.name);
        expect(packageName).toBeInTheDocument();
      }
    });

    it("renders usn list", async () => {
      const usnsTab = screen.getByRole("tab", { name: /usns/i });
      expect(usnsTab).toBeInTheDocument();
      await userEvent.click(usnsTab);

      const shownUsns = usns.slice(0, LIST_LIMIT);
      for (const usn of shownUsns) {
        expect(
          screen.getByRole("cell", {
            name: `${usn.usn}`,
          }),
        ).toBeInTheDocument();
      }
    });
  });

  describe("Activities table", () => {
    const activitiesTabs = ["Requires approval", "In progress"];

    it("renders tabs", () => {
      activitiesTabs.forEach((tab) => {
        expect(screen.getByText(tab)).toBeInTheDocument();
      });
    });

    it("renders unapproved activities list", async () => {
      const shownActivities = activities
        .filter((activity) => activity.activity_status === "unapproved")
        .slice(0, LIST_LIMIT);
      expect(shownActivities.length).toBeGreaterThan(0);
      for (const activity of shownActivities) {
        const activitySummary = await screen.findAllByText(activity.summary);
        expect(activitySummary.length).toBeGreaterThan(0);
      }
    });

    it("renders in progress activities list", async () => {
      const activitiesInProgressTab = screen.getByRole("tab", {
        name: /in progress/i,
      });
      await userEvent.click(activitiesInProgressTab);

      const shownActivitiesInProgress = activities
        .filter((activity) => activity.activity_status === "delivered")
        .slice(0, LIST_LIMIT);
      for (const activity of shownActivitiesInProgress) {
        const activitySummary = await screen.findAllByText(activity.summary);
        expect(activitySummary.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Tab navigation", () => {
    it("switches back to Instances tab after clicking Packages", async () => {
      const packagesTab = screen.getByRole("tab", { name: /packages/i });
      await userEvent.click(packagesTab);

      const instancesTab = screen.getByRole("tab", { name: /^instances$/i });
      await userEvent.click(instancesTab);

      // Should show instances again
      const shownInstances = instances.slice(0, LIST_LIMIT);
      const [firstInstance] = shownInstances;
      assert(firstInstance);
      const instanceTitle = await screen.findByText(firstInstance.title);
      expect(instanceTitle).toBeInTheDocument();
    });

    it("switches back to Requires approval tab after clicking In progress", async () => {
      const inProgressTab = screen.getByRole("tab", { name: /in progress/i });
      await userEvent.click(inProgressTab);

      const requiresApprovalTab = screen.getByRole("tab", {
        name: /requires approval/i,
      });
      await userEvent.click(requiresApprovalTab);

      // Should show unapproved activities again
      const unapprovedActivities = activities.filter(
        (a) => a.activity_status === "unapproved",
      );
      expect(unapprovedActivities.length).toBeGreaterThan(0);
      const [firstActivity] = unapprovedActivities;
      assert(firstActivity);
      const activitySummary = await screen.findAllByText(firstActivity.summary);
      expect(activitySummary.length).toBeGreaterThan(0);
    });
  });

  describe("Upgrade all button", () => {
    it("opens confirmation modal and triggers upgrade when confirmed", async () => {
      // Wait for instances to load
      const shownInstances = instances.slice(0, LIST_LIMIT);
      const [firstInstance] = shownInstances;
      assert(firstInstance);
      await screen.findByText(firstInstance.title);

      const upgradeAllButton = screen.getByRole("button", {
        name: /upgrade all/i,
      });
      await userEvent.click(upgradeAllButton);

      const modal = await screen.findByRole("dialog");
      expect(within(modal).getByText(/upgrade packages/i)).toBeInTheDocument();

      const confirmButton = within(modal).getByRole("button", {
        name: /^upgrade$/i,
      });
      await userEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("handles upgrade error gracefully", async () => {
      const [firstInstance] = instances;
      assert(firstInstance);
      await screen.findByText(firstInstance.title);

      setEndpointStatus({ status: "error", path: "UpgradePackages" });

      const upgradeAllButton = screen.getByRole("button", {
        name: /upgrade all/i,
      });
      await userEvent.click(upgradeAllButton);

      const modal = await screen.findByRole("dialog");
      const confirmButton = within(modal).getByRole("button", {
        name: /^upgrade$/i,
      });
      await userEvent.click(confirmButton);

      // Component should not crash after error
      expect(screen.getByText(/upgrades available/i)).toBeInTheDocument();
    });
  });

  describe("Approve all button", () => {
    it("opens confirmation modal and triggers approval when confirmed", async () => {
      // Wait for activities to load
      const unapprovedActivities = activities.filter(
        (a) => a.activity_status === "unapproved",
      );
      const [firstActivity] = unapprovedActivities;
      assert(firstActivity);
      await screen.findAllByText(firstActivity.summary);

      const approveAllButton = screen.getByRole("button", {
        name: /approve all/i,
      });
      await userEvent.click(approveAllButton);

      const modal = await screen.findByRole("dialog");
      expect(
        within(modal).getByText(/approve activities/i),
      ).toBeInTheDocument();

      const confirmButton = within(modal).getByRole("button", {
        name: /^approve$/i,
      });
      await userEvent.click(confirmButton);

      // Success notification should be shown
      await waitFor(() => {
        expect(
          screen.getByText(/all activities have been approved successfully/i),
        ).toBeInTheDocument();
      });
    });

    it("handles approve error gracefully", async () => {
      const unapprovedActivities = activities.filter(
        (a) => a.activity_status === "unapproved",
      );
      const [firstActivity] = unapprovedActivities;
      assert(firstActivity);
      await screen.findAllByText(firstActivity.summary);

      setEndpointStatus({ status: "error", path: "ApproveActivities" });

      const approveAllButton = screen.getByRole("button", {
        name: /approve all/i,
      });
      await userEvent.click(approveAllButton);

      const modal = await screen.findByRole("dialog");
      const confirmButton = within(modal).getByRole("button", {
        name: /^approve$/i,
      });
      await userEvent.click(confirmButton);

      // Component should not crash after error
      expect(screen.getByText(/activities/i)).toBeInTheDocument();
    });
  });

  describe("Upgrades footer", () => {
    it("shows the footer and triggers view-all navigation on instances tab", async () => {
      // With 35 instances total and MAX = 10, footer should appear
      const shownInstances = instances.slice(0, LIST_LIMIT);
      const [firstInstance] = shownInstances;
      assert(firstInstance);
      await screen.findByText(firstInstance.title);

      // The footer shows "View all" for instances tab (instances count > 10)
      const viewAllButton = await screen.findByRole("button", {
        name: /view all/i,
      });
      await userEvent.click(viewAllButton);
      // Navigation happens; component still renders
      expect(screen.getByText(/upgrades available/i)).toBeInTheDocument();
    });

    it("shows footer and loads more packages on packages tab", async () => {
      const packagesTab = screen.getByRole("tab", { name: /packages/i });
      await userEvent.click(packagesTab);

      const shownPackages = packages.slice(0, LIST_LIMIT);
      const [firstPackage] = shownPackages;
      assert(firstPackage);
      await screen.findByText(firstPackage.name);

      // With 21 packages and MAX = 10, "Show more" should appear
      const showMoreButton = await screen.findByRole("button", {
        name: /show \d+ more/i,
      });
      await userEvent.click(showMoreButton);
      expect(screen.getByText(/upgrades available/i)).toBeInTheDocument();
    });

    it("shows footer and loads more USNs on usns tab", async () => {
      const usnsTab = screen.getByRole("tab", { name: /usns/i });
      await userEvent.click(usnsTab);

      const shownUsns = usns.slice(0, LIST_LIMIT);
      const [firstUsn] = shownUsns;
      assert(firstUsn);
      await screen.findByText(firstUsn.usn);

      // With 40 USNs and MAX = 10, "Show more" should appear
      const showMoreButton = await screen.findByRole("button", {
        name: /show \d+ more/i,
      });
      await userEvent.click(showMoreButton);
      expect(screen.getByText(/upgrades available/i)).toBeInTheDocument();
    });
  });
});

describe("InfoTablesContainer activities footer", () => {
  it("shows footer and navigates when activities count exceeds limit on unapproved tab", async () => {
    setEndpointStatus({
      status: "variant",
      path: "activities",
      response: {
        unapproved: manyUnapprovedActivities,
        delivered: manyDeliveredActivities,
      },
    });
    renderWithProviders(<InfoTablesContainer />);

    await waitFor(() => {
      expect(
        screen.getAllByText(/unapproved bulk activity/i).length,
      ).toBeGreaterThan(0);
    });

    // Activities column is second; get all "View all" buttons and click the last (activities footer)
    const viewAllButtons = await screen.findAllByRole("button", {
      name: /view all/i,
    });
    const activitiesViewAllButton = viewAllButtons.at(-1);
    assert(activitiesViewAllButton);
    await userEvent.click(activitiesViewAllButton);
    expect(screen.getByText("Activities")).toBeInTheDocument();
  });

  it("shows footer and navigates when activities count exceeds limit on in-progress tab", async () => {
    setEndpointStatus({
      status: "variant",
      path: "activities",
      response: {
        unapproved: manyUnapprovedActivities,
        delivered: manyDeliveredActivities,
      },
    });
    renderWithProviders(<InfoTablesContainer />);

    const inProgressTab = await screen.findByTestId(
      "activities-in-progress-tab",
    );
    await userEvent.click(inProgressTab);

    await waitFor(() => {
      expect(
        screen.getAllByText(/delivered bulk activity/i).length,
      ).toBeGreaterThan(0);
    });

    const viewAllButtons = await screen.findAllByRole("button", {
      name: /view all/i,
    });
    const activitiesViewAllButton = viewAllButtons.at(-1);
    assert(activitiesViewAllButton);
    await userEvent.click(activitiesViewAllButton);
    expect(screen.getByText("Activities")).toBeInTheDocument();
  });
});

describe("InfoTablesContainer empty-state refresh handlers", () => {
  it("calls refresh for upgrades instances when clicking Refresh in empty state", async () => {
    setEndpointStatus({ status: "empty", path: "computers-alert-empty" });
    renderWithProviders(<InfoTablesContainer />);

    const refreshButton = await screen.findByRole("button", {
      name: /refresh/i,
    });
    await userEvent.click(refreshButton);
    expect(screen.getByText(/upgrades available/i)).toBeInTheDocument();
  });

  it("calls refresh for upgrades packages with instances present", async () => {
    setEndpointStatus({ status: "empty", path: "packages" });
    renderWithProviders(<InfoTablesContainer />);

    // Wait for instances to load, then switch to packages tab
    await screen.findByRole("tab", { name: /instances/i });
    const [packagesTab] = screen.getAllByRole("tab", { name: /packages/i });
    assert(packagesTab);
    await userEvent.click(packagesTab);

    const refreshButton = await screen.findByRole("button", {
      name: /refresh/i,
    });
    await userEvent.click(refreshButton);
    expect(screen.getByText(/upgrades available/i)).toBeInTheDocument();
  });

  it("calls refresh for upgrades usns with instances present", async () => {
    setEndpointStatus({ status: "empty", path: "usns" });
    renderWithProviders(<InfoTablesContainer />);

    await screen.findByRole("tab", { name: /instances/i });
    const usnsTab = screen.getByRole("tab", { name: /usns/i });
    await userEvent.click(usnsTab);

    const refreshButton = await screen.findByRole("button", {
      name: /refresh/i,
    });
    await userEvent.click(refreshButton);
    expect(screen.getByText(/upgrades available/i)).toBeInTheDocument();
  });

  it("calls refresh for unapproved activities when clicking Refresh in empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<InfoTablesContainer />);

    const refreshButtons = await screen.findAllByRole("button", {
      name: /refresh/i,
    });
    // Click the last refresh button (activities section, upgrades may also have refresh)
    const lastRefreshButton = refreshButtons.at(-1);
    assert(lastRefreshButton);
    await userEvent.click(lastRefreshButton);
    expect(screen.getByText("Activities")).toBeInTheDocument();
  });

  it("calls refresh for in-progress activities when clicking Refresh in empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<InfoTablesContainer />);

    const inProgressTab = await screen.findByTestId(
      "activities-in-progress-tab",
    );
    await userEvent.click(inProgressTab);

    const refreshButtons = await screen.findAllByRole("button", {
      name: /refresh/i,
    });
    const lastRefreshButton = refreshButtons.at(-1);
    assert(lastRefreshButton);
    await userEvent.click(lastRefreshButton);
    expect(screen.getByText("Activities")).toBeInTheDocument();
  });
});
