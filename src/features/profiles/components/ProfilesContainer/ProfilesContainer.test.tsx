import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfilesContainer from "./ProfilesContainer";
import { ProfileTypes } from "../../helpers";
import useProfiles from "@/hooks/useProfiles";
import { profiles as profileList } from "@/tests/mocks/profiles";
import type { ComponentProps } from "react";

vi.mock("@/hooks/useProfiles", () => ({
  default: vi.fn(),
}));

const mockUseProfiles = vi.mocked(useProfiles);

const props: ComponentProps<typeof ProfilesContainer> = {
  type: ProfileTypes.security,
  profiles: profileList,
  isPending: false,
};

describe("ProfilesContainer", () => {
  beforeEach(() => {
    mockUseProfiles.mockReturnValue({
      isProfileLimitReached: false,
    } as unknown as ReturnType<typeof useProfiles>);
  });

  it("renders loading state when pending", () => {
    renderWithProviders(<ProfilesContainer {...props} isPending />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders empty state when no profiles and no search", () => {
    renderWithProviders(
      <ProfilesContainer
        {...props}
        type={ProfileTypes.package}
        profiles={[]}
      />,
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
    );

    expect(
      screen.getByText(
        "No security profiles found according to your search parameters.",
      ),
    ).toBeInTheDocument();
  });

  it("renders header and list when data exists", async () => {
    renderWithProviders(<ProfilesContainer {...props} />);

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
    renderWithProviders(<ProfilesContainer {...props} profilesCount={10} />);

    expect(screen.getByText("Showing 3 of 10 results")).toBeInTheDocument();
  });

  it("shows security profile limit notification when limit is reached", () => {
    mockUseProfiles.mockReturnValue({
      isProfileLimitReached: true,
      profileLimit: 5,
    } as ReturnType<typeof useProfiles>);

    renderWithProviders(<ProfilesContainer {...props} />);

    expect(screen.getByText("Profile limit reached:")).toBeInTheDocument();
    expect(
      screen.getByText(
        /You've reached the limit of 5 active security profiles\. You must archive/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows wsl profile limit notification when limit is reached", () => {
    mockUseProfiles.mockReturnValue({
      isProfileLimitReached: true,
      profileLimit: 100,
    } as ReturnType<typeof useProfiles>);

    renderWithProviders(
      <ProfilesContainer {...props} type={ProfileTypes.wsl} />,
    );

    expect(
      screen.getByText(
        /You've reached the limit of 100 active wsl profiles\. You must remove/i,
      ),
    ).toBeInTheDocument();
  });
});
