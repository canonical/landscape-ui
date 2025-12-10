import { ALERT_STATUSES } from "@/features/instances";
import { ROUTES } from "@/libs/routes";
import { alertsSummary } from "@/tests/mocks/alerts";
import { pendingInstances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { pluralize } from "@/utils/_helpers";
import { screen } from "@testing-library/react";
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
      name: `${pendingInstances.length} pending ${pluralize(
        pendingInstances.length,
        "computer needs",
        "computers need",
      )} authorization`,
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
});
