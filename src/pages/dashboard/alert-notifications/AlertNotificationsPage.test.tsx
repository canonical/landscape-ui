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
    const goToAlertsLink = await screen.findByRole("link", {
      name: "Go to alerts",
    });

    expect(goToAlertsLink).toBeInTheDocument();
    expect(emptyStateTitle).toBeInTheDocument();
  });

  it("renders AlertNotificationsList when alerts are present", async () => {
    renderWithProviders(<AlertNotificationsPage />);
    expectLoadingState();
    const alertsList = await screen.findByRole("list");
    expect(alertsList).toBeInTheDocument();
  });

  it("hides the pending computers alert when pending instances are forbidden", async () => {
    setEndpointStatus({ status: "forbidden", path: "GetPendingComputers" });
    renderWithProviders(<AlertNotificationsPage />);

    expect(await screen.findByRole("list")).toBeInTheDocument();
    expect(
      screen.getByText("2 computers need to be rebooted"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /pending computers? needs?/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Forbidden.")).not.toBeInTheDocument();
  });
});
