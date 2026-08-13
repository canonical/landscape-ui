import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import ManageSavedSearchesSidePanel from "./ManageSavedSearchesSidePanel";

// Warm the module cache up front so React.lazy resolves instantly instead of
// paying the first-hit transform/evaluate cost mid-assertion.
beforeAll(async () => {
  await import("@/features/saved-searches/components/SavedSearchForm");
});

describe("ManageSavedSearchesSidePanel", () => {
  it("should render add saved search button", async () => {
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    const createButton = await screen.findByRole("button", {
      name: "Add saved search",
    });
    expect(createButton).toBeInTheDocument();
  });

  it("should render saved searches table", async () => {
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Search Query")).toBeInTheDocument();
  });

  it("should open the create form side panel when Add saved search is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    const createButton = await screen.findByRole("button", {
      name: "Add saved search",
    });
    await user.click(createButton);

    expect(
      await screen.findByRole("heading", { name: "Add saved search" }),
    ).toBeInTheDocument();
  });

  it("should navigate back to manage panel when back button is clicked in create form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    const createButton = await screen.findByRole("button", {
      name: "Add saved search",
    });
    await user.click(createButton);

    await screen.findByRole("heading", { name: "Add saved search" });
    const backButton = await screen.findByRole("button", { name: /back/i });
    await user.click(backButton);

    expect(
      await screen.findByRole("heading", { name: "Manage saved searches" }),
    ).toBeInTheDocument();
  });

  it("should show pagination controls and support page navigation when many saved searches exist", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    await screen.findByRole("table");

    const nextButton = await screen.findByRole("button", { name: /next/i });
    expect(nextButton).toBeInTheDocument();

    await user.click(nextButton);

    const prevButton = screen.getByRole("button", { name: /previous/i });
    expect(prevButton).toBeInTheDocument();
  });

  it("should update page size when page size selector is changed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    await screen.findByRole("table");

    const pageSizeSelect = await screen.findByRole("combobox", {
      name: /instances per page/i,
    });
    await user.selectOptions(pageSizeSelect, "50");

    expect(pageSizeSelect).toHaveValue("50");
  });
});
