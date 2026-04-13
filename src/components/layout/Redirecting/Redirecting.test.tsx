import { render, screen } from "@testing-library/react";
import Redirecting from "./Redirecting";

describe("Redirecting", () => {
  it("should render component correctly", () => {
    render(<Redirecting />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeOffScreen();
    expect(screen.getByText("Redirecting...")).not.toBeOffScreen();
  });
});
