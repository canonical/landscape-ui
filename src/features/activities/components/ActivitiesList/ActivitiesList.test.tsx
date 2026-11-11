import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT, API_URL } from "@/constants";
import sidePanelClasses from "@/components/layout/SidePanel/SidePanel.module.scss";
import globalSidePanelClasses from "@/context/SidePanelProvider.module.scss";
import date from "@/libs/date";
import { ROUTES } from "@/libs/routes";
import { activities } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps, FC } from "react";
import { http, HttpResponse } from "msw";
import ActivitiesList from "./ActivitiesList";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useOpenActivityDetailsPanel } from "../../hooks";

const defaultProps: ComponentProps<typeof ActivitiesList> = {
  activities,
  activitiesCount: activities.length,
  isGettingActivities: false,
  header: "Activity",
  selectionEnabled: false,
  selectedActivities: [],
  setSelectedActivities: vi.fn(),
  onActivityDetailsOpen: vi.fn(),
};

interface ActivitiesListWithPanelProps extends ComponentProps<
  typeof ActivitiesList
> {
  readonly instanceId?: number;
  readonly isActivityGroup?: boolean;
}

const ActivitiesListWithPanel: FC<ActivitiesListWithPanelProps> = ({
  instanceId,
  isActivityGroup = false,
  ...props
}) => {
  const openActivityDetailsPanel = useOpenActivityDetailsPanel();

  return (
    <ActivitiesList
      {...props}
      header={isActivityGroup ? "Activity group" : "Activity"}
      onActivityDetailsOpen={(activity) => {
        openActivityDetailsPanel(activity, {
          hideInstanceField: instanceId !== undefined,
          size: isActivityGroup ? "large" : "small",
        });
      }}
    />
  );
};

describe("ActivitiesList rendering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the activity table with its columns", () => {
    renderWithProviders(
      <ActivitiesListWithPanel {...defaultProps} isActivityGroup />,
    );

    const table = screen.getByRole("table");
    expect(table).toHaveTexts([
      "Activity group",
      "Status",
      "Created at",
      "Completed at",
      "Creator",
    ]);
  });

  it("labels single-activity rows as Activity", () => {
    renderWithProviders(<ActivitiesList {...defaultProps} />);

    expect(
      screen.getByRole("columnheader", { name: "Activity" }),
    ).toBeInTheDocument();
  });

  it("renders completion times or the no-data text for each activity", () => {
    renderWithProviders(<ActivitiesList {...defaultProps} />);

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

  it("renders an empty-state message when there are no activities", () => {
    renderWithProviders(
      <ActivitiesList {...defaultProps} activities={[]} activitiesCount={0} />,
    );

    expect(
      screen.getByText(
        "No activities found according to your search parameters.",
      ),
    ).toBeInTheDocument();
  });

  it("does not render instance links when the Instance column is hidden", () => {
    renderWithProviders(<ActivitiesList {...defaultProps} />);

    expect(
      within(screen.getByRole("table")).queryAllByRole("link"),
    ).toHaveLength(0);
  });

  it("renders the Instance column when requested", () => {
    renderWithProviders(
      <ActivitiesList {...defaultProps} showInstanceColumn />,
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

  it("renders the status label for each activity", () => {
    const activitiesWithDifferentStatuses = [
      { ...activities[0], activity_status: "succeeded" as const },
      { ...activities[1], activity_status: "failed" as const },
      { ...activities[2], activity_status: "waiting" as const },
    ];

    renderWithProviders(
      <ActivitiesList
        {...defaultProps}
        activities={activitiesWithDifferentStatuses}
      />,
    );

    expect(screen.getByText("Succeeded")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("Waiting")).toBeInTheDocument();
  });

  it("opens activity details when its summary is clicked", async () => {
    renderWithProviders(<ActivitiesList {...defaultProps} />);

    await userEvent.click(
      screen.getByRole("button", { name: activities[0].summary }),
    );

    expect(defaultProps.onActivityDetailsOpen).toHaveBeenCalledWith(
      activities[0],
    );
  });

  it("resets the tab and closes child details when another activity is opened", async () => {
    const parent = {
      ...activities[0],
      type: "ActivityGroup",
      result_text: "Group output",
      children: [activities[1]],
    };
    const [, child] = activities;
    const nextActivity = {
      ...activities[2],
      type: "ActivityGroup",
      result_text: "Next group output",
      children: [child],
    };
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
      <ActivitiesListWithPanel
        {...defaultProps}
        activities={[parent, nextActivity]}
        isActivityGroup
      />,
    );
    const mainTable = screen.getByRole("table");

    await userEvent.click(
      within(mainTable).getByRole("button", { name: parent.summary }),
    );
    await screen.findByRole("tab", { name: "Activities" });
    await userEvent.click(screen.getByRole("tab", { name: "Output" }));
    await userEvent.click(screen.getByRole("tab", { name: "Activities" }));
    const parentHeading = screen.getByRole("heading", {
      name: parent.summary,
    });
    const parentPanel = parentHeading.closest("aside");
    assert(parentPanel);
    const childrenTable = await within(parentPanel).findByRole("table");
    await userEvent.click(
      within(childrenTable).getByRole("button", { name: child.summary }),
    );
    expect(
      await screen.findByRole("heading", { name: child.summary }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Output" }));

    await userEvent.click(
      within(mainTable).getByRole("button", { name: nextActivity.summary }),
    );
    const nextHeading = await screen.findByRole("heading", {
      name: nextActivity.summary,
    });
    const nextPanel = nextHeading.closest("aside");
    assert(nextPanel);
    expect(
      await within(nextPanel).findByRole("tab", { name: "Activities" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.queryByRole("heading", { name: child.summary }),
    ).not.toBeInTheDocument();
    expect(await within(nextPanel).findByRole("table")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: parent.summary }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Activities" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it.each([
    { instanceId: undefined, size: "large" as const },
    { instanceId: 6, size: "small" as const },
  ])(
    "opens children in a $size local panel for instanceId=$instanceId",
    async ({ instanceId, size }) => {
      const parent = {
        ...activities[0],
        type: "ActivityGroup",
        result_text: "Group output",
        children: [activities[1]],
      };
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
        <ActivitiesListWithPanel
          {...defaultProps}
          activities={[parent]}
          instanceId={instanceId}
          isActivityGroup={instanceId === undefined}
        />,
      );

      await userEvent.click(
        screen.getByRole("button", { name: parent.summary }),
      );
      const parentHeading = await screen.findByRole("heading", {
        name: parent.summary,
      });
      if (size === "small") {
        expect(parentHeading.closest("aside")).not.toHaveClass("is-wide");
      } else {
        expect(parentHeading.closest("aside")).toHaveClass("is-wide");
      }
      expect(parentHeading.closest("aside")).not.toHaveClass(
        globalSidePanelClasses.medium,
      );
      await screen.findByRole("tab", { name: "Activities" });

      const parentPanel = parentHeading.closest("aside");
      assert(parentPanel);
      const table = await within(parentPanel).findByRole("table");
      await userEvent.click(
        within(table).getByRole("button", { name: child.summary }),
      );

      const childHeading = await screen.findByRole("heading", {
        name: child.summary,
      });
      if (size === "small") {
        expect(childHeading.closest("aside")).not.toHaveClass(
          sidePanelClasses.medium,
          sidePanelClasses.large,
        );
      } else {
        expect(childHeading.closest("aside")).toHaveClass(
          sidePanelClasses.large,
        );
      }
      expect(parentHeading).toBeInTheDocument();
      const childPanel = childHeading.closest("aside");
      assert(childPanel);
      expect(
        await within(childPanel).findByText("Created at"),
      ).toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      expect(
        screen.queryByRole("heading", { name: child.summary }),
      ).not.toBeInTheDocument();
      expect(parentHeading).toBeInTheDocument();
      expect(table).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Activities" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    },
  );
});

describe("ActivitiesList selection", () => {
  it("renders a checkbox for each activity and the header", () => {
    renderWithProviders(
      <ActivitiesList
        {...defaultProps}
        selectionEnabled
        selectedActivities={[]}
        setSelectedActivities={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("checkbox")).toHaveLength(activities.length + 1);
  });

  it("selects all activities when the header checkbox is clicked", async () => {
    const setSelected = vi.fn();
    renderWithProviders(
      <ActivitiesList
        {...defaultProps}
        selectionEnabled
        selectedActivities={[]}
        setSelectedActivities={setSelected}
      />,
    );

    await userEvent.click(screen.getByRole("checkbox", { name: "Toggle all" }));

    expect(setSelected).toHaveBeenCalledWith(activities);
  });

  it("does not render selection controls when selection is disabled", () => {
    renderWithProviders(
      <ActivitiesList
        {...defaultProps}
        selectedActivities={[]}
        setSelectedActivities={vi.fn()}
      />,
    );

    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });
});
