import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProgressBar from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders the progress percentage", () => {
    render(<ProgressBar progress={50} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("renders the ETA label", () => {
    render(<ProgressBar progress={50} secondsRemaining={120} />);
    expect(screen.getByText("2m")).toBeInTheDocument();
  });

  it("renders a progress bar with correct aria attributes", () => {
    render(<ProgressBar progress={75} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "75");
  });

  it("clamps progress to 0-100", () => {
    render(<ProgressBar progress={150} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("rounds progress to nearest integer", () => {
    render(<ProgressBar progress={33.7} />);
    expect(screen.getByText("34%")).toBeInTheDocument();
  });

  it("renders a loading icon when loading is true", () => {
    const { container } = render(<ProgressBar progress={50} loading />);

    expect(container.querySelector(".p-icon--spinner")).toBeInTheDocument();
  });

  it("fills the entire width when fullWidth is true", () => {
    render(<ProgressBar progress={50} fullWidth />);

    expect(screen.getByRole("progressbar")).toHaveStyle("max-width: none");
  });
});
