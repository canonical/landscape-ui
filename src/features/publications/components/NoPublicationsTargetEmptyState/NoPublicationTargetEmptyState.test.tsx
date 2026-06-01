import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NoPublicationTargetEmptyState from "./NoPublicationTargetEmptyState";
import { DEBARCHIVE_DOCUMENTATION_URL } from "@/features/repositories";

describe("NoPublicationTargetEmptyState", () => {
  it("renders title, docs link and CTA button", () => {
    renderWithProviders(<NoPublicationTargetEmptyState />);

    expect(
      screen.getByText(
        /you must first add a publication target in order to add a publication/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /learn more about repository mirroring/i,
      }),
    ).toHaveAttribute("href", DEBARCHIVE_DOCUMENTATION_URL);
    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });
});
