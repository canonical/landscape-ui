import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CronExamplePart from "./CronExamplePart";

describe("CronExamplePart", () => {
  it("renders the value and label", () => {
    render(<CronExamplePart label="Minute" value="5" />);

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Minute")).toBeInTheDocument();
  });
});
