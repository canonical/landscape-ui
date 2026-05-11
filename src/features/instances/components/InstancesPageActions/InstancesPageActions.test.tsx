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
import InstancesPageActions from "./InstancesPageActions";
import { pluralizeWithCount } from "@/utils/_helpers";
import { setEndpointStatus } from "@/tests/controllers/controller";
import type { UbuntuProInfo } from "@/types/Instance";

const selected = instances.slice(0, 2);
const ubuntuProInfo = {
  result: "success",
  attached: true,
} as unknown as UbuntuProInfo;

const MENU_LABELS = ["Operations", "Grouping", "Ubuntu Pro"];

const OPERATIONS_LABELS = [
  "Shut down",
  "Restart",
  "Remove from Landscape",
  "Upgrade",
  "Upgrade distributions",
  "View report",
  "Run script",
];

const GROUPING_LABELS = ["Assign access group", "Assign tag"];

const UBUNTU_PRO_LABELS = ["Attach token", "Detach token"];

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
        selectedInstances={selected}
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
  });

  describe("Disabled and visible states", () => {
    it("should disable buttons when no instances selected", () => {
      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={false}
          selectedInstances={[]}
        />,
      );

      const buttons = screen.getAllByRole("button");

      expect(buttons).toHaveLength(MENU_LABELS.length);

      for (const button of buttons) {
        expect(button).toHaveClass("is-disabled");
      }
    });

    it("should disable buttons while getting instances", () => {
      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={true}
          selectedInstances={[]}
        />,
      );

      const buttons = screen.getAllByRole("button");

      expect(buttons).toHaveLength(MENU_LABELS.length);

      for (const button of buttons) {
        expect(button).toHaveClass("is-disabled");
      }
    });

    it("'View report' menu item should be visible when feature enabled", async () => {
      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={false}
          selectedInstances={selected}
        />,
      );

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      const button = screen.getByRole("menuitem", { name: /view report/i });
      expect(button).toBeInTheDocument();
    });

    it("'View report' menu item should not be visible when feature disabled", async () => {
      vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(false);

      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={false}
          selectedInstances={selected}
        />,
      );

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      expect(
        screen.queryByRole("menuitem", { name: /view report/i }),
      ).not.toBeInTheDocument();
    });

    it("'Upgrade' menu item should be enabled without upgrades info", async () => {
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

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      const button = screen.getByRole("menuitem", { name: /^upgrade$/i });
      expect(button).not.toHaveClass("is-disabled");
    });

    it("'Upgrade' menu item should be disabled if no upgrades are available", async () => {
      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={false}
          selectedInstances={[
            {
              ...ubuntuInstance,
              alerts: [],
            },
          ]}
        />,
      );

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      const button = screen.getByRole("menuitem", { name: /^upgrade$/i });
      expect(button).toHaveClass("is-disabled");
    });

    it("'Upgrade distributions' menu item should be disabled if no release upgrades are available", async () => {
      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={false}
          selectedInstances={[
            {
              ...ubuntuInstance,
              has_release_upgrades: false,
            },
          ]}
        />,
      );

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      const button = screen.getByRole("menuitem", {
        name: /upgrade distributions/i,
      });
      expect(button).toHaveClass("is-disabled");
    });

    it("'Run script' menu item should be disabled if script feature is disabled", async () => {
      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={false}
          selectedInstances={[{ ...windowsInstance }]}
        />,
      );

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      const button = screen.getByRole("menuitem", { name: /run script/i });
      expect(button).toHaveClass("is-disabled");
    });

    it("'Detach token' menu item should not be visible if pro licensing is disabled", async () => {
      setEndpointStatus({ status: "empty", path: "features" });

      renderWithProviders(
        <InstancesPageActions
          isGettingInstances={false}
          selectedInstances={selected}
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
          selectedInstances={[
            {
              ...ubuntuInstance,
              ubuntu_pro_info: ubuntuProInfo,
            },
          ]}
        />,
      );

      expect(
        screen.getByRole("button", { name: /replace token/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /attach token/i }),
      ).not.toBeInTheDocument();
    });
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

    it("'Shutdown' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /shut down/i }),
      );

      const dialog = screen.getByRole("dialog", {
        name: `Shut down ${pluralizeWithCount(selected.length, "instance")}`,
      });

      expect(dialog).toBeInTheDocument();

      await userEvent.click(
        within(dialog).getByRole("button", { name: /shut down/i }),
      );

      screen.getByText(
        `You queued ${pluralizeWithCount(selected.length, "instance")} to be shut down.`,
      );

      expect(dialog).not.toBeInTheDocument();
    });

    it("'Restart' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );
      await userEvent.click(screen.getByRole("menuitem", { name: /restart/i }));

      const dialog = screen.getByRole("dialog", {
        name: `Restart ${pluralizeWithCount(selected.length, "instance")}`,
      });

      expect(dialog).toBeInTheDocument();

      await userEvent.click(
        within(dialog).getByRole("button", { name: /restart/i }),
      );

      screen.getByText(
        `You queued ${pluralizeWithCount(selected.length, "instance")} to be restarted.`,
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

      expect(
        screen.getByRole("heading", { name: /run script/i }),
      ).toBeInTheDocument();
    });

    it("'View report' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /view report/i }),
      );

      expect(
        screen.getByRole("heading", {
          name: `Report for ${selected.length} instances`,
        }),
      ).toBeInTheDocument();
    });

    it("'Upgrade' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /^upgrade$/i }),
      );

      expect(
        screen.getByRole("heading", { name: /upgrades/i }),
      ).toBeInTheDocument();
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

      expect(
        screen.getByRole("heading", { name: /assign access group/i }),
      ).toBeInTheDocument();
    });

    it("'Assign tags' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[1] }),
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: /assign tag/i }),
      );

      expect(
        screen.getByRole("heading", { name: /assign tags/i }),
      ).toBeInTheDocument();
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
        selectedInstances={[
          {
            ...ubuntuInstance,
            ubuntu_pro_info: ubuntuProInfo,
          },
        ]}
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
          selectedInstances={instances.slice(startIdx, endIdx)}
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
