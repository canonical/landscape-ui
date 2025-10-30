import { activities } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ActivitiesActions from "./ActivitiesActions";

describe("ActivitiesActions", () => {
  const mockActivities = [
    {
      ...activities[0],
      actions: {
        approvable: true,
        cancelable: true,
        reappliable: true,
        revertable: true,
      },
    },
    {
      ...activities[1],
      actions: {
        approvable: true,
        cancelable: true,
        reappliable: true,
        revertable: true,
      },
    },
  ];

  describe("Approve button", () => {
    it("should be disabled when no activities are selected", () => {
      renderWithProviders(<ActivitiesActions selected={[]} />);

      const approveButton = screen.getByRole("button", { name: "Approve" });
      expect(approveButton).toBeDisabled();
    });

    it("should be enabled when activities with approvable action are selected", () => {
      renderWithProviders(<ActivitiesActions selected={mockActivities} />);

      const approveButton = screen.getByRole("button", { name: "Approve" });
      expect(approveButton).not.toBeDisabled();
    });

    it("should be disabled when selected activities are not approvable", () => {
      const nonApprovableActivities = [
        {
          ...activities[0],
          actions: {
            approvable: false,
            cancelable: true,
            reappliable: true,
            revertable: true,
          },
        },
      ];

      renderWithProviders(
        <ActivitiesActions selected={nonApprovableActivities} />,
      );

      const approveButton = screen.getByRole("button", { name: "Approve" });
      expect(approveButton).toBeDisabled();
    });

    it("should show confirmation modal and approve single activity", async () => {
      const singleActivity = [mockActivities[0]];
      renderWithProviders(<ActivitiesActions selected={singleActivity} />);

      await userEvent.click(screen.getByRole("button", { name: "Approve" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Approve activity")).toBeInTheDocument();
      expect(
        within(modal).getByText(
          "Are you sure you want to approve selected activity?",
        ),
      ).toBeInTheDocument();

      await userEvent.click(
        within(modal).getByRole("button", { name: "Approve" }),
      );

      expect(
        await screen.findByText("You have successfully approved an activity."),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "This activity will be delivered the next time the Landscape server connects with the client.",
        ),
      ).toBeInTheDocument();
    });

    it("should show confirmation modal and approve multiple activities", async () => {
      renderWithProviders(<ActivitiesActions selected={mockActivities} />);

      await userEvent.click(screen.getByRole("button", { name: "Approve" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Approve activities")).toBeInTheDocument();
      expect(
        within(modal).getByText(
          "Are you sure you want to approve selected activities?",
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
      renderWithProviders(<ActivitiesActions selected={[]} />);

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      expect(cancelButton).toBeDisabled();
    });

    it("should be enabled when activities with cancelable action are selected", () => {
      renderWithProviders(<ActivitiesActions selected={mockActivities} />);

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      expect(cancelButton).not.toBeDisabled();
    });

    it("should be disabled when selected activities are not cancelable", () => {
      const nonCancelableActivities = [
        {
          ...activities[0],
          actions: {
            approvable: true,
            cancelable: false,
            reappliable: true,
            revertable: true,
          },
        },
      ];

      renderWithProviders(
        <ActivitiesActions selected={nonCancelableActivities} />,
      );

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      expect(cancelButton).toBeDisabled();
    });

    it("should show confirmation modal and cancel single activity", async () => {
      const singleActivity = [mockActivities[0]];
      renderWithProviders(<ActivitiesActions selected={singleActivity} />);

      await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Cancel activity")).toBeInTheDocument();
      expect(
        within(modal).getByText(
          "Are you sure you want to cancel selected activity?",
        ),
      ).toBeInTheDocument();

      await userEvent.click(
        within(modal).getByRole("button", { name: "Confirm" }),
      );

      expect(
        await screen.findByText("You have successfully canceled an activity."),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "This activity won't be delivered to the client and will not run.",
        ),
      ).toBeInTheDocument();
    });

    it("should show confirmation modal and cancel multiple activities", async () => {
      renderWithProviders(<ActivitiesActions selected={mockActivities} />);

      await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Cancel activities")).toBeInTheDocument();
      expect(
        within(modal).getByText(
          "Are you sure you want to cancel selected activities?",
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

  describe("Undo button", () => {
    it("should be disabled when no activities are selected", () => {
      renderWithProviders(<ActivitiesActions selected={[]} />);

      const undoButton = screen.getByRole("button", { name: "Undo" });
      expect(undoButton).toBeDisabled();
    });

    it("should be enabled when activities with revertable action are selected", () => {
      renderWithProviders(<ActivitiesActions selected={mockActivities} />);

      const undoButton = screen.getByRole("button", { name: "Undo" });
      expect(undoButton).not.toBeDisabled();
    });

    it("should be disabled when selected activities are not revertable", () => {
      const nonRevertableActivities = [
        {
          ...activities[0],
          actions: {
            approvable: true,
            cancelable: true,
            reappliable: true,
            revertable: false,
          },
        },
      ];

      renderWithProviders(
        <ActivitiesActions selected={nonRevertableActivities} />,
      );

      const undoButton = screen.getByRole("button", { name: "Undo" });
      expect(undoButton).toBeDisabled();
    });

    it("should show confirmation modal and undo single activity", async () => {
      const singleActivity = [mockActivities[0]];
      renderWithProviders(<ActivitiesActions selected={singleActivity} />);

      await userEvent.click(screen.getByRole("button", { name: "Undo" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Undo activity")).toBeInTheDocument();
      expect(
        within(modal).getByText(
          "Are you sure you want to undo selected activity?",
        ),
      ).toBeInTheDocument();

      await userEvent.click(
        within(modal).getByRole("button", { name: "Undo" }),
      );

      expect(
        await screen.findByText("You have successfully undone an activity."),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "An activity has been queued to revert the changes delivered by this activity.",
        ),
      ).toBeInTheDocument();
    });

    it("should show confirmation modal and undo multiple activities", async () => {
      renderWithProviders(<ActivitiesActions selected={mockActivities} />);

      await userEvent.click(screen.getByRole("button", { name: "Undo" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Undo activities")).toBeInTheDocument();
      expect(
        within(modal).getByText(
          "Are you sure you want to undo selected activities?",
        ),
      ).toBeInTheDocument();

      await userEvent.click(
        within(modal).getByRole("button", { name: "Undo" }),
      );

      expect(
        await screen.findByText("You have successfully undone 2 activities."),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Activities have been queued to revert the changes delivered by these activities.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Redo button", () => {
    it("should be disabled when no activities are selected", () => {
      renderWithProviders(<ActivitiesActions selected={[]} />);

      const redoButton = screen.getByRole("button", { name: "Redo" });
      expect(redoButton).toBeDisabled();
    });

    it("should be enabled when activities with reappliable action are selected", () => {
      renderWithProviders(<ActivitiesActions selected={mockActivities} />);

      const redoButton = screen.getByRole("button", { name: "Redo" });
      expect(redoButton).not.toBeDisabled();
    });

    it("should be disabled when selected activities are not reappliable", () => {
      const nonReappliableActivities = [
        {
          ...activities[0],
          actions: {
            approvable: true,
            cancelable: true,
            reappliable: false,
            revertable: true,
          },
        },
      ];

      renderWithProviders(
        <ActivitiesActions selected={nonReappliableActivities} />,
      );

      const redoButton = screen.getByRole("button", { name: "Redo" });
      expect(redoButton).toBeDisabled();
    });

    it("should show confirmation modal and redo single activity", async () => {
      const singleActivity = [mockActivities[0]];
      renderWithProviders(<ActivitiesActions selected={singleActivity} />);

      await userEvent.click(screen.getByRole("button", { name: "Redo" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Redo activity")).toBeInTheDocument();
      expect(
        within(modal).getByText(
          "Are you sure you want to redo selected activity?",
        ),
      ).toBeInTheDocument();

      await userEvent.click(
        within(modal).getByRole("button", { name: "Redo" }),
      );

      expect(
        await screen.findByText("You have successfully redone an activity."),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "An activity has been queued to re-run this activity.",
        ),
      ).toBeInTheDocument();
    });

    it("should show confirmation modal and redo multiple activities", async () => {
      renderWithProviders(<ActivitiesActions selected={mockActivities} />);

      await userEvent.click(screen.getByRole("button", { name: "Redo" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Redo activities")).toBeInTheDocument();
      expect(
        within(modal).getByText(
          "Are you sure you want to redo selected activities?",
        ),
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
            revertable: true,
          },
        },
        {
          ...activities[1],
          actions: {
            approvable: false,
            cancelable: true,
            reappliable: true,
            revertable: true,
          },
        },
      ];

      renderWithProviders(<ActivitiesActions selected={mixedActivities} />);

      const approveButton = screen.getByRole("button", { name: "Approve" });
      expect(approveButton).toBeDisabled();

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      expect(cancelButton).not.toBeDisabled();
    });
  });
});
