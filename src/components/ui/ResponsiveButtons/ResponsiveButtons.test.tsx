import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import ResponsiveButtons from "./ResponsiveButtons";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { Button, ContextualMenu, Icon } from "@canonical/react-components";

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

  it("renders collapsed buttons on all screens", async () => {
    setScreenSize("xxl");

    render(
      <ResponsiveButtons buttons={buttons} collapseFrom="md" alwaysCollapse />,
    );

    expect(
      screen.queryByRole("button", { name: "Simple button" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Button with icon" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Disabled button" }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));

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

  it("renders non-button nodes in visible list on large screens", () => {
    setScreenSize("lg");

    const nonButtonNode = <span key="text-node">Text content</span>;
    render(<ResponsiveButtons buttons={[nonButtonNode]} />);

    expect(screen.getByText("Text content")).toBeInTheDocument();
  });

  it("renders a single button without grouping", () => {
    setScreenSize("lg");

    render(
      <ResponsiveButtons
        buttons={[
          <Button key="single" type="button" onClick={vi.fn()}>
            Single
          </Button>,
        ]}
        grouped={false}
      />,
    );

    expect(screen.getByRole("button", { name: "Single" })).toBeInTheDocument();
  });

  it("renders a ContextualMenu that is collapsed on small screens", async () => {
    setScreenSize("xs");

    const menuClickFn = vi.fn();
    const contextualMenuButtons = [
      <ContextualMenu
        key="context-menu"
        toggleLabel="Filter"
        links={[{ children: "Option A", onClick: menuClickFn }]}
      />,
    ];

    render(
      <ResponsiveButtons
        buttons={contextualMenuButtons}
        alwaysVisible={0}
        menuLabel="Actions"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));

    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it("disables the Actions menu when all buttons are disabled", () => {
    setScreenSize("xs");

    render(
      <ResponsiveButtons
        buttons={[
          <Button key="a" type="button" onClick={vi.fn()} disabled>
            A
          </Button>,
        ]}
        alwaysVisible={0}
        menuLabel="Actions"
      />,
    );

    expect(screen.getByRole("button", { name: /actions/i })).toHaveAttribute(
      "aria-disabled",
    );
  });

  it("pushes non-button nodes to visible on small screens", () => {
    setScreenSize("xs");

    const nonButtonNode = <span key="text-node">Text content</span>;
    render(<ResponsiveButtons buttons={[nonButtonNode]} alwaysVisible={0} />);

    expect(screen.getByText("Text content")).toBeInTheDocument();
  });

  it("renders a ContextualMenu in grouped view on large screens", () => {
    setScreenSize("lg");

    render(
      <ResponsiveButtons
        buttons={[
          <ContextualMenu key="context-menu" toggleLabel="Filter" links={[]} />,
          <Button key="btn" type="button" onClick={vi.fn()}>
            Action
          </Button>,
        ]}
        grouped
      />,
    );

    expect(screen.getByText("Filter")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("skips string links inside a collapsed ContextualMenu", async () => {
    setScreenSize("xs");

    const menuClickFn = vi.fn();
    const contextualMenuButtons = [
      <ContextualMenu
        key="context-menu"
        toggleLabel="Filter"
        links={["string-link", { children: "Option A", onClick: menuClickFn }]}
      />,
    ];

    render(
      <ResponsiveButtons
        buttons={contextualMenuButtons}
        alwaysVisible={0}
        menuLabel="Actions"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));
    await userEvent.click(screen.getByRole("button", { name: "Filter" }));

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.queryByText("string-link")).not.toBeInTheDocument();
  });

  it("calls link onClick when clicking a link inside a collapsed ContextualMenu", async () => {
    setScreenSize("xs");

    const menuClickFn = vi.fn();
    const contextualMenuButtons = [
      <ContextualMenu
        key="context-menu"
        toggleLabel="Filter"
        links={[{ children: "Option A", onClick: menuClickFn }]}
      />,
    ];

    render(
      <ResponsiveButtons
        buttons={contextualMenuButtons}
        alwaysVisible={0}
        menuLabel="Actions"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));
    expect(screen.getByText("Filter")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Filter" }));
    await userEvent.click(screen.getByText("Option A"));

    expect(menuClickFn).toHaveBeenCalled();
  });
});
