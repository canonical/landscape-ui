import { activities } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ActivityDetailsButtons from "./ActivityDetailsButtons";

describe("ActivityDetailsButtons", () => {
  const user = userEvent.setup();

  const mockActivity = {
    ...activities[0],
    actions: {
      approvable: true,
      cancelable: true,
      reappliable: true,
      revertable: true,
    },
  };

  describe("Approve button", () => {
    it("should render when activity is approvable", () => {
      renderWithProviders(<ActivityDetailsButtons activity={mockActivity} />);
      expect(
        screen.getByRole("button", { name: "Approve" }),
      ).toBeInTheDocument();
    });

    it("should not render when activity is not approvable", () => {
      const nonApprovableActivity = {
        ...mockActivity,
        actions: { ...mockActivity.actions, approvable: false },
      };
      renderWithProviders(
        <ActivityDetailsButtons activity={nonApprovableActivity} />,
      );
      expect(
        screen.queryByRole("button", { name: "Approve" }),
      ).not.toBeInTheDocument();
    });

    it("should show confirmation modal and approve activity", async () => {
      renderWithProviders(<ActivityDetailsButtons activity={mockActivity} />);

      await user.click(screen.getByRole("button", { name: "Approve" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Approve activity")).toBeInTheDocument();

      await user.click(within(modal).getByRole("button", { name: "Approve" }));

      expect(
        await screen.findByText("You have successfully approved an activity."),
      ).toBeInTheDocument();
    });
  });

  describe("Cancel button", () => {
    it("should render with contextual label based on other actions", () => {
      const cancelOnlyActivity = {
        ...mockActivity,
        actions: {
          approvable: false,
          cancelable: true,
          reappliable: false,
          revertable: false,
        },
      };
      renderWithProviders(
        <ActivityDetailsButtons activity={cancelOnlyActivity} />,
      );
      expect(
        screen.getByRole("button", { name: "Cancel activity" }),
      ).toBeInTheDocument();

      renderWithProviders(<ActivityDetailsButtons activity={mockActivity} />);
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
    });

    it("should not render when activity is not cancelable", () => {
      const nonCancelableActivity = {
        ...mockActivity,
        actions: { ...mockActivity.actions, cancelable: false },
      };
      renderWithProviders(
        <ActivityDetailsButtons activity={nonCancelableActivity} />,
      );
      expect(
        screen.queryByRole("button", { name: /Cancel/ }),
      ).not.toBeInTheDocument();
    });

    it("should show confirmation modal and cancel activity", async () => {
      renderWithProviders(<ActivityDetailsButtons activity={mockActivity} />);

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Cancel activity")).toBeInTheDocument();

      await user.click(within(modal).getByRole("button", { name: "Confirm" }));

      expect(
        await screen.findByText("You have successfully canceled an activity."),
      ).toBeInTheDocument();
    });
  });

  describe("Undo button", () => {
    it("should render when activity is revertable", () => {
      renderWithProviders(<ActivityDetailsButtons activity={mockActivity} />);
      expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
    });

    it("should not render when activity is not revertable", () => {
      const nonRevertableActivity = {
        ...mockActivity,
        actions: { ...mockActivity.actions, revertable: false },
      };
      renderWithProviders(
        <ActivityDetailsButtons activity={nonRevertableActivity} />,
      );
      expect(
        screen.queryByRole("button", { name: "Undo" }),
      ).not.toBeInTheDocument();
    });

    it("should show confirmation modal and undo activity", async () => {
      renderWithProviders(<ActivityDetailsButtons activity={mockActivity} />);

      await user.click(screen.getByRole("button", { name: "Undo" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Undo activity")).toBeInTheDocument();

      await user.click(within(modal).getByRole("button", { name: "Undo" }));

      expect(
        await screen.findByText("You have successfully undone an activity."),
      ).toBeInTheDocument();
    });
  });

  describe("Redo button", () => {
    it("should render when activity is reappliable", () => {
      renderWithProviders(<ActivityDetailsButtons activity={mockActivity} />);
      expect(screen.getByRole("button", { name: "Redo" })).toBeInTheDocument();
    });

    it("should not render when activity is not reappliable", () => {
      const nonReappliableActivity = {
        ...mockActivity,
        actions: { ...mockActivity.actions, reappliable: false },
      };
      renderWithProviders(
        <ActivityDetailsButtons activity={nonReappliableActivity} />,
      );
      expect(
        screen.queryByRole("button", { name: "Redo" }),
      ).not.toBeInTheDocument();
    });

    it("should show confirmation modal and redo activity", async () => {
      renderWithProviders(<ActivityDetailsButtons activity={mockActivity} />);

      await user.click(screen.getByRole("button", { name: "Redo" }));

      const modal = screen.getByRole("dialog");
      expect(within(modal).getByText("Redo activity")).toBeInTheDocument();

      await user.click(within(modal).getByRole("button", { name: "Redo" }));

      expect(
        await screen.findByText("You have successfully redone an activity."),
      ).toBeInTheDocument();
    });
  });
});
