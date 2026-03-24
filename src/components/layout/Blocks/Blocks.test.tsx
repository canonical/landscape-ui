import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Blocks from "./Blocks";

describe("Blocks", () => {
  it("renders children", () => {
    renderWithProviders(<Blocks>Block children</Blocks>);
    expect(screen.getByText("Block children")).toBeInTheDocument();
  });

  it("renders Blocks.Item as a sub-component", () => {
    renderWithProviders(
      <Blocks>
        <Blocks.Item title="My Section">Item content</Blocks.Item>
      </Blocks>,
    );
    expect(screen.getByText("My Section")).toBeInTheDocument();
    expect(screen.getByText("Item content")).toBeInTheDocument();
  });
});
