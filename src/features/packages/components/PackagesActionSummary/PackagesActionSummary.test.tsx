import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackagesActionSummary from "./PackagesActionSummary";

describe("PackagesActionSummary", () => {
  it("should not render if there are no selected Packages", async () => {
    renderWithProviders(
      <PackagesActionSummary
        action="unhold"
        instanceIds={[1, 2, 3]}
        onBackButtonPress={() => undefined}
        packageChangePlanId={1}
      />,
    );

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
