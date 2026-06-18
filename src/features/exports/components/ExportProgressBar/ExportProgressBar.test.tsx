import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ExportProgressBar from "./ExportProgressBar";

describe("ExportProgressBar", () => {
  it("renders the progress percentage", () => {
    render(<ExportProgressBar progress={50} secondsRemaining={null} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("renders the ETA label", () => {
    render(<ExportProgressBar progress={50} secondsRemaining={120} />);
    expect(screen.getByText("2m left")).toBeInTheDocument();
  });

  it("renders a progress bar with correct aria attributes", () => {
    render(<ExportProgressBar progress={75} secondsRemaining={null} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "75");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps progress to 0-100", () => {
    render(<ExportProgressBar progress={150} secondsRemaining={null} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("rounds progress to nearest integer", () => {
    render(<ExportProgressBar progress={33.7} secondsRemaining={null} />);
    expect(screen.getByText("34%")).toBeInTheDocument();
  });
});
