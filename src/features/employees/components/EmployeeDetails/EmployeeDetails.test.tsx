import NoData from "@/components/layout/NoData";
import { employees } from "@/tests/mocks/employees";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EmployeeDetails from "./EmployeeDetails";

const employeeWithInstances = employees.find(
  (employee) => employee.computers && employee.computers.length > 0,
);

const employeeWithoutInstances = employees.find(
  (employee) => !employee.computers,
);

describe("EmployeeDetails", () => {
  assert(employeeWithInstances);
  assert(employeeWithoutInstances);

  it("renders header, info items and instances table correctly", async () => {
    const { container } = renderWithProviders(
      <EmployeeDetails employee={employeeWithoutInstances} />,
    );

    expect(
      screen.getByRole("button", {
        name: employeeWithoutInstances.is_active ? "Deactivate" : "Activate",
      }),
    ).toBeVisible();

    const fieldsToCheck = [
      { label: "name", value: employeeWithoutInstances.name },
      { label: "email", value: employeeWithoutInstances.email },
      {
        label: "employee groups",
        value:
          employeeWithoutInstances.groups
            ?.map((group) => group.name)
            .join(", ") || "N/A",
      },
      {
        label: "status",
        value: employeeWithoutInstances.is_active ? "Active" : "Inactive",
      },
      {
        label: "autoinstall file",
        value: employeeWithoutInstances.autoinstall_file ? (
          `${employeeWithoutInstances.autoinstall_file?.filename}, v${employeeWithoutInstances.autoinstall_file?.version}`
        ) : (
          <NoData />
        ),
      },
    ];

    fieldsToCheck.forEach((field) => {
      expect(container).toHaveInfoItem(field.label, field.value);
    });
  });

  it("renders computer instances as links", () => {
    assert(employeeWithInstances.computers);

    renderWithProviders(<EmployeeDetails employee={employeeWithInstances} />);

    employeeWithInstances.computers.forEach((computer) => {
      const computerLink = screen.getByRole("link", { name: computer.title });
      expect(computerLink).toBeInTheDocument();
    });
  });
});
