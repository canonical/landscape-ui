import { getInstancePackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import LocationDisplay from "@/tests/LocationDisplay";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackageListActions from "./PackageListActions";

const instancePackages = getInstancePackages(1);

const upgradablePackage = instancePackages.find(
  (pkg) => pkg.status === "installed" && pkg.available_version,
);
const heldPackage = instancePackages.find((pkg) => pkg.status === "held");
const regularPackage = instancePackages.find(
  (pkg) => pkg.status === "installed" && !pkg.available_version,
);

assert(upgradablePackage);
assert(heldPackage);
assert(regularPackage);

describe("PackageListActions", () => {
  const user = userEvent.setup();

  it("opens actions menu when toggle button is clicked", async () => {
    renderWithProviders(<PackageListActions pkg={regularPackage} />);

    const toggleButton = screen.getByRole("button", {
      name: `${regularPackage.name} package actions`,
    });

    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });

  describe("Regular package actions", () => {
    it("shows hold, downgrade, and remove actions for regular package", async () => {
      renderWithProviders(<PackageListActions pkg={regularPackage} />);

      await user.click(
        screen.getByRole("button", {
          name: `${regularPackage.name} package actions`,
        }),
      );

      const displayPackageButtonText = `${regularPackage.name} package`;

      expect(
        screen.getByRole("menuitem", {
          name: `Hold ${displayPackageButtonText}`,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", {
          name: `Downgrade ${displayPackageButtonText}`,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", {
          name: `Uninstall ${displayPackageButtonText}`,
        }),
      ).toBeInTheDocument();
    });

    it("does not show upgrade action for regular package without available version", async () => {
      renderWithProviders(<PackageListActions pkg={regularPackage} />);

      await user.click(
        screen.getByRole("button", {
          name: `${regularPackage.name} package actions`,
        }),
      );

      expect(
        screen.queryByRole("button", {
          name: `Upgrade ${regularPackage.name} package`,
        }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Upgradable package actions", () => {
    it("shows upgrade action for upgradable package", async () => {
      renderWithProviders(<PackageListActions pkg={upgradablePackage} />);

      await user.click(
        screen.getByRole("button", {
          name: `${upgradablePackage.name} package actions`,
        }),
      );

      expect(
        screen.getByRole("menuitem", {
          name: `Upgrade ${upgradablePackage.name} package`,
        }),
      ).toBeInTheDocument();
    });

    it("shows all positive and negative actions for upgradable package", async () => {
      renderWithProviders(<PackageListActions pkg={upgradablePackage} />);

      await user.click(
        screen.getByRole("button", {
          name: `${upgradablePackage.name} package actions`,
        }),
      );

      const displayPackageButtonText = `${upgradablePackage.name} package`;

      expect(
        screen.getByRole("menuitem", {
          name: `Upgrade ${displayPackageButtonText}`,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", {
          name: `Hold ${displayPackageButtonText}`,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", {
          name: `Downgrade ${displayPackageButtonText}`,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", {
          name: `Uninstall ${displayPackageButtonText}`,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("Held package actions", () => {
    it("shows unhold action for held package", async () => {
      renderWithProviders(<PackageListActions pkg={heldPackage} />);

      await user.click(
        screen.getByRole("button", {
          name: `${heldPackage.name} package actions`,
        }),
      );

      expect(
        screen.getByRole("menuitem", {
          name: `Unhold ${heldPackage.name} package`,
        }),
      ).toBeInTheDocument();
    });

    it("does not show hold action for held package", async () => {
      renderWithProviders(<PackageListActions pkg={heldPackage} />);

      await user.click(
        screen.getByRole("button", {
          name: `${heldPackage.name} package actions`,
        }),
      );

      expect(
        screen.queryByRole("button", {
          name: `Hold ${heldPackage.name} package`,
        }),
      ).not.toBeInTheDocument();
    });

    it("does not show downgrade action for held package", async () => {
      renderWithProviders(<PackageListActions pkg={heldPackage} />);

      await user.click(
        screen.getByRole("button", {
          name: `${heldPackage.name} package actions`,
        }),
      );

      expect(
        screen.queryByRole("button", {
          name: `Downgrade ${heldPackage.name} package`,
        }),
      ).not.toBeInTheDocument();
    });

    it("shows remove action for held package", async () => {
      renderWithProviders(<PackageListActions pkg={heldPackage} />);

      await user.click(
        screen.getByRole("button", {
          name: `${heldPackage.name} package actions`,
        }),
      );

      expect(
        screen.getByRole("menuitem", {
          name: `Uninstall ${heldPackage.name} package`,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("Side panel opening", () => {
    it("opens upgrade side panel when upgrade action is clicked", async () => {
      renderWithProviders(
        <>
          <PackageListActions pkg={upgradablePackage} />
          <LocationDisplay />
        </>
      );

      await user.click(
        screen.getByRole("button", {
          name: `${upgradablePackage.name} package actions`,
        }),
      );

      await user.click(
        screen.getByRole("menuitem", {
          name: `Upgrade ${upgradablePackage.name} package`,
        }),
      );

      expect(screen.getByTestId("location")).toHaveTextContent(
        `sidePath=upgrade&name=${upgradablePackage.name}`
      );
    });

    it("opens hold side panel when hold action is clicked", async () => {
      renderWithProviders(
        <>
          <PackageListActions pkg={regularPackage} />
          <LocationDisplay />
        </>
      );

      await user.click(
        screen.getByRole("button", {
          name: `${regularPackage.name} package actions`,
        }),
      );

      await user.click(
        screen.getByRole("menuitem", {
          name: `Hold ${regularPackage.name} package`,
        }),
      );

      expect(screen.getByTestId("location")).toHaveTextContent(
        `sidePath=hold&name=${regularPackage.name}`
      );
    });

    it("opens unhold side panel when unhold action is clicked", async () => {
      renderWithProviders(
        <>
          <PackageListActions pkg={heldPackage} />
          <LocationDisplay />
        </>
      );

      await user.click(
        screen.getByRole("button", {
          name: `${heldPackage.name} package actions`,
        }),
      );

      await user.click(
        screen.getByRole("menuitem", {
          name: `Unhold ${heldPackage.name} package`,
        }),
      );

      expect(screen.getByTestId("location")).toHaveTextContent(
        `sidePath=unhold&name=${heldPackage.name}`
      );
    });

    it("opens downgrade side panel when downgrade action is clicked", async () => {
      renderWithProviders(
        <>
          <PackageListActions pkg={regularPackage} />
          <LocationDisplay />
        </>
      );

      await user.click(
        screen.getByRole("button", {
          name: `${regularPackage.name} package actions`,
        }),
      );

      await user.click(
        screen.getByRole("menuitem", {
          name: `Downgrade ${regularPackage.name} package`,
        }),
      );

      expect(screen.getByTestId("location")).toHaveTextContent(
        `sidePath=downgrade&name=${regularPackage.name}`
      );
    });

    it("opens uninstall side panel when uninstall action is clicked", async () => {
      renderWithProviders(
        <>
          <PackageListActions pkg={regularPackage} />
          <LocationDisplay />
        </>
      );

      await user.click(
        screen.getByRole("button", {
          name: `${regularPackage.name} package actions`,
        }),
      );

      await user.click(
        screen.getByRole("menuitem", {
          name: `Uninstall ${regularPackage.name} package`,
        }),
      );

      expect(screen.getByTestId("location")).toHaveTextContent(
        `sidePath=remove&name=${regularPackage.name}`
      );
    });
  });
});
