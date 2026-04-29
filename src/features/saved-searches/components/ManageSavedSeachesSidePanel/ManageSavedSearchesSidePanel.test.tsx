import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ManageSavedSearchesSidePanel from "./ManageSavedSearchesSidePanel";

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
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    const createButton = await screen.findByRole("button", {
      name: "Add saved search",
    });
    await userEvent.click(createButton);

    expect(
      await screen.findByRole("heading", { name: "Add saved search" }),
    ).toBeInTheDocument();
  });

  it("should navigate back to manage panel when back button is clicked in create form", async () => {
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    const createButton = await screen.findByRole("button", {
      name: "Add saved search",
    });
    await userEvent.click(createButton);

    const backButton = await screen.findByRole("button", { name: /back/i });
    await userEvent.click(backButton);

    expect(
      await screen.findByRole("heading", { name: "Manage saved searches" }),
    ).toBeInTheDocument();
  });

  it("should show pagination controls and support page navigation when many saved searches exist", async () => {
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    await screen.findByRole("table");

    const nextButton = await screen.findByRole("button", { name: /next/i });
    expect(nextButton).toBeInTheDocument();

    await userEvent.click(nextButton);

    const prevButton = screen.getByRole("button", { name: /previous/i });
    expect(prevButton).toBeInTheDocument();
  });

  it("should update page size when page size selector is changed", async () => {
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    await screen.findByRole("table");

    const pageSizeSelect = await screen.findByRole("combobox", {
      name: /instances per page/i,
    });
    await userEvent.selectOptions(pageSizeSelect, "50");

    expect(pageSizeSelect).toHaveValue("50");
  });
});
