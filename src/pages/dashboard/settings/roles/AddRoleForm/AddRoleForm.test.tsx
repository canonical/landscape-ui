import { renderWithProviders } from "@/tests/render";
import AddRoleForm from "./AddRoleForm";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("AddRoleForm", () => {
  const user = userEvent.setup();

  it("renders correctly", () => {
    renderWithProviders(<AddRoleForm />);

    expect(
      screen.getByRole("textbox", { name: /role name/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /description/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("table")).toHaveLength(2);

    expect(screen.getByText("Access Groups")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /add role/i }),
    ).toBeInTheDocument();
  });

  it("shows error messages when form is submitted with invalid data", async () => {
    renderWithProviders(<AddRoleForm />);

    await user.click(screen.getByRole("button", { name: /add role/i }));

    expect(
      await screen.findByText(/this field is required/i),
    ).toBeInTheDocument();
  });

  it("shows error message when an invalid name is entered", async () => {
    renderWithProviders(<AddRoleForm />);

    await user.type(screen.getByRole("textbox", { name: /role name/i }), "123");
    await user.click(screen.getByRole("button", { name: /add role/i }));

    expect(
      await screen.findByText(
        /name must start with a letter and can contain alphanumeric/i,
      ),
    ).toBeInTheDocument();
  });
});
