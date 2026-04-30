import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import AddLocalRepositorySidePanel from "./AddLocalRepositorySidePanel";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("AddLocalRepositorySidePanel", () => {
  const user = userEvent.setup();

  it("renders form with title, fields, and buttons", () => {
    renderWithProviders(<AddLocalRepositorySidePanel />);

    expect(
      screen.getByRole("heading", { name: "Add local repository" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^description$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^distribution$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^component$/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Add repository" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    renderWithProviders(<AddLocalRepositorySidePanel />);

    const submitButton = screen.getByRole("button", {
      name: /add repository/i,
    });
    await user.click(submitButton);

    expect(screen.getAllByText(/this field is required/i)).toHaveLength(3);
  });

  it("allows description to be empty on submission", async () => {
    renderWithProviders(<AddLocalRepositorySidePanel />);

    const nameInput = screen.getByLabelText(/^name$/i);
    const distributionInput = screen.getByLabelText(/^distribution$/i);
    const componentInput = screen.getByLabelText(/^component$/i);

    await user.type(nameInput, "My Repository");
    await user.type(distributionInput, "jammy");
    await user.type(componentInput, "main");

    const submitButton = screen.getByRole("button", {
      name: /add repository/i,
    });
    await user.click(submitButton);

    expect(
      screen.getByRole("heading", {
        name: "You have successfully added My Repository",
      }),
    ).toBeInTheDocument();
  });
});
