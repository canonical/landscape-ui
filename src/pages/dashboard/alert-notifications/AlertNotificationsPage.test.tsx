import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AlertNotificationsPage from "./AlertNotificationsPage";

describe("AlertNotificationsPage", () => {
  it("renders empty state when no alerts are found", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<AlertNotificationsPage />);
    const emptyStateTitle = await screen.findByText(
      "No subscribed alerts found",
    );
    const goToAlertsButton = await screen.findByRole("button", {
      name: "Go to alerts page",
    });

    expect(goToAlertsButton).toBeInTheDocument();
    expect(emptyStateTitle).toBeInTheDocument();
  });

  it("renders AlertNotificationsList when alerts are present", async () => {
    renderWithProviders(<AlertNotificationsPage />);
    expectLoadingState();
    const alertsList = await screen.findByRole("list");
    expect(alertsList).toBeInTheDocument();
  });
});
