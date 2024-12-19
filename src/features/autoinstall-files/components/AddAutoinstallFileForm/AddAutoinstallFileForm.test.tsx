import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AddAutoinstallFileForm from ".";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NOTIFICATION_MESSAGE, SUBMIT_BUTTON_TEXT } from "./constants";
import { createNotificationTitle } from "./helpers";

describe("AddAutoinstallFileForm", () => {
  it("should require a file name", async () => {
    renderWithProviders(<AddAutoinstallFileForm />);
    await userEvent.clear(screen.getByRole("textbox"));
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.queryByText(NOTIFICATION_MESSAGE)).not.toBeInTheDocument();
  });

  it("should submit", async () => {
    renderWithProviders(<AddAutoinstallFileForm />);

    const testFilename = "test.yaml";

    await userEvent.clear(screen.getByRole("textbox"));
    await userEvent.type(screen.getByRole("textbox"), testFilename);
    await userEvent.click(
      screen.getByRole("button", { name: SUBMIT_BUTTON_TEXT }),
    );

    expect(screen.queryByText(NOTIFICATION_MESSAGE)).toBeInTheDocument();
    expect(
      screen.queryByText(createNotificationTitle(testFilename)),
    ).toBeInTheDocument();
  });
});
