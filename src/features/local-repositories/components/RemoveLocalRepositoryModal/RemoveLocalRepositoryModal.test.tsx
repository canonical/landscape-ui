import { renderWithProviders } from "@/tests/render";
import { describe, it, expect, vi } from "vitest";
import RemoveLocalRepositoryModal from "./RemoveLocalRepositoryModal";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectLoadingState } from "@/tests/helpers";

describe("RemoveLocalRepositoryModal", () => {
  const mockClose = vi.fn();
  const user = userEvent.setup();

  it("renders modal with title and proper buttons after loading", async () => {
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: /remove repo 1/i }),
    ).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", {
      name: /remove local repository/i,
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockClose).toHaveBeenCalled();
  });

  it("shows warning text when no publications", async () => {
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[2]}
      />,
    );

    await expectLoadingState();

    expect(
      screen.getByText(/will remove the local repository from landscape/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/this action is irreversible/i),
    ).toBeInTheDocument();
  });

  it("shows publications table when there are publications", async () => {
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    expect(
      await screen.findByRole("columnheader", { name: /publication/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /date published/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/this action is irreversible/i),
    ).toBeInTheDocument();
  });

  it("removes repository after typing confirmation text", async () => {
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    const confirmationInput = screen.getByPlaceholderText(
      `remove ${repositories[0].displayName}`,
    );
    await user.type(confirmationInput, `remove ${repositories[0].displayName}`);

    const removeButton = screen.getByRole("button", {
      name: /remove local repository/i,
    });
    await user.click(removeButton);

    expect(
      await screen.findByText(
        "The local repository has been removed from Landscape.",
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
