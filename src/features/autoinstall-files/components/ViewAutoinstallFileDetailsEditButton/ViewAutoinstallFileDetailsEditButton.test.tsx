import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import ViewAutoinstallFileDetailsEditButton from ".";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CANCEL_BUTTON_TEXT,
  CONTINUE_BUTTON_TEXT,
  EDIT_BUTTON_TEXT,
  LOCAL_STORAGE_ITEM,
} from "./constants";

describe("ViewAutoinstallFileDetailsEditButton", () => {
  it("should show a modal once", async () => {
    renderWithProviders(<ViewAutoinstallFileDetailsEditButton />);

    await userEvent.click(
      screen.getByRole("button", { name: EDIT_BUTTON_TEXT }),
    );

    await userEvent.click(screen.getByRole("checkbox"));

    await userEvent.click(
      screen.getByRole("button", { name: CONTINUE_BUTTON_TEXT }),
    );

    await userEvent.click(
      screen.getByRole("button", { name: EDIT_BUTTON_TEXT }),
    );

    expect(
      screen.queryByRole("button", { name: CANCEL_BUTTON_TEXT }),
    ).not.toBeInTheDocument();

    localStorage.clear();
  });

  it("should show a modal every time", async () => {
    renderWithProviders(<ViewAutoinstallFileDetailsEditButton />);

    await userEvent.click(
      screen.getByRole("button", { name: EDIT_BUTTON_TEXT }),
    );

    await userEvent.click(
      screen.getByRole("button", { name: CONTINUE_BUTTON_TEXT }),
    );

    await userEvent.click(
      screen.getByRole("button", { name: EDIT_BUTTON_TEXT }),
    );

    await userEvent.click(
      screen.getByRole("button", { name: CANCEL_BUTTON_TEXT }),
    );
  });

  it("should not show a modal if local storage is set", async () => {
    localStorage.setItem(LOCAL_STORAGE_ITEM, "true");
    renderWithProviders(<ViewAutoinstallFileDetailsEditButton />);
    localStorage.clear();
  });
});
