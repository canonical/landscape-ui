import { ROUTES } from "@/libs/routes";
import {
  activities,
  INVALID_ACTIVITY_SEARCH_QUERY,
} from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import Activities from "./Activities";

const setSelectedActivities = vi.fn();
const defaultProps: ComponentProps<typeof Activities> = {
  activities,
  activitiesCount: 3,
  isGettingActivities: false,
  selectedActivities: [],
  setSelectedActivities,
};

describe("Activities", () => {
  const user = userEvent.setup();

  describe("Table rendering", () => {
    it("should render activities table with correct columns", () => {
      renderWithProviders(<Activities {...defaultProps} />);

      const columnHeaders = [
        "Description",
        "Status",
        "Instance",
        "Created at",
        "Creator",
      ];
      const table = screen.getByRole("table");
      expect(table).toHaveTexts(columnHeaders);
    });
  });

  describe("Empty state", () => {
    it("should display empty message when no activities are present", () => {
      renderWithProviders(
        <Activities {...defaultProps} activities={[]} activitiesCount={0} />,
      );

      expect(
        screen.getByText(
          "No activities found according to your search parameters.",
        ),
      ).toBeInTheDocument();
    });

    it("should display empty message when invalid search query is used", async () => {
      renderWithProviders(<Activities {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search");
      await user.clear(searchInput);
      await user.type(searchInput, INVALID_ACTIVITY_SEARCH_QUERY);
    });
  });

  describe("Checkbox selection", () => {
    it("should render checkbox for each activity", () => {
      renderWithProviders(<Activities {...defaultProps} />);

      const checkboxes = screen.getAllByRole("checkbox");
      const checkboxesIncludingHeaderLength = activities.length + 1;
      expect(checkboxes).toHaveLength(checkboxesIncludingHeaderLength);
    });

    it("should call setSelectedActivities when individual checkbox is clicked", async () => {
      renderWithProviders(<Activities {...defaultProps} />);

      const checkbox = screen.getByRole("checkbox", {
        name: activities[0].summary,
      });
      await user.click(checkbox);

      expect(setSelectedActivities).toHaveBeenCalledWith([activities[0]]);
    });

    it("should toggle all checkboxes when header checkbox is clicked", async () => {
      renderWithProviders(<Activities {...defaultProps} />);

      const headerCheckbox = screen.getByRole("checkbox", {
        name: /toggle all/i,
      });
      await user.click(headerCheckbox);

      expect(setSelectedActivities).toHaveBeenCalledWith(activities);
    });
  });

  describe("Activity details", () => {
    it("should open activity details side panel when description is clicked", async () => {
      renderWithProviders(<Activities {...defaultProps} />);

      const activityButton = screen.getByRole("button", {
        name: activities[0].summary,
      });
      await user.click(activityButton);

      expect(
        screen.getByRole("heading", { name: activities[0].summary }),
      ).toBeInTheDocument();
    });
  });

  describe("ActivitiesHeader integration", () => {
    it("should render ActivitiesHeader component", () => {
      renderWithProviders(<Activities {...defaultProps} />);

      expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Status" }),
      ).toBeInTheDocument();
    });
  });

  describe("Instance ID prop behavior", () => {
    it("should include Instance column by default", () => {
      renderWithProviders(<Activities {...defaultProps} />);

      expect(screen.getByText("Instance")).toBeInTheDocument();
    });

    it("should exclude Instance column when instanceId is provided", () => {
      renderWithProviders(<Activities {...defaultProps} instanceId={6} />);

      expect(screen.queryByText("Instance")).not.toBeInTheDocument();
    });
  });

  describe("useOpenActivityDetails hook", () => {
    it("should open activity details when navigated with state", async () => {
      renderWithProviders(
        <Activities {...defaultProps} />,
        undefined,
        ROUTES.activities.root(),
      );

      const sidePanel = await screen.findByRole("complementary");
      expect(sidePanel).toBeVisible();
    });
  });

  describe("Status icons", () => {
    it("should render status with appropriate icon", () => {
      const activitiesWithDifferentStatuses = [
        { ...activities[0], activity_status: "succeeded" as const },
        { ...activities[1], activity_status: "failed" as const },
        { ...activities[2], activity_status: "waiting" as const },
      ];

      renderWithProviders(
        <Activities
          {...defaultProps}
          activities={activitiesWithDifferentStatuses}
        />,
      );

      expect(screen.getByText("Succeeded")).toBeInTheDocument();
      expect(screen.getByText("Failed")).toBeInTheDocument();
      expect(screen.getByText("Waiting")).toBeInTheDocument();
    });
  });
});
