import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import InteractiveTooltip from "./InteractiveTooltip";

const LABEL = "More information";
const LINK_TEXT = "Read the documentation";

const renderTooltip = () =>
  render(
    <>
      <InteractiveTooltip
        label={LABEL}
        message={
          <>
            Some information
            <br />
            <a href="https://example.com">{LINK_TEXT}</a>
          </>
        }
      >
        <span>i</span>
      </InteractiveTooltip>
      <button type="button">Next focusable element</button>
    </>,
  );

describe("InteractiveTooltip", () => {
  it("renders a closed tooltip with a labelled trigger", () => {
    renderTooltip();

    const trigger = screen.getByRole("button", { name: LABEL });
    expect(trigger).toHaveTextContent("i");
    expect(trigger).not.toHaveAttribute("aria-describedby");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens on focus and describes the trigger with the message", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();

    const trigger = screen.getByRole("button", { name: LABEL });
    const tooltip = screen.getByRole("tooltip");
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
    expect(tooltip).toHaveTextContent("Some information");
  });

  it("stays open while focus moves into the message and closes when it leaves", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();
    await user.tab();

    expect(screen.getByRole("link", { name: LINK_TEXT })).toHaveFocus();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.tab();

    expect(
      screen.getByRole("button", { name: "Next focusable element" }),
    ).toHaveFocus();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens on hover and closes on mouse leave", async () => {
    const user = userEvent.setup();
    renderTooltip();

    const trigger = screen.getByRole("button", { name: LABEL });

    await user.hover(trigger);

    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.unhover(trigger);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("stays open on mouse leave while the message has focus", async () => {
    const user = userEvent.setup();
    renderTooltip();

    const trigger = screen.getByRole("button", { name: LABEL });

    await user.hover(trigger);
    await user.tab();
    await user.tab();

    expect(screen.getByRole("link", { name: LINK_TEXT })).toHaveFocus();

    await user.unhover(trigger);

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();
    await user.tab();

    expect(screen.getByRole("link", { name: LINK_TEXT })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: LABEL })).toHaveFocus();
  });
});
