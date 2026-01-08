import { savedSearches } from "@/tests/mocks/savedSearches";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import SearchBoxWithSavedSearches from "./SearchBoxWithSavedSearches";

vi.mock("@/features/instances", () => ({
  useInstanceSearchHelpTerms: () => [
    { term: "status:running", description: "Running instances" },
    { term: "alert:offline", description: "Offline instances" },
  ],
}));

describe("SearchBoxWithSavedSearches", () => {
  const user = userEvent.setup();

  const defaultProps: ComponentProps<typeof SearchBoxWithSavedSearches> = {
    onHelpButtonClick: vi.fn(),
  };

  it("should render search box and help button", () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).toBeInTheDocument();

    const helpButton = screen.getByRole("button", { name: "Search help" });
    expect(helpButton).toBeInTheDocument();
  });

  it("should call onHelpButtonClick when help button is clicked", async () => {
    const onHelpButtonClick = vi.fn();

    renderWithProviders(
      <SearchBoxWithSavedSearches
        {...defaultProps}
        onHelpButtonClick={onHelpButtonClick}
      />,
    );

    const helpButton = screen.getByRole("button", { name: "Search help" });
    await user.click(helpButton);

    expect(onHelpButtonClick).toHaveBeenCalled();
  });

  it("should show saved searches in dropdown", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    await screen.findByText("Saved searches");

    savedSearches.forEach((search) => {
      expect(screen.getByText(search.title)).toBeInTheDocument();
    });
  });

  it("should hide dropdown when clicking outside", async () => {
    renderWithProviders(
      <div>
        <SearchBoxWithSavedSearches {...defaultProps} />
        <button>Outside</button>
      </div>,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    expect(await screen.findByText("Saved searches")).toBeInTheDocument();

    const outsideButton = screen.getByRole("button", { name: "Outside" });
    await user.click(outsideButton);

    expect(screen.queryByText("Saved searches")).not.toBeInTheDocument();
  });

  it("should show search prompt when typing in search box", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);
    await user.type(searchBox, "test query");

    expect(await screen.findByText("Search for")).toBeInTheDocument();
    expect(screen.getByText("test query")).toBeInTheDocument();
  });

  it("should show save search button when typing", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);
    await user.type(searchBox, "test query");

    expect(
      await screen.findByRole("button", { name: "Save search" }),
    ).toBeInTheDocument();
  });

  it("should filter saved searches based on input text", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    await screen.findByText("Saved searches");
    const securitySearch = savedSearches.find((matchedSearch) =>
      matchedSearch.title.includes("security"),
    );
    const nonMatchingSearch = savedSearches.find(
      (matchedSearch) => !matchedSearch.title.includes("security"),
    );

    assert(securitySearch);
    assert(nonMatchingSearch);

    expect(screen.getByText(securitySearch.title)).toBeInTheDocument();
    expect(screen.getByText(nonMatchingSearch.title)).toBeInTheDocument();

    await user.type(searchBox, "security");

    expect(screen.getByText(/search for/i)).toBeInTheDocument();
    expect(screen.getByText(securitySearch.title)).toBeInTheDocument();
    expect(screen.queryByText(nonMatchingSearch.title)).not.toBeInTheDocument();
  });

  it("should clear input when clear button is clicked", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test query");

    expect(searchBox).toHaveValue("test query");

    const clearButton = screen.getByRole("button", { name: /clear/i });
    await user.click(clearButton);

    expect(searchBox).toHaveValue("");
  });

  it("should close dropdown when Escape key is pressed", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    expect(await screen.findByText("Saved searches")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByText("Saved searches")).not.toBeInTheDocument();
  });

  it("should submit search when Enter key is pressed in dropdown", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);
    const textToSearch = "test";

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);
    await user.type(searchBox, textToSearch);

    await user.keyboard("{Enter}");

    expect(searchBox).toHaveValue(textToSearch);
  });

  it("should open dropdown when search box gets focus", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");

    expect(screen.queryByText("Saved searches")).not.toBeInTheDocument();

    await user.click(searchBox);

    expect(await screen.findByText("Saved searches")).toBeInTheDocument();
  });

  it("should handle empty saved searches list", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    expect(searchBox).toBeInTheDocument();
  });

  it("should show manage button when saved searches exist", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    await screen.findByText("Saved searches");

    const manageButton = screen.getByRole("button", { name: "Manage" });
    expect(manageButton).toBeInTheDocument();
  });

  it("should close dropdown when manage button is clicked", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    await screen.findByText("Saved searches");

    const manageButton = screen.getByRole("button", { name: "Manage" });
    await user.click(manageButton);

    expect(screen.queryByText("Saved searches")).not.toBeInTheDocument();
  });
});
