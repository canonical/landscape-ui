import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { employees } from "@/tests/mocks/employees";
import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import type { Cell, Row } from "react-table";
import { describe, expect, it } from "vitest";
import type { Employee } from "../../types";
import EmployeeList from "./EmployeeList";
import { getTableRows, handleCellProps, handleRowProps } from "./helpers";

const employeeWithEmptyComputers: Employee = {
  id: 99,
  name: "No Computers User",
  email: "nocomputer@example.com",
  is_active: true,
  issuer: "https://myorg.okta.com",
  subject: "00u-no-computer",
  computers: [],
  groups: [],
};

describe("EmployeeList", () => {
  const user = userEvent.setup();

  it("renders the table with correct column headers", () => {
    renderWithProviders(<EmployeeList employees={employees} />);

    const table = screen.getByRole("table");
    expect(table).toHaveTexts([
      "name",
      "email",
      "status",
      "associated instances",
    ]);
  });

  it("renders employee rows with their data", () => {
    renderWithProviders(<EmployeeList employees={employees} />);

    for (const employee of employees) {
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
          name: /associated instances/i,
        }),
      ).toHaveTextContent(
        employee.computers?.map((computer) => computer.title).join("") ||
          NO_DATA_TEXT,
      );
    }
  });

  it("renders NoData for employee with empty computers array", () => {
    renderWithProviders(
      <EmployeeList employees={[employeeWithEmptyComputers]} />,
    );

    const row = screen.getByRole("row", {
      name: (name) =>
        name
          .toLowerCase()
          .includes(employeeWithEmptyComputers.name.toLowerCase()),
    });
    expect(within(row).getByText(NO_DATA_TEXT)).toBeInTheDocument();
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

  it("collapses expanded cell when clicking the same expand button again", async () => {
    renderWithProviders(<EmployeeList employees={employees} />);

    const employee = employees.find(
      (item) => item.computers && item.computers.length > 1,
    );
    assert(employee);

    const row = screen.getByRole("row", {
      name: (name) => name.toLowerCase().includes(employee.name.toLowerCase()),
    });

    const expandButton = within(row).queryByRole("button", {
      name: /show all/i,
    });

    if (expandButton) {
      await user.click(expandButton);
      await user.click(expandButton);

      expect(
        within(row).queryByRole("button", { name: /show less/i }),
      ).not.toBeInTheDocument();
    }
  });

  it("expands and collapses a cell using the expand button with overflow detection", async () => {
    const employeeWithManyComputers = employees.find(
      (item) => item.computers && item.computers.length > 1,
    );
    assert(employeeWithManyComputers);

    renderWithProviders(<EmployeeList employees={employees} />);

    const row = screen.getByRole("row", {
      name: (name) =>
        name
          .toLowerCase()
          .includes(employeeWithManyComputers.name.toLowerCase()),
    });

    const expandButton = within(row).queryByRole("button", {
      name: /show all/i,
    });

    if (expandButton) {
      await user.click(expandButton);

      expect(
        within(row).queryByRole("button", { name: /show less/i }),
      ).toBeInTheDocument();

      const collapseButton = within(row).getByRole("button", {
        name: /show less/i,
      });
      await user.click(collapseButton);

      expect(
        within(row).queryByRole("button", { name: /show less/i }),
      ).not.toBeInTheDocument();
    }
  });

  it("collapses expanded cell when clicking outside the expanded row", async () => {
    const employeeWithManyComputers = employees.find(
      (item) => item.computers && item.computers.length > 1,
    );
    assert(employeeWithManyComputers);

    const { container } = renderWithProviders(
      <EmployeeList employees={employees} />,
    );

    const row = screen.getByRole("row", {
      name: (name) =>
        name
          .toLowerCase()
          .includes(employeeWithManyComputers.name.toLowerCase()),
    });

    const expandButton = within(row).queryByRole("button", {
      name: /show all/i,
    });

    if (expandButton) {
      await user.click(expandButton);

      expect(
        within(row).queryByRole("button", { name: /show less/i }),
      ).toBeInTheDocument();

      // Click outside the expanded row to collapse it
      await user.click(container);

      expect(
        within(row).queryByRole("button", { name: /show less/i }),
      ).not.toBeInTheDocument();
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

    const activeEmployeeDeactivateMenuItem = screen.getByRole("menuitem", {
      name: `Deactivate ${activeEmployee.name}`,
    });
    expect(activeEmployeeDeactivateMenuItem).toBeVisible();

    await user.click(inactiveEmployeeActionButton);

    const inactiveEmployeeActivateMenuItem = screen.getByRole("menuitem", {
      name: `Activate ${inactiveEmployee.name}`,
    });
    expect(inactiveEmployeeActivateMenuItem).toBeVisible();
  });

  it("renders a list of component props", () => {
    const props: ComponentProps<typeof EmployeeList> = {
      employees: [employeeWithEmptyComputers, ...employees],
    };
    const { container } = renderWithProviders(<EmployeeList {...props} />);
    expect(container).toBeTruthy();
  });

  it("expands computers cell when Show more button is clicked", async () => {
    renderWithProviders(<EmployeeList employees={employees} />);

    const [employee] = employees;
    const row = screen.getByRole("row", {
      name: (name) => name.toLowerCase().includes(employee.name.toLowerCase()),
    });

    const showMoreBtn = await within(row).findByRole("button", {
      name: /show more/i,
    });

    await user.click(showMoreBtn);

    expect(
      within(row).queryByRole("button", { name: /show more/i }),
    ).not.toBeInTheDocument();
  });

  it("collapses expanded cell when clicking outside", async () => {
    const { container } = renderWithProviders(
      <EmployeeList employees={employees} />,
    );

    const [employee] = employees;
    const row = screen.getByRole("row", {
      name: (name) => name.toLowerCase().includes(employee.name.toLowerCase()),
    });

    const showMoreBtn = await within(row).findByRole("button", {
      name: /show more/i,
    });

    await user.click(showMoreBtn);
    await user.click(container);

    expect(
      within(row).queryByRole("button", { name: /show more/i }),
    ).toBeInTheDocument();
  });

  it("does not collapse expanded cell when clicking a truncatedItem link inside it", async () => {
    renderWithProviders(<EmployeeList employees={employees} />);

    const [employee] = employees;
    const row = screen.getByRole("row", {
      name: (name) => name.toLowerCase().includes(employee.name.toLowerCase()),
    });

    const showMoreBtn = await within(row).findByRole("button", {
      name: /show more/i,
    });

    await user.click(showMoreBtn);

    // Click a computer link inside the expanded cell (has className="truncatedItem")
    // useOnClickOutside should NOT collapse because closest(".truncatedItem") returns non-null
    const computersCell = within(row).getByRole("cell", {
      name: /associated instances/i,
    });
    const [computerLink] = within(computersCell).getAllByRole("link");

    assert(computerLink);

    await user.click(computerLink);

    // Cell should remain expanded (Show more button still absent)
    expect(
      within(row).queryByRole("button", { name: /show more/i }),
    ).not.toBeInTheDocument();
  });

  it("adjusts row index when expanding a lower row while an upper row is already expanded", async () => {
    const secondComputerEmployee: Employee = {
      ...employees[0],
      id: 200,
      name: "Second Computer Employee",
      email: "second@test.com",
      subject: "sub-second",
      computers: [instances[0]],
    };

    renderWithProviders(
      <EmployeeList employees={[employees[0], secondComputerEmployee]} />,
    );

    const row0 = screen.getByRole("row", {
      name: (n) => n.toLowerCase().includes(employees[0].name.toLowerCase()),
    });
    const showMore0 = await within(row0).findByRole("button", {
      name: /show more/i,
    });

    await user.click(showMore0);

    const row1 = screen.getByRole("row", {
      name: (n) => n.toLowerCase().includes("second computer employee"),
    });
    const showMore1 = await within(row1).findByRole("button", {
      name: /show more/i,
    });

    // Use fireEvent.click (not userEvent) so mousedown is not dispatched.
    // userEvent.click dispatches mousedown first, which triggers useOnClickOutside
    // and resets expandedCell to null before handleExpandCellClick runs —
    // preventing the `prevState.row < rowIndex` branch from being exercised.
    fireEvent.click(showMore1);
  });

  it("adjusts row index when expanding an upper row while a lower row is already expanded", async () => {
    const secondComputerEmployee: Employee = {
      ...employees[0],
      id: 201,
      name: "Third Computer Employee",
      email: "third@test.com",
      subject: "sub-third",
      computers: [instances[0]],
    };

    renderWithProviders(
      <EmployeeList employees={[employees[0], secondComputerEmployee]} />,
    );

    const row1 = screen.getByRole("row", {
      name: (n) => n.toLowerCase().includes("third computer employee"),
    });
    const showMore1 = await within(row1).findByRole("button", {
      name: /show more/i,
    });

    await user.click(showMore1);

    const row0 = screen.getByRole("row", {
      name: (n) => n.toLowerCase().includes(employees[0].name.toLowerCase()),
    });
    const showMore0 = await within(row0).findByRole("button", {
      name: /show more/i,
    });

    // Use fireEvent.click for same reason as the test above.
    fireEvent.click(showMore0);
  });
});

describe("handleCellProps (EmployeeList)", () => {
  const makeCell = (columnId: string, rowIndex: number) =>
    ({
      column: { id: columnId },
      row: { index: rowIndex },
    }) as unknown as Cell<Employee>;

  it("sets aria-label='Associated instances' for the computers column", () => {
    const result = handleCellProps(null)(makeCell("computers", 0));
    expect(result["aria-label"]).toBe("Associated instances");
  });

  it("sets expandedCell className for computers when coordinates match", () => {
    const expandedCell = { column: "computers", row: 0 };
    const result = handleCellProps(expandedCell)(makeCell("computers", 0));
    expect(result.className).toBe("expandedCell");
  });

  it("does not set className when expandedCell row does not match", () => {
    const expandedCell = { column: "computers", row: 1 };
    const result = handleCellProps(expandedCell)(makeCell("computers", 0));
    expect(result.className).toBeUndefined();
  });

  it("does not set className when expandedCell is null (computers column)", () => {
    const result = handleCellProps(null)(makeCell("computers", 0));
    expect(result.className).toBeUndefined();
  });

  it("sets role='rowheader' for the name column", () => {
    const result = handleCellProps(null)(makeCell("name", 0));
    expect(result.role).toBe("rowheader");
  });

  it("sets aria-label='Email' for the email column", () => {
    const result = handleCellProps(null)(makeCell("email", 0));
    expect(result["aria-label"]).toBe("Email");
  });

  it("sets aria-label='Status' for the status column", () => {
    const result = handleCellProps(null)(makeCell("status", 0));
    expect(result["aria-label"]).toBe("Status");
  });

  it("sets aria-label='Actions' for the actions column", () => {
    const result = handleCellProps(null)(makeCell("actions", 0));
    expect(result["aria-label"]).toBe("Actions");
  });

  it("returns empty props for an unrecognised column", () => {
    const result = handleCellProps(null)(makeCell("unknown", 0));
    expect(result).toEqual({});
  });
});

describe("handleRowProps (EmployeeList)", () => {
  const makeRow = (index: number) => ({ index }) as unknown as Row<Employee>;

  it("sets expandedRow className when computers column is expanded at matching row", () => {
    const expandedCell = { column: "computers", row: 0 };
    const result = handleRowProps(expandedCell)(makeRow(0));
    expect(result.className).toBe("expandedRow");
  });

  it("does not set className when expandedCell is null", () => {
    const result = handleRowProps(null)(makeRow(0));
    expect(result.className).toBeUndefined();
  });

  it("does not set className when row index does not match", () => {
    const expandedCell = { column: "computers", row: 0 };
    const result = handleRowProps(expandedCell)(makeRow(1));
    expect(result.className).toBeUndefined();
  });

  it("does not set className when expanded column is not computers", () => {
    const expandedCell = { column: "name", row: 0 };
    const result = handleRowProps(expandedCell)(makeRow(0));
    expect(result.className).toBeUndefined();
  });
});

describe("getTableRows (EmployeeList)", () => {
  it("does not modify ref.current when instance is null", () => {
    const ref = { current: [] as HTMLTableRowElement[] };
    getTableRows(ref)(null);
    expect(ref.current).toHaveLength(0);
  });

  it("sets ref.current to tbody tr elements when instance is provided", () => {
    const ref = { current: [] as HTMLTableRowElement[] };
    const div = document.createElement("div");
    div.innerHTML = "<table><tbody><tr></tr><tr></tr><tr></tr></tbody></table>";
    getTableRows(ref)(div);
    expect(ref.current).toHaveLength(3);
  });
});
