import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import BoldSubstring from "./BoldSubstring";

describe("BoldSubstring", () => {
  it("should render text with substring", () => {
    renderWithProviders(<BoldSubstring text="Hello world" substring="world" />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("world")).toBeInTheDocument();
  });

  it("should render text without substring", () => {
    renderWithProviders(<BoldSubstring text="Hello world" substring="Hi" />);

    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.queryByText("Hi")).not.toBeInTheDocument();
  });
});
