import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ActivitiesEmptyState from "./ActivitiesEmptyState";
import { MANAGING_COMPUTERS_DOCUMENTATION_URL } from "@/documentationUrls/documentationUrls";

describe("ActivitiesEmptyState", () => {
  it("renders the empty state with correct title and body text", () => {
    renderWithProviders(<ActivitiesEmptyState />);

    expect(screen.getByText(/no activities found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/there are no activities yet/i),
    ).toBeInTheDocument();
  });

  it("renders the documentation link with correct href", () => {
    renderWithProviders(<ActivitiesEmptyState />);

    const link = screen.getByRole("link", {
      name: /how to manage computers in landscape/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", MANAGING_COMPUTERS_DOCUMENTATION_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "nofollow noopener noreferrer");
  });
});
