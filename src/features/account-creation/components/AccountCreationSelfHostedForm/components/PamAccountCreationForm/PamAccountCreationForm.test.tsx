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

  it("renders the PAM account creation fields", () => {
    renderWithProviders(<PamAccountCreationForm {...defaultProps} />);

    expect(screen.getByLabelText("PAM identity")).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("PAM password")).toBeInTheDocument();
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

  it("requires a nonblank name and identity", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PamAccountCreationForm {...defaultProps} />);

    await user.type(screen.getByLabelText("Full name"), "   ");
    await user.type(screen.getByLabelText("Email address"), "john@example.com");
    await user.type(screen.getByLabelText("PAM identity"), "   ");
    await user.type(screen.getByLabelText("PAM password"), "PAMPassword1");

    expect(await screen.findAllByText("This field is required")).toHaveLength(
      2,
    );
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(createStandaloneAccount).not.toHaveBeenCalled();
  });

  it("explains the forbidden PAM identity characters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PamAccountCreationForm {...defaultProps} />);

    await user.type(screen.getByLabelText("Full name"), "John Doe");
    await user.type(screen.getByLabelText("Email address"), "john@example.com");
    await user.type(screen.getByLabelText("PAM identity"), "john*doe");
    await user.type(screen.getByLabelText("PAM password"), "PAMPassword1");

    expect(
      await screen.findByText(
        "Identity cannot contain these characters: (, ), *, \\, or \\0 (NUL).",
      ),
    ).toBeInTheDocument();
    expect(createStandaloneAccount).not.toHaveBeenCalled();
  });
});
