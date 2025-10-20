import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountCreationSelfHostedForm from "./AccountCreationSelfHostedForm";

describe("AccountCreationSelfHostedForm", () => {
  const user = userEvent.setup();

  it("renders the form correctly", () => {
    renderWithProviders(<AccountCreationSelfHostedForm />);

    expect(
      screen.getByText("Create a new Landscape account"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeInTheDocument();
  });

  it("correctly disables button based on form validity", async () => {
    renderWithProviders(<AccountCreationSelfHostedForm />);

    const submitButton = screen.getByRole("button", { name: "Create account" });
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText("Full name"), "John Doe");
    await user.type(
      screen.getByLabelText("Email address"),
      "john.doe@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "Password1234");

    expect(submitButton).toBeEnabled();
  });

  it("shows validation error for invalid email", async () => {
    renderWithProviders(<AccountCreationSelfHostedForm />);

    await user.type(screen.getByLabelText("Email address"), "invalid-email");

    const submitButton = screen.getByRole("button", { name: "Create account" });
    await user.click(submitButton);

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });
});
