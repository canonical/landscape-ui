import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReportForm from "./ReportForm";
import useReports from "@/hooks/useReports";
import userEvent from "@testing-library/user-event";

// Mock hooks
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

    // Initially checked
    expect(checkbox).toBeChecked();

    // Uncheck the checkbox
    await user.click(checkbox);

    // Assert that it is now unchecked
    expect(checkbox).not.toBeChecked();

    // Check it again
    await user.click(checkbox);

    // Assert that it is checked again
    expect(checkbox).toBeChecked();
  });
});
