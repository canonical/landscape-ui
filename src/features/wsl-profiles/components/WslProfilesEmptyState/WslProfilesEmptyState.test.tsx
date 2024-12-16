import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import WslProfilesEmptyState from "./WslProfilesEmptyState";

describe("WslProfilesEmptyState", () => {
  it("should render profile empty state", async () => {
    renderWithProviders(<WslProfilesEmptyState />);

    expect(screen.getByText("No WSL profiles found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "How to manage WSL profiles in Landscape",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add WSL profile" }),
    ).toBeInTheDocument();
  });
});
