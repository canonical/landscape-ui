import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import EmployeeDetailsHeader from "./EmployeeDetailsHeader";
import { employees } from "@/tests/mocks/employees";

describe("EmployeeDetailsHeader", () => {
  const user = userEvent.setup();

  const activeEmployee = employees.find((employee) => employee.is_active);
  const inactiveEmployee = employees.find((employee) => !employee.is_active);
  assert(activeEmployee);
  assert(inactiveEmployee);

  it("renders the button with 'Deactivate' and pause icon for an active employee", () => {
    renderWithProviders(<EmployeeDetailsHeader employee={activeEmployee} />);

    const button = screen.getByRole("button", {
      name: "Deactivate",
    });

    expect(button).toHaveIcon("pause");
  });

  it("renders the button with 'Deactivate' and pause icon for an active employee", () => {
    renderWithProviders(<EmployeeDetailsHeader employee={inactiveEmployee} />);

    const button = screen.getByRole("button", {
      name: "Activate",
    });

    expect(button).toHaveIcon("play");
  });

  it("opens the EmployeeActivationStatusModal when the button is clicked", async () => {
    renderWithProviders(<EmployeeDetailsHeader employee={activeEmployee} />);

    const button = screen.getByRole("button", {
      name: "Deactivate",
    });

    await user.click(button);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
