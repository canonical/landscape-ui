import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import EmployeesTabs from ".";

describe("EmployeesTabs", () => {
  it("should render", async () => {
    renderWithProviders(<EmployeesTabs />);
    expect(screen.getByRole("tab", { name: "Employees" })).toBeInTheDocument();
    const link = screen.getByRole("tab", { name: "Autoinstall files" });
    expect(link).toBeInTheDocument();
    await userEvent.click(link);
  });
});
