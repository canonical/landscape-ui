import { renderWithProviders } from "@/tests/render";
import InstancesPageActions from "./InstancesPageActions";
import { instances } from "@/tests/mocks/instance";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach } from "vitest";

const selected = instances.slice(0, 2);

describe("InstancesPageActions", () => {
  test("should render correctly", () => {
    const { container } = renderWithProviders(
      <InstancesPageActions selected={selected} />,
    );

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(6);

    expect(container).toHaveTexts([
      "Shutdown",
      "Restart",
      "View report",
      "Run script",
      "Upgrade",
      "Assign access group",
    ]);

    for (const button of buttons) {
      expect(button).not.toHaveClass("is-disabled");
    }
  });

  test("should disable buttons", () => {
    renderWithProviders(<InstancesPageActions selected={[]} />);

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(6);

    for (const button of buttons) {
      expect(button).toHaveClass("is-disabled");
    }
  });

  describe("should proper handle button clicks", () => {
    beforeEach(() => {
      renderWithProviders(<InstancesPageActions selected={selected} />);
    });

    test("'Shutdown' button", async () => {
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

    test("'Restart' button", async () => {
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

    test("'Run script' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /run script/i }),
      );

      expect(
        screen.getByRole("heading", { name: /run script/i }),
      ).toBeInTheDocument();
    });

    test("'View report' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /view report/i }),
      );

      expect(
        screen.getByRole("heading", {
          name: `Report for ${selected.length} instances`,
        }),
      ).toBeInTheDocument();
    });

    test("'Upgrade' button", async () => {
      await userEvent.click(screen.getByRole("button", { name: /upgrade/i }));

      expect(
        screen.getByRole("heading", { name: /upgrades/i }),
      ).toBeInTheDocument();
    });

    test("'Assign access group' button", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /Assign access group/i }),
      );

      expect(
        screen.getByRole("heading", { name: /Assign access group/i }),
      ).toBeInTheDocument();
    });
  });
});
