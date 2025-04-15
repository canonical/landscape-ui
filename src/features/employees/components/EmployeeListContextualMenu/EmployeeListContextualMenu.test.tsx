import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import EmployeeListContextualMenu from "./EmployeeListContextualMenu";
import { employees } from "@/tests/mocks/employees";
import { expectLoadingState } from "@/tests/helpers";

const activeEmployee = employees.find((employee) => employee.is_active);
const inactiveEmployee = employees.find((employee) => !employee.is_active);

describe("EmployeeListContextualMenu", () => {
  const user = userEvent.setup();
  assert(activeEmployee);
  assert(inactiveEmployee);

  it("renders the contextual menu toggle button with the correct aria-label", () => {
    renderWithProviders(
      <EmployeeListContextualMenu employee={activeEmployee} />,
    );

    expect(
      screen.getByLabelText(`${activeEmployee.name} actions`),
    ).toBeInTheDocument();
  });

  it("displays menu links when the toggle button is clicked for active employee", async () => {
    renderWithProviders(
      <EmployeeListContextualMenu employee={activeEmployee} />,
    );

    await user.click(screen.getByLabelText(`${activeEmployee.name} actions`));

    expect(
      screen.getByLabelText(`View ${activeEmployee.name} employee details`),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(`Deactivate ${activeEmployee.name}`),
    ).toBeInTheDocument();
  });

  it("displays menu links when the toggle button is clicked for inactive employee", async () => {
    renderWithProviders(
      <EmployeeListContextualMenu employee={inactiveEmployee} />,
    );

    await user.click(screen.getByLabelText(`${inactiveEmployee.name} actions`));

    expect(
      screen.getByLabelText(`View ${inactiveEmployee.name} employee details`),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(`Activate ${inactiveEmployee.name}`),
    ).toBeInTheDocument();
  });

  it("opens the side panel when 'View details' is clicked", async () => {
    renderWithProviders(
      <EmployeeListContextualMenu employee={activeEmployee} />,
    );

    await user.click(screen.getByLabelText(`${activeEmployee.name} actions`));
    await user.click(
      screen.getByLabelText(`View ${activeEmployee.name} employee details`),
    );

    await expectLoadingState();
  });

  it("opens the EmployeeActivationStatusModal when the activation link is clicked for active employee", async () => {
    renderWithProviders(
      <EmployeeListContextualMenu employee={activeEmployee} />,
    );

    await user.click(screen.getByLabelText(`${activeEmployee.name} actions`));
    await user.click(
      screen.getByLabelText(`Deactivate ${activeEmployee.name}`),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(screen.getByText(/from logging in to Landscape/i)).toBeVisible();
  });

  it("opens the EmployeeActivationStatusModal when the activation link is clicked for inactive employee", async () => {
    renderWithProviders(
      <EmployeeListContextualMenu employee={inactiveEmployee} />,
    );

    await user.click(screen.getByLabelText(`${inactiveEmployee.name} actions`));
    await user.click(
      screen.getByLabelText(`Activate ${inactiveEmployee.name}`),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(
      screen.getByText(
        /to log in to Landscape and register new instances with their account./i,
      ),
    ).toBeVisible();
  });
});
