import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { employeeGroups } from "@/tests/mocks/employeeGroups";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import EmployeeGroupsList from "./EmployeeGroupsList";

const onSelectedEmployeeGroupsChangeMock = vi.fn();

const props: ComponentProps<typeof EmployeeGroupsList> = {
  employeeGroups,
  onSelectedEmployeeGroupsChange: onSelectedEmployeeGroupsChangeMock,
  selectedEmployeeGroups: [],
};

describe("EmployeeGroupsList", () => {
  const user = userEvent.setup();

  it("renders table headers and rows with correct data", () => {
    const { container } = renderWithProviders(
      <EmployeeGroupsList {...props} />,
    );

    expect(
      screen.getByLabelText(/toggle all employee groups/i),
    ).toBeInTheDocument();

    expect(container).toHaveTexts([
      "Name",
      "Employees",
      "Assigned autoinstall file",
      "Priority",
      "Actions",
    ]);

    employeeGroups.forEach((group) => {
      const groupLabel = group.name;

      const row = screen.getByRole("row", {
        name: (name) => name.toLowerCase().includes(groupLabel.toLowerCase()),
      });

      const rowHeader = within(row).getByRole("rowheader", {
        name: groupLabel,
      });
      expect(rowHeader).toBeInTheDocument();

      if (!group.employee_count) {
        expect(within(row).getByText("0")).toBeInTheDocument();
      } else {
        const employeeCountLink = within(row).getByRole("link", {
          name: String(group.employee_count),
        });

        expect(employeeCountLink).toHaveAttribute(
          "href",
          `/settings/employees?tab=employees&employeeGroups=${group.id}`,
        );
      }

      if (!group.autoinstall_file) {
        expect(within(row).getByText(NO_DATA_TEXT)).toBeInTheDocument();
      } else {
        const fileText = `${group.autoinstall_file.filename}, v${group.autoinstall_file.version}`;
        expect(within(row).getByText(fileText)).toBeInTheDocument();
      }

      expect(
        within(row).getByText(group.priority || "N/A"),
      ).toBeInTheDocument();
    });
  });

  it("toggles header checkbox to select all employee groups", async () => {
    renderWithProviders(<EmployeeGroupsList {...props} />);

    const headerCheckbox = screen.getByLabelText(/Toggle all employee groups/i);
    await user.click(headerCheckbox);

    expect(onSelectedEmployeeGroupsChangeMock).toHaveBeenCalledWith(
      employeeGroups.map((group) => group.id),
    );
  });

  it("toggles individual row checkbox to select a single employee group", async () => {
    renderWithProviders(<EmployeeGroupsList {...props} />);
    const [group] = employeeGroups;
    const groupLabel = group.name;

    const row = screen.getByRole("row", {
      name: (name) => name.toLowerCase().includes(groupLabel.toLowerCase()),
    });

    const rowCheckbox = within(row).getByRole("checkbox");

    await user.click(rowCheckbox);
    expect(props.onSelectedEmployeeGroupsChange).toHaveBeenCalledWith([
      group.id,
    ]);
  });
});
