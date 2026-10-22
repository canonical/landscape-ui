import * as Constants from "@/constants";
import { screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import userEvent from "@testing-library/user-event";
import ActivitiesPage from "./ActivitiesPage";

describe("ActivitiesPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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
    setEndpointStatus({ status: "empty", path: "activities/parents" });

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

  it("allows exporting selected parents without offering mutation actions", async () => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(true);
    const user = userEvent.setup();
    renderWithProviders(<ActivitiesPage />);

    const exportButton = await screen.findByRole("button", {
      name: "Export selection as TSV",
    });
    expect(exportButton).toHaveAttribute("aria-disabled", "true");
    for (const name of ["Approve", "Cancel", "Redo"]) {
      expect(screen.queryByRole("button", { name })).not.toBeInTheDocument();
    }

    await user.click(screen.getByRole("checkbox", { name: "Toggle all" }));
    expect(exportButton).not.toHaveAttribute("aria-disabled");
    expect(exportButton).toBeEnabled();
    await user.click(exportButton);

    expect(
      await screen.findByRole("textbox", { name: "Export name" }),
    ).toBeInTheDocument();
  });
});
