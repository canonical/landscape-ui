import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import EmployeesPanel from ".";

describe("EmployeesPanel", () => {
  it("should render", async () => {
    renderWithProviders(<EmployeesPanel />);
  });
});
