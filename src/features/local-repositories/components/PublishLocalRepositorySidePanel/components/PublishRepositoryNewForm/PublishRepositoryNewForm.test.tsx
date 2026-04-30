import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import PublishRepositoryNewForm from "./PublishRepositoryNewForm";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("PublishRepositoryNewForm", () => {
  it("renders form with required fields", () => {
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    expect(screen.getByLabelText(/^publication name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^publication target$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/signing gpg key/i)).toBeInTheDocument();
  });

  it("renders checkbox settings", () => {
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    expect(screen.getByLabelText(/hash based indexing/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/automatic installation/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/automatic upgrades/i)).toBeInTheDocument();
  });

  it("renders contents block", () => {
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    expect(screen.getByText("Contents")).toBeInTheDocument();
  });

  it("renders publish button", () => {
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    expect(
      screen.getByRole("button", { name: /publish/i }),
    ).toBeInTheDocument();
  });

  it("validates required fields on submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    const nameInput = screen.getByLabelText(/^publication name$/i);
    await user.click(nameInput);
    await user.tab();

    expect(
      await screen.findByText(/this field is required/i),
    ).toBeInTheDocument();
  });

  it("loads and displays publication targets", async () => {
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    expect(await screen.findByText("prod-s3-us-east")).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    const nameInput = screen.getByLabelText(/^publication name$/i);
    await user.type(nameInput, "Test Publication");

    const targetSelect = screen.getByLabelText(/^publication target$/i);
    expect(await screen.findByText("prod-s3-us-east")).toBeInTheDocument();
    await user.selectOptions(
      targetSelect,
      "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
    );

    const submitButton = screen.getByRole("button", { name: /publish/i });
    await user.click(submitButton);
  });

  it("renders help text for settings", () => {
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    const helpTexts = screen.getAllByText("Help");
    expect(helpTexts.length).toBeGreaterThan(0);
  });
});
