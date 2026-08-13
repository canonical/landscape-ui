import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import NoScriptsEmptyState from "./NoScriptsEmptyState";

describe("NoScriptsEmptyState", () => {
  it("should show correct information for empty state", async () => {
    renderWithProviders(<NoScriptsEmptyState />);

    const emptyStateTitle = screen.getByText(
      /you need at least one script to add a profile/i,
    );
    const emptyStateBody = screen.getByText(
      /in order to create a script profile/i,
    );

    expect(emptyStateTitle).toBeInTheDocument();
    expect(emptyStateBody).toBeInTheDocument();
  });

  it("opens the add script side panel when the add script button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<NoScriptsEmptyState />);

    await user.click(screen.getByRole("button", { name: /add script/i }));

    expect(
      await screen.findByRole("heading", { name: "Add script" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Access group")).toBeInTheDocument();
  });
});
