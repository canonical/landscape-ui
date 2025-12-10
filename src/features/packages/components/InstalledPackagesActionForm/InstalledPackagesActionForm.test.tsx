import {
  downgradePackageVersions,
  getInstancePackages,
} from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import InstalledPackagesActionForm from "./InstalledPackagesActionForm";

const instanceId = 1;
const instancePackages = getInstancePackages(instanceId);

const packageWithUpgrade = instancePackages.find(
  (pkg) => pkg.status === "installed" && pkg.available_version,
);
const securityPackage = instancePackages.find(
  (pkg) => pkg.status === "security",
);
const [installedPackage] = instancePackages;

assert(installedPackage);
assert(packageWithUpgrade);
assert(securityPackage);

describe("InstalledPackagesActionForm", () => {
  const user = userEvent.setup();

  it("renders upgrade form correctly", async () => {
    renderWithProviders(
      <InstalledPackagesActionForm
        action="upgrade"
        packages={[packageWithUpgrade]}
      />,
    );

    expect(
      screen.getByRole("button", { name: /upgrade/i }),
    ).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /upgrade/i });
    await user.click(submitButton);

    expect(await screen.findByText(/to be upgraded/i)).toBeInTheDocument();
  });

  it("submits downgrade action with selected version", async () => {
    renderWithProviders(
      <InstalledPackagesActionForm
        action="downgrade"
        packages={[installedPackage]}
      />,
    );

    const versionSelect = await screen.findByRole("combobox", {
      name: /new version/i,
    });
    await user.selectOptions(
      versionSelect,
      downgradePackageVersions[0].version,
    );

    const submitButton = screen.getByRole("button", { name: /downgrade/i });
    await user.click(submitButton);

    expect(await screen.findByText(/to be downgraded/i)).toBeInTheDocument();
  });

  describe("Remove action", () => {
    it("renders remove form with delivery options", () => {
      renderWithProviders(
        <InstalledPackagesActionForm
          action="remove"
          packages={[installedPackage]}
        />,
      );

      expect(screen.getByLabelText(/as soon as possible/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /uninstall/i }),
      ).toBeInTheDocument();
    });

    it("submits remove action successfully", async () => {
      renderWithProviders(
        <InstalledPackagesActionForm
          action="remove"
          packages={[installedPackage]}
        />,
      );

      const submitButton = screen.getByRole("button", { name: /uninstall/i });
      await user.click(submitButton);

      expect(await screen.findByText(/to uninstall/i)).toBeInTheDocument();
    });

    it("allows scheduling delivery for later", async () => {
      renderWithProviders(
        <InstalledPackagesActionForm
          action="remove"
          packages={[installedPackage]}
        />,
      );

      const scheduledRadio = screen.getByLabelText(/scheduled/i);
      await user.click(scheduledRadio);

      expect(screen.getByLabelText(/deliver after/i)).toBeInTheDocument();
    });
  });

  it("submits hold action successfully", async () => {
    renderWithProviders(
      <InstalledPackagesActionForm
        action="hold"
        packages={[installedPackage]}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /hold/i });
    await user.click(submitButton);

    expect(await screen.findByText(/to be held/i)).toBeInTheDocument();
  });

  it("submits unhold action successfully", async () => {
    renderWithProviders(
      <InstalledPackagesActionForm
        action="unhold"
        packages={[installedPackage]}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /unhold/i });
    await user.click(submitButton);

    expect(await screen.findByText(/to be unheld/i)).toBeInTheDocument();
  });

  describe("Randomization options", () => {
    it("shows randomization field when enabled", async () => {
      renderWithProviders(
        <InstalledPackagesActionForm
          action="remove"
          packages={[installedPackage]}
        />,
      );

      const randomizeYesRadio = screen.getByLabelText(/^yes$/i);
      await user.click(randomizeYesRadio);

      expect(
        screen.getByRole("spinbutton", { name: /delay window/i }),
      ).toBeInTheDocument();
    });
  });
});
