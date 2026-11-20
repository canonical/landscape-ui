import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { API_URL, DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import * as Constants from "@/constants";
import date from "@/libs/date";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { activities } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps, FC } from "react";
import ActivitiesPanelListComponent from "./ActivitiesPanelList";
import { HttpStatusCode } from "axios";
import sidePanelClasses from "@/components/layout/SidePanel/SidePanel.module.scss";

const ActivitiesPanelList: FC<
  Partial<ComponentProps<typeof ActivitiesPanelListComponent>>
> = ({ availableActions, hiddenColumns, ...props }) => (
  <ActivitiesPanelListComponent
    availableActions={
      availableActions ?? { approve: true, cancel: true, redo: true }
    }
    hiddenColumns={hiddenColumns ?? { creator: true }}
    {...props}
  />
);

const parentId = activities[0].id;
const children = Array.from({ length: 21 }, (_, index) => ({
  ...activities[1],
  id: index + 1,
  parent_id: parentId,
  summary: `Child activity ${index + 1}`,
}));
const getChildren = vi.fn();

const openAttributeGroup = async (
  user: ReturnType<typeof userEvent.setup>,
  name: RegExp,
) => {
  const summary = screen.getByRole("heading", { name }).closest("summary");
  assert(summary);
  await user.click(summary);
};

describe("ActivityChildren", () => {
  beforeEach(() => {
    setScreenSize("xxl");
    getChildren.mockClear();
    server.use(
      http.get(`${API_URL}activities`, ({ request }) => {
        const { searchParams } = new URL(request.url);
        getChildren(Object.fromEntries(searchParams));
        return HttpResponse.json(
          generatePaginatedResponse({
            data: children,
            limit: Number(searchParams.get("limit")),
            offset: Number(searchParams.get("offset")),
          }),
        );
      }),
    );
  });

  afterEach(() => {
    resetScreenSize();
    vi.restoreAllMocks();
  });

  it.each([
    {
      context: "overview",
      parentId: undefined,
      status: "unapproved",
      hiddenColumns: { creator: false },
      headers: ["Toggle allActivityInstance", "CreatorCreated at"],
    },
    {
      context: "activity group",
      parentId,
      hiddenColumns: { creator: true },
      headers: ["Toggle allActivityInstance", "StatusCompleted at"],
    },
  ])(
    "uses double rows in the $context panel",
    async ({ headers, ...props }) => {
      renderWithProviders(<ActivitiesPanelList {...props} />);

      const table = await screen.findByRole("table");
      expect(
        within(table)
          .getAllByRole("columnheader")
          .map((cell) => cell.textContent),
      ).toEqual(headers);
    },
  );

  it("stacks side-panel fields with muted secondary content", async () => {
    const [activity] = activities;
    server.use(
      http.get(`${API_URL}activities`, () =>
        HttpResponse.json(
          generatePaginatedResponse({ data: [activity], limit: 20, offset: 0 }),
        ),
      ),
    );
    renderWithProviders(
      <ActivitiesPanelList hiddenColumns={{ creator: false }} />,
    );

    const table = await screen.findByRole("table");
    const [descriptionCell, statusCell, creatorCell] =
      within(table).getAllByRole("cell");
    assert(descriptionCell && statusCell && creatorCell);
    expect(
      within(descriptionCell).getByText(activity.computer_title),
    ).toHaveClass("u-text--muted");
    expect(within(descriptionCell).queryByRole("link")).not.toBeInTheDocument();
    const completedAt = date(activity.completion_time).format(
      DISPLAY_DATE_TIME_FORMAT,
    );
    expect(within(statusCell).getByText(completedAt).parentElement).toHaveClass(
      "u-text--muted",
    );
    const createdAt = date(activity.creation_time).format(
      DISPLAY_DATE_TIME_FORMAT,
    );
    expect(creatorCell).toHaveTextContent(
      `${activity.creator.name}${createdAt}`,
    );
    expect(within(creatorCell).getByText(createdAt)).toHaveClass(
      "u-text--muted",
    );
    expect(
      within(creatorCell).getByText(activity.creator.name),
    ).not.toHaveClass("u-text--muted");

    await userEvent.click(
      within(descriptionCell).getByRole("button", { name: activity.summary }),
    );
    expect(
      await screen.findByRole("heading", { name: activity.summary }),
    ).toBeInTheDocument();
  });

  it.each([
    { creator: false, expectedHeader: "CreatorCreated at" },
    { creator: true, expectedHeader: undefined },
  ])(
    "respects whether the Creator column is hidden: $creator",
    async ({ creator, expectedHeader }) => {
      server.use(
        http.get(`${API_URL}activities`, () =>
          HttpResponse.json(
            generatePaginatedResponse({
              data: [{ ...activities[0], completion_time: null }],
              limit: 20,
              offset: 0,
            }),
          ),
        ),
      );
      renderWithProviders(<ActivitiesPanelList hiddenColumns={{ creator }} />);

      const table = await screen.findByRole("table");
      expect(
        within(table)
          .getAllByRole("columnheader")
          .map((cell) => cell.textContent),
      ).toEqual([
        "Toggle allActivityInstance",
        "StatusCompleted at",
        ...(expectedHeader ? [expectedHeader] : []),
      ]);
      expect(
        within(table).getByText(activities[0].computer_title),
      ).toBeInTheDocument();
      expect(within(table).getByText(NO_DATA_TEXT)).toHaveClass(
        "u-text--muted",
      );
      const creationTime = date(activities[0].creation_time).format(
        DISPLAY_DATE_TIME_FORMAT,
      );
      if (creator) {
        expect(within(table).queryByText(creationTime)).not.toBeInTheDocument();
      } else {
        expect(within(table).getByText(creationTime)).toBeInTheDocument();
      }
      if (creator) {
        expect(
          within(table).queryByText(activities[0].creator.name),
        ).not.toBeInTheDocument();
      }
    },
  );

  it("toggles visible activities and clears cross-page selection from a row", async () => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(true);
    const user = userEvent.setup();
    renderWithProviders(<ActivitiesPanelList parentId={parentId} />);

    const toggleAll = await screen.findByRole("checkbox", {
      name: "Toggle all",
    });
    await user.click(toggleAll);
    screen.getAllByRole("checkbox").forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });

    const firstCheckbox = screen.getByRole("checkbox", {
      name: "Child activity 1",
    });
    await user.click(firstCheckbox);
    expect(firstCheckbox).not.toBeChecked();
    expect(toggleAll).toBePartiallyChecked();
    await user.click(
      screen.getByRole("button", { name: "Select all 21 activities" }),
    );
    expect(toggleAll).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Child activity 1" }),
    ).toBeChecked();

    await user.click(
      screen.getByRole("checkbox", { name: "Child activity 1" }),
    );
    screen.getAllByRole("checkbox").forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
    expect(
      screen.queryByText("All 21 activities selected"),
    ).not.toBeInTheDocument();
  });

  it("omits parent-id search help when activities are scoped to one parent", async () => {
    const props = {
      parentId,
    };
    renderWithProviders(<ActivitiesPanelList {...props} />);
    await screen.findByRole("table");
    await userEvent.click(screen.getByRole("button", { name: /help/i }));
    const dialog = screen.getByRole("dialog", { name: /search help/i });
    expect(dialog).not.toHaveTextContent("parent-id:<parent_id>");
    expect(dialog).toHaveTextContent("id:<activity_id>");
    expect(dialog).toHaveTextContent("created-after:<date>");
  });

  it("surfaces an API failure as an error notification", async () => {
    server.use(
      http.get(`${API_URL}activities`, () =>
        HttpResponse.json(
          { error: "InternalServerError", message: "Activities unavailable" },
          { status: HttpStatusCode.InternalServerError },
        ),
      ),
    );
    renderWithProviders(<ActivitiesPanelList parentId={parentId} />);
    expect(
      await screen.findByText("Activities unavailable"),
    ).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("keeps searches scoped to the parent without changing page filters", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <ActivitiesPanelList parentId={parentId} />
        <LocationDisplay />
      </>,
      undefined,
      "/activities?query=underlying-page&status=waiting",
    );
    await screen.findByRole("table");
    expect(getChildren).toHaveBeenLastCalledWith({
      query: `parent-id:${parentId}`,
      limit: "20",
      offset: "0",
    });

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next page" }));
    await screen.findByRole("button", { name: "Child activity 21" });
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    await screen.findByRole("button", { name: "Child activity 1" });
    await user.click(screen.getByRole("button", { name: "Next page" }));
    await screen.findByRole("button", { name: "Child activity 21" });
    await user.type(screen.getByRole("searchbox"), "computer:id:6");
    await user.click(screen.getByRole("button", { name: "Search" }));
    await waitFor(() => {
      expect(getChildren).toHaveBeenLastCalledWith({
        query: `parent-id:${parentId} computer:id:6`,
        limit: "20",
        offset: "0",
      });
    });
    expect(getLocationDisplay()).toHaveTextContent(
      "/activities?query=underlying-page&status=waiting",
    );
    await user.click(
      screen.getByRole("button", { name: /clear search field/i }),
    );
    await waitFor(() => {
      expect(getChildren).toHaveBeenLastCalledWith({
        query: `parent-id:${parentId}`,
        limit: "20",
        offset: "0",
      });
    });
  });

  it("supports overview status filters and preserves state while small details are open", async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${API_URL}activities/:id`, ({ params }) =>
        HttpResponse.json(children.find(({ id }) => id === Number(params.id))),
      ),
    );
    renderWithProviders(
      <>
        <ActivitiesPanelList status="unapproved" />
        <LocationDisplay />
      </>,
      undefined,
      "/overview?query=underlying-page",
    );

    const [firstChild] = children;
    assert(firstChild);
    await screen.findByRole("columnheader", { name: /Activity.*Instance/ });
    await user.click(screen.getByRole("button", { name: /help/i }));
    const helpDialog = screen.getByRole("dialog", { name: /search help/i });
    const terms = within(helpDialog)
      .getAllByRole("row")
      .slice(1, 4)
      .map((row) => within(row).getAllByRole("cell")[0]?.textContent);
    expect(terms).toEqual([
      "id:<activity_id>",
      "parent-id:<parent_id>",
      "created-after:<date>",
    ]);
    await user.click(
      within(helpDialog).getByRole("button", { name: /close/i }),
    );
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(
      screen.queryByRole("button", { name: "Status" }),
    ).not.toBeInTheDocument();
    expect(getChildren).toHaveBeenLastCalledWith({
      query: "status:unapproved",
      limit: "20",
      offset: "0",
    });

    await user.click(
      screen.getByRole("checkbox", { name: firstChild.summary }),
    );
    await user.click(screen.getByRole("button", { name: firstChild.summary }));
    const heading = await screen.findByRole("heading", {
      name: firstChild.summary,
    });
    const panel = heading.closest("aside");
    assert(panel);
    expect(panel).not.toHaveClass(sidePanelClasses.medium);
    expect(panel).not.toHaveClass(sidePanelClasses.large);
    await within(panel).findByText("Created at");
    await user.click(within(panel).getByRole("button", { name: "Close" }));

    expect(
      screen.getByRole("checkbox", { name: firstChild.summary }),
    ).toBeChecked();
    expect(getChildren).toHaveBeenLastCalledWith({
      query: "status:unapproved",
      limit: "20",
      offset: "0",
    });
    expect(getLocationDisplay()).toHaveTextContent(
      "/overview?query=underlying-page",
    );
  });

  it("selects all children across pages and allows clearing the selection", async () => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(true);
    const user = userEvent.setup();
    renderWithProviders(<ActivitiesPanelList parentId={parentId} />);

    const [firstChild] = children;
    assert(firstChild);
    await user.click(
      await screen.findByRole("checkbox", { name: firstChild.summary }),
    );
    await user.click(
      screen.getByRole("button", { name: "Select all 21 activities" }),
    );

    expect(screen.getByText("All 21 activities selected")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear selection" }));

    expect(
      screen.queryByText("All 21 activities selected"),
    ).not.toBeInTheDocument();
  });

  it("applies local status, type, and date filters and can clear them", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ActivitiesPanelList parentId={parentId} />);
    await screen.findByRole("table");
    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(screen.getByRole("button", { name: "Status" }));
    await user.click(screen.getByRole("button", { name: "Failed" }));
    await user.click(screen.getByRole("button", { name: "Type" }));
    await user.click(
      await screen.findByRole("button", { name: "ExecuteScriptRequest" }),
    );
    await user.click(screen.getByRole("button", { name: "Date range" }));
    await user.type(screen.getByLabelText("From"), "2024-01-01T10:00");
    await user.type(screen.getByLabelText("To"), "2024-12-31T18:00");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    await waitFor(() => {
      expect(getChildren).toHaveBeenLastCalledWith({
        query: `parent-id:${parentId} status:failed type:ExecuteScriptRequest created-after:2024-01-01T10:00 created-before:2024-12-31T18:00`,
        limit: "20",
        offset: "0",
      });
    });
    for (const label of ["Type", "From", "To"]) {
      const chip = screen
        .getByText(new RegExp(`^${label}:`))
        .closest(".p-chip");
      assert(chip instanceof HTMLElement);
      await user.click(
        within(chip).getByRole("button", {
          name: new RegExp(`^Dismiss ${label}:`),
        }),
      );
    }
    await waitFor(() => {
      expect(getChildren).toHaveBeenLastCalledWith({
        query: `parent-id:${parentId} status:failed`,
        limit: "20",
        offset: "0",
      });
    });
    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(screen.getByRole("button", { name: "Type" }));
    await user.click(
      await screen.findByRole("button", { name: "ExecuteScriptRequest" }),
    );
    await user.click(screen.getByRole("button", { name: "Clear all filters" }));
    await waitFor(() => {
      expect(getChildren).toHaveBeenLastCalledWith({
        query: `parent-id:${parentId}`,
        limit: "20",
        offset: "0",
      });
    });
  });

  it("enables actions for selected children and sends only their IDs", async () => {
    const user = userEvent.setup();
    const redo = vi.fn();
    server.use(
      http.post(`${API_URL}activities/reapply`, async ({ request }) => {
        redo(await request.json());
        return HttpResponse.json([children[0]?.id]);
      }),
    );
    renderWithProviders(<ActivitiesPanelList parentId={parentId} />);
    await screen.findByRole("table");
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(
      screen.getByRole("checkbox", { name: "Child activity 1" }),
    );
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(screen.getByRole("button", { name: "Redo" }));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Redo" }),
    );
    await waitFor(() => {
      expect(redo).toHaveBeenCalledWith({ activity_ids: [children[0]?.id] });
    });
  });

  it("includes the additional search help terms for children", async () => {
    renderWithProviders(<ActivitiesPanelList parentId={parentId} />);
    await screen.findByRole("table");
    await userEvent.click(screen.getByRole("button", { name: "Help" }));
    const help = screen.getByRole("dialog", { name: "Search help" });
    expect(help).toHaveTextContent("computer:<criteria>");
    expect(help).toHaveTextContent("type:<type>");
  });

  it("opens and completes exports locally without changing the underlying URL", async () => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(true);
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <ActivitiesPanelList parentId={parentId} />
        <LocationDisplay />
      </>,
      undefined,
      "/activities?query=underlying-page",
    );
    await user.click(
      await screen.findByRole("checkbox", { name: "Child activity 1" }),
    );
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(
      screen.getByRole("button", { name: "Export selection as TSV" }),
    );
    const exportName = await screen.findByRole("textbox", {
      name: "Export name",
    });
    const exportPanel = exportName.closest("aside");
    assert(exportPanel);
    expect(exportPanel).not.toHaveClass(sidePanelClasses.medium);
    expect(exportPanel).not.toHaveClass(sidePanelClasses.large);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(
      screen.queryByRole("textbox", { name: "Export name" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(
      screen.getByRole("button", { name: "Export selection as TSV" }),
    );
    await user.type(
      await screen.findByRole("textbox", { name: "Export name" }),
      "Selected children",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "ID" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(
      await screen.findByRole("button", { name: "Generate TSV" }),
    );
    expect(
      await screen.findByText("TSV export in progress"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Export name" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent(
      "/activities?query=underlying-page",
    );
  });

  it("exports all filtered activities when select all is chosen", async () => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(true);
    const exportRequest = vi.fn();
    server.use(
      http.post(`${API_URL}activities/exports`, async ({ request }) => {
        exportRequest(await request.json());
        return HttpResponse.json({ id: 8 }, { status: 201 });
      }),
    );
    const user = userEvent.setup();
    renderWithProviders(
      <ActivitiesPanelList status="unapproved" />,
      undefined,
      "/overview",
    );

    const [firstChild] = children;
    assert(firstChild);
    await user.click(
      await screen.findByRole("checkbox", { name: firstChild.summary }),
    );
    await user.click(
      screen.getByRole("button", { name: "Select all 21 activities" }),
    );
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(
      screen.getByRole("button", { name: "Export selection as TSV" }),
    );
    await user.type(
      await screen.findByRole("textbox", { name: "Export name" }),
      "All overview activities",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "ID" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(
      await screen.findByRole("button", { name: "Generate TSV" }),
    );

    await waitFor(() => {
      expect(exportRequest).toHaveBeenCalledWith(
        expect.objectContaining({ query: "status:unapproved" }),
      );
    });
  });

  it.each([
    {
      status: "unapproved",
      hiddenActions: ["Redo"],
      visibleActions: ["Approve", "Cancel"],
    },
    {
      status: "delivered",
      hiddenActions: ["Approve", "Redo"],
      visibleActions: ["Cancel"],
    },
    {
      status: "failed",
      hiddenActions: [],
      visibleActions: ["Approve", "Cancel", "Redo"],
    },
  ])(
    "shows the provided actions for $status activities",
    async ({ status, hiddenActions, visibleActions }) => {
      const panelActivities = children.map((activity) => ({
        ...activity,
        activity_status: status as "unapproved" | "delivered",
        actions: {
          approvable: true,
          cancelable: true,
          reappliable: true,
        },
      }));
      server.use(
        http.get(`${API_URL}activities`, ({ request }) => {
          const { searchParams } = new URL(request.url);
          return HttpResponse.json(
            generatePaginatedResponse({
              data: panelActivities,
              limit: Number(searchParams.get("limit")),
              offset: Number(searchParams.get("offset")),
            }),
          );
        }),
      );
      const user = userEvent.setup();
      const [firstActivity] = panelActivities;
      assert(firstActivity);
      renderWithProviders(
        <ActivitiesPanelList
          status={status}
          availableActions={{
            approve: status !== "delivered",
            cancel: true,
            redo: status !== "unapproved" && status !== "delivered",
          }}
        />,
        undefined,
        "/overview",
      );

      await user.click(
        await screen.findByRole("checkbox", { name: firstActivity.summary }),
      );
      await user.click(screen.getByRole("button", { name: "Actions" }));

      for (const action of hiddenActions) {
        expect(
          screen.queryByRole("button", { name: action }),
        ).not.toBeInTheDocument();
      }
      for (const action of visibleActions) {
        expect(
          screen.getByRole("button", { name: action }),
        ).toBeInTheDocument();
      }
    },
  );
});
