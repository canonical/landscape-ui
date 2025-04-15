import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import EmployeesPage from ".";

describe("EmployeesPage", () => {
  it("should render", async () => {
    renderWithProviders(<EmployeesPage />);
  });
});
