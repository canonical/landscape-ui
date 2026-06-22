import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NoPublicationsEmptyState from "./NoPublicationsEmptyState";
import { DEBARCHIVE_DOCUMENTATION_URL } from "@/features/repositories";

describe("NoPublicationsEmptyState", () => {
  it("renders title, docs link and CTA", () => {
    renderWithProviders(<NoPublicationsEmptyState />);

    expect(
      screen.getByText("You don’t have any publications yet"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /learn more about repository mirroring/i,
      }),
    ).toHaveAttribute("href", DEBARCHIVE_DOCUMENTATION_URL);
    expect(
      screen.getByRole("button", { name: /add publication/i }),
    ).toBeInTheDocument();
  });
});
