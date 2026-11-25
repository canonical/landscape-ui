import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AddPublicationButton from "./AddPublicationButton";

describe("AddPublicationButton", () => {
  it("renders add publication button", () => {
    renderWithProviders(<AddPublicationButton />);

    const button = screen.getByRole("button", { name: "Add publication" });
    expect(button).toHaveClass("ds", "button", "primary", "constructive");
    expect(button).toHaveIcon("plus");
  });
});
