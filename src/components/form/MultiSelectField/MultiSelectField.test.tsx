import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import MultiSelectField from "./MultiSelectField";

const items = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
];

describe("MultiSelectField", () => {
  it("renders the label", () => {
    renderWithProviders(
      <MultiSelectField
        label="My field"
        items={items}
        onItemsUpdate={vi.fn()}
      />,
    );

    expect(screen.getByText("My field")).toBeInTheDocument();
  });

  it("adds is-required class to label when required", () => {
    renderWithProviders(
      <MultiSelectField
        label="Required field"
        required
        items={items}
        onItemsUpdate={vi.fn()}
      />,
    );

    expect(screen.getByText("Required field")).toHaveClass("is-required");
  });

  it("does not add is-required class when not required", () => {
    renderWithProviders(
      <MultiSelectField
        label="Optional field"
        items={items}
        onItemsUpdate={vi.fn()}
      />,
    );

    expect(screen.getByText("Optional field")).not.toHaveClass("is-required");
  });

  it("renders help text", () => {
    renderWithProviders(
      <MultiSelectField
        label="Field"
        help="Some helpful text"
        items={items}
        onItemsUpdate={vi.fn()}
      />,
    );

    expect(screen.getByText("Some helpful text")).toBeInTheDocument();
  });

  it("renders error message", () => {
    renderWithProviders(
      <MultiSelectField
        label="Field"
        error="Something went wrong"
        items={items}
        onItemsUpdate={vi.fn()}
      />,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders a caution message with caution styling", () => {
    renderWithProviders(
      <MultiSelectField
        label="Field"
        caution="This field has a pending change"
        items={items}
        onItemsUpdate={vi.fn()}
      />,
    );

    expect(
      screen.getByText("This field has a pending change"),
    ).toBeInTheDocument();
    expect(
      screen
        .getByText("This field has a pending change")
        .closest(".is-caution"),
    ).toBeInTheDocument();
  });

  it("continues to render warning as caution", () => {
    renderWithProviders(
      <MultiSelectField
        label="Field"
        warning="This field has a warning"
        items={items}
        onItemsUpdate={vi.fn()}
      />,
    );

    expect(screen.getByText("This field has a warning")).toBeInTheDocument();
  });
});
