import { renderWithProviders } from "@/tests/render";
import InfoTablesContainer from "./InfoTablesContainer";
import { screen } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";
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
      await expectLoadingState();

      const shownInstances = instances.slice(0, LIST_LIMIT);
      for (const instance of shownInstances) {
        expect(screen.getByText(instance.hostname)).toBeInTheDocument();
      }
    });

    it("renders package list", async () => {
      await expectLoadingState();

      const packagesTab = screen.getByRole("tab", { name: /packages/i });
      await userEvent.click(packagesTab);

      const shownPackages = packages.slice(0, LIST_LIMIT);
      for (const singlePackage of shownPackages) {
        const rows = screen.getAllByRole("row", {
          name: `${singlePackage.name} ${singlePackage.computers.upgrades.length}`,
        });
        expect(rows.length).toBeGreaterThan(0);
      }
    });

    it("renders usn list", async () => {
      await expectLoadingState();

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
      await expectLoadingState();

      const shownActivities = activities.slice(0, LIST_LIMIT);
      for (const activity of shownActivities) {
        expect(screen.getAllByText(activity.summary).length).toBeGreaterThan(0);
      }
    });

    it("renders in progress activities list", async () => {
      await expectLoadingState();

      const activitiesInProgressTab = screen.getByRole("tab", {
        name: /in progress/i,
      });
      await userEvent.click(activitiesInProgressTab);

      const shownActivitiesInProgress = activities.slice(0, LIST_LIMIT);
      for (const activity of shownActivitiesInProgress) {
        expect(screen.getAllByText(activity.summary).length).toBeGreaterThan(0);
      }
    });
  });
});
