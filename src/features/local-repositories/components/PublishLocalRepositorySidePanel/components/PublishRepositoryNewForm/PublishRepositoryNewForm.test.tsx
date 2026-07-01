import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import PublishRepositoryNewForm from "./PublishRepositoryNewForm";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";

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

const [repository] = repositories;

const fillFormAndSubmit = async (
  installsAndUpgrades = "Automatic installs and upgrades",
  signingKey?: string,
) => {
  const user = userEvent.setup();

  const nameInput = screen.getByLabelText(/^publication name$/i);
  await user.type(nameInput, "Test Publication");

  if (signingKey) {
    await user.type(screen.getByLabelText(/signing gpg key/i), signingKey);
  }

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
    mockCreatePublication.mockResolvedValue({
      data: { name: "publications/test-publication" },
    });
  });

  it("renders form with block-scoped fields and form buttons", async () => {
    renderWithProviders(<PublishRepositoryNewForm repository={repository} />);

    expect(
      screen.getByRole("heading", { name: "Details" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/publication name/i)).toHaveValue("");
    expect(await screen.findByLabelText(/publication target/i)).toHaveValue(
      "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
    );
    expect(screen.getByLabelText(/signing gpg key/i)).toHaveValue("");

    expect(
      screen.getByRole("heading", { name: "Contents" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(repository.defaultDistribution),
    ).toBeInTheDocument();
    expect(screen.getByText(repository.defaultComponent)).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/installs and upgrades/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hash based indexing/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/skip bz2/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/skip generating content indexes/i),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /publish/i }),
    ).toBeInTheDocument();
  });

  it("validates required fields on submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PublishRepositoryNewForm repository={repository} />);

    const nameInput = screen.getByLabelText(/^publication name$/i);
    await user.click(nameInput);
    await user.tab();

    expect(
      await screen.findByText(/this field is required/i),
    ).toBeInTheDocument();
  });

  it("submits manual installs and upgrades values", async () => {
    renderWithProviders(<PublishRepositoryNewForm repository={repository} />);

    await fillFormAndSubmit(
      "Manual installs and upgrades",
      "-----BEGIN PGP PUBLIC KEY BLOCK-----",
    );

    expect(mockCreatePublication).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          notAutomatic: true,
          butAutomaticUpgrades: false,
          gpgKey: expect.objectContaining({
            armor: "-----BEGIN PGP PUBLIC KEY BLOCK-----",
          }),
        }),
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: `You have marked ${repository.displayName} to be published`,
      }),
    ).toBeInTheDocument();
  });

  it("submits automatic upgrades only values", async () => {
    renderWithProviders(<PublishRepositoryNewForm repository={repository} />);

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

  it("shows an error notification when publishing fails", async () => {
    mockCreatePublication.mockRejectedValue(
      new Error(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    );

    renderWithProviders(<PublishRepositoryNewForm repository={repository} />);

    await fillFormAndSubmit();

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: `You have marked ${repository.displayName} to be published`,
      }),
    ).not.toBeInTheDocument();
  });
});
