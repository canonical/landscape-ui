import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import PackageProfilesEmptyState from "./PackageProfilesEmptyState";

describe("PackageProfilesEmptyState", () => {
  it("should render profile empty state", async () => {
    renderWithProviders(<PackageProfilesEmptyState />);

    expect(screen.getByText("No package profiles found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "How to manage packages in Landscape" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add package profile" }),
    ).toBeInTheDocument();
  });
});
