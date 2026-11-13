import AppNotification from "./AppNotification";
import { describe, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import type { NotificationHelper } from "@/types/Notification";

const notify: NotificationHelper = {
  notification: {
    type: "positive",
    message: "Notification message",
    title: "Notification title",
  },
  success: () => undefined,
  error: () => undefined,
  info: () => undefined,
  clear: () => undefined,
};

describe("AppNotification", () => {
  it("renders notification", () => {
    renderWithProviders(<AppNotification notify={notify} />);

    expect(screen.getByText("Notification title")).toBeInTheDocument();
    expect(screen.getByText("Notification message")).toBeInTheDocument();
  });

  it("renders fallback message when message is empty", () => {
    const emptyNotify: NotificationHelper = {
      ...notify,
      notification: {
        type: "negative",
        message: "",
        title: "",
      },
    };
    renderWithProviders(<AppNotification notify={emptyNotify} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
