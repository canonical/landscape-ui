import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { alerts } from "@/tests/mocks/alerts";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AlertsTable from "./AlertsTable";

const mockAvailableTagOptions = [
  { value: "All", label: "All instances" },
  { value: "tag1", label: "Tag 1", group: "Tags" },
  { value: "tag2", label: "Tag 2", group: "Tags" },
];

describe("AlertsTable", () => {
  afterEach(() => {
    resetScreenSize();
  });

  it("renders the table in desktop view", () => {
    setScreenSize("lg");

    renderWithProviders(
      <AlertsTable
        alerts={alerts}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    const table = screen.getByRole("table");

    expect(table).toHaveTexts(["Name", "Email", "Enabled for", "Description"]);

    alerts.forEach((alert) => {
      expect(screen.getByText(alert.label)).toBeInTheDocument();
      expect(screen.getByText(alert.description)).toBeInTheDocument();
    });
  });

  it("renders the mobile view when screen is small", () => {
    setScreenSize("xs");

    renderWithProviders(
      <AlertsTable
        alerts={alerts}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    const table = screen.queryByRole("table");
    expect(table).toBeNull();

    alerts.forEach((alert) => {
      expect(screen.getByText(alert.label)).toBeInTheDocument();
      expect(screen.getByText(alert.description)).toBeInTheDocument();
    });
  });

  it("handles alert subscription action", async () => {
    setScreenSize("lg");

    renderWithProviders(
      <AlertsTable
        alerts={alerts}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    const disabledSwitches = screen.getAllByRole("switch", {
      name: /no/i,
    });

    const [disabledSwitch] = disabledSwitches;
    assert(disabledSwitch);

    expect(disabledSwitch).not.toBeChecked();

    await userEvent.click(disabledSwitch);
    expect(disabledSwitch).toBeChecked();
  });

  it("handles alert unsubscribe action", async () => {
    setScreenSize("lg");

    renderWithProviders(
      <AlertsTable
        alerts={alerts}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    const enabledSwitches = screen.getAllByRole("switch", {
      name: /yes/i,
    });

    const [enabledSwitch] = enabledSwitches;
    assert(enabledSwitch);

    expect(enabledSwitch).toBeChecked();

    await userEvent.click(enabledSwitch);
    expect(enabledSwitch).not.toBeChecked();
  });

  it('displays "No data available" when there are no alerts', () => {
    setScreenSize("lg");

    renderWithProviders(
      <AlertsTable alerts={[]} availableTagOptions={mockAvailableTagOptions} />,
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});
