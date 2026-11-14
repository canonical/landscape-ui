import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import TooltipCell from "./TooltipCell";
import classes from "./TooltipCell.module.scss";

describe("TooltipCell", () => {
  it("renders the child content inside a truncated wrapper", () => {
    render(<TooltipCell message="Hover me">Visible label</TooltipCell>);

    expect(screen.getByText("Visible label")).toBeInTheDocument();
    expect(
      document.body.querySelector(`.${classes.truncated}`),
    ).toBeInTheDocument();
    expect(
      document.body.querySelector(`.${classes.tooltipWrapper}`),
    ).toHaveTextContent("Visible label");
  });

  it("merges custom position and tooltip classes with the default classes", async () => {
    render(
      <TooltipCell
        message="Hover me"
        positionElementClassName="custom-position"
        tooltipClassName="custom-tooltip"
      >
        Visible label
      </TooltipCell>,
    );

    const label = screen.getByText("Visible label");
    expect(label).toHaveClass(classes.tooltipWrapper, "custom-position");

    await userEvent.hover(label);

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Hover me");
    expect(screen.getByTestId("tooltip-portal")).toHaveClass(
      classes.tooltipMessage,
      "custom-tooltip",
    );
  });
});
