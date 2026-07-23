import * as Constants from "@/constants";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import ActivitiesPage from "./ActivitiesPage";

describe("ActivitiesPage", () => {
  beforeEach(() => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(false);
    setEndpointStatus("default");
  });

  it("renders activities page content with list data", async () => {
    renderWithProviders(<ActivitiesPage />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: "Activities" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByText("No activities found")).not.toBeInTheDocument();
  });

  it("shows empty state when activities endpoint is empty", async () => {
    setEndpointStatus({ status: "empty", path: "activities" });

    renderWithProviders(<ActivitiesPage />);

    await expectLoadingState();

    expect(screen.getByText("No activities found")).toBeInTheDocument();
    expect(
      screen.getByText("There are no activities yet."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("does not show the export panel for a stale export side path", async () => {
    renderWithProviders(<ActivitiesPage />, {}, "/?sidePath=export");

    await expectLoadingState();

    expect(
      screen.queryByRole("button", { name: "Generate TSV" }),
    ).not.toBeInTheDocument();
  });
});
