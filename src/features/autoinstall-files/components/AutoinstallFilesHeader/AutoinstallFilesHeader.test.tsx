import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import AutoinstallFilesHeader from "./AutoinstallFilesHeader";
import { ADD_BUTTON_TEXT } from "./constants";

describe("AutoinstallFilesHeader", () => {
  it("should have a search box", async () => {
    renderWithProviders(<AutoinstallFilesHeader />);
    await userEvent.type(screen.getByRole("searchbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: "Search" }));
  });

  it("should show a side panel to add a file", async () => {
    renderWithProviders(<AutoinstallFilesHeader />);

    await userEvent.click(
      screen.getByRole("button", { name: ADD_BUTTON_TEXT }),
    );
  });
});
