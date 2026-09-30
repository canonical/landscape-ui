import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PasswordAccountCreationForm from "./PasswordAccountCreationForm";

const createStandaloneAccount = vi.fn().mockResolvedValue(undefined);
const signInAfterCreation = vi.fn().mockResolvedValue(undefined);

const defaultProps = {
  createStandaloneAccount,
  signInAfterCreation,
  submitting: false,
  oidcEnabled: false,
  ubuntuOneEnabled: false,
};

describe("PasswordAccountCreationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the password account creation fields", () => {
    renderWithProviders(<PasswordAccountCreationForm {...defaultProps} />);

    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("keeps account creation disabled until the form is valid", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PasswordAccountCreationForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: "Create account" });
    expect(submitButton).toHaveAttribute("aria-disabled", "true");

    await user.type(screen.getByLabelText("Full name"), "   ");
    expect(submitButton).toHaveAttribute("aria-disabled", "true");
    await user.clear(screen.getByLabelText("Full name"));

    await user.type(screen.getByLabelText("Full name"), "John Doe");
    await user.type(screen.getByLabelText("Email address"), "john@example.com");
    await user.type(screen.getByLabelText("Password"), "Password1234");

    expect(submitButton).toBeEnabled();
  });

  it("shows an error for an invalid email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PasswordAccountCreationForm {...defaultProps} />);

    await user.type(screen.getByLabelText("Email address"), "invalid-email");
    await user.tab();

    expect(
      await screen.findByText("Invalid email address"),
    ).toBeInTheDocument();
  });

  it("creates the account and signs in with email and password", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PasswordAccountCreationForm {...defaultProps} />);

    await user.type(screen.getByLabelText("Full name"), "  John Doe  ");
    await user.type(screen.getByLabelText("Email address"), "john@example.com");
    await user.type(screen.getByLabelText("Password"), "Password1234");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(createStandaloneAccount).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "Password1234",
    });
    expect(signInAfterCreation).toHaveBeenCalledWith({
      email: "john@example.com",
      password: "Password1234",
    });
  });
});
