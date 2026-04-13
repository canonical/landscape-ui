import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AddPublicationButton from "./AddPublicationButton";

describe("AddPublicationButton", () => {
  const user = userEvent.setup();

  it("renders add publication button", () => {
    renderWithProviders(<AddPublicationButton />);

    expect(
      screen.getByRole("button", { name: "Add publication" }),
    ).toBeInTheDocument();
  });

  it("opens side panel on click", async () => {
    renderWithProviders(<AddPublicationButton />);

    await user.click(screen.getByRole("button", { name: "Add publication" }));

    expect(
      await screen.findByRole("heading", { name: "Add publication" }),
    ).toBeInTheDocument();
  });
});
