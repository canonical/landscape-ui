import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ActivitiesEmptyState from "./ActivitiesEmptyState";
import { DOCUMENTATION_LINK } from "./constants";

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
    expect(link).toHaveAttribute("href", DOCUMENTATION_LINK);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "nofollow noopener noreferrer");
  });
});
