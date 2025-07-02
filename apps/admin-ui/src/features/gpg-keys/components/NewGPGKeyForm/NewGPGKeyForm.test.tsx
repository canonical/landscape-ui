import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import NewGPGKeyForm from "./NewGPGKeyForm";

describe("NewGPGKeyForm", () => {
  it("renders form fields", () => {
    const { container } = renderWithProviders(<NewGPGKeyForm />);

    expect(container).toHaveTexts(["Name", "Material"]);

    const addGPGKeyButton = screen.getByRole("button", {
      name: /import key/i,
    });
    expect(addGPGKeyButton).toBeInTheDocument();
  });
});
