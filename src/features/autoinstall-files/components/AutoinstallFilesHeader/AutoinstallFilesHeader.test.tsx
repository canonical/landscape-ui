import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFilesHeader from ".";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("AutoinstallFilesHeader", () => {
  it("should have a search box", async () => {
    renderWithProviders(<AutoinstallFilesHeader />);
    await userEvent.type(screen.getByRole("searchbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: "Search" }));
  });

  it("should filter by employee group", async () => {
    renderWithProviders(<AutoinstallFilesHeader />);
    await userEvent.click(
      screen.getByRole("button", { name: "Employee group" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Test" }));
  });
});
