import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Item from "./Item";

describe("Blocks/Item", () => {
  it("renders children", () => {
    renderWithProviders(<Item>Block content</Item>);
    expect(screen.getByText("Block content")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    renderWithProviders(<Item title="Section Title">content</Item>);
    expect(screen.getByText("Section Title")).toBeInTheDocument();
  });

  it("does not render title when not provided", () => {
    renderWithProviders(<Item>content</Item>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders description when provided", () => {
    renderWithProviders(
      <Item title="Section Title" description="Loading helper text">
        content
      </Item>,
    );
    expect(screen.getByText("Loading helper text")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    renderWithProviders(<Item title="Section Title">content</Item>);
    expect(screen.queryByText("Loading helper text")).not.toBeInTheDocument();
  });
});
