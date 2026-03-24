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
});
