import { PageParamFilter } from "@/components/filter";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ResponsiveDropdownItem from "./ResponsiveDropdownItem";

const element = (
  <PageParamFilter
    pageParamKey="status"
    label="Status"
    options={[{ label: "Option 1", value: "option-1" }]}
  />
);

describe("ResponsiveDropdownItem", () => {
  const user = userEvent.setup();
  const onMenuClose = vi.fn();

  it("renders an element", async () => {
    renderWithProviders(<ResponsiveDropdownItem el={element} />);

    const button = await screen.findByRole("button", { name: "Status" });
    await user.click(button);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(button).toHaveIcon("chevron-right");
  });

  it("closes the menu when an element is clicked", async () => {
    renderWithProviders(
      <ResponsiveDropdownItem el={element} onMenuClose={onMenuClose} />,
    );

    await user.click(screen.getByRole("button", { name: "Status" }));
    await user.click(screen.getByText("Option 1"));

    expect(onMenuClose).toHaveBeenCalled();
  });

  it("does not call onMenuClose when it is not provided", async () => {
    renderWithProviders(<ResponsiveDropdownItem el={element} />);

    await user.click(screen.getByRole("button", { name: "Status" }));
    await expect(
      user.click(screen.getByText("Option 1")),
    ).resolves.not.toThrow();
  });

  it("renders without a label when neither label prop nor el.props.label is available", async () => {
    renderWithProviders(
      <ResponsiveDropdownItem el={<div>no label content</div>} />,
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    await user.click(button);
    expect(screen.getByText("no label content")).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async () => {
    renderWithProviders(
      <div>
        <ResponsiveDropdownItem el={element} />
        <button>outside</button>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Status" }));
    expect(screen.getByText("Option 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "outside" }));
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    expect(onMenuClose).toHaveBeenCalled();
  });

  it("renders a disabled element with given label and right position", async () => {
    renderWithProviders(
      <ResponsiveDropdownItem
        el={element}
        disabled
        label="Label"
        position="right"
      />,
    );

    const button = await screen.findByRole("button", { name: "Label" });
    expect(button).toHaveClass("is-disabled");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveIcon("chevron-left");
  });
});
