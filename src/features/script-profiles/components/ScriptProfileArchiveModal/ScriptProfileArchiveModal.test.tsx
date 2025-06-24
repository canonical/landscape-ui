import { renderWithProviders } from "@/tests/render";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { describe, it } from "vitest";
import ScriptProfileArchiveModal from "./ScriptProfileArchiveModal";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const [profile] = scriptProfiles;

describe("ScriptProfileArchiveModal", () => {
  const user = userEvent.setup();

  it("correctly renders modal", async () => {
    renderWithProviders(
      <ScriptProfileArchiveModal profile={profile} removeProfile={vi.fn()} />,
    );

    const modalTitle = screen.getByText(`Archive ${profile.title}`);
    const modalDescription = screen.getByText(
      /archiving the script will prevent it from running in the future/i,
    );

    expect(modalTitle).toBeVisible();
    expect(modalDescription).toBeVisible();
  });

  it("shows toast confirmation on successful archiving", async () => {
    renderWithProviders(
      <ScriptProfileArchiveModal profile={profile} removeProfile={vi.fn()} />,
    );

    const confirmButton = screen.getByRole("button", {
      name: "Archive",
    });

    expect(confirmButton).toBeDisabled();

    const textInput = screen.getByRole("textbox");
    await user.type(textInput, `archive ${profile.title}`);

    expect(confirmButton).toBeEnabled();
  });
});
