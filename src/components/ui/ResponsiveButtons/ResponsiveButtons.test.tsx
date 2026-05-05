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
const menuAction = vi.fn();

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
  <ContextualMenu
    key="ctx-menu"
    toggleLabel="Menu"
    links={[
      {
        children: (
          <>
            <Icon name="plus" />
            <span>Sub action</span>
          </>
        ),
        onClick: menuAction,
      },
      "String link",
      {
        children: "Read only link",
      },
    ]}
  />,
  <span key="text-node">Non button</span>,
];

describe("ResponsiveButtons", () => {
  beforeEach(() => {
    resetScreenSize();
    vi.clearAllMocks();
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

  it("disables button for a collapsed menu item", async () => {
    setScreenSize("xs");

    render(<ResponsiveButtons buttons={buttons} />);

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));

    expect(
      screen.getByRole("button", { name: "Disabled button" }),
    ).toHaveAttribute("aria-disabled");
  });

  it("renders non-button nodes in visible list on large screens", () => {
    setScreenSize("lg");

    render(<ResponsiveButtons buttons={buttons} />);

    expect(screen.getByText("Non button")).toBeInTheDocument();
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

  it("pushes non-button nodes to visible on small screens", () => {
    setScreenSize("xs");

    render(<ResponsiveButtons buttons={buttons} alwaysVisible={0} />);

    expect(screen.getByText("Non button")).toBeInTheDocument();
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

    render(
      <ResponsiveButtons
        buttons={buttons}
        alwaysVisible={0}
        menuLabel="Actions"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));

    expect(screen.getByText("Sub action")).toBeInTheDocument();
    expect(screen.queryByText("String link")).not.toBeInTheDocument();
  });

  it("preserves icon children in collapsed menu items", async () => {
    setScreenSize("xs");

    render(<ResponsiveButtons buttons={buttons} />);

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));

    expect(
      screen.getByRole("button", {
        name: "Button with icon",
      }),
    ).toHaveIcon("code");

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByRole("button", { name: "Sub action" })).toHaveIcon(
      "plus",
    );
  });

  it("applies custom className to wrapper", () => {
    setScreenSize("lg");

    const { container } = render(
      <ResponsiveButtons
        buttons={buttons}
        collapseFrom="md"
        className="custom-class"
      />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("disables the menu toggle when all collapsed items are disabled", () => {
    setScreenSize("xs");

    const allDisabledButtons = [
      <Button key="d1" type="button" onClick={vi.fn()} disabled>
        Disabled 1
      </Button>,
      <Button key="d2" type="button" onClick={vi.fn()} disabled>
        Disabled 2
      </Button>,
    ];

    render(<ResponsiveButtons buttons={allDisabledButtons} />);

    expect(screen.getByRole("button", { name: /actions/i })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("collapses a ContextualMenu into dropdown on small screens", async () => {
    setScreenSize("xs");

    render(<ResponsiveButtons buttons={buttons} />);

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));

    expect(
      screen.getByRole("button", { name: "Read only link" }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Sub action" }));
    expect(menuAction).toHaveBeenCalledTimes(1);
  });

  it("closes the menu after clicking a collapsed item", async () => {
    setScreenSize("xs");

    render(<ResponsiveButtons buttons={buttons} />);

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));
    await userEvent.click(
      screen.getByRole("button", { name: "Simple button" }),
    );

    expect(simpleButtonClick).toHaveBeenCalledTimes(1);

    expect(
      screen.queryByRole("button", { name: "Simple button" }),
    ).not.toBeInTheDocument();
  });

  it("uses custom menuLabel", () => {
    setScreenSize("xs");

    render(<ResponsiveButtons buttons={buttons} menuLabel="Custom Menu" />);

    expect(
      screen.getByRole("button", { name: /custom menu/i }),
    ).toBeInTheDocument();
  });

  it("extracts text from nested children for collapsed button label", async () => {
    setScreenSize("xs");

    const nestedButtons = [
      <Button key="nested" type="button" onClick={vi.fn()}>
        <span>
          <span>Nested text</span>
        </span>
      </Button>,
    ];

    render(<ResponsiveButtons buttons={nestedButtons} />);

    await userEvent.click(screen.getByRole("button", { name: /actions/i }));

    expect(
      screen.getByRole("button", { name: "Nested text" }),
    ).toBeInTheDocument();
  });
});
