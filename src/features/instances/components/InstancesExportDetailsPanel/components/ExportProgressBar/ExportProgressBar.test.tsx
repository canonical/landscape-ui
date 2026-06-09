import { render, screen } from "@testing-library/react";
import ExportProgressBar, { formatSecondsRemaining } from "./ExportProgressBar";

describe("ExportProgressBar", () => {
  it("renders the percentage inside the bar and reflects it on the progressbar role", () => {
    render(<ExportProgressBar progress={35} secondsRemaining={120} />);

    expect(screen.getByText("35%")).toBeInTheDocument();
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "35");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps out-of-range progress values", () => {
    const { rerender } = render(
      <ExportProgressBar progress={-10} secondsRemaining={null} />,
    );
    expect(screen.getByText("0%")).toBeInTheDocument();

    rerender(<ExportProgressBar progress={150} secondsRemaining={null} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("shows 'Estimating...' when there is no estimate yet", () => {
    render(<ExportProgressBar progress={0} secondsRemaining={null} />);
    expect(screen.getByText("Estimating...")).toBeInTheDocument();
  });

  it("shows 'Almost done' for very small estimates", () => {
    render(<ExportProgressBar progress={98} secondsRemaining={3} />);
    expect(screen.getByText("Almost done")).toBeInTheDocument();
  });

  it("formats the remaining time to the right of the bar", () => {
    render(<ExportProgressBar progress={50} secondsRemaining={150} />);
    expect(screen.getByText("2m 30s left")).toBeInTheDocument();
  });
});

const FORTY_FIVE_SECONDS = 45;
const TWO_MINUTES = 120;
const TWO_AND_A_HALF_MINUTES = 150;
const NEGATIVE_DURATION = -30;

describe("formatSecondsRemaining", () => {
  it("formats sub-minute durations in seconds", () => {
    expect(formatSecondsRemaining(0)).toBe("0s left");
    expect(formatSecondsRemaining(FORTY_FIVE_SECONDS)).toBe("45s left");
  });

  it("formats whole minutes without trailing seconds", () => {
    expect(formatSecondsRemaining(TWO_MINUTES)).toBe("2m left");
  });

  it("formats minutes with remaining seconds", () => {
    expect(formatSecondsRemaining(TWO_AND_A_HALF_MINUTES)).toBe("2m 30s left");
  });

  it("never returns a negative duration", () => {
    expect(formatSecondsRemaining(NEGATIVE_DURATION)).toBe("0s left");
  });
});
