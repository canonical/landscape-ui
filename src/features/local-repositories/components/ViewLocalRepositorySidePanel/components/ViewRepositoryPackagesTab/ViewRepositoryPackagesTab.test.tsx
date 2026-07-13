import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ViewRepositoryPackagesTab from "./ViewRepositoryPackagesTab";
import { repositories, packages } from "@/tests/mocks/localRepositories";

describe("ViewRepositoryPackagesTab", () => {
  it("renders table with correct header after loading", async () => {
    renderWithProviders(
      <ViewRepositoryPackagesTab
        repositoryName={repositories[0].name}
        isImporting={false}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      await screen.findByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();

    assert(packages[0]);
    expect(await screen.findByText(packages[0])).toBeInTheDocument();
  });

  it("renders in progress notification while importing packages", async () => {
    renderWithProviders(
      <ViewRepositoryPackagesTab
        repositoryName={repositories[0].name}
        isImporting={true}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Packages are currently being imported.",
      }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();
  });
});
