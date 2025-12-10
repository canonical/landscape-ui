import type { Status } from "@/features/instances";
import { ALERT_STATUSES } from "@/features/instances";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectErrorNotification, expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
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

    await expectLoadingState();
    await expectErrorNotification();
  });
});
