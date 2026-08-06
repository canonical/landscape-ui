import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import MirrorFilterHelpButton from "./MirrorFilterHelpButton";
import { PACKAGE_FILTER_HELP_DATA } from "./constants";

describe("MirrorFilterHelpButton", () => {
  const user = userEvent.setup();

  it("opens the modal only when the help button is clicked", async () => {
    renderWithProviders(<MirrorFilterHelpButton />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Help" }));

    const dialog = screen.getByRole("dialog", {
      name: "Package query syntax",
    });
    expect(dialog).toBeInTheDocument();
  });

  it("renders the syntax table with column headers and all terms", async () => {
    renderWithProviders(<MirrorFilterHelpButton />);

    await user.click(screen.getByRole("button", { name: "Help" }));

    const table = screen.getByRole("table");
    expect(
      within(table).getByRole("columnheader", { name: "Term" }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole("columnheader", { name: "Description" }),
    ).toBeInTheDocument();

    // Header row plus one row per help entry.
    expect(within(table).getAllByRole("row")).toHaveLength(
      PACKAGE_FILTER_HELP_DATA.length + 1,
    );
  });

  it("closes the modal when the close button is clicked", async () => {
    renderWithProviders(<MirrorFilterHelpButton />);

    await user.click(screen.getByRole("button", { name: "Help" }));

    await user.click(
      screen.getByRole("button", { name: /close active modal/i }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
