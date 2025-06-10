import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import ResponsiveButtons from "./ResponsiveButtons";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { Button, Icon } from "@canonical/react-components";

const simpleButtonClick = vi.fn();
const buttonWithIconClick = vi.fn();
const disabledButtonClick = vi.fn();

const buttons: ComponentProps<typeof ResponsiveButtons>["buttons"] = [
  <button key="primary" onClick={simpleButtonClick}>
    Simple button
  </button>,
  <Button
    key="button-with-icon"
    type="button"
    hasIcon
    onClick={buttonWithIconClick}
  >
    <Icon name="code" />
    <span>Button with icon</span>
  </Button>,
  <Button
    key="disabled-button"
    type="button"
    hasIcon
    onClick={disabledButtonClick}
    disabled
  >
    Disabled button
  </Button>,
];

describe("ResponsiveButtons", () => {
  beforeEach(() => {
    resetScreenSize();
  });

  it("renders every button on large screens", () => {
    setScreenSize("lg");

    render(<ResponsiveButtons buttons={buttons} collapseFrom="md" />);

    expect(
      screen.getByRole("button", { name: "Simple button" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Button with icon" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Disabled button" }),
    ).toBeInTheDocument();
  });

  it("keeps the first button visible and collapses the rest on small screens", async () => {
    setScreenSize("xs");

    render(
      <ResponsiveButtons
        buttons={buttons}
        alwaysVisible={1}
        menuLabel="Actions"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Simple button" }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Button with icon" }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Disabled button" }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));

    expect(
      screen.queryByRole("button", { name: "Button with icon" }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Disabled button" }),
    ).toBeInTheDocument();
  });

  it("fires onClick for a collapsed menu item", async () => {
    setScreenSize("xs");

    render(<ResponsiveButtons buttons={buttons} />);

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));
    await userEvent.click(
      screen.getByRole("button", { name: "Simple button" }),
    );

    expect(simpleButtonClick).toHaveBeenCalledTimes(1);
  });

  it("disabled button for a collapsed menu item", async () => {
    setScreenSize("xs");

    render(<ResponsiveButtons buttons={buttons} />);

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));

    expect(
      screen.getByRole("button", { name: "Disabled button" }),
    ).toHaveAttribute("aria-disabled");
  });
});
