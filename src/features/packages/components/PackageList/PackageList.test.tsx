import { getInstancePackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PackageList from "./PackageList";

const instanceId = 1;
const instancePackages = getInstancePackages(instanceId);

const packagesWithUpgrade = instancePackages.filter(
  (pkg) => pkg.status === "installed" && pkg.available_version,
);

const props: ComponentProps<typeof PackageList> = {
  emptyMsg: "No packages found",
  onPackagesSelect: vi.fn(),
  packages: packagesWithUpgrade,
  packagesLoading: false,
  selectedPackages: [],
};

describe("PackageList", () => {
  const user = userEvent.setup();

  describe("Table rendering", () => {
    beforeEach(() => {
      renderWithProviders(<PackageList {...props} />);
    });

    it("renders table", () => {
      expect(screen.getByRole("table")).toBeInTheDocument();

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Current version")).toBeInTheDocument();
      expect(screen.getByText("Details")).toBeInTheDocument();

      packagesWithUpgrade.forEach((pkg) => {
        expect(screen.getByText(pkg.name)).toBeInTheDocument();
      });
    });
  });

  it("opens package details panel when package name is clicked", async () => {
    renderWithProviders(
      <PackageList {...props} selectedPackages={packagesWithUpgrade} />,
    );

    const [firstPackage] = packagesWithUpgrade;
    assert(firstPackage);
    const packageButton = screen.getByRole("button", {
      name: firstPackage.name,
    });

    await user.click(packageButton);

    expect(await screen.findByText("Package details")).toBeInTheDocument();
  });

  it("displays empty message when no packages are found", () => {
    renderWithProviders(<PackageList {...props} packages={[]} />);

    expect(screen.getByText("No packages found")).toBeInTheDocument();
  });

  it("selects all packages on mount when selectAll prop is true", () => {
    renderWithProviders(<PackageList {...props} selectAll />);

    expect(props.onPackagesSelect).toHaveBeenCalledWith(packagesWithUpgrade);
  });

  it("shows Installed status when installed packages have no available version", () => {
    const packageWithoutUpgrade = {
      id: 999,
      name: "adduser",
      summary: "add and remove users and groups",
      status: "installed" as const,
      current_version: "3.118ubuntu5",
      available_version: null,
    };
    const packageWithUpgrade = {
      id: 1000,
      name: "bash",
      summary: "GNU Bourne Again SHell",
      status: "installed" as const,
      current_version: "5.1-6ubuntu1.1",
      available_version: "5.1-6ubuntu1.2",
    };

    renderWithProviders(
      <PackageList
        {...props}
        packages={[packageWithoutUpgrade, packageWithUpgrade]}
      />,
    );

    const row = screen.getByText(packageWithoutUpgrade.name).closest("tr");
    assert(row);
    expect(within(row).getByText("Installed")).toBeInTheDocument();
    expect(within(row).queryByText("Regular upgrade")).not.toBeInTheDocument();
  });
});
