import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import ProgressBar from "./ProgressBar";

describe("ProgressBar", () => {
  it("sets the inner bar width to the given percentage", () => {
    const { container } = renderWithProviders(<ProgressBar progress={75} />);

    const innerBar = container.querySelector("[style]");
    expect(innerBar).toHaveStyle({ width: "75%" });

    expect(screen.getByText("75%")).toBeInTheDocument();
  });
});
