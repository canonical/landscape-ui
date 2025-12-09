import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import SearchPrompt from "./SearchPrompt";

describe("SearchPrompt", () => {
  const defaultProps: ComponentProps<typeof SearchPrompt> = {
    onSearchSave: vi.fn(),
    search: "status:running",
  };

  it("should render search prompt with search text", () => {
    renderWithProviders(<SearchPrompt {...defaultProps} />);

    expect(screen.getByText("Search for")).toBeInTheDocument();
    expect(screen.getByText(defaultProps.search)).toBeInTheDocument();
  });

  it("should render save search button", () => {
    renderWithProviders(<SearchPrompt {...defaultProps} />);

    const saveButton = screen.getByRole("button", { name: "Save search" });
    expect(saveButton).toBeInTheDocument();
  });

  it("should not render when search is empty", () => {
    renderWithProviders(<SearchPrompt {...defaultProps} search="" />);

    expect(screen.queryByText("Search for")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Save search" }),
    ).not.toBeInTheDocument();
  });

  it("should render search query in special formatting", () => {
    renderWithProviders(<SearchPrompt {...defaultProps} />);

    const searchQuery = screen.getByText(defaultProps.search);
    expect(searchQuery).toHaveClass("p-search-and-filter__search-query");
  });
});
