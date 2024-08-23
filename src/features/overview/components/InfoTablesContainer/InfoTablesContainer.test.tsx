import { renderWithProviders } from "@/tests/render";
import InfoTablesContainer from "./InfoTablesContainer";
import { screen } from "@testing-library/react";
import { instances } from "@/tests/mocks/instance";
import userEvent from "@testing-library/user-event";
import { packages } from "@/tests/mocks/packages";
import { usns } from "@/tests/mocks/usn";
import { activities } from "@/tests/mocks/activity";

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
      const shownActivities = activities.slice(0, LIST_LIMIT);
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

      const shownActivitiesInProgress = activities.slice(0, LIST_LIMIT);
      for (const activity of shownActivitiesInProgress) {
        const activitySummary = await screen.findAllByText(activity.summary);
        expect(activitySummary.length).toBeGreaterThan(0);
      }
    });
  });
});
