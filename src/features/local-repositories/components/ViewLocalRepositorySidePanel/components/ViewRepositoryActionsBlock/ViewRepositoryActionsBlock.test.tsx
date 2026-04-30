import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import ViewRepositoryActionsBlock from "./ViewRepositoryActionsBlock";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ViewRepositoryActionsBlock", () => {
  it("renders actions toggle button", () => {
    renderWithProviders(
      <ViewRepositoryActionsBlock repository={repositories[0]} />,
    );

    expect(
      screen.getByRole("button", { name: /actions/i }),
    ).toBeInTheDocument();
  });

  it("shows action items when actions menu is opened", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ViewRepositoryActionsBlock repository={repositories[0]} />,
    );

    await user.click(screen.getByRole("button", { name: /actions/i }));

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("renders responsive buttons menu", () => {
    renderWithProviders(
      <ViewRepositoryActionsBlock repository={repositories[0]} />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("shows publish action in menu", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ViewRepositoryActionsBlock repository={repositories[0]} />,
    );

    await user.click(screen.getByRole("button", { name: /actions/i }));

    expect(screen.getByText("Publish")).toBeInTheDocument();
  });

  it("renders remove action in menu", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ViewRepositoryActionsBlock repository={repositories[0]} />,
    );

    await user.click(screen.getByRole("button", { name: /actions/i }));

    expect(screen.getByText("Remove")).toBeInTheDocument();
  });
});
