import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { packages } from "@/tests/mocks/packages";
import type { ComponentProps } from "react";
import { assert, beforeEach, describe, expect, it, vi } from "vitest";
import PackagesUpgradeList from "./PackagesUpgradeList";

const [firstPackage, secondPackage, offPageUpgrade] = packages;
const firstUpgrade = { ...firstPackage, computers: { count: 1 } };
const secondUpgrade = { ...secondPackage, computers: { count: 2 } };
const currentUpgrades = [firstUpgrade, secondUpgrade];
const props: ComponentProps<typeof PackagesUpgradeList> = {
  currentUpgrades,
  selectedUpgrades: [],
  setSelectedUpgrades: vi.fn(),
  upgradeCount: currentUpgrades.length,
};

describe("PackagesUpgradeList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders package details and singular and plural affected-instance counts", () => {
    render(<PackagesUpgradeList {...props} />);

    for (const header of [
      "Package",
      "Upgrade version",
      "Affected instances",
      "Description",
    ]) {
      expect(
        screen.getByRole("columnheader", { name: new RegExp(header) }),
      ).toBeInTheDocument();
    }

    for (const [upgrade, instanceCount] of [
      [firstUpgrade, "1 instance"],
      [secondUpgrade, "2 instances"],
    ] as const) {
      const row = screen.getByText(upgrade.name).closest("tr");
      assert(row);
      expect(within(row).getByText(upgrade.version)).toBeInTheDocument();
      expect(within(row).getByText(upgrade.summary)).toBeInTheDocument();
      expect(within(row).getByText(instanceCount)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("checkbox", { name: "Toggle all packages" }),
    ).not.toBeChecked();
    expect(
      screen.queryByRole("button", { name: "Clear selection" }),
    ).not.toBeInTheDocument();
  });

  it("shows the empty state and disables bulk selection when there are no packages", () => {
    render(
      <PackagesUpgradeList {...props} currentUpgrades={[]} upgradeCount={0} />,
    );

    expect(
      screen.getByText(
        "No packages found according to your search parameters.",
      ),
    ).toBeInTheDocument();
    const toggleAll = screen.getByRole("checkbox", {
      name: "Toggle all packages",
    });
    expect(toggleAll).toBeDisabled();
    expect(toggleAll).not.toBeChecked();
  });

  it("selects and deselects individual packages by ID while preserving off-page selections", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <PackagesUpgradeList {...props} selectedUpgrades={[offPageUpgrade]} />,
    );

    await user.click(
      screen.getByRole("checkbox", { name: `Select ${firstUpgrade.name}` }),
    );

    expect(props.setSelectedUpgrades).toHaveBeenLastCalledWith([
      offPageUpgrade,
      firstUpgrade,
    ]);

    rerender(
      <PackagesUpgradeList
        {...props}
        selectedUpgrades={[offPageUpgrade, { ...firstUpgrade }]}
      />,
    );
    expect(
      screen.getByRole("checkbox", { name: `Select ${firstUpgrade.name}` }),
    ).toBeChecked();

    await user.click(
      screen.getByRole("checkbox", { name: `Select ${firstUpgrade.name}` }),
    );

    expect(props.setSelectedUpgrades).toHaveBeenLastCalledWith([
      offPageUpgrade,
    ]);
    expect(
      screen.queryByRole("button", { name: "Clear selection" }),
    ).not.toBeInTheDocument();
  });

  it("selects and deselects the current page without changing off-page selections", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <PackagesUpgradeList {...props} selectedUpgrades={[offPageUpgrade]} />,
    );

    await user.click(
      screen.getByRole("checkbox", { name: "Toggle all packages" }),
    );

    expect(props.setSelectedUpgrades).toHaveBeenLastCalledWith([
      offPageUpgrade,
      ...currentUpgrades,
    ]);

    rerender(
      <PackagesUpgradeList
        {...props}
        selectedUpgrades={[offPageUpgrade, ...currentUpgrades]}
      />,
    );
    expect(
      screen.getByRole("checkbox", { name: "Toggle all packages" }),
    ).toBeChecked();

    await user.click(
      screen.getByRole("checkbox", { name: "Toggle all packages" }),
    );

    expect(props.setSelectedUpgrades).toHaveBeenLastCalledWith([
      offPageUpgrade,
    ]);
  });

  it("shows a mixed bulk checkbox and deselects only the selected packages on the current page", async () => {
    const user = userEvent.setup();
    render(
      <PackagesUpgradeList
        {...props}
        selectedUpgrades={[firstUpgrade, offPageUpgrade]}
      />,
    );

    const toggleAll = screen.getByRole("checkbox", {
      name: "Toggle all packages",
    });
    expect(toggleAll).toBePartiallyChecked();

    await user.click(toggleAll);

    expect(props.setSelectedUpgrades).toHaveBeenCalledExactlyOnceWith([
      offPageUpgrade,
    ]);
  });

  it("shows the total selection count across pages and clears every selected package", async () => {
    const user = userEvent.setup();
    render(
      <PackagesUpgradeList
        {...props}
        selectedUpgrades={[firstUpgrade, offPageUpgrade]}
        upgradeCount={3}
      />,
    );

    expect(screen.getByText("2 of 3 packages selected")).toHaveAttribute(
      "aria-live",
      "polite",
    );

    await user.click(screen.getByRole("button", { name: "Clear selection" }));

    expect(props.setSelectedUpgrades).toHaveBeenCalledExactlyOnceWith([]);
  });
});
