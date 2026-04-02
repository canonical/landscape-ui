import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfilesContainer from "./ProfilesContainer";
import { ProfileTypes } from "../../helpers";
import type { Profile } from "../../types";
import usePageParams from "@/hooks/usePageParams";
import useProfiles from "@/hooks/useProfiles";
import { profiles as profileList } from "@/tests/mocks/profiles";

vi.mock("@/hooks/usePageParams", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/useProfiles", () => ({
  default: vi.fn(),
}));

vi.mock("../ProfilesHeader", () => ({
  default: ({ type }: { type: string }) => <div>{`header:${type}`}</div>,
}));

vi.mock("../ProfilesList", () => ({
  default: ({ profiles }: { profiles: Profile[] }) => {
    if (profiles.length) {
      return <div>{`list:${profiles.length}`}</div>;
    }
    return <div>list:empty</div>;
  },
}));

vi.mock("../ProfilesEmptyState", () => ({
  default: ({ type }: { type: string }) => <div>{`empty:${type}`}</div>,
}));

vi.mock("@/components/layout/TablePagination", () => ({
  TablePagination: ({ totalItems }: { readonly totalItems: number }) => (
    <div>{`pagination:${totalItems}`}</div>
  ),
}));

const mockUsePageParams = vi.mocked(usePageParams);
const mockUseProfiles = vi.mocked(useProfiles);

const props = {
  type: ProfileTypes.security,
  profiles: profileList,
  isPending: false,
};

describe("ProfilesContainer", () => {
  beforeEach(() => {
    mockUsePageParams.mockReturnValue({
      search: "",
    } as unknown as ReturnType<typeof usePageParams>);

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

    expect(screen.getByText("empty:package")).toBeInTheDocument();
  });

  it("renders empty table when no profiles with search", () => {
    mockUsePageParams.mockReturnValue({
      search: "search",
    } as ReturnType<typeof usePageParams>);

    renderWithProviders(<ProfilesContainer {...props} profiles={[]} />);

    expect(screen.getByText("list:empty")).toBeInTheDocument();
  });

  it("renders header and list when data exists", () => {
    renderWithProviders(<ProfilesContainer {...props} />);

    expect(screen.getByText("header:security")).toBeInTheDocument();
    expect(screen.getByText("list:3")).toBeInTheDocument();
  });

  it("renders pagination when count exists", () => {
    renderWithProviders(<ProfilesContainer {...props} profilesCount={10} />);

    expect(screen.getByText("pagination:10")).toBeInTheDocument();
  });

  it("shows security profile limit notification when limit is reached", () => {
    mockUseProfiles.mockReturnValue({
      isProfileLimitReached: true,
    } as ReturnType<typeof useProfiles>);

    renderWithProviders(<ProfilesContainer {...props} profilesCount={5} />);

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
    } as ReturnType<typeof useProfiles>);

    renderWithProviders(
      <ProfilesContainer {...props} type={ProfileTypes.wsl} />,
    );

    expect(
      screen.getByText(
        /You've reached the limit of 3 active wsl profiles\. You must remove/i,
      ),
    ).toBeInTheDocument();
  });
});
