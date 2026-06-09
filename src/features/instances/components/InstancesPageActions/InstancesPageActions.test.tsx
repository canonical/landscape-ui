import { API_URL } from "@/constants";
import * as Constants from "@/constants";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import {
  instances,
  ubuntuInstance,
  windowsInstance,
} from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { ComponentProps } from "react";
import { beforeEach } from "vitest";
import InstancesPageActions from "./InstancesPageActions";
import { pluralize } from "@/utils/_helpers";
import { setEndpointStatus } from "@/tests/controllers/controller";
import type { UbuntuProInfo } from "@/types/Instance";

const selected = instances.slice(0, 2);
const ubuntuProInfo = {
  result: "success",
  attached: true,
} as unknown as UbuntuProInfo;

const MENU_LABELS = ["Operations", "Grouping", "Ubuntu Pro"];

const OPERATIONS_LABELS = [
  "Export",
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
const exportParams = {
  query: "",
  archived_only: false,
  wsl_children: false,
  wsl_parents: false,
};

const defaultProps: ComponentProps<typeof InstancesPageActions> = {
  exportParams,
  instanceCount: selected.length,
  isGettingInstances: false,
  selectedInstances: selected,
};

const renderPageActions = (
  props: Partial<ComponentProps<typeof InstancesPageActions>> = {},
) =>
  renderWithProviders(<InstancesPageActions {...defaultProps} {...props} />);

describe("InstancesPageActions", () => {
  beforeEach(() => {
    vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(true);
    setScreenSize("xxl");
    setEndpointStatus("default");
    server.use(
      http.get(`${API_URL}computers/export/annotations`, () => {
        return HttpResponse.json({ results: [] });
      }),
    );
  });

  afterEach(() => {
    resetScreenSize();
  });

  it("should render correct action groups", async () => {
    renderPageActions();

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
    it("should disable all groups when no instances are available to export", () => {
      renderPageActions({ instanceCount: 0, selectedInstances: [] });

      const buttons = screen.getAllByRole("button");

      expect(buttons).toHaveLength(MENU_LABELS.length);

      for (const button of buttons) {
        expect(button).toHaveClass("is-disabled");
      }
    });

    it("should disable buttons while getting instances", () => {
      renderPageActions({
        isGettingInstances: true,
        instanceCount: 0,
        selectedInstances: [],
      });

      const buttons = screen.getAllByRole("button");

      expect(buttons).toHaveLength(MENU_LABELS.length);

      for (const button of buttons) {
        expect(button).toHaveClass("is-disabled");
      }
    });

    it("should keep Operations enabled for filtered export without a row selection", async () => {
      renderPageActions({ instanceCount: 3, selectedInstances: [] });

      const operationsButton = screen.getByRole("button", {
        name: MENU_LABELS[0],
      });

      expect(operationsButton).not.toHaveClass("is-disabled");

      await userEvent.click(operationsButton);

      expect(
        screen.getByRole("menuitem", { name: /^export$/i }),
      ).not.toHaveClass("is-disabled");
      expect(screen.getByRole("menuitem", { name: /shut down/i })).toHaveClass(
        "is-disabled",
      );

      await userEvent.click(screen.getByRole("menuitem", { name: /^export$/i }));

      expect(
        screen.getByRole("heading", { name: /export 3 instances as tsv/i }),
      ).toBeInTheDocument();
    });

    it("'View report' menu item should be visible when feature enabled", async () => {
      renderPageActions();

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      const button = screen.getByRole("menuitem", { name: /view report/i });
      expect(button).toBeInTheDocument();
    });

    it("'View report' menu item should not be visible when feature disabled", async () => {
      vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(false);

      renderPageActions();

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      expect(
        screen.queryByRole("menuitem", { name: /view report/i }),
      ).not.toBeInTheDocument();
    });

    it("'Upgrade' menu item should be enabled without upgrades info", async () => {
      renderPageActions({
        selectedInstances: [
          {
            ...ubuntuInstance,
            upgrades: undefined,
          },
        ],
      });

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      const button = screen.getByRole("menuitem", { name: /^upgrade$/i });
      expect(button).not.toHaveClass("is-disabled");
    });

    it("'Upgrade' menu item should be disabled if no upgrades are available", async () => {
      renderPageActions({
        selectedInstances: [
          {
            ...ubuntuInstance,
            alerts: [],
          },
        ],
      });

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      const button = screen.getByRole("menuitem", { name: /^upgrade$/i });
      expect(button).toHaveClass("is-disabled");
    });

    it("'Upgrade distributions' menu item should be disabled if no release upgrades are available", async () => {
      renderPageActions({
        selectedInstances: [
          {
            ...ubuntuInstance,
            has_release_upgrades: false,
          },
        ],
      });

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      const button = screen.getByRole("menuitem", {
        name: /upgrade distributions/i,
      });
      expect(button).toHaveClass("is-disabled");
    });

    it("'Run script' menu item should be disabled if script feature is disabled", async () => {
      renderPageActions({ selectedInstances: [{ ...windowsInstance }] });

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      const button = screen.getByRole("menuitem", { name: /run script/i });
      expect(button).toHaveClass("is-disabled");
    });

    it("'Detach token' menu item should not be visible if pro licensing is disabled", async () => {
      setEndpointStatus({ status: "empty", path: "features" });

      renderPageActions();

      expect(
        screen.getByRole("button", { name: /attach token/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /detach token/i }),
      ).not.toBeInTheDocument();
    });

    it("'Replace token' menu item should be visible if instance has token", async () => {
      setEndpointStatus({ status: "empty", path: "features" });

      renderPageActions({
        selectedInstances: [
          {
            ...ubuntuInstance,
            ubuntu_pro_info: ubuntuProInfo,
          },
        ],
      });

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
      renderPageActions();
    });

    it("'Export' menu item", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );
      await userEvent.click(screen.getByRole("menuitem", { name: /^export$/i }));

      expect(
        screen.getByRole("heading", {
          name: `Export ${pluralize(selected.length, ["instance"], "exact")} as TSV`,
        }),
      ).toBeInTheDocument();
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

      expect(dialog).toBeInTheDocument();

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

      expect(dialog).toBeInTheDocument();

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
    renderPageActions({
      selectedInstances: [
        {
          ...ubuntuInstance,
          ubuntu_pro_info: ubuntuProInfo,
        },
      ],
    });

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

      renderPageActions({ selectedInstances: instances.slice(startIdx, endIdx) });

      await userEvent.click(
        screen.getByRole("button", { name: MENU_LABELS[0] }),
      );

      await userEvent.click(
        screen.getByRole("menuitem", { name: /Run script/i }),
      );

      expect(await screen.findByText(/this script will/i)).toBeInTheDocument();
    });
  });
});
