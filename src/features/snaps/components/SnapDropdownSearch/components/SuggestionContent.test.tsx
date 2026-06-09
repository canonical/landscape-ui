import { expectLoadingState } from "@/tests/helpers";
import { availableSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import SuggestionContent from "./SuggestionContent";

const getItemProps = vi.fn().mockReturnValue({});
const handleAddToSelectedItems = vi.fn();
const handleDeleteToBeConfirmedItem = vi.fn();

const suggestions = availableSnaps.slice(0, 3);

const defaultProps = {
  toBeConfirmedItem: null,
  instanceId: 1,
  isFetching: false,
  suggestions,
  search: "",
  highlightedIndex: null,
  getItemProps,
  handleAddToSelectedItems,
  handleDeleteToBeConfirmedItem,
};

describe("SuggestionContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getItemProps.mockReturnValue({});
  });

  describe("suggestion list", () => {
    it("renders all suggestion items", () => {
      renderWithProviders(
        <ul>
          <SuggestionContent {...defaultProps} />
        </ul>,
      );
      suggestions.forEach((snap) => {
        expect(screen.getByText(snap.name)).toBeInTheDocument();
      });
    });

    it("renders publisher name for each suggestion", () => {
      renderWithProviders(
        <ul>
          <SuggestionContent {...defaultProps} />
        </ul>,
      );
      suggestions.forEach((snap) => {
        expect(
          screen.getByText(snap.snap.publisher["display-name"] ?? ""),
        ).toBeInTheDocument();
      });
    });

    it("calls getItemProps for each suggestion with correct arguments", () => {
      renderWithProviders(
        <ul>
          <SuggestionContent {...defaultProps} />
        </ul>,
      );
      suggestions.forEach((item, index) => {
        expect(getItemProps).toHaveBeenCalledWith({ item, index });
      });
    });

    it("applies highlighted class to the item at highlightedIndex", () => {
      renderWithProviders(
        <ul>
          <SuggestionContent {...defaultProps} highlightedIndex={1} />
        </ul>,
      );
      const items = screen.getAllByRole("listitem");
      expect(items[0]).not.toHaveClass("highlighted");
      expect(items[1]).toHaveClass("highlighted");
    });

    it("renders no items when suggestions list is empty", () => {
      renderWithProviders(
        <ul>
          <SuggestionContent {...defaultProps} suggestions={[]} />
        </ul>,
      );
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("renders a loading indicator when isFetching is true", () => {
      renderWithProviders(
        <SuggestionContent
          {...defaultProps}
          suggestions={[]}
          isFetching={true}
        />,
      );
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("does not render suggestion items when isFetching is true", () => {
      renderWithProviders(
        <ul>
          <SuggestionContent {...defaultProps} isFetching={true} />
        </ul>,
      );
      suggestions.forEach((snap) => {
        expect(screen.queryByText(snap.name)).not.toBeInTheDocument();
      });
    });
  });

  describe("confirm item", () => {
    const toBeConfirmedItem = availableSnaps.find(
      (snap) => snap["snap-id"] === "2",
    );
    assert(toBeConfirmedItem);

    it("renders AvailableSnapDetails when toBeConfirmedItem is set", async () => {
      renderWithProviders(
        <ul>
          <SuggestionContent
            {...defaultProps}
            toBeConfirmedItem={toBeConfirmedItem}
          />
        </ul>,
      );
      await expectLoadingState();
      expect(screen.getByText(toBeConfirmedItem.name)).toBeInTheDocument();
    });

    it("does not render the suggestion list when toBeConfirmedItem is set", async () => {
      renderWithProviders(
        <ul>
          <SuggestionContent
            {...defaultProps}
            toBeConfirmedItem={toBeConfirmedItem}
            suggestions={suggestions}
          />
        </ul>,
      );
      await expectLoadingState();
      expect(screen.queryByTestId("dropdownElement")).not.toBeInTheDocument();
    });

    it("prioritises toBeConfirmedItem over isFetching", async () => {
      renderWithProviders(
        <ul>
          <SuggestionContent
            {...defaultProps}
            toBeConfirmedItem={toBeConfirmedItem}
            isFetching={true}
          />
        </ul>,
      );
      await expectLoadingState();
      expect(screen.getByText(toBeConfirmedItem.name)).toBeInTheDocument();
    });
  });
});
