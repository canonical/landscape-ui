import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NoScriptsEmptyState from "./NoScriptsEmptyState";

describe("NoScriptsEmptyState", () => {
  it("should show correct information for empty state", async () => {
    renderWithProviders(<NoScriptsEmptyState />);

    const emptyStateTitle = screen.getByText(
      /you need at least one script to add a profile/i,
    );
    const emptyStateBody = screen.getByText(
      /in order to create a script profile/i,
    );

    expect(emptyStateTitle).toBeInTheDocument();
    expect(emptyStateBody).toBeInTheDocument();
  });
});
