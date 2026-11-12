import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Tooltip from "./Tooltip";

describe("Tooltip", () => {
  it("associates the target with the portalled Pragma tooltip and reveals it on hover", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip message="More information">
        <button type="button">Details</button>
      </Tooltip>,
    );

    const button = screen.getByRole("button", { name: "Details" });
    expect(button.parentElement).toHaveAttribute("aria-describedby");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await user.hover(button);

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("More information");
    expect(button.parentElement).toHaveAttribute(
      "aria-describedby",
      tooltip.id,
    );
  });

  it("reveals the tooltip on keyboard focus and closes on Escape", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip message="Keyboard help">
        <button type="button">Details</button>
      </Tooltip>,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "Details" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Keyboard help",
    );

    await user.keyboard("{Escape}");
    await vi.waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("positions and reveals the tooltip when custom preferredDirections are provided", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        message="Bottom help"
        preferredDirections={["block-end", "block-start"]}
      >
        <button type="button">Bottom target</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Bottom target" }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Bottom help");
  });

  it("updates a runtime message without unmounting the target element", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <Tooltip message="First message">
        <button type="button">Details</button>
      </Tooltip>,
    );

    const initialButton = screen.getByRole("button", { name: "Details" });
    await user.tab();
    expect(initialButton).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "First message",
    );

    rerender(
      <Tooltip message="Second message">
        <button type="button">Details</button>
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Details" })).toBe(initialButton);
    expect(initialButton).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Second message",
    );
    expect(screen.queryByText("First message")).not.toBeInTheDocument();
  });

  it.each([undefined, null, false, ""])(
    "renders children without mounting a tooltip when message is %s",
    (emptyMessage) => {
      render(
        <Tooltip
          message={emptyMessage}
          className="outer-wrapper"
          targetElementClassName="inner-target"
        >
          <button type="button">Plain action</button>
        </Tooltip>,
      );

      const button = screen.getByRole("button", { name: "Plain action" });
      expect(button.parentElement).toHaveClass("inner-target");
      expect(button.parentElement).not.toHaveAttribute("aria-describedby");
      expect(
        screen.queryByRole("tooltip", { hidden: true }),
      ).not.toBeInTheDocument();
    },
  );
});
