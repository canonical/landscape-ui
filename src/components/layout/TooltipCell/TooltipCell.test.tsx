import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assert, describe, expect, it } from "vitest";
import TooltipCell from "./TooltipCell";

describe("TooltipCell", () => {
  it("renders truncated cell content and shows the full message on hover", async () => {
    const user = userEvent.setup();

    render(
      <TooltipCell message="deb https://archive.ubuntu.com/ubuntu noble main">
        deb https://archive.ubuntu.com/ubuntu noble main
      </TooltipCell>,
    );

    const cellButtonTarget = screen
      .getAllByText("deb https://archive.ubuntu.com/ubuntu noble main")
      .find((el) => el.closest("[aria-describedby]"));
    assert(cellButtonTarget);

    await user.hover(cellButtonTarget);

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "deb https://archive.ubuntu.com/ubuntu noble main",
    );
  });

  it("omits the tooltip popup when message is empty", () => {
    render(<TooltipCell message="">—</TooltipCell>);

    expect(screen.getByText("—")).toBeInTheDocument();
    expect(
      screen.queryByRole("tooltip", { hidden: true }),
    ).not.toBeInTheDocument();
  });
});
