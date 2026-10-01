import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach } from "vitest";
import { setEndpointStatus } from "@/tests/controllers/controller";
import InviteAdministratorForm from "./InviteAdministratorForm";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";

describe("InviteAdministratorForm", () => {
  afterEach(() => {
    setEndpointStatus("default");
  });

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
    const user = userEvent.setup();
    renderWithProviders(<InviteAdministratorForm />);

    const combobox = screen.getByRole("combobox", { name: /roles/i });
    await user.click(combobox);

    const checkboxes = screen.getAllByRole("checkbox");

    assert(checkboxes[0]);
    await user.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
  });

  it("shows validation error when name is empty and form is submitted", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InviteAdministratorForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /send invite/i });
    await user.click(submitButton);

    expect(
      await screen.findByText("This field is required."),
    ).toBeInTheDocument();
  });

  it("shows validation error when email is invalid", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InviteAdministratorForm />);

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "John Doe");

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /send invite/i });
    await user.click(submitButton);

    expect(
      await screen.findByText("Please provide a valid email address"),
    ).toBeInTheDocument();
  });

  it("shows validation error when email is already invited", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InviteAdministratorForm />);

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "New User");

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "ben@example.com");

    const submitButton = screen.getByRole("button", { name: /send invite/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/is already invited to this account/i),
    ).toBeInTheDocument();
  });

  it("submits successfully with valid data and closes side panel", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InviteAdministratorForm />);

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "Jane Smith");

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "jane.smith@example.com");

    const submitButton = screen.getByRole("button", { name: /send invite/i });
    await user.click(submitButton);

    expect(
      await screen.findByText("You sent an administrator invite"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Jane Smith will receive an invitation email"),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /send invite/i }),
    ).not.toBeInTheDocument();
  });

  it("shows error notification when API call fails and side panel remains open", async () => {
    setEndpointStatus({ status: "error", path: "InviteAdministrator" });
    const user = userEvent.setup();
    renderWithProviders(<InviteAdministratorForm />);

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "Bob Wilson");

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "bob.wilson@example.com");

    const submitButton = screen.getByRole("button", { name: /send invite/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("button", { name: /send invite/i }),
    ).toBeInTheDocument();
  });
});
