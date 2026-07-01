import { renderWithProviders } from "@/tests/render";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PublishRepositoryNewForm from "./PublishRepositoryNewForm";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockCreatePublication = vi.fn();
vi.mock("@/features/publications", async () => {
  const actual = await vi.importActual("@/features/publications");
  return {
    ...actual,
    useCreatePublication: () => ({
      createPublication: mockCreatePublication,
      isCreatingPublication: false,
    }),
  };
});

const fillFormAndSubmit = async (
  installsAndUpgrades = "Automatic installs and upgrades",
) => {
  const user = userEvent.setup();

  const nameInput = screen.getByLabelText(/^publication name$/i);
  await user.type(nameInput, "Test Publication");

  const targetSelect = screen.getByLabelText(/^publication target$/i);
  expect(await screen.findByText("prod-s3-us-east")).toBeInTheDocument();
  await user.selectOptions(
    targetSelect,
    "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
  );

  await user.click(
    screen.getByRole("button", { name: /installs and upgrades/i }),
  );
  await user.click(
    await screen.findByRole("option", {
      name: new RegExp(installsAndUpgrades, "i"),
    }),
  );

  await user.click(screen.getByRole("button", { name: /publish/i }));
};

describe("PublishRepositoryNewForm", () => {
  beforeEach(() => {
    mockCreatePublication.mockReset();
  });

  it("renders form with required fields", () => {
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    expect(screen.getByLabelText(/^publication name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^publication target$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/signing gpg key/i)).toBeInTheDocument();
  });

  it("renders settings block", () => {
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    expect(screen.getByText("Installs and upgrades")).toBeInTheDocument();
    expect(screen.getByLabelText(/hash based indexing/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/skip bz2/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/skip generating content indexes/i),
    ).toBeInTheDocument();
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
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    await fillFormAndSubmit();

    expect(mockCreatePublication).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          notAutomatic: false,
          butAutomaticUpgrades: false,
        }),
      }),
    );
  });

  it("submits manual installs and upgrades values", async () => {
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    await fillFormAndSubmit("Manual installs and upgrades");

    expect(mockCreatePublication).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          notAutomatic: true,
          butAutomaticUpgrades: false,
        }),
      }),
    );
  });

  it("submits automatic upgrades only values", async () => {
    renderWithProviders(
      <PublishRepositoryNewForm repository={repositories[0]} />,
    );

    await fillFormAndSubmit("Automatic upgrades only");

    expect(mockCreatePublication).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          notAutomatic: true,
          butAutomaticUpgrades: true,
        }),
      }),
    );
  });
});
