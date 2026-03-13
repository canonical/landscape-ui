import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RebootProfilesListActions from "./RebootProfilesListActions";

const [profile] = rebootProfiles;

describe("RebootProfilesListActions", () => {
  const user = userEvent.setup();

  it("renders all actions", async () => {
    renderWithProviders(<RebootProfilesListActions profile={profile} />);

    await user.click(
      screen.getByRole("button", { name: `${profile.title} profile actions` }),
    );

    expect(
      screen.getByRole("menuitem", { name: `Edit "${profile.title}" profile` }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", {
        name: `Duplicate "${profile.title}" profile`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", {
        name: `Remove "${profile.title}" profile`,
      }),
    ).toBeInTheDocument();
  });
});
