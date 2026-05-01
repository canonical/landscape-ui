import { PageParamFilter } from "@/components/filter";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ResponsiveDropdownItem from "./ResponsiveDropdownItem";

describe("ResponsiveDropdownItem", () => {
  const user = userEvent.setup();

  it("renders an element", async () => {
    renderWithProviders(
      <ResponsiveDropdownItem
        el={
          <PageParamFilter
            pageParamKey="status"
            label="Status"
            options={[{ label: "Option 1", value: "option-1" }]}
          />
        }
      />,
    );

    await user.click(screen.getByRole("button", { name: "Status" }));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("calls onMenuClose when content area is clicked", async () => {
    const onMenuClose = vi.fn();

    renderWithProviders(
      <ResponsiveDropdownItem
        el={
          <PageParamFilter
            pageParamKey="status"
            label="Status"
            options={[{ label: "Option 1", value: "option-1" }]}
          />
        }
        onMenuClose={onMenuClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Status" }));
    await user.click(screen.getByText("Option 1"));

    expect(onMenuClose).toHaveBeenCalled();
  });

  it("does not call onMenuClose when it is not provided", async () => {
    renderWithProviders(
      <ResponsiveDropdownItem
        el={
          <PageParamFilter
            pageParamKey="status"
            label="Status"
            options={[{ label: "Option 1", value: "option-1" }]}
          />
        }
      />,
    );

    await user.click(screen.getByRole("button", { name: "Status" }));
    await expect(
      user.click(screen.getByText("Option 1")),
    ).resolves.not.toThrow();
  });

  it("renders with explicit label prop", async () => {
    renderWithProviders(
      <ResponsiveDropdownItem el={<div>content</div>} label="Custom Label" />,
    );

    expect(screen.getByText("Custom Label")).toBeInTheDocument();
  });

  it("renders disabled button when disabled prop is true", () => {
    renderWithProviders(
      <ResponsiveDropdownItem el={<div>content</div>} label="Label" disabled />,
    );

    expect(screen.getByRole("button")).toHaveAttribute("aria-disabled");
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
        <ResponsiveDropdownItem
          el={
            <PageParamFilter
              pageParamKey="status"
              label="Status"
              options={[{ label: "Option 1", value: "option-1" }]}
            />
          }
        />
        <button>outside</button>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Status" }));
    expect(screen.getByText("Option 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "outside" }));
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });
});
