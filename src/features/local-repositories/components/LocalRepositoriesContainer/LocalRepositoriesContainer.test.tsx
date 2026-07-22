import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoriesContainer from "./LocalRepositoriesContainer";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import { DEBARCHIVE_DOCUMENTATION_URL } from "@/features/repositories";

describe("LocalRepositoriesContainer", () => {
  it("renders loading state when isPending is true", () => {
    renderWithProviders(
      <LocalRepositoriesContainer isPending={true} repositories={[]} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders empty state when no repositories and no search", () => {
    renderWithProviders(
      <LocalRepositoriesContainer isPending={false} repositories={[]} />,
    );

    expect(
      screen.getByText("You don’t have any local repositories yet"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add local repository/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /learn more about repository mirroring/i,
      }),
    ).toHaveAttribute("href", DEBARCHIVE_DOCUMENTATION_URL);
  });

  it("renders header and list when repositories are present", () => {
    renderWithProviders(
      <LocalRepositoriesContainer
        isPending={false}
        repositories={repositories}
      />,
    );

    expect(
      screen.getByRole("searchbox", { name: /search/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(repositories[0].displayName)).toBeInTheDocument();
    expect(screen.getByText(repositories[1].displayName)).toBeInTheDocument();
  });
});
