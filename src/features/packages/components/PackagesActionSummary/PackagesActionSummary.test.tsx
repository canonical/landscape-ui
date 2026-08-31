import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackagesActionSummary from "./PackagesActionSummary";
import { packages } from "@/tests/mocks/packages";

describe("PackagesActionSummary", () => {
  it("should render all selected packages", async () => {
    renderWithProviders(
      <PackagesActionSummary
        action="uninstall"
        instanceIds={[1, 2, 3]}
        onBackButtonPress={() => undefined}
        packageChangePlanId={1}
      />,
    );

    const loadingItems = await screen.findAllByRole("status");
    await waitFor(() =>
      loadingItems.map((loading) => {
        expect(loading).not.toBeInTheDocument();
      }),
    );
    const items = await screen.findAllByRole("listitem");
    expect(items).toHaveLength(packages.length);
  });

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
