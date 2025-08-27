import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import AddSecurityProfileButton from "./AddSecurityProfileButton";

describe("AddSecurityProfileButton", () => {
  it("should open a form", async () => {
    renderWithProviders(<AddSecurityProfileButton />);

    await userEvent.click(
      screen.getByRole("button", { name: "Add security profile" }),
    );
  });
});
