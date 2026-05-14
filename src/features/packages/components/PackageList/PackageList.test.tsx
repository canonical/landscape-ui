import { getInstancePackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PackageList from "./PackageList";
import type { InstancePackage } from "../../types";

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

const ubuntuProPackage: InstancePackage = {
  id: 9001,
  name: "esm-security-fix",
  summary: "Ubuntu Pro security fix",
  status: "installed",
  current_version: "1.0.0",
  available_version: "1.0.0-ubuntu-pro",
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

  it("shows loading state when packagesLoading is true", () => {
    renderWithProviders(<PackageList {...props} packagesLoading />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("selects a package when its checkbox is clicked", async () => {
    renderWithProviders(<PackageList {...props} />);

    const [firstPackage] = packagesWithUpgrade;
    assert(firstPackage);

    const checkbox = screen.getByRole("checkbox", {
      name: `Toggle ${firstPackage.name}`,
    });
    await user.click(checkbox);

    expect(props.onPackagesSelect).toHaveBeenCalledWith([firstPackage]);
  });

  it("deselects a package when its checkbox is clicked while already selected", async () => {
    renderWithProviders(
      <PackageList {...props} selectedPackages={packagesWithUpgrade} />,
    );

    const [firstPackage] = packagesWithUpgrade;
    assert(firstPackage);

    const checkbox = screen.getByRole("checkbox", {
      name: `Toggle ${firstPackage.name}`,
    });
    await user.click(checkbox);

    expect(props.onPackagesSelect).toHaveBeenCalledWith(
      packagesWithUpgrade.slice(1),
    );
  });

  it("deselects all packages when toggle all is clicked with packages selected", async () => {
    renderWithProviders(
      <PackageList {...props} selectedPackages={packagesWithUpgrade} />,
    );

    const toggleAllCheckbox = screen.getByRole("checkbox", {
      name: /toggle all/i,
    });
    await user.click(toggleAllCheckbox);

    expect(props.onPackagesSelect).toHaveBeenCalledWith([]);
  });

  it("shows UbuntuProNotification when packages requiring Ubuntu Pro are present", () => {
    renderWithProviders(
      <PackageList {...props} packages={[ubuntuProPackage]} />,
    );

    expect(
      screen.getByText(/some upgrades require ubuntu pro/i),
    ).toBeInTheDocument();
  });

  it("hides UbuntuProNotification when dismissed", async () => {
    renderWithProviders(
      <PackageList {...props} packages={[ubuntuProPackage]} />,
    );

    expect(
      screen.getByText(/some upgrades require ubuntu pro/i),
    ).toBeInTheDocument();

    const dismissButton = screen.getByRole("button", {
      name: /close notification/i,
    });
    await user.click(dismissButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/some upgrades require ubuntu pro/i),
      ).not.toBeInTheDocument();
    });
  });

  it("shows Ubuntu Pro required tooltip for packages requiring Ubuntu Pro", () => {
    renderWithProviders(
      <PackageList {...props} packages={[ubuntuProPackage]} />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: `Toggle ${ubuntuProPackage.name}`,
    });
    expect(checkbox).toBeDisabled();
  });

  it("shows available version details when package has an available version", () => {
    const packageWithAvailableVersion: InstancePackage = {
      id: 100,
      name: "curl",
      summary: "command line tool",
      status: "installed",
      current_version: "7.0",
      available_version: "8.0",
    };

    renderWithProviders(
      <PackageList {...props} packages={[packageWithAvailableVersion]} />,
    );

    expect(screen.getByText("available version: 8.0")).toBeInTheDocument();
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

  it("shows Available status for packages with status 'available'", () => {
    const availablePackage: InstancePackage = {
      id: 200,
      name: "new-package",
      summary: "A new package available for install",
      status: "available",
      current_version: null,
      available_version: "1.0.0",
    };

    renderWithProviders(
      <PackageList {...props} packages={[availablePackage]} />,
    );

    const row = screen.getByText(availablePackage.name).closest("tr");
    assert(row);
    expect(within(row).getByText("Available")).toBeInTheDocument();
  });

  it("shows Held status for packages with status 'held'", () => {
    const heldPackage: InstancePackage = {
      id: 201,
      name: "held-package",
      summary: "A held package",
      status: "held",
      current_version: "2.0.0",
      available_version: "3.0.0",
    };

    renderWithProviders(<PackageList {...props} packages={[heldPackage]} />);

    const row = screen.getByText(heldPackage.name).closest("tr");
    assert(row);
    expect(within(row).getByText("Held")).toBeInTheDocument();
  });

  it("shows Security upgrade status for packages with status 'security'", () => {
    const securityPackage: InstancePackage = {
      id: 202,
      name: "openssh-server",
      summary: "A security update package",
      status: "security",
      current_version: "8.2p1",
      available_version: "8.9p1",
    };

    renderWithProviders(
      <PackageList {...props} packages={[securityPackage]} />,
    );

    const row = screen.getByText(securityPackage.name).closest("tr");
    assert(row);
    expect(within(row).getByText("Security upgrade")).toBeInTheDocument();
  });
});
