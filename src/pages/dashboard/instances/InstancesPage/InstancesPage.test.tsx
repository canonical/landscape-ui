import * as Constants from "@/constants";
import {
  API_URL,
  API_URL_OLD,
  MANAGE_INSTANCES_DOCUMENTATION_URL,
} from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { features } from "@/tests/mocks/features";
import { pendingInstances, ubuntuInstance } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import {
  generatePaginatedResponse,
  isAction,
} from "@/tests/server/handlers/_helpers";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import InstancesPage from "./InstancesPage";

describe("InstancesPage", () => {
  beforeEach(() => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(false);
    setEndpointStatus("default");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders instances page content with list data", async () => {
    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: "Instances" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByText("No instances found")).not.toBeInTheDocument();
    expect(
      await screen.findAllByRole("button", {
        name: "Review Pending Instances",
      }),
    ).toHaveLength(1);
  });

  it("shows the account name and registration documentation link", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    const trigger = screen.getByRole("button", {
      name: /New instance registration information/,
    });

    await user.hover(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const messageId = trigger.getAttribute("aria-controls");
    assert(messageId);
    const message = document.getElementById(messageId);
    assert(message);

    expect(message).toHaveTextContent(/Account name: \S+/);
    expect(
      within(message).getByRole("link", {
        name: "Learn how to register new instances to your Landscape organization (opens a new tab to Landscape documentation)",
      }),
    ).toHaveAttribute("href", MANAGE_INSTANCES_DOCUMENTATION_URL);
  });

  it("shows empty state when instances endpoint is empty", async () => {
    setEndpointStatus({ status: "empty", path: "computers" });

    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    expect(screen.getByText("No instances found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You don't have any instances registered to Landscape yet.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("allows approving pending instances from the empty state", async () => {
    let approved = false;
    server.use(
      http.get(`${API_URL}computers`, () =>
        HttpResponse.json(
          generatePaginatedResponse({
            data: approved ? [ubuntuInstance] : [],
            offset: 0,
            limit: 20,
          }),
        ),
      ),
      http.get(API_URL_OLD, ({ request }) => {
        if (isAction(request, "GetPendingComputers")) {
          return HttpResponse.json(approved ? [] : pendingInstances);
        }

        if (!isAction(request, "AcceptPendingComputers")) {
          return;
        }

        approved = true;
        return HttpResponse.json(pendingInstances);
      }),
    );
    const user = userEvent.setup();

    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    expect(screen.getByText("No instances found")).toBeInTheDocument();
    const reviewButtons = await screen.findAllByRole("button", {
      name: "Review Pending Instances",
    });
    expect(reviewButtons).toHaveLength(1);
    const [reviewButton] = reviewButtons;
    assert(reviewButton);
    await user.click(reviewButton);

    expect(
      await screen.findByRole("heading", {
        name: "Review Pending Instances",
      }),
    ).toBeInTheDocument();
    const table = await screen.findByRole("table");
    const [selectAll] = within(table).getAllByRole("checkbox");
    assert(selectAll);
    await user.click(selectAll);
    await user.click(screen.getByRole("button", { name: "Approve" }));

    expect(
      await screen.findByRole("combobox", { name: "Access group" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Approve" }));

    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Approve" }));

    expect(
      await screen.findByText(/You have approved \d+ pending instances/),
    ).toBeInTheDocument();
    const registeredInstancesTable = await screen.findByRole("table");
    expect(
      within(registeredInstancesTable).getByRole("row", {
        name: `${ubuntuInstance.title} instance row`,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("No instances found")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Review Pending Instances" }),
    ).not.toBeInTheDocument();
  });

  it("does not show the report panel for a stale report side path when feature is disabled", async () => {
    server.use(
      http.get(`${API_URL}features`, () =>
        HttpResponse.json(
          generatePaginatedResponse({
            data: features.map((feature) =>
              feature.key === "instance-reports"
                ? { ...feature, enabled: false }
                : feature,
            ),
            offset: 0,
            limit: 20,
          }),
        ),
      ),
    );

    renderWithProviders(<InstancesPage />, {}, "/?sidePath=report");

    await expectLoadingState();

    expect(
      screen.queryByRole("heading", { name: /instance summary report/i }),
    ).not.toBeInTheDocument();
  });

  it("does not show the export panel for a stale export side path", async () => {
    renderWithProviders(<InstancesPage />, {}, "/?sidePath=export");

    await expectLoadingState();

    expect(
      screen.queryByRole("button", { name: "Generate TSV" }),
    ).not.toBeInTheDocument();
  });
});
