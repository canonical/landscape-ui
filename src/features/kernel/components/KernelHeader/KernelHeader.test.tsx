import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import type { Kernel } from "../../types";
import KernelHeader from "./KernelHeader";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";

const kernelVersion = {
  id: 1,
  version: "test-version",
  name: "test-name",
  version_rounded: "test-version-rounded",
};

const props: ComponentProps<typeof KernelHeader> = {
  hasTableData: false,
  instanceName: "test-instance",
  kernelStatuses: {
    message: "Kernel upgrade available",
    installed: kernelVersion,
    downgrades: [],
    upgrades: [],
    smart_status: "Kernel upgrade available",
  },
};

describe("KernelHeader", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setScreenSize("lg");
  });

  afterEach(() => {
    resetScreenSize();
  });

  it("renders KernelHeader", () => {
    const { container } = renderWithProviders(<KernelHeader {...props} />);
    expect(container).toHaveTexts([
      "Restart instance",
      "Downgrade kernel",
      "Upgrade kernel",
    ]);
  });

  it("disables Downgrade kernel button when no downgrade versions are available", () => {
    renderWithProviders(<KernelHeader {...props} />);
    const downgradeButton = screen.getByRole("button", {
      name: /downgrade kernel/i,
    });
    expect(downgradeButton).toHaveAttribute("aria-disabled", "true");
  });

  it("disables Upgrade kernel button when no upgrade versions are available", () => {
    renderWithProviders(<KernelHeader {...props} />);
    const upgradeButton = screen.getByRole("button", {
      name: /upgrade kernel/i,
    });
    expect(upgradeButton).toHaveAttribute("aria-disabled", "true");
  });

  it("enables Downgrade kernel button when downgrade versions are available", () => {
    const propsWithDowngrades: ComponentProps<typeof KernelHeader> = {
      ...props,
      kernelStatuses: {
        ...props.kernelStatuses,
        downgrades: [kernelVersion],
      },
    };
    renderWithProviders(<KernelHeader {...propsWithDowngrades} />);
    const downgradeButton = screen.getByRole("button", {
      name: /downgrade kernel/i,
    });
    expect(downgradeButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("enables Upgrade kernel button when upgrade versions are available", () => {
    const propsWithUpgrades: ComponentProps<typeof KernelHeader> = {
      ...props,
      kernelStatuses: {
        ...props.kernelStatuses,
        upgrades: [kernelVersion],
      },
    };
    renderWithProviders(<KernelHeader {...propsWithUpgrades} />);
    const upgradeButton = screen.getByRole("button", {
      name: /upgrade kernel/i,
    });
    expect(upgradeButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("clicking Restart instance button opens the restart side panel", async () => {
    renderWithProviders(<KernelHeader {...props} />);
    const restartButton = screen.getByRole("button", {
      name: /restart instance/i,
    });
    await user.click(restartButton);
    expect(
      screen.getByRole("button", { name: /restart/i }),
    ).toBeInTheDocument();
  });

  it("clicking Downgrade kernel button opens the downgrade side panel", async () => {
    const propsWithDowngrades: ComponentProps<typeof KernelHeader> = {
      ...props,
      kernelStatuses: {
        ...props.kernelStatuses,
        downgrades: [kernelVersion],
      },
    };
    renderWithProviders(<KernelHeader {...propsWithDowngrades} />);
    const downgradeButton = screen.getByRole("button", {
      name: /downgrade kernel/i,
    });
    await user.click(downgradeButton);
    expect(await screen.findByText(/security warning/i)).toBeInTheDocument();
  });

  it("clicking Upgrade kernel button opens the upgrade side panel", async () => {
    const propsWithUpgrades: ComponentProps<typeof KernelHeader> = {
      ...props,
      kernelStatuses: {
        ...props.kernelStatuses,
        upgrades: [kernelVersion],
      },
    };
    renderWithProviders(<KernelHeader {...propsWithUpgrades} />);
    const upgradeButton = screen.getByRole("button", {
      name: /upgrade kernel/i,
    });
    await user.click(upgradeButton);
    expect(await screen.findByText(/restart recommended/i)).toBeInTheDocument();
  });

  it("renders with null installed kernel version gracefully", () => {
    const propsWithNullInstalled: ComponentProps<typeof KernelHeader> = {
      ...props,
      kernelStatuses: {
        ...props.kernelStatuses,
        installed: null,
      },
    };
    renderWithProviders(<KernelHeader {...propsWithNullInstalled} />);
    expect(
      screen.getByRole("button", { name: /restart instance/i }),
    ).toBeInTheDocument();
  });

  it("renders with undefined downgrades and upgrades gracefully", () => {
    const propsWithNullArrays: ComponentProps<typeof KernelHeader> = {
      ...props,
      kernelStatuses: {
        ...props.kernelStatuses,
        downgrades: undefined as unknown as Kernel[],
        upgrades: undefined as unknown as Kernel[],
      },
    };
    renderWithProviders(<KernelHeader {...propsWithNullArrays} />);
    const downgradeButton = screen.getByRole("button", {
      name: /downgrade kernel/i,
    });
    const upgradeButton = screen.getByRole("button", {
      name: /upgrade kernel/i,
    });
    expect(downgradeButton).toHaveAttribute("aria-disabled", "true");
    expect(upgradeButton).toHaveAttribute("aria-disabled", "true");
  });

  it("renders with null kernelStatuses gracefully", () => {
    const propsWithNullStatuses: ComponentProps<typeof KernelHeader> = {
      ...props,
      kernelStatuses: null as unknown as ComponentProps<
        typeof KernelHeader
      >["kernelStatuses"],
    };
    renderWithProviders(<KernelHeader {...propsWithNullStatuses} />);
    expect(
      screen.getByRole("button", { name: /restart instance/i }),
    ).toBeInTheDocument();
  });

  it("clicking Restart instance button with upgrade versions available opens the restart side panel", async () => {
    const propsWithUpgrades: ComponentProps<typeof KernelHeader> = {
      ...props,
      hasTableData: true,
      kernelStatuses: {
        ...props.kernelStatuses,
        upgrades: [kernelVersion],
      },
    };
    renderWithProviders(<KernelHeader {...propsWithUpgrades} />);
    const restartButton = screen.getByRole("button", {
      name: /restart instance/i,
    });
    await user.click(restartButton);
    expect(
      await screen.findByRole("button", { name: /upgrade and restart/i }),
    ).toBeInTheDocument();
  });
});
