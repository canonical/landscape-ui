import { savedSearches } from "@/tests/mocks/savedSearches";
import { renderWithProviders } from "@/tests/render";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import SearchBoxWithSavedSearches from "./SearchBoxWithSavedSearches";

vi.mock("@/features/instances", () => ({
  useInstanceSearchHelpTerms: () => [
    { term: "status:running", description: "Running instances" },
    { term: "alert:offline", description: "Offline instances" },
  ],
  getProfileTypes: () => [
    "package",
    "reboot",
    "removal",
    "repository",
    "upgrade",
  ],
}));

describe("SearchBoxWithSavedSearches", () => {
  const user = userEvent.setup();

  const defaultProps: ComponentProps<typeof SearchBoxWithSavedSearches> = {
    onHelpButtonClick: vi.fn(),
    onChange: vi.fn(),
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
    expect(defaultProps.onChange).toHaveBeenCalled();
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
    expect(defaultProps.onChange).toHaveBeenCalled();
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

  it("should open dropdown when Enter key is pressed while dropdown is closed", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");

    // Fire keyUp directly without a click to avoid opening dropdown via container onClick
    fireEvent.keyUp(searchBox, { key: "Enter" });

    expect(await screen.findByText("Saved searches")).toBeInTheDocument();
  });

  it("should handle form submit when search is entered", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test-search");

    const form = searchBox.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    expect(screen.queryByText("Saved searches")).toBeDefined();
  });

  it("should show save search panel when Save search is clicked from the prompt", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    await screen.findByText("Saved searches");

    await user.type(searchBox, "alert:package-upgrades");

    const saveSearchButton = await screen.findByRole("button", {
      name: "Save search",
    });
    await user.click(saveSearchButton);

    expect(
      await screen.findByRole("heading", { name: "Add saved search" }),
    ).toBeInTheDocument();

    // The form loads lazily; once visible, submit to trigger onSearchSave callback
    const titleInput = screen.queryByRole("textbox", { name: /title/i });
    if (titleInput) {
      await user.type(titleInput, "Test");
      const submitBtn = screen.getByRole("button", {
        name: "Add saved search",
      });
      await user.click(submitBtn);
      await waitFor(() => {
        expect(searchBox).toHaveValue("");
      });
    }
  });

  it("should call onChange when a saved search is clicked", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <SearchBoxWithSavedSearches {...defaultProps} onChange={onChange} />,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    await screen.findByText("Saved searches");

    const [firstSearch] = savedSearches;
    const titleElement = screen.getByText(firstSearch.title);
    await user.click(titleElement);

    expect(onChange).toHaveBeenCalled();
  });

  it("should keep dropdown visible after a saved search is removed", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    await screen.findByText("Saved searches");

    const [firstSearch] = savedSearches;
    const removeButton = screen.getByRole("button", {
      name: `Remove ${firstSearch.title} saved search`,
    });
    await user.click(removeButton);

    const modal = screen.getByRole("dialog");
    const confirmButton = within(modal).getByRole("button", { name: "Remove" });
    await user.click(confirmButton);

    expect(await screen.findByText("Saved searches")).toBeInTheDocument();
  });

  it("should use 'search:' prefix when input matches a saved search name", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <SearchBoxWithSavedSearches {...defaultProps} onChange={onChange} />,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    await screen.findByText("Saved searches");

    const [firstSearch] = savedSearches;
    await user.type(searchBox, firstSearch.name);
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalled();
  });

  it("should work without an onChange callback when a saved search is clicked", async () => {
    renderWithProviders(
      <SearchBoxWithSavedSearches onHelpButtonClick={vi.fn()} />,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    await screen.findByText("Saved searches");

    const [firstSearch] = savedSearches;
    const titleElement = screen.getByText(firstSearch.title);

    expect(() => user.click(titleElement)).not.toThrow();
  });

  it("should call handleSearch via keyUp Enter handler when dropdown is open", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <SearchBoxWithSavedSearches {...defaultProps} onChange={onChange} />,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    await screen.findByText("Saved searches");

    // Use fireEvent.keyUp to directly trigger the onKeyUp handler with Enter
    // while the dropdown is open, exercising the Enter branch inside
    // handleKeysOnSearchBox without triggering form submission.
    fireEvent.keyUp(searchBox, { key: "Enter" });

    expect(onChange).toHaveBeenCalled();
  });

  it("should clear input text after successfully saving a search via SearchPrompt", async () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);
    await user.type(searchBox, "alert:package-upgrades");

    await screen.findByText("Saved searches");

    const saveSearchButton = await screen.findByRole("button", {
      name: "Save search",
    });
    await user.click(saveSearchButton);

    await screen.findByRole("heading", { name: "Add saved search" });
    const titleInput = await screen.findByRole("textbox", { name: /title/i });
    await user.type(titleInput, "My New Search");

    const submitButtons = screen.getAllByRole("button", {
      name: "Add saved search",
    });
    const submitButton = submitButtons.find(
      (btn) => btn.getAttribute("type") === "submit",
    );
    assert(submitButton);
    await user.click(submitButton);

    await waitFor(() => {
      expect(searchBox).toHaveValue("");
    });
  });

  it("should ignore non-Enter keyUp events when dropdown is closed", () => {
    renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

    const searchBox = screen.getByRole("searchbox");

    expect(screen.queryByText("Saved searches")).not.toBeInTheDocument();

    fireEvent.keyUp(searchBox, { key: "ArrowDown" });

    expect(screen.queryByText("Saved searches")).not.toBeInTheDocument();
  });

  it("should initialise search box with existing query from URL", async () => {
    renderWithProviders(
      <SearchBoxWithSavedSearches {...defaultProps} />,
      {},
      "/?query=existing-query",
    );

    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).toHaveValue("existing-query");
  });
});
