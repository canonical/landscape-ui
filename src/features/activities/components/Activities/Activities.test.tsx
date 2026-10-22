import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ROUTES } from "@/libs/routes";
import date from "@/libs/date";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import {
  activities,
  INVALID_ACTIVITY_SEARCH_QUERY,
} from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Activities from "./Activities";
import ActivitiesList from "../ActivitiesList";
import { API_URL } from "@/constants";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";
import sidePanelClasses from "@/components/layout/SidePanel/SidePanel.module.scss";

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
        "Created at",
        "Completed at",
        "Creator",
      ];
      const table = screen.getByRole("table");
      expect(table).toHaveTexts(columnHeaders);
    });

    it("should not render instance links when the Instance column is hidden", () => {
      renderWithProviders(<Activities {...defaultProps} />);

      const table = screen.getByRole("table");
      expect(within(table).queryAllByRole("link")).toHaveLength(0);
    });

    it("should render the completion time for each activity", () => {
      renderWithProviders(<Activities {...defaultProps} />);

      const table = screen.getByRole("table");
      const headerCells = within(table).getAllByRole("columnheader");
      const completionTimeColumnIndex = headerCells.findIndex((cell) =>
        cell.textContent?.includes("Completed at"),
      );
      const [, ...rows] = within(table).getAllByRole("row");

      activities.forEach(({ completion_time }, index) => {
        assert(rows[index], "Row should exist for the activity");
        const cells = within(rows[index]).getAllByRole("cell");
        expect(cells[completionTimeColumnIndex]).toHaveTextContent(
          completion_time
            ? date(completion_time).format(DISPLAY_DATE_TIME_FORMAT)
            : NO_DATA_TEXT,
        );
      });
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
    it("resets the tab and closes local child details when another activity is opened", async () => {
      const parent = { ...activities[0], children: [activities[1]] };
      const [, child] = activities;
      const nextActivity = { ...activities[2], children: [child] };
      server.use(
        http.get(`${API_URL}activities`, () =>
          HttpResponse.json({
            results: [child],
            count: 1,
            next: null,
            previous: null,
          }),
        ),
        http.get(`${API_URL}activities/:id`, ({ params: { id } }) =>
          HttpResponse.json(
            [parent, child, nextActivity].find(
              (activity) => activity.id === Number(id),
            ),
          ),
        ),
      );
      renderWithProviders(
        <Activities {...defaultProps} activities={[parent, nextActivity]} />,
      );
      const mainTable = screen.getByRole("table");

      await user.click(
        within(mainTable).getByRole("button", { name: parent.summary }),
      );
      await user.click(await screen.findByRole("tab", { name: "Children" }));
      const parentHeading = screen.getByRole("heading", {
        name: parent.summary,
      });
      const parentPanel = parentHeading.closest("aside");
      assert(parentPanel);
      const childrenTable = await within(parentPanel).findByRole("table");
      await user.click(
        within(childrenTable).getByRole("button", { name: child.summary }),
      );
      expect(
        await screen.findByRole("heading", { name: child.summary }),
      ).toBeInTheDocument();

      await user.click(
        within(mainTable).getByRole("button", { name: nextActivity.summary }),
      );
      const nextHeading = await screen.findByRole("heading", {
        name: nextActivity.summary,
      });
      const nextPanel = nextHeading.closest("aside");
      assert(nextPanel);
      expect(
        await within(nextPanel).findByText("Description"),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: child.summary }),
      ).not.toBeInTheDocument();
      expect(within(nextPanel).queryByRole("table")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: parent.summary }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Info" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("opens children in a medium local panel without replacing the parent panel", async () => {
      const parent = { ...activities[0], children: [activities[1]] };
      const [, child] = activities;
      server.use(
        http.get(`${API_URL}activities`, () =>
          HttpResponse.json({
            results: [child],
            count: 1,
            next: null,
            previous: null,
          }),
        ),
        http.get(`${API_URL}activities/:id`, ({ params: { id } }) =>
          HttpResponse.json(Number(id) === parent.id ? parent : child),
        ),
      );
      renderWithProviders(
        <Activities {...defaultProps} activities={[parent]} />,
      );

      await user.click(screen.getByRole("button", { name: parent.summary }));
      const parentHeading = await screen.findByRole("heading", {
        name: parent.summary,
      });
      expect(parentHeading.closest("aside")).toHaveClass("is-wide");
      await user.click(await screen.findByRole("tab", { name: "Children" }));

      const parentPanel = parentHeading.closest("aside");
      assert(parentPanel);
      const table = await within(parentPanel).findByRole("table");
      await user.click(
        within(table).getByRole("button", { name: child.summary }),
      );

      const childHeading = await screen.findByRole("heading", {
        name: child.summary,
      });
      expect(childHeading.closest("aside")).toHaveClass(
        sidePanelClasses.medium,
      );
      expect(parentHeading).toBeInTheDocument();
      const childPanel = childHeading.closest("aside");
      assert(childPanel);
      expect(
        await within(childPanel).findByText("Description"),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Close" }));

      expect(
        screen.queryByRole("heading", { name: child.summary }),
      ).not.toBeInTheDocument();
      expect(parentHeading).toBeInTheDocument();
      expect(table).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Children" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

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
    afterEach(() => {
      resetScreenSize();
    });

    it("should render ActivitiesHeader component", () => {
      setScreenSize("xxl");
      renderWithProviders(<Activities {...defaultProps} />);

      expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Status" }),
      ).toBeInTheDocument();
    });
  });

  describe("Instance ID prop behavior", () => {
    it("should not include the Instance column by default", () => {
      renderWithProviders(<Activities {...defaultProps} />);

      expect(screen.queryByText("Instance")).not.toBeInTheDocument();
    });

    it("should exclude Instance column when instanceId is provided", () => {
      renderWithProviders(<Activities {...defaultProps} instanceId={6} />);

      expect(screen.queryByText("Instance")).not.toBeInTheDocument();
    });

    it("should include the Instance column when requested for a list", () => {
      renderWithProviders(
        <ActivitiesList activities={activities} showInstanceColumn />,
      );

      const table = screen.getByRole("table");
      expect(within(table).getByText("Instance")).toBeInTheDocument();
      const instanceLinks = within(table).getAllByRole("link");
      expect(instanceLinks.map((link) => link.textContent)).toEqual(
        activities.map((activity) => activity.computer_title),
      );
      expect(instanceLinks[0]).toHaveAttribute(
        "href",
        ROUTES.instances.details.single(activities[0].computer_id),
      );
    });

    it("should hide the activity details instance field when opened with an instanceId", async () => {
      renderWithProviders(<Activities {...defaultProps} instanceId={6} />);

      const activityButton = screen.getByRole("button", {
        name: activities[0].summary,
      });
      await user.click(activityButton);

      const sidePanel = await screen.findByRole("complementary");
      expect(
        within(sidePanel).getByRole("heading", {
          name: activities[0].summary,
        }),
      ).toBeInTheDocument();
      expect(within(sidePanel).queryByText("Instance")).not.toBeInTheDocument();
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
