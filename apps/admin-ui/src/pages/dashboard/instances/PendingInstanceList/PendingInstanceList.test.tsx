import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PendingInstanceList from "./PendingInstanceList";
import PendingInstancesForm from "../PendingInstancesForm";
import { accessGroups } from "@/tests/mocks/accessGroup";
import userEvent from "@testing-library/user-event";
import { pendingInstances } from "@/tests/mocks/instance";

describe("PendingInstanceList", () => {
  const mockAccessGroupOptions = accessGroups.map((group) => ({
    label: group.title,
    value: group.name,
  }));
  const mockOnSelectedIdsChange = vi.fn();

  it("renders the table", () => {
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

  it("clicking a checkbox calls onSelectedIdsChange with correct ID", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PendingInstanceList
        accessGroupOptions={mockAccessGroupOptions}
        instances={[pendingInstances[0]]}
        onSelectedIdsChange={mockOnSelectedIdsChange}
        selectedIds={[]}
      />,
    );
    const [, checkbox] = screen.getAllByRole("checkbox");
    await user.click(checkbox);
    expect(mockOnSelectedIdsChange).toHaveBeenCalledWith([
      pendingInstances[0].id,
    ]);
  });

  it("'select all' selects all instances", async () => {
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

  it("'select all' checkbox deselects all instances when all are selected", async () => {
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

  it("action buttons disabled when no instance is selected", () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    const approveButton = screen.getByRole("button", { name: /approve/i });
    const rejectButton = screen.getByRole("button", { name: /reject/i });

    expect(rejectButton).toBeDisabled();
    expect(approveButton).toHaveAttribute("aria-disabled", "true");
  });

  it("action buttons enabled when at least one instance is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]);

    const approveButton = screen.getByRole("button", { name: /approve/i });
    const rejectButton = screen.getByRole("button", { name: /reject/i });

    expect(approveButton).toBeEnabled();
    expect(rejectButton).toBeEnabled();
  });

  it("clicking cancel button closes the panel", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(
      screen.queryByText(/review pending instances/i),
    ).not.toBeInTheDocument();
  });

  it("clicking approve renders access group dropdown", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]);

    const approveButton = screen.getByRole("button", { name: /^approve$/i });
    await user.click(approveButton);

    expect(
      screen.getByRole("combobox", { name: /access group/i }),
    ).toBeInTheDocument();
  });

  it("clicking 'Back' after approving returns to table view", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]);

    const approveButton = screen.getByRole("button", { name: /^approve$/i });
    await user.click(approveButton);

    expect(
      screen.getByRole("combobox", { name: /access group/i }),
    ).toBeInTheDocument();

    const backButton = screen.getByRole("button", { name: /^back$/i });
    await user.click(backButton);

    expect(
      screen.getByRole("checkbox", { name: /toggle all instances/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("combobox", { name: /access group/i }),
    ).not.toBeInTheDocument();
  });

  it("clicking reject opens confirmation and confirms with correct IDs", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[2]);

    const rejectButton = screen.getByRole("button", { name: /reject/i });
    await user.click(rejectButton);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });
});
