import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReportForm from "./ReportForm";
import useReports from "@/hooks/useReports";
import userEvent from "@testing-library/user-event";

vi.mock("@/hooks/useReports");

describe("ReportForm Component", () => {
  const mockInstanceIds = [1, 2, 3];

  beforeEach(() => {
    (useReports as jest.Mock).mockReturnValue({
      getCsvComplianceData: vi.fn(() => ({
        data: "mock_data",
      })),
    });
  });

  it("renders without errors", () => {
    renderWithProviders(<ReportForm instanceIds={mockInstanceIds} />);
    expect(screen.getByLabelText(/Report by CVE/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Range/i)).toBeInTheDocument();
  });

  it("checkbox functionality works correctly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReportForm instanceIds={mockInstanceIds} />);

    const checkbox = screen.getByLabelText(/Report by CVE/i);

    expect(checkbox).toBeChecked();

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });
});
