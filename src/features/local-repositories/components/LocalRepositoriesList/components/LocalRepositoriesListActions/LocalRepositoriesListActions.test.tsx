import { renderWithProviders } from "@/tests/render";
import { describe, it, expect, vi } from "vitest";
import LocalRepositoriesListActions from "./LocalRepositoriesListActions";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as hooks from "../../../../hooks";

describe("LocalRepositoriesListActions", () => {
  const mockViewAction = {
    label: "View details",
    onClick: vi.fn(),
    icon: "show",
  };

  const mockAction = {
    label: "Edit",
    onClick: vi.fn(),
    icon: "edit",
  };

  const mockDestructiveAction = {
    label: "Remove",
    onClick: vi.fn(),
    icon: "delete",
    appearance: "negative",
  };

  beforeEach(() => {
    vi.spyOn(hooks, "useGetRepositoryActions").mockReturnValue({
      viewAction: mockViewAction,
      actions: [mockAction],
      destructiveActions: [mockDestructiveAction],
    });
  });

  it("renders actions menu button", () => {
    renderWithProviders(
      <LocalRepositoriesListActions repository={repositories[0]} />,
    );

    expect(
      screen.getByRole("button", { name: /repo 1 actions/i }),
    ).toBeInTheDocument();
  });

  it("opens menu when toggled", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LocalRepositoriesListActions repository={repositories[0]} />,
    );

    const toggleButton = screen.getByRole("button", {
      name: /repo 1 actions/i,
    });
    await user.click(toggleButton);

    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("renders removal modal when close is called", () => {
    renderWithProviders(
      <LocalRepositoriesListActions repository={repositories[0]} />,
    );

    expect(
      screen.queryByRole("heading", { name: /remove repo 1/i }),
    ).not.toBeInTheDocument();
  });

  it("passes repository display name to aria label", () => {
    renderWithProviders(
      <LocalRepositoriesListActions repository={repositories[1]} />,
    );

    expect(
      screen.getByRole("button", { name: /repo 2 actions/i }),
    ).toBeInTheDocument();
  });
});
