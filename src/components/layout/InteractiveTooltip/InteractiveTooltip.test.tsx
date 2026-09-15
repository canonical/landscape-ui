import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, assert, describe, expect, it, vi } from "vitest";
import InteractiveTooltip from "./InteractiveTooltip";

const LABEL = "More information";
const MESSAGE_TEXT = "Some information";
const LINK_TEXT = "Read the documentation";

const renderTooltip = () =>
  render(
    <>
      <InteractiveTooltip
        label={LABEL}
        message={
          <>
            {MESSAGE_TEXT}
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

const getTrigger = () => screen.getByRole("button", { name: LABEL });

const getMessage = () => {
  const messageId = getTrigger().getAttribute("aria-controls");
  assert(messageId);

  return document.getElementById(messageId);
};

describe("InteractiveTooltip", () => {
  it("renders a closed tooltip with a labelled trigger", () => {
    renderTooltip();

    const trigger = getTrigger();
    expect(trigger).toHaveTextContent("i");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");
    expect(screen.queryByText(MESSAGE_TEXT)).not.toBeInTheDocument();
  });

  it("opens on focus and points the trigger at the message", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();

    const trigger = getTrigger();
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(getMessage()).toHaveTextContent(MESSAGE_TEXT);
  });

  it("stays open while focus moves into the message and closes when it leaves", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();
    await user.tab();

    expect(screen.getByRole("link", { name: LINK_TEXT })).toHaveFocus();
    expect(getTrigger()).toHaveAttribute("aria-expanded", "true");

    await user.tab();

    expect(
      screen.getByRole("button", { name: "Next focusable element" }),
    ).toHaveFocus();
    expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(MESSAGE_TEXT)).not.toBeInTheDocument();
  });

  it("opens on hover and closes on mouse leave", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.hover(getTrigger());

    expect(screen.getByText(MESSAGE_TEXT)).toBeInTheDocument();

    await user.unhover(getTrigger());

    expect(screen.queryByText(MESSAGE_TEXT)).not.toBeInTheDocument();
  });

  it("stays open on mouse leave while the message has focus", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.hover(getTrigger());
    await user.tab();
    await user.tab();

    expect(screen.getByRole("link", { name: LINK_TEXT })).toHaveFocus();

    await user.unhover(getTrigger());

    expect(screen.getByText(MESSAGE_TEXT)).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();
    await user.tab();

    expect(screen.getByRole("link", { name: LINK_TEXT })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByText(MESSAGE_TEXT)).not.toBeInTheDocument();
    expect(getTrigger()).toHaveFocus();
  });

  describe("Escape propagation", () => {
    const onDocumentEscape = vi.fn();
    const documentListener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDocumentEscape();
      }
    };

    afterEach(() => {
      document.removeEventListener("keydown", documentListener);
      onDocumentEscape.mockReset();
    });

    it("keeps Escape from reaching document listeners while open, but not while closed", async () => {
      const user = userEvent.setup();
      renderTooltip();
      document.addEventListener("keydown", documentListener);

      await user.tab();
      expect(getTrigger()).toHaveAttribute("aria-expanded", "true");

      await user.keyboard("{Escape}");

      expect(screen.queryByText(MESSAGE_TEXT)).not.toBeInTheDocument();
      expect(onDocumentEscape).not.toHaveBeenCalled();

      // The tooltip is closed now, so Escape belongs to the rest of the page.
      await user.keyboard("{Escape}");

      expect(onDocumentEscape).toHaveBeenCalledOnce();
    });
  });
});
