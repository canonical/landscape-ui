import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import EmployeesPanelHeader from "./EmployeesPanelHeader";
import { describe, it, expect } from "vitest";

describe("EmployeesPanelHeader", () => {
  it("renders header with search and filter components when employees data is available", () => {
    renderWithProviders(<EmployeesPanelHeader />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
  });
});
