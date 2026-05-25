import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoriesContainer from "./LocalRepositoriesContainer";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";

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
      screen.getByText("You don't have any local repositories yet"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add local repository/i }),
    ).toBeInTheDocument();
  });

  it("renders empty state with link to documentation", () => {
    renderWithProviders(
      <LocalRepositoriesContainer isPending={false} repositories={[]} />,
    );

    const link = screen.getByRole("link", {
      name: /learn more about repository mirroring/i,
    });
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("landscape/docs/repositories"),
    );
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders list when repositories are present", () => {
    renderWithProviders(
      <LocalRepositoriesContainer
        isPending={false}
        repositories={repositories}
      />,
    );

    expect(screen.getByText("repo 1")).toBeInTheDocument();
    expect(screen.getByText("repo 2")).toBeInTheDocument();
  });

  it("renders header with search when repositories are present", () => {
    renderWithProviders(
      <LocalRepositoriesContainer
        isPending={false}
        repositories={repositories}
      />,
    );

    expect(
      screen.getByRole("searchbox", { name: /search/i }),
    ).toBeInTheDocument();
  });
});
