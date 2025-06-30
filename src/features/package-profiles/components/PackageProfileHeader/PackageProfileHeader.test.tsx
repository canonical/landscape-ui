import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PackageProfileHeader from "./PackageProfileHeader";

describe("PackageProfileHeader", () => {
  it("renders header with search and filter components", () => {
    renderWithProviders(<PackageProfileHeader />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });
});
