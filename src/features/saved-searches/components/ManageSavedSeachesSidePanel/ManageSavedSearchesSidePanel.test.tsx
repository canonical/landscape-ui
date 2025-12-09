import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
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
});
