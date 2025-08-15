import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SecurityProfileAddSidePanel from "./SecurityProfileAddSidePanel";

describe("SecurityProfileAddForm", () => {
  it("should have a back button after the first page", async () => {
    renderWithProviders(
      <SecurityProfileAddSidePanel onSuccess={() => undefined} />,
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Title" }),
      "Name",
    );

    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();

    await userEvent.click(await screen.findByRole("button", { name: "Next" }));

    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();
  });
});
