import type { Status } from "@/features/instances";
import { ALERT_STATUSES } from "@/features/instances";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectErrorNotification } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import { ROUTES } from "@/libs/routes";
import AlertCard from "./AlertCard";

const alert =
  Object.values(ALERT_STATUSES).find((status) => status.alternateLabel) ??
  ALERT_STATUSES["Unknown"];

const props = {
  alertType: alert.alertType,
  label: alert.label,
  filterValue: alert.filterValue,
  icon: alert.icon,
  query: alert.query,
  alternateLabel: alert.alternateLabel ?? alert.label,
} satisfies Status;

describe("AlertCard", () => {
  it("renders AlertCard", async () => {
    renderWithProviders(<AlertCard {...props} />);
    const alertLabel = screen.getByText(props.alternateLabel);
    expect(alertLabel).toBeInTheDocument();
  });

  it("AlertCard error", async () => {
    setEndpointStatus("error");
    renderWithProviders(<AlertCard {...props} />);

    const alertLabel = screen.getByText(props.alternateLabel);
    expect(alertLabel).toBeInTheDocument();

    const errorText = await screen.findByText("Error loading data.");
    expect(errorText).toBeInTheDocument();
    await expectErrorNotification();
  });

  it("uses label fallback and icon fallback when alternateLabel and gray icon are missing", () => {
    const fallbackAlert = ALERT_STATUSES.PackageUpgradesAlert;

    renderWithProviders(
      <AlertCard
        alertType={fallbackAlert.alertType}
        alternateLabel={undefined}
        filterValue={fallbackAlert.filterValue}
        icon={fallbackAlert.icon}
        label={fallbackAlert.label}
        query={fallbackAlert.query}
      />,
    );

    expect(screen.getByText(fallbackAlert.label)).toBeInTheDocument();
  });

  it("renders a link to instances route for non-pending alerts", async () => {
    renderWithProviders(<AlertCard {...props} />);

    const link = await screen.findByRole("link", { name: /instance/i });
    expect(link).toHaveAttribute(
      "href",
      ROUTES.instances.root({ status: props.filterValue }),
    );
  });

  it("opens pending instances review in side panel", async () => {
    const user = userEvent.setup();
    const pendingAlert = ALERT_STATUSES.PendingComputersAlert;

    renderWithProviders(<AlertCard {...pendingAlert} />);

    const reviewButton = await screen.findByRole("button", {
      name: /instance/i,
    });
    await user.click(reviewButton);

    expect(
      await screen.findByRole("heading", { name: "Review Pending Instances" }),
    ).toBeInTheDocument();
  });

  it("renders zero-count state for pending alerts with no pending instances", async () => {
    setEndpointStatus({ status: "empty", path: "GetPendingComputers" });
    const pendingAlert = ALERT_STATUSES.PendingComputersAlert;

    renderWithProviders(<AlertCard {...pendingAlert} />);

    expect(await screen.findByText("0")).toBeInTheDocument();
    expect(screen.getByText("instances")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /instance/i }),
    ).not.toBeInTheDocument();
  });
});
