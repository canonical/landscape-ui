import { API_URL } from "@/constants";
import * as Constants from "@/constants";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { activities } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ActivityChildren from "./ActivityChildren";
import { ErrorBoundary } from "@sentry/react";
import { HttpStatusCode } from "axios";

const parentId = activities[0].id;
const children = Array.from({ length: 21 }, (_, index) => ({
  ...activities[1],
  id: index + 1,
  parent_id: parentId,
  summary: `Child activity ${index + 1}`,
}));
const getChildren = vi.fn();

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

  it("surfaces an API failure through the panel error boundary", async () => {
    server.use(
      http.get(`${API_URL}activities`, () =>
        HttpResponse.json(
          { error: "InternalServerError", message: "Activities unavailable" },
          { status: HttpStatusCode.InternalServerError },
        ),
      ),
    );
    renderWithProviders(
      <ErrorBoundary fallback={<p>Activities unavailable</p>}>
        <ActivityChildren
          activityId={parentId}
          onActivityDetailsOpen={vi.fn()}
        />
      </ErrorBoundary>,
    );
    expect(
      await screen.findByText("Activities unavailable"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("keeps searches scoped to the parent without changing page filters", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <ActivityChildren
          activityId={parentId}
          onActivityDetailsOpen={vi.fn()}
        />
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

  it("applies local status, type, and date filters and can clear them", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ActivityChildren
        activityId={parentId}
        onActivityDetailsOpen={vi.fn()}
      />,
    );
    await screen.findByRole("table");
    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(screen.getByRole("button", { name: "Status" }));
    await user.click(screen.getByRole("button", { name: "Failed" }));
    await user.click(screen.getByRole("button", { name: "Type" }));
    await user.click(
      await screen.findByRole("button", { name: "ExecuteScriptRequest" }),
    );
    await user.click(screen.getByRole("button", { name: "Date range" }));
    fireEvent.change(screen.getByLabelText("From"), {
      target: { value: "2024-01-01T10:00" },
    });
    fireEvent.change(screen.getByLabelText("To"), {
      target: { value: "2024-12-31T18:00" },
    });
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
      await user.click(within(chip).getByRole("button", { name: "Dismiss" }));
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
    renderWithProviders(
      <ActivityChildren
        activityId={parentId}
        onActivityDetailsOpen={vi.fn()}
      />,
    );
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

  it("opens children locally and includes the additional search help terms", async () => {
    const user = userEvent.setup();
    const openDetails = vi.fn();
    renderWithProviders(
      <ActivityChildren
        activityId={parentId}
        onActivityDetailsOpen={openDetails}
      />,
    );
    await user.click(
      await screen.findByRole("button", { name: "Child activity 1" }),
    );
    expect(openDetails).toHaveBeenCalledWith(children[0]);
    await user.click(screen.getByRole("button", { name: "Help" }));
    const help = screen.getByRole("dialog", { name: "Search help" });
    expect(help).toHaveTextContent("computer:<criteria>");
    expect(help).toHaveTextContent("type:<type>");
  });

  it("opens and completes exports locally without changing the underlying URL", async () => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(true);
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <ActivityChildren
          activityId={parentId}
          onActivityDetailsOpen={vi.fn()}
        />
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
    await screen.findByRole("textbox", { name: "Export name" });
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
    await user.click(screen.getByRole("tab", { name: /primary identity/i }));
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
});
