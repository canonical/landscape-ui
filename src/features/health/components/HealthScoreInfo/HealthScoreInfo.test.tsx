import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HealthScoreInfo from "./HealthScoreInfo";

describe("HealthScoreInfo", () => {
  it("explains the calculation and the bands when opened", async () => {
    render(<HealthScoreInfo />);

    await userEvent.click(
      screen.getByRole("button", {
        name: "How the health score is calculated",
      }),
    );

    expect(screen.getByText(/Every instance starts at 100/)).toBeVisible();
    expect(screen.getByText(/Needs attention: 26 to 60/)).toBeVisible();
  });
});
