import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PublicationTargetListActions from "./PublicationTargetListActions";

vi.mock("../EditTargetForm/EditTargetForm", () => ({
  default: () => <div>Edit target form</div>,
}));

vi.mock("../RemoveTargetForm/RemoveTargetForm", () => ({
  default: () => <div>Remove target form</div>,
}));

const targetWithDisplayName = publicationTargets[0]!;

describe("PublicationTargetListActions", () => {
  const user = userEvent.setup();

  it("renders the actions toggle button with display_name", () => {
    renderWithProviders(
      <PublicationTargetListActions target={targetWithDisplayName} />,
    );

    expect(
      screen.getByRole("button", {
        name: `${targetWithDisplayName.displayName} actions`,
      }),
    ).toBeInTheDocument();
  });

  it("shows View details, Edit, and Remove actions in the dropdown", async () => {
    renderWithProviders(
      <PublicationTargetListActions target={targetWithDisplayName} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: `${targetWithDisplayName.displayName} actions`,
      }),
    );

    expect(
      await screen.findByRole("menuitem", {
        name: `View details for ${targetWithDisplayName.displayName}`,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("menuitem", {
        name: `Edit ${targetWithDisplayName.displayName}`,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("menuitem", {
        name: `Remove ${targetWithDisplayName.displayName}`,
      }),
    ).toBeInTheDocument();
  });

  it("opens side panel with target details on View details", async () => {
    renderWithProviders(
      <PublicationTargetListActions target={targetWithDisplayName} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: `${targetWithDisplayName.displayName} actions`,
      }),
    );
    await user.click(
      await screen.findByRole("menuitem", {
        name: `View details for ${targetWithDisplayName.displayName}`,
      }),
    );

    // Side panel header should show target displayName
    expect(
      screen.getByRole("heading", { name: targetWithDisplayName.displayName }),
    ).toBeInTheDocument();
  });

  it("opens side panel with edit form on Edit", async () => {
    renderWithProviders(
      <PublicationTargetListActions target={targetWithDisplayName} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: `${targetWithDisplayName.displayName} actions`,
      }),
    );
    await user.click(
      await screen.findByRole("menuitem", {
        name: `Edit ${targetWithDisplayName.displayName}`,
      }),
    );

    // Side panel header should show edit title
    expect(
      screen.getByRole("heading", {
        name: `Edit ${targetWithDisplayName.displayName}`,
      }),
    ).toBeInTheDocument();
  });

  it("opens side panel with remove form on Remove", async () => {
    renderWithProviders(
      <PublicationTargetListActions target={targetWithDisplayName} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: `${targetWithDisplayName.displayName} actions`,
      }),
    );
    await user.click(
      await screen.findByRole("menuitem", {
        name: `Remove ${targetWithDisplayName.displayName}`,
      }),
    );

    // Side panel header should show remove title
    expect(
      screen.getByRole("heading", {
        name: `Remove ${targetWithDisplayName.displayName}`,
      }),
    ).toBeInTheDocument();
  });
});
