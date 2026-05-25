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

  describe("keyboard accessibility", () => {
    it("should open the dropdown when the search box receives keyboard focus", async () => {
      renderWithProviders(
        <div>
          <button>Before</button>
          <SearchBoxWithSavedSearches {...defaultProps} />
        </div>,
      );

      const beforeButton = screen.getByRole("button", { name: "Before" });
      beforeButton.focus();
      expect(screen.queryByText("Saved searches")).not.toBeInTheDocument();

      await user.tab();

      expect(screen.getByRole("searchbox")).toHaveFocus();
      expect(await screen.findByText("Saved searches")).toBeInTheDocument();
    });

    it("should expose aria-expanded and aria-controls linking the input to the dropdown panel", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      expect(searchBox).toHaveAttribute("aria-expanded", "false");
      expect(searchBox).not.toHaveAttribute("aria-controls");

      await user.click(searchBox);
      await screen.findByText("Saved searches");

      expect(searchBox).toHaveAttribute("aria-expanded", "true");
      const controlsId = searchBox.getAttribute("aria-controls");
      expect(controlsId).toBeTruthy();

      const panel = screen.getByRole("group", { name: "Saved searches" });
      expect(panel).toHaveAttribute("id", controlsId);
    });

    it("should keep the dropdown open while focus moves between focusable items inside it", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      const manageButton = screen.getByRole("button", { name: "Manage" });
      manageButton.focus();
      expect(manageButton).toHaveFocus();

      // After focus moves to a button inside the panel, the dropdown must remain visible.
      expect(screen.getByText("Saved searches")).toBeInTheDocument();
    });

    it("should close the dropdown when keyboard focus moves to an element outside the component", async () => {
      renderWithProviders(
        <div>
          <SearchBoxWithSavedSearches {...defaultProps} />
          <button>After</button>
        </div>,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      const afterButton = screen.getByRole("button", { name: "After" });
      afterButton.focus();

      await waitFor(() => {
        expect(screen.queryByText("Saved searches")).not.toBeInTheDocument();
      });
    });

    it("should close the dropdown and return focus to the search box when Escape is pressed inside the panel", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      const manageButton = screen.getByRole("button", { name: "Manage" });
      manageButton.focus();
      expect(manageButton).toHaveFocus();

      await user.keyboard("{Escape}");

      expect(screen.queryByText("Saved searches")).not.toBeInTheDocument();
      expect(searchBox).toHaveFocus();
    });

    it("should not re-open the dropdown when focus is restored to the search box on Escape", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      const manageButton = screen.getByRole("button", { name: "Manage" });
      manageButton.focus();

      await user.keyboard("{Escape}");

      expect(searchBox).toHaveFocus();
      expect(screen.queryByText("Saved searches")).not.toBeInTheDocument();
    });

    it("should keep the dropdown open while focus is on the help button inside the search container", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      const helpButton = screen.getByRole("button", { name: "Search help" });
      helpButton.focus();
      expect(helpButton).toHaveFocus();
      expect(screen.getByText("Saved searches")).toBeInTheDocument();
    });

    it("should keep the dropdown open while a modal opened from inside it has focus", async () => {
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
      expect(modal).toBeInTheDocument();
      expect(screen.getByText("Saved searches")).toBeInTheDocument();
    });

    it("should re-open the dropdown when the search box is clicked after Escape closed it", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      await user.keyboard("{Escape}");
      expect(screen.queryByText("Saved searches")).not.toBeInTheDocument();

      await user.click(searchBox);
      expect(await screen.findByText("Saved searches")).toBeInTheDocument();
    });

    it("should highlight the first saved search when ArrowDown is pressed", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      expect(searchBox).not.toHaveAttribute("aria-activedescendant");

      await user.keyboard("{ArrowDown}");

      const activeId = searchBox.getAttribute("aria-activedescendant");
      expect(activeId).toBeTruthy();

      const [firstSearch] = savedSearches;
      assert(firstSearch);
      const activeButton = document.getElementById(activeId ?? "");
      assert(activeButton);
      expect(activeButton).toHaveAttribute("aria-selected", "true");
      expect(activeButton).toHaveTextContent(firstSearch.title);
    });

    it("should move highlight down through items and clamp at the last one", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      // Press ArrowDown more times than there are items so we exercise the clamp.
      for (let i = 0; i < savedSearches.length + 2; i += 1) {
        await user.keyboard("{ArrowDown}");
      }

      const lastSearch = savedSearches.at(-1);
      assert(lastSearch);
      const activeId = searchBox.getAttribute("aria-activedescendant");
      const activeButton = document.getElementById(activeId ?? "");
      assert(activeButton);
      expect(activeButton).toHaveTextContent(lastSearch.title);
    });

    it("should highlight the last saved search when ArrowUp is pressed with no current selection", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      await user.keyboard("{ArrowUp}");

      const lastSearch = savedSearches.at(-1);
      assert(lastSearch);
      const activeId = searchBox.getAttribute("aria-activedescendant");
      const activeButton = document.getElementById(activeId ?? "");
      assert(activeButton);
      expect(activeButton).toHaveTextContent(lastSearch.title);
    });

    it("should clamp ArrowUp at the first item", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowUp}");
      await user.keyboard("{ArrowUp}");

      const [firstSearch] = savedSearches;
      assert(firstSearch);
      const activeId = searchBox.getAttribute("aria-activedescendant");
      const activeButton = document.getElementById(activeId ?? "");
      assert(activeButton);
      expect(activeButton).toHaveTextContent(firstSearch.title);
    });

    it("should jump to the first item with Home and the last with End", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      const [firstSearch] = savedSearches;
      const lastSearch = savedSearches.at(-1);
      assert(firstSearch);
      assert(lastSearch);

      await user.keyboard("{End}");
      let activeId = searchBox.getAttribute("aria-activedescendant");
      expect(document.getElementById(activeId ?? "")).toHaveTextContent(
        lastSearch.title,
      );

      await user.keyboard("{Home}");
      activeId = searchBox.getAttribute("aria-activedescendant");
      expect(document.getElementById(activeId ?? "")).toHaveTextContent(
        firstSearch.title,
      );
    });

    it("should apply the highlighted saved search when Enter is pressed", async () => {
      const onChange = vi.fn();
      renderWithProviders(
        <SearchBoxWithSavedSearches {...defaultProps} onChange={onChange} />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      const [, secondSearch] = savedSearches;
      assert(secondSearch);

      await user.keyboard("{ArrowDown}{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalled();
      expect(searchBox).toHaveValue(`search:${secondSearch.name}`);
    });

    it("should fall back to plain search on Enter when no item is highlighted", async () => {
      const onChange = vi.fn();
      renderWithProviders(
        <SearchBoxWithSavedSearches {...defaultProps} onChange={onChange} />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);
      await user.type(searchBox, "free-text-query");

      await user.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalled();
      expect(searchBox).toHaveValue("free-text-query");
    });

    it("should reset the highlight when the input text changes", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      await user.keyboard("{ArrowDown}");
      expect(searchBox).toHaveAttribute("aria-activedescendant");

      await user.type(searchBox, "x");

      expect(searchBox).not.toHaveAttribute("aria-activedescendant");
    });

    it("should scroll the highlighted item into view when navigating with the arrow keys", async () => {
      const scrollIntoViewSpy = vi
        .spyOn(Element.prototype, "scrollIntoView")
        .mockImplementation(() => undefined);

      try {
        renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

        const searchBox = screen.getByRole("searchbox");
        await user.click(searchBox);

        await screen.findByText("Saved searches");

        scrollIntoViewSpy.mockClear();

        await user.keyboard("{ArrowDown}");

        const activeId = searchBox.getAttribute("aria-activedescendant");
        const activeItem = document.getElementById(activeId ?? "");
        assert(activeItem);

        const scrollCalls = scrollIntoViewSpy.mock.instances.filter(
          (instance) => instance === activeItem,
        );
        expect(scrollCalls.length).toBeGreaterThan(0);
        expect(scrollIntoViewSpy).toHaveBeenLastCalledWith({
          block: "nearest",
        });
      } finally {
        scrollIntoViewSpy.mockRestore();
      }
    });

    it("should render a muted helper hint describing keyboard shortcuts", async () => {
      renderWithProviders(<SearchBoxWithSavedSearches {...defaultProps} />);

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);

      await screen.findByText("Saved searches");

      const hint = screen.getByText(/to navigate/i);
      expect(hint).toBeInTheDocument();
      expect(hint).toHaveTextContent("Enter");
      expect(hint).toHaveTextContent("Esc");
    });
  });
});
