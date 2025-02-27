/* eslint-disable @typescript-eslint/no-unused-vars */
import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFilesHeader from ".";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ADD_BUTTON_TEXT, SUBMIT_BUTTON_TEXT } from "./constants";

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
    // TODO: merge after Ethan fixes
    // await userEvent.click(screen.getByRole("button", { name: "Test" }));
  });

  it("should show a side panel to add a file", async () => {
    renderWithProviders(<AutoinstallFilesHeader />);

    // TODO: merge after Ethan fixes
    // await userEvent.click(
    //   screen.getByRole("button", { name: ADD_BUTTON_TEXT }),
    // );

    // await userEvent.click(
    //   screen.getByRole("button", { name: SUBMIT_BUTTON_TEXT }),
    // );
  });
});
