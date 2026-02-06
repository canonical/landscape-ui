import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackagesActionSummaryItem from "./PackagesActionSummaryItem";
import { availableVersions, selectedPackages } from "@/tests/mocks/packages";
import userEvent from "@testing-library/user-event";

const [selectedPackage] = selectedPackages;

const instanceCount = availableVersions.reduce((count, version) => {
  return count + version.num_computers;
}, 0);

describe("PackagesActionSummaryItem", () => {
  const user = userEvent.setup();

  it("should render all selected versions", async () => {
    renderWithProviders(
      <PackagesActionSummaryItem
        action="uninstall"
        instanceIds={[1, 2, 3]}
        selectedPackage={selectedPackage}
      />,
    );

    const rows = await screen.findAllByText("Will uninstall", { exact: false });
    expect(rows).toHaveLength(selectedPackage.versions.length);
  });

  it("should render clickable no change option", async () => {
    renderWithProviders(
      <PackagesActionSummaryItem
        action="unhold"
        instanceIds={Array(instanceCount + 1)}
        selectedPackage={selectedPackage}
      />,
    );

    await screen.findByText("Will not unhold", { exact: false });

    const button = screen.getByRole("button", { name: "1 instance" });
    await user.click(button);
    screen.getByRole("dialog");
  });

  it("should not render no change option if count is 0", async () => {
    renderWithProviders(
      <PackagesActionSummaryItem
        action="unhold"
        instanceIds={Array(instanceCount)}
        selectedPackage={selectedPackage}
      />,
    );

    expect(
      screen.queryByText("Will not unhold", { exact: false }),
    ).not.toBeInTheDocument();
  });
});
