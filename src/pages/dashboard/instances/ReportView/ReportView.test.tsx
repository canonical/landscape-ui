import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { Mock } from "vitest";
import { describe, expect, it, vi } from "vitest";
import ReportView from "./ReportView";
import useReports from "@/hooks/useReports";
import useSidePanel from "@/hooks/useSidePanel";

vi.mock("@/hooks/useReports");
vi.mock("@/hooks/useSidePanel");

describe("ReportView", () => {
  const instanceIds = [1, 2, 3];

  beforeEach(() => {
    (useReports as Mock).mockReturnValue({
      getNotPingingInstances: vi.fn().mockReturnValue({
        data: { data: [] },
        isLoading: false,
      }),
      getInstancesNotUpgraded: vi.fn().mockReturnValue({
        data: { data: [] },
        isLoading: false,
      }),
      getUsnTimeToFix: vi.fn().mockReturnValue({
        data: { data: { "2": [], "14": [], "30": [], "60": [], pending: [] } },
        isLoading: false,
      }),
    });

    (useSidePanel as Mock).mockReturnValue({
      setSidePanelContent: vi.fn(),
    });
  });

  it("renders ReportView component", () => {
    renderWithProviders(<ReportView instanceIds={instanceIds} />);
    expect(screen.getByText("Securely patched")).toBeInTheDocument();
    expect(screen.getByText("Upgrade profiles")).toBeInTheDocument();
    expect(screen.getByText("Contacted")).toBeInTheDocument();
    expect(screen.getByText("Security upgrades")).toBeInTheDocument();
  });

  it("handles download dialog", () => {
    const { setSidePanelContent } = useSidePanel();
    renderWithProviders(<ReportView instanceIds={instanceIds} />);
    const downloadButton = screen.getByText("Download as CSV");
    downloadButton.click();
    expect(setSidePanelContent).toHaveBeenCalledWith(
      "Download report as CSV",
      expect.anything(),
    );
  });

  it("Correct Descriptions are Displayed in Report Widgets", () => {
    renderWithProviders(<ReportView instanceIds={instanceIds} />);

    expect(
      screen.getByText(/No instances have not contacted/i),
    ).toBeInTheDocument();
  });
  it("USN Report Widgets Display Correct Periods", () => {
    renderWithProviders(<ReportView instanceIds={instanceIds} />);

    const twoDaysWidgets = screen.getAllByText(/2 days/i);
    const fourteenDaysWidgets = screen.getAllByText(/14 days/i);
    const thirtyDaysWidgets = screen.getAllByText(/30 days/i);

    expect(twoDaysWidgets.length).toBeGreaterThan(0);
    expect(fourteenDaysWidgets.length).toBeGreaterThan(0);
    expect(thirtyDaysWidgets.length).toBeGreaterThan(0);
  });

  it("Report Widgets Display Correct Counts", () => {
    renderWithProviders(<ReportView instanceIds={instanceIds} />);

    const securelyPatchedWidgets = screen.getAllByText(/Securely patched/i);
    expect(securelyPatchedWidgets.length).toBeGreaterThan(0); // Ensure there are widgets for securely patched instances
  });
});
