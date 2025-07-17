import { windowsInstance } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import WindowsInstanceMakeCompliantModal from "./WindowsInstanceMakeCompliantModal";

describe("WindowsInstanceMakeCompliantModal", () => {
  it("should submit", async () => {
    renderWithProviders(
      <WindowsInstanceMakeCompliantModal
        close={() => undefined}
        instances={[windowsInstance]}
        isOpen
      />,
    );

    await userEvent.type(
      screen.getByRole("textbox"),
      `Make ${windowsInstance.title} compliant`,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Make compliant" }),
    );

    expect(
      screen.getByText(
        `You have successfully marked ${windowsInstance.title} to be compliant.`,
      ),
    ).toBeInTheDocument();
  });
});
