import * as Constants from "@/constants";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import sidePanelClasses from "@/components/layout/SidePanel/SidePanel.module.scss";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { renderWithProviders } from "@/tests/render";
import { activityParents } from "@/tests/mocks/activity";
import server from "@/tests/server";
import userEvent from "@testing-library/user-event";
import { HttpStatusCode } from "axios";
import { http, HttpResponse } from "msw";
import ActivitiesPage from "./ActivitiesPage";

describe("ActivitiesPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(false);
    setEndpointStatus("default");
  });

  it("renders and paginates 21 activity groups from the default mocks", async () => {
    const user = userEvent.setup();
    const totalCount = 21;
    expect(activityParents).toHaveLength(totalCount);
    renderWithProviders(<ActivitiesPage />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: "Activities" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByText("No activities found")).not.toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(DEFAULT_PAGE_SIZE + 1);
    expect(screen.getByText("Showing 20 of 21 results")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next page" }));
    const lastGroup = activityParents.at(-1);
    assert(lastGroup);
    expect(
      await screen.findByRole("button", { name: lastGroup.summary }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getByText("Showing 1 of 21 results")).toBeInTheDocument();
  });

  it("shows empty state when activities endpoint is empty", async () => {
    setEndpointStatus({ status: "empty", path: "activities/parents" });

    renderWithProviders(<ActivitiesPage />);

    await expectLoadingState();

    expect(screen.getByText("No activities found")).toBeInTheDocument();
    expect(
      screen.getByText("There are no activities yet."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it.each(["all", "filtered", "unfiltered"])(
    "shows an error notification when %s parent requests fail",
    async (failingRequest) => {
      server.use(
        http.get(`${Constants.API_URL}activities/parents`, ({ request }) => {
          const isFiltered = new URL(request.url).searchParams.has("query");
          if (
            failingRequest === "all" ||
            (failingRequest === "filtered" && isFiltered) ||
            (failingRequest === "unfiltered" && !isFiltered)
          ) {
            return HttpResponse.json(
              {
                error: "InternalServerError",
                message: "Activities unavailable",
              },
              { status: HttpStatusCode.InternalServerError },
            );
          }
          return HttpResponse.json({ results: [], count: 0 });
        }),
      );

      renderWithProviders(
        <ActivitiesPage />,
        undefined,
        "/activities?status=failed",
      );

      expect(
        await screen.findByText("Activities unavailable"),
      ).toBeInTheDocument();
    },
  );

  it("keeps the list controls when a filtered request fails after a successful load", async () => {
    const user = userEvent.setup();
    const totalCount = activityParents.length + 1;
    server.use(
      http.get(`${Constants.API_URL}activities/parents`, ({ request }) => {
        if (new URL(request.url).searchParams.has("query")) {
          return HttpResponse.json(
            { error: "InternalServerError", message: "Activities unavailable" },
            { status: HttpStatusCode.InternalServerError },
          );
        }
        return HttpResponse.json({
          results: activityParents,
          count: totalCount,
        });
      }),
    );
    renderWithProviders(<ActivitiesPage />);

    await screen.findByRole("table");
    await user.type(screen.getByRole("searchbox"), "id:10");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(
      await screen.findByText("Activities unavailable"),
    ).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveValue("id:10");
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("does not show the export panel for a stale export side path", async () => {
    renderWithProviders(<ActivitiesPage />, {}, "/?sidePath=export");

    await expectLoadingState();

    expect(
      screen.queryByRole("button", { name: "Generate TSV" }),
    ).not.toBeInTheDocument();
  });

  it("hides actions and selection when TSV exports are disabled", async () => {
    renderWithProviders(<ActivitiesPage />);

    await screen.findByRole("table");

    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    expect(
      screen.queryByRole("button", { name: "Actions" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Export selection as TSV" }),
    ).not.toBeInTheDocument();
    for (const name of ["Approve", "Cancel", "Redo"]) {
      expect(screen.queryByRole("button", { name })).not.toBeInTheDocument();
    }
  });

  it("does not offer selection or export for activity groups when TSV exports are enabled", async () => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(true);
    renderWithProviders(<ActivitiesPage />);

    await screen.findByRole("table");

    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    expect(
      screen.queryByRole("button", { name: "Export selection as TSV" }),
    ).not.toBeInTheDocument();
    for (const name of ["Approve", "Cancel", "Redo"]) {
      expect(screen.queryByRole("button", { name })).not.toBeInTheDocument();
    }
  });

  it("opens activity details through sidePath from the group list", async () => {
    const [activity] = activityParents;
    assert(activity);
    server.use(
      http.get(`${Constants.API_URL}activities/parents`, () =>
        HttpResponse.json({
          results: activityParents,
          count: activityParents.length,
        }),
      ),
      http.get(`${Constants.API_URL}activities/:id`, () =>
        HttpResponse.json({ ...activity, result_text: null }),
      ),
    );
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <ActivitiesPage />
        <LocationDisplay />
      </>,
    );

    await user.click(
      await screen.findByRole("button", { name: activity.summary }),
    );

    const activityHeading = await screen.findByRole("heading", {
      name: activity.summary,
    });
    expect(activityHeading).toBeInTheDocument();
    expect(activityHeading.closest("aside")).toHaveClass(
      sidePanelClasses.large,
    );
    expect(getLocationDisplay()).toHaveTextContent(
      `sidePath=activity&name=${activity.id}`,
    );
  });
});
