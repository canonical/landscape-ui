import * as Constants from "@/constants";
import { MANAGE_INSTANCES_DOCUMENTATION_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import InstancesPage from "./InstancesPage";

describe("InstancesPage", () => {
  beforeEach(() => {
    vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(true);
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

  it("opens registration information from the icon button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    const button = screen.getByRole("button", {
      name: "New instance registration information",
    });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Account name:/)).toBeInTheDocument();
    expect(screen.getByRole("link", {
      name: "Learn how to register new instances to your Landscape organization",
    })).toHaveAttribute("href", MANAGE_INSTANCES_DOCUMENTATION_URL);
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
    vi.restoreAllMocks();
    vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(false);

    renderWithProviders(<InstancesPage />, {}, "/?sidePath=report");

    await expectLoadingState();

    expect(
      screen.queryByRole("heading", { name: /instance summary report/i }),
    ).not.toBeInTheDocument();
  });
});
