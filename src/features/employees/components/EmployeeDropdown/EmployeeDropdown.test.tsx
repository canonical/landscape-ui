import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, vi } from "vitest";
import EmployeeDropdown from "./EmployeeDropdown";
import { employees as mockEmployees } from "@/tests/mocks/employees";

const props: ComponentProps<typeof EmployeeDropdown> = {
  employee: null,
  setEmployee: vi.fn(),
  error: undefined,
};

describe("EmployeeDropdown", () => {
  beforeEach(async () => {
    renderWithProviders(
      <EmployeeDropdown {...props} />,
      undefined,
      "/instances/1",
      "instances/:instanceId",
    );
  });

  it("renders employee dropdown search component", () => {
    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).toBeInTheDocument();
  });

  describe("employee selection flow", () => {
    it("shows matching employees after searching", async () => {
      const searchBox = screen.getByRole("searchbox");
      await userEvent.type(searchBox, "John");
      expect(searchBox).toHaveValue("John");

      const employees = await screen.findAllByText("John");
      const matchinEmployees = mockEmployees.filter((employee) =>
        employee.name.includes("John"),
      );
      //expected length 2, since John Smith and John Doe should be returned
      expect(employees).toHaveLength(matchinEmployees.length);
    });

    it("shows error if no matching employees found", async () => {
      const searchBox = screen.getByRole("searchbox");
      await userEvent.type(searchBox, "checking for error");
      expect(searchBox).toHaveValue("checking for error");

      const errorText = await screen.findByText(/No employees found by/i);
      expect(errorText).toBeVisible();
    });
  });
});
