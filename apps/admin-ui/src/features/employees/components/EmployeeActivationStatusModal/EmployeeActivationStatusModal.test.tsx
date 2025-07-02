import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EmployeeActivationStatusModal from "./EmployeeActivationStatusModal";
import { employees } from "@/tests/mocks/employees";

const handleClose = vi.fn();
const activeEmployee = employees.find((employee) => employee.is_active);
const inactiveEmployee = employees.find((employee) => !employee.is_active);

describe("EmployeeActivationStatusModal", () => {
  assert(activeEmployee);
  assert(inactiveEmployee);

  it("renders DeactivateEmployeeModal when the employee is active", () => {
    renderWithProviders(
      <EmployeeActivationStatusModal
        employee={activeEmployee}
        handleClose={handleClose}
      />,
    );

    expect(screen.getByText("Deactivate")).toBeInTheDocument();
  });

  it("renders ActivateEmployeeModal when the employee is inactive", () => {
    renderWithProviders(
      <EmployeeActivationStatusModal
        employee={inactiveEmployee}
        handleClose={handleClose}
      />,
    );

    expect(screen.getByText("Activate")).toBeInTheDocument();
  });
});
