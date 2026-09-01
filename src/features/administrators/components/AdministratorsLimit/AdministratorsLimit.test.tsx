import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import AdministratorsLimit from "./AdministratorsLimit";

describe("AdministratorsLimit", () => {
  it("renders administrators count and limit", () => {
    renderWithProviders(
      <AdministratorsLimit administratorsCount={4} administratorsLimit={20} />,
    );

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("20 limit")).toBeInTheDocument();
  });

  it("does not render while loading", () => {
    const { container } = renderWithProviders(
      <AdministratorsLimit
        administratorsCount={4}
        administratorsLimit={20}
        isLoading
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
