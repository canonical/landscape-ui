import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import NewUserForm from "./NewUserForm";

const mockProps = {
  instanceId: 1,
};

describe("NewUserForm", () => {
  beforeEach(() => {
    renderWithProviders(<NewUserForm {...mockProps} />);
  });
  it("renders the form", () => {
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
  });

  it("renders form fields", () => {
    const form = screen.getByRole("form");
    expect(form).toHaveTexts([
      "Username",
      "Name",
      "Passphrase",
      "Confirm passphrase",
      "Primary Group",
      "Location",
      "Home phone",
      "Work phone",
    ]);

    const addUserButton = screen.getByRole("button", { name: /add user/i });
    expect(addUserButton).toBeInTheDocument();
  });
});
