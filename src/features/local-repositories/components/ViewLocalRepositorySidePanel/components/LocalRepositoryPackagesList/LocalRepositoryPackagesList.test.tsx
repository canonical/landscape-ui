import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoryPackagesList from "./LocalRepositoryPackagesList";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";

describe("LocalRepositoryPackagesList", () => {
  it("renders loading state when fetching packages", () => {
    renderWithProviders(
      <LocalRepositoryPackagesList repository={repositories[0]} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders table with package column header", async () => {
    renderWithProviders(
      <LocalRepositoryPackagesList repository={repositories[0]} />,
    );

    expect(
      await screen.findByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();
  });

  it("renders package names in table rows", async () => {
    renderWithProviders(
      <LocalRepositoryPackagesList repository={repositories[0]} />,
    );

    expect(await screen.findByText("package 1")).toBeInTheDocument();
    expect(screen.getByText("package 2")).toBeInTheDocument();
  });

  it("does not render empty message for mocked endpoint", async () => {
    renderWithProviders(
      <LocalRepositoryPackagesList repository={repositories[0]} />,
    );

    await screen.findByText("package 1");
    expect(
      screen.queryByText(/no packages associated with this local repository/i),
    ).not.toBeInTheDocument();
  });

  it("renders pagination info", async () => {
    renderWithProviders(
      <LocalRepositoryPackagesList repository={repositories[0]} />,
    );

    expect(await screen.findByText(/showing.*of/i)).toBeInTheDocument();
  });
});
