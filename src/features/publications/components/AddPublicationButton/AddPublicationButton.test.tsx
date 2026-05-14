import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AddPublicationButton from "./AddPublicationButton";

describe("AddPublicationButton", () => {
  it("renders add publication button", () => {
    renderWithProviders(<AddPublicationButton />);

    expect(
      screen.getByRole("button", { name: "Add publication" }),
    ).toBeInTheDocument();
  });
});
