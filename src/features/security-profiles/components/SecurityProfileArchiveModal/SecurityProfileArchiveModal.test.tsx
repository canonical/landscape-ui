import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SecurityProfileArchiveModal from "./SecurityProfileArchiveModal";

describe("SecurityProfileArchiveModal", () => {
  it("should render require a text entry", async () => {
    const [profile] = securityProfiles;

    renderWithProviders(
      <SecurityProfileArchiveModal profile={profile} opened close={vi.fn()} />,
    );

    const archiveButton = await screen.findByRole("button", {
      name: "Archive",
    });

    expect(archiveButton).toHaveAttribute("aria-disabled", "true");

    await userEvent.type(
      screen.getByRole("textbox"),
      `archive ${profile.title}`,
    );

    expect(archiveButton).not.toHaveAttribute("aria-disabled");
    expect(archiveButton).toBeEnabled();

    await userEvent.click(
      await screen.findByRole("button", { name: "Archive" }),
    );
  });
});
