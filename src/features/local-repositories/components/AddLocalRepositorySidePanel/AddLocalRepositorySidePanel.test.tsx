import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import AddLocalRepositorySidePanel from "./AddLocalRepositorySidePanel";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";

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

    await user.type(screen.getByLabelText(/name/i), "My Repository");
    await user.type(screen.getByLabelText(/distribution/i), "jammy");
    await user.type(screen.getByLabelText(/component/i), "main");

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

  it("shows an error notification when adding a repository fails", async () => {
    setEndpointStatus({ path: "locals", status: "error" });

    renderWithProviders(<AddLocalRepositorySidePanel />);

    await user.type(screen.getByLabelText(/name/i), "My Repository");
    await user.type(screen.getByLabelText(/distribution/i), "jammy");
    await user.type(screen.getByLabelText(/component/i), "main");

    const submitButton = screen.getByRole("button", {
      name: /add repository/i,
    });
    await user.click(submitButton);

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: "You have successfully added My Repository",
      }),
    ).not.toBeInTheDocument();
  });
});
