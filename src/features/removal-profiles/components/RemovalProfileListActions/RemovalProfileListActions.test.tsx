import { removalProfiles } from "@/tests/mocks/removalProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RemovalProfileListActions from "./RemovalProfileListActions";

const [profile] = removalProfiles;

describe("RemovalProfileListActions", () => {
  const user = userEvent.setup();

  it("shows all actions in dropdown", async () => {
    renderWithProviders(<RemovalProfileListActions profile={profile} />);

    await user.click(
      screen.getByRole("button", { name: `${profile.title} profile actions` }),
    );

    expect(
      screen.getByRole("button", { name: `Edit "${profile.title}" profile` }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: `Remove "${profile.title}" profile` }),
    ).toBeInTheDocument();
  });

  it("opens confirm modal and enables remove button", async () => {
    renderWithProviders(<RemovalProfileListActions profile={profile} />);

    await user.click(
      screen.getByRole("button", { name: `${profile.title} profile actions` }),
    );
    await user.click(
      screen.getByRole("button", { name: `Remove "${profile.title}" profile` }),
    );

    const modalDeleteBtn = screen.getByRole("button", { name: "Remove" });
    expect(modalDeleteBtn).toBeDisabled();

    await user.type(screen.getByRole("textbox"), `remove ${profile.name}`);
    expect(modalDeleteBtn).toBeEnabled();
  });
});
