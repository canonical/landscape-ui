import { renderWithProviders } from "@/tests/render";
import { describe, it, expect, vi } from "vitest";
import RemoveLocalRepositoryModal from "./RemoveLocalRepositoryModal";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("RemoveLocalRepositoryModal", () => {
  const mockClose = vi.fn();

  it("renders modal with repository name in title", () => {
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /remove repo 1/i }),
    ).toBeInTheDocument();
  });

  it("shows warning text when no publications", () => {
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    expect(
      screen.getByText(/will remove the local repository from landscape/i),
    ).toBeInTheDocument();
  });

  it("shows irreversible warning", () => {
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    expect(
      screen.getByText(/this action is irreversible/i),
    ).toBeInTheDocument();
  });

  it("renders confirm button with correct label", () => {
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    expect(
      screen.getByRole("button", { name: /remove local repository/i }),
    ).toBeInTheDocument();
  });

  it("renders cancel button", () => {
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("does not submit removal before confirmation text is entered", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    const confirmButton = screen.getByRole("button", {
      name: /remove local repository/i,
    });
    await user.click(confirmButton);

    expect(mockClose).not.toHaveBeenCalled();
  });

  it("shows confirmation prompt text", () => {
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    expect(screen.getByText(/type/i)).toBeInTheDocument();
    expect(screen.getAllByText(/remove repo 1/i).length).toBeGreaterThan(0);
  });

  it("renders modal close icon button", () => {
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    expect(
      screen.getByRole("button", { name: /close active modal/i }),
    ).toBeInTheDocument();
  });

  it("calls close callback when modal is closed", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <RemoveLocalRepositoryModal
        close={mockClose}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockClose).toHaveBeenCalled();
  });
});
