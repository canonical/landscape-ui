import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import EmployeesTabs from ".";

describe("EmployeesTabs", () => {
  it("should switch tabs", async () => {
    renderWithProviders(<EmployeesTabs />, undefined, "/settings/employees");

    expect(screen.getByRole("link", { name: "Employees" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await userEvent.click(
      screen.getByRole("link", { name: "Autoinstall files" }),
    );

    expect(
      screen.getByRole("link", { name: "Autoinstall files" }),
    ).toHaveAttribute("aria-current", "page");
  });
});
