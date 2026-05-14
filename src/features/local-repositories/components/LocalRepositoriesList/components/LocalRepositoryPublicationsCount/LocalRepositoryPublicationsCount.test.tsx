import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoryPublicationsCount from "./LocalRepositoryPublicationsCount";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";

describe("LocalRepositoryPublicationsCount", () => {
  it("renders loading state while fetching publications", () => {
    renderWithProviders(
      <LocalRepositoryPublicationsCount repository={repositories[0]} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders publication count as link when loaded", async () => {
    renderWithProviders(
      <LocalRepositoryPublicationsCount repository={repositories[0]} />,
    );

    expect(await screen.findByRole("link")).toBeInTheDocument();
    expect(screen.getByText(/1 publication/i)).toBeInTheDocument();
  });

  it("does not render zero publications text for mocked endpoint", async () => {
    renderWithProviders(
      <LocalRepositoryPublicationsCount repository={repositories[0]} />,
    );

    expect(await screen.findByText(/1 publication/i)).toBeInTheDocument();
    expect(screen.queryByText(/0 publications/i)).not.toBeInTheDocument();
  });
});
