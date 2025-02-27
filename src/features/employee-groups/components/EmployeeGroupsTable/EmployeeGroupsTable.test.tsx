import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import EmployeeGroupsTable from "./EmployeeGroupsTable";

describe("EmployeeGroupsTable", () => {
  it("should render", async () => {
    renderWithProviders(<EmployeeGroupsTable />);
  });
});
