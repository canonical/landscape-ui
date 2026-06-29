import { setEndpointStatus } from "@/tests/controllers/controller";
import { employees } from "@/tests/mocks/employees";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import EmployeesPanel from "./EmployeesPanel";
import { EMPTY_STATE } from "./constants";

describe("EmployeesPanel", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders list of employees", async () => {
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
    setEndpointStatus({
      status: "variant",
      path: "employees",
      response: {
        count: 100_000,
        next: null,
        previous: null,
        results: employees.slice(0, 1),
      },
    });

    renderWithProviders(<EmployeesPanel />);

    await expectLoadingState();

    expect(screen.getByText(/Employee limit reached/i)).toBeInTheDocument();
  });
});
