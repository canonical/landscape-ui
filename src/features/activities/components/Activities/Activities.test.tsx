import { activities } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import Activities from "./Activities";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import * as Constants from "@/constants";

describe("Activities", () => {
  afterEach(() => {
    resetScreenSize();
    vi.restoreAllMocks();
  });

  it.each([undefined, 1])(
    "configures filters and actions for instance %s",
    async (instanceId) => {
      setScreenSize("xxl");
      const props: ComponentProps<typeof Activities> = {
        children: <div data-testid="activity-list" />,
        activities,
        activitiesCount: activities.length,
        selectedActivities: [],
        setSelectedActivities: vi.fn(),
        instanceId,
      };
      renderWithProviders(<Activities {...props} />);
      expect(screen.getByTestId("activity-list")).toBeInTheDocument();
      if (instanceId === undefined) {
        expect(
          screen.queryByRole("button", { name: "Type" }),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: "Approve" }),
        ).not.toBeInTheDocument();
      } else {
        expect(
          screen.getByRole("button", { name: "Type" }),
        ).toBeInTheDocument();
        for (const name of ["Approve", "Cancel", "Redo"]) {
          expect(screen.getByRole("button", { name })).toBeInTheDocument();
        }
      }
      await userEvent.click(screen.getByRole("button", { name: "Status" }));
      expect(
        screen.queryByRole("button", { name: "Unapproved" }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Failed" }),
      ).toBeInTheDocument();
    },
  );

  it.each([undefined, 1])(
    "shows parent-id search help only for a single instance: %s",
    async (instanceId) => {
      const props: ComponentProps<typeof Activities> = {
        children: <div data-testid="activity-list" />,
        activities,
        activitiesCount: activities.length,
        selectedActivities: [],
        setSelectedActivities: vi.fn(),
        instanceId,
      };
      renderWithProviders(<Activities {...props} />);
      await userEvent.click(screen.getByRole("button", { name: /help/i }));
      const dialog = screen.getByRole("dialog", { name: /search help/i });

      if (instanceId === undefined) {
        expect(dialog).not.toHaveTextContent("parent-id:<parent_id>");
      } else {
        const terms = within(dialog)
          .getAllByRole("row")
          .slice(1, 4)
          .map((row) => within(row).getAllByRole("cell")[0]?.textContent);
        expect(terms).toEqual([
          "id:<activity_id>",
          "parent-id:<parent_id>",
          "created-after:<date>",
        ]);
      }
    },
  );

  it("forwards onExport to the header export button", async () => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(true);
    setScreenSize("xxl");
    const onExport = vi.fn();
    const props: ComponentProps<typeof Activities> = {
      children: <div data-testid="activity-list" />,
      activities,
      activitiesCount: activities.length,
      selectedActivities: [activities[0]],
      setSelectedActivities: vi.fn(),
      instanceId: 1,
      onExport,
    };
    renderWithProviders(<Activities {...props} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Export selection as TSV" }),
    );

    expect(onExport).toHaveBeenCalledOnce();
  });
});
