import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ActionsMenu from "./ActionsMenu";
import type { Action } from "@/types/Action";

const actions: Action[] = [
  { icon: "edit", label: "Edit", onClick: vi.fn() },
  { icon: "copy", label: "Copy", onClick: vi.fn() },
];

const destructiveActions: Action[] = [
  { icon: "delete", label: "Delete", onClick: vi.fn() },
];

describe("ActionsMenu", () => {
  const user = userEvent.setup();

  it("renders without crashing", () => {
    renderWithProviders(<ActionsMenu hasToggleIcon actions={actions} />);
    expect(document.body).toBeInTheDocument();
  });

  it("shows action labels when menu is opened", async () => {
    renderWithProviders(<ActionsMenu hasToggleIcon actions={actions} />);
    const toggle = screen.getByRole("button");
    await user.click(toggle);
    expect(await screen.findByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("renders destructive actions with negative suffix icons", async () => {
    renderWithProviders(
      <ActionsMenu
        hasToggleIcon
        actions={actions}
        destructiveActions={destructiveActions}
      />,
    );
    await user.click(screen.getByRole("button"));
    expect(await screen.findByText("Delete")).toBeInTheDocument();
  });

  it("excludes actions with excluded flag", async () => {
    const actionsWithExcluded: Action[] = [
      { icon: "edit", label: "Edit", onClick: vi.fn() },
      { icon: "copy", label: "Hidden", onClick: vi.fn(), excluded: true },
    ];
    renderWithProviders(
      <ActionsMenu hasToggleIcon actions={actionsWithExcluded} />,
    );
    await user.click(screen.getByRole("button"));
    expect(await screen.findByText("Edit")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });
});
