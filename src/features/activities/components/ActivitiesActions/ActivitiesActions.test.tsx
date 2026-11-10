import * as Constants from "@/constants";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { activities } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Activity } from "../../types";
import type { ComponentProps } from "react";
import ActivitiesActions from "./ActivitiesActions";

const props: ComponentProps<typeof ActivitiesActions> = {
  selected: [],
  availableActions: { approve: true, cancel: true, redo: true },
  onExport: vi.fn(),
};

describe("ActivitiesActions", () => {
  beforeEach(() => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(true);
    setScreenSize("xxl");
  });

  afterEach(() => {
    resetScreenSize();
    vi.restoreAllMocks();
  });

  const mockActivities = [
    {
      ...activities[0],
      actions: {
        approvable: true,
        cancelable: true,
        reappliable: true,
      },
    },
    {
      ...activities[1],
      actions: {
        approvable: true,
        cancelable: true,
        reappliable: true,
      },
    },
  ] as const satisfies Activity[];

  it.each([
    {
      availableActions: { approve: true, cancel: false, redo: false },
      visibleActions: ["Approve"],
    },
    {
      availableActions: { approve: false, cancel: true, redo: false },
      visibleActions: ["Cancel"],
    },
    {
      availableActions: { approve: false, cancel: false, redo: true },
      visibleActions: ["Redo"],
    },
    {
      availableActions: { approve: false, cancel: false, redo: false },
      visibleActions: [],
    },
  ])(
    "renders only the configured mutation actions: $visibleActions",
    ({ availableActions, visibleActions }) => {
      renderWithProviders(
        <ActivitiesActions
          {...props}
          selected={mockActivities}
          availableActions={availableActions}
        />,
      );

      for (const name of ["Approve", "Cancel", "Redo"]) {
        if (visibleActions.some((action) => action === name)) {
          expect(screen.getByRole("button", { name })).toBeEnabled();
        } else {
          expect(
            screen.queryByRole("button", { name }),
          ).not.toBeInTheDocument();
        }
      }
      expect(
        screen.getByRole("button", { name: "Export selection as TSV" }),
      ).toBeEnabled();
    },
  );

  describe("Approve button", () => {
    it("should be disabled when no activities are selected", () => {
      renderWithProviders(<ActivitiesActions {...props} selected={[]} />);

      const approveButton = screen.getByRole("button", { name: "Approve" });
      expect(approveButton).toHaveAttribute("aria-disabled", "true");
    });

    it("should be enabled when activities with approvable action are selected", () => {
      renderWithProviders(
        <ActivitiesActions {...props} selected={mockActivities} />,
      );

      const approveButton = screen.getByRole("button", { name: "Approve" });
      expect(approveButton).not.toHaveAttribute("aria-disabled");
      expect(approveButton).toBeEnabled();
    });

    it("should be disabled when selected activities are not approvable", () => {
      const nonApprovableActivities = [
        {
          ...activities[0],
          actions: {
            approvable: false,
            cancelable: true,
            reappliable: true,
          },
        },
      ];

      renderWithProviders(
        <ActivitiesActions {...props} selected={nonApprovableActivities} />,
      );

      const approveButton = screen.getByRole("button", { name: "Approve" });
      expect(approveButton).toHaveAttribute("aria-disabled", "true");
    });

    it("should show confirmation modal and approve single activity", async () => {
      const singleActivity = [mockActivities[0]];
      renderWithProviders(
        <ActivitiesActions {...props} selected={singleActivity} />,
      );

      await userEvent.click(screen.getByRole("button", { name: "Approve" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Approve 1 activity")).toBeInTheDocument();
      expect(
        within(modal).getByText("Are you sure you want to approve 1 activity?"),
      ).toBeInTheDocument();

      await userEvent.click(
        within(modal).getByRole("button", { name: "Approve" }),
      );

      expect(
        await screen.findByText("You have successfully approved 1 activity."),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "This activity will be delivered the next time the Landscape server connects with the client.",
        ),
      ).toBeInTheDocument();
    });

    it("should show confirmation modal and approve multiple activities", async () => {
      renderWithProviders(
        <ActivitiesActions {...props} selected={mockActivities} />,
      );

      await userEvent.click(screen.getByRole("button", { name: "Approve" }));

      const modal = screen.getByRole("dialog");
      expect(
        within(modal).getByText("Approve 2 activities"),
      ).toBeInTheDocument();
      expect(
        within(modal).getByText(
          "Are you sure you want to approve 2 activities?",
        ),
      ).toBeInTheDocument();

      await userEvent.click(
        within(modal).getByRole("button", { name: "Approve" }),
      );

      expect(
        await screen.findByText("You have successfully approved 2 activities."),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "These activities will be delivered the next time the Landscape server connects with the client.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Cancel button", () => {
    it("should be disabled when no activities are selected", () => {
      renderWithProviders(<ActivitiesActions {...props} selected={[]} />);

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      expect(cancelButton).toHaveAttribute("aria-disabled", "true");
    });

    it("should be enabled when activities with cancelable action are selected", () => {
      renderWithProviders(
        <ActivitiesActions {...props} selected={mockActivities} />,
      );

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      expect(cancelButton).not.toHaveAttribute("aria-disabled");
      expect(cancelButton).toBeEnabled();
    });

    it("should be disabled when selected activities are not cancelable", () => {
      const nonCancelableActivities = [
        {
          ...activities[0],
          actions: {
            approvable: true,
            cancelable: false,
            reappliable: true,
          },
        },
      ];

      renderWithProviders(
        <ActivitiesActions {...props} selected={nonCancelableActivities} />,
      );

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      expect(cancelButton).toHaveAttribute("aria-disabled", "true");
    });

    it("should show confirmation modal and cancel single activity", async () => {
      const singleActivity = [mockActivities[0]];
      renderWithProviders(
        <ActivitiesActions {...props} selected={singleActivity} />,
      );

      await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Cancel 1 activity")).toBeInTheDocument();
      expect(
        within(modal).getByText("Are you sure you want to cancel 1 activity?"),
      ).toBeInTheDocument();

      await userEvent.click(
        within(modal).getByRole("button", { name: "Confirm" }),
      );

      expect(
        await screen.findByText("You have successfully canceled 1 activity."),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "This activity won't be delivered to the client and will not run.",
        ),
      ).toBeInTheDocument();
    });

    it("should show confirmation modal and cancel multiple activities", async () => {
      renderWithProviders(
        <ActivitiesActions {...props} selected={mockActivities} />,
      );

      await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

      const modal = screen.getByRole("dialog");
      expect(
        within(modal).getByText("Cancel 2 activities"),
      ).toBeInTheDocument();
      expect(
        within(modal).getByText(
          "Are you sure you want to cancel 2 activities?",
        ),
      ).toBeInTheDocument();

      await userEvent.click(
        within(modal).getByRole("button", { name: "Confirm" }),
      );

      expect(
        await screen.findByText("You have successfully canceled 2 activities."),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "These activities won't be delivered to the client and will not run.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Redo button", () => {
    it("should be disabled when no activities are selected", () => {
      renderWithProviders(<ActivitiesActions {...props} selected={[]} />);

      const redoButton = screen.getByRole("button", { name: "Redo" });
      expect(redoButton).toHaveAttribute("aria-disabled", "true");
    });

    it("should be enabled when activities with reappliable action are selected", () => {
      renderWithProviders(
        <ActivitiesActions {...props} selected={mockActivities} />,
      );

      const redoButton = screen.getByRole("button", { name: "Redo" });
      expect(redoButton).not.toHaveAttribute("aria-disabled");
      expect(redoButton).toBeEnabled();
    });

    it("should be disabled when selected activities are not reappliable", () => {
      const nonReappliableActivities = [
        {
          ...activities[0],
          actions: {
            approvable: true,
            cancelable: true,
            reappliable: false,
          },
        },
      ];

      renderWithProviders(
        <ActivitiesActions {...props} selected={nonReappliableActivities} />,
      );

      const redoButton = screen.getByRole("button", { name: "Redo" });
      expect(redoButton).toHaveAttribute("aria-disabled", "true");
    });

    it("should show confirmation modal and redo single activity", async () => {
      const singleActivity = [mockActivities[0]];
      renderWithProviders(
        <ActivitiesActions {...props} selected={singleActivity} />,
      );

      await userEvent.click(screen.getByRole("button", { name: "Redo" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Redo 1 activity")).toBeInTheDocument();
      expect(
        within(modal).getByText("Are you sure you want to redo 1 activity?"),
      ).toBeInTheDocument();

      await userEvent.click(
        within(modal).getByRole("button", { name: "Redo" }),
      );

      expect(
        await screen.findByText("You have successfully redone 1 activity."),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "An activity has been queued to re-run this activity.",
        ),
      ).toBeInTheDocument();
    });

    it("should show confirmation modal and redo multiple activities", async () => {
      renderWithProviders(
        <ActivitiesActions {...props} selected={mockActivities} />,
      );

      await userEvent.click(screen.getByRole("button", { name: "Redo" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Redo 2 activities")).toBeInTheDocument();
      expect(
        within(modal).getByText("Are you sure you want to redo 2 activities?"),
      ).toBeInTheDocument();

      await userEvent.click(
        within(modal).getByRole("button", { name: "Redo" }),
      );

      expect(
        await screen.findByText("You have successfully redone 2 activities."),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Activities have been queued to re-run these activities.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Mixed action availability", () => {
    it("should disable button when at least one selected activity lacks the required action", () => {
      const mixedActivities = [
        {
          ...activities[0],
          actions: {
            approvable: true,
            cancelable: true,
            reappliable: true,
          },
        },
        {
          ...activities[1],
          actions: {
            approvable: false,
            cancelable: true,
            reappliable: true,
          },
        },
      ];

      renderWithProviders(
        <ActivitiesActions {...props} selected={mixedActivities} />,
      );

      const approveButton = screen.getByRole("button", { name: "Approve" });
      expect(approveButton).toHaveAttribute("aria-disabled", "true");

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      expect(cancelButton).not.toHaveAttribute("aria-disabled");
      expect(cancelButton).toBeEnabled();
    });
  });

  it("calls the parent export handler", async () => {
    const onExport = vi.fn();
    renderWithProviders(
      <ActivitiesActions
        {...props}
        selected={mockActivities}
        onExport={onExport}
      />,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: "Export selection as TSV" }),
    );

    expect(onExport).toHaveBeenCalledOnce();
  });

  it("does not render the export button when TSV exports are disabled", async () => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(false);

    renderWithProviders(
      <ActivitiesActions {...props} selected={mockActivities} />,
    );

    await expect(
      screen.findByRole(
        "button",
        { name: "Export selection as TSV" },
        { timeout: 1000 },
      ),
    ).rejects.toThrow();
  });
});
