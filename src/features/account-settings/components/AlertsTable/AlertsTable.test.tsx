import { alerts } from "@/tests/mocks/alerts";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMediaQuery } from "usehooks-ts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AlertsTable from "./AlertsTable";

const mockAvailableTagOptions = [
  { value: "All", label: "All instances" },
  { value: "tag1", label: "Tag 1", group: "Tags" },
  { value: "tag2", label: "Tag 2", group: "Tags" },
];

vi.mock("usehooks-ts", () => ({
  useMediaQuery: vi.fn(),
}));

describe("AlertsTable", () => {
  beforeEach(() => {
    vi.mocked(useMediaQuery).mockReset();
  });

  it("renders the table in desktop view", () => {
    vi.mocked(useMediaQuery).mockReturnValue(true);

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
    vi.mocked(useMediaQuery).mockReturnValue(false);

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

  it("handles switch change correctly", async () => {
    vi.mocked(useMediaQuery).mockReturnValue(true);

    renderWithProviders(
      <AlertsTable
        alerts={alerts}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    const enabledSwitches = screen.getAllByRole("switch", {
      name: /yes/i,
    });
    const disabledSwitches = screen.getAllByRole("switch", {
      name: /no/i,
    });

    const enabledSwitch = enabledSwitches[0];
    const disabledSwitch = disabledSwitches[0];

    expect(enabledSwitch).toBeChecked();
    expect(disabledSwitch).not.toBeChecked();

    await userEvent.click(disabledSwitch);
    expect(disabledSwitch).toBeChecked();

    await userEvent.click(enabledSwitch);
    expect(enabledSwitch).not.toBeChecked();
  });

  it('displays "No data available" when there are no alerts', () => {
    vi.mocked(useMediaQuery).mockReturnValue(true);

    renderWithProviders(
      <AlertsTable alerts={[]} availableTagOptions={mockAvailableTagOptions} />,
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});
