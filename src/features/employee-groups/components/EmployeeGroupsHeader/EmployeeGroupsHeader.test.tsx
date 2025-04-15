import { employeeGroups } from "@/tests/mocks/employeeGroups";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import EmployeeGroupsHeader from "./EmployeeGroupsHeader";

const props: ComponentProps<typeof EmployeeGroupsHeader> = {
  employeeGroups,
  selectedEmployeeGroups: [1, 3],
  setSelectedEmployeeGroups: vi.fn(),
};

describe("EmployeeGroupsHeader", () => {
  const user = userEvent.setup();

  it("renders header with search and filter components", () => {
    const { container } = renderWithProviders(
      <EmployeeGroupsHeader {...props} />,
    );

    expect(container).toHaveTexts([
      "Search",
      "Import employee groups",
      "Remove",
      "Reassign autoinstall file",
    ]);
  });

  it("renders buttons and disables Remove and Assign autoinstall file when no groups are selected", () => {
    renderWithProviders(
      <EmployeeGroupsHeader {...props} selectedEmployeeGroups={[]} />,
    );

    const importEmployeeGroupsButton = screen.getByRole("button", {
      name: /Import employee groups/i,
    });
    expect(importEmployeeGroupsButton).toBeInTheDocument();
    expect(importEmployeeGroupsButton).toBeEnabled();

    const editPriorityButton = screen.getByRole("button", {
      name: /Edit priority/i,
    });
    expect(editPriorityButton).toBeInTheDocument();
    expect(editPriorityButton).toBeEnabled();

    const removeButton = screen.getByRole("button", { name: /Remove/i });
    expect(removeButton).toBeInTheDocument();
    expect(removeButton).toBeDisabled();

    const assignButton = screen.getByRole("button", {
      name: /reassign autoinstall file/i,
    });
    expect(assignButton).toBeInTheDocument();
    expect(assignButton).toHaveAttribute("aria-disabled", "true");
  });

  it("enables Remove and Assign autoinstall file buttons when groups are selected", () => {
    renderWithProviders(<EmployeeGroupsHeader {...props} />);

    const removeButton = screen.getByRole("button", { name: /Remove/i });
    expect(removeButton).not.toBeDisabled();

    const assignButton = screen.getByRole("button", {
      name: /reassign autoinstall file/i,
    });
    expect(assignButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("calls setSidePanelContent when 'Import employee groups' button is clicked", async () => {
    renderWithProviders(<EmployeeGroupsHeader {...props} />);

    const importButton = screen.getByRole("button", {
      name: /Import employee groups/i,
    });
    await user.click(importButton);

    const sidePanel = screen.getByRole("complementary");
    expect(sidePanel).toBeInTheDocument();
  });

  it("opens the remove confirmation modal when 'Remove' button is clicked", async () => {
    renderWithProviders(<EmployeeGroupsHeader {...props} />);

    const removeButton = screen.getByRole("button", { name: /Remove/i });
    await user.click(removeButton);

    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
  });
});
