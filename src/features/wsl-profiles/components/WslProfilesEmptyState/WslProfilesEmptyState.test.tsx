import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import WslProfilesEmptyState from "./WslProfilesEmptyState";

describe("WslProfilesEmptyState", () => {
  it("should render profile empty state", async () => {
    renderWithProviders(<WslProfilesEmptyState />);

    expect(
      screen.getByText("You don't have any WSL profiles yet"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Learn how to use WSL profiles" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add WSL profile" }),
    ).toBeInTheDocument();
  });
});
