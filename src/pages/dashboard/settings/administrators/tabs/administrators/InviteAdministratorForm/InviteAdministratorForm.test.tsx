import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InviteAdministratorForm from "./InviteAdministratorForm";

describe("InviteAdministratorForm", () => {
  const user = userEvent.setup();

  it("renders form", () => {
    renderWithProviders(<InviteAdministratorForm />);

    expect(
      screen.getByText(/an invitation, sent by email, contains a link/i),
    ).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /send invite/i });
    expect(submitButton).toBeInTheDocument();
  });

  it("selects roles", async () => {
    renderWithProviders(<InviteAdministratorForm />);

    const combobox = screen.getByRole("combobox", { name: /roles/i });
    await user.click(combobox);

    const checkboxes = screen.getAllByRole("checkbox");

    assert(checkboxes[0]);
    await user.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
  });
});
