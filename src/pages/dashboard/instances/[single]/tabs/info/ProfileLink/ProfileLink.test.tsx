import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Profile } from "@/types/Profile";
import { renderWithProviders } from "@/tests/render";
import ProfileLink from "./ProfileLink";

const profile: Profile = {
  id: 1,
  name: "my-profile",
  title: "My Profile",
  type: "package",
};

describe("ProfileLink", () => {
  it("renders a link with profile title", () => {
    renderWithProviders(<ProfileLink profile={profile} />);

    expect(
      screen.getByRole("link", { name: "My Profile" }),
    ).toBeInTheDocument();
  });
});
