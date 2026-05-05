import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import AccountCreationSaaSForm from "./AccountCreationSaaSForm";

describe("AccountCreationSaaSForm", () => {
  const user = userEvent.setup();

  afterEach(() => {
    setEndpointStatus("default");
  });

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

  it("submits the form when a valid title is provided", async () => {
    renderWithProviders(<AccountCreationSaaSForm />);

    const titleInput = screen.getByLabelText("Organization name");
    await user.type(titleInput, "My Organization");

    const submitButton = screen.getByRole("button", { name: "Create account" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText("This field is required."),
      ).not.toBeInTheDocument();
    });
  });

  it("handles API error gracefully when account creation fails", async () => {
    setEndpointStatus({ status: "error" });
    renderWithProviders(<AccountCreationSaaSForm />);

    const titleInput = screen.getByLabelText("Organization name");
    await user.type(titleInput, "My Organization");

    const submitButton = screen.getByRole("button", { name: "Create account" });
    await user.click(submitButton);

    await waitFor(() => {
      // Form stays mounted without crashing after error
      expect(
        screen.getByRole("button", { name: "Create account" }),
      ).toBeInTheDocument();
    });
  });
});
