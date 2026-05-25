import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ViewRepositoryPackagesTab from "./ViewRepositoryPackagesTab";
import { repositories, sortedPackages } from "@/tests/mocks/localRepositories";

describe("ViewRepositoryPackagesTab", () => {
  it("renders table with correct header after loading", async () => {
    renderWithProviders(
      <ViewRepositoryPackagesTab repository={repositories[0]} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      await screen.findByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();

    assert(sortedPackages[0]);
    expect(await screen.findByText(sortedPackages[0])).toBeInTheDocument();
  });
});
