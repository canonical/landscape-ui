import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ResponsiveTableSubhead from "./ResponsiveTableSubhead";

describe("ResponsiveTableSubhead", () => {
  it("shows the current selection count and clears the selection", async () => {
    const onClearSelection = vi.fn();

    render(
      <ResponsiveTableSubhead
        selectedCount={2}
        totalCount={5}
        itemName="package"
        onClearSelection={onClearSelection}
      />,
    );

    expect(screen.getByText("2 of 5 packages selected")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /select all/i }),
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Clear selection" }),
    );

    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });

  it("shows the all-selected state without the select-all action", async () => {
    const onClearSelection = vi.fn();

    render(
      <ResponsiveTableSubhead
        selectedCount={5}
        totalCount={5}
        itemName="package"
        isAllSelected
        onClearSelection={onClearSelection}
      />,
    );

    expect(screen.getByText("All 5 packages selected")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /select all/i }),
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Clear selection" }),
    );

    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });

  it("renders the select-all action when it is available and triggers it", async () => {
    const onClearSelection = vi.fn();
    const onSelectAll = vi.fn();

    render(
      <ResponsiveTableSubhead
        canSelectAll
        selectedCount={2}
        totalCount={5}
        itemName="package"
        onClearSelection={onClearSelection}
        onSelectAll={onSelectAll}
      />,
    );

    const selectAllButton = screen.getByRole("button", {
      name: "Select all 5 packages",
    });

    expect(selectAllButton).toBeInTheDocument();
    expect(screen.getByText("2 of 5 packages selected")).toBeInTheDocument();

    await userEvent.click(selectAllButton);
    expect(onSelectAll).toHaveBeenCalledTimes(1);

    await userEvent.click(
      screen.getByRole("button", { name: "Clear selection" }),
    );
    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });
});
