import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountCreationSaaSForm from "./AccountCreationSaaSForm";

describe("AccountCreationSaaSForm", () => {
  const user = userEvent.setup();

  it("renders the form correctly", () => {
    renderWithProviders(<AccountCreationSaaSForm />);

    expect(
      screen.getByText("Create a new Landscape SaaS account"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "There is no Landscape organization related to your account.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Organization name")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This will be the name of the Landscape account for your organization.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeInTheDocument();
  });

  it("shows validation error for empty title", async () => {
    renderWithProviders(<AccountCreationSaaSForm />);

    const submitButton = screen.getByRole("button", { name: "Create account" });
    await user.click(submitButton);

    expect(screen.getByText("This field is required.")).toBeInTheDocument();
  });
});
