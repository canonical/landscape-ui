import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { activities } from "@/tests/mocks/activity";
import { windowsInstance } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { ErrorBoundary } from "@sentry/react";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getActivitiesQuery, isFiltering } from "./helpers";
import SupportInstanceActivities from "./SupportInstanceActivities";

const ACME = "acme";

const NO_FILTERS = {
  query: "",
  status: "",
  type: "",
  fromDate: "",
  toDate: "",
};

// The instance the activity fixtures belong to.
const instanceActivities = activities.filter(
  ({ computer_id }) => computer_id === windowsInstance.id,
);
const [activity] = instanceActivities;

const renderActivities = (instance = windowsInstance, search = "") => {
  setStaffGlobalRoles(["SupportProvider"]);

  return renderWithProviders(
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <SupportInstanceActivities name={ACME} instance={instance} />
      <LocationDisplay />
    </ErrorBoundary>,
    undefined,
    `/${search}`,
  );
};

describe("SupportInstanceActivities", () => {
  const user = userEvent.setup();

  assert(activity);

  it("lists the instance's activities", async () => {
    renderActivities();

    expect(
      await screen.findByRole("button", { name: activity.summary }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "Instance" }),
    ).not.toBeInTheDocument();
  });

  it("reads the activities of the account and the instance it is given", async () => {
    const requested: URL[] = [];

    server.events.on("request:start", ({ request }) => {
      requested.push(new URL(request.url));
    });

    renderActivities();

    await screen.findByRole("button", { name: activity.summary });

    const prefix = new URL(API_URL, "http://localhost").pathname;
    const list = requested.find(
      ({ pathname }) => pathname === `${prefix}accounts/${ACME}/activities`,
    );

    expect(list?.searchParams.get("query")).toBe(
      `computer:id:${windowsInstance.id}`,
    );
    expect(
      requested.some(({ pathname }) => pathname === `${prefix}activities`),
    ).toBe(false);

    server.events.removeAllListeners("request:start");
  });

  it("offers nothing that changes an activity", async () => {
    renderActivities();

    await screen.findByRole("button", { name: activity.summary });

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    for (const action of ["Approve", "Cancel", "Undo", "Redo", "Export"]) {
      expect(
        screen.queryByRole("button", { name: new RegExp(`^${action}`, "i") }),
      ).not.toBeInTheDocument();
    }
  });

  it("opens an activity's details, without actions", async () => {
    renderActivities();

    await user.click(
      await screen.findByRole("button", { name: activity.summary }),
    );

    const panel = within(await screen.findByRole("complementary"));

    expect(await panel.findByText("Output")).toBeInTheDocument();
    expect(panel.getByText(activity.creator?.name ?? "")).toBeInTheDocument();
    for (const action of ["Approve", "Cancel", "Undo", "Redo"]) {
      expect(
        panel.queryByRole("button", { name: new RegExp(`^${action}`, "i") }),
      ).not.toBeInTheDocument();
    }
  });

  it("searches by the text entered", async () => {
    renderActivities();

    await screen.findByRole("button", { name: activity.summary });

    await user.type(screen.getByRole("searchbox"), "type:Start{Enter}");

    await waitFor(() => {
      expect(getLocationDisplay()).toHaveTextContent("query=type%3AStart");
    });
  });

  it("says so when the instance has no activities", async () => {
    setEndpointStatus({ status: "empty", path: "activities" });

    renderActivities();

    expect(await screen.findByText("No activities found")).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("keeps the filters when a search finds nothing", async () => {
    setEndpointStatus({ status: "empty", path: "activities" });

    renderActivities(windowsInstance, "?query=nothing");

    expect(
      await screen.findByText(
        "No activities found according to your search parameters.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveValue("nothing");
  });

  it("surfaces a failed list request", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    setEndpointStatus({ status: "error", path: "activities" });

    renderActivities();

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });
});

describe("getActivitiesQuery", () => {
  it("is the instance alone without filters", () => {
    expect(getActivitiesQuery(1, NO_FILTERS)).toBe("computer:id:1");
  });

  it("adds each filter as a search term", () => {
    expect(
      getActivitiesQuery(1, {
        query: "creator:jane@example.com",
        status: "failed",
        type: "RebootRequest",
        fromDate: "2024-01-01",
        toDate: "2024-02-01",
      }),
    ).toBe(
      "computer:id:1 creator:jane@example.com status:failed created-after:2024-01-01 created-before:2024-02-01 type:RebootRequest",
    );
  });
});

describe("isFiltering", () => {
  it("is false without filters and true with any", () => {
    expect(isFiltering(NO_FILTERS)).toBe(false);
    expect(isFiltering({ ...NO_FILTERS, status: "failed" })).toBe(true);
  });
});
