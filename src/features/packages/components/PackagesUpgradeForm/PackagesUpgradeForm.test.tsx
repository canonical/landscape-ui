import type { Package } from "@/features/packages";
import { DEB_MANAGEMENT_PACKAGE_LIMIT } from "@/features/packages";
import { ubuntuInstance } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PackagesUpgradeForm from "./PackagesUpgradeForm";

vi.mock("../PackagesUpgradeList", () => ({
  default: ({
    setSelectedUpgrades,
  }: {
    setSelectedUpgrades: (upgrades: Package[]) => void;
  }) => (
    <button
      onClick={() => {
        setSelectedUpgrades(
          Array.from({ length: DEB_MANAGEMENT_PACKAGE_LIMIT + 1 }, (_, id) => ({
            id,
            name: `package-${id}`,
            summary: "",
            version: "1",
            computers: { count: 1 },
          })),
        );
      }}
    >
      Select over-limit upgrades
    </button>
  ),
}));

describe("Upgrades", () => {
  it("shows the package limit modal when more than the allowed upgrades are selected", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <PackagesUpgradeForm selectedInstances={[ubuntuInstance]} />,
    );

    await user.click(
      await screen.findByRole("button", { name: "Select over-limit upgrades" }),
    );
    await user.click(screen.getByRole("button", { name: "Next" }));

    const dialog = screen.getByRole("dialog", {
      name: "Upgrade limit exceeded",
    });
    expect(dialog).toHaveTextContent(
      `Upgrades are only available for a selection of ${DEB_MANAGEMENT_PACKAGE_LIMIT} packages or fewer.`,
    );

    await user.click(screen.getByRole("button", { name: "OK" }));

    expect(
      screen.queryByRole("dialog", { name: "Upgrade limit exceeded" }),
    ).not.toBeInTheDocument();
  });
});
