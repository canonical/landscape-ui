import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import NewUserForm from "./NewUserForm";

describe("NewUserForm", () => {
  beforeEach(() => {
    renderWithProviders(<NewUserForm />);
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
      "Password",
      "Confirm password",
      "Primary Group",
      "Location",
      "Home phone",
      "Work phone",
    ]);

    const addUserButton = screen.getByRole("button", { name: /add user/i });
    expect(addUserButton).toBeInTheDocument();
  });
});
