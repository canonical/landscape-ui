import { describe } from "vitest";
import EmptyAlertCount from "./EmptyAlertCount";
import { render, screen } from "@testing-library/react";

describe("EmptyAlertCount", () => {
  it("should render correctly", () => {
    render(<EmptyAlertCount />);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("instances")).toBeInTheDocument();
  });
});
