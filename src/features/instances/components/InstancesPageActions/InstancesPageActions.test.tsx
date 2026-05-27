import * as Constants from "@/constants";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import {
  instances,
  ubuntuInstance,
  windowsInstance,
} from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach } from "vitest";
import { getFeatures } from "../../helpers";
import InstancesPageActions from "./InstancesPageActions";
import { pluralize } from "@/utils/_helpers";
import { setEndpointStatus } from "@/tests/controllers/controller";
import type { UbuntuProInfo } from "@/types/Instance";

const selected = instances.slice(0, 2);
const ubuntuProInfo = {
  result: "success",
  attached: true,
} as unknown as UbuntuProInfo;

const MENU_LABELS = ["Operations", "Grouping", "Ubuntu Pro", "Deb management"];

const OPERATIONS_LABELS = [
  "Shut down",
  "Restart",
  "Remove from Landscape",
  "Upgrade distributions",
  "View report",
  "Run script",
  "Remove from Landscape",
];

const GROUPING_LABELS = ["Assign access group", "Assign tag"];

const UBUNTU_PRO_LABELS = ["Attach token", "Detach token"];

const DEB_MANAGEMENT_LABELS = [
  "Apply upgrades (advanced)",
  "Apply all upgrades",
  "Apply all security upgrades",
  "Install",
  "Uninstall",
  "Downgrade",
  "Hold",
  "Unhold",
];

describe("InstancesPageActions", () => {
  beforeEach(() => {
    vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(true);
    setScreenSize("xxl");
    setEndpointStatus("default");
  });

  afterEach(() => {
    resetScreenSize();
  });

  it("should render correct action groups", async () => {
    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        toggledInstances={selected}
        instanceCount={instances.length}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(MENU_LABELS.length);

    await userEvent.click(screen.getByRole("button", { name: MENU_LABELS[0] }));
    for (const label of OPERATIONS_LABELS) {
      expect(screen.getByRole("menuitem", { name: label })).toBeInTheDocument();
    }

    await userEvent.click(screen.getByRole("button", { name: MENU_LABELS[1] }));
    for (const label of GROUPING_LABELS) {
      expect(screen.getByRole("menuitem", { name: label })).toBeInTheDocument();
    }

    await userEvent.click(screen.getByRole("button", { name: MENU_LABELS[2] }));
    for (const label of UBUNTU_PRO_LABELS) {
      expect(screen.getByRole("menuitem", { name: label })).toBeInTheDocument();
    }

    await userEvent.click(screen.getByRole("button", { name: MENU_LABELS[3] }));
    for (const label of DEB_MANAGEMENT_LABELS) {
      expect(screen.getByRole("menuitem", { name: label })).toBeInTheDocument();
    }

    for (const button of buttons) {
      expect(button).not.toHaveAttribute("aria-disabled");
    }
  });

  it("should disable buttons", () => {
    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        toggledInstances={[]}
        instanceCount={instances.length}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(MENU_LABELS.length);

    for (const button of buttons) {
      expect(button).toHaveAttribute("aria-disabled", "true");
      expect(button).toHaveClass("is-disabled");
    }
  });

  it("'View report' menu item should be visible when feature enabled", async () => {
    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        toggledInstances={selected}
        instanceCount={instances.length}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: MENU_LABELS[0] }));

    const button = screen.getByRole("menuitem", { name: /view report/i });
    expect(button).toBeInTheDocument();
  });

  it("'View report' menu item should not be visible when feature disabled", async () => {
    vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(false);

    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        toggledInstances={selected}
        instanceCount={instances.length}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: MENU_LABELS[0] }));

    expect(
      screen.queryByRole("menuitem", { name: /view report/i }),
    ).not.toBeInTheDocument();
  });

  it("'Upgrade' menu item should be enabled without upgrades info", async () => {
    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        toggledInstances={[
          {
            ...ubuntuInstance,
            upgrades: undefined,
          },
        ]}
        instanceCount={instances.length}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: MENU_LABELS[3] }));

    const button = screen.getByRole("menuitem", {
      name: "Apply upgrades (advanced)",
    });
    expect(button).not.toHaveClass("is-disabled");
  });

  it("'Upgrade' menu item should be disabled if no upgrades are available", async () => {
    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        toggledInstances={[
          {
            ...ubuntuInstance,
            alerts: [],
          },
        ]}
        instanceCount={instances.length}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: MENU_LABELS[3] }));

    const button = screen.getByRole("menuitem", {
      name: "Apply upgrades (advanced)",
    });
    expect(button).toHaveClass("is-disabled");
  });

  it("should disable package buttons when instances do not have the package feature", async () => {
    const toggledInstance = instances.find(
      (instance) => !getFeatures(instance).packages,
    );

    assert(toggledInstance);

    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        toggledInstances={[toggledInstance]}
        instanceCount={instances.length}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: MENU_LABELS[3] }));

    for (const label of DEB_MANAGEMENT_LABELS) {
      const menuItem = screen.getByRole("menuitem", { name: label });
      expect(menuItem).toHaveAttribute("aria-disabled", "true");
    }
  });

  it("'Upgrade distributions' menu item should be disabled if no release upgrades are available", async () => {
    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        toggledInstances={[
          {
            ...ubuntuInstance,
            has_release_upgrades: false,
          },
        ]}
        instanceCount={instances.length}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: MENU_LABELS[0] }));

    const button = screen.getByRole("menuitem", {
      name: /upgrade distributions/i,
    });
    expect(button).toHaveClass("is-disabled");
  });

  it("'Run script' menu item should be disabled if script feature is disabled", async () => {
    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        toggledInstances={[{ ...windowsInstance }]}
        instanceCount={instances.length}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: MENU_LABELS[0] }));

    const button = screen.getByRole("menuitem", { name: /run script/i });
    expect(button).toHaveClass("is-disabled");
  });

  it("'Detach token' menu item should not be visible if pro licensing is disabled", async () => {
    setEndpointStatus({ status: "empty", path: "features" });

    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        toggledInstances={selected}
        instanceCount={instances.length}
      />,
    );

    expect(
      screen.getByRole("button", { name: /attach token/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /detach token/i }),
    ).not.toBeInTheDocument();
  });

  it("'Replace token' menu item should be visible if instance has token", async () => {
    setEndpointStatus({ status: "empty", path: "features" });

    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        toggledInstances={[
          {
            ...ubuntuInstance,
            ubuntu_pro_info: ubuntuProInfo,
          },
        ]}
        instanceCount={instances.length}
      />,
    );

    expect(
      screen.getByRole("button", { name: /replace token/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /attach token/i }),
    ).not.toBeInTheDocument();
  });

  describe("should proper handle button clicks", () => {
    beforeEach(() => {
      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={false}
          toggledInstances={selected}
          instanceCount={instances.length}
        />,
      );
    });

    it("'Shutdown' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /shut down/i }),
      );

      const dialog = screen.getByRole("dialog", {
        name: `Shut down ${pluralize(selected.length, ["instance"], "exact")}`,
      });

      await userEvent.click(
        within(dialog).getByRole("button", { name: /shut down/i }),
      );

      screen.getByText(
        `You queued ${pluralize(selected.length, ["instance"], "exact")} to be shut down.`,
      );

      expect(dialog).not.toBeInTheDocument();
    });

    it("'Restart' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );
      await userEvent.click(screen.getByRole("menuitem", { name: /restart/i }));

      const dialog = screen.getByRole("dialog", {
        name: `Restart ${pluralize(selected.length, ["instance"], "exact")}`,
      });

      await userEvent.click(
        within(dialog).getByRole("button", { name: /restart/i }),
      );

      screen.getByText(
        `You queued ${pluralize(selected.length, ["instance"], "exact")} to be restarted.`,
      );

      expect(dialog).not.toBeInTheDocument();
    });

    it("'Run script' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /run script/i }),
      );

      screen.getByRole("heading", { name: /run script/i });
    });

    it("'View report' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /view report/i }),
      );

      screen.getByRole("heading", {
        name: `Report for ${selected.length} instances`,
      });
    });

    it("'Deb management' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[3] }),
      );

      for (const label of DEB_MANAGEMENT_LABELS) {
        screen.getByRole("menuitem", { name: label });
      }
    });

    it("'Upgrade' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[3] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /apply upgrades \(advanced\)/i }),
      );

      screen.getByRole("heading", { name: /upgrade/i });
    });

    it("'Downgrade' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[3] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /downgrade/i }),
      );

      // uncomment when downgrade form is implementated
      // screen.getByRole("heading", { name: /downgrade/i });
    });

    it("'Install' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[3] }),
      );
      await userEvent.click(screen.getByRole("menuitem", { name: /install/ }));

      screen.getByRole("heading", { name: /install/i });
    });

    it("'Uninstall' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[3] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /uninstall/i }),
      );

      screen.getByRole("heading", { name: /uninstall/i });
    });

    it("'Hold' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[3] }),
      );
      await userEvent.click(screen.getByRole("menuitem", { name: /hold/ }));

      screen.getByRole("heading", { name: /hold/i });
    });

    it("'Unhold' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[3] }),
      );
      await userEvent.click(screen.getByRole("menuitem", { name: /unhold/i }));

      screen.getByRole("heading", { name: /unhold/i });
    });

    it("'Upgrade distributions' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /upgrade distributions/i }),
      );

      expect(
        screen.getByRole("heading", { name: /upgrade distributions/i }),
      ).toBeInTheDocument();
    });

    it("'Remove from Landscape' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /remove from landscape/i }),
      );

      expect(
        screen.getByRole("heading", { name: /remove .* from Landscape/i }),
      ).toBeInTheDocument();
    });

    it("'Assign access group' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[1] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /assign access group/i }),
      );

      screen.getByRole("heading", { name: /assign access group/i });
    });

    it("'Assign tags' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[1] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /assign tag/i }),
      );

      screen.getByRole("heading", { name: /assign tags/i });
    });

    it("'Attach token' menu item", async () => {
      await userEvent.click(
        await screen.findByRole("button", { name: MENU_LABELS[2] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /attach token/i }),
      );

      expect(
        screen.getByRole("heading", { name: /attach Ubuntu Pro token to .*/i }),
      ).toBeInTheDocument();
    });

    it("'Detach token' menu item", async () => {
      await userEvent.click(
        await screen.findByRole("button", { name: MENU_LABELS[2] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /detach token/i }),
      );

      expect(
        screen.getByRole("heading", { name: /detach Ubuntu Pro token/i }),
      ).toBeInTheDocument();
    });
  });

  it("handles click for 'Replace token' menu item", async () => {
    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        toggledInstances={[
          {
            ...ubuntuInstance,
            ubuntu_pro_info: ubuntuProInfo,
          },
        ]}
        instanceCount={instances.length}
      />,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: MENU_LABELS[2] }),
    );
    await userEvent.click(
      screen.getByRole("menuitem", { name: /replace token/i }),
    );

    expect(
      screen.getByRole("heading", { name: /replace Ubuntu Pro token/i }),
    ).toBeInTheDocument();
  });

  describe("Run script form warning", () => {
    it("should appear when some invalid instances are selected", async () => {
      const startIdx = 9;
      const endIdx = 12;

      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={false}
          toggledInstances={instances.slice(startIdx, endIdx)}
          instanceCount={instances.length}
        />,
      );

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      await userEvent.click(
        screen.getByRole("menuitem", { name: /Run script/i }),
      );
    });
  });
});
