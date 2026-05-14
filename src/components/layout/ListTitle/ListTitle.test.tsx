import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ListTitle from "./ListTitle";

describe("ListTitle", () => {
  it("renders children", () => {
    renderWithProviders(<ListTitle>My title content</ListTitle>);
    expect(screen.getByText("My title content")).toBeInTheDocument();
  });
});
