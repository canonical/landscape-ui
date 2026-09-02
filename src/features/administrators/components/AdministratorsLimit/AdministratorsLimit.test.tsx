import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import AdministratorsLimit from "./AdministratorsLimit";

describe("AdministratorsLimit", () => {
  it("renders administrators count and limit", () => {
    renderWithProviders(
      <AdministratorsLimit administratorsCount={4} administratorsLimit={20} />,
    );

    expect(screen.getByText("Maximum administrators")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("Remaining administrators")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();
  });
});
