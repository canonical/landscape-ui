import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NoScriptProfilesEmptyState from "./NoScriptProfilesEmptyState";

describe("NoScriptProfilesEmptyState", () => {
  it("should show correct information for empty state", async () => {
    renderWithProviders(<NoScriptProfilesEmptyState />);

    const emptyStateTitle = screen.getByText(
      /you don't have any script profiles yet./i,
    );
    const emptyStateBody = screen.getByText(
      /script profiles allow you to automate your script runs based on/i,
    );

    expect(emptyStateTitle).toBeInTheDocument();
    expect(emptyStateBody).toBeInTheDocument();
  });
});
