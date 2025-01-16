import { renderWithProviders } from "@/tests/render";
import InstancesPageActions from "./InstancesPageActions";
import { instances } from "@/tests/mocks/instance";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach } from "vitest";
import * as Constants from "@/constants";

const selected = instances.slice(0, 2);

const BUTTON_LABELS = [
  "Shutdown",
  "Restart",
  "View report",
  "Run script",
  "Upgrade",
  "Assign",
];

describe("InstancesPageActions", () => {
  beforeEach(() => {
    vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(true);
  });

  it("should render correctly", () => {
    const { container } = renderWithProviders(
      <InstancesPageActions selected={selected} />,
    );

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(BUTTON_LABELS.length);

    expect(container).toHaveTexts(BUTTON_LABELS);

    for (const button of buttons) {
      expect(button).not.toHaveClass("is-disabled");
    }
  });

  it("should disable buttons", () => {
    renderWithProviders(<InstancesPageActions selected={[]} />);

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(BUTTON_LABELS.length);

    for (const button of buttons) {
      expect(button).toHaveClass("is-disabled");
    }
  });

  it("'View report' button should be visible when feature enabled", () => {
    renderWithProviders(<InstancesPageActions selected={selected} />);

    const button = screen.queryByRole("button", { name: /view report/i });
    expect(button).toBeInTheDocument();
  });

  it("'View report' button should not be visible when feature disabled", () => {
    vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(false);

    renderWithProviders(<InstancesPageActions selected={selected} />);

    const button = screen.queryByRole("button", { name: /view report/i });
    expect(button).not.toBeInTheDocument();
  });

  test("'View report' button should be visible when feature enabled", async () => {
    renderWithProviders(<InstancesPageActions selected={selected} />);

    const button = screen.queryByRole("button", { name: /view report/i });
    expect(button).toBeInTheDocument();
  });

  test("'View report' button should not be visible when feature disabled", async () => {
    vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(false);

    renderWithProviders(<InstancesPageActions selected={selected} />);

    const button = screen.queryByRole("button", { name: /view report/i });
    expect(button).not.toBeInTheDocument();
  });

  describe("should proper handle button clicks", () => {
    beforeEach(() => {
      renderWithProviders(<InstancesPageActions selected={selected} />);
    });

    it("'Shutdown' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /shutdown/i }));

      const dialog = screen.getByRole("dialog", {
        name: /shutting down selected instances/i,
      });

      expect(dialog).toBeInTheDocument();

      await userEvent.click(
        within(dialog).getByRole("button", { name: /shutdown/i }),
      );

      screen.getByText("Selected instances have been queued for shutdown.");
    });

    it("'Restart' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /restart/i }));

      const dialog = screen.getByRole("dialog", {
        name: /restarting selected instances/i,
      });

      expect(dialog).toBeInTheDocument();

      await userEvent.click(
        within(dialog).getByRole("button", { name: /restart/i }),
      );

      screen.getByText("Selected instances have been queued for reboot.");
    });

    it("'Run script' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /run script/i }),
      );

      expect(
        screen.getByRole("heading", { name: /run script/i }),
      ).toBeInTheDocument();
    });

    it("'View report' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /view report/i }),
      );

      expect(
        screen.getByRole("heading", {
          name: `Report for ${selected.length} instances`,
        }),
      ).toBeInTheDocument();
    });

    it("'Upgrade' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /upgrade/i }));

      expect(
        screen.getByRole("heading", { name: /upgrades/i }),
      ).toBeInTheDocument();
    });

    it("'Assign' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /assign/i }));

      expect(
        screen.getByRole("button", { name: /access group/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /tags/i })).toBeInTheDocument();
    });

    it("'Assign access group' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /assign/i }));

      await userEvent.click(
        screen.getByRole("button", { name: /access group/i }),
      );

      expect(
        screen.getByRole("heading", { name: /assign access group/i }),
      ).toBeInTheDocument();
    });

    it("'Assign tags' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /assign/i }));

      await userEvent.click(screen.getByRole("button", { name: /tags/i }));

      expect(
        screen.getByRole("heading", { name: /assign tags/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Run script form warning", () => {
    it("should appear when some invalid instances are selected", async () => {
      renderWithProviders(
        <InstancesPageActions selected={instances.slice(9, 12)} />,
      );

      await userEvent.click(
        screen.getByRole("button", { name: /Run script/i }),
      );
    });
  });
});
