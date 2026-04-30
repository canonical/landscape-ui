import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import EditLocalRepositoryForm from "./EditLocalRepositoryForm";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("EditLocalRepositoryForm", () => {
  it("renders form with editable fields", () => {
    renderWithProviders(
      <EditLocalRepositoryForm repository={repositories[0]} />,
    );

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^description$/i)).toBeInTheDocument();
  });

  it("pre-fills form with repository data", () => {
    renderWithProviders(
      <EditLocalRepositoryForm repository={repositories[0]} />,
    );

    expect(screen.getByDisplayValue("repo 1")).toBeInTheDocument();
  });

  it("renders distribution and component as read-only fields", () => {
    renderWithProviders(
      <EditLocalRepositoryForm repository={repositories[0]} />,
    );

    expect(screen.getByText("distribution 1")).toBeInTheDocument();
    expect(screen.getByText("component 1")).toBeInTheDocument();
  });

  it("shows lock icons for read-only fields", () => {
    renderWithProviders(
      <EditLocalRepositoryForm repository={repositories[0]} />,
    );

    const lockIcons = document.querySelectorAll(".p-icon--lock-locked");
    expect(lockIcons.length).toBeGreaterThan(0);
  });

  it("renders submit button", () => {
    renderWithProviders(
      <EditLocalRepositoryForm repository={repositories[0]} />,
    );

    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it("renders cancel button", () => {
    renderWithProviders(
      <EditLocalRepositoryForm repository={repositories[0]} />,
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("submits form with updated data", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditLocalRepositoryForm repository={repositories[0]} />,
    );

    const nameInput = screen.getByDisplayValue("repo 1");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Repository");

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(submitButton);

    expect(
      screen.queryByText(/this field is required/i),
    ).not.toBeInTheDocument();
  });

  it("validates required name field", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditLocalRepositoryForm repository={repositories[0]} />,
    );

    const nameInput = screen.getByDisplayValue("repo 1");
    await user.clear(nameInput);

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(submitButton);

    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it("displays description from repository", () => {
    renderWithProviders(
      <EditLocalRepositoryForm repository={repositories[1]} />,
    );

    expect(screen.getByDisplayValue("repo 2 description")).toBeInTheDocument();
  });
});
