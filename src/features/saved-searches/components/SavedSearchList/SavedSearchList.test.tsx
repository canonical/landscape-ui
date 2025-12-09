import { savedSearches } from "@/tests/mocks/savedSearches";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import SavedSearchList from "./SavedSearchList";

describe("SavedSearchList", () => {
  const user = userEvent.setup();

  const defaultProps: ComponentProps<typeof SavedSearchList> = {
    onSavedSearchClick: vi.fn(),
    savedSearches,
    onManageSearches: vi.fn(),
    onSavedSearchRemove: vi.fn(),
  };

  it("should render saved searches list", () => {
    renderWithProviders(<SavedSearchList {...defaultProps} />);

    expect(screen.getByText("Saved searches")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Manage" })).toBeInTheDocument();

    savedSearches.forEach((search) => {
      expect(screen.getByText(search.title)).toBeInTheDocument();
    });
  });

  it("should render nothing when savedSearches is empty", () => {
    renderWithProviders(
      <SavedSearchList {...defaultProps} savedSearches={[]} />,
    );

    expect(screen.queryByText("Saved searches")).not.toBeInTheDocument();
  });

  it("should call onSavedSearchClick when a search is clicked", async () => {
    const onSavedSearchClick = vi.fn();

    renderWithProviders(
      <SavedSearchList
        {...defaultProps}
        onSavedSearchClick={onSavedSearchClick}
      />,
    );

    const firstSearchButton = screen.getByText(savedSearches[0].title);
    await user.click(firstSearchButton);

    expect(onSavedSearchClick).toHaveBeenCalledWith(savedSearches[0]);
  });

  it("should open 'manage saved searches' side panel when manage button is clicked", async () => {
    const onManageSearches = vi.fn();

    renderWithProviders(
      <SavedSearchList {...defaultProps} onManageSearches={onManageSearches} />,
    );

    const manageButton = screen.getByRole("button", { name: "Manage" });
    await user.click(manageButton);

    expect(onManageSearches).toHaveBeenCalled();
  });

  it("should render search queries for each saved search", () => {
    renderWithProviders(<SavedSearchList {...defaultProps} />);

    savedSearches.forEach((search) => {
      expect(screen.getByText(search.search)).toBeInTheDocument();
    });
  });

  it("should render remove and edit buttons for each saved search", () => {
    renderWithProviders(<SavedSearchList {...defaultProps} />);

    const removeButtons = screen.getAllByRole("button", {
      name: /remove/i,
    });
    const editButtons = screen.getAllByRole("button", {
      name: /edit/i,
    });

    expect(editButtons).toHaveLength(savedSearches.length);
    expect(removeButtons).toHaveLength(savedSearches.length);
  });
});
