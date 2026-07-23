import * as Constants from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
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
