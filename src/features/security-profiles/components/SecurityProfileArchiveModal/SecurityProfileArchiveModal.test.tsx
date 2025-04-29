import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SecurityProfileArchiveModal from "./SecurityProfileArchiveModal";

describe("SecurityProfileArchiveModal", () => {
  it("should render require a text entry", async () => {
    const [profile] = securityProfiles;

    renderWithProviders(<SecurityProfileArchiveModal profile={profile} />);

    expect(
      await screen.findByRole("button", { name: "Archive" }),
    ).toBeDisabled();

    await userEvent.type(
      screen.getByRole("textbox"),
      `archive ${profile.title}`,
    );

    expect(
      await screen.findByRole("button", { name: "Archive" }),
    ).toBeEnabled();

    await userEvent.click(
      await screen.findByRole("button", { name: "Archive" }),
    );
  });
});
