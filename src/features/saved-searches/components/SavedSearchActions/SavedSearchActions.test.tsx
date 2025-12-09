import { savedSearch } from "@/tests/mocks/savedSearches";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import SavedSearchActions from "./SavedSearchActions";

describe("SavedSearchActions", () => {
  const defaultProps: ComponentProps<typeof SavedSearchActions> = {
    savedSearch,
  };

  it("should render edit and remove buttons", () => {
    renderWithProviders(<SavedSearchActions {...defaultProps} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    const removeButton = screen.getByRole("button", { name: /remove/i });
    expect(removeButton).toBeInTheDocument();

    const editButton = screen.getByRole("button", { name: /edit/i });
    expect(editButton).toBeInTheDocument();
  });
});
