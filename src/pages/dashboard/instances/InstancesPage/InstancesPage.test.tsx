import * as Constants from "@/constants";
import { API_URL, MANAGE_INSTANCES_DOCUMENTATION_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { features } from "@/tests/mocks/features";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
  });

  it("opens registration information on focus and closes on blur", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    const button = screen.getByRole("button", {
      name: /New instance registration information, documentation link available/,
    });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.tab();

    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByText(/Account name:/)).toBeInTheDocument();

    const link = screen.getByRole("link", {
      name: "Learn how to register new instances to your Landscape organization (opens a new tab to Landscape documentation)",
    });
    expect(link).toHaveAttribute("href", MANAGE_INSTANCES_DOCUMENTATION_URL);

    await user.tab();

    expect(link).toHaveFocus();
    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.tab();

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/Account name:/)).not.toBeInTheDocument();
  });

  it("opens registration information on hover and closes on mouse leave", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    const button = screen.getByRole("button", {
      name: /New instance registration information, documentation link available/,
    });

    await user.hover(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByText(/Account name:/)).toBeInTheDocument();

    await user.unhover(button);

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/Account name:/)).not.toBeInTheDocument();
  });

  it("closes registration information when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    const button = screen.getByRole("button", {
      name: /New instance registration information, documentation link available/,
    });

    await user.tab();

    expect(await screen.findByText(/Account name:/)).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/Account name:/)).not.toBeInTheDocument();
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
