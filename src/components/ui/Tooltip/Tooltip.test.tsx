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
});
