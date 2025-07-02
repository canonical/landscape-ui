import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import NewAPTSourceForm from "./NewAPTSourceForm";

describe("NewAPTSourceForm", () => {
  it("renders form fields", () => {
    const { container } = renderWithProviders(<NewAPTSourceForm />);

    expect(container).toHaveTexts([
      "Name",
      "APT Line",
      "GPG key",
      "Access group",
    ]);

    const addAPTSourceButton = screen.getByRole("button", {
      name: /add apt source/i,
    });
    expect(addAPTSourceButton).toBeInTheDocument();
  });
});
