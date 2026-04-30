import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NoPublicationsEmptyState from "./NoPublicationsEmptyState";
import { DOCUMENTATION_URL } from "./constants";

describe("NoPublicationsEmptyState", () => {
  it("renders title, docs link and CTA", () => {
    renderWithProviders(<NoPublicationsEmptyState />);

    expect(
      screen.getByText(/you don.t have any publications yet/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /learn more about repository mirroring/i,
      }),
    ).toHaveAttribute("href", DOCUMENTATION_URL);
    expect(
      screen.getByRole("button", { name: /add publication/i }),
    ).toBeInTheDocument();
  });
});
