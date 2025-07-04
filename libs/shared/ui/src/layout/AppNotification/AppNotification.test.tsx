import AppNotification from "./AppNotification";
import { describe, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import type { NotificationHelper } from "@/types/Notification";

describe("AppNotification", () => {
  it("renders notification", () => {
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

    const props = {
      notify,
    };

    renderWithProviders(<AppNotification {...props} />);

    expect(screen.getByText("Notification title")).toBeInTheDocument();
    expect(screen.getByText("Notification message")).toBeInTheDocument();
  });
});
