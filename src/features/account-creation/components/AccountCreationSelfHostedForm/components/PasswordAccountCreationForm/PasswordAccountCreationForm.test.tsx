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
