import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import OverviewPage from "./OverviewPage";

vi.mock("@/features/overview", async () => {
  const actual = await vi.importActual("@/features/overview");

  return {
    ...actual,
    ChartContainer: () => <div>Chart container</div>,
  };
});

describe("OverviewPage", () => {
  it("renders overview heading and key dashboard sections", async () => {
    renderWithProviders(<OverviewPage />);

    expect(
      screen.getByRole("heading", { name: "Overview" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Chart container")).toBeInTheDocument();
    expect(screen.getByText("Requires approval")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
  });
});
