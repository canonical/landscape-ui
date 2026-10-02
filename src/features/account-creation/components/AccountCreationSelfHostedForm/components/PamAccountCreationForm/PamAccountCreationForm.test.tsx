import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PamAccountCreationForm from "./PamAccountCreationForm";

const createStandaloneAccount = vi.fn().mockResolvedValue(undefined);
const signInAfterCreation = vi.fn().mockResolvedValue(undefined);

const defaultProps = {
  createStandaloneAccount,
  signInAfterCreation,
  submitting: false,
  oidcEnabled: false,
  ubuntuOneEnabled: false,
};

describe("PamAccountCreationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates the account and signs in with the PAM identity", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PamAccountCreationForm {...defaultProps} />);

    await user.type(screen.getByLabelText("Full name"), "John Doe");
    await user.type(screen.getByLabelText("Email address"), "john@example.com");
    await user.type(screen.getByLabelText("PAM identity"), "john");
    await user.type(screen.getByLabelText("PAM password"), "PAMPassword1");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(createStandaloneAccount).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      identity: "john",
      password: "PAMPassword1",
    });
    expect(signInAfterCreation).toHaveBeenCalledWith({
      identity: "john",
      password: "PAMPassword1",
    });
  });
});
