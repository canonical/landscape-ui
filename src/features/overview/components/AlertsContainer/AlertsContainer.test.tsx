import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import AlertsContainer from "./AlertsContainer";
import { widgetAlerts } from "./constants";
import { expectErrorNotification } from "@/tests/helpers";

describe("AlertsContainer", () => {
  it("renders AlertsContainer", async () => {
    renderWithProviders(<AlertsContainer />);
    for (const widgetAlert of widgetAlerts) {
      const alertLabel = screen.getByText(
        widgetAlert.alternateLabel ?? widgetAlert.label,
      );
      expect(alertLabel).toBeInTheDocument();
    }
  });

  it("AlertsContainer error", async () => {
    setEndpointStatus("error");
    renderWithProviders(<AlertsContainer />);
    for (const widgetAlert of widgetAlerts) {
      const alertLabel = screen.getByText(
        widgetAlert.alternateLabel ?? widgetAlert.label,
      );
      expect(alertLabel).toBeInTheDocument();
    }
    await expectErrorNotification();
  });
});
