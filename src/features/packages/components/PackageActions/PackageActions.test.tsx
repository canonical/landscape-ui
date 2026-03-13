import { setScreenSize } from "@/tests/helpers";
import { getInstancePackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackageActions from "./PackageActions";

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

assert(installedPackage);
assert(packageWithUpgrade);
assert(packageWithoutUpgrade);
assert(heldPackage);

describe("PackageActions", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setScreenSize("xxl");
  });

  describe("Button rendering", () => {
    it("renders all action buttons", () => {
      renderWithProviders(
        <PackageActions selectedPackages={[installedPackage]} />,
      );

      expect(
        screen.getByRole("button", { name: /upgrade/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /uninstall/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Hold" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /unhold/i }),
      ).toBeInTheDocument();
    });

    it("renders install button", () => {
      renderWithProviders(<PackageActions selectedPackages={[]} />);

      expect(
        screen.getByRole("button", { name: "Install" }),
      ).toBeInTheDocument();
    });
  });

  describe("Button states", () => {
    it("disables all buttons when no packages are selected", () => {
      renderWithProviders(<PackageActions selectedPackages={[]} />);

      expect(screen.getByRole("button", { name: /upgrade/i })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      expect(
        screen.getByRole("button", { name: /uninstall/i }),
      ).toHaveAttribute("aria-disabled", "true");
      expect(screen.getByRole("button", { name: "Hold" })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      expect(screen.getByRole("button", { name: /unhold/i })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("disables upgrade button when no packages have available upgrades", () => {
      renderWithProviders(
        <PackageActions selectedPackages={[packageWithoutUpgrade]} />,
      );

      expect(screen.getByRole("button", { name: /upgrade/i })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("enables upgrade button when packages have available upgrades", () => {
      renderWithProviders(
        <PackageActions selectedPackages={[packageWithUpgrade]} />,
      );

      const upgradeButton = screen.getByRole("button", { name: /upgrade/i });
      expect(upgradeButton).not.toHaveAttribute("aria-disabled");
      expect(upgradeButton).toBeEnabled();
    });

    it("disables hold button when all packages are already held", () => {
      renderWithProviders(<PackageActions selectedPackages={[heldPackage]} />);

      expect(screen.getByRole("button", { name: "Hold" })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("enables hold button when packages are not held", () => {
      renderWithProviders(
        <PackageActions selectedPackages={[installedPackage]} />,
      );

      const holdButton = screen.getByRole("button", { name: "Hold" });
      expect(holdButton).not.toHaveAttribute("aria-disabled");
      expect(holdButton).toBeEnabled();
    });

    it("disables unhold button when no packages are held", () => {
      renderWithProviders(
        <PackageActions selectedPackages={[installedPackage]} />,
      );

      expect(screen.getByRole("button", { name: /unhold/i })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("enables unhold button when packages are held", () => {
      renderWithProviders(<PackageActions selectedPackages={[heldPackage]} />);

      const unholdButton = screen.getByRole("button", { name: /unhold/i });
      expect(unholdButton).not.toHaveAttribute("aria-disabled");
      expect(unholdButton).toBeEnabled();
    });
  });

  describe("Action triggers", () => {
    it("opens upgrade form when upgrade button is clicked", async () => {
      renderWithProviders(
        <PackageActions selectedPackages={[packageWithUpgrade]} />,
      );

      const upgradeButton = screen.getByRole("button", { name: /upgrade/i });
      await user.click(upgradeButton);

      const form = await screen.findByRole("complementary");
      expect(form).toBeInTheDocument();
    });

    it("opens remove form when uninstall button is clicked", async () => {
      renderWithProviders(
        <PackageActions selectedPackages={[installedPackage]} />,
      );

      const uninstallButton = screen.getByRole("button", {
        name: /uninstall/i,
      });
      await user.click(uninstallButton);

      const form = await screen.findByRole("complementary");
      expect(form).toBeInTheDocument();
    });

    it("opens hold form when hold button is clicked", async () => {
      renderWithProviders(
        <PackageActions selectedPackages={[installedPackage]} />,
      );

      const holdButton = screen.getByRole("button", { name: "Hold" });
      await user.click(holdButton);

      const form = await screen.findByRole("complementary");
      expect(form).toBeInTheDocument();
    });

    it("opens unhold form when unhold button is clicked", async () => {
      renderWithProviders(<PackageActions selectedPackages={[heldPackage]} />);

      const unholdButton = screen.getByRole("button", { name: /unhold/i });
      await user.click(unholdButton);

      const form = await screen.findByRole("complementary");
      expect(form).toBeInTheDocument();
    });
  });
});
