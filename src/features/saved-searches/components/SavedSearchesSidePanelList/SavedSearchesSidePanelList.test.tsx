import { savedSearches } from "@/tests/mocks/savedSearches";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import SavedSearchesSidePanelList from "./SavedSearchesSidePanelList";

describe("SavedSearchesSidePanelList", () => {
  const defaultProps: ComponentProps<typeof SavedSearchesSidePanelList> = {
    savedSearches,
  };

  it("should render table with saved searches", () => {
    renderWithProviders(<SavedSearchesSidePanelList {...defaultProps} />);

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Search Query")).toBeInTheDocument();

    savedSearches.forEach((search) => {
      expect(screen.getByText(search.title)).toBeInTheDocument();
    });
  });

  it("should render action buttons for each search", () => {
    renderWithProviders(<SavedSearchesSidePanelList {...defaultProps} />);

    const removeButtons = screen.getAllByRole("button", {
      name: /remove/i,
    });
    const editButtons = screen.getAllByRole("button", {
      name: /edit/i,
    });

    expect(editButtons).toHaveLength(savedSearches.length);
    expect(removeButtons).toHaveLength(savedSearches.length);
  });

  it("should render empty message when no saved searches", () => {
    renderWithProviders(
      <SavedSearchesSidePanelList {...defaultProps} savedSearches={[]} />,
    );

    expect(screen.getByText("No saved searches found.")).toBeInTheDocument();
  });
});
