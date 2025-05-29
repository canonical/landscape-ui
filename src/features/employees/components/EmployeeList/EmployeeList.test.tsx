import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { employees } from "@/tests/mocks/employees";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import EmployeeList from "./EmployeeList";

describe("EmployeeList", () => {
  const user = userEvent.setup();

  it("renders the table with correct column headers", () => {
    renderWithProviders(<EmployeeList employees={employees} />);

    const table = screen.getByRole("table");
    expect(table).toHaveTexts([
      "name",
      "email",
      "employee group",
      "assigned autoinstall file",
      "status",
      "associated instances",
    ]);
  });

  it("renders employee rows with their data", () => {
    renderWithProviders(<EmployeeList employees={employees} />);

    for (const employee of employees) {
      const employeeGroups = employee.groups || [];

      const row = screen.getByRole("row", {
        name: (name) => {
          return name.toLowerCase().includes(employee.name.toLowerCase());
        },
      });
      expect(row).toBeInTheDocument();
      assert(row);

      expect(
        within(row).getByRole("rowheader", { name: employee.name }),
      ).toBeVisible();

      expect(
        within(row).getByRole("cell", {
          name: /email/i,
        }),
      ).toHaveTextContent(employee.email);

      expect(
        within(row).getByRole("cell", {
          name: /status/i,
        }),
      ).toHaveTextContent(employee.is_active ? "Active" : "Inactive");

      expect(
        within(row).getByRole("cell", {
          name: /assigned autoinstall file/i,
        }),
      ).toHaveTextContent(employee.autoinstall_file?.filename || NO_DATA_TEXT);

      expect(
        within(row).getByRole("cell", {
          name: /employee group/i,
        }),
      ).toHaveTextContent(
        employeeGroups.map((group) => group.name).join("") || NO_DATA_TEXT,
      );

      expect(
        within(row).getByRole("cell", {
          name: /associated instances/i,
        }),
      ).toHaveTextContent(
        employee.computers?.map((computer) => computer.title).join("") ||
          NO_DATA_TEXT,
      );
    }
  });

  it("opens the side panel when an employee name is clicked", async () => {
    renderWithProviders(<EmployeeList employees={employees} />);

    const [employee] = employees;
    await user.click(
      screen.getByRole("button", {
        name: `Show details of user ${employee.name}`,
      }),
    );

    const sidePanel = await screen.findByRole("complementary");
    expect(sidePanel).toBeInTheDocument();
  });

  it("toggles expansion for the employee group truncated cell", async () => {
    renderWithProviders(<EmployeeList employees={employees} />);

    const employee = employees.find(
      (items) => items.groups && items.groups?.length > 1,
    );
    assert(employee);
    const employeeGroups = employee.groups;
    assert(employeeGroups);

    const row = screen.getByRole("row", {
      name: (name) => {
        return name.toLowerCase().includes(employee.name.toLowerCase());
      },
    });
    expect(row).toBeInTheDocument();
    assert(row);

    const groupsCell = within(row).getByRole("cell", {
      name: /employee group/i,
    });

    const groupCellTextContent = groupsCell.textContent;

    for (const group of employeeGroups) {
      const groupLabel = group.name;
      expect(groupCellTextContent).toContain(groupLabel);
    }
  });

  it("toggles expansion for the associated instances truncated cell", async () => {
    renderWithProviders(<EmployeeList employees={employees} />);

    const employee = employees.find(
      (items) => items.computers && items.computers?.length > 1,
    );
    assert(employee);
    const associatedInstances = employee.computers;
    assert(associatedInstances);

    const row = screen.getByRole("row", {
      name: (name) => {
        return name.toLowerCase().includes(employee.name.toLowerCase());
      },
    });
    expect(row).toBeInTheDocument();
    assert(row);

    const associatedInstancesCell = within(row).getByRole("cell", {
      name: /associated instances/i,
    });

    const associatedInstancesCellTextContent =
      associatedInstancesCell.textContent;

    for (const instance of associatedInstances) {
      expect(associatedInstancesCellTextContent).toContain(instance.title);
    }
  });

  it("renders the actions column with contextual menus", async () => {
    renderWithProviders(<EmployeeList employees={employees} />);

    const activeEmployee = employees.find((employee) => employee.is_active);
    const inactiveEmployee = employees.find((employee) => !employee.is_active);
    assert(activeEmployee);
    assert(inactiveEmployee);

    const activeEmployeeActionButton = screen.getByRole("button", {
      name: `${activeEmployee.name} actions`,
    });
    expect(activeEmployeeActionButton).toBeInTheDocument();

    const inactiveEmployeeActionButton = screen.getByRole("button", {
      name: `${inactiveEmployee.name} actions`,
    });
    expect(inactiveEmployeeActionButton).toBeInTheDocument();

    await user.click(activeEmployeeActionButton);

    const activeEmployeeDeactivateButton = screen.getByRole("button", {
      name: `Deactivate ${activeEmployee.name}`,
    });
    expect(activeEmployeeDeactivateButton).toBeVisible();

    await user.click(inactiveEmployeeActionButton);

    const inactiveEmployeeActivateButton = screen.getByRole("button", {
      name: `Activate ${inactiveEmployee.name}`,
    });
    expect(inactiveEmployeeActivateButton).toBeVisible();
  });
});
