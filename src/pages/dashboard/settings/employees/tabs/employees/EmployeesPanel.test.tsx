import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import EmployeesPanel from "./EmployeesPanel";
import { EMPTY_STATE } from "./constants";
import { employees } from "@/tests/mocks/employees";

describe("EmployeesPanel", () => {
  it("renders list of employees", async () => {
    setEndpointStatus("default");

    renderWithProviders(<EmployeesPanel />);

    await expectLoadingState();

    for (const employee of employees) {
      expect(screen.getByText(employee.name)).toBeInTheDocument();
    }
  });

  it("renders empty state when no employees are found", async () => {
    setEndpointStatus("empty");

    renderWithProviders(<EmployeesPanel />);

    await expectLoadingState();

    expect(screen.getByText(EMPTY_STATE.title)).toBeInTheDocument();
    expect(screen.getByText(EMPTY_STATE.body)).toBeInTheDocument();
  });

  it("renders employee limit notification when limit is reached", async () => {
    vi.mock("./constants", () => ({
      EMPLOYEE_LIMIT: 0,
      EMPTY_STATE: { title: "No employees", body: "No employees found" },
    }));

    renderWithProviders(<EmployeesPanel />);

    await expectLoadingState();

    expect(screen.getByText(/Employee limit reached/i)).toBeInTheDocument();
  });
});
