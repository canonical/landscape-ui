import { withProfilesContext } from "@/tests/mocks/profilesContext";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfilesContainer from "./ProfilesContainer";
import { ProfileTypes } from "../../helpers";
import { profiles as profileList } from "@/tests/mocks/profiles";
import type { ComponentProps } from "react";

const props: ComponentProps<typeof ProfilesContainer> = {
  type: ProfileTypes.usg,
  profiles: profileList,
  isPending: false,
};

describe("ProfilesContainer", () => {
  it("renders loading state when pending", () => {
    renderWithProviders(
      <ProfilesContainer {...props} isPending />,
      undefined,
      undefined,
      undefined,
      withProfilesContext(),
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders empty state when no profiles and no search", () => {
    renderWithProviders(
      <ProfilesContainer
        {...props}
        type={ProfileTypes.package}
        profiles={[]}
      />,
      undefined,
      undefined,
      undefined,
      withProfilesContext(),
    );

    expect(
      screen.getByText("You haven't added any package profiles yet."),
    ).toBeInTheDocument();
  });

  it("renders empty table when no profiles with search", () => {
    renderWithProviders(
      <ProfilesContainer {...props} profiles={[]} />,
      undefined,
      "/?search=search",
      undefined,
      withProfilesContext(),
    );

    expect(
      screen.getByText(
        "No USG profiles found according to your search parameters.",
      ),
    ).toBeInTheDocument();
  });

  it("renders header and list when data exists", async () => {
    renderWithProviders(
      <ProfilesContainer {...props} />,
      undefined,
      undefined,
      undefined,
      withProfilesContext(),
    );

    expect(await screen.findByRole("searchbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: 'Open "Profile One" profile details',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Profile Two")).toBeInTheDocument();
    expect(screen.getByText("Profile Three")).toBeInTheDocument();
  });

  it("renders pagination when count exists", () => {
    renderWithProviders(
      <ProfilesContainer {...props} profilesCount={10} />,
      undefined,
      undefined,
      undefined,
      withProfilesContext(),
    );

    expect(screen.getByText("Showing 3 of 10 results")).toBeInTheDocument();
  });

  it("shows usg profile limit notification when limit is reached", () => {
    renderWithProviders(
      <ProfilesContainer {...props} />,
      undefined,
      undefined,
      undefined,
      withProfilesContext({
        isProfileLimitReached: true,
        profileLimit: 5,
      }),
    );

    expect(screen.getByText("Profile limit reached:")).toBeInTheDocument();
    expect(
      screen.getByText(
        /You've reached the limit of 5 active USG profiles\. You must archive/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows wsl profile limit notification when limit is reached", () => {
    renderWithProviders(
      <ProfilesContainer {...props} type={ProfileTypes.wsl} />,
      undefined,
      undefined,
      undefined,
      withProfilesContext({
        isProfileLimitReached: true,
        profileLimit: 100,
      }),
    );

    expect(
      screen.getByText(
        /You've reached the limit of 100 active wsl profiles\. You must remove/i,
      ),
    ).toBeInTheDocument();
  });
});
