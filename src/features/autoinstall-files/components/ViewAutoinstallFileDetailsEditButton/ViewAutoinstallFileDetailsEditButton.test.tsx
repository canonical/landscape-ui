import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import ViewAutoinstallFileDetailsEditButton from ".";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import {
  CANCEL_BUTTON_TEXT,
  CONTINUE_BUTTON_TEXT,
  EDIT_BUTTON_TEXT,
  LOCAL_STORAGE_ITEM,
  SUBMIT_BUTTON_TEXT,
} from "./constants";

describe("ViewAutoinstallFileDetailsEditButton", () => {
  it("should show a modal once", async () => {
    renderWithProviders(
      <ViewAutoinstallFileDetailsEditButton
        fileName={autoinstallFiles[0].name}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: EDIT_BUTTON_TEXT }),
    );

    await userEvent.click(screen.getByRole("checkbox"));

    await userEvent.click(
      screen.getByRole("button", { name: CONTINUE_BUTTON_TEXT }),
    );

    localStorage.clear();
  });

  it("should show a modal every time", async () => {
    renderWithProviders(
      <ViewAutoinstallFileDetailsEditButton
        fileName={autoinstallFiles[0].name}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: EDIT_BUTTON_TEXT }),
    );

    await userEvent.click(
      screen.getByRole("button", { name: CONTINUE_BUTTON_TEXT }),
    );

    await userEvent.click(
      screen.getByRole("button", { name: SUBMIT_BUTTON_TEXT }),
    );
  });

  it("should not show a modal if local storage is set", async () => {
    localStorage.setItem(LOCAL_STORAGE_ITEM, "true");

    renderWithProviders(
      <ViewAutoinstallFileDetailsEditButton
        fileName={autoinstallFiles[0].name}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: EDIT_BUTTON_TEXT }),
    );

    localStorage.clear();
  });

  it("should be able to cancel", async () => {
    renderWithProviders(
      <ViewAutoinstallFileDetailsEditButton
        fileName={autoinstallFiles[0].name}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: EDIT_BUTTON_TEXT }),
    );

    await userEvent.click(
      screen.getByRole("button", { name: CANCEL_BUTTON_TEXT }),
    );
  });
});
