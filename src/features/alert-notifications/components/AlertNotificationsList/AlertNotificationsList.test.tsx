import { STATUSES } from "@/pages/dashboard/instances/InstanceList/constants";
import { alertsSummary } from "@/tests/mocks/alerts";
import { pendingInstances } from "@/tests/mocks/instance";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AlertNotificationsList from "./AlertNotificationsList";
import { ROOT_PATH } from "@/constants";

const alertsWithoutPending = alertsSummary.filter(
  (alert) => alert.alert_type !== "PendingComputersAlert",
);

describe("AlertNotificationsList", () => {
  it("renders the correct number of alerts", () => {
    render(
      <AlertNotificationsList
        alerts={alertsSummary}
        pendingInstances={pendingInstances}
      />,
    );
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(alertsSummary.length);
  });

  it("renders the correct icon for each alert", () => {
    render(
      <AlertNotificationsList
        alerts={alertsSummary}
        pendingInstances={pendingInstances}
      />,
    );

    const listItems = screen.getAllByRole("listitem");

    listItems.forEach((item) => {
      const alert = alertsWithoutPending.find((alert) =>
        alert.alert_type !== "PendingComputersAlert"
          ? alert.summary === item.textContent
          : null,
      );

      const icon = item.querySelector("i");

      if (icon && alert) {
        expect(icon.className).toContain(
          `p-icon--${STATUSES[alert.alert_type].icon.color}`,
        );
      }
    });

    const pendingAlert = screen.getByText(/pending/i);

    const icon = pendingAlert.previousElementSibling;
    expect(icon).toBeInTheDocument();

    expect(icon!.className).toContain(
      `p-icon--${STATUSES.PendingComputersAlert.icon.color}`,
    );
  });

  it("renders a button for PendingComputersAlert", () => {
    render(
      <AlertNotificationsList
        alerts={alertsSummary}
        pendingInstances={pendingInstances}
      />,
    );
    const button = screen.getByRole("button", {
      name: /1 pending computer needs authorization/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("renders links for non-PendingComputersAlert alerts", () => {
    render(
      <AlertNotificationsList
        alerts={alertsSummary}
        pendingInstances={pendingInstances}
      />,
    );

    const links = screen.getAllByRole("link");

    links.forEach((link) => {
      const alert = alertsWithoutPending.find(
        (alert) => alert.summary === link.textContent,
      )!;

      expect(link).toHaveAttribute(
        "href",
        `${ROOT_PATH}instances?status=${STATUSES[alert.alert_type].filterValue}`,
      );
    });
  });
});
