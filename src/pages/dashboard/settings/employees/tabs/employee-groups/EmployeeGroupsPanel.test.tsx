import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import { EMPTY_STATE_NO_GROUPS, EMPTY_STATE_NO_ISSUERS } from "./constants";
import EmployeeGroupsPanel from "./EmployeeGroupsPanel";
import { employeeGroups } from "@/tests/mocks/employeeGroups";

describe("EmployeeGroupsPanel", () => {
  afterEach(() => {
    setEndpointStatus({ status: "default" });
  });

  it("renders list of employees", async () => {
    renderWithProviders(<EmployeeGroupsPanel />);

    await expectLoadingState();

    for (const group of employeeGroups) {
      const elements = screen.getAllByText(group.name);
      expect(elements.length).toBeGreaterThan(0);
    }
  });

  it("renders empty state when no issuers found", async () => {
    setEndpointStatus({ status: "empty", path: "auth/oidc-issuers" });
    setEndpointStatus({ status: "empty", path: "employee_groups" });

    renderWithProviders(<EmployeeGroupsPanel />);

    await expectLoadingState();

    expect(screen.getByText(EMPTY_STATE_NO_ISSUERS.title)).toBeInTheDocument();
  });

  it("renders empty state when no groups found", async () => {
    setEndpointStatus({ status: "empty", path: "employee_groups" });

    renderWithProviders(<EmployeeGroupsPanel />);

    await expectLoadingState();

    expect(screen.getByText(EMPTY_STATE_NO_GROUPS.title)).toBeInTheDocument();
  });
});
