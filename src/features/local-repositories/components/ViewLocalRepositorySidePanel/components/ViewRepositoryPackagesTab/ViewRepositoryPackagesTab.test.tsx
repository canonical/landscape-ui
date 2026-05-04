import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ViewRepositoryPackagesTab from "./ViewRepositoryPackagesTab";
import { repositories } from "@/tests/mocks/localRepositories";

describe("ViewRepositoryPackagesTab", () => {
  it("renders table with correct header after loading", async () => {
    renderWithProviders(
      <ViewRepositoryPackagesTab repository={repositories[0]} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      await screen.findByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();

    expect(await screen.findByText("package-1")).toBeInTheDocument();
    expect(screen.getByText("package-2")).toBeInTheDocument();
    expect(screen.getByText("package-3")).toBeInTheDocument();
  });
});
