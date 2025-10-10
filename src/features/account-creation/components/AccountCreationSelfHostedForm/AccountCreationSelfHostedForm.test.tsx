import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountCreationSelfHostedForm from "./AccountCreationSelfHostedForm";

describe("AccountCreationSelfHostedForm", () => {
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

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccountCreationSelfHostedForm />);

    const submitButton = screen.getByRole("button", { name: "Create account" });
    await user.click(submitButton);

    expect(screen.getAllByText("This field is required")).toHaveLength(2);
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccountCreationSelfHostedForm />);

    await user.type(screen.getByLabelText("Email address"), "invalid-email");

    const submitButton = screen.getByRole("button", { name: "Create account" });
    await user.click(submitButton);

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });
});
