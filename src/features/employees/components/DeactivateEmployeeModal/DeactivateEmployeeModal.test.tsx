import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import DeactivateEmployeeModal from "./DeactivateEmployeeModal";
import { employees } from "@/tests/mocks/employees";

const handleClose = vi.fn();
const employee = employees.find((employee) => employee.is_active);

describe("DeactivateEmployeeModal", () => {
  const user = userEvent.setup();
  assert(employee);

  it("renders the modal with correct content", () => {
    renderWithProviders(
      <DeactivateEmployeeModal employee={employee} handleClose={handleClose} />,
    );

    expect(screen.getByText(/this will prevent/i)).toBeInTheDocument();
    expect(screen.getByText(/additional actions/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Sanitize associated instances/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Remove associated instances from Landscape/i),
    ).toBeInTheDocument();
  });

  it("disables and then enables the confirm button for the sanitize action", async () => {
    renderWithProviders(
      <DeactivateEmployeeModal employee={employee} handleClose={handleClose} />,
    );

    const modal = screen.getByRole("dialog");
    const sanitizeCheckbox = within(modal).getByLabelText(
      /sanitize associated instances/i,
    );
    await user.click(sanitizeCheckbox);

    const sanitizeInput = within(modal).getByLabelText(
      "Sanitization confirmation text",
    );
    const confirmButton = within(modal).getByRole("button", {
      name: /deactivate/i,
    });

    expect(confirmButton).toBeDisabled();

    await user.clear(sanitizeInput);
    await user.type(sanitizeInput, "wrong text");
    expect(confirmButton).toBeDisabled();

    await user.clear(sanitizeInput);
    await user.type(sanitizeInput, "sanitize instances");
    expect(confirmButton).not.toBeDisabled();
  });

  it("disables and then enables the confirm button for the remove action", async () => {
    renderWithProviders(
      <DeactivateEmployeeModal employee={employee} handleClose={handleClose} />,
    );

    const modal = screen.getByRole("dialog");
    const removeCheckbox = within(modal).getByLabelText(
      /Remove associated instances from Landscape/i,
    );
    await user.click(removeCheckbox);

    const removeInput = within(modal).getByLabelText(
      "Remove from Landscape confirmation text",
    );
    const confirmButton = within(modal).getByRole("button", {
      name: /deactivate/i,
    });

    expect(confirmButton).toBeDisabled();

    await user.clear(removeInput);
    await user.type(removeInput, "wrong text");
    expect(confirmButton).toBeDisabled();

    await user.clear(removeInput);
    await user.type(removeInput, "remove instances");
    expect(confirmButton).not.toBeDisabled();
  });

  it("disables and then enables the confirm button for the remove action and sanitize action", async () => {
    renderWithProviders(
      <DeactivateEmployeeModal employee={employee} handleClose={handleClose} />,
    );

    const modal = screen.getByRole("dialog");
    const removeCheckbox = within(modal).getByLabelText(
      /Remove associated instances from Landscape/i,
    );
    await user.click(removeCheckbox);

    const removeInput = within(modal).getByLabelText(
      "Remove from Landscape confirmation text",
    );
    const confirmButton = within(modal).getByRole("button", {
      name: /deactivate/i,
    });

    expect(confirmButton).toBeDisabled();

    const sanitizeCheckbox = within(modal).getByLabelText(
      /sanitize associated instances/i,
    );
    await user.click(sanitizeCheckbox);

    const sanitizeInput = within(modal).getByLabelText(
      "Sanitization confirmation text",
    );

    expect(confirmButton).toBeDisabled();

    await user.clear(removeInput);
    await user.type(removeInput, "wrong text");
    expect(confirmButton).toBeDisabled();

    await user.clear(sanitizeInput);
    await user.type(sanitizeInput, "wrong text");

    await user.clear(removeInput);
    await user.clear(sanitizeInput);

    await user.type(sanitizeInput, "sanitize instances");
    await user.type(removeInput, "remove instances");
    expect(confirmButton).not.toBeDisabled();
  });

  it("submits the form and calls handleClose", async () => {
    renderWithProviders(
      <DeactivateEmployeeModal employee={employee} handleClose={handleClose} />,
    );

    const modal = screen.getByRole("dialog");
    const confirmButton = within(modal).getByRole("button", {
      name: /deactivate/i,
    });

    await user.click(confirmButton);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
