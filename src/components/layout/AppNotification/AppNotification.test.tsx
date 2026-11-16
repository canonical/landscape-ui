import AppNotification from "./AppNotification";
import { describe, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import type { NotificationHelper } from "@/types/Notification";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants/constants";

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

    expect(screen.getByText(CONTACT_SUPPORT_TEAM_MESSAGE)).toBeInTheDocument();
  });

  it("renders success fallback when message is empty and type is not negative", () => {
    const emptyPositiveNotify: NotificationHelper = {
      ...notify,
      notification: {
        type: "positive",
        message: "",
        title: "",
      },
    };
    renderWithProviders(<AppNotification notify={emptyPositiveNotify} />);

    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(
      screen.queryByText(CONTACT_SUPPORT_TEAM_MESSAGE),
    ).not.toBeInTheDocument();
  });
});
