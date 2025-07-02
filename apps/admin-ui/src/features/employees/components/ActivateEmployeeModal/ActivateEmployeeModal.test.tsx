import { employees } from "@/tests/mocks/employees";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ActivateEmployeeModal from "./ActivateEmployeeModal";

const handleClose = vi.fn();
const employee = employees.find((item) => !item.is_active);

describe("ActivateEmployeeModal", () => {
  const user = userEvent.setup();
  assert(employee);

  it("renders the modal with correct title, content and confirm button", () => {
    renderWithProviders(
      <ActivateEmployeeModal employee={employee} handleClose={handleClose} />,
    );

    expect(screen.getByText(`Activate ${employee.name}`)).toBeInTheDocument();
    expect(screen.getByText(/this will allow/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Activate" }),
    ).toBeInTheDocument();
  });

  it("activates the employee when confirm button is clicked", async () => {
    renderWithProviders(
      <ActivateEmployeeModal employee={employee} handleClose={handleClose} />,
    );

    const confirmButton = screen.getByRole("button", { name: "Activate" });
    await user.click(confirmButton);
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
