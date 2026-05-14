import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import InfoBox from "./InfoBox";

describe("InfoBox", () => {
  it("renders overflow amount when collapsed and there are overflowing chips", () => {
    render(<InfoBox isExpanded={false} overflowingChipsAmount={3} />);

    expect(screen.getByText("+3")).toBeInTheDocument();
  });

  it("does not render when expanded", () => {
    render(<InfoBox isExpanded overflowingChipsAmount={3} />);

    expect(screen.queryByText("+3")).not.toBeInTheDocument();
  });

  it("does not render when there are no overflowing chips", () => {
    render(<InfoBox isExpanded={false} overflowingChipsAmount={0} />);

    expect(screen.queryByText("+0")).not.toBeInTheDocument();
  });
});
