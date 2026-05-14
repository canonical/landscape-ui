import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoryPackagesCount from "./LocalRepositoryPackagesCount";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";

describe("LocalRepositoryPackagesCount", () => {
  it("renders loading state while fetching packages", () => {
    renderWithProviders(
      <LocalRepositoryPackagesCount repository={repositories[0]} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders package count when loaded", async () => {
    renderWithProviders(
      <LocalRepositoryPackagesCount repository={repositories[0]} />,
    );

    expect(await screen.findByText(/25 packages/i)).toBeInTheDocument();
  });
});
