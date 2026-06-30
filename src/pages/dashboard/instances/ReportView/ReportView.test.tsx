import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ReportView from "./ReportView";

describe("ReportView", () => {
  const instanceIds = [1, 2, 3];

  it("renders ReportView component", async () => {
    renderWithProviders(<ReportView instanceIds={instanceIds} />);

    expect(await screen.findByText("Securely patched")).toBeInTheDocument();
    expect(screen.getByText("Upgrade profiles")).toBeInTheDocument();
    expect(screen.getByText("Contacted")).toBeInTheDocument();
    expect(screen.getByText("Security upgrades")).toBeInTheDocument();
  });

  it("handles download dialog", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ReportView instanceIds={instanceIds} />);

    await user.click(await screen.findByText("Download as CSV"));

    expect(
      await screen.findByRole("heading", { name: "Download report as CSV" }),
    ).toBeInTheDocument();
  });

  it("displays the correct contacted description", async () => {
    renderWithProviders(<ReportView instanceIds={instanceIds} />);

    expect(
      await screen.findByText(/0 instances have not contacted/i),
    ).toBeInTheDocument();
  });

  it("displays the expected USN periods", async () => {
    renderWithProviders(<ReportView instanceIds={instanceIds} />);

    expect(await screen.findAllByText(/2 days/i)).not.toHaveLength(0);
    expect(screen.getAllByText(/14 days/i)).not.toHaveLength(0);
    expect(screen.getAllByText(/30 days/i)).not.toHaveLength(0);
  });

  it("displays securely patched widgets", async () => {
    renderWithProviders(<ReportView instanceIds={instanceIds} />);

    expect(await screen.findAllByText(/Securely patched/i)).not.toHaveLength(0);
  });
});
