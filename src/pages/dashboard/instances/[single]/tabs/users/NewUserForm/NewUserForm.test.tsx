import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import NewUserForm from "./NewUserForm";

const mockProps = {
  instanceId: 1,
};

describe("NewUserForm", () => {
  it("renders the form", () => {
    renderWithProviders(<NewUserForm {...mockProps} />);
    const formElement = screen.getByRole("form");
    expect(formElement).toBeInTheDocument();
  });

  it("renders form fields", () => {
    const { container } = renderWithProviders(<NewUserForm {...mockProps} />);
    expect(container).toHaveTexts([
      "Username",
      "Name",
      "Passphrase",
      "Confirm passphrase",
      "Primary Group",
      "Location",
      "Home phone",
      "Work phone",
    ]);
  });
});
