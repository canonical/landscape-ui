import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackagesActionSummary from "./PackagesActionSummary";

describe("PackagesActionSummary", () => {
  it("should not render if there are no selected Packages", async () => {
    renderWithProviders(
      <PackagesActionSummary
        actionType="unhold"
        onBackButtonPress={() => undefined}
        packageChangePlanId={1}
      />,
    );

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
