import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PendingInstanceList from "./PendingInstanceList";
import { accessGroups } from "@/tests/mocks/accessGroup";
import userEvent from "@testing-library/user-event";
import { pendingInstances } from "@/tests/mocks/instance";

describe("PendingInstanceList", () => {
  const mockAccessGroupOptions = accessGroups.map((group) => ({
    label: group.title,
    value: group.name,
  }));
  const mockOnSelectedIdsChange = vi.fn();

  it("renders without errors", () => {
    renderWithProviders(
      <PendingInstanceList
        accessGroupOptions={mockAccessGroupOptions}
        instances={pendingInstances}
        onSelectedIdsChange={mockOnSelectedIdsChange}
        selectedIds={[]}
      />,
    );
  });

  it("renders correct column headers", () => {
    renderWithProviders(
      <PendingInstanceList
        accessGroupOptions={mockAccessGroupOptions}
        instances={pendingInstances}
        onSelectedIdsChange={mockOnSelectedIdsChange}
        selectedIds={[]}
      />,
    );
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("Hostname")).toBeInTheDocument();
    expect(screen.getByText("Access group")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("Pending since")).toBeInTheDocument();
  });

  it("clicking a checkbox calls onSelectedIdsChange with the correct ID", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PendingInstanceList
        accessGroupOptions={mockAccessGroupOptions}
        instances={[pendingInstances[0]]} // Using single instance for this test (es-lint magic numbers warning occured)
        onSelectedIdsChange={mockOnSelectedIdsChange}
        selectedIds={[]}
      />,
    );
    const [, checkbox] = screen.getAllByRole("checkbox"); // Get the first instance checkbox (if index 0 is "select all")
    await user.click(checkbox);
    expect(mockOnSelectedIdsChange).toHaveBeenCalledWith([
      pendingInstances[0].id,
    ]);
  });

  it("clicking the 'toggle all' checkbox selects all instances when none are selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PendingInstanceList
        accessGroupOptions={mockAccessGroupOptions}
        instances={pendingInstances}
        onSelectedIdsChange={mockOnSelectedIdsChange}
        selectedIds={[]}
      />,
    );
    const toggleAllCheckbox = screen.getByRole("checkbox", {
      name: /toggle all instances/i,
    });
    await user.click(toggleAllCheckbox);
    const expectedIds = pendingInstances.map((instance) => instance.id);
    expect(mockOnSelectedIdsChange).toHaveBeenCalledWith(expectedIds);
  });

  it("clicking the 'toggle all' checkbox deselects all instances when all are selected", async () => {
    const allSelectedIds = pendingInstances.map((instance) => instance.id);
    const user = userEvent.setup();
    renderWithProviders(
      <PendingInstanceList
        accessGroupOptions={mockAccessGroupOptions}
        instances={pendingInstances}
        onSelectedIdsChange={mockOnSelectedIdsChange}
        selectedIds={allSelectedIds}
      />,
    );
    const toggleAllCheckbox = screen.getByRole("checkbox", {
      name: /toggle all instances/i,
    });
    await user.click(toggleAllCheckbox);
    expect(mockOnSelectedIdsChange).toHaveBeenCalledWith([]);
  });
});
