import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import ImportRepositoryPackagesSidePanel from "./ImportRepositoryPackagesSidePanel";
import { screen } from "@testing-library/react";

describe("ImportRepositoryPackagesSidePanel", () => {
  it("renders loading state while repository is unresolved", () => {
    renderWithProviders(<ImportRepositoryPackagesSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders side panel close control", () => {
    renderWithProviders(<ImportRepositoryPackagesSidePanel />);

    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });
});
