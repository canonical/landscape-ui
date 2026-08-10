import { windowsInstance } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import WindowsInstanceActions from "./WindowsInstanceActions";

describe("WindowsInstanceActions", () => {
  it("opens the make-compliant modal from the actions menu", async () => {
    renderWithProviders(<WindowsInstanceActions instance={windowsInstance} />);

    await userEvent.click(
      screen.getByRole("button", { name: `${windowsInstance.title} actions` }),
    );
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Make compliant" }),
    );

    expect(
      await screen.findByText(`Make ${windowsInstance.title} compliant`),
    ).toBeInTheDocument();
  });
});
