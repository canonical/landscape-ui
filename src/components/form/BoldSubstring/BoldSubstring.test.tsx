import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import BoldSubstring from "./BoldSubstring";

describe("BoldSubstring", () => {
  it("should render text with substring", () => {
    renderWithProviders(<BoldSubstring text="Hello world" substring="world" />);

    expect(screen.getByText("Hello")).toBeInTheDocument();

    const strongText = screen.getByText("world");
    expect(strongText).toBeInTheDocument();
    expect(strongText).toHaveRole("strong");
  });

  it("should render text without substring", () => {
    renderWithProviders(<BoldSubstring text="Hello world" substring="Hi" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.queryByText("Hi")).not.toBeInTheDocument();
    expect(screen.queryByRole("strong")).not.toBeInTheDocument();
  });

  it("should render text without empty substring", () => {
    renderWithProviders(<BoldSubstring text="Hello world" substring="" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.queryByRole("strong")).not.toBeInTheDocument();
  });
});
