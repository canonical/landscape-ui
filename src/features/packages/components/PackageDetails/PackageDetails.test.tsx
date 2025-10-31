import { getInstancePackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import PackageDetails from "./PackageDetails";

const instanceId = 1;
const instancePackages = getInstancePackages(instanceId);

const packageWithUpgrade = instancePackages.find(
  (pkg) => pkg.status === "installed" && pkg.available_version,
);
const packageWithoutUpgrade = instancePackages.find(
  (pkg) => pkg.status === "installed" && !pkg.available_version,
);
const heldPackage = instancePackages.find((pkg) => pkg.status === "held");
const [installedPackage] = instancePackages;

assert(packageWithUpgrade);
assert(packageWithoutUpgrade);
assert(heldPackage);

describe("PackageDetails", () => {
  const user = userEvent.setup();

  it("renders package name, summary, and current version", () => {
    renderWithProviders(<PackageDetails singlePackage={installedPackage} />);

    expect(screen.getByText(installedPackage.name)).toBeInTheDocument();
    expect(screen.getByText(installedPackage.summary)).toBeInTheDocument();
    expect(screen.getByText(/current version/i)).toBeInTheDocument();
  });

  describe("Upgradable version display", () => {
    it("shows upgradable version when available", () => {
      renderWithProviders(
        <PackageDetails singlePackage={packageWithUpgrade} />,
      );

      expect(screen.getByText(/upgradable to/i)).toBeInTheDocument();
    });

    it("does not show upgradable version when not available", () => {
      renderWithProviders(
        <PackageDetails singlePackage={packageWithoutUpgrade} />,
      );

      expect(screen.queryByText(/upgradable to/i)).not.toBeInTheDocument();
    });
  });

  describe("Button rendering for upgradable package", () => {
    beforeEach(() => {
      renderWithProviders(
        <PackageDetails singlePackage={packageWithUpgrade} />,
      );
    });

    it("renders upgrade, hold, downgrade, and uninstall buttons", () => {
      expect(
        screen.getByRole("button", { name: /upgrade/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Hold" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /downgrade/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /uninstall/i }),
      ).toBeInTheDocument();
    });

    it("does not render unhold button", () => {
      expect(
        screen.queryByRole("button", { name: /unhold/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Button rendering for non-upgradable package", () => {
    beforeEach(() => {
      renderWithProviders(
        <PackageDetails singlePackage={packageWithoutUpgrade} />,
      );
    });

    it("does not render upgrade button", () => {
      expect(
        screen.queryByRole("button", { name: /upgrade/i }),
      ).not.toBeInTheDocument();
    });

    it("renders other action buttons", () => {
      expect(screen.getByRole("button", { name: "Hold" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /downgrade/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /uninstall/i }),
      ).toBeInTheDocument();
    });
  });

  it("renders unhold and uninstall buttons", () => {
    renderWithProviders(<PackageDetails singlePackage={heldPackage} />);
    expect(screen.getByRole("button", { name: /unhold/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /uninstall/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Hold" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /downgrade/i }),
    ).not.toBeInTheDocument();
  });

  describe("Action triggers", () => {
    it("opens upgrade form when upgrade button is clicked", async () => {
      renderWithProviders(
        <PackageDetails singlePackage={packageWithUpgrade} />,
      );

      const upgradeButton = screen.getByRole("button", { name: /upgrade/i });
      await user.click(upgradeButton);

      expect(
        screen.getByRole("button", { name: "Upgrade" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`upgrade ${packageWithUpgrade.name}`, "i")),
      ).toBeInTheDocument();
    });

    it("opens hold form when hold button is clicked", async () => {
      renderWithProviders(<PackageDetails singlePackage={installedPackage} />);

      const holdButton = screen.getByRole("button", { name: "Hold" });
      await user.click(holdButton);

      expect(screen.getByRole("button", { name: "Hold" })).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`hold ${installedPackage.name}`, "i")),
      ).toBeInTheDocument();
    });

    it("opens unhold form when unhold button is clicked", async () => {
      renderWithProviders(<PackageDetails singlePackage={heldPackage} />);

      const unholdButton = screen.getByRole("button", { name: /unhold/i });
      await user.click(unholdButton);

      expect(
        screen.getByRole("button", { name: "Unhold" }),
      ).toBeInTheDocument();
    });

    it("opens uninstall form when uninstall button is clicked", async () => {
      renderWithProviders(<PackageDetails singlePackage={installedPackage} />);

      const uninstallButton = screen.getByRole("button", {
        name: /uninstall/i,
      });
      await user.click(uninstallButton);

      expect(
        screen.getByRole("button", { name: "Uninstall" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`uninstall ${installedPackage.name}`, "i")),
      ).toBeInTheDocument();
    });

    it("opens downgrade form when downgrade button is clicked", async () => {
      renderWithProviders(<PackageDetails singlePackage={installedPackage} />);

      const downgradeButton = screen.getByRole("button", {
        name: /downgrade/i,
      });
      await user.click(downgradeButton);

      expect(
        screen.getByRole("button", { name: "Downgrade" }),
      ).toBeInTheDocument();
    });
  });
});
