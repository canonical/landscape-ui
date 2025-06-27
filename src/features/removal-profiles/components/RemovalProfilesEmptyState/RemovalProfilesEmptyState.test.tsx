import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RemovalProfilesEmptyState from "./RemovalProfilesEmptyState";

describe("RemovalProfilesEmptyState", () => {
  it("shows title and CTA button", () => {
    renderWithProviders(<RemovalProfilesEmptyState />);

    expect(screen.getByText(/no removal profiles found/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add removal profile/i }),
    ).toBeInTheDocument();
  });
});
