import { render, screen } from "@testing-library/react";
import ReportWidget from "./ReportWidget";
import { describe, expect, it } from "vitest";

describe("ReportWidget", () => {
  const defaultProps = {
    currentCount: 50,
    negativeDescription: "Negative description",
    positiveDescription: "Positive description",
    title: "Test Title",
    totalCount: 100,
  };

  it("renders the title", () => {
    render(<ReportWidget {...defaultProps} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders the positive description", () => {
    render(<ReportWidget {...defaultProps} />);
    expect(screen.getByText("Positive description")).toBeInTheDocument();
  });

  it("renders the negative description", () => {
    render(<ReportWidget {...defaultProps} />);
    expect(screen.getByText("Negative description")).toBeInTheDocument();
  });

  it("calculates and displays the correct percentage", () => {
    render(<ReportWidget {...defaultProps} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });
});
