import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DropdownSearch from "./DropdownSearch";

describe("DropdownSearch", () => {
  let mockSetSelectedItems: () => void;
  let mockUseQuery: () => any;

  beforeEach(() => {
    mockSetSelectedItems = () => {};
    mockUseQuery = () => ({
      data: {
        data: {
          results: [
            {
              ["snap-id"]: "1",
              name: "Snap 1",
              publisher: {
                displayName: "Publisher 1",
                id: "1",
                username: "publisher1",
                validation: "verified",
              },
            },
            {
              ["snap-id"]: "2",
              name: "Snap 2",
              publisher: {
                displayName: "Publisher 2",
                id: "2",
                username: "publisher2",
                validation: "verified",
              },
            },
          ],
        },
      },
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      refetch: () => {},
    });
  });

  it("renders without crashing", async () => {
    render(
      <DropdownSearch
        itemType="snap"
        selectedItems={[]}
        setSelectedItems={mockSetSelectedItems}
        getDropdownInfo={mockUseQuery}
      />,
    );
  });

  it("searches and displays suggestions", async () => {
    render(
      <DropdownSearch
        itemType="snap"
        selectedItems={[]}
        setSelectedItems={mockSetSelectedItems}
        getDropdownInfo={mockUseQuery}
      />,
    );

    const searchBox = screen.getByPlaceholderText("Search for available snaps");
    fireEvent.change(searchBox, { target: { value: "Snap" } });
    fireEvent.keyUp(searchBox, { key: "p", code: "KeyP" });
    const snaps = await screen.findAllByTestId("dropdownElement");
    expect(snaps).toHaveLength(2);
    const snap1 = snaps[0];
    expect(snap1.textContent).toBe("Snap 1");
  });
  it("closes after escape key", async () => {
    render(
      <DropdownSearch
        itemType="snap"
        selectedItems={[]}
        setSelectedItems={mockSetSelectedItems}
        getDropdownInfo={mockUseQuery}
      />,
    );

    const searchBox = screen.getByPlaceholderText("Search for available snaps");
    fireEvent.change(searchBox, { target: { value: "Snap" } });
    fireEvent.keyUp(searchBox, { key: "p", code: "KeyP" });
    fireEvent.keyUp(searchBox, { key: "Escape", code: "Escape" });
    const snap = screen.queryByTestId("dropdownElement");
    expect(snap).toBeNull();
  });
});
