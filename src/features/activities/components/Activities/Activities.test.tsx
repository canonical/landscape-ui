import { activities } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import * as Constants from "@/constants";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Activities from "./Activities";

type ActivityAvailability = Pick<
  ComponentProps<typeof Activities>,
  "availableActions" | "availableFilters" | "searchHelpTerms"
>;

const activityGroupAvailability: ActivityAvailability = {
  availableActions: { approve: false, cancel: false, redo: false },
  availableFilters: { status: true, type: false, date: true },
  searchHelpTerms: {
    id: true,
    parentId: false,
    createdAfter: true,
    createdBefore: true,
    creator: true,
    computer: false,
    type: false,
  },
};

const instanceAvailability: ActivityAvailability = {
  availableActions: { approve: true, cancel: true, redo: true },
  availableFilters: { status: true, type: true, date: true },
  searchHelpTerms: {
    id: true,
    parentId: true,
    createdAfter: true,
    createdBefore: true,
    creator: true,
    computer: false,
    type: true,
  },
};

const getProps = (
  availability: ActivityAvailability,
  overrides: Partial<ComponentProps<typeof Activities>> = {},
): ComponentProps<typeof Activities> => ({
  children: <div data-testid="activity-list" />,
  activities,
  activitiesCount: activities.length,
  selectedActivities: [],
  setSelectedActivities: vi.fn(),
  ...availability,
  ...overrides,
});

describe("Activities", () => {
  afterEach(() => {
    resetScreenSize();
    vi.restoreAllMocks();
  });

  it.each([
    ["activity groups", activityGroupAvailability],
    ["instance activities", instanceAvailability],
  ])("configures filters and actions for %s", async (_scope, availability) => {
    setScreenSize("xxl");
    renderWithProviders(<Activities {...getProps(availability)} />);

    expect(screen.getByTestId("activity-list")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Status" })).toBeInTheDocument();

    if (availability.availableFilters.type) {
      expect(screen.getByRole("button", { name: "Type" })).toBeInTheDocument();
    } else {
      expect(
        screen.queryByRole("button", { name: "Type" }),
      ).not.toBeInTheDocument();
    }

    for (const [name, available] of [
      ["Approve", availability.availableActions.approve],
      ["Cancel", availability.availableActions.cancel],
      ["Redo", availability.availableActions.redo],
    ] as const) {
      if (available) {
        expect(screen.getByRole("button", { name })).toBeInTheDocument();
      } else {
        expect(screen.queryByRole("button", { name })).not.toBeInTheDocument();
      }
    }

    await userEvent.click(screen.getByRole("button", { name: "Status" }));
    expect(
      screen.queryByRole("button", { name: "Unapproved" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Failed" })).toBeInTheDocument();
  });

  it.each([
    ["activity groups", activityGroupAvailability, false],
    ["instance activities", instanceAvailability, true],
  ])(
    "shows parent-id search help for %s: %s",
    async (_scope, availability, includesParentId) => {
      renderWithProviders(<Activities {...getProps(availability)} />);
      await userEvent.click(screen.getByRole("button", { name: /help/i }));
      const dialog = screen.getByRole("dialog", { name: /search help/i });
      const rows = within(dialog).getAllByRole("row").slice(1);
      const terms = rows.map(
        (row) => within(row).getAllByRole("cell")[0]?.textContent,
      );

      expect(terms).toContain("id:<activity_id>");
      expect(terms).toContain("created-after:<date>");
      expect(terms.includes("parent-id:<parent_id>")).toBe(includesParentId);
      expect(terms.includes("type:<type>")).toBe(
        availability.searchHelpTerms.type,
      );
    },
  );

  it("forwards onExport to the header export button", async () => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(true);
    setScreenSize("xxl");
    const onExport = vi.fn();
    renderWithProviders(
      <Activities
        {...getProps(instanceAvailability, {
          selectedActivities: [activities[0]],
          onExport,
        })}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Export selection as TSV" }),
    );

    expect(onExport).toHaveBeenCalledOnce();
  });
});
