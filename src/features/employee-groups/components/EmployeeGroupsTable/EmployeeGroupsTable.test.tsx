import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import EmployeeGroupsTable from "./EmployeeGroupsTable";
import { employeeGroups } from "@/tests/mocks/employeeGroups";

describe("EmployeeGroupsTable", () => {
  it("should render", async () => {
    renderWithProviders(
      <EmployeeGroupsTable employeeGroups={employeeGroups} />,
    );
  });
});
