import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import { EMPTY_STATE } from "./constants";
import EmployeeGroupsPanel from "./EmployeeGroupsPanel";
import { employeeGroups } from "@/tests/mocks/employees";

describe("EmployeeGroupsPanel", () => {
  it("renders list of employees", async () => {
    renderWithProviders(<EmployeeGroupsPanel />);

    await expectLoadingState();

    for (const group of employeeGroups) {
      const elements = screen.getAllByText(group.name);
      expect(elements.length).toBeGreaterThan(0);
    }
  });

  it("renders empty state when no employees are found", async () => {
    setEndpointStatus("empty");

    renderWithProviders(<EmployeeGroupsPanel />);

    await expectLoadingState();

    expect(screen.getByText(EMPTY_STATE.title)).toBeInTheDocument();
  });
});
