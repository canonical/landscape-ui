import { render, screen } from "@testing-library/react";
import Redirecting from "./Redirecting";

describe("Redirecting", () => {
  it("should render component correctly", () => {
    render(<Redirecting />);

    expect(screen.getByRole("status")).toBeInTheDocument();

    const labelSpans = screen.getAllByText("Redirecting...");

    expect(labelSpans).toHaveLength(2);

    expect(labelSpans[0]).toBeOffScreen();
    expect(labelSpans[1]).not.toBeOffScreen();
  });
});
