import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import AdministratorsPanelHeader from "./AdministratorsPanelHeader";

describe("AdministratorsPanelHeader", () => {
  it("renders search box", () => {
    renderWithProviders(<AdministratorsPanelHeader />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });
});
