import { ALERT_STATUSES } from "@/features/instances";
import { ROUTES } from "@/libs/routes";
import { alertsSummary } from "@/tests/mocks/alerts";
import { pendingInstances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AlertNotificationsList from "./AlertNotificationsList";
import { getRouteParams } from "./helpers";

const alertsWithoutPending = alertsSummary.filter(
  (alert) => alert.alert_type !== "PendingComputersAlert",
);

describe("AlertNotificationsList", () => {
  it("renders the correct number of alerts", () => {
    renderWithProviders(
      <AlertNotificationsList
        alerts={alertsSummary}
        pendingInstances={pendingInstances}
      />,
    );
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(alertsSummary.length);
  });

  it("renders the correct icon for each alert", () => {
    renderWithProviders(
      <AlertNotificationsList
        alerts={alertsSummary}
        pendingInstances={pendingInstances}
      />,
    );

    const listItems = screen.getAllByRole("listitem");

    listItems.forEach((item) => {
      const match = alertsWithoutPending.find(
        (alert) => alert.summary === item.textContent,
      );

      if (match) {
        expect(item).toHaveIcon(
          `p-icon--${ALERT_STATUSES[match.alert_type].icon.color ?? ALERT_STATUSES[match.alert_type].icon.gray}`,
        );
      }
    });

    const pendingAlert = screen.getByText(/pending/i);

    const icon = pendingAlert.previousElementSibling;
    expect(icon).toBeInTheDocument();

    expect(icon?.className).toContain(
      `p-icon--${ALERT_STATUSES.PendingComputersAlert.icon.color}`,
    );
  });

  it("renders a button for PendingComputersAlert", () => {
    renderWithProviders(
      <AlertNotificationsList
        alerts={alertsSummary}
        pendingInstances={pendingInstances}
      />,
    );
    const button = screen.getByRole("button", {
      name: `${pendingInstances.length} pending computers need authorization`,
    });
    expect(button).toBeInTheDocument();
  });

  it("renders links for non-PendingComputersAlert alerts", () => {
    renderWithProviders(
      <AlertNotificationsList
        alerts={alertsSummary}
        pendingInstances={pendingInstances}
      />,
    );

    const links = screen.getAllByRole("link");

    links.forEach((link) => {
      const match = alertsWithoutPending.find(
        (item) => item.summary === link.textContent,
      );

      const routeParams = match ? getRouteParams(match) : {};

      expect(link).toHaveAttribute("href", ROUTES.instances.root(routeParams));
    });
  });

  it("opens side panel when pending computers button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AlertNotificationsList
        alerts={alertsSummary}
        pendingInstances={pendingInstances}
      />,
    );

    const button = screen.getByRole("button", {
      name: `${pendingInstances.length} pending computers need authorization`,
    });

    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Review Pending Instances")).toBeInTheDocument();
    });
  });

  it("uses the list index as key when alert_type is unknown", () => {
    const unknownAlerts = [
      {
        id: 999,
        alert_type: "UnknownAlertType",
        summary: "Some unknown alert",
        activation_time: "2024-01-01T00:00:00",
      },
    ];

    renderWithProviders(
      <AlertNotificationsList alerts={unknownAlerts} pendingInstances={[]} />,
    );

    expect(screen.getByText("Some unknown alert")).toBeInTheDocument();
  });
});
