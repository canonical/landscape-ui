import { expectLoadingState } from "@/tests/helpers";
import { activities } from "@/tests/mocks/activity";
import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { API_URL } from "@/constants";
import { describe, expect, it } from "vitest";
import ActivityDetails from "./ActivityDetails";
import type { Creator } from "@/types/Creator";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";

describe("ActivityDetails", () => {
  it.each([
    { action: "Approve", confirm: "Approve", success: "approved" },
    { action: "Cancel", confirm: "Confirm", success: "canceled" },
    { action: "Redo", confirm: "Redo", success: "redone" },
  ])(
    "closes only the nested child after $action succeeds",
    async ({ action, confirm, success }) => {
      const user = userEvent.setup();
      const [source, child] = activities;
      const group = { ...source, type: "ActivityGroup", result_text: null };
      server.use(
        http.get(`${API_URL}activities/:id`, ({ params }) =>
          HttpResponse.json(Number(params.id) === group.id ? group : child),
        ),
        http.get(`${API_URL}activities`, () =>
          HttpResponse.json({ results: [child], count: 1 }),
        ),
      );
      renderWithProviders(<ActivityDetails activityId={group.id} />);
      await user.click(
        await screen.findByRole("button", { name: child.summary }),
      );
      const childHeading = await screen.findByRole("heading", {
        name: child.summary,
      });
      const panel = childHeading.closest("aside");
      assert(panel);
      await user.click(
        await within(panel).findByRole("button", { name: action }),
      );
      const dialog = screen.getByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: confirm }));
      expect(
        await screen.findByText(
          `You have successfully ${success} an activity.`,
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: child.summary }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole("table")).toBeInTheDocument();
    },
  );

  it("renders the paginated children table with the Instance column", async () => {
    const user = userEvent.setup();
    const children = Array.from({ length: 21 }, (_, index) => ({
      ...activities[1],
      id: activities.length + index,
      summary: `Child activity ${index + 1}`,
    }));
    const parentActivity = {
      ...activities[0],
      type: "ActivityGroup",
      result_text: null,
      children,
    };

    server.use(
      http.get(`${API_URL}activities`, ({ request }) => {
        const { searchParams } = new URL(request.url);
        return HttpResponse.json(
          generatePaginatedResponse({
            data: children,
            limit: Number(searchParams.get("limit")),
            offset: Number(searchParams.get("offset")),
          }),
        );
      }),
      http.get(`${API_URL}activities/:id`, () =>
        HttpResponse.json(parentActivity),
      ),
    );

    renderWithProviders(<ActivityDetails activityId={parentActivity.id} />);
    await expectLoadingState();
    expect(
      screen.getByRole("heading", { name: "Activities" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();

    let table = await screen.findByRole("table");
    expect(
      within(table).getByRole("columnheader", {
        name: /^Toggle all\s*Activity$/,
      }),
    ).toBeInTheDocument();
    expect(within(table).getByText("Instance")).toBeInTheDocument();
    expect(
      within(table).getByRole("button", { name: "Child activity 1" }),
    ).toBeInTheDocument();
    expect(
      within(table).queryByRole("button", { name: "Child activity 21" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next page" }));

    table = await screen.findByRole("table");
    expect(
      within(table).getByRole("button", { name: "Child activity 21" }),
    ).toBeInTheDocument();
  });

  it("shows an Activities block and empty state for a group without children or output", async () => {
    const group = {
      ...activities[0],
      type: "ActivityGroup",
      children: [],
      result_text: null,
    };
    server.use(
      http.get(`${API_URL}activities/:id`, () => HttpResponse.json(group)),
      http.get(`${API_URL}activities`, () =>
        HttpResponse.json({
          results: [],
          count: 0,
          next: null,
          previous: null,
        }),
      ),
    );
    renderWithProviders(<ActivityDetails activityId={group.id} />);

    expect(
      await screen.findByRole("heading", { name: "Activities" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(
      await screen.findByText("There are no activities yet."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("shows group output only when its Output tab is selected", async () => {
    const user = userEvent.setup();
    const group = {
      ...activities[0],
      type: "ActivityGroup",
      result_text: "Group output",
    };
    server.use(
      http.get(`${API_URL}activities/:id`, () => HttpResponse.json(group)),
      http.get(`${API_URL}activities`, () =>
        HttpResponse.json({
          results: [],
          count: 0,
          next: null,
          previous: null,
        }),
      ),
    );
    renderWithProviders(<ActivityDetails activityId={group.id} />);
    await screen.findByRole("tab", { name: "Activities" });
    expect(screen.queryByText("Group output")).not.toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Output" }));
    expect(screen.getByText("Group output")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Activities" }));
    expect(screen.queryByText("Group output")).not.toBeInTheDocument();
  });

  it("preserves child-table search and pagination when switching tabs", async () => {
    const user = userEvent.setup();
    const group = {
      ...activities[0],
      type: "ActivityGroup",
      result_text: "Group output",
    };
    const children = Array.from({ length: 21 }, (_, index) => ({
      ...activities[1],
      id: activities.length + index,
      summary: `Child activity ${index + 1}`,
    }));
    server.use(
      http.get(`${API_URL}activities/:id`, () => HttpResponse.json(group)),
      http.get(`${API_URL}activities`, ({ request }) => {
        const { searchParams } = new URL(request.url);
        return HttpResponse.json(
          generatePaginatedResponse({
            data: children,
            limit: Number(searchParams.get("limit")),
            offset: Number(searchParams.get("offset")),
          }),
        );
      }),
    );
    renderWithProviders(<ActivityDetails activityId={group.id} />);
    await screen.findByRole("table");
    await user.type(screen.getByRole("searchbox"), "status:succeeded");
    await user.click(screen.getByRole("button", { name: "Search" }));
    await screen.findByRole("table");
    await user.click(screen.getByRole("button", { name: "Next page" }));
    await screen.findByRole("button", { name: "Child activity 21" });
    await user.click(screen.getByRole("tab", { name: "Output" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Activities" }));
    expect(screen.getByRole("searchbox")).toHaveValue("status:succeeded");
    expect(
      screen.getByRole("button", { name: "Child activity 21" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Child activity 1" }),
    ).not.toBeInTheDocument();
  });

  it("renders activity details with all information", async () => {
    const [activity] = activities;

    renderWithProviders(<ActivityDetails activityId={activity.id} />);
    await expectLoadingState();

    expect(screen.queryByText("Description")).not.toBeInTheDocument();
    expect(screen.queryByText(activity.summary)).not.toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("Created at")).toBeInTheDocument();
    if (activity.delivery_time) {
      expect(screen.getByText("Delivered at")).toBeInTheDocument();
    }
  });

  it("renders instance link when computer_id is present", async () => {
    const [activity] = activities;
    const expectedInstance = instances.find(
      (i) => i.id === activity.computer_id,
    );

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    if (expectedInstance) {
      await screen.findByText(expectedInstance.title);
      expect(screen.getByText("Instance")).toBeInTheDocument();
      expect(screen.getByText(expectedInstance.title)).toBeInTheDocument();
    }
  });

  it("hides the instance field when hideInstanceField is true", async () => {
    const [activity] = activities;

    renderWithProviders(
      <ActivityDetails activityId={activity.id} hideInstanceField />,
    );

    await expectLoadingState();

    expect(screen.queryByText("Instance")).not.toBeInTheDocument();
  });

  it("renders the activity creator when present", async () => {
    const activity = activities.find(
      (a): a is typeof a & { creator: Creator } => a.creator !== null,
    );

    assert(activity);

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    const creatorLabel = screen.getByText("Creator");
    expect(creatorLabel).toBeInTheDocument();

    const creatorContainer = creatorLabel.parentElement;
    assert(creatorContainer);

    expect(
      within(creatorContainer).getByText(activity.creator.name),
    ).toBeInTheDocument();
  });

  it("renders no-data text when activity creator is not present", async () => {
    const activity = activities.find(({ creator }) => creator === null);

    assert(activity);

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    const creatorLabel = screen.getByText("Creator");
    expect(creatorLabel).toBeInTheDocument();

    const creatorContainer = creatorLabel.parentElement;
    assert(creatorContainer);

    expect(
      within(creatorContainer).getByText(NO_DATA_TEXT),
    ).toBeInTheDocument();
  });

  it("renders output when result_text is present", async () => {
    const activity = activities.find((a) => a.result_text !== null);
    assert(activity);

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    expect(screen.getByRole("heading", { name: "Output" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "General" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("does not render output when result_text is null", async () => {
    const activity = activities.find((a) => a.result_text === null);
    assert(activity);

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    expect(screen.queryByText("Output")).not.toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("does not render completed at when completion_time is null", async () => {
    const activity = activities.find((a) => a.completion_time === null);
    assert(activity);

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    expect(screen.queryByText("Completed at")).not.toBeInTheDocument();
  });

  it("renders ActivityDetailsButtons component", async () => {
    const [activity] = activities;

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    if (activity.actions?.approvable) {
      expect(screen.getByText("Approve")).toBeInTheDocument();
    }
    if (activity.actions?.cancelable) {
      expect(screen.getByText(/Cancel/)).toBeInTheDocument();
    }
  });

  it("renders activity with completion time when present", async () => {
    const activityWithCompletion = activities.find(
      (a) => a.completion_time !== null,
    );
    assert(activityWithCompletion);

    renderWithProviders(
      <ActivityDetails activityId={activityWithCompletion.id} />,
    );

    await expectLoadingState();

    expect(screen.getByText("Completed at")).toBeInTheDocument();
  });
});
