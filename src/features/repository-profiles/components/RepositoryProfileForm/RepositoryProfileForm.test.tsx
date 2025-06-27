import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import RepositoryProfileForm from "./RepositoryProfileForm";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";

const user = userEvent.setup();

describe("RepositoryProfileForm", () => {
  it("submits valid form on add action", async () => {
    renderWithProviders(<RepositoryProfileForm action="add" />);

    await user.type(screen.getByLabelText(/Title/i), "repo‑test");
    await user.type(screen.getByLabelText(/Description/i), "test desc");

    await user.click(
      screen.getByRole("button", { name: /Add a new repository profile/i }),
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders save changes button on edit action", async () => {
    renderWithProviders(
      <RepositoryProfileForm action="edit" profile={repositoryProfiles[0]} />,
    );

    const saveButton = await screen.findByRole("button", {
      name: /edit repository profile/i,
    });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute("type", "submit");
    expect(saveButton).toHaveTextContent(/Save changes/i);
  });

  it("resets to first tab on validation error", async () => {
    renderWithProviders(<RepositoryProfileForm action="add" />);

    await user.click(screen.getByRole("tab", { name: "Pockets" }));
    await user.click(
      screen.getByRole("button", { name: /Add a new repository profile/i }),
    );

    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("shows validation errors for required fields", async () => {
    renderWithProviders(<RepositoryProfileForm action="add" />);

    await user.click(
      screen.getByRole("button", { name: /Add a new repository profile/i }),
    );

    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it("shows correct tab content when switching tabs", async () => {
    renderWithProviders(<RepositoryProfileForm action="add" />);
    await user.click(screen.getByRole("tab", { name: "Pockets" }));
    expect(screen.getByText("Distribution")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Details" }));
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
  });
});
