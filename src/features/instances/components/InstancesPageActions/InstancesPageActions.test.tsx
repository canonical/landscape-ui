import * as Constants from "@/constants";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { instances, ubuntuInstance } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach } from "vitest";
import InstancesPageActions from "./InstancesPageActions";

const selected = instances.slice(0, 2);

const BUTTON_LABELS = [
  "Shut down",
  "Restart",
  "View report",
  "Run script",
  "Manage packages",
  "Assign",
  "Attach token",
];

describe("InstancesPageActions", () => {
  beforeEach(() => {
    vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(true);
    setScreenSize("xxl");
  });

  afterEach(() => {
    resetScreenSize();
  });

  it("should render correctly", () => {
    const { container } = renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        selectedInstances={selected}
      />,
    );

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(BUTTON_LABELS.length);

    expect(container).toHaveTexts(BUTTON_LABELS);

    for (const button of buttons) {
      expect(button).not.toHaveAttribute('aria-disabled');
    }
  });

  it("should disable buttons", () => {
    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        selectedInstances={[]}
      />,
    );

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(BUTTON_LABELS.length);

    for (const button of buttons) {
      expect(button).toHaveAttribute('aria-disabled');
    }
  });

    it("should disable package buttons when instances have no packages", async () => {
      const instance = selected.slice(1, 2);
      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={false}
          selectedInstances={instance}
        />,
      );

    await userEvent.click(screen.getByRole("button", { name: /manage packages/i }));

    expect(screen.getByRole("button", { name: "Upgrade" })).toHaveAttribute('aria-disabled');
    expect(screen.getByRole("button", { name: "Downgrade" })).toHaveAttribute('aria-disabled');
    expect(screen.getByRole("button", { name: "Install" })).not.toHaveAttribute('aria-disabled');
    expect(screen.getByRole("button", { name: "Uninstall" })).toHaveAttribute('aria-disabled');
    expect(screen.getByRole("button", { name: "Hold" })).toHaveAttribute('aria-disabled');
    expect(screen.getByRole("button", { name: "Unhold" })).toHaveAttribute('aria-disabled');
  });

  it("'View report' button should be visible when feature enabled", () => {
    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        selectedInstances={selected}
      />,
    );

    const button = screen.queryByRole("button", { name: /view report/i });
    expect(button).toBeInTheDocument();
  });

  it("'View report' button should not be visible when feature disabled", () => {
    vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(false);

    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        selectedInstances={selected}
      />,
    );

    const button = screen.queryByRole("button", { name: /view report/i });
    expect(button).not.toBeInTheDocument();
  });

  it("'Upgrade' button should be enabled without upgrades info", async () => {
    renderWithProviders(
      <InstancesPageActions
        isGettingInstances={false}
        selectedInstances={[
          {
            ...ubuntuInstance,
            upgrades: undefined,
          },
        ]}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /manage packages/i }));
    const button = screen.queryByRole("button", { name: /upgrade/i });
    expect(button).not.toHaveClass("is-disabled");
  });

  describe("should proper handle button clicks", () => {
    beforeEach(() => {
      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={false}
          selectedInstances={selected}
        />,
      );
    });

    it("'Shutdown' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /shut down/i }));

      const dialog = screen.getByRole("dialog", {
        name: /shutting down selected instances/i,
      });

      await userEvent.click(
        within(dialog).getByRole("button", { name: /shut down/i }),
      );

      screen.getByText("Selected instances have been queued for shutdown.");
    });

    it("'Restart' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /restart/i }));

      const dialog = screen.getByRole("dialog", {
        name: /restarting selected instances/i,
      });

      await userEvent.click(
        within(dialog).getByRole("button", { name: /restart/i }),
      );

      screen.getByText("Selected instances have been queued for reboot.");
    });

    it("'Run script' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /run script/i }),
      );

      screen.getByRole("heading", { name: /run script/i });
    });

    it("'View report' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /view report/i }),
      );

      screen.getByRole("heading", {
        name: `Report for ${selected.length} instances`,
      });
    });

    it("'Manage packages' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /manage packages/i }));

      screen.getByRole("button", { name: "Upgrade" });
      screen.getByRole("button", { name: "Downgrade" });
      screen.getByRole("button", { name: "Install" });
      screen.getByRole("button", { name: "Uninstall" });
      screen.getByRole("button", { name: "Hold" });
      screen.getByRole("button", { name: "Unhold" });
    });

    it("'Upgrade' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /manage packages/i }));
      await userEvent.click(screen.getByRole("button", { name: /upgrade/i }));

      screen.getByRole("heading", { name: /upgrade/i });
    });

    it("'Downgrade' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /manage packages/i }));
      await userEvent.click(screen.getByRole("button", { name: /downgrade/i }));

      // uncomment when downgrade form is implementated
      // screen.getByRole("heading", { name: /downgrade/i });
    });

    it("'Install' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /manage packages/i }));
      await userEvent.click(screen.getByRole("button", { name: /install/ }));
      
      screen.getByRole("heading", { name: /install/i });
    });

    it("'Uninstall' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /manage packages/i }));
      await userEvent.click(screen.getByRole("button", { name: /uninstall/i }));

      screen.getByRole("heading", { name: /uninstall/i });
    });

    it("'Hold' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /manage packages/i }));
      await userEvent.click(screen.getByRole("button", { name: /hold/ }));

      screen.getByRole("heading", { name: /hold/i });
    });

    it("'Unhold' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /manage packages/i }));
      await userEvent.click(screen.getByRole("button", { name: /unhold/i }));

      screen.getByRole("heading", { name: /unhold/i });
    });

    it("'Assign' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /assign/i }));

      screen.getByRole("button", { name: /access group/i });
      screen.getByRole("button", { name: /tags/i });
    });

    it("'Assign access group' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /assign/i }));

      await userEvent.click(
        screen.getByRole("button", { name: /access group/i }),
      );

      screen.getByRole("heading", { name: /assign access group/i });
    });

    it("'Assign tags' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /assign/i }));

      await userEvent.click(screen.getByRole("button", { name: /tags/i }));
      
      screen.getByRole("heading", { name: /assign tags/i });
    });
  });

  describe("Run script form warning", () => {
    it("should appear when some invalid instances are selected", async () => {
      const startIdx = 9;
      const endIdx = 12;

      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={false}
          selectedInstances={instances.slice(startIdx, endIdx)}
        />,
      );

      await userEvent.click(
        screen.getByRole("button", { name: /Run script/i }),
      );
    });
  });
});
